"""
SakhiSetu Database Seeder
=========================
Populates the database with realistic sample data for jobs, courses,
government schemes, and support/childcare centers.
All data is clearly labelled for demonstration purposes.
"""

import json
from database import engine, SessionLocal, init_db
from models import Job, Course, Scheme, ChildcareCenter, User, Profile
from werkzeug.security import generate_password_hash

SAMPLE_JOBS = [
    {
        "title": "Data Entry Executive",
        "organization": "Sahyog Digital Services",
        "location": "Pune",
        "job_type": "Remote",
        "required_skills": json.dumps(["MS Office", "Excel", "Data Entry", "Typing", "Communication"]),
        "required_hours": 4,
        "minimum_experience": 1.0,
        "salary": "₹14,000 - ₹18,000 / month",
        "description": "Flexible part-time remote data entry role suitable for mothers. Involves digitizing records, validating tabular spreadsheets, and uploading weekly summaries with flexible daily shifts.",
        "career_category": "Data Entry"
    },
    {
        "title": "Customer Support Executive",
        "organization": "Aarambh Customer Connect",
        "location": "Pune",
        "job_type": "Hybrid",
        "required_skills": json.dumps(["Customer Support", "Communication", "Spoken English", "Telecalling"]),
        "required_hours": 4,
        "minimum_experience": 1.0,
        "salary": "₹16,000 - ₹22,000 / month",
        "description": "Inbound customer assistance for e-commerce products. Offers 4-hour flexible window options, family health insurance cover, and crèche subsidy.",
        "career_category": "Customer Support"
    },
    {
        "title": "Online Tutor (Primary Math & English)",
        "organization": "VidyaVandana Learning Network",
        "location": "Remote",
        "job_type": "Remote",
        "required_skills": json.dumps(["Teaching", "Communication", "Spoken English", "Computer Basics"]),
        "required_hours": 2,
        "minimum_experience": 0.0,
        "salary": "₹10,000 - ₹15,000 / month",
        "description": "Teach small groups of students (Grades 1-5) via video conference. Flexible evening hours (2 hrs/day) that accommodate child study time.",
        "career_category": "Teaching"
    },
    {
        "title": "Junior Web Developer",
        "organization": "TechSakhi Innovations",
        "location": "Remote",
        "job_type": "Remote",
        "required_skills": json.dumps(["Web Development", "Python", "JavaScript", "HTML", "CSS"]),
        "required_hours": 6,
        "minimum_experience": 0.5,
        "salary": "₹25,000 - ₹35,000 / month",
        "description": "Junior frontend and API maintenance role. Great for women returning to tech or transitioning from coding bootcamps. Supportive peer mentorship.",
        "career_category": "Software/IT"
    },
    {
        "title": "Digital Marketing Assistant",
        "organization": "Pragati Social Media Agency",
        "location": "Mumbai",
        "job_type": "Remote",
        "required_skills": json.dumps(["Digital Marketing", "Social Media", "Canva", "Content Writing", "Communication"]),
        "required_hours": 4,
        "minimum_experience": 1.0,
        "salary": "₹15,000 - ₹20,000 / month",
        "description": "Manage Instagram, Facebook, and WhatsApp marketing campaigns for local women-led enterprises. Work from home with weekly virtual syncs.",
        "career_category": "Digital Marketing"
    },
    {
        "title": "Content Writer & Proofreader",
        "organization": "Vani Publishing Guild",
        "location": "Remote",
        "job_type": "Remote",
        "required_skills": json.dumps(["Content Writing", "Spoken English", "Word", "MS Office"]),
        "required_hours": 4,
        "minimum_experience": 0.0,
        "salary": "₹12,000 - ₹18,000 / month",
        "description": "Draft educational blogs, newsletters, and social media blurbs in English and Hindi. Zero commute, beginner-friendly with style guide provided.",
        "career_category": "Content Writing"
    },
    {
        "title": "Back Office & MIS Assistant",
        "organization": "Mahila Samriddhi Co-op Bank",
        "location": "Pune",
        "job_type": "On-site",
        "required_skills": json.dumps(["Excel", "MS Office", "Data Entry", "Computer Basics"]),
        "required_hours": 6,
        "minimum_experience": 2.0,
        "salary": "₹18,000 - ₹24,000 / month",
        "description": "Branch back-office role handling account verification, ledger balancing, and customer file indexing. Includes on-campus mother-child day support.",
        "career_category": "Data Entry"
    },
    {
        "title": "Tailoring Assistant & Boutique Supervisor",
        "organization": "KalaKriti Women Collective",
        "location": "Pune",
        "job_type": "On-site",
        "required_skills": json.dumps(["Tailoring", "Garment Making", "Embroidery", "Quality Check"]),
        "required_hours": 6,
        "minimum_experience": 1.0,
        "salary": "₹14,000 - ₹19,000 / month",
        "description": "Supervise cutting, stitching, and finishing of designer apparel. Safe, all-women workplace with subsidized lunch and crèche support.",
        "career_category": "Tailoring"
    },
    {
        "title": "Sales & Telecaller Coordinator",
        "organization": "Utkarsh Wellness Group",
        "location": "Pune",
        "job_type": "Remote",
        "required_skills": json.dumps(["Sales", "Communication", "Telecalling", "Customer Service"]),
        "required_hours": 4,
        "minimum_experience": 0.0,
        "salary": "₹13,000 - ₹17,000 / month + Incentives",
        "description": "Call existing wellness club members to explain new health consultation packages. Dedicated afternoon calling window between 1 PM and 5 PM.",
        "career_category": "Sales"
    },
    {
        "title": "Healthcare Support Assistant",
        "organization": "Sanjeevani Community Clinic",
        "location": "Pune",
        "job_type": "Hybrid",
        "required_skills": json.dumps(["Healthcare", "Patient Care", "Communication", "Computer Basics"]),
        "required_hours": 6,
        "minimum_experience": 1.0,
        "salary": "₹17,000 - ₹23,000 / month",
        "description": "Assist clinic reception, schedule tele-consultations, and manage patient token registrations. Flexible half-day rotations.",
        "career_category": "Healthcare"
    },
    {
        "title": "Graphic & Social Media Designer",
        "organization": "CreativeNari Studios",
        "location": "Bengaluru",
        "job_type": "Remote",
        "required_skills": json.dumps(["Canva", "Digital Marketing", "Social Media", "Creativity"]),
        "required_hours": 4,
        "minimum_experience": 0.0,
        "salary": "₹16,000 - ₹22,000 / month",
        "description": "Create engaging banners, product posters, and infographics for women-led startups using Canva and basic editing tools. Completely work from home.",
        "career_category": "Digital Marketing"
    },
    {
        "title": "Telephonic Helpdesk Representative",
        "organization": "JanSeva Helpline Services",
        "location": "Delhi",
        "job_type": "Remote",
        "required_skills": json.dumps(["Customer Support", "Communication", "Telecalling", "Computer Basics"]),
        "required_hours": 4,
        "minimum_experience": 0.0,
        "salary": "₹13,500 - ₹17,500 / month",
        "description": "Answer civic queries, register grievance tickets, and guide citizens to appropriate municipal services. Flexible 4-hour shifts with paid training.",
        "career_category": "Customer Support"
    }
]

SAMPLE_COURSES = [
    {
        "name": "Advanced Excel & MIS Reporting for Professionals",
        "provider": "SkillIndia / National Skill Development Corp",
        "skill_category": "Data Entry",
        "duration": "4 Weeks (1 hr/day)",
        "level": "Beginner to Intermediate",
        "mode": "Online Free",
        "description": "Master VLOOKUP, XLOOKUP, Pivot Tables, and automated data cleaning for high-paying back-office and remote data entry roles.",
        "url": "https://www.skillindiadigital.gov.in",
        "is_free": True,
        "rating": 4.9
    },
    {
        "name": "Digital Marketing & Social Media for Beginners",
        "provider": "SWAYAM / NPTEL Free Education",
        "skill_category": "Digital Marketing",
        "duration": "6 Weeks (Self-Paced)",
        "level": "Beginner",
        "mode": "Online Free",
        "description": "Learn search engine marketing, Canva design, Facebook business manager, and WhatsApp campaigns with zero prior marketing experience.",
        "url": "https://swayam.gov.in",
        "is_free": True,
        "rating": 4.8
    },
    {
        "name": "Python Programming Fundamentals for Women Returning to Tech",
        "provider": "SakhiTech Coding Academy",
        "skill_category": "Software/IT",
        "duration": "8 Weeks (Flexible)",
        "level": "Beginner",
        "mode": "Online Free",
        "description": "A step-by-step introduction to Python syntax, basic logic, data structures, and practical automation scripts. Mentorship provided by women engineers.",
        "url": "https://www.sakhi-tech.example.org",
        "is_free": True,
        "rating": 4.9
    },
    {
        "name": "Web Development Starter: HTML, CSS & Modern JavaScript",
        "provider": "FreeCodeCamp & SakhiSetu Initiative",
        "skill_category": "Software/IT",
        "duration": "8 Weeks",
        "level": "Beginner",
        "mode": "Online Free",
        "description": "Build responsive websites, interactive forms, and clean portfolios. Completely free curriculum with practice exercises and peer forums.",
        "url": "https://www.freecodecamp.org",
        "is_free": True,
        "rating": 4.8
    },
    {
        "name": "Spoken English & Workplace Communication Mastery",
        "provider": "Aarohan Foundation",
        "skill_category": "Customer Support",
        "duration": "3 Weeks",
        "level": "Beginner",
        "mode": "Online Free",
        "description": "Build conversational fluency, email etiquette, call handling confidence, and interview presentation skills for remote customer support jobs.",
        "url": "https://aarohan.example.org",
        "is_free": True,
        "rating": 4.7
    },
    {
        "name": "Computer Basics & Fast Touch-Typing Certification",
        "provider": "National Career Service (NCS)",
        "skill_category": "Data Entry",
        "duration": "2 Weeks",
        "level": "Beginner",
        "mode": "Online Free",
        "description": "Learn keyboard ergonomics, 40+ WPM typing speed, operating system navigation, file folders, and Google Drive / OneDrive sharing.",
        "url": "https://www.ncs.gov.in",
        "is_free": True,
        "rating": 4.8
    },
    {
        "name": "Financial Literacy & Household Budgeting for Single Mothers",
        "provider": "SEBI / RBI Financial Inclusion Wing",
        "skill_category": "Financial Literacy",
        "duration": "2 Weeks",
        "level": "All Levels",
        "mode": "Online Free",
        "description": "Learn emergency fund planning, Sukanya Samriddhi Yojana, PPF, micro-insurance, and avoiding loan scams to secure your child's financial future.",
        "url": "https://www.sebi.gov.in",
        "is_free": True,
        "rating": 4.9
    },
    {
        "name": "Professional Tailoring, Pattern Drafting & Boutique Setup",
        "provider": "Pradhan Mantri Kaushal Vikas Yojana (PMKVY)",
        "skill_category": "Tailoring",
        "duration": "6 Weeks",
        "level": "Beginner",
        "mode": "Hybrid / Center-Assisted",
        "description": "Comprehensive hands-on training in machine operation, blouse cutting, dressmaking, pricing, and setting up an independent home boutique.",
        "url": "https://www.pmkvyofficial.org",
        "is_free": True,
        "rating": 4.9
    },
    {
        "name": "Customer Care & Telecalling Professional Certification",
        "provider": "JanSeva Academy",
        "skill_category": "Customer Support",
        "duration": "3 Weeks",
        "level": "Beginner",
        "mode": "Online Free",
        "description": "Master CRM software, conflict resolution, active listening, and telephonic etiquette for high-demand remote support roles.",
        "url": "https://janseva.example.org",
        "is_free": True,
        "rating": 4.7
    }
]

SAMPLE_SCHEMES = [
    {
        "name": "Mission Shakti (Sambal & Samarthya)",
        "description": "An integrated women empowerment program by the Ministry of Women and Child Development focusing on safety, rehabilitation, working women hostels, and economic self-reliance for vulnerable and single mothers.",
        "who_it_helps": "Single mothers, destitute women, widows, and female breadwinners.",
        "eligibility": "Indian female citizens, with special facilitation for single/separated mothers, widows, and low-income households. Priority given to vulnerable families.",
        "required_documents": "Aadhaar card, Bank passbook, Proof of single/separated status or death certificate of spouse (if applicable), Income certificate.",
        "official_url": "https://wcd.nic.in/schemes/mission-shakti",
        "category": "Women Empowerment & Safety"
    },
    {
        "name": "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
        "description": "A direct benefit transfer (DBT) scheme providing financial assistance of ₹5,000 to ₹6,000 for mothers to support nutritional needs and healthcare for their children.",
        "who_it_helps": "Pregnant women and lactating mothers with children up to age 2.",
        "eligibility": "Mothers from economically vulnerable categories, SC/ST, BPL card holders, or families with income below statutory limit.",
        "required_documents": "Mother and child protection (MCP) card, Aadhaar card, Child birth certificate, Bank account linked to Aadhaar.",
        "official_url": "https://pmmvy.wcd.gov.in",
        "category": "Maternal & Child Health"
    },
    {
        "name": "National Career Service (NCS) - Women's Special Window",
        "description": "A national portal connecting women jobseekers with verified employers offering work-from-home, part-time, and flexible shift roles, alongside free career counselling.",
        "who_it_helps": "All women seeking flexible employment, career restart, or skill upgrades.",
        "eligibility": "Minimum 18 years of age. Open to all education levels from 10th pass to postgraduates.",
        "required_documents": "Aadhaar Card or Photo ID, Educational certificates, Resume/Bio-data.",
        "official_url": "https://www.ncs.gov.in",
        "category": "Employment & Career"
    },
    {
        "name": "Pradhan Mantri Kaushal Vikas Yojana (PMKVY 4.0)",
        "description": "Offers free government-certified industry skill training and stipend assistance across domains including IT, Data Entry, Healthcare Assistance, and Garment Construction.",
        "who_it_helps": "Unemployed women, school/college dropouts, and mothers seeking market-aligned vocational skills.",
        "eligibility": "Indian nationals aged 18-45 years with valid identity proof.",
        "required_documents": "Aadhaar Card, Bank account details, Educational proof (10th/12th/Graduation if available).",
        "official_url": "https://www.pmkvyofficial.org",
        "category": "Skill Development"
    },
    {
        "name": "Support to Training and Employment Programme (STEP / Mahila E-Haat)",
        "description": "Aims to provide skills that give employability to women and to provide competencies that enable women to become self-employed/entrepreneurs.",
        "who_it_helps": "Women aged 16 and above, particularly marginalized and single mothers looking to run micro-enterprises.",
        "eligibility": "Women seeking self-employment in agriculture, handicrafts, tailoring, food processing, or digital services.",
        "required_documents": "Aadhaar card, Proof of residence, Self-declaration of intent/trade.",
        "official_url": "https://wcd.nic.in/schemes/support-training-and-employment-programme-women-step",
        "category": "Entrepreneurship"
    },
    {
        "name": "Stand-Up India Scheme for Women Entrepreneurs",
        "description": "Facilitates bank loans between ₹10 lakh and ₹1 crore to at least one woman borrower per bank branch for setting up greenfield trading, manufacturing, or service ventures.",
        "who_it_helps": "Women looking to start an enterprise or formal boutique/tech agency.",
        "eligibility": "Women entrepreneurs aged 18+ years; enterprise must be greenfield (first venture).",
        "required_documents": "Project proposal, Identity proof, Address proof, PAN card, Business registration.",
        "official_url": "https://www.standupmitra.in",
        "category": "Business Financing"
    }
]

SAMPLE_CHILDCARE = [
    {
        "name": "Punarjani Shishu Palan Kendra & Crèche",
        "location": "Pune (Kothrud)",
        "address": "Plot 14, Near Vanaz Metro Station, Kothrud, Pune, Maharashtra 411038",
        "contact": "+91 98230 11223 | care@punarjani.org",
        "services": "Infant Daycare (6mo - 3yr), After-school Support (4yr - 10yr), Subsidized Meal Program, Single Mother Fee Waiver",
        "opening_hours": "08:00 AM - 07:00 PM (Mon-Sat)",
        "latitude": 18.5074,
        "longitude": 73.8077,
        "is_demo": True
    },
    {
        "name": "Vatsalya Mother & Child Community Center",
        "location": "Pune (Shivajinagar)",
        "address": "B-4, Model Colony, Shivajinagar, Pune, Maharashtra 411016",
        "contact": "+91 98231 44556 | support@vatsalya.org",
        "services": "Emergency Crèche, Toddler Learning Playgroup, Homework Assistance, Health Checkups",
        "opening_hours": "08:30 AM - 06:30 PM (Mon-Sat)",
        "latitude": 18.5314,
        "longitude": 73.8446,
        "is_demo": True
    },
    {
        "name": "Sakhi Sahayata Crèche & Daycare",
        "location": "Pune (Hinjawadi)",
        "address": "Phase 1, Near Infotech Park, Hinjawadi, Pune, Maharashtra 411057",
        "contact": "+91 98235 77889 | hinjawadi@sakhicreche.org",
        "services": "Flexible Hourly Crèche, CCTV Access for Mothers, Nutritious Snack Facility",
        "opening_hours": "07:30 AM - 08:00 PM (Mon-Fri)",
        "latitude": 18.5913,
        "longitude": 73.7389,
        "is_demo": True
    },
    {
        "name": "Aanchal Women & Children Care Trust",
        "location": "Mumbai (Dadar)",
        "address": "12, Senapati Bapat Marg, Dadar West, Mumbai, Maharashtra 400028",
        "contact": "+91 98200 33441 | aanchal@mumbaitrust.org",
        "services": "Full Day Care, Weekend Assistance, Counseling for Single Mothers, Subsidized Rates",
        "opening_hours": "08:00 AM - 07:30 PM (Mon-Sat)",
        "latitude": 19.0178,
        "longitude": 72.8478,
        "is_demo": True
    },
    {
        "name": "Prerna Child Welfare & Day Support Hub",
        "location": "Mumbai (Andheri)",
        "address": "402, Lotus Corporate Park, Andheri East, Mumbai, Maharashtra 400069",
        "contact": "+91 98201 66772 | prerna.andheri@care.org",
        "services": "Early Childhood Education, After-school Mentoring, Healthy Meal Facility",
        "opening_hours": "08:00 AM - 07:00 PM (Mon-Sat)",
        "latitude": 19.1197,
        "longitude": 72.8468,
        "is_demo": True
    },
    {
        "name": "MatruSeva Childcare & Activity Center",
        "location": "Delhi (Dwarka)",
        "address": "Sector 11, Main Market Road, Dwarka, New Delhi 110075",
        "contact": "+91 98110 55443 | contact@matruseva-delhi.org",
        "services": "Day Crèche, Pediatric Nurse on Duty, Safe Activity Zones, Single Mother Discounts",
        "opening_hours": "08:00 AM - 07:00 PM (Mon-Sat)",
        "latitude": 28.5921,
        "longitude": 77.0460,
        "is_demo": True
    },
    {
        "name": "Nari Shakti Support & Crèche Wing",
        "location": "Bengaluru (Indiranagar)",
        "address": "100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038",
        "contact": "+91 98450 11992 | blr.support@narishakti.org",
        "services": "Montessori Playgroup, Extended Evening Daycare, Women Guidance Cell",
        "opening_hours": "08:00 AM - 07:30 PM (Mon-Sat)",
        "latitude": 12.9784,
        "longitude": 77.6408,
        "is_demo": True
    },
    {
        "name": "Snehalaya Women & Children Center",
        "location": "Jaipur (Mansarovar)",
        "address": "Sector 5, Shipra Path, Mansarovar, Jaipur, Rajasthan 302020",
        "contact": "+91 98290 88221 | jaipur@snehalaya.org",
        "services": "Daycare, Free Library, Child Nutrition Support, Women Skill Classes",
        "opening_hours": "08:30 AM - 06:30 PM (Mon-Sat)",
        "latitude": 26.8532,
        "longitude": 75.7678,
        "is_demo": True
    }
]

def seed_database():
    """Initializes tables and seeds sample data."""
    init_db()
    db = SessionLocal()

    try:
        # Check if jobs already seeded
        existing_jobs = db.query(Job).count()
        if existing_jobs == 0:
            print("Seeding sample jobs...")
            for j in SAMPLE_JOBS:
                job = Job(**j)
                db.add(job)
            db.commit()
            print(f"Added {len(SAMPLE_JOBS)} sample jobs.")
        else:
            print(f"Database already contains {existing_jobs} jobs.")

        # Check if courses already seeded
        existing_courses = db.query(Course).count()
        if existing_courses == 0:
            print("Seeding sample courses...")
            for c in SAMPLE_COURSES:
                course = Course(**c)
                db.add(course)
            db.commit()
            print(f"Added {len(SAMPLE_COURSES)} sample courses.")
        else:
            print(f"Database already contains {existing_courses} courses.")

        # Check if schemes already seeded
        existing_schemes = db.query(Scheme).count()
        if existing_schemes == 0:
            print("Seeding sample schemes...")
            for s in SAMPLE_SCHEMES:
                scheme = Scheme(**s)
                db.add(scheme)
            db.commit()
            print(f"Added {len(SAMPLE_SCHEMES)} sample government schemes.")
        else:
            print(f"Database already contains {existing_schemes} schemes.")

        # Check if childcare centers already seeded
        existing_centers = db.query(ChildcareCenter).count()
        if existing_centers == 0:
            print("Seeding sample childcare & support centers...")
            for cc in SAMPLE_CHILDCARE:
                center = ChildcareCenter(**cc)
                db.add(center)
            db.commit()
            print(f"Added {len(SAMPLE_CHILDCARE)} childcare/support centers.")
        else:
            print(f"Database already contains {existing_centers} childcare centers.")

        # Seed Demo User & Demo Profile (Priya Sharma)
        demo_user = db.query(User).filter_by(email="demo.priya@sakhisetu.org").first()
        if not demo_user:
            print("Seeding Demo User (Priya Sharma)...")
            demo_user = User(
                email="demo.priya@sakhisetu.org",
                password_hash=generate_password_hash("sakhi123"),
                full_name="Priya Sharma"
            )
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)

        demo_profile = db.query(Profile).filter_by(user_id=demo_user.id).first()
        if not demo_profile:
            print("Seeding Demo Profile...")
            demo_profile = Profile(
                user_id=demo_user.id,
                full_name="Priya Sharma",
                age=32,
                city="Pune",
                state="Maharashtra",
                education_level="Bachelor's Degree",
                qualification="B.Com (Commerce)",
                skills=json.dumps(["MS Office", "Excel", "Communication", "Data Entry"]),
                years_of_experience=2.0,
                preferred_job_type="Remote",
                available_hours=4,
                career_preference="Data Entry",
                number_of_children=1,
                child_age=6,
                monthly_income="Below ₹15,000",
                preferred_salary="₹15,000 - ₹20,000"
            )
            db.add(demo_profile)
            db.commit()
            print("Demo profile created successfully.")

        print("Database seeding completed successfully!")

    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
