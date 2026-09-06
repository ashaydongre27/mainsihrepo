"""
Flask Backend for Academia - Industry Collaboration Portal (JOBLEX)
Ministry of Ayush / All India Institute of Ayurveda Problem Statement ID: 26044
Connected directly to Supabase Postgres Database for:
- Student Applications & Industry Candidate Dossiers Bilateral Sync
- Enterprise Requisitions (Internships, Jobs/Full-Time, Micro-Gigs, Hackathons)
"""

import os
import json
import uuid
import datetime
import urllib.request
import urllib.parse
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
STATIC_DIR = ROOT_DIR
app = Flask(__name__, static_folder=STATIC_DIR, static_url_path='')
CORS(app, resources={r"/api/*": {"origins": "*"}})

# ----------------- SUPABASE DATABASE CONFIGURATION ----------------- #
SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip('/')
SUPABASE_KEY = (
    os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or 
    os.environ.get("SUPABASE_SECRET_KEY") or 
    os.environ.get("SUPABASE_ANON_KEY") or 
    os.environ.get("SUPABASE_PUBLISHABLE_KEY") or 
    ""
)

def supabase_db_request(table, method="GET", data=None, query_params=None):
    """
    Helper function to query Supabase REST DB API directly from Python Flask
    with graceful fallback if keys are missing or offline.
    """
    if not SUPABASE_URL or not SUPABASE_KEY or "placeholder" in SUPABASE_URL:
        return None

    try:
        url = f"{SUPABASE_URL}/rest/v1/{table}"
        if query_params:
            url += f"?{query_params}"

        headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }

        req_data = json.dumps(data).encode("utf-8") if data else None
        req = urllib.request.Request(url, data=req_data, headers=headers, method=method)

        with urllib.request.urlopen(req, timeout=5) as response:
            resp_body = response.read().decode("utf-8")
            return json.loads(resp_body) if resp_body else []
    except Exception as e:
        print(f"[Supabase DB Warning] Table '{table}' {method} failed: {e}")
        return None

# ----------------- IN-MEMORY FALLBACK DATABASE ----------------- #
DB = {
    "users": [
        {
            "id": "usr-student-01",
            "name": "Ayush Scholar",
            "email": "scholar@institution.edu",
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
            "location": "Bengaluru / Hybrid",
            "stipend": "₹25,000/mo",
            "deadline": "2026-10-25",
            "match": 84,
            "description": "Analyze clinical registry data for traditional formulation efficacy and adverse event monitoring."
        },
        {
            "id": "opp-gig-1",
            "title": "Clean & Standardize 50 Ashwagandha Trial Records",
            "company": "Dabur Research Labs",
            "type": "Micro-Gig",
            "skills": ["Data Analysis", "Phytochemistry", "Excel/Python"],
            "location": "Remote (10 Days)",
            "stipend": "₹6,000 Task Bounty",
            "deadline": "2026-10-12",
            "match": 90,
            "description": "Short sprint micro-project to clean chromatographic dataset for Withania somnifera."
        }
    ],
    "applications": [
        {
            "id": "app-seed-01",
            "opportunity_id": "opp-1",
            "opportunity_title": "Phytochemical Research Intern",
            "company": "Dabur India Ltd.",
            "type": "Internship",
            "student_name": "Aarav Sharma",
            "student_email": "aarav.sharma@aiia.gov.in",
            "college": "All India Institute of Ayurveda (AIIA), New Delhi",
            "skills": ["Herbal Formulation", "Phytochemistry", "GLP", "Python"],
            "match": 94,
            "applied_date": "2026-09-03",
            "status": "Shortlisted",
            "verified_badge": "AIIA-CERT-2026-9842",
            "cover_note": "Strong background in botanical extraction protocols and AutoDock docking simulations."
        },
        {
            "id": "app-seed-02",
            "opportunity_id": "opp-2",
            "opportunity_title": "Ayush AI Innovation Challenge 2026",
            "company": "Ministry of Ayush & AIIA",
            "type": "Hackathon",
            "student_name": "Priya Nair",
            "student_email": "priya@nexus.edu",
            "college": "Gujarat Ayurved University, Jamnagar",
            "skills": ["Drug Discovery", "Phytochemistry", "HPTLC", "AutoDock"],
            "match": 96,
            "applied_date": "2026-09-02",
            "status": "Interview Scheduled",
            "verified_badge": "GAU-CERT-2026-1104",
            "cover_note": "Expert in HPTLC standardization and molecular docking."
        },
        {
            "id": "app-seed-03",
            "opportunity_id": "opp-3",
            "opportunity_title": "Formulation Development Scientist",
            "company": "Patanjali Research Foundation",
            "type": "Job",
            "student_name": "Kavya Singh",
            "student_email": "kavya@nexus.edu",
            "college": "AIIA New Delhi",
            "skills": ["Health Informatics", "Python", "NLP for Classical Texts", "SQL"],
            "match": 91,
            "applied_date": "2026-09-04",
            "status": "Pending Review",
            "verified_badge": "AIIA-CERT-2026-8831",
            "cover_note": "Prakriti classification ML models and classical NLP extraction pipelines."
        }
    ],
    "candidates": [
        {"id": "cand-1", "name": "Aarav Sharma", "college": "All India Institute of Ayurveda", "score": 94, "status": "Shortlisted", "skills": ["Herbal Formulation", "Python", "GLP"]},
        {"id": "cand-2", "name": "Pooja Verma", "college": "AIIA New Delhi", "score": 86, "status": "Interview Scheduled", "skills": ["HPTLC", "Spectroscopy", "GLP"]},
        {"id": "cand-3", "name": "Arjun Reddy", "college": "BHU Varanasi", "score": 79, "status": "Under Review", "skills": ["Classical Botany", "Clinical Trials"]},
        {"id": "cand-4", "name": "Kavya Singh", "college": "AIIA New Delhi", "score": 91, "status": "Offer Extended", "skills": ["Machine Learning", "EHR", "Python"]}
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
        }
    ],
    "consultancy_grants": [],
    "fdp_programs": [],
    "student_roadmap": {
        "userId": "usr-student-01",
        "careerGoal": "Ayush Health-Tech & Formulation Specialist",
        "currentLevel": "Level 3 - Intermediate Innovator",
        "totalXp": 1450,
        "streakDays": 7,
        "decayStatus": "Active - Decay Frozen for 72 hrs",
        "milestones": []
    }
}

# ----------------- STATIC PAGE ROUTES ----------------- #

@app.route('/js/<path:filename>')
def serve_js(filename):
    return send_from_directory(os.path.join(ROOT_DIR, 'js'), filename)

@app.route('/css/<path:filename>')
def serve_css(filename):
    return send_from_directory(os.path.join(ROOT_DIR, 'css'), filename)

@app.route('/')
@app.route('/index.html')
def serve_index():
    return send_from_directory(ROOT_DIR, 'index.html')

@app.route('/student')
@app.route('/student.html')
def serve_student():
    return app.send_static_file('student.html')

@app.route('/academy')
@app.route('/academy.html')
def serve_academy():
    return app.send_static_file('academy.html')

@app.route('/industry')
@app.route('/industry.html')
def serve_industry():
    return app.send_static_file('industry.html')

@app.route('/industry-post-opportunity')
@app.route('/industry-post-opportunity.html')
def serve_industry_post_opportunity():
    return send_from_directory(os.path.join(ROOT_DIR, 'src', 'industry'), 'industry-post-opportunity.html')

@app.route('/auth')
@app.route('/auth.html')
def serve_auth():
    return app.send_static_file('auth.html')

# ----------------- AUTHENTICATION ROUTES ----------------- #

@app.route("/api/auth/demo-users", methods=["GET"])
def get_demo_users():
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
    if not user or user.get("password") != password:
        return jsonify({"success": False, "error": "Invalid email or password. Please check your credentials."}), 401

    if role and user.get("role", "").lower() != role:
        return jsonify({"success": False, "error": f"Account Role Mismatch: Account is {user.get('role', '').upper()}, not {role.upper()}."}), 400

    user_info = {k: v for k, v in user.items() if k != "password"}
    token = f"jwt-token-{user['id']}-{int(datetime.datetime.now().timestamp())}"
    return jsonify({"success": True, "token": token, "user": user_info})

# ----------------- OPPORTUNITIES & REQUISITIONS (FULL-TIME & INTERNSHIPS) ----------------- #

@app.route("/api/opportunities", methods=["GET"])
def get_opportunities():
    opp_type = request.args.get("type")

    # Try fetching from Supabase DB
    query_params = "select=*&order=created_at.desc"
    if opp_type and opp_type != "All":
        query_params += f"&type=ilike.{urllib.parse.quote(opp_type)}"
    
    db_opps = supabase_db_request("opportunities", "GET", query_params=query_params)
    if db_opps is not None and isinstance(db_opps, list) and len(db_opps) > 0:
        return jsonify({"opportunities": db_opps})

    # Fallback to local memory DB
    filtered = DB["opportunities"]
    if opp_type and opp_type != "All":
        filtered = [o for o in DB["opportunities"] if o.get("type", "").lower() == opp_type.lower()]
    return jsonify({"opportunities": filtered})

@app.route("/api/opportunities", methods=["POST"])
@app.route("/api/industry/post-opportunity", methods=["POST"])
def post_opportunity():
    data = request.get_json() or {}
    new_opp = {
        "id": f"opp-{str(uuid.uuid4())[:8]}",
        "title": data.get("title", "Ayush Research Associate"),
        "company": data.get("company", "Dabur India Ltd."),
        "type": data.get("type", "Internship"),
        "skills": data.get("skills") if isinstance(data.get("skills"), list) else [s.strip() for s in str(data.get("skills", "Herbal Formulation")).split(",") if s.strip()],
        "location": data.get("location", "Ghaziabad / Hybrid"),
        "stipend": data.get("stipend", "₹22,000/mo"),
        "deadline": data.get("deadline", "2026-11-30"),
        "match": 88,
        "description": data.get("description", "Opportunity published via JOBLEX Enterprise Requisitions Gateway.")
    }

    # Attempt insert to Supabase DB
    supabase_db_request("opportunities", "POST", data=new_opp)

    # Local fallback sync
    DB["opportunities"].insert(0, new_opp)
    return jsonify({
        "success": True, 
        "message": f"Enterprise Requisition '{new_opp['title']}' ({new_opp['type']}) successfully published!", 
        "opportunity": new_opp
    })

# ----------------- STUDENT APPLICATION DISPATCH & INDUSTRY DOSSIERS CONNECT ----------------- #

@app.route("/api/opportunities/apply", methods=["POST"])
@app.route("/api/applications", methods=["POST"])
def apply_opportunity():
    data = request.get_json() or {}

    new_app = {
        "id": f"app-{str(uuid.uuid4())[:8]}",
        "opportunity_id": data.get("opportunityId") or data.get("opportunity_id") or "opp-1",
        "opportunity_title": data.get("opportunityTitle") or data.get("opportunity_title") or "Phytochemical Research Intern",
        "company": data.get("company") or "Dabur India Ltd.",
        "type": data.get("type") or "Internship",
        "student_name": data.get("studentName") or data.get("student_name") or "Verified Scholar",
        "student_email": data.get("studentEmail") or data.get("student_email") or "scholar@institution.edu",
        "college": data.get("college") or "All India Institute of Ayurveda (AIIA), New Delhi",
        "skills": data.get("skills") if isinstance(data.get("skills"), list) else ["Herbal Formulation", "GLP", "Python"],
        "match": int(data.get("match", 92)),
        "applied_date": datetime.date.today().isoformat(),
        "status": "Pending Review",
        "verified_badge": "AIIA-CERT-2026-9842",
        "cover_note": data.get("coverNote") or data.get("cover_note") or "Application submitted with AIIA verified credentials."
    }

    # Dynamic camelCase aliases for legacy frontend compatibility
    new_app["opportunityId"] = new_app["opportunity_id"]
    new_app["opportunityTitle"] = new_app["opportunity_title"]
    new_app["studentName"] = new_app["student_name"]
    new_app["studentEmail"] = new_app["student_email"]
    new_app["appliedDate"] = new_app["applied_date"]
    new_app["verifiedBadge"] = new_app["verified_badge"]
    new_app["coverNote"] = new_app["cover_note"]

    # Insert into Supabase DB
    supabase_db_request("applications", "POST", data=new_app)

    # Local memory sync
    DB["applications"].insert(0, new_app)

    return jsonify({
        "success": True,
        "message": f"Application for '{new_app['opportunity_title']}' transmitted to {new_app['company']} Candidate Dossiers!",
        "application": new_app
    }), 201

@app.route("/api/opportunities/my-applications", methods=["GET"])
def get_my_applications():
    email = request.args.get("email", "").strip().lower()

    query_params = "select=*&order=created_at.desc"
    if email:
        query_params += f"&student_email=ilike.{urllib.parse.quote(email)}"

    db_apps = supabase_db_request("applications", "GET", query_params=query_params)
    if db_apps is not None and isinstance(db_apps, list):
        return jsonify({"applications": db_apps})

    apps = DB["applications"]
    if email:
        apps = [a for a in apps if (a.get("student_email") or a.get("studentEmail") or "").lower() == email]
    return jsonify({"applications": apps})

# ----------------- INDUSTRY CANDIDATE DOSSIERS & REQUISITIONS ----------------- #

@app.route("/api/industry/applications", methods=["GET"])
@app.route("/api/industry/candidate-dossiers", methods=["GET"])
def get_industry_applications():
    company = request.args.get("company")
    app_type = request.args.get("type")

    query_params = "select=*&order=created_at.desc"
    if company and company != "All":
        query_params += f"&company=ilike.*{urllib.parse.quote(company)}*"
    if app_type and app_type != "All":
        query_params += f"&type=ilike.{urllib.parse.quote(app_type)}"

    db_apps = supabase_db_request("applications", "GET", query_params=query_params)
    if db_apps is not None and isinstance(db_apps, list):
        return jsonify({
            "totalApplications": len(db_apps),
            "applications": db_apps
        })

    apps = DB["applications"]
    if company and company != "All":
        apps = [a for a in apps if company.lower() in a.get("company", "").lower()]
    if app_type and app_type != "All":
        apps = [a for a in apps if a.get("type", "").lower() == app_type.lower()]

    return jsonify({
        "totalApplications": len(apps),
        "applications": apps
    })

@app.route("/api/industry/applications/<app_id>/status", methods=["POST"])
@app.route("/api/industry/candidate/<app_id>/status", methods=["POST"])
def update_application_status(app_id):
    data = request.get_json() or {}
    new_status = data.get("status", "Shortlisted")

    # Update in Supabase DB
    supabase_db_request("applications", "PATCH", data={"status": new_status}, query_params=f"id=eq.{app_id}")

    # Update in Local Memory DB
    target_app = next((a for a in DB["applications"] if a.get("id") == app_id), None)
    if target_app:
        target_app["status"] = new_status
        cand_name = target_app.get("student_name") or target_app.get("studentName") or "Candidate"
    else:
        cand_name = "Candidate"

    return jsonify({
        "success": True,
        "message": f"Candidate status updated to '{new_status}' for {cand_name}!",
        "status": new_status
    })

@app.route("/api/industry/requisitions", methods=["GET"])
def get_industry_requisitions():
    db_opps = supabase_db_request("opportunities", "GET", query_params="select=*&order=created_at.desc")
    opps = db_opps if (db_opps is not None and isinstance(db_opps, list)) else DB["opportunities"]

    db_apps = supabase_db_request("applications", "GET", query_params="select=*")
    apps = db_apps if (db_apps is not None and isinstance(db_apps, list)) else DB["applications"]

    # Calculate live applicant count per requisition
    req_list = []
    for opp in opps:
        opp_id = opp.get("id")
        count = sum(1 for a in apps if a.get("opportunity_id") == opp_id or a.get("opportunityId") == opp_id)
        req_item = dict(opp)
        req_item["applicantCount"] = max(count, opp.get("applicantCount", 1))
        req_item["active"] = opp.get("active", True)
        req_list.append(req_item)

    return jsonify({"requisitions": req_list})

@app.route("/api/industry/all-data", methods=["GET"])
def get_industry_data():
    apps = DB["applications"]
    formatted_candidates = []
    for a in apps:
        formatted_candidates.append({
            "id": a.get("id"),
            "name": a.get("student_name") or a.get("studentName"),
            "dept": a.get("college") or "Ayurvedic Pharmacology",
            "score": a.get("match", 90),
            "status": a.get("status", "Pending Review"),
            "skills": a.get("skills", ["Herbal Formulation", "GLP"])
        })

    return jsonify({
        "opportunities": DB["opportunities"],
        "mouPartnerships": DB["mou_partnerships"],
        "candidates": formatted_candidates or DB["candidates"],
        "applications": apps
    })

# ----------------- RESUME, ROADMAP, ZULU & ACADEMY ROUTE HANDLERS ----------------- #

@app.route("/api/resume/analyze", methods=["POST"])
def analyze_resume():
    data = request.get_json() or {}
    resume_text = data.get("resumeText", "")
    target_role = data.get("targetRole", "Herbal Formulation Scientist")

    found_tech = ["Herbal Formulation", "GLP", "Python"] if len(resume_text.strip()) > 10 else ["General Ayurveda"]
    missing_tech = ["HPTLC / HPLC Fingerprinting", "Formulation Stability Protocols"]

    return jsonify({
        "success": True,
        "targetRole": target_role,
        "matchPercentage": 84,
        "benchmark": 88,
        "extractedSkills": found_tech,
        "missingSkills": missing_tech,
        "softSkillsMatched": ["Scientific Documentation", "Ethical Compliance"],
        "recommendations": [
            "Complete HPTLC chromatography module under Dabur MoU sponsorship.",
            "Sync gaps into active Career Roadmap."
        ]
    })

@app.route("/api/roadmap", methods=["GET"])
@app.route("/api/roadmap/get", methods=["GET"])
def get_roadmap():
    return jsonify(DB["student_roadmap"])

@app.route("/api/zulu/chat", methods=["POST"])
def zulu_chat():
    data = request.get_json() or {}
    user_msg = data.get("message", "").strip()
    reply = f"Namaste! 🌿 Zulu AI Counselor here. For your query '{user_msg}', check your Candidate Dossier or active Career Roadmap!"
    return jsonify({"success": True, "reply": reply})

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
            "placedUnderMoU": 48
        }
    })

if __name__ == "__main__":
    port_env = (os.environ.get("PORT") or "5000").strip()
    port = int(port_env) if port_env.isdigit() else 5000
    print(f"Starting JOBLEX Python Flask Backend on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=True)
