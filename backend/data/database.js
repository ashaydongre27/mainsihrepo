/**
 * JOBLEX Central Backend Database State & Seed Data (JavaScript / Node.js)
 * Ministry of Ayush / All India Institute of Ayurveda | Problem Statement ID: 26044
 */

const DB = {
  users: [
    {
      id: "usr-student-01",
      name: "Ashay Verma",
      email: "student@nexus.edu",
      password: "student123",
      role: "student",
      institution: "All India Institute of Ayurveda (AIIA), New Delhi",
      department: "Ayurvedic Pharmacology & Data Science",
      year: "3rd Year BAMS / Health Informatics",
      xp: 1450,
      streak: 7,
      decayFrozenUntil: new Date(Date.now() + 3 * 86400000).toISOString(),
      skills: ["Herbal Formulation", "Python", "Ayurvedic Pharmacognosy", "Data Analysis", "Good Laboratory Practice (GLP)"]
    },
    {
      id: "usr-academy-01",
      name: "Dr. Sunita Sharma",
      email: "dean@aiia.gov.in",
      password: "dean123",
      role: "academy",
      institution: "All India Institute of Ayurveda",
      designation: "Dean of Academic Affairs & Industry Liaison",
      department: "Faculty of Ayurveda & Pharmaceutical Technology"
    },
    {
      id: "usr-industry-01",
      name: "Rajesh Malhotra",
      email: "hr@dabur-research.com",
      password: "industry123",
      role: "industry",
      company: "Dabur Research & Development Ltd.",
      designation: "Head of University Relations & Talent Acquisition",
      sector: "Ayurvedic Formulations & Phytopharmaceuticals"
    }
  ],

  opportunities: [
    {
      id: "opp-1",
      title: "Phytochemical Research Intern",
      company: "Dabur India Ltd.",
      type: "Internship",
      skills: ["Herbal Formulation", "Clinical Research", "Phytochemistry", "GLP"],
      location: "Ghaziabad / Hybrid",
      stipend: "₹22,000/mo",
      deadline: "2026-10-15",
      match: 92,
      description: "Work on standardization and chromatographic profiling of classical Ayurvedic herbal formulations."
    },
    {
      id: "opp-2",
      title: "Ayush AI Innovation Challenge 2026",
      company: "Ministry of Ayush & AIIA",
      type: "Hackathon",
      skills: ["Python", "Machine Learning", "NLP for Classical Texts", "Data Science"],
      location: "New Delhi / National",
      stipend: "Cash Bounty: ₹3,00,000",
      deadline: "2026-11-01",
      match: 88,
      description: "National hackathon to build predictive Prakriti assessment engines and herbal drug-interaction databases."
    },
    {
      id: "opp-3",
      title: "Formulation Development Scientist",
      company: "Patanjali Research Foundation",
      type: "Job",
      skills: ["Ayurvedic Pharmacognosy", "Nanotechnology in Herbal Drug Delivery", "Quality Control"],
      location: "Haridwar",
      stipend: "₹8.5 - 12.0 LPA",
      deadline: "2026-10-30",
      match: 75,
      description: "Full-time position for postgraduate researchers in formulation optimization and stability testing."
    },
    {
      id: "opp-4",
      title: "Health Informatics & EHR Analytics Intern",
      company: "Himalaya Wellness Company",
      type: "Internship",
      skills: ["Python", "Clinical Trials Data", "Health Informatics"],
      location: "Bengaluru / Hybrid",
      stipend: "₹25,000/mo",
      deadline: "2026-10-20",
      match: 82,
      description: "Analyze clinical trial databases to correlate phytochemical markers with patient therapeutic outcomes."
    },
    {
      id: "opp-gig-1",
      title: "Clean & Standardize 50 Ashwagandha Trial Records",
      company: "Dabur Research Labs",
      type: "Micro-Gig",
      skills: ["Data Analysis", "Phytochemistry", "Excel/Python"],
      location: "Remote (10 Days)",
      stipend: "₹6,000 Task Bounty",
      deadline: "2026-10-12",
      match: 90,
      description: "Short sprint micro-project to clean chromatographic dataset for Withania somnifera."
    },
    {
      id: "opp-gig-2",
      title: "Annotate Charaka Samhita Sanskrit Botanical Lexicon",
      company: "AIIA Digital Informatics Cell",
      type: "Micro-Gig",
      skills: ["Ayurvedic Pharmacognosy", "NLP Annotation", "Sanskrit"],
      location: "Remote (7 Days)",
      stipend: "₹4,500 Task Bounty",
      deadline: "2026-10-18",
      match: 85,
      description: "Annotation of classical botanical synonyms for NLP machine learning models."
    }
  ],

  student_roadmap: {
    userId: "usr-student-01",
    careerGoal: "Ayush Health-Tech & Formulation Specialist",
    currentLevel: "Level 3 - Intermediate Innovator",
    totalXp: 1450,
    streakDays: 7,
    decayStatus: "Active - Decay Frozen for 72 hrs",
    currentPhase: 1,
    phases: [
      {
        id: 1,
        name: "Core Ayurvedic Pharmacognosy & GLP",
        xpReward: 350,
        status: "IN_PROGRESS",
        tasks: [
          { id: "t1", title: "Complete Good Laboratory Practice (GLP) module", xp: 50, completed: true },
          { id: "t2", title: "Ayurvedic botanical authentication quiz in Arena", xp: 50, completed: true },
          { id: "t3", title: "Prepare Ashwagandha classical decoction report", xp: 100, completed: false }
        ]
      },
      {
        id: 2,
        name: "Chromatography & HPTLC Profiling",
        xpReward: 450,
        status: "LOCKED",
        tasks: [
          { id: "t4", title: "MoU Partner (Dabur) Webinar on HPLC standards", xp: 75, completed: false },
          { id: "t5", title: "Perform Fingerprint Marker Analysis quiz", xp: 75, completed: false }
        ]
      },
      {
        id: 3,
        name: "Computational Drug Discovery & Health-AI",
        xpReward: 500,
        status: "LOCKED",
        tasks: [
          { id: "t6", title: "Python for Pharmacological Data Processing", xp: 100, completed: false },
          { id: "t7", title: "In-silico docking of Phytochemical compounds", xp: 150, completed: false }
        ]
      },
      {
        id: 4,
        name: "Corporate Internship & Capstone Formulation",
        xpReward: 600,
        status: "LOCKED",
        tasks: [
          { id: "t8", title: "Submit candidate CV to Dabur / Patanjali via Board", xp: 200, completed: false },
          { id: "t9", title: "Pass Final Technical Evaluation Panel", xp: 400, completed: false }
        ]
      }
    ]
  },

  peerBenchmarking: {
    userPercentile: 78,
    branchAverageScore: 72,
    placedPeerAverageScore: 86,
    targetCompanies: ["Dabur India", "Himalaya Wellness", "Patanjali Research"],
    topMissingPeerSkills: [
      { name: "HPTLC Fingerprinting", prevalence: "88% of placed peers" },
      { name: "In-Silico AutoDock Molecular Docking", prevalence: "74% of placed peers" },
      { name: "GCP Clinical Trial Protocols", prevalence: "69% of placed peers" }
    ]
  },

  talentForecast: {
    role: "Herbal Formulation & Phytochemical Scientists",
    timeframe: "Next 6 Months (Oct 2026 - Mar 2027)",
    estimatedIndustryDemand: 65,
    projectedTalentSupply: [
      { institution: "All India Institute of Ayurveda (AIIA), New Delhi", readyScholars: 24, trendingSkill: "HPTLC & Formulation (+35%)" },
      { institution: "National Institute of Ayurveda (NIA), Jaipur", readyScholars: 18, trendingSkill: "Pharmacology & Clinical (+28%)" },
      { institution: "Faculty of Ayurveda, BHU Varanasi", readyScholars: 15, trendingSkill: "Phytochemistry & QC (+22%)" },
      { institution: "Gujarat Ayurved University, Jamnagar", readyScholars: 12, trendingSkill: "Drug Discovery & Docking (+40%)" }
    ]
  },

  tpoMetrics: {
    registeredStudents: 342,
    funnel: {
      applied: 248,
      shortlisted: 94,
      offersAccepted: 52,
      pendingInterviews: 28
    },
    predictivePlacementReadiness: 84,
    ghostingRate: "4.2%",
    urgentInterventionNeeded: 14
  },

  syllabus_suggestions: [
    {
      id: "syl-101",
      currentTopic: "Traditional Herbal Pharmacognosy (Unit 3)",
      suggestedAddition: "Computational Molecular Docking of Botanicals using Python & AutoDock",
      source: "MoU Partner: Dabur Research & Development Ltd.",
      impact: "Closes 68% candidate gap for Formulation Scientist positions",
      adopted: false
    },
    {
      id: "syl-102",
      currentTopic: "Herbal Standardization & Quality Control (Unit 5)",
      suggestedAddition: "Automated High-Performance Thin-Layer Chromatography (HPTLC) Fingerprinting Protocols",
      source: "MoU Partner: Himalaya Wellness R&D",
      impact: "Required for Good Laboratory Practice (GLP) industrial compliance",
      adopted: false
    },
    {
      id: "syl-103",
      currentTopic: "Clinical Medicine Protocols (Unit 2)",
      suggestedAddition: "Digital Health Records & AI-Powered Prakriti Profiling Databases",
      source: "National AYUSH Mission Initiative 2026",
      impact: "Meets NEP-2020 technology integration benchmarks",
      adopted: false
    }
  ],

  candidates: [
    { name: "Ashay Verma", college: "All India Institute of Ayurveda", match: 94, skills: ["Herbal Formulation", "GLP", "Phytochemistry", "Python"], status: "Ready for Interview" },
    { name: "Kavya Singh", college: "AIIA New Delhi", match: 91, skills: ["Health Informatics", "Python", "NLP for Classical Texts", "SQL"], status: "Shortlisted" },
    { name: "Rohan Sharma", college: "National Institute of Ayurveda, Jaipur", match: 82, skills: ["Ayurvedic Pharmacognosy", "Standardization", "Quality Control"], status: "Under Review" },
    { name: "Ananya Roy", college: "Banaras Hindu University (IMS)", match: 88, skills: ["Clinical Research", "Pharmacology", "Herbal Formulation"], status: "Shortlisted" },
    { name: "Priya Nair", college: "Gujarat Ayurved University, Jamnagar", match: 96, skills: ["Drug Discovery", "Phytochemistry", "HPTLC", "AutoDock"], status: "Top Applicant" }
  ],

  // Idea 11: Cross-College Benchmarking (Anonymized & Opt-In)
  crossCollegeBenchmarking: [
    { rank: 1, institution: "All India Institute of Ayurveda (AIIA), New Delhi", avgSkillScore: 78.4, placementRate: "86%", mouCount: 8, naacGrade: "A++", status: "Your Institution" },
    { rank: 2, institution: "National Institute of Ayurveda (NIA), Jaipur", avgSkillScore: 74.2, placementRate: "81%", mouCount: 6, naacGrade: "A+", status: "Peer Tier-1" },
    { rank: 3, institution: "Faculty of Ayurveda, BHU Varanasi", avgSkillScore: 72.8, placementRate: "79%", mouCount: 5, naacGrade: "A++", status: "Peer Tier-1" },
    { rank: 4, institution: "Gujarat Ayurved University, Jamnagar", avgSkillScore: 71.5, placementRate: "76%", mouCount: 4, naacGrade: "A", status: "Peer Tier-1" }
  ],

  // Idea 8: Sponsored Skill Bootcamps tied to real hiring roles
  sponsoredBootcamps: [
    {
      id: "bc-01",
      title: "Dabur-AIIA 4-Week Rapid HPTLC & Phytochemical Bootcamp",
      sponsor: "Dabur Research & Development Ltd.",
      partnerCollege: "All India Institute of Ayurveda",
      targetHires: 20,
      matchedScholars: 18,
      startDate: "Nov 01, 2026",
      stipend: "Full Sponsorship + ₹15,000 Completion Bounty",
      guaranteedOutcome: "Guaranteed Placement Interviews for Top 10 Cohort Finishers",
      status: "Cohort Enrolling"
    },
    {
      id: "bc-02",
      title: "Himalaya In-Silico Molecular Docking & Drug Screening Sprint",
      sponsor: "Himalaya Wellness Company",
      partnerCollege: "National Institute of Ayurveda",
      targetHires: 15,
      matchedScholars: 12,
      startDate: "Nov 15, 2026",
      stipend: "Cloud GPU Compute Grants + ₹12,000 Bounty",
      guaranteedOutcome: "Direct Pre-Placement Offers (PPOs) for Top 5",
      status: "Cohort Enrolling"
    }
  ],

  // Idea 7: Skill Match ROI & Evaluation Loop
  skillRoiMetrics: {
    predictedMatchAccuracy: 94.2,
    totalHiresEvaluated: 48,
    averageRecruiterRating: 4.8,
    feedbackLogs: [
      { candidate: "Ashay Verma", predictedMatch: 94, actualLabRating: 4.9, company: "Dabur R&D", note: "Exceptional botanical extraction & Python modeling accuracy." },
      { candidate: "Pooja Verma", predictedMatch: 86, actualLabRating: 4.6, company: "Himalaya", note: "Solid chromatography fundamentals; fast learner." }
    ]
  },

  applications: [
    {
      id: "app-seed-01",
      opportunityId: "opp-1",
      opportunityTitle: "Phytochemical Research Intern",
      company: "Dabur India Ltd.",
      type: "Internship",
      studentName: "Ashay Verma",
      studentEmail: "student@nexus.edu",
      college: "All India Institute of Ayurveda (AIIA), New Delhi",
      skills: ["Herbal Formulation", "Phytochemistry", "GLP", "Python"],
      match: 94,
      appliedDate: "2026-09-03",
      status: "Shortlisted",
      verifiedBadge: "AIIA-CERT-2026-9842",
      coverNote: "Strong background in botanical extraction protocols and AutoDock docking simulations."
    },
    {
      id: "app-seed-02",
      opportunityId: "opp-2",
      opportunityTitle: "Ayush AI Innovation Challenge 2026",
      company: "Ministry of Ayush & AIIA",
      type: "Hackathon",
      studentName: "Priya Nair",
      studentEmail: "priya@nexus.edu",
      college: "Gujarat Ayurved University, Jamnagar",
      skills: ["Drug Discovery", "Phytochemistry", "HPTLC", "AutoDock"],
      match: 96,
      appliedDate: "2026-09-02",
      status: "Interview Scheduled",
      verifiedBadge: "GAU-CERT-2026-1104",
      coverNote: "Expert in HPTLC standardization and molecular docking."
    },
    {
      id: "app-seed-03",
      opportunityId: "opp-3",
      opportunityTitle: "Formulation Development Scientist",
      company: "Patanjali Research Foundation",
      type: "Job",
      studentName: "Kavya Singh",
      studentEmail: "kavya@nexus.edu",
      college: "AIIA New Delhi",
      skills: ["Health Informatics", "Python", "NLP for Classical Texts", "SQL"],
      match: 91,
      appliedDate: "2026-09-04",
      status: "Pending Review",
      verifiedBadge: "AIIA-CERT-2026-8831",
      coverNote: "Prakriti classification ML models and classical NLP extraction pipelines."
    },
    {
      id: "app-103",
      opportunityId: "opp-gig-1",
      opportunityTitle: "Clean & Standardize 50 Ashwagandha Trial Records",
      company: "Dabur Research Labs",
      type: "Micro-Gig",
      studentName: "Ashay Verma",
      studentEmail: "student@nexus.edu",
      college: "All India Institute of Ayurveda (AIIA), New Delhi",
      skills: ["Data Analysis", "Phytochemistry"],
      match: 90,
      appliedDate: "2026-09-04",
      status: "Offer Extended",
      verifiedBadge: "AIIA-CERT-2026-9842"
    }
  ],

  mou_partnerships: [
    {
      id: "mou-01",
      partner: "Dabur Research Laboratories",
      institution: "All India Institute of Ayurveda",
      status: "Active",
      signedDate: "2025-06-12",
      validUntil: "2028-06-12",
      focusAreas: ["Nanomedicine in Ayurveda", "Student Internships", "Joint Patents"],
      internshipsProvided: 18,
      curriculumSponsors: "Standardization of Kwatha Formulations"
    },
    {
      id: "mou-02",
      partner: "Himalaya Drug Company",
      institution: "All India Institute of Ayurveda",
      status: "Active",
      signedDate: "2025-09-20",
      validUntil: "2027-09-20",
      focusAreas: ["Pharmacovigilance", "Clinical Trial Protocols", "Faculty Industrial Training"],
      internshipsProvided: 12,
      curriculumSponsors: "Computational Herbal Discovery"
    },
    {
      id: "mou-03",
      partner: "Aimil Pharmaceuticals",
      institution: "All India Institute of Ayurveda",
      status: "Reviewing Renewal",
      signedDate: "2024-02-15",
      validUntil: "2026-12-31",
      focusAreas: ["Metabolic Disorders Formulations", "Sponsored PG Dissertations"],
      internshipsProvided: 9,
      curriculumSponsors: "Herbal Quality Control & HPTLC"
    }
  ],

  consultancy_grants: [
    {
      id: "cg-01",
      title: "Standardization of Ashwagandha Active Withanolides in Water-Soluble Matrix",
      industry: "Dabur R&D",
      grantAmount: "₹18,50,000",
      deadline: "2026-11-15",
      targetDept: "Dravyaguna / Pharmaceutical Sciences",
      status: "Open for Faculty Proposals"
    },
    {
      id: "cg-02",
      title: "Bio-Efficacy Validation of Triphala Nano-Suspension in Gut Microbiome Models",
      industry: "Himalaya Drug Co.",
      grantAmount: "₹24,00,000",
      deadline: "2026-12-01",
      targetDept: "Kaya Chikitsa & Microbiology",
      status: "Open for Faculty Proposals"
    }
  ],

  fdp_programs: [
    {
      id: "fdp-01",
      title: "Industrial Immersion in High-Throughput Herbal Extraction & HPTLC",
      organizer: "National Medicinal Plants Board (NMPB) & Dabur Labs",
      duration: "2 Weeks (Hands-on Lab Immersion)",
      mode: "Offline at R&D Campus, Ghaziabad",
      eligibility: "Assistant / Associate Professors in Ayush",
      enrolled: 24,
      seats: 30
    },
    {
      id: "fdp-02",
      title: "Generative AI & Data Analytics for Traditional Medicine Curriculums",
      organizer: "All India Institute of Ayurveda & IIT Delhi Ayush Cell",
      duration: "1 Week (30 Hours)",
      mode: "Hybrid (Virtual + Weekend Hands-on)",
      eligibility: "All Ayush Faculty Members",
      enrolled: 68,
      seats: 100
    }
  ]
};

module.exports = DB;
