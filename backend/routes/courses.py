from flask import Blueprint, request, jsonify
from database import SessionLocal
from models import Course

courses_bp = Blueprint("courses", __name__, url_prefix="/api/courses")

@courses_bp.route("", methods=["GET"])
def get_courses():
    """Retrieve courses with optional category & search filter."""
    category = request.args.get("category", "").strip().lower()
    search = request.args.get("search", "").strip().lower()

    db = SessionLocal()
    try:
        courses = db.query(Course).all()
        results = []

        for course in courses:
            if category and category != "all" and category not in course.skill_category.lower():
                continue

            if search:
                if not (search in course.name.lower() or
                        search in course.description.lower() or
                        search in course.provider.lower() or
                        search in course.skill_category.lower()):
                    continue

            results.append(course.to_dict())

        return jsonify({
            "count": len(results),
            "courses": results
        }), 200
    finally:
        db.close()

@courses_bp.route("/<int:course_id>", methods=["GET"])
def get_course(course_id):
    """Retrieve single course by ID."""
    db = SessionLocal()
    try:
        course = db.query(Course).filter_by(id=course_id).first()
        if not course:
            return jsonify({"error": "Course not found"}), 404
        return jsonify({"course": course.to_dict()}), 200
    finally:
        db.close()
