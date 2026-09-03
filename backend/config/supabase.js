/**
 * JOBLEX Supabase Client Configuration
 * Uses @supabase/supabase-js with standard process.env (no dotenv package required)
 * Includes graceful local fallback if Supabase project keys are pending in .env
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder-key';

const isConfigured = Boolean(
  process.env.SUPABASE_URL && 
  !process.env.SUPABASE_URL.includes('placeholder') &&
  !process.env.SUPABASE_URL.includes('your-project-id') &&
  (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY) &&
  !String(process.env.SUPABASE_ANON_KEY || '').includes('your-supabase')
);

let supabase = null;
try {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: false
    }
  });
} catch (err) {
  console.warn('[Supabase] Initialization warning:', err.message);
}

module.exports = {
  supabase,
  isConfigured
};
