import { createClient } from "@supabase/supabase-js"

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase env vars. Copy .env.example to .env.local and fill in " +
    "VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
  )
}

// Ensure the URL is strictly the base origin (e.g. https://xyz.supabase.co),
// stripping any accidental paths like /rest/v1 or trailing slashes
let cleanUrl = supabaseUrl.trim()
try {
  cleanUrl = new URL(cleanUrl).origin
} catch (e) {
  // fallback if URL constructor fails
}

export const supabase = createClient(cleanUrl, supabaseAnonKey.trim())