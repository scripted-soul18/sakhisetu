import json
from flask import Blueprint, request, jsonify
from database import SessionLocal
from models import Profile, User

profile_bp = Blueprint("profile", __name__, url_prefix="/api/profile")

@profile_bp.route("", methods=["POST"])
def save_profile():
    """Create or update a mother's profile."""
    data = request.get_json() or {}

    # Validation
    full_name = data.get("full_name", "").strip()
    if not full_name:
        return jsonify({"error": "Full name is required."}), 400

    try:
        age = int(data.get("age", 25))
        child_age = int(data.get("child_age", 4))
        available_hours = int(data.get("available_hours", 4))
        number_of_children = int(data.get("number_of_children", 1))
        years_of_experience = float(data.get("years_of_experience", 0.0))
    except (ValueError, TypeError):
        return jsonify({"error": "Please provide valid numbers for age, hours, children, or experience."}), 400

    city = data.get("city", "").strip()
    state = data.get("state", "").strip()
    education_level = data.get("education_level", "").strip()
    career_preference = data.get("career_preference", "").strip()
    preferred_job_type = data.get("preferred_job_type", "Remote").strip()

    if not city or not state:
        return jsonify({"error": "City and State are required."}), 400
    if not education_level:
        return jsonify({"error": "Education level is required."}), 400
    if not career_preference:
        return jsonify({"error": "Career preference is required."}), 400

    # Skills formatting
    skills_raw = data.get("skills", [])
    if isinstance(skills_raw, list):
        skills_str = json.dumps([s.strip() for s in skills_raw if s.strip()])
    else:
        skills_list = [s.strip() for s in str(skills_raw).split(",") if s.strip()]
        skills_str = json.dumps(skills_list)

    user_id = data.get("user_id")

    db = SessionLocal()
    try:
        profile_id = data.get("id")
        profile = None
        if profile_id:
            profile = db.query(Profile).filter_by(id=profile_id).first()

        if profile:
            # Update existing
            profile.full_name = full_name
            profile.age = age
            profile.city = city
            profile.state = state
            profile.education_level = education_level
            profile.qualification = data.get("qualification", "")
            profile.skills = skills_str
            profile.years_of_experience = years_of_experience
            profile.preferred_job_type = preferred_job_type
            profile.available_hours = available_hours
            profile.career_preference = career_preference
            profile.number_of_children = number_of_children
            profile.child_age = child_age
            profile.monthly_income = data.get("monthly_income")
            profile.preferred_salary = data.get("preferred_salary")
            if user_id:
                profile.user_id = user_id
        else:
            # Create new profile
            profile = Profile(
                user_id=user_id,
                full_name=full_name,
                age=age,
                city=city,
                state=state,
                education_level=education_level,
                qualification=data.get("qualification", ""),
                skills=skills_str,
                years_of_experience=years_of_experience,
                preferred_job_type=preferred_job_type,
                available_hours=available_hours,
                career_preference=career_preference,
                number_of_children=number_of_children,
                child_age=child_age,
                monthly_income=data.get("monthly_income"),
                preferred_salary=data.get("preferred_salary")
            )
            db.add(profile)

        db.commit()
        db.refresh(profile)
        return jsonify({
            "message": "Profile saved successfully.",
            "profile": profile.to_dict()
        }), 201
    except Exception as e:
        db.rollback()
        return jsonify({"error": "Failed to save profile: " + str(e)}), 500
    finally:
        db.close()

@profile_bp.route("/<int:profile_id>", methods=["GET"])
def get_profile(profile_id):
    """Retrieve profile by ID."""
    db = SessionLocal()
    try:
        profile = db.query(Profile).filter_by(id=profile_id).first()
        if not profile:
            return jsonify({"error": "Profile not found."}), 404
        return jsonify({"profile": profile.to_dict()}), 200
    finally:
        db.close()

@profile_bp.route("/demo", methods=["GET"])
def get_demo_profile():
    """Retrieve or generate standard demo profile for Priya Sharma."""
    db = SessionLocal()
    try:
        profile = db.query(Profile).filter_by(full_name="Priya Sharma").first()
        if profile:
            return jsonify({"profile": profile.to_dict()}), 200

        # Fallback if DB wasn't seeded
        demo_data = {
            "id": 1,
            "full_name": "Priya Sharma",
            "age": 32,
            "city": "Pune",
            "state": "Maharashtra",
            "education_level": "Bachelor's Degree",
            "qualification": "B.Com (Commerce)",
            "skills": ["MS Office", "Excel", "Communication", "Data Entry"],
            "years_of_experience": 2.0,
            "preferred_job_type": "Remote",
            "available_hours": 4,
            "career_preference": "Data Entry",
            "number_of_children": 1,
            "child_age": 6,
            "monthly_income": "Below ₹15,000",
            "preferred_salary": "₹15,000 - ₹20,000"
        }
        return jsonify({"profile": demo_data}), 200
    finally:
        db.close()
