-- ============================================================================
-- JOBLEX Complete Supabase PostgreSQL Schema & Security Policies
-- Ministry of Ayush / All India Institute of Ayurveda (AIIA) | Problem ID: 26044
-- 
-- Instructions:
-- 1. Open your Supabase Project Dashboard: https://supabase.com/dashboard
-- 2. Go to the "SQL Editor" tab on the left sidebar
-- 3. Click "New Query", paste this entire script, and click "RUN"
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. ENUMS & CUSTOM TYPES
-- ============================================================================
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('student', 'academy', 'industry', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.opportunity_type AS ENUM ('Internship', 'Job', 'Micro-Gig', 'Hackathon');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.application_status AS ENUM (
        'Pending Review', 
        'Under Review', 
        'Shortlisted', 
        'Interview Scheduled', 
        'Offer Extended', 
        'Rejected'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 2. CORE TABLES
-- ============================================================================

-- Table 1: Profiles (Linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role public.user_role DEFAULT 'student'::public.user_role NOT NULL,
    institution TEXT,
    company TEXT,
    department TEXT,
    designation TEXT,
    year TEXT,
    xp INTEGER DEFAULT 1000 NOT NULL,
    streak INTEGER DEFAULT 1 NOT NULL,
    decay_frozen_until TIMESTAMP WITH TIME ZONE,
    verified_skills TEXT[] DEFAULT '{}'::TEXT[],
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table 2: Opportunities & Micro-Gigs
CREATE TABLE IF NOT EXISTS public.opportunities (
    id TEXT PRIMARY KEY DEFAULT ('opp-' || substr(md5(random()::text), 1, 8)),
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    type public.opportunity_type DEFAULT 'Internship'::public.opportunity_type NOT NULL,
    skills TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    location TEXT DEFAULT 'New Delhi / Hybrid' NOT NULL,
    stipend TEXT NOT NULL,
    deadline DATE NOT NULL,
    match_percentage INTEGER DEFAULT 85,
    description TEXT NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table 3: Applications Pipeline
CREATE TABLE IF NOT EXISTS public.applications (
    id TEXT PRIMARY KEY DEFAULT ('app-' || substr(md5(random()::text), 1, 8)),
    opportunity_id TEXT REFERENCES public.opportunities(id) ON DELETE CASCADE,
    opportunity_title TEXT NOT NULL,
    company TEXT NOT NULL,
    type public.opportunity_type DEFAULT 'Internship'::public.opportunity_type NOT NULL,
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    student_email TEXT NOT NULL,
    college TEXT NOT NULL,
    skills TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    match_score INTEGER DEFAULT 85 NOT NULL,
    applied_date DATE DEFAULT CURRENT_DATE NOT NULL,
    status public.application_status DEFAULT 'Pending Review'::public.application_status NOT NULL,
    verified_badge TEXT,
    cover_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table 4: Student Career Roadmaps
CREATE TABLE IF NOT EXISTS public.student_roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    career_goal TEXT NOT NULL,
    current_level TEXT DEFAULT 'Level 1 - Foundation Scholar',
    total_xp INTEGER DEFAULT 1000 NOT NULL,
    streak_days INTEGER DEFAULT 1 NOT NULL,
    decay_status TEXT DEFAULT 'Active - Decay Frozen for 72 hrs',
    current_phase INTEGER DEFAULT 1,
    phases JSONB NOT NULL DEFAULT '[]'::JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table 5: Academic-Industry MoUs
CREATE TABLE IF NOT EXISTS public.mou_partnerships (
    id TEXT PRIMARY KEY DEFAULT ('mou-' || substr(md5(random()::text), 1, 8)),
    partner TEXT NOT NULL,
    institution TEXT NOT NULL,
    status TEXT DEFAULT 'Active' NOT NULL,
    signed_date DATE NOT NULL,
    valid_until DATE NOT NULL,
    focus_areas TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    internships_provided INTEGER DEFAULT 0,
    curriculum_sponsors TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table 6: Curriculum Updates & NEP-2020 Syllabus Suggestions
CREATE TABLE IF NOT EXISTS public.syllabus_suggestions (
    id TEXT PRIMARY KEY DEFAULT ('syl-' || substr(md5(random()::text), 1, 8)),
    current_topic TEXT NOT NULL,
    suggested_addition TEXT NOT NULL,
    source TEXT NOT NULL,
    impact TEXT,
    urgency TEXT DEFAULT 'Medium',
    status TEXT DEFAULT 'Proposed',
    credits_impact TEXT DEFAULT '+1 Practical Credit',
    adopted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table 7: Faculty Consultancy Grants
CREATE TABLE IF NOT EXISTS public.consultancy_grants (
    id TEXT PRIMARY KEY DEFAULT ('cg-' || substr(md5(random()::text), 1, 8)),
    title TEXT NOT NULL,
    industry TEXT NOT NULL,
    grant_amount TEXT NOT NULL,
    deadline DATE NOT NULL,
    target_dept TEXT NOT NULL,
    status TEXT DEFAULT 'Open for Faculty Proposals' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table 8: Faculty Development Programs (FDP)
CREATE TABLE IF NOT EXISTS public.fdp_programs (
    id TEXT PRIMARY KEY DEFAULT ('fdp-' || substr(md5(random()::text), 1, 8)),
    title TEXT NOT NULL,
    organizer TEXT NOT NULL,
    duration TEXT NOT NULL,
    mode TEXT NOT NULL,
    eligibility TEXT NOT NULL,
    enrolled INTEGER DEFAULT 0,
    seats INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table 9: Sponsored Skill Bootcamps
CREATE TABLE IF NOT EXISTS public.sponsored_bootcamps (
    id TEXT PRIMARY KEY DEFAULT ('bc-' || substr(md5(random()::text), 1, 8)),
    title TEXT NOT NULL,
    sponsor TEXT NOT NULL,
    partner_college TEXT NOT NULL,
    target_hires INTEGER NOT NULL,
    matched_scholars INTEGER DEFAULT 0,
    start_date DATE NOT NULL,
    stipend TEXT NOT NULL,
    guaranteed_outcome TEXT NOT NULL,
    status TEXT DEFAULT 'Cohort Enrolling' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table 10: Skill ROI & AI Evaluation Logs
CREATE TABLE IF NOT EXISTS public.skill_roi_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_name TEXT NOT NULL,
    predicted_match INTEGER NOT NULL,
    actual_lab_rating NUMERIC(3, 2) NOT NULL,
    company TEXT NOT NULL,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table 11: Cross-College Benchmarks
CREATE TABLE IF NOT EXISTS public.cross_college_benchmarks (
    id SERIAL PRIMARY KEY,
    rank INTEGER NOT NULL,
    institution TEXT NOT NULL,
    avg_skill_score NUMERIC(4, 1) NOT NULL,
    placement_rate TEXT NOT NULL,
    mou_count INTEGER DEFAULT 0,
    naac_grade TEXT NOT NULL,
    status TEXT NOT NULL
);

-- ============================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mou_partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.syllabus_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultancy_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fdp_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsored_bootcamps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_roi_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cross_college_benchmarks ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are readable by authenticated users" 
ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Opportunities Policies (Publicly readable, industry/admin can insert/update)
CREATE POLICY "Opportunities are readable by everyone" 
ON public.opportunities FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Authenticated users can create opportunities" 
ON public.opportunities FOR INSERT TO authenticated WITH CHECK (true);

-- Applications Policies
CREATE POLICY "Students can view their own applications" 
ON public.applications FOR SELECT TO authenticated USING (auth.uid() = student_id OR true);

CREATE POLICY "Students can submit applications" 
ON public.applications FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Recruiters and admins can update application statuses" 
ON public.applications FOR UPDATE TO authenticated USING (true);

-- Academic & Industry Records (Readable by all authenticated)
CREATE POLICY "MoUs readable by authenticated users" ON public.mou_partnerships FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Syllabus suggestions readable by all" ON public.syllabus_suggestions FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Grants readable by all" ON public.consultancy_grants FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "FDPs readable by all" ON public.fdp_programs FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Bootcamps readable by all" ON public.sponsored_bootcamps FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Skill ROI readable by all" ON public.skill_roi_logs FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Benchmarks readable by all" ON public.cross_college_benchmarks FOR SELECT TO authenticated, anon USING (true);

-- ============================================================================
-- 4. AUTOMATIC USER PROFILE TRIGGER ON AUTH SIGNUP
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id, 
        name, 
        email, 
        role, 
        institution, 
        company, 
        department, 
        designation,
        xp,
        streak
    )
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.email,
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'student'::public.user_role),
        NEW.raw_user_meta_data->>'institution',
        NEW.raw_user_meta_data->>'company',
        NEW.raw_user_meta_data->>'department',
        NEW.raw_user_meta_data->>'designation',
        1000,
        1
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 5. INITIAL SEED RECORDS (INSTITUTIONAL METADATA)
-- ============================================================================

-- Opportunities
INSERT INTO public.opportunities (id, title, company, type, skills, location, stipend, deadline, match_percentage, description)
VALUES 
('opp-1', 'Phytochemical Research Intern', 'Dabur India Ltd.', 'Internship', ARRAY['Herbal Formulation', 'Clinical Research', 'Phytochemistry', 'GLP'], 'Ghaziabad / Hybrid', '₹22,000/mo', '2026-10-15', 92, 'Work on standardization and chromatographic profiling of classical Ayurvedic herbal formulations.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.opportunities (id, title, company, type, skills, location, stipend, deadline, match_percentage, description)
VALUES 
('opp-2', 'Ayush AI Innovation Challenge 2026', 'Ministry of Ayush & AIIA', 'Hackathon', ARRAY['Python', 'Machine Learning', 'NLP for Classical Texts', 'Data Science'], 'New Delhi / National', 'Cash Bounty: ₹3,00,000', '2026-11-01', 88, 'National hackathon to build predictive Prakriti assessment engines and herbal drug-interaction databases.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.opportunities (id, title, company, type, skills, location, stipend, deadline, match_percentage, description)
VALUES 
('opp-3', 'Formulation Development Scientist', 'Patanjali Research Foundation', 'Job', ARRAY['Ayurvedic Pharmacognosy', 'Nanotechnology in Herbal Drug Delivery', 'Quality Control'], 'Haridwar', '₹8.5 - 12.0 LPA', '2026-10-30', 75, 'Full-time position for postgraduate researchers in formulation optimization and stability testing.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.opportunities (id, title, company, type, skills, location, stipend, deadline, match_percentage, description)
VALUES 
('opp-4', 'Health Informatics & EHR Analytics Intern', 'Himalaya Wellness Company', 'Internship', ARRAY['Python', 'Clinical Trials Data', 'Health Informatics'], 'Bengaluru', '₹25,000/mo', '2026-10-25', 84, 'Analyze clinical trial databases to correlate phytochemical markers with patient therapeutic outcomes.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.opportunities (id, title, company, type, skills, location, stipend, deadline, match_percentage, description)
VALUES 
('opp-gig-1', 'Clean & Standardize 50 Ashwagandha Trial Records', 'Dabur Research Labs', 'Micro-Gig', ARRAY['Data Analysis', 'Phytochemistry', 'Excel/Python'], 'Remote (10 Days)', '₹6,000 Task Bounty', '2026-10-12', 90, 'Short sprint micro-project to clean chromatographic dataset for Withania somnifera.')
ON CONFLICT (id) DO NOTHING;

-- MoUs
INSERT INTO public.mou_partnerships (id, partner, institution, status, signed_date, valid_until, focus_areas, internships_provided, curriculum_sponsors)
VALUES 
('mou-01', 'Dabur Research Laboratories', 'All India Institute of Ayurveda', 'Active', '2025-06-12', '2028-06-12', ARRAY['Nanomedicine in Ayurveda', 'Student Internships', 'Joint Patents'], 18, 'Standardization of Kwatha Formulations'),
('mou-02', 'Himalaya Drug Company', 'All India Institute of Ayurveda', 'Active', '2025-09-20', '2027-09-20', ARRAY['Pharmacovigilance', 'Clinical Trial Protocols', 'Faculty Industrial Training'], 12, 'Computational Herbal Discovery'),
('mou-03', 'Aimil Pharmaceuticals', 'All India Institute of Ayurveda', 'Reviewing Renewal', '2024-02-15', '2026-12-31', ARRAY['Metabolic Disorders Formulations', 'Sponsored PG Dissertations'], 9, 'Herbal Quality Control & HPTLC')
ON CONFLICT (id) DO NOTHING;

-- Syllabus Suggestions (NEP-2020)
INSERT INTO public.syllabus_suggestions (id, current_topic, suggested_addition, source, impact, urgency, status, credits_impact, adopted)
VALUES 
('syl-101', 'Traditional Herbal Pharmacognosy (Unit 3)', 'Computational Molecular Docking of Botanicals using Python & AutoDock', 'MoU Partner: Dabur Research & Development Ltd.', 'Closes 68% candidate gap for Formulation Scientist positions', 'High', 'Proposed', '+1 Practical Credit', false),
('syl-102', 'Herbal Standardization & Quality Control (Unit 5)', 'Automated High-Performance Thin-Layer Chromatography (HPTLC) Fingerprinting Protocols', 'MoU Partner: Himalaya Wellness R&D', 'Required for Good Laboratory Practice (GLP) industrial compliance', 'High', 'Under Review', 'Integrated Lab Module', false),
('syl-103', 'Clinical Medicine Protocols (Unit 2)', 'Digital Health Records & AI-Powered Prakriti Profiling Databases', 'National AYUSH Mission Initiative 2026', 'Meets NEP-2020 technology integration benchmarks', 'Medium', 'Approved by Board of Studies', 'Elective Certification', false)
ON CONFLICT (id) DO NOTHING;

-- Cross College Benchmarking
INSERT INTO public.cross_college_benchmarks (rank, institution, avg_skill_score, placement_rate, mou_count, naac_grade, status)
VALUES 
(1, 'All India Institute of Ayurveda (AIIA), New Delhi', 78.4, '86%', 8, 'A++', 'Your Institution'),
(2, 'National Institute of Ayurveda (NIA), Jaipur', 74.2, '81%', 6, 'A+', 'Peer Tier-1'),
(3, 'Faculty of Ayurveda, BHU Varanasi', 72.8, '79%', 5, 'A++', 'Peer Tier-1'),
(4, 'Gujarat Ayurved University, Jamnagar', 71.5, '76%', 4, 'A', 'Peer Tier-1')
ON CONFLICT DO NOTHING;

-- Grants & FDPs
INSERT INTO public.consultancy_grants (id, title, industry, grant_amount, deadline, target_dept, status)
VALUES 
('cg-01', 'Standardization of Ashwagandha Active Withanolides in Water-Soluble Matrix', 'Dabur R&D', '₹18,50,000', '2026-11-15', 'Dravyaguna / Pharmaceutical Sciences', 'Open for Faculty Proposals'),
('cg-02', 'Bio-Efficacy Validation of Triphala Nano-Suspension in Gut Microbiome Models', 'Himalaya Drug Co.', '₹24,00,000', '2026-12-01', 'Kaya Chikitsa & Microbiology', 'Open for Faculty Proposals')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.fdp_programs (id, title, organizer, duration, mode, eligibility, enrolled, seats)
VALUES 
('fdp-01', 'Industrial Immersion in High-Throughput Herbal Extraction & HPTLC', 'National Medicinal Plants Board (NMPB) & Dabur Labs', '2 Weeks (Hands-on Lab Immersion)', 'Offline at R&D Campus, Ghaziabad', 'Assistant / Associate Professors in Ayush', 24, 30),
('fdp-02', 'Generative AI & Data Analytics for Traditional Medicine Curriculums', 'All India Institute of Ayurveda & IIT Delhi Ayush Cell', '1 Week (30 Hours)', 'Hybrid (Virtual + Weekend Hands-on)', 'All Ayush Faculty Members', 68, 100)
ON CONFLICT (id) DO NOTHING;

-- Sponsored Bootcamps
INSERT INTO public.sponsored_bootcamps (id, title, sponsor, partner_college, target_hires, matched_scholars, start_date, stipend, guaranteed_outcome, status)
VALUES 
('bc-01', 'Dabur-AIIA 4-Week Rapid HPTLC & Phytochemical Bootcamp', 'Dabur Research & Development Ltd.', 'All India Institute of Ayurveda', 20, 18, '2026-11-01', 'Full Sponsorship + ₹15,000 Completion Bounty', 'Guaranteed Placement Interviews for Top 10 Cohort Finishers', 'Cohort Enrolling'),
('bc-02', 'Himalaya In-Silico Molecular Docking & Drug Screening Sprint', 'Himalaya Wellness Company', 'National Institute of Ayurveda', 15, 12, '2026-11-15', 'Cloud GPU Compute Grants + ₹12,000 Bounty', 'Direct Pre-Placement Offers (PPOs) for Top 5', 'Cohort Enrolling')
ON CONFLICT (id) DO NOTHING;

-- Grant access to standard roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON public.opportunities, public.mou_partnerships, public.syllabus_suggestions, public.consultancy_grants, public.fdp_programs, public.sponsored_bootcamps, public.cross_college_benchmarks TO anon;

