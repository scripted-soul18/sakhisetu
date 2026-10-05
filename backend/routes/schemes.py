from flask import Blueprint, request, jsonify
from database import SessionLocal
from models import Scheme

schemes_bp = Blueprint("schemes", __name__, url_prefix="/api/schemes")

@schemes_bp.route("", methods=["GET"])
def get_schemes():
    """Retrieve government schemes with indicative eligibility and official links."""
    category = request.args.get("category", "").strip().lower()
    search = request.args.get("search", "").strip().lower()

    db = SessionLocal()
    try:
        schemes = db.query(Scheme).all()
        results = []

        for scheme in schemes:
            if category and category != "all" and category not in scheme.category.lower():
                continue

            if search:
                if not (search in scheme.name.lower() or
                        search in scheme.description.lower() or
                        search in scheme.who_it_helps.lower() or
                        search in scheme.eligibility.lower()):
                    continue

            results.append(scheme.to_dict())

        return jsonify({
            "count": len(results),
            "disclaimer": "Eligibility shown here is indicative. Please verify current eligibility and requirements on the official government website.",
            "schemes": results
        }), 200
    finally:
        db.close()

@schemes_bp.route("/<int:scheme_id>", methods=["GET"])
def get_scheme(scheme_id):
    """Retrieve single government scheme by ID."""
    db = SessionLocal()
    try:
        scheme = db.query(Scheme).filter_by(id=scheme_id).first()
        if not scheme:
            return jsonify({"error": "Scheme not found"}), 404
        return jsonify({"scheme": scheme.to_dict()}), 200
    finally:
        db.close()
