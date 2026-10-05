from flask import Blueprint, request, jsonify
from database import SessionLocal
from models import ChildcareCenter

childcare_bp = Blueprint("childcare", __name__, url_prefix="/api/childcare")

@childcare_bp.route("", methods=["GET"])
def get_childcare():
    """Retrieve childcare and women support centers."""
    location = request.args.get("location", "").strip().lower()
    search = request.args.get("search", "").strip().lower()

    db = SessionLocal()
    try:
        centers = db.query(ChildcareCenter).all()
        results = []

        for c in centers:
            if location and location not in c.location.lower() and location not in c.address.lower():
                continue

            if search:
                if not (search in c.name.lower() or
                        search in c.location.lower() or
                        search in c.address.lower() or
                        search in c.services.lower()):
                    continue

            results.append(c.to_dict())

        return jsonify({
            "count": len(results),
            "centers": results
        }), 200
    finally:
        db.close()

@childcare_bp.route("/<int:center_id>", methods=["GET"])
def get_childcare_center(center_id):
    """Retrieve single childcare center by ID."""
    db = SessionLocal()
    try:
        center = db.query(ChildcareCenter).filter_by(id=center_id).first()
        if not center:
            return jsonify({"error": "Childcare center not found"}), 404
        return jsonify({"center": center.to_dict()}), 200
    finally:
        db.close()
