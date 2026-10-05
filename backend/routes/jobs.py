from flask import Blueprint, request, jsonify
from database import SessionLocal
from models import Job

jobs_bp = Blueprint("jobs", __name__, url_prefix="/api/jobs")

@jobs_bp.route("", methods=["GET"])
def get_jobs():
    """Retrieve jobs with dynamic search & filtering."""
    search = request.args.get("search", "").strip().lower()
    location = request.args.get("location", "").strip().lower()
    job_type = request.args.get("job_type", "").strip().lower()
    hours = request.args.get("hours", type=int)
    category = request.args.get("category", "").strip().lower()

    db = SessionLocal()
    try:
        query = db.query(Job).filter(Job.is_active == True)

        jobs = query.all()
        results = []

        for job in jobs:
            # Search filter (title, organization, description, skills)
            if search:
                skills_match = any(search in s.lower() for s in job.get_skills_list())
                if not (search in job.title.lower() or
                        search in job.organization.lower() or
                        search in job.description.lower() or
                        skills_match):
                    continue

            # Location filter
            if location and location not in job.location.lower():
                continue

            # Job Type filter (Remote, On-site, Hybrid)
            if job_type and job_type != "all" and job_type not in job.job_type.lower():
                continue

            # Available hours filter (jobs requiring <= specified hours)
            if hours and job.required_hours > hours:
                continue

            # Category filter
            if category and category != "all" and category not in job.career_category.lower():
                continue

            results.append(job.to_dict())

        return jsonify({
            "count": len(results),
            "jobs": results
        }), 200
    finally:
        db.close()

@jobs_bp.route("/<int:job_id>", methods=["GET"])
def get_job(job_id):
    """Retrieve single job by ID."""
    db = SessionLocal()
    try:
        job = db.query(Job).filter_by(id=job_id).first()
        if not job:
            return jsonify({"error": "Job not found"}), 404
        return jsonify({"job": job.to_dict()}), 200
    finally:
        db.close()
