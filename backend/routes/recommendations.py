import json
from flask import Blueprint, request, jsonify
from database import SessionLocal
from models import Profile, Job, Course, Scheme, ChildcareCenter, RecommendationRecord
from matching_engine import (
    rank_jobs_for_profile,
    recommend_courses_for_profile,
    recommend_schemes_for_profile,
    rank_childcare_for_profile,
    generate_career_roadmap
)

recommendations_bp = Blueprint("recommendations", __name__, url_prefix="/api/recommendations")

def compute_all_recommendations(profile_dict: dict, db):
    """Core helper to run the rule-based matching engine against all database resources."""
    # 1. Fetch active jobs
    jobs = [j.to_dict() for j in db.query(Job).filter_by(is_active=True).all()]
    ranked_jobs = rank_jobs_for_profile(profile_dict, jobs)

    # Collect missing skills from top matches to guide course recommendations
    missing_skills = []
    top_matches = ranked_jobs[:5]
    for j in top_matches:
        for m in j.get("missing_skills", []):
            if m not in missing_skills:
                missing_skills.append(m)

    # 2. Fetch and recommend courses
    courses = [c.to_dict() for c in db.query(Course).all()]
    recommended_courses = recommend_courses_for_profile(profile_dict, courses, missing_skills)

    # 3. Fetch and rank government schemes
    schemes = [s.to_dict() for s in db.query(Scheme).all()]
    recommended_schemes = recommend_schemes_for_profile(profile_dict, schemes)

    # 4. Fetch and rank childcare & support centers
    centers = [cc.to_dict() for cc in db.query(ChildcareCenter).all()]
    ranked_childcare = rank_childcare_for_profile(profile_dict, centers)

    # 5. Career Roadmap
    top_job = ranked_jobs[0] if ranked_jobs else None
    career_roadmap = generate_career_roadmap(profile_dict, top_job)

    # Profile statistics
    highest_match = top_job["match_percentage"] if top_job else 0
    total_eligible_jobs = len([j for j in ranked_jobs if j["match_percentage"] >= 60])

    return {
        "profile": profile_dict,
        "summary": {
            "highest_match_score": highest_match,
            "total_suitable_jobs": total_eligible_jobs,
            "top_career_match": top_job["title"] if top_job else "Career Opportunities",
            "recommended_hours": profile_dict.get("available_hours", 4)
        },
        "ranked_jobs": ranked_jobs,
        "recommended_courses": recommended_courses,
        "recommended_schemes": recommended_schemes,
        "childcare_centers": ranked_childcare,
        "career_roadmap": career_roadmap
    }

@recommendations_bp.route("", methods=["POST"])
def get_recommendations_by_data():
    """
    Accepts either { "profile_id": 1 } or full profile payload.
    Calculates rule-based recommendations on demand.
    """
    data = request.get_json() or {}
    db = SessionLocal()
    try:
        profile_dict = None

        profile_id = data.get("profile_id")
        if profile_id:
            profile = db.query(Profile).filter_by(id=profile_id).first()
            if profile:
                profile_dict = profile.to_dict()

        if not profile_dict:
            # Use data passed in request body directly
            if not data.get("full_name") or not data.get("city"):
                return jsonify({"error": "Valid profile data or profile_id is required."}), 400
            
            # Normalize skills if string
            skills = data.get("skills", [])
            if isinstance(skills, str):
                skills = [s.strip() for s in skills.split(",") if s.strip()]

            profile_dict = {
                "id": data.get("id", 0),
                "full_name": data.get("full_name"),
                "age": int(data.get("age", 30)),
                "city": data.get("city"),
                "state": data.get("state", "State"),
                "education_level": data.get("education_level", "High School"),
                "qualification": data.get("qualification", ""),
                "skills": skills,
                "years_of_experience": float(data.get("years_of_experience", 0.0)),
                "preferred_job_type": data.get("preferred_job_type", "Remote"),
                "available_hours": int(data.get("available_hours", 4)),
                "career_preference": data.get("career_preference", "Data Entry"),
                "number_of_children": int(data.get("number_of_children", 1)),
                "child_age": int(data.get("child_age", 5)),
                "monthly_income": data.get("monthly_income"),
                "preferred_salary": data.get("preferred_salary")
            }

        result = compute_all_recommendations(profile_dict, db)

        # Store recommendation record if profile exists in DB
        if profile_dict.get("id"):
            try:
                rec_record = RecommendationRecord(
                    profile_id=profile_dict["id"],
                    recommendations_data=json.dumps(result)
                )
                db.add(rec_record)
                db.commit()
            except Exception:
                db.rollback()

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": "Failed to calculate recommendations: " + str(e)}), 500
    finally:
        db.close()

@recommendations_bp.route("/<int:profile_id>", methods=["GET"])
def get_recommendations_for_profile(profile_id):
    """Retrieve recommendations for a registered profile ID."""
    db = SessionLocal()
    try:
        profile = db.query(Profile).filter_by(id=profile_id).first()
        if not profile:
            return jsonify({"error": f"Profile with id {profile_id} not found."}), 404

        result = compute_all_recommendations(profile.to_dict(), db)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": "Failed to generate recommendations: " + str(e)}), 500
    finally:
        db.close()
