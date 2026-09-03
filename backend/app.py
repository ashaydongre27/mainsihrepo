"""
Flask Backend for Academia - Industry Collaboration Portal (JOBLEX)
Ministry of Ayush / All India Institute of Ayurveda Problem Statement ID: 26044
"""

import os
import json
import uuid
import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
app = Flask(__name__, static_folder=ROOT_DIR, static_url_path='')
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/')
def serve_index():
    return app.send_static_file('index.html')

# In-memory database with pre-seeded demo state for SIH presentation
DB = {
    "users": [
        {
            "id": "usr-student-01",
            "name": "Ashay Verma",
            "email": "student@nexus.edu",
            "password": "password123",
            "role": "student",
            "institution": "All India Institute of Ayurveda (AIIA), New Delhi",
            "department": "Ayurvedic Pharmacology & Data Science",
            "year": "3rd Year BAMS / Health Informatics",
            "xp": 1450,
            "streak": 7,
            "decayFrozenUntil": (datetime.datetime.now() + datetime.timedelta(days=3)).isoformat(),
            "skills": ["Herbal Formulation", "Python", "Ayurvedic Pharmacognosy", "Data Analysis", "Good Laboratory Practice (GLP)"]
        },
        {
            "id": "usr-academy-01",
            "name": "Dr. Sunita Sharma",
            "email": "dean@aiia.gov.in",
            "password": "password123",
            "role": "academy",
            "institution": "All India Institute of Ayurveda",
            "designation": "Dean of Academic Affairs & Industry Liaison",
            "department": "Faculty of Ayurveda & Pharmaceutical Technology"
        },
        {
            "id": "usr-industry-01",
            "name": "Rajesh Malhotra",
            "email": "hr@dabur-research.com",
            "password": "password123",
            "role": "industry",
            "company": "Dabur Research & Development Ltd.",
            "designation": "Head of University Relations & Talent Acquisition",
            "sector": "Ayurvedic Formulations & Phytopharmaceuticals"
        }
    ],
    "opportunities": [
        {
            "id": "opp-1",
            "title": "Phytochemical Research Intern",
            "company": "Dabur India Ltd.",
            "type": "Internship",
            "skills": ["Herbal Formulation", "Clinical Research", "Phytochemistry", "GLP"],
            "location": "Ghaziabad / Hybrid",
            "stipend": "₹22,000/mo",
            "deadline": "2026-10-15",
            "match": 92,
            "description": "Work on standardization and chromatographic profiling of classical Ayurvedic herbal formulations."
        },
        {
            "id": "opp-2",
            "title": "Ayush AI Innovation Challenge 2026",
            "company": "Ministry of Ayush & AIIA",
            "type": "Hackathon",
            "skills": ["Python", "Machine Learning", "NLP for Classical Texts", "Data Science"],
            "location": "New Delhi / National",
            "stipend": "Cash Bounty: ₹3,00,000",
            "deadline": "2026-11-01",
            "match": 88,
            "description": "National hackathon to build predictive Prakriti assessment engines and herbal drug-interaction databases."
        },
        {
            "id": "opp-3",
            "title": "Formulation Development Scientist",
            "company": "Patanjali Research Foundation",
            "type": "Job",
            "skills": ["Ayurvedic Pharmacognosy", "Nanotechnology in Herbal Drug Delivery", "Quality Control"],
            "location": "Haridwar",
            "stipend": "₹8.5 - 12.0 LPA",
            "deadline": "2026-10-30",
            "match": 75,
            "description": "Full-time position for postgraduate researchers in formulation optimization and stability testing."
        },
        {
            "id": "opp-4",
            "title": "Health Informatics & EHR Analytics Intern",
            "company": "Himalaya Wellness Company",
            "type": "Internship",
            "skills": ["Python", "Clinical Trials Data", "Health Informatics"],
            "location": "Bengaluru",
            "stipend": "₹25,000/mo",
            "deadline": "2026-10-25",
            "match": 84,
            "description": "Analyze clinical registry data for traditional formulation efficacy and adverse event monitoring."
        }
    ],
    "mou_partnerships": [
        {
            "id": "mou-01",
            "partner": "Dabur Research Laboratories",
            "institution": "All India Institute of Ayurveda",
            "status": "Active",
            "signedDate": "2025-06-12",
            "validUntil": "2028-06-12",
            "focusAreas": ["Nanomedicine in Ayurveda", "Student Internships", "Joint Patents"],
            "internshipsProvided": 18,
            "curriculumSponsors": "Standardization of Kwatha Formulations"
        },
        {
            "id": "mou-02",
            "partner": "Himalaya Drug Company",
            "institution": "All India Institute of Ayurveda",
            "status": "Active",
            "signedDate": "2025-09-20",
            "validUntil": "2027-09-20",
            "focusAreas": ["Pharmacovigilance", "Clinical Trial Protocols", "Faculty Industrial Training"],
            "internshipsProvided": 12,
            "curriculumSponsors": "Computational Herbal Discovery"
        },
        {
            "id": "mou-03",
            "partner": "Aimil Pharmaceuticals",
            "institution": "All India Institute of Ayurveda",
            "status": "Reviewing Renewal",
            "signedDate": "2024-02-15",
            "validUntil": "2026-12-31",
            "focusAreas": ["Metabolic Disorders Formulations", "Sponsored PG Dissertations"],
            "internshipsProvided": 9,
            "curriculumSponsors": "Herbal Quality Control & HPTLC"
        }
    ],
    "syllabus_suggestions": [
        {
            "id": "syl-01",
            "currentTopic": "Traditional Dravyaguna & Pharmacognosy (Paper III)",
            "suggestedAddition": "Computational Phytochemical Screening & AI-Assisted Target Binding",
            "source": "MoU Advisory Committee (Dabur Research Labs)",
            "urgency": "High - Industry Skill Gap",
            "status": "Proposed",
            "creditsImpact": "+1 Practical Credit"
        },
        {
            "id": "syl-02",
            "currentTopic": "Rasa Shastra & Bhaishajya Kalpana (Herbal Manufacturing)",
            "suggestedAddition": "Modern GMP Standards, Cleanroom Automation & Lyophilization",
            "source": "Aimil Pharma & Ministry of Ayush Industry Council",
            "urgency": "Medium",
            "status": "Under Review",
            "creditsImpact": "Integrated Lab Module"
        },
        {
            "id": "syl-03",
            "currentTopic": "Clinical Diagnostic Methodology in Ayurveda",
            "suggestedAddition": "Standardized Case Record Forms (CRF) & Clinical Trials Registry-India (CTRI) Protocols",
            "source": "Himalaya Wellness & ICMR Guidelines",
            "urgency": "High",
            "status": "Approved by Board of Studies",
            "creditsImpact": "Elective Certification"
        }
    ],
    "consultancy_grants": [
        {
            "id": "cg-01",
            "title": "Standardization of Ashwagandha Active Withanolides in Water-Soluble Matrix",
            "industry": "Dabur R&D",
            "grantAmount": "₹18,50,000",
            "deadline": "2026-11-15",
            "targetDept": "Dravyaguna / Pharmaceutical Sciences",
            "status": "Open for Faculty Proposals"
        },
        {
            "id": "cg-02",
            "title": "Bio-Efficacy Validation of Triphala Nano-Suspension in Gut Microbiome Models",
            "industry": "Himalaya Drug Co.",
            "grantAmount": "₹24,00,000",
            "deadline": "2026-12-01",
            "targetDept": "Kaya Chikitsa & Microbiology",
            "status": "Open for Faculty Proposals"
        }
    ],
    "fdp_programs": [
        {
            "id": "fdp-01",
            "title": "Industrial Immersion in High-Throughput Herbal Extraction & HPTLC",
            "organizer": "National Medicinal Plants Board (NMPB) & Dabur Labs",
            "duration": "2 Weeks (Hands-on Lab Immersion)",
            "mode": "Offline at R&D Campus, Ghaziabad",
            "eligibility": "Assistant / Associate Professors in Ayush",
            "enrolled": 24,
            "seats": 30
        },
        {
            "id": "fdp-02",
            "title": "Generative AI & Data Analytics for Traditional Medicine Curriculums",
            "organizer": "All India Institute of Ayurveda & IIT Delhi Ayush Cell",
            "duration": "1 Week (30 Hours)",
            "mode": "Hybrid (Virtual + Weekend Hands-on)",
            "eligibility": "All Ayush Faculty Members",
            "enrolled": 68,
            "seats": 100
        }
    ],
    "student_roadmap": {
        "userId": "usr-student-01",
        "careerGoal": "Ayush Health-Tech & Formulation Specialist",
        "currentLevel": "Level 3 - Intermediate Innovator",
        "totalXp": 1450,
        "streakDays": 7,
        "decayStatus": "Active - Decay Frozen for 72 hrs",
        "milestones": [
            {
                "id": "m1",
                "phase": "Phase 1: Foundations & Classical Fundamentals",
                "status": "Completed",
                "xp": 300,
                "description": "Master foundational botany, Dravyaguna principles, and basic laboratory chemistry.",
                "tasks": [
                    {"id": "t1-1", "title": "Complete Classical Taxonomy Assessment", "done": True},
                    {"id": "t1-2", "title": "Good Laboratory Practices (GLP) Safety Certification", "done": True},
                    {"id": "t1-3", "title": "Herbal Raw Material Identification Practicum", "done": True}
                ]
            },
            {
                "id": "m2",
                "phase": "Phase 2: Modern Analytical Tools & Phytochemistry",
                "status": "In Progress",
                "xp": 450,
                "description": "Learn chromatography, UV-Vis spectroscopy, and bio-marker extraction standards.",
                "tasks": [
                    {"id": "t2-1", "title": "HPTLC Fingerprinting for Herbal Formulations", "done": True},
                    {"id": "t2-2", "title": "Python for Chemical Data Analysis & Plotting", "done": True},
                    {"id": "t2-3", "title": "Complete Formulation Stability Testing Quiz", "done": False}
                ]
            },
            {
                "id": "m3",
                "phase": "Phase 3: AI in Herbal Drug Discovery & NLP",
                "status": "Locked",
                "xp": 500,
                "description": "Explore text mining on Charaka & Sushruta Samhita, and molecular docking algorithms.",
                "tasks": [
                    {"id": "t3-1", "title": "NLP for Classical Ayurvedic Sanskrit & Translation Models", "done": False},
                    {"id": "t3-2", "title": "Virtual Screening of Phytoconstituents vs Receptor Targets", "done": False},
                    {"id": "t3-3", "title": "Submit Ayush Innovation Challenge Mini-Project", "done": False}
                ]
            },
            {
                "id": "m4",
                "phase": "Phase 4: Industry Capstone & Placement Readiness",
                "status": "Locked",
                "xp": 600,
                "description": "Direct internship placement with partner companies and institutional verification.",
                "tasks": [
                    {"id": "t4-1", "title": "Verified Digital Portfolio Audit & Recommendation Letter", "done": False},
                    {"id": "t4-2", "title": "Complete Dabur / Patanjali Industry Internship Application", "done": False},
                    {"id": "t4-3", "title": "Clear AI Mock Technical Interview with Zulu", "done": False}
                ]
            }
        ]
    }
}

# ----------------- AUTHENTICATION ROUTES ----------------- #

@app.route("/api/auth/demo-users", methods=["GET"])
def get_demo_users():
    """Return pre-configured demo users for quick 1-click test logins."""
    safe_users = [
        {"name": u["name"], "email": u["email"], "role": u["role"], "label": f"{u['role'].title()} ({u.get('institution') or u.get('company')})"}
        for u in DB["users"]
    ]
    return jsonify({"demoUsers": safe_users})

@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "").strip()
    role = data.get("role", "").strip().lower()

    user = next((u for u in DB["users"] if u["email"].lower() == email), None)
    if not user:
        # For smooth demo presentation: create dynamic demo user if credentials are provided
        user = {
            "id": f"usr-{str(uuid.uuid4())[:8]}",
            "name": email.split("@")[0].replace(".", " ").title(),
            "email": email,
            "password": password or "password123",
            "role": role or "student",
            "institution": "National Institute of Ayurveda" if role != "industry" else "Himalaya Wellness",
            "xp": 1200,
            "streak": 3
        }
        DB["users"].append(user)

    user_info = {k: v for k, v in user.items() if k != "password"}
    token = f"jwt-mock-token-{user['id']}-{int(datetime.datetime.now().timestamp())}"
    return jsonify({"success": True, "token": token, "user": user_info})

@app.route("/api/auth/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    name = data.get("name", "").strip()
    role = data.get("role", "student").strip().lower()
    password = data.get("password", "password123")

    if not email or not name:
        return jsonify({"success": False, "error": "Name and Email are required."}), 400

    existing = next((u for u in DB["users"] if u["email"].lower() == email), None)
    if existing:
        return jsonify({"success": False, "error": "Email already registered. Please login."}), 400

    new_user = {
        "id": f"usr-{str(uuid.uuid4())[:8]}",
        "name": name,
        "email": email,
        "password": password,
        "role": role,
        "institution": data.get("institution", "All India Institute of Ayurveda"),
        "company": data.get("company", "Herbal Pharma Corp"),
        "department": data.get("department", "Ayurvedic Sciences"),
        "xp": 1000,
        "streak": 1,
        "skills": ["General Ayurveda", "Basic Research"]
    }
    DB["users"].append(new_user)
    user_info = {k: v for k, v in new_user.items() if k != "password"}
    return jsonify({"success": True, "user": user_info, "token": f"jwt-{new_user['id']}"})

# ----------------- AI RESUME ANALYZER ROUTE ----------------- #

@app.route("/api/resume/analyze", methods=["POST"])
def analyze_resume():
    """
    Analyzes resume text or structured input, extracts skills, compares
    against standard Ayush / Industry roles, calculates gap scores, and suggests roadmap.
    """
    data = request.get_json() or {}
    resume_text = data.get("resumeText", "")
    target_role = data.get("targetRole", "Herbal Formulation Scientist")

    # Domain skill dictionaries for Ayush & HealthTech
    target_role_standards = {
        "Herbal Formulation Scientist": {
            "requiredSkills": ["Herbal Formulation", "Phytochemistry", "HPTLC / HPLC", "Good Laboratory Practice (GLP)", "Formulation Stability", "Sanskrit Classical Lexicon"],
            "softSkills": ["Scientific Documentation", "Regulatory Compliance", "Cross-Functional Collaboration"],
            "industryBenchmark": 85
        },
        "AI Health Data Analyst (Ayush)": {
            "requiredSkills": ["Python", "Machine Learning", "Data Analysis", "Health Informatics", "Biostatistics", "EHR Systems"],
            "softSkills": ["Data Storytelling", "Critical Thinking", "Problem Solving"],
            "industryBenchmark": 80
        },
        "Clinical Trials Specialist": {
            "requiredSkills": ["Clinical Research", "GCP Guidelines", "Pharmacovigilance", "Trial Protocol Design", "CTRI Documentation"],
            "softSkills": ["Patient Communication", "Ethical Governance", "Team Leadership"],
            "industryBenchmark": 90
        }
    }

    profile = target_role_standards.get(target_role, target_role_standards["Herbal Formulation Scientist"])
    
    # Check for keywords in candidate text
    lower_text = resume_text.lower()
    found_tech = []
    missing_tech = []
    
    for skill in profile["requiredSkills"]:
        key = skill.lower().split(" ")[0]
        if key in lower_text or skill.lower() in lower_text:
            found_tech.append(skill)
        else:
            missing_tech.append(skill)
            
    # If text was too brief, provide a smart simulated baseline
    if len(found_tech) == 0 and len(resume_text.strip()) > 10:
        found_tech = ["Herbal Formulation", "Python", "Data Analysis"]
        missing_tech = [s for s in profile["requiredSkills"] if s not in found_tech]

    match_percentage = int((len(found_tech) / max(len(profile["requiredSkills"]), 1)) * 100)
    match_percentage = max(45, min(96, match_percentage + 15)) # Normalization

    recommendations = []
    if "HPTLC / HPLC" in missing_tech:
        recommendations.append("Enroll in Dabur-sponsored HPTLC Practical Workshop to gain chromatography exposure.")
    if "Phytochemistry" in missing_tech:
        recommendations.append("Complete Module 4: Extraction & Standardization in the interactive skill tree.")
    if "Python" in missing_tech:
        recommendations.append("Take the 'Python for Herbal Data Analytics' quiz in Quiz Arena to unlock 200 XP.")
    if not recommendations:
        recommendations.append("Your technical skill profile matches 90%+ of requirements! Proceed to direct application.")

    return jsonify({
        "success": True,
        "targetRole": target_role,
        "matchPercentage": match_percentage,
        "benchmark": profile["industryBenchmark"],
        "extractedSkills": found_tech,
        "missingSkills": missing_tech,
        "softSkillsMatched": ["Scientific Documentation", "Teamwork"],
        "recommendations": recommendations,
        "roadmapAction": f"Added {len(missing_tech)} gap modules into your active Career Roadmap."
    })

# ----------------- CAREER ROADMAP & GAMIFICATION ----------------- #

@app.route("/api/roadmap", methods=["GET"])
@app.route("/api/roadmap/get", methods=["GET"])
def get_roadmap():
    return jsonify(DB["student_roadmap"])

@app.route("/api/opportunities", methods=["GET"])
def get_opportunities():
    return jsonify({"opportunities": DB["opportunities"]})

@app.route("/api/roadmap/toggle-task", methods=["POST"])
def toggle_task():
    data = request.get_json() or {}
    milestone_id = data.get("milestoneId")
    task_id = data.get("taskId")

    rm = DB["student_roadmap"]
    updated = False
    xp_gained = 0

    for m in rm["milestones"]:
        if m["id"] == milestone_id:
            for t in m["tasks"]:
                if t["id"] == task_id:
                    t["done"] = not t["done"]
                    updated = True
                    if t["done"]:
                        xp_gained = 50
                        rm["totalXp"] += 50
                    else:
                        rm["totalXp"] = max(0, rm["totalXp"] - 50)
            
            # Check if all tasks in milestone are completed
            all_done = all(t["done"] for t in m["tasks"])
            if all_done and m["status"] != "Completed":
                m["status"] = "Completed"
                xp_gained += 150
                rm["totalXp"] += 150

    return jsonify({
        "success": updated,
        "xpGained": xp_gained,
        "newTotalXp": rm["totalXp"],
        "roadmap": rm
    })

@app.route("/api/roadmap/check-in", methods=["POST"])
def check_in():
    rm = DB["student_roadmap"]
    rm["streakDays"] += 1
    rm["totalXp"] += 75
    rm["decayStatus"] = "Active - Decay Frozen for 72 hrs"
    return jsonify({
        "success": True,
        "message": "Daily Check-in recorded! +75 XP awarded, Streak incremented, and Point Decay frozen for 72 hours.",
        "streak": rm["streakDays"],
        "totalXp": rm["totalXp"]
    })

# ----------------- ZULU AI CAREER COUNSELOR ----------------- #

@app.route("/api/zulu/chat", methods=["POST"])
def zulu_chat():
    data = request.get_json() or {}
    user_msg = data.get("message", "").strip()

    # Intelligent contextual responses tailored to Ministry of Ayush & Tech
    lower = user_msg.lower()
    if "resume" in lower or "cv" in lower:
        reply = "I see you're asking about your resume! You can use our built-in AI Resume Analyzer tab. Upload your resume and select a target role like 'Herbal Formulation Scientist'. I'll identify your exact skill gaps against Dabur and Patanjali requirements!"
    elif "points" in lower or "decay" in lower or "streak" in lower:
        reply = "Our portal incorporates anti-inactivity gamification: if you don't log in or complete tasks for 3 days, 50 XP/day begins decaying. Hit 'Daily Check-in' on your Career Roadmap to freeze decay and keep your 7-day streak blazing! 🔥"
    elif "mou" in lower or "syllabus" in lower or "curriculum" in lower:
        reply = "JOBLEX facilitates active MoUs between colleges (like AIIA) and industries (Dabur, Himalaya). When an industry submits new skill demands, our AI compares it to the syllabus and proposes modern modules like 'Computational Phytochemistry' directly to university deans!"
    elif "internship" in lower or "job" in lower:
        reply = "We currently have 4 top verified opportunities! Dabur's Phytochemical Research Internship (₹22k/mo) has a 92% skill match with your current profile. Check the Opportunities Board to apply with one click!"
    elif "hackathon" in lower or "challenge" in lower:
        reply = "The Ministry of Ayush is hosting the 'Ayush AI Innovation Challenge 2026' with a ₹3 Lakh bounty! Teams can submit machine learning solutions for Prakriti diagnosis and classical text analysis."
    else:
        reply = f"That's a great question about '{user_msg}'. In the modern Ayush sector, bridging classical Ayurveda with cutting-edge analytical tools (HPTLC, AI molecular docking, EHR systems) makes candidates 3x more employable. Explore the Career Roadmap to build these exact competencies step by step!"

    return jsonify({"success": True, "reply": reply})

# ----------------- ACADEMY & INDUSTRY MODULE DATA ----------------- #

@app.route("/api/academy/all-data", methods=["GET"])
def get_academy_data():
    return jsonify({
        "mouPartnerships": DB["mou_partnerships"],
        "syllabusSuggestions": DB["syllabus_suggestions"],
        "consultancyGrants": DB["consultancy_grants"],
        "fdpPrograms": DB["fdp_programs"],
        "studentStats": {
            "totalEnrolled": 342,
            "avgSkillReadiness": "76.4%",
            "placedUnderMoU": 48,
            "activeResearchProjects": 14
        }
    })

@app.route("/api/industry/all-data", methods=["GET"])
def get_industry_data():
    return jsonify({
        "opportunities": DB["opportunities"],
        "mouPartnerships": DB["mou_partnerships"],
        "candidates": [
            {"name": "Ashay Verma", "dept": "Ayurvedic Pharmacology & AI", "score": 92, "status": "Shortlisted", "skills": ["Herbal Formulation", "Python", "GLP"]},
            {"name": "Pooja Verma", "dept": "Phytochemistry", "score": 86, "status": "Interview Scheduled", "skills": ["HPTLC", "Spectroscopy", "GLP"]},
            {"name": "Arjun Reddy", "dept": "Dravyaguna", "score": 79, "status": "Under Review", "skills": ["Classical Botany", "Clinical Trials"]},
            {"name": "Kavya Singh", "dept": "Health Informatics", "score": 94, "status": "Offer Extended", "skills": ["Machine Learning", "EHR", "Python"]}
        ]
    })

@app.route("/api/industry/post-opportunity", methods=["POST"])
def post_opportunity():
    data = request.get_json() or {}
    new_opp = {
        "id": f"opp-{len(DB['opportunities']) + 1}",
        "title": data.get("title", "Research Associate"),
        "company": data.get("company", "Ayush Industry Partner"),
        "type": data.get("type", "Internship"),
        "skills": data.get("skills", ["Herbal Formulation", "Research"]),
        "location": data.get("location", "New Delhi"),
        "stipend": data.get("stipend", "₹18,000/mo"),
        "deadline": data.get("deadline", "2026-11-30"),
        "match": 85,
        "description": data.get("description", "Opportunity posted via JOBLEX Industry Portal.")
    }
    DB["opportunities"].insert(0, new_opp)
    return jsonify({"success": True, "message": "Opportunity published successfully!", "opportunity": new_opp})

@app.route("/api/industry/submit-skill-demand", methods=["POST"])
def submit_skill_demand():
    data = request.get_json() or {}
    new_syl = {
        "id": f"syl-{len(DB['syllabus_suggestions']) + 1}",
        "currentTopic": data.get("domain", "General Herbal Manufacturing"),
        "suggestedAddition": data.get("skillsNeeded", "Advanced Automated Extraction & Regulatory Dossier Prep"),
        "source": data.get("company", "Industry MoU Advisory Board"),
        "urgency": "High - New Industry Demand",
        "status": "Submitted to Academic Council",
        "creditsImpact": "Proposed Elective"
    }
    DB["syllabus_suggestions"].insert(0, new_syl)
    return jsonify({"success": True, "message": "Skill requirement transmitted to all affiliated Academic Institutions!", "syllabusUpdate": new_syl})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting JOBLEX Flask Backend on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=True)
