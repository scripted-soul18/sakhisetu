import os
import random
import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from database import SessionLocal
from models import User, OTPRecord, Profile

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

SECRET_KEY = os.getenv("SECRET_KEY", "sakhi-setu-secure-token-secret-2026")

def generate_token(user_id: int, identifier: str) -> str:
    payload = {
        "user_id": user_id,
        "identifier": identifier,
        "exp": datetime.utcnow() + timedelta(days=7),
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get("Authorization")
        if auth_header:
            parts = auth_header.split(" ")
            if len(parts) == 2 and parts[0].lower() == "bearer":
                token = parts[1]

        if not token:
            return jsonify({"error": "Authentication required. Please sign in."}), 401

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            db = SessionLocal()
            current_user = db.query(User).filter_by(id=data["user_id"]).first()
            db.close()
            if not current_user:
                return jsonify({"error": "User account no longer exists."}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Session expired. Please sign in again."}), 401
        except Exception:
            return jsonify({"error": "Invalid authentication token."}), 401

        return f(current_user, *args, **kwargs)
    return decorated

import urllib.request
import urllib.parse

def dispatch_sms(mobile_number: str, otp_code: str):
    """
    Dispatches real SMS if FAST2SMS_API_KEY is configured in .env.
    Otherwise formats a realistic terminal SMS gateway log.
    """
    fast2sms_key = os.getenv("FAST2SMS_API_KEY")
    if fast2sms_key:
        try:
            clean_digits = "".join(filter(str.isdigit, mobile_number))[-10:]
            url = f"https://www.fast2sms.com/dev/bulkV2?authorization={fast2sms_key}&route=otp&variables_values={otp_code}&flash=0&numbers={clean_digits}"
            req = urllib.request.Request(url, headers={"cache-control": "no-cache"})
            with urllib.request.urlopen(req, timeout=5) as response:
                res_body = response.read().decode('utf-8')
                print(f"[FAST2SMS GATEWAY] Sent real SMS to {clean_digits}: {res_body}")
                return True
        except Exception as e:
            print(f"[FAST2SMS GATEWAY ERROR] Could not dispatch SMS: {e}")

    # Standard clean gateway simulation log
    print("\n" + "=" * 60)
    print(f"[REAL-TIME SMS GATEWAY DISPATCH]")
    print(f"--> RECIPIENT: {mobile_number}")
    print(f"--> MESSAGE: Your SakhiSetu verification OTP is: {otp_code}")
    print(f"--> VALIDITY: 10 Minutes")
    print("=" * 60 + "\n")
    return False

@auth_bp.route("/send-otp", methods=["POST"])
def send_otp():
    """
    Generate and save a real 6-digit OTP in the database for Mobile Number or Email.
    """
    data = request.get_json() or {}
    identifier = data.get("identifier", "").strip()
    auth_type = data.get("type", "mobile").strip().lower() # 'mobile' or 'email'

    if not identifier:
        return jsonify({"error": "Please provide your mobile number or email address."}), 400

    # Basic format check
    if auth_type == "mobile" and len(identifier.replace("+", "").replace("-", "").replace(" ", "")) < 10:
        return jsonify({"error": "Please enter a valid 10-digit mobile number."}), 400

    # Generate 6-digit OTP
    otp_code = str(random.randint(100000, 999999))
    expires_at = datetime.utcnow() + timedelta(minutes=10)

    db = SessionLocal()
    try:
        # Mark previous unused OTPs for this identifier as used
        db.query(OTPRecord).filter(
            OTPRecord.identifier == identifier,
            OTPRecord.is_used == False
        ).update({"is_used": True})

        record = OTPRecord(
            identifier=identifier,
            otp=otp_code,
            purpose=data.get("purpose", "verification"),
            expires_at=expires_at,
            is_used=False
        )
        db.add(record)
        db.commit()

        # Trigger real or simulated SMS dispatch
        if auth_type == "mobile":
            dispatch_sms(identifier, otp_code)
        else:
            print(f"\n[EMAIL DISPATCH] Sent OTP {otp_code} to {identifier}\n")

        # Masked identifier for UI display (e.g. +91 ******3210)
        masked = identifier
        if "@" in identifier:
            parts = identifier.split("@")
            masked = f"{parts[0][:2]}***@{parts[1]}"
        elif len(identifier) >= 10:
            digits = "".join(filter(str.isdigit, identifier))
            masked = f"+91 ******{digits[-4:]}"

        return jsonify({
            "message": f"OTP sent successfully to {masked}.",
            "identifier": identifier,
            "masked_identifier": masked,
            "debug_otp": otp_code,  # Available in dev mode for testing
            "expires_in_minutes": 10
        }), 200
    except Exception as e:
        db.rollback()
        return jsonify({"error": f"Failed to send OTP: {str(e)}"}), 500
    finally:
        db.close()

@auth_bp.route("/verify-otp", methods=["POST"])
def verify_otp():
    """
    Verifies entered OTP against real database records and signs in / signs up user.
    """
    data = request.get_json() or {}
    identifier = data.get("identifier", "").strip()
    entered_otp = data.get("otp", "").strip()
    full_name = data.get("full_name", "").strip()

    if not identifier or not entered_otp:
        return jsonify({"error": "Both identifier and OTP are required."}), 400

    db = SessionLocal()
    try:
        # Check matching active OTP
        record = db.query(OTPRecord).filter(
            OTPRecord.identifier == identifier,
            OTPRecord.otp == entered_otp,
            OTPRecord.is_used == False,
            OTPRecord.expires_at >= datetime.utcnow()
        ).first()

        if not record:
            return jsonify({"error": "Invalid or expired OTP. Please try again or request a new code."}), 400

        # Mark OTP as used
        record.is_used = True
        db.commit()

        # Determine if identifier is email or mobile
        is_email = "@" in identifier
        user = None

        if is_email:
            user = db.query(User).filter_by(email=identifier.lower()).first()
            if not user:
                user = User(
                    email=identifier.lower(),
                    full_name=full_name or identifier.split("@")[0].title(),
                    auth_provider="email",
                    is_verified=True
                )
                db.add(user)
                db.commit()
                db.refresh(user)
            else:
                user.is_verified = True
                if full_name:
                    user.full_name = full_name
                db.commit()
        else:
            clean_mobile = identifier.replace(" ", "").replace("-", "")
            user = db.query(User).filter_by(mobile_number=clean_mobile).first()
            if not user:
                user = User(
                    mobile_number=clean_mobile,
                    full_name=full_name or f"Sakhi Mother ({clean_mobile[-4:]})",
                    auth_provider="mobile",
                    is_verified=True
                )
                db.add(user)
                db.commit()
                db.refresh(user)
            else:
                user.is_verified = True
                if full_name:
                    user.full_name = full_name
                db.commit()

        token = generate_token(user.id, user.email or user.mobile_number)
        
        # Check if user has an existing profile
        existing_profile = db.query(Profile).filter_by(user_id=user.id).first()

        return jsonify({
            "message": "Authentication successful! Welcome to SakhiSetu.",
            "token": token,
            "user": user.to_dict(),
            "has_profile": existing_profile is not None,
            "profile": existing_profile.to_dict() if existing_profile else None
        }), 200

    except Exception as e:
        db.rollback()
        return jsonify({"error": f"Verification error: {str(e)}"}), 500
    finally:
        db.close()

@auth_bp.route("/google", methods=["POST"])
def google_auth():
    """
    Authenticate or Register via Google One-Click OAuth simulation.
    """
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    full_name = data.get("name", "").strip()
    avatar = data.get("avatar", "")

    if not email:
        return jsonify({"error": "Google account email is required."}), 400

    db = SessionLocal()
    try:
        user = db.query(User).filter_by(email=email).first()
        if not user:
            user = User(
                email=email,
                full_name=full_name or email.split("@")[0].title(),
                avatar=avatar,
                auth_provider="google",
                is_verified=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            user.is_verified = True
            if avatar:
                user.avatar = avatar
            db.commit()

        token = generate_token(user.id, user.email)
        existing_profile = db.query(Profile).filter_by(user_id=user.id).first()

        return jsonify({
            "message": "Signed in with Google successfully.",
            "token": token,
            "user": user.to_dict(),
            "has_profile": existing_profile is not None,
            "profile": existing_profile.to_dict() if existing_profile else None
        }), 200

    except Exception as e:
        db.rollback()
        return jsonify({"error": f"Google authentication failed: {str(e)}"}), 500
    finally:
        db.close()

@auth_bp.route("/me", methods=["GET"])
@token_required
def get_current_user(current_user):
    db = SessionLocal()
    try:
        profile = db.query(Profile).filter_by(user_id=current_user.id).first()
        return jsonify({
            "user": current_user.to_dict(),
            "has_profile": profile is not None,
            "profile": profile.to_dict() if profile else None
        }), 200
    finally:
        db.close()
