# JOBLEX Project Rules

## This is a Deployed Production Project

- **Never** use words like "demo", "mock", "fake", "placeholder", "dummy", or "sample" in code, comments, UI text, or variable names.
- All data must come from real APIs and the Supabase database — never hardcode fake/demo data.
- All API keys and secrets must be stored in the `.env` file and accessed via `process.env` on the backend. Never commit real secrets to Git.

## Error Handling

- **Never** expose raw backend errors, stack traces, or technical error messages to the user.
- Always show user-friendly error messages in the UI (e.g., "Something went wrong. Please try again.").
- Log detailed errors server-side only (using `console.error`).
- Never write code that simply shows an `if/else` statement as a response to the user — always handle errors gracefully with proper UI feedback (toasts, inline messages, loading states).

## Code Quality

- Think carefully before making any change — understand the impact on the full system before proceeding.
- Every feature must be fully functional end-to-end (frontend → API → database), not a stub.
- Use real API integrations (Supabase, Gemini AI, etc.) configured via `.env`.
- Maintain the `.env` file with all required environment variables, documented with comments.

## Tech Stack

- **Frontend:** Vanilla HTML5, Tailwind CSS (CDN), vanilla JavaScript (ES6+ modules in `js/frontend/`).
- **Backend:** Node.js / Express (`backend/server.js`), route files in `backend/routes/`.
- **Database:** Supabase (PostgreSQL) configured in `backend/config/supabase.js`.
- **AI:** Google Gemini API for Zulu AI features.
