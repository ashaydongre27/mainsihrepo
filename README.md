# JOBLEX — Universal Academia-Industry Collaboration & Career Acceleration Platform

[![System Status](https://img.shields.io/badge/System%20Status-Live%20%26%20Operational-brightgreen?style=for-the-badge)]()
[![Build Verification](https://img.shields.io/badge/Build%20Verification-100%25%20Passing-success?style=for-the-badge)]()
[![Security Architecture](https://img.shields.io/badge/Security-SHA--256%20HMAC%20Verified-blue?style=for-the-badge)]()
[![Deployment](https://img.shields.io/badge/Deployment-Vercel%20%2B%20Supabase-orange?style=for-the-badge)]()

---

## 🌟 Executive Overview

**JOBLEX** is an enterprise-grade, multi-portal digital ecosystem engineered to bridge the structural divide between **Students**, **Academic Institutions**, and **Industry Employers**. 

By combining **AI-driven NLP resume parsing**, **hybrid vector matching math**, **interactive 3D skill visualizers**, and **cryptographic HMAC credential verification**, JOBLEX transforms talent discovery and academic governance into an automated, data-transparent, and continuous alignment pipeline across all academic disciplines.

---

## 🏛️ Live Portal Architecture & Module Specifications

```
                                  ┌─────────────────────────────────────────┐
                                  │           JOBLEX CORE ENGINE            │
                                  │   (Node.js / Express & Python / Flask)  │
                                  └────────────────────┬────────────────────┘
                                                       │
         ┌─────────────────────────────────────────────┼─────────────────────────────────────────────┐
         ▼                                             ▼                                             ▼
┌─────────────────────────┐               ┌─────────────────────────┐               ┌─────────────────────────┐
│     STUDENT PORTAL      │               │    INDUSTRY PORTAL      │               │     ACADEMY PORTAL      │
│ ── ── ── ── ── ── ── ── │               │ ── ── ── ── ── ── ── ── │               │ ── ── ── ── ── ── ── ── │
│ • Gamified Skill Tree   │               │ • Candidate Dossiers    │               │ • Peer Benchmarking     │
│ • Anti-Decay Protection │               │ • Requisition Publisher │               │ • Curriculum Gap AI     │
│ • NLP Resume Analyzer   │               │ • Direct Inbound Invite │               │ • FDP & MoU Tracker     │
│ • Zulu AI Assistant     │               │ • Skill Calibrator      │               │ • Tech Radar Monitoring │
└─────────────────────────┘               └─────────────────────────┘               └─────────────────────────┘
```

---

### 1. 🎓 Student Portal & Career Acceleration Engine

The **Student Portal** provides learners with a dynamic, gamified environment designed to cultivate high-demand industry competencies, track skill retention, and navigate individualized career pathways.

* **Gamified Interactive Skill Tree**: Visual 2D/3D canvas mapping prerequisite relationships between foundational and advanced industry competencies. Earned skills unlock connected specialization branches.
* **Skill Anti-Decay Protection Engine**: Implements a decaying retention model that alerts students when competencies require refresher quizzes or project work, preserving skill points and maintaining active streak freezes.
* **NLP Resume Parser & Gap Diagnostic Engine**: Parses unformatted CVs against canonical skill ontologies, generating a side-by-side gap breakdown with actionable upskilling recommendations.
* **Zulu AI Contextual Guidance Companion**: 24/7 AI-powered career guidance counselor providing real-time advice, project suggestions, and interview preparation.
* **Opportunities & Micro-Gigs Hub**: Unified feed matching student profile vectors against live industry internships, full-time requisitions, and hands-on micro-gigs.

<!-- SCREENSHOT PLACEHOLDER: Student Portal Dashboard -->
![Student Portal Dashboard](./assets/screenshots/student-portal.png)
*Figure 1.1: Student Portal Dashboard featuring the Interactive Gamified Skill Tree, Anti-Decay Retention Gauge, and personalized Career Accelerator Roadmap.*

---

### 2. 🏢 Industry Recruiter Suite & Talent Acquisition Hub

The **Industry Portal** empowers recruiters and enterprise talent acquisition teams to find pre-validated candidates, post targeted requisitions, and directly engage with academic institutions.

* **Requisition Publisher & Skill Calibrator**: Create job and internship listings with customized skill weighting, experience thresholds, and candidate match criteria.
* **Reverse Talent Search & Inbound Direct Invites**: Browse anonymized, skill-verified candidate dossiers ranked by hybrid compatibility scores. Recruiters can send direct interview invitations bypass traditional application funnels.
* **Candidate Dossier & Side-by-Side Diagnostic Review**: Inspect candidate profiles with radar chart skill breakdowns, verified credentials, and quantitative match diagnostics.
* **Real-time Recruiter Event Pipeline**: Instant Server-Sent Events (SSE) notification dispatch when candidates apply, accept interview invitations, or complete prerequisite skill assessments.

<!-- SCREENSHOT PLACEHOLDER: Industry Recruiter Portal -->
![Industry Recruiter Hub](./assets/screenshots/industry-portal.png)
*Figure 2.1: Industry Recruiter Portal displaying Candidate Dossiers, Requisition Management, and Direct Inbound Interview Scheduling.*

---

### 3. 🏫 Academic Governance & Curriculum Modernization Portal

The **Academy Portal** equips university deans, department heads, and academic councils with macro-level intelligence to benchmark student readiness, modernize syllabi, and establish industry partnerships.

* **Institutional Peer Benchmarking**: Multi-department analytics comparing cohort skill acquisition against national benchmarks and peer academic institutions.
* **AI-Driven Curriculum Gap Analyzer**: Automatically scans existing institutional syllabi against live industrial requisition demand to identify obsolete topics and recommend emerging subjects.
* **Faculty Development Programs (FDP) & MoU Management**: Tracks bilateral agreements between academic institutions and corporate partners, facilitating joint workshops and faculty retraining.
* **Industrial Shift Tech Radar**: Monitors emerging technology adoption in industry and alerts academic deans to proactively update department curricula.

<!-- SCREENSHOT PLACEHOLDER: Academic Governance Portal -->
![Academic Governance Portal](./assets/screenshots/academy-portal.png)
*Figure 3.1: Academic Governance Dashboard illustrating Peer Institutional Benchmarking, Curriculum Gap AI Analytics, and MoU Tracking.*

---

### 4. 🔐 Cryptographic Credential & Public Verification Engine

JOBLEX incorporates zero-trust cryptographic security for all digital credentials, certificates, and badge issuances.

* **SHA-256 HMAC Certification**: Every issued skill badge and quiz completion certificate is cryptographically signed using SHA-256 HMAC algorithms with institutional secret keys.
* **Public Verification Portal (`/api/assessment/verify/:token`)**: A public, unauthenticated verification endpoint that allows third-party recruiters and verification agencies to validate certificate authenticity, score attained, recipient identity, and issuing organization in real time.

<!-- SCREENSHOT PLACEHOLDER: Cryptographic Verification Portal -->
![Public Credential Verification](./assets/screenshots/verification.png)
*Figure 4.1: Public Zero-Trust Cryptographic Credential Verification Portal validating badge authenticity via SHA-256 HMAC token.*

---

## 🧮 Algorithmic Specifications

### Hybrid Cosine-Jaccard Vector Matching Engine

Candidate-to-Opportunity matching is computed using a hybrid mathematical model combining directional vector similarity and set overlap weighting:

$$\text{Match Score} = w_{c} \cdot \cos(\theta) + w_{j} \cdot J(A, B)$$

Where:
* **Cosine Similarity** ($\cos\theta$): Evaluates directional alignment of weighted skill categories:
  $$\cos(\theta) = \frac{\mathbf{A} \cdot \mathbf{B}}{\|\mathbf{A}\| \|\mathbf{B}\|}$$
* **Weighted Jaccard Index** ($J(A, B)$): Evaluates exact match ratio over mandatory core skills:
  $$J(A, B) = \frac{|A \cap B|}{|A \cup B|}$$
* **Default Weights**: $w_c = 0.6$ (Category Alignment), $w_j = 0.4$ (Exact Competency Match).

---

## 📡 Live Production API Route Directory

| HTTP Method | Endpoint Path | Portal / Domain | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/opportunities` | Student / Public | Fetches all active opportunities with optional category filtering. |
| `POST` | `/api/opportunities/apply` | Student | Submits candidate application and dispatches recruiter alert. |
| `POST` | `/api/resume/analyze` | Student | Parses unformatted CV text and computes role benchmark gap scores. |
| `GET` | `/api/industry/candidates` | Industry | Retrieves skill-ranked candidate dossiers. |
| `POST` | `/api/industry/inbound-invite` | Industry | Issues direct candidate interview invitation and injects student To-Do. |
| `POST` | `/api/industry/applications/:id/status` | Industry | Updates application status and triggers real-time student notification. |
| `GET` | `/api/academy/benchmarking` | Academy | Retrieves multi-department peer institution benchmark data. |
| `GET` | `/api/academy/curriculum-gap` | Academy | Returns AI curriculum gap diagnosis and recommended syllabus edits. |
| `GET` | `/api/assessment/verify/:token` | Security / Public | Validates SHA-256 HMAC token and returns verified badge metadata. |
| `GET` | `/api/notifications/stream` | Cross-Portal | Live Server-Sent Events (SSE) real-time notification stream. |

---

## 🌐 Live Cloud Infrastructure & Deployment

JOBLEX is deployed across global cloud infrastructure with automated database redundancy:

* **Frontend Hosting**: Vercel Serverless Edge Network (Zero-configuration HTML5/JS static delivery).
* **Backend Microservices**: Node.js Express & Python Flask Dual-Engine Application API Server.
* **Database & Persistence**: Supabase Cloud PostgreSQL with automated in-memory fallback state machine (`backend/data/database.js`).

---

## 🛡️ License & Project Governance

Developed as an enterprise-ready, open-architecture collaboration platform. All rights reserved.
