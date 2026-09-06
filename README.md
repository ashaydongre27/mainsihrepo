# JOBLEX — Academia–Industry Collaboration Portal (SIH PSID: 26044)

A multi-portal web platform aimed at bridging **academia ↔ industry** in the AYUSH ecosystem through:
- **skill mapping** and **gamified career roadmaps**
- **AI-assisted resume gap analysis**
- **opportunity publishing & applications**
- **academy curriculum modernization workflows**
- an AI career counselor (“**Zulu**”) with chat history

This repository is published as `ashaydongre27/mainsihrepo` and is deployed (per repo metadata) at: `https://mainsihrepo.vercel.app`.

---

## What this repo actually is (ruthless, factual)

Despite being described to you as “MERN”, **this repository is not a conventional MERN app**:
- **Frontend** is primarily **static HTML/CSS/JS** (multiple HTML portals in the repo root plus additional HTML pages under `src/`). There is **no React dependency** in the root `package.json`.
- **Backend (primary)** is **Node.js + Express** with modular REST routes.
- **Backend (secondary/mirror)** exists as a **Python Flask** app that serves static pages and exposes API endpoints.
- **Database** is **Supabase (PostgreSQL)** (optional) with an **in-memory fallback dataset** in the backend for offline / no-cloud-key operation.
- There *is* at least one **React component** present (`src/components/student/ZuluChat.jsx`), but the repo does not contain a complete React build toolchain/config at the root level that matches the “React/Vite SPA” claims in `tech.md`.

If you want to call it a “stack” in one line, the repo is best described as:

> **Static multi-page frontend + Node/Express API + Supabase (Postgres) + Gemini-powered AI (LangChain/LangGraph) + optional Flask mirror**

---

## Product surface: Portals & user roles

The UI is organized as **separate portals** (HTML entry points) with role-specific features.

### 1) Landing / Hub (`index.html`)
- Public landing hub that routes users into role portals.
- Visual “hero” includes a **3D/WebGL starfield** (Three.js-based script is included via `js/frontend/three-scene.js`).

### 2) Authentication (`auth.html`)
- Multi-role authentication flow: **student / academy / industry / admin**.
- Includes a “persona” style flow backed by an API endpoint that returns pre-seeded accounts (`/api/auth/demo-users`).

### 3) Student portal (`student.html` + `src/students/*`)
Student-facing functionality centers on progression + employability:
- **Career Roadmap** with XP/streak mechanics and an **anti-decay freeze** concept (daily check-in freezes decay for 72h).
- **Resume analyzer** endpoint (`/api/resume/analyze`) that scores against role benchmarks and returns missing skills + recommendations.
- **Opportunities board** fed by `/api/opportunities` with ability to apply (`/api/opportunities/apply`) and view personal applications (`/api/opportunities/my-applications`).
- **Zulu AI counselor** (chat endpoint `/api/zulu/chat`) with session/message persistence (Supabase if configured; in-memory fallback otherwise).
- Separate HTML pages exist for student modules:
  - `src/students/student-roadmap.html`
  - `src/students/student-resume.html`
  - `src/students/student-quiz.html`
  - `src/students/student-internships.html`
  - `src/students/student-jobs.html`
  - `src/students/student-skilltree.html`
  - `src/students/student-portfolio.html`
  - `src/students/student-zulu.html`

### 4) Academy portal (`academy.html` + `src/academy/*`)
Academy-facing functionality is about governance + curriculum modernization:
- Aggregated academy dataset endpoint: `/api/academy/all-data`
- **AI curriculum audit** endpoint: `/api/academy/curriculum-audit`
  - Prompting targets NEP-2020/NAAC-aligned modernization and industry needs alignment.
- MoU, benchmarking, grants, and FDP-related pages exist:
  - `src/academy/academy-readiness.html`
  - `src/academy/academy-benchmarking.html`
  - `src/academy/academy-curriculum.html`
  - `src/academy/academy-mous.html`
  - `src/academy/academy-grants.html`
  - `src/academy/academy-fdp.html`

### 5) Industry portal (`industry.html` + `src/industry/*`)
Industry-facing functionality is about talent discovery + demand signaling:
- Aggregated industry dataset endpoint: `/api/industry/all-data`
- Candidate sourcing endpoint: `/api/industry/candidates`
- Skill demand submission endpoint: `/api/industry/submit-skill-demand`
- Opportunity posting endpoint: `/api/industry/post-opportunity`
- Additional “idea endpoints” exist (e.g., `inbound-invite`, `forecast`, `bootcamps`) reflecting a larger concept scope.
- Separate pages exist:
  - `src/industry/industry-candidates.html`
  - `src/industry/industry-requisitions.html`
  - `src/industry/industry-post-opportunity.html`
  - `src/industry/industry-mous.html`
  - `src/industry/industry-grants.html`
  - `src/industry/industry-calibrator.html`
  - `src/industry/industry-bootcamps.html`

---

## Backend architecture (Node.js / Express)

### Express server
`backend/server.js` mounts:
- **Auth**: `/api/auth/*` (also mounted at `/auth/*` for rewrite compatibility)
- **Roadmap**: `/api/roadmap/*` (also `/roadmap/*`)
- **Resume**: `/api/resume/*` (also `/resume/*`)
- **Opportunities**: `/api/opportunities/*` (also `/opportunities/*`)
- **Zulu**: `/api/zulu/*` (also `/zulu/*`)
- **Academy**: `/api/academy/*` (also `/academy-api/*`)
- **Industry**: `/api/industry/*` (also `/industry-api/*`)

The server also serves static files from the repo root and selected subfolders, enabling “clean URL” navigation to HTML pages.

### Route modules (REST)
Routes are split across:
- `backend/routes/auth.routes.js`
- `backend/routes/roadmap.routes.js`
- `backend/routes/resume.routes.js`
- `backend/routes/opportunities.routes.js`
- `backend/routes/zulu.routes.js`
- `backend/routes/academy.routes.js`
- `backend/routes/industry.routes.js`

### Authentication & RBAC
- Supabase JWT Bearer-token compatible middleware exists in `backend/middleware/auth.middleware.js`.
- The middleware includes role checking (RBAC), and routes reference roles such as student/academy/industry/admin.

---

## Secondary backend (Python / Flask mirror)

`backend/app.py` exists as a large Flask application that:
- serves static pages (HTML/CSS/JS)
- exposes a parallel `/api/*` surface (including auth and resume analysis)
- contains a seed DB object in code

This is a **second implementation** of the backend concerns, which is useful for portability but increases maintenance and drift risk (see “Ruthless review” section).

Python dependencies are minimal (`flask`, `flask-cors`, `requests`), and Python packaging metadata exists (`pyproject.toml`).

---

## AI subsystem (Gemini + orchestration + fallback)

AI capabilities are implemented server-side (Node) and are used in:
- **Resume analysis** (`/api/resume/analyze`)
- **Academy curriculum audit** (`/api/academy/curriculum-audit`)
- **Zulu counselor** (`/api/zulu/chat`)

### How AI calls are handled (important detail)
`backend/services/ai.service.js` implements:
- **multi-key configuration** (primary + backup key)
- **model fallback** across multiple Gemini model names
- multiple calling strategies including:
  1) Google Generative AI SDK
  2) LangChain path
  3) Direct REST fallback with timeouts

This is designed to degrade gracefully if a model is unavailable or a key fails.

---

## Data & persistence (Supabase + fallback)

### Supabase client
`backend/config/supabase.js` builds a Supabase client from environment variables and exposes:
- `supabase` client
- `isConfigured` boolean (used widely to decide whether to hit Supabase or use local fallback)

### Schema assets
SQL schema files are included:
- `backend/data/supabase_schema.sql`
- `backend/data/zulu_chat_schema.sql`

Tables referenced by code include (non-exhaustive):
- `student_roadmaps`
- `opportunities`
- `applications`
- `candidates`
- `zulu_chat_sessions`
- `zulu_chat_messages`

### In-memory fallback dataset
`backend/data/database.js` contains a seeded dataset (roles, opportunities, candidates, and other portal content) used when Supabase is not configured or queries fail.

This fallback is not a small stub — it is a first-class runtime mode in the route code.

---

## Public API surface (documented from actual server mounts + route intent)

> Base path: `/api` (in Vercel deployments this is rewritten through a serverless entry, see below)

### Auth
- `GET  /api/auth/demo-users` — returns pre-seeded persona accounts
- `POST /api/auth/register` — register a user (Supabase-backed when configured)
- `POST /api/auth/login` — login (Supabase Auth or fallback)
- `POST /api/auth/logout` — sign out
- `POST /api/auth/reset-password` — request password reset (Supabase)

### Student roadmap / progression
- `GET  /api/roadmap` — fetch roadmap state
- `POST /api/roadmap/toggle-task` — toggle roadmap task completion + XP recompute
- `POST /api/roadmap/check-in` — daily check-in; streak + XP; decay freeze
- `GET  /api/roadmap/peer-benchmarking` — peer comparison snapshot (exists in the frontend client expectations)

### Resume analysis
- `POST /api/resume/analyze`
  - input: resume text + target role
  - output: match percentage, extracted skills, missing skills, recommendations

Role benchmark definitions are embedded server-side (domain-specific AYUSH/pharma oriented).

### Opportunities / applications
- `GET  /api/opportunities` — list opportunities; supports filtering by type
- `POST /api/opportunities/apply` — submit an application
- `GET  /api/opportunities/my-applications` — list applications (query by student email)

### Academy
- `GET  /api/academy/all-data` — aggregated academy view
- `POST /api/academy/curriculum-audit` — AI audit of syllabus text
- `POST /api/academy/adopt-syllabus` — adopt/approve a proposal

### Industry
- `GET  /api/industry/all-data` — aggregated industry view
- `GET  /api/industry/candidates` — candidates list
- `POST /api/industry/post-opportunity` — publish opportunity
- `POST /api/industry/submit-skill-demand` — send curriculum skill demand signal
- Additional idea endpoints exist (e.g. `inbound-invite`, `forecast`, `bootcamps`) depending on route completion.

### Zulu AI (chat + sessions)
Zulu supports chat plus persistence:
- `POST /api/zulu/chat` — execute chat turn with optional history/session context
- session/message endpoints are implied by `backend/routes/zulu.routes.js` and the frontend API client:
  - create/list/delete sessions
  - fetch messages for a session
  - persist messages to Supabase if configured

---

## Deployment model (Vercel-oriented)

### Vercel routing
`vercel.json` defines rewrite rules so that:
- requests to `/api/(.*)` route into the serverless function entry `api/index.js`.

### Serverless entrypoint
`api/index.js` imports the Express app (`backend/server`) and adapts request URLs to preserve `/api/*` routing semantics.

### Build bundling
`build.js` builds a `dist/` folder by copying:
- the root HTML portals (`index.html`, `auth.html`, `student.html`, `academy.html`, `industry.html`)
- asset directories (`css/`, `js/`, `src/`)

This is a “static bundle” strategy rather than a SPA compilation pipeline.

---
```
## Repository layout (high signal)
├── api/ 
│   └── index.js                               # Vercel serverless adapter for Express 
├── backend/ 
│   ├── server.js                              # Node/Express server 
│   ├── app.py                                 # Flask mirror backend 
│   ├── config/ 
│   │   └── supabase.js 
│   ├── middleware/ 
│   │   └── auth.middleware.js 
│   ├── routes/                                # REST routes: auth/roadmap/resume/zulu/etc. 
│   ├── services/                              # Gemini orchestration + Zulu persistence helpers 
│   └── data/ 
│       ├── database.js                        # in-memory fallback dataset 
│       ├── supabase_schema.sql 
│       └── zulu_chat_schema.sql 
├── css/ 
│   └── styles.css 
├── js/ 
│   ├── frontend/                              # UI + API client + theme + 3D scripts 
│   ├── student.js / academy.js / industry.js 
│   └── api.js 
├── src/ 
│   ├── students/                              # student module HTML pages 
│   ├── academy/                               # academy module HTML pages 
│   ├── industry/                              # industry module HTML pages 
│   └── components/ 
│       └── student/ZuluChat.jsx               # React component (partial/standalone) 
├── index.html / auth.html / student.html / academy.html / industry.html 
├── build.js 
├── vercel.json 
└── tech.md                                    # internal architecture/spec narrative
```

---

## Configuration surface (environment variables)

This repo expects configuration via environment variables (commonly in `.env` for Node runtime). Key variables referenced in code include:

### Supabase
- `SUPABASE_URL`
- one of:
  - `SUPABASE_SERVICE_ROLE_KEY` (highest privilege)
  - `SUPABASE_SECRET_KEY`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_PUBLISHABLE_KEY`

### Google Gemini API (AI)
- primary:
  - `GEMINI_API_KEY` or `GOOGLE_API_KEY`
- backup (failover):
  - `GEMINI_API_KEY_BACKUP` or `GOOGLE_API_KEY_BACKUP`

If these are not set, the platform runs in a reduced capability mode (AI calls fall back; DB falls back to in-memory data).

---

## Ruthless review (what a judge will notice immediately)

1) **“MERN” claim does not match the repo**
- No MongoDB integration is present in the code you’ve committed (Supabase is the DB layer).
- React is not a primary runtime in this repo. A React component exists, but the root dependency graph/build pipeline doesn’t reflect a React application.

2) **Two backends = double maintenance**
- Node/Express and Flask both exist and overlap responsibilities. Unless you enforce strict parity testing, they will drift.

3) **Docs vs code contradictions**
- `tech.md` describes a “Modern React SPA (src/)” with Vite/Tailwind/R3F, but the repository layout does not contain the expected build config and dependencies at the root. This reads like aspirational documentation mixed with partial implementation.

4) **Express version inconsistency**
- Root `package.json` pins `express` differently than `backend/package.json`. That can produce subtle behavior differences depending on which entrypoint gets used in deployment.

5) **Demo/fallback modes are real — acknowledge them**
- The backend and frontend API client contain explicit fallback logic and seeded records. If this is meant as production, this needs a deliberate stance: either remove fallback, or clearly define it as an “offline judge mode”.

---

## License / usage
No `LICENSE` file is present in the repository root at the time of review. If this is intended for public reuse, licensing is currently undefined.

---

## Course metadata
- Course code: **GitHub**
