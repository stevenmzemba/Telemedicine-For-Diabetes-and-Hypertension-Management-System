// Fill these with your Supabase project values
// Obtain from your Supabase project settings.
const SUPABASE_URL = "REPLACE_WITH_YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "REPLACE_WITH_YOUR_SUPABASE_ANON_KEY";

// Create a global `supabaseClient` and `supabase` for compatibility
if (typeof window !== 'undefined' && typeof supabase !== 'undefined') {
  // UMD exposes `supabase` with `createClient` function
  window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  // also expose `supabase` variable expected by older code
  window.supabase = window.supabaseClient;
}
