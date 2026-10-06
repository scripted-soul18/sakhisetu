// Comprehensive Demo Dataset for SakhiSetu
// Ensures full functionality on static deployments (e.g. Netlify) and when backend is offline.

export const DEMO_PROFILES = [
  {
    id: "demo-priya",
    name: "Priya Sharma",
    avatar_title: "Data Entry & Back Office",
    tagline: "Mother of 6yo child, seeking 4 hrs/day flexible remote data work",
    data: {
      id: 101,
      full_name: "Priya Sharma",
      age: 32,
      city: "Pune",
      state: "Maharashtra",
      education_level: "Bachelor's Degree",
      qualification: "B.Com (Commerce)",
      skills: ["MS Office", "Excel", "Communication", "Data Entry"],
      years_of_experience: 2,
      preferred_job_type: "Remote",
      available_hours: 4,
      career_preference: "Data Entry",
      number_of_children: 1,
      child_age: 6,
      monthly_income: "Below ₹15,000",
      preferred_salary: "₹15,000 - ₹20,000"
    }
  },
  {
    id: "demo-anita",
    name: "Anita Verma",
    avatar_title: "Online Teaching & Tutoring",
    tagline: "Mother with toddler (3yo), wants 2 hrs evening online tutoring",
    data: {
      id: 102,
      full_name: "Anita Verma",
      age: 29,
      city: "Pune",
      state: "Maharashtra",
      education_level: "Bachelor's Degree",
      qualification: "B.Sc (Mathematics)",
      skills: ["Teaching", "Communication", "Spoken English", "Computer Basics"],
      years_of_experience: 1,
      preferred_job_type: "Remote",
      available_hours: 2,
      career_preference: "Teaching",
      number_of_children: 1,
      child_age: 3,
      monthly_income: "Below ₹10,000",
      preferred_salary: "₹10,000 - ₹15,000"
    }
  },
  {
    id: "demo-sunita",
    name: "Sunita Kamble",
    avatar_title: "Tailoring & Boutique",
    tagline: "Mother of two (7yo & 4yo), seeking on-site tailoring supervisory role",
    data: {
      id: 103,
      full_name: "Sunita Kamble",
      age: 35,
      city: "Pune",
      state: "Maharashtra",
      education_level: "10th Standard / SSC",
      qualification: "Vocational Certificate in Garment Making",
      skills: ["Tailoring", "Garment Making", "Embroidery", "Quality Check"],
      years_of_experience: 3,
      preferred_job_type: "On-site",
      available_hours: 6,
      career_preference: "Tailoring",
      number_of_children: 2,
      child_age: 4,
      monthly_income: "Below ₹15,000",
      preferred_salary: "₹15,000 - ₹20,000"
    }
  },
  {
    id: "demo-meera",
    name: "Meera Sen",
    avatar_title: "Junior Web Developer",
    tagline: "Mother returning to tech after career break, seeking remote junior web dev",
    data: {
      id: 104,
      full_name: "Meera Sen",
      age: 31,
      city: "Bengaluru",
      state: "Karnataka",
      education_level: "Bachelor's Degree",
      qualification: "B.Tech in Computer Science",
      skills: ["HTML", "CSS", "JavaScript", "Python", "Web Development"],
      years_of_experience: 1,
      preferred_job_type: "Remote",
      available_hours: 6,
      career_preference: "Software/IT",
      number_of_children: 1,
      child_age: 5,
      monthly_income: "₹15,000 - ₹25,000",
      preferred_salary: "₹25,000 - ₹35,000"
    }
  }
];

export const DEMO_JOBS = [
  {
    id: 1,
    title: "Data Entry Executive",
    organization: "Sahyog Digital Services",
    location: "Pune",
    job_type: "Remote",
    required_skills: ["MS Office", "Excel", "Data Entry", "Typing", "Communication"],
    required_hours: 4,
    minimum_experience: 1.0,
    salary: "₹14,000 - ₹18,000 / month",
    description: "Flexible part-time remote data entry role suitable for mothers. Involves digitizing records, validating tabular spreadsheets, and uploading weekly summaries with flexible daily shifts.",
    career_category: "Data Entry"
  },
  {
    id: 2,
    title: "Customer Support Executive",
    organization: "Aarambh Customer Connect",
    location: "Pune",
    job_type: "Hybrid",
    required_skills: ["Customer Support", "Communication", "Spoken English", "Telecalling"],
    required_hours: 4,
    minimum_experience: 1.0,
    salary: "₹16,000 - ₹22,000 / month",
    description: "Inbound customer assistance for e-commerce products. Offers 4-hour flexible window options, family health insurance cover, and crèche subsidy.",
    career_category: "Customer Support"
  },
  {
    id: 3,
    title: "Online Tutor (Primary Math & English)",
    organization: "VidyaVandana Learning Network",
    location: "Remote",
    job_type: "Remote",
    required_skills: ["Teaching", "Communication", "Spoken English", "Computer Basics"],
    required_hours: 2,
    minimum_experience: 0.0,
    salary: "₹10,000 - ₹15,000 / month",
    description: "Teach small groups of students (Grades 1-5) via video conference. Flexible evening hours (2 hrs/day) that accommodate child study time.",
    career_category: "Teaching"
  },
  {
    id: 4,
    title: "Junior Web Developer",
    organization: "TechSakhi Innovations",
    location: "Remote",
    job_type: "Remote",
    required_skills: ["Web Development", "Python", "JavaScript", "HTML", "CSS"],
    required_hours: 6,
    minimum_experience: 0.5,
    salary: "₹25,000 - ₹35,000 / month",
    description: "Junior frontend and API maintenance role. Great for women returning to tech or transitioning from coding bootcamps. Supportive peer mentorship.",
    career_category: "Software/IT"
  },
  {
    id: 5,
    title: "Digital Marketing Assistant",
    organization: "Pragati Social Media Agency",
    location: "Mumbai",
    job_type: "Remote",
    required_skills: ["Digital Marketing", "Social Media", "Canva", "Content Writing", "Communication"],
    required_hours: 4,
    minimum_experience: 1.0,
    salary: "₹15,000 - ₹20,000 / month",
    description: "Manage Instagram, Facebook, and WhatsApp marketing campaigns for local women-led enterprises. Work from home with weekly virtual syncs.",
    career_category: "Digital Marketing"
  },
  {
    id: 6,
    title: "Content Writer & Proofreader",
    organization: "Vani Publishing Guild",
    location: "Remote",
    job_type: "Remote",
    required_skills: ["Content Writing", "Spoken English", "Word", "MS Office"],
    required_hours: 4,
    minimum_experience: 0.0,
    salary: "₹12,000 - ₹18,000 / month",
    description: "Draft educational blogs, newsletters, and social media blurbs in English and Hindi. Zero commute, beginner-friendly with style guide provided.",
    career_category: "Content Writing"
  },
  {
    id: 7,
    title: "Back Office & MIS Assistant",
    organization: "Mahila Samriddhi Co-op Bank",
    location: "Pune",
    job_type: "On-site",
    required_skills: ["Excel", "MS Office", "Data Entry", "Computer Basics"],
    required_hours: 6,
    minimum_experience: 2.0,
    salary: "₹18,000 - ₹24,000 / month",
    description: "Branch back-office role handling account verification, ledger balancing, and customer file indexing. Includes on-campus mother-child day support.",
    career_category: "Data Entry"
  },
  {
    id: 8,
    title: "Tailoring Assistant & Boutique Supervisor",
    organization: "KalaKriti Women Collective",
    location: "Pune",
    job_type: "On-site",
    required_skills: ["Tailoring", "Garment Making", "Embroidery", "Quality Check"],
    required_hours: 6,
    minimum_experience: 1.0,
    salary: "₹14,000 - ₹19,000 / month",
    description: "Supervise cutting, stitching, and finishing of designer apparel. Safe, all-women workplace with subsidized lunch and crèche support.",
    career_category: "Tailoring"
  },
  {
    id: 9,
    title: "Sales & Telecaller Coordinator",
    organization: "Utkarsh Wellness Group",
    location: "Pune",
    job_type: "Remote",
    required_skills: ["Sales", "Communication", "Telecalling", "Customer Service"],
    required_hours: 4,
    minimum_experience: 0.0,
    salary: "₹13,000 - ₹17,000 / month + Incentives",
    description: "Call existing wellness club members to explain new health consultation packages. Dedicated afternoon calling window between 1 PM and 5 PM.",
    career_category: "Sales"
  },
  {
    id: 10,
    title: "Healthcare Support Assistant",
    organization: "Sanjeevani Community Clinic",
    location: "Pune",
    job_type: "Hybrid",
    required_skills: ["Healthcare", "Patient Care", "Communication", "Computer Basics"],
    required_hours: 6,
    minimum_experience: 1.0,
    salary: "₹17,000 - ₹23,000 / month",
    description: "Assist clinic reception, schedule tele-consultations, and manage patient token registrations. Flexible half-day rotations.",
    career_category: "Healthcare"
  },
  {
    id: 11,
    title: "Graphic & Social Media Designer",
    organization: "CreativeNari Studios",
    location: "Bengaluru",
    job_type: "Remote",
    required_skills: ["Canva", "Digital Marketing", "Social Media", "Creativity"],
    required_hours: 4,
    minimum_experience: 0.0,
    salary: "₹16,000 - ₹22,000 / month",
    description: "Create engaging banners, product posters, and infographics for women-led startups using Canva and basic editing tools. Completely work from home.",
    career_category: "Digital Marketing"
  },
  {
    id: 12,
    title: "Telephonic Helpdesk Representative",
    organization: "JanSeva Helpline Services",
    location: "Delhi",
    job_type: "Remote",
    required_skills: ["Customer Support", "Communication", "Telecalling", "Computer Basics"],
    required_hours: 4,
    minimum_experience: 0.0,
    salary: "₹13,500 - ₹17,500 / month",
    description: "Answer civic queries, register grievance tickets, and guide citizens to appropriate municipal services. Flexible 4-hour shifts with paid training.",
    career_category: "Customer Support"
  }
];

export const DEMO_COURSES = [
  {
    id: 1,
    name: "Advanced Excel & MIS Reporting for Professionals",
    provider: "Skill India / NSDC",
    skill_category: "Data Entry",
    duration: "4 Weeks (1 hr/day)",
    level: "Beginner to Intermediate",
    mode: "Online Free",
    description: "Master VLOOKUP, XLOOKUP, Pivot Tables, and automated data cleaning for high-paying back-office and remote data entry roles.",
    url: "https://www.skillindiadigital.gov.in",
    is_free: true,
    rating: 4.9
  },
  {
    id: 2,
    name: "Digital Marketing & Social Media for Beginners",
    provider: "SWAYAM / NPTEL Free Education",
    skill_category: "Digital Marketing",
    duration: "6 Weeks (Self-Paced)",
    level: "Beginner",
    mode: "Online Free",
    description: "Learn search engine marketing, Canva design, Facebook business manager, and WhatsApp campaigns with zero prior marketing experience.",
    url: "https://swayam.gov.in",
    is_free: true,
    rating: 4.8
  },
  {
    id: 3,
    name: "Python Programming Fundamentals for Women Returning to Tech",
    provider: "SakhiTech Coding Academy",
    skill_category: "Software/IT",
    duration: "8 Weeks (Flexible)",
    level: "Beginner",
    mode: "Online Free",
    description: "A step-by-step introduction to Python syntax, basic logic, data structures, and practical automation scripts. Mentorship provided by women engineers.",
    url: "https://www.sakhi-tech.example.org",
    is_free: true,
    rating: 4.9
  },
  {
    id: 4,
    name: "Web Development Starter: HTML, CSS & Modern JavaScript",
    provider: "FreeCodeCamp & SakhiSetu Initiative",
    skill_category: "Software/IT",
    duration: "8 Weeks",
    level: "Beginner",
    mode: "Online Free",
    description: "Build responsive websites, interactive forms, and clean portfolios. Completely free curriculum with practice exercises and peer forums.",
    url: "https://www.freecodecamp.org",
    is_free: true,
    rating: 4.8
  },
  {
    id: 5,
    name: "Spoken English & Workplace Communication Mastery",
    provider: "Aarohan Foundation",
    skill_category: "Customer Support",
    duration: "3 Weeks",
    level: "Beginner",
    mode: "Online Free",
    description: "Build conversational fluency, email etiquette, call handling confidence, and interview presentation skills for remote customer support jobs.",
    url: "https://aarohan.example.org",
    is_free: true,
    rating: 4.7
  },
  {
    id: 6,
    name: "Computer Basics & Fast Touch-Typing Certification",
    provider: "National Career Service (NCS)",
    skill_category: "Data Entry",
    duration: "2 Weeks",
    level: "Beginner",
    mode: "Online Free",
    description: "Learn keyboard ergonomics, 40+ WPM typing speed, operating system navigation, file folders, and Google Drive / OneDrive sharing.",
    url: "https://www.ncs.gov.in",
    is_free: true,
    rating: 4.8
  },
  {
    id: 7,
    name: "Financial Literacy & Household Budgeting for Single Mothers",
    provider: "SEBI / RBI Financial Inclusion Wing",
    skill_category: "Financial Literacy",
    duration: "2 Weeks",
    level: "All Levels",
    mode: "Online Free",
    description: "Learn emergency fund planning, Sukanya Samriddhi Yojana, PPF, micro-insurance, and avoiding loan scams to secure your child's financial future.",
    url: "https://www.sebi.gov.in",
    is_free: true,
    rating: 4.9
  },
  {
    id: 8,
    name: "Professional Tailoring, Pattern Drafting & Boutique Setup",
    provider: "PMKVY 4.0 Skill Center",
    skill_category: "Tailoring",
    duration: "6 Weeks",
    level: "Beginner",
    mode: "Hybrid / Center-Assisted",
    description: "Comprehensive hands-on training in machine operation, blouse cutting, dressmaking, pricing, and setting up an independent home boutique.",
    url: "https://www.pmkvyofficial.org",
    is_free: true,
    rating: 4.9
  },
  {
    id: 9,
    name: "Customer Care & Telecalling Professional Certification",
    provider: "JanSeva Academy",
    skill_category: "Customer Support",
    duration: "3 Weeks",
    level: "Beginner",
    mode: "Online Free",
    description: "Master CRM software, conflict resolution, active listening, and telephonic etiquette for high-demand remote support roles.",
    url: "https://janseva.example.org",
    is_free: true,
    rating: 4.7
  },
  {
    id: 10,
    name: "Healthcare & Patient Care Assistant Foundation",
    provider: "Pragati Health Institute",
    skill_category: "Healthcare",
    duration: "4 Weeks",
    level: "Beginner",
    mode: "Online Free",
    description: "Understand primary medical terminology, patient appointments, EHR record maintenance, and empathetic communication for clinical assistants.",
    url: "https://pragatihealth.example.org",
    is_free: true,
    rating: 4.8
  }
];

export const DEMO_SCHEMES = [
  {
    id: 1,
    name: "Mission Shakti (Sambal & Samarthya)",
    description: "An integrated women empowerment program by the Ministry of Women and Child Development focusing on safety, rehabilitation, working women hostels, and economic self-reliance for vulnerable and single mothers.",
    who_it_helps: "Single mothers, destitute women, widows, and female breadwinners.",
    eligibility: "Indian female citizens, with special facilitation for single/separated mothers, widows, and low-income households. Priority given to vulnerable families.",
    required_documents: "Aadhaar card, Bank passbook, Proof of single/separated status or death certificate of spouse (if applicable), Income certificate.",
    official_url: "https://wcd.nic.in/schemes/mission-shakti",
    category: "Women Empowerment & Safety"
  },
  {
    id: 2,
    name: "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
    description: "A direct benefit transfer (DBT) scheme providing financial assistance of ₹5,000 to ₹6,000 for mothers to support nutritional needs and healthcare for their children.",
    who_it_helps: "Pregnant women and lactating mothers with children up to age 2.",
    eligibility: "Mothers from economically vulnerable categories, SC/ST, BPL card holders, or families with income below statutory limit.",
    required_documents: "Mother and child protection (MCP) card, Aadhaar card, Child birth certificate, Bank account linked to Aadhaar.",
    official_url: "https://pmmvy.wcd.gov.in",
    category: "Maternal & Child Health"
  },
  {
    id: 3,
    name: "National Career Service (NCS) - Women's Special Window",
    description: "A national portal connecting women jobseekers with verified employers offering work-from-home, part-time, and flexible shift roles, alongside free career counselling.",
    who_it_helps: "All women seeking flexible employment, career restart, or skill upgrades.",
    eligibility: "Minimum 18 years of age. Open to all education levels from 10th pass to postgraduates.",
    required_documents: "Aadhaar Card or Photo ID, Educational certificates, Resume/Bio-data.",
    official_url: "https://www.ncs.gov.in",
    category: "Employment & Career"
  },
  {
    id: 4,
    name: "Pradhan Mantri Kaushal Vikas Yojana (PMKVY 4.0)",
    description: "Offers free government-certified industry skill training and stipend assistance across domains including IT, Data Entry, Healthcare Assistance, and Garment Construction.",
    who_it_helps: "Unemployed women, school/college dropouts, and mothers seeking market-aligned vocational skills.",
    eligibility: "Indian nationals aged 18-45 years with valid identity proof.",
    required_documents: "Aadhaar Card, Bank account details, Educational proof (10th/12th/Graduation if available).",
    official_url: "https://www.pmkvyofficial.org",
    category: "Skill Development"
  },
  {
    id: 5,
    name: "Support to Training and Employment Programme (STEP / Mahila E-Haat)",
    description: "Aims to provide skills that give employability to women and to provide competencies that enable women to become self-employed/entrepreneurs.",
    who_it_helps: "Women aged 16 and above, particularly marginalized and single mothers looking to run micro-enterprises.",
    eligibility: "Women seeking self-employment in agriculture, handicrafts, tailoring, food processing, or digital services.",
    required_documents: "Aadhaar card, Proof of residence, Self-declaration of intent/trade.",
    official_url: "https://wcd.nic.in/schemes/support-training-and-employment-programme-women-step",
    category: "Entrepreneurship"
  },
  {
    id: 6,
    name: "Stand-Up India Scheme for Women Entrepreneurs",
    description: "Facilitates bank loans between ₹10 lakh and ₹1 crore to at least one woman borrower per bank branch for setting up greenfield trading, manufacturing, or service ventures.",
    who_it_helps: "Women looking to start an enterprise or formal boutique/tech agency.",
    eligibility: "Women entrepreneurs aged 18+ years; enterprise must be greenfield (first venture).",
    required_documents: "Project proposal, Identity proof, Address proof, PAN card, Business registration.",
    official_url: "https://www.standupmitra.in",
    category: "Business Financing"
  },
  {
    id: 7,
    name: "Palna – National Crèche Scheme for Working Mothers",
    description: "Centrally sponsored scheme providing daycare facilities for children (6 months to 6 years) of working mothers, including nutritional supplementation, immunization monitoring, and early learning.",
    who_it_helps: "Working single mothers, mothers in unorganized sectors, and informal workers.",
    eligibility: "Children of working women aged 6 months to 6 years. Special preference for single mothers.",
    required_documents: "Birth certificate of child, Mother's employment declaration or self-employment card, Aadhaar card.",
    official_url: "https://wcd.nic.in/schemes/national-creche-scheme",
    category: "Childcare & Social Security"
  },
  {
    id: 8,
    name: "Sukanya Samriddhi Yojana (Child Future Savings)",
    description: "Government-backed savings scheme for girl child with high tax-free interest rates (8.2%) ensuring educational and financial security.",
    who_it_helps: "Mothers with girl child below age 10.",
    eligibility: "Girl child under 10 years of age. One account per child.",
    required_documents: "Child birth certificate, Mother/Guardian Aadhaar and PAN card, Proof of address.",
    official_url: "https://www.indiapost.gov.in",
    category: "Child Welfare & Financial Security"
  }
];

export const DEMO_CHILDCARE = [
  {
    id: 1,
    name: "Punarjani Shishu Palan Kendra & Crèche",
    location: "Pune (Kothrud)",
    address: "Plot 14, Near Vanaz Metro Station, Kothrud, Pune, Maharashtra 411038",
    contact: "+91 98230 11223 | care@punarjani.org",
    services: "Infant Daycare (6mo - 3yr), After-school Support (4yr - 10yr), Subsidized Meal Program, Single Mother Fee Waiver",
    opening_hours: "08:00 AM - 07:00 PM (Mon-Sat)",
    latitude: 18.5074,
    longitude: 73.8077
  },
  {
    id: 2,
    name: "Vatsalya Mother & Child Community Center",
    location: "Pune (Shivajinagar)",
    address: "B-4, Model Colony, Shivajinagar, Pune, Maharashtra 411016",
    contact: "+91 98231 44556 | support@vatsalya.org",
    services: "Emergency Crèche, Toddler Learning Playgroup, Homework Assistance, Health Checkups",
    opening_hours: "08:30 AM - 06:30 PM (Mon-Sat)",
    latitude: 18.5314,
    longitude: 73.8446
  },
  {
    id: 3,
    name: "Sahyadri Little Angels Daycare",
    location: "Pune (Hadapsar)",
    address: "Shop 12-14, Mega City Complex, Magarpatta Road, Hadapsar, Pune 411028",
    contact: "+91 98232 77889 | info@sahyadri-angels.org",
    services: "CCTV-Monitored Infant Rooms, Evening Extended Shifts, Doctor On-Call, 35% Single Mother Concession",
    opening_hours: "07:30 AM - 08:30 PM (Mon-Sat)",
    latitude: 18.5089,
    longitude: 73.9259
  },
  {
    id: 4,
    name: "Anganwadi Urban Model Crèche #12",
    location: "Pune (Swargate)",
    address: "Municipal Community Hall, Near Swargate Bus Station, Pune 411042",
    contact: "+91 20 2444 8899 | wcd-pune@mah.gov.in",
    services: "100% Free Government Anganwadi Daycare, Supplementary Nutrition (Midday Porridge & Fruit), Early Childhood Education",
    opening_hours: "09:00 AM - 05:00 PM (Mon-Fri)",
    latitude: 18.5018,
    longitude: 73.8584
  },
  {
    id: 5,
    name: "Matruchhaya Daycare & Learning Center",
    location: "Mumbai (Dadar)",
    address: "Near Plaza Cinema, Dadar West, Mumbai, Maharashtra 400028",
    contact: "+91 98200 55443 | matruchhaya@ngo.in",
    services: "Infant and Toddler Daycare, Storytelling & Activity Club, Single Mother Support Circle",
    opening_hours: "08:00 AM - 07:30 PM (Mon-Sat)",
    latitude: 19.0178,
    longitude: 72.8478
  },
  {
    id: 6,
    name: "Nanhi Muskaan Community Crèche",
    location: "Bengaluru (Indiranagar)",
    address: "100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038",
    contact: "+91 80 4123 9988 | contact@nanhimuskaan.org",
    services: "Flexible Hourly Daycare, Nutritious Snack Basket, Early Montessori Training",
    opening_hours: "08:30 AM - 07:00 PM (Mon-Sat)",
    latitude: 12.9719,
    longitude: 77.6412
  },
  {
    id: 7,
    name: "Jan Kalyan Daycare & After-School Hub",
    location: "Delhi (Lajpat Nagar)",
    address: "Block C, Lajpat Nagar IV, South Delhi, New Delhi 110024",
    contact: "+91 11 2984 5511 | care@jankalyandelhi.org",
    services: "Infant Care & Homework Support, Subsidized Single Working Mother Slots, CCTV Access, Hot Lunches",
    opening_hours: "08:00 AM - 07:00 PM (Mon-Sat)",
    latitude: 28.5677,
    longitude: 77.2433
  },
  {
    id: 8,
    name: "Anandi Gopal Women & Child Welfare Crèche",
    location: "Jaipur (Mansarovar)",
    address: "Sector 7, Near Technology Park, Mansarovar, Jaipur, Rajasthan 302020",
    contact: "+91 141 2780 432 | support@anandigopaljaipur.org",
    services: "Integrated Anganwadi & Crèche Facility, Nutritious Diet, 50% Subsidy for Single Mothers",
    opening_hours: "08:30 AM - 06:30 PM (Mon-Sat)",
    latitude: 26.8532,
    longitude: 75.7681
  }
];

// Pure JavaScript Rule-Based Intelligent Matching Engine
// Calculates exact scores (0-100%) and reasons without needing backend server
export function calculateClientRecommendations(userProfile) {
  const profile = userProfile || DEMO_PROFILES[0].data;
  const userSkills = (profile.skills || []).map(s => s.toLowerCase());
  const userHours = parseInt(profile.available_hours || 4, 10);
  const userCity = (profile.city || '').toLowerCase();
  const userExp = parseFloat(profile.years_of_experience || 0);

  const rankedJobs = DEMO_JOBS.map(job => {
    const jobSkills = (job.required_skills || []).map(s => s.toLowerCase());
    
    // 1. Skill Score (40% weight)
    const matchedSkills = jobSkills.filter(js => 
      userSkills.some(us => us.includes(js) || js.includes(us))
    );
    const missingSkills = (job.required_skills || []).filter(js => 
      !userSkills.some(us => us.includes(js.toLowerCase()) || js.toLowerCase().includes(us))
    );
    const skillScore = jobSkills.length > 0 
      ? Math.round((matchedSkills.length / jobSkills.length) * 100) 
      : 80;

    // 2. Time Score (20% weight)
    let timeScore = 25;
    let timeReason = "";
    if (userHours >= job.required_hours) {
      timeScore = 100;
      timeReason = `Fits your daily ${userHours}-hour limit (${job.required_hours} hrs needed)`;
    } else if (userHours >= job.required_hours - 1) {
      timeScore = 75;
      timeReason = `Close match: Requires ${job.required_hours} hrs (you offered ${userHours} hrs)`;
    } else if (userHours >= job.required_hours - 2) {
      timeScore = 50;
      timeReason = `Requires ${job.required_hours} hrs (partially exceeds your ${userHours}-hour schedule)`;
    } else {
      timeReason = `Exceeds your schedule: Requires ${job.required_hours} hrs`;
    }

    // 3. Location Score (20% weight)
    let locationScore = 30;
    let locationReason = "";
    const isRemote = job.job_type === "Remote";
    const isHybrid = job.job_type === "Hybrid";
    const isSameCity = userCity && job.location.toLowerCase().includes(userCity);

    if (isRemote) {
      locationScore = 100;
      locationReason = "100% Work from Home: Zero commute required";
    } else if (isSameCity && isHybrid) {
      locationScore = 95;
      locationReason = `Hybrid role in your city (${job.location}) with minimal travel`;
    } else if (isSameCity) {
      locationScore = 85;
      locationReason = `Located in your home city (${job.location})`;
    } else if (isHybrid) {
      locationScore = 55;
      locationReason = `Hybrid role located in ${job.location}`;
    } else {
      locationScore = 30;
      locationReason = `On-site in ${job.location} (relocation or transit required)`;
    }

    // 4. Experience Score (20% weight)
    let expScore = 35;
    let expReason = "";
    if (userExp >= job.minimum_experience) {
      expScore = 100;
      expReason = `Experience criteria fully met (${userExp} yrs vs ${job.minimum_experience} required)`;
    } else if (userExp >= job.minimum_experience - 0.5) {
      expScore = 80;
      expReason = `Acceptable experience: Fresher/career-break friendly`;
    } else if (userExp >= job.minimum_experience - 1.0) {
      expScore = 60;
      expReason = `Entry-level suitable with slight learning curve`;
    } else {
      expScore = 35;
      expReason = `Role prefers ${job.minimum_experience}+ yrs experience`;
    }

    // Weighted Formula
    const finalScore = Math.round(
      (skillScore * 0.40) +
      (timeScore * 0.20) +
      (locationScore * 0.20) +
      (expScore * 0.20)
    );

    // Reasons breakdown
    const reasons = [];
    if (matchedSkills.length > 0) {
      reasons.push(`Skills matched: ${matchedSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}`);
    } else {
      reasons.push("Open to foundational skill backgrounds (onboarding provided)");
    }
    reasons.push(timeReason);
    reasons.push(locationReason);
    reasons.push(expReason);

    return {
      ...job,
      match_percentage: finalScore,
      score_breakdown: {
        skill_score: skillScore,
        time_score: timeScore,
        location_score: locationScore,
        experience_score: expScore
      },
      matching_reasons: reasons,
      matched_skills: matchedSkills,
      missing_skills: missingSkills
    };
  });

  // Sort descending by match score
  rankedJobs.sort((a, b) => b.match_percentage - a.match_percentage);

  // Collect missing skills for bridge courses
  const allMissingSkills = new Set();
  rankedJobs.slice(0, 3).forEach(j => {
    (j.missing_skills || []).forEach(ms => allMissingSkills.add(ms.toLowerCase()));
  });

  const bridgeCourses = DEMO_COURSES.filter(c => {
    const cat = c.skill_category.toLowerCase();
    return Array.from(allMissingSkills).some(ms => cat.includes(ms) || ms.includes(cat));
  });

  return {
    profile,
    ranked_jobs: rankedJobs,
    recommended_courses: bridgeCourses.length > 0 ? bridgeCourses.slice(0, 4) : DEMO_COURSES.slice(0, 3),
    recommended_schemes: DEMO_SCHEMES.slice(0, 3),
    childcare_centers: DEMO_CHILDCARE.slice(0, 3),
    career_roadmap: [
      {
        step: 1,
        title: "Immediate Placement",
        description: `Apply for top ranked match: "${rankedJobs[0]?.title}" (${rankedJobs[0]?.match_percentage}% compatibility).`
      },
      {
        step: 2,
        title: "Skill Certification",
        description: `Enroll in free course "${DEMO_COURSES[0]?.name}" to bridge resume prerequisites.`
      },
      {
        step: 3,
        title: "Social Welfare Benefit",
        description: "Submit indicative documents for Mission Shakti and PMMVY child nutrition allowance."
      },
      {
        step: 4,
        title: "Childcare Support",
        description: `Connect with "${DEMO_CHILDCARE[0]?.name}" for subsidized day crèche during work hours.`
      }
    ],
    summary: {
      total_ranked_jobs: rankedJobs.length,
      top_score: rankedJobs[0]?.match_percentage || 0,
      career_category: profile.career_preference
    }
  };
}
