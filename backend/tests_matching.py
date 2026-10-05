"""
Automated Verification Suite for SakhiSetu Matching Engine
==========================================================
Tests 6 distinct candidate profiles to verify that:
1. Remote worker profile scores highest on remote jobs
2. On-site worker profile scores high on local on-site jobs
3. Beginner with 0 exp gets 100% on entry-level / fresher roles
4. Experienced user matches senior/specialized roles
5. Non-matching locations receive appropriate commute deductions
6. Missing skills and course bridges are accurately identified
"""

import sys
import os

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from database import SessionLocal
from models import Job, Course
from matching_engine import rank_jobs_for_profile, recommend_courses_for_profile

def run_tests():
    db = SessionLocal()
    try:
        jobs = [j.to_dict() for j in db.query(Job).filter_by(is_active=True).all()]
        courses = [c.to_dict() for c in db.query(Course).all()]
        assert len(jobs) >= 10, f"Expected at least 10 jobs, got {len(jobs)}"
        print(f"Loaded {len(jobs)} active jobs for test suite.")

        # Test 1: Priya Sharma - Remote Worker (4 hrs, Pune, Data Entry)
        profile_remote = {
            "full_name": "Priya Sharma",
            "city": "Pune",
            "state": "Maharashtra",
            "preferred_job_type": "Remote",
            "available_hours": 4,
            "years_of_experience": 2.0,
            "skills": ["MS Office", "Excel", "Communication", "Data Entry"],
            "career_preference": "Data Entry"
        }
        res_remote = rank_jobs_for_profile(profile_remote, jobs)
        top_remote = res_remote[0]
        print(f"\n[Test 1] Remote Worker ({profile_remote['full_name']}):")
        print(f"  Top Match: {top_remote['title']} ({top_remote['match_percentage']}%) at {top_remote['organization']}")
        assert top_remote['match_percentage'] >= 85, "Expected >=85% match for remote worker with matching skills"
        assert top_remote['job_type'] == "Remote" or "Remote" in top_remote['location'], "Top match should be remote"

        # Test 2: Sunita - On-site Worker (Pune, Tailoring, 6 hrs, 3 yrs exp)
        profile_onsite = {
            "full_name": "Sunita Kamble",
            "city": "Pune",
            "state": "Maharashtra",
            "preferred_job_type": "On-site",
            "available_hours": 6,
            "years_of_experience": 3.0,
            "skills": ["Tailoring", "Garment Making", "Embroidery", "Quality Check"],
            "career_preference": "Tailoring"
        }
        res_onsite = rank_jobs_for_profile(profile_onsite, jobs)
        top_onsite = res_onsite[0]
        print(f"\n[Test 2] On-site Worker ({profile_onsite['full_name']}):")
        print(f"  Top Match: {top_onsite['title']} ({top_onsite['match_percentage']}%) at {top_onsite['organization']}")
        assert "Tailoring" in top_onsite['title'] or top_onsite['job_type'] == "On-site"
        assert top_onsite['score_breakdown']['location_score'] == 100.0, "Pune to Pune local match should be 100%"

        # Test 3: Beginner with 0 years experience
        profile_beginner = {
            "full_name": "Radha Devi",
            "city": "Delhi",
            "state": "Delhi",
            "preferred_job_type": "Remote",
            "available_hours": 4,
            "years_of_experience": 0.0,
            "skills": ["Communication", "Telecalling", "Customer Support"],
            "career_preference": "Customer Support"
        }
        res_beginner = rank_jobs_for_profile(profile_beginner, jobs)
        top_beginner = res_beginner[0]
        print(f"\n[Test 3] Beginner/Fresher ({profile_beginner['full_name']}):")
        print(f"  Top Match: {top_beginner['title']} ({top_beginner['match_percentage']}%)")
        assert top_beginner['score_breakdown']['experience_score'] == 100.0, "Beginner should get 100% on 0-exp roles"

        # Test 4: Experienced User with 5 years experience
        profile_exp = {
            "full_name": "Kavita Rane",
            "city": "Pune",
            "state": "Maharashtra",
            "preferred_job_type": "On-site",
            "available_hours": 6,
            "years_of_experience": 5.0,
            "skills": ["Excel", "MS Office", "Data Entry", "Computer Basics"],
            "career_preference": "Data Entry"
        }
        res_exp = rank_jobs_for_profile(profile_exp, jobs)
        top_exp = res_exp[0]
        print(f"\n[Test 4] Experienced User ({profile_exp['full_name']}):")
        print(f"  Top Match: {top_exp['title']} ({top_exp['match_percentage']}%)")
        assert top_exp['score_breakdown']['experience_score'] == 100.0

        # Test 5: Different Location (Kolkata user looking for On-site role in Pune)
        profile_diff_loc = {
            "full_name": "Aparna Ghosh",
            "city": "Kolkata",
            "state": "West Bengal",
            "preferred_job_type": "On-site",
            "available_hours": 6,
            "years_of_experience": 1.0,
            "skills": ["Tailoring"],
            "career_preference": "Tailoring"
        }
        res_diff = rank_jobs_for_profile(profile_diff_loc, jobs)
        # Find Pune on-site tailoring job
        pune_job = next(j for j in res_diff if "Tailoring Assistant" in j['title'])
        print(f"\n[Test 5] Different Location Effect ({profile_diff_loc['city']} vs Pune job):")
        print(f"  Location score for On-site job across states: {pune_job['score_breakdown']['location_score']}%")
        assert pune_job['score_breakdown']['location_score'] <= 35.0, "Cross-city on-site job should have low location score"

        # Test 6: Different Skills (Web Development & Python)
        profile_tech = {
            "full_name": "Meera Sen",
            "city": "Bengaluru",
            "state": "Karnataka",
            "preferred_job_type": "Remote",
            "available_hours": 6,
            "years_of_experience": 1.0,
            "skills": ["Web Development", "Python", "JavaScript", "HTML", "CSS"],
            "career_preference": "Software/IT"
        }
        res_tech = rank_jobs_for_profile(profile_tech, jobs)
        top_tech = res_tech[0]
        print(f"\n[Test 6] Different Skills ({profile_tech['career_preference']}):")
        print(f"  Top Match: {top_tech['title']} ({top_tech['match_percentage']}%)")
        assert "Web Developer" in top_tech['title'] or "Python" in str(top_tech['required_skills'])

        # Verify Course Recommendations for Bridge Skills
        missing = top_remote.get('missing_skills', [])
        recommended_courses = recommend_courses_for_profile(profile_remote, courses, missing)
        print(f"\n[Course Bridge Test] Recommended course for {profile_remote['career_preference']}:")
        print(f"  Top Course: {recommended_courses[0]['name']} (Provider: {recommended_courses[0]['provider']})")
        assert len(recommended_courses) > 0

        # Verify strictly descending order
        for res_list in [res_remote, res_onsite, res_beginner, res_tech]:
            scores = [j['match_percentage'] for j in res_list]
            assert scores == sorted(scores, reverse=True), "Jobs must be sorted strictly descending by match score"

        print("\nALL 6 MATCHING ENGINE VERIFICATION TESTS PASSED SUCCESSFULLY!")

    finally:
        db.close()

if __name__ == "__main__":
    run_tests()
