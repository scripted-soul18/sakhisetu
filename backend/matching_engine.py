"""
SakhiSetu Smart Matching Engine
================================
A transparent, rule-based recommendation engine designed specifically for single mothers.
Calculates objective compatibility scores between a mother's profile and available opportunities
according to real-life constraints:
  - Skills Match: 40%
  - Working Hours Match: 20%
  - Location Match: 20%
  - Experience Match: 20%
"""

import math
from typing import List, Dict, Any

# Common skill synonyms and related terms for realistic matching
SYNONYM_MAP = {
    "ms office": ["excel", "word", "powerpoint", "office", "computer basics", "data entry"],
    "excel": ["ms office", "spreadsheets", "data entry", "mis"],
    "word": ["ms office", "typing", "documentation"],
    "communication": ["spoken english", "customer service", "customer support", "telecalling", "interpersonal skills"],
    "customer service": ["communication", "customer support", "telecalling", "helpdesk"],
    "customer support": ["customer service", "communication", "telecalling", "helpdesk"],
    "data entry": ["typing", "excel", "computer basics", "ms office", "back office"],
    "tailoring": ["sewing", "embroidery", "garment making", "fashion design", "craft"],
    "teaching": ["tutoring", "childcare", "mentoring", "curriculum", "online tutor"],
    "tutoring": ["teaching", "academics", "homework support"],
    "digital marketing": ["social media", "seo", "content writing", "marketing", "canva"],
    "social media": ["digital marketing", "content creation", "canva"],
    "python": ["programming", "coding", "software", "web development", "backend"],
    "web development": ["html", "css", "javascript", "react", "programming", "frontend"],
    "sales": ["telecalling", "communication", "business development", "retail"],
    "healthcare": ["first aid", "nursing", "patient care", "elderly care", "clinic support"]
}

def normalize_text(text: str) -> str:
    """Helper to sanitize and normalize strings for matching."""
    return text.strip().lower() if text else ""

def calculate_skill_score(user_skills: List[str], required_skills: List[str]) -> tuple[float, List[str], List[str]]:
    """
    Computes Skill Compatibility (0-100).
    Returns (skill_score, matched_skills, missing_skills).
    """
    if not required_skills:
        return 100.0, user_skills, []

    user_norm = [normalize_text(s) for s in user_skills if s.strip()]
    req_norm = [normalize_text(s) for s in required_skills if s.strip()]

    matched = []
    missing = []

    for req in req_norm:
        found = False
        # Direct exact match or substring match
        for u in user_norm:
            if u == req or u in req or req in u:
                found = True
                matched.append(req)
                break
        
        # If not direct match, check synonyms
        if not found:
            synonyms = SYNONYM_MAP.get(req, [])
            for u in user_norm:
                if any(syn in u or u in syn for syn in synonyms):
                    found = True
                    matched.append(req)
                    break
        
        if not found:
            missing.append(req)

    # Base match fraction
    match_ratio = len(matched) / len(req_norm)
    skill_score = round(match_ratio * 100.0, 1)

    return skill_score, matched, missing

def calculate_time_score(user_hours: int, job_hours: int) -> tuple[float, str]:
    """
    Computes Working Hours Compatibility (0-100).
    A mother's available hours must comfortably fit the job requirements.
    """
    if user_hours >= job_hours:
        score = 100.0
        reason = f"Your available time ({user_hours} hrs/day) fully covers the required {job_hours} hrs/day."
    else:
        # User has fewer hours than required
        ratio = user_hours / job_hours
        if ratio >= 0.75:
            score = 75.0
            reason = f"Close time fit: You have {user_hours} hrs/day vs {job_hours} hrs required (flexible shift possible)."
        elif ratio >= 0.50:
            score = 50.0
            reason = f"Partial time fit: Requires {job_hours} hrs/day while you prefer {user_hours} hrs/day."
        else:
            score = 25.0
            reason = f"High time commitment required ({job_hours} hrs/day) relative to your availability ({user_hours} hrs/day)."

    return score, reason

def calculate_location_score(
    user_city: str,
    user_state: str,
    user_pref_type: str,
    job_location: str,
    job_type: str
) -> tuple[float, str]:
    """
    Computes Location Compatibility (0-100).
    Remote work provides maximum flexibility for single mothers.
    """
    u_city = normalize_text(user_city)
    u_state = normalize_text(user_state)
    j_loc = normalize_text(job_location)
    j_type = normalize_text(job_type)
    u_pref = normalize_text(user_pref_type)

    # If the job is 100% remote
    if "remote" in j_type or "remote" in j_loc:
        if "remote" in u_pref:
            return 100.0, "Perfect remote match: Work from home with zero commute constraints."
        else:
            return 95.0, "Remote job opportunity: Flexible work from home."

    # If job is in user's city
    if u_city in j_loc or j_loc in u_city:
        if "remote" in u_pref and "on-site" in j_type:
            return 70.0, f"Local opportunity in {job_location}, though you preferred remote work."
        return 100.0, f"Local opportunity in your city ({job_location}) with manageable commute."

    # If job is in same state
    if u_state in j_loc or j_loc in u_state:
        if "remote" in u_pref:
            return 40.0, f"Located in {job_location} (State region); on-site travel required."
        return 60.0, f"Located within your region ({job_location})."

    # Completely different city/location for on-site role
    if "remote" in u_pref:
        return 20.0, f"On-site role located in {job_location} (differing from your remote preference)."
    return 30.0, f"Located in {job_location}, requiring relocation or long commute."

def calculate_experience_score(user_exp: float, job_min_exp: float) -> tuple[float, str]:
    """
    Computes Experience Compatibility (0-100).
    Freshers/Beginners are rewarded for 0-exp jobs; experienced mothers for matching roles.
    """
    if job_min_exp == 0.0:
        if user_exp == 0.0:
            return 100.0, "Beginner & fresher friendly: No prior professional experience required."
        else:
            return 100.0, f"Your {user_exp} years of experience give you an advantage for this entry role."

    if user_exp >= job_min_exp:
        return 100.0, f"Your experience ({user_exp} years) meets the minimum requirement ({job_min_exp} years)."
    
    diff = job_min_exp - user_exp
    if diff <= 1.0:
        return 75.0, f"Nearly qualified: You have {user_exp} years vs {job_min_exp} years requested."
    elif diff <= 2.0:
        return 50.0, f"Potential stretch opportunity: Requires {job_min_exp} years, you bring {user_exp} years."
    else:
        return 25.0, f"Advanced role: Requires {job_min_exp}+ years of specialized experience."

def match_job(profile_dict: Dict[str, Any], job_dict: Dict[str, Any]) -> Dict[str, Any]:
    """
    Evaluates a single job against the mother's profile using the exact weighted formula:
      Final Score = (Skill * 0.40) + (Time * 0.20) + (Location * 0.20) + (Experience * 0.20)
    """
    user_skills = profile_dict.get("skills", [])
    required_skills = job_dict.get("required_skills", [])

    # 1. Skill Score (40%)
    skill_score, matched_skills, missing_skills = calculate_skill_score(user_skills, required_skills)

    # 2. Time Score (20%)
    user_hours = int(profile_dict.get("available_hours", 4))
    job_hours = int(job_dict.get("required_hours", 4))
    time_score, time_reason = calculate_time_score(user_hours, job_hours)

    # 3. Location Score (20%)
    location_score, location_reason = calculate_location_score(
        user_city=profile_dict.get("city", ""),
        user_state=profile_dict.get("state", ""),
        user_pref_type=profile_dict.get("preferred_job_type", "Remote"),
        job_location=job_dict.get("location", ""),
        job_type=job_dict.get("job_type", "Remote")
    )

    # 4. Experience Score (20%)
    user_exp = float(profile_dict.get("years_of_experience", 0.0))
    job_min_exp = float(job_dict.get("minimum_experience", 0.0))
    exp_score, exp_reason = calculate_experience_score(user_exp, job_min_exp)

    # Final Weighted Calculation
    final_score = (
        (skill_score * 0.40) +
        (time_score * 0.20) +
        (location_score * 0.20) +
        (exp_score * 0.20)
    )
    final_score = round(final_score, 1)

    # Build human-readable matching reasons
    reasons = []
    if matched_skills:
        reasons.append(f"Skills matched: {', '.join([s.title() for s in matched_skills])}")
    elif not required_skills:
        reasons.append("Open to all skill backgrounds (onboarding provided)")
    else:
        reasons.append("Core skills require slight bridging via our free courses")

    reasons.append(f"{time_reason}")
    reasons.append(f"{location_reason}")
    reasons.append(f"{exp_reason}")

    return {
        "job_id": job_dict.get("id"),
        "title": job_dict.get("title"),
        "organization": job_dict.get("organization"),
        "location": job_dict.get("location"),
        "job_type": job_dict.get("job_type"),
        "salary": job_dict.get("salary"),
        "career_category": job_dict.get("career_category"),
        "description": job_dict.get("description"),
        "required_skills": required_skills,
        "required_hours": job_hours,
        "minimum_experience": job_min_exp,
        "match_percentage": final_score,
        "score_breakdown": {
            "skill_score": skill_score,
            "time_score": time_score,
            "location_score": location_score,
            "experience_score": exp_score,
            "weights": {"skill": "40%", "time": "20%", "location": "20%", "experience": "20%"}
        },
        "matched_skills": [s.title() for s in matched_skills],
        "missing_skills": [s.title() for s in missing_skills],
        "matching_reasons": reasons
    }

def rank_jobs_for_profile(profile_dict: Dict[str, Any], jobs_list: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Ranks all jobs for the given profile and sorts from highest match score to lowest.
    """
    ranked = []
    for job in jobs_list:
        ranked.append(match_job(profile_dict, job))
    
    # Sort strictly descending by match_percentage
    ranked.sort(key=lambda x: x["match_percentage"], reverse=True)
    return ranked

def recommend_courses_for_profile(
    profile_dict: Dict[str, Any],
    courses_list: List[Dict[str, Any]],
    missing_skills: List[str]
) -> List[Dict[str, Any]]:
    """
    Recommends courses that bridge the mother's missing skills or target her chosen career preference.
    """
    career_pref = normalize_text(profile_dict.get("career_preference", ""))
    missing_norm = [normalize_text(s) for s in missing_skills]

    scored_courses = []
    for course in courses_list:
        c_cat = normalize_text(course.get("skill_category", ""))
        c_name = normalize_text(course.get("name", ""))
        c_desc = normalize_text(course.get("description", ""))

        relevance = 50  # Base relevance

        # Boost if course directly matches career preference
        if career_pref in c_cat or career_pref in c_name:
            relevance += 35

        # Boost if course teaches missing skills
        for m in missing_norm:
            if m in c_cat or m in c_name or m in c_desc:
                relevance += 20
                break

        # Free courses get a slight preference for affordability
        if course.get("is_free", True):
            relevance += 10

        item = dict(course)
        item["relevance_score"] = min(relevance, 100)
        scored_courses.append(item)

    scored_courses.sort(key=lambda x: x["relevance_score"], reverse=True)
    return scored_courses

def recommend_schemes_for_profile(
    profile_dict: Dict[str, Any],
    schemes_list: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """
    Filters and ranks government schemes relevant to single mothers, children's ages, and empowerment.
    """
    child_age = int(profile_dict.get("child_age", 5))
    career_pref = normalize_text(profile_dict.get("career_preference", ""))

    ranked_schemes = []
    for s in schemes_list:
        name = normalize_text(s.get("name", ""))
        desc = normalize_text(s.get("description", ""))
        elig = normalize_text(s.get("eligibility", ""))

        priority = 70  # Baseline high priority for women support

        # Mother with infants/young toddlers (<= 6 years)
        if child_age <= 6 and ("matru" in name or "poshan" in name or "child" in elig or "maternal" in desc):
            priority += 25
        
        # Skill-based schemes
        if "kaushal" in name or "pmkvy" in name or "skill" in desc:
            priority += 20

        # General single mother / women empowerment
        if "shakti" in name or "women" in elig or "step" in name:
            priority += 15

        item = dict(s)
        item["match_priority"] = min(priority, 100)
        ranked_schemes.append(item)

    ranked_schemes.sort(key=lambda x: x["match_priority"], reverse=True)
    return ranked_schemes

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Haversine formula to calculate approximate distance in km."""
    R = 6371.0 # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 1)

def rank_childcare_for_profile(
    profile_dict: Dict[str, Any],
    centers_list: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """
    Ranks childcare and support centres based on user location match.
    """
    user_city = normalize_text(profile_dict.get("city", "pune"))

    ranked = []
    for c in centers_list:
        loc = normalize_text(c.get("location", ""))
        addr = normalize_text(c.get("address", ""))
        
        is_same_city = (user_city in loc) or (user_city in addr)
        item = dict(c)
        item["is_local_city"] = is_same_city
        item["proximity_tag"] = "In Your City" if is_same_city else "Nearby District"
        ranked.append(item)

    # Sort same city centres first
    ranked.sort(key=lambda x: (not x["is_local_city"]))
    return ranked

def generate_career_roadmap(profile_dict: Dict[str, Any], top_job: Dict[str, Any] = None) -> List[Dict[str, Any]]:
    """
    Generates a personalized, step-by-step career empowerment roadmap.
    """
    name = profile_dict.get("full_name", "Mother").split()[0]
    career = profile_dict.get("career_preference", "Professional Career")
    hours = profile_dict.get("available_hours", 4)
    target_job = top_job.get("title") if top_job else f"{career} Role"
    missing = top_job.get("missing_skills", []) if top_job else []

    skills_to_learn = ", ".join(missing[:2]) if missing else "Modern Productivity & Communication Tools"

    roadmap = [
        {
            "step": 1,
            "title": "Establish Your Foundation",
            "tag": "Completed",
            "status": "done",
            "description": f"Profile created with {hours} hours daily flexibility and {career} focus.",
            "action": "Profile active on SakhiSetu"
        },
        {
            "step": 2,
            "title": "Bridging Core Skills",
            "tag": "In Progress",
            "status": "current",
            "description": f"Enroll in recommended free certification courses in {skills_to_learn} to boost your match score to 95%+.",
            "action": "Start Recommended Course"
        },
        {
            "step": 3,
            "title": "Apply For Tailored Opportunities",
            "tag": "Up Next",
            "status": "pending",
            "description": f"Submit your application for top-matching {target_job} opportunities with flexible shift timing.",
            "action": "Review Job Matches"
        },
        {
            "step": 4,
            "title": "Secure Family Support",
            "tag": "Support",
            "status": "pending",
            "description": "Utilize local childcare crèches and verify eligibility for Mission Shakti schemes for single mothers.",
            "action": "Explore Childcare Map"
        },
        {
            "step": 5,
            "title": "Independent Future & Growth",
            "tag": "Long Term",
            "status": "pending",
            "description": f"Achieve steady monthly income, gain verifiable experience, and advance toward senior {career} opportunities.",
            "action": "Financial Independence"
        }
    ]
    return roadmap
