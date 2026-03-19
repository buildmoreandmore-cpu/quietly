import { createClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Browser client (use in client components) — lazy init to avoid build-time errors
export function createSupabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (!url || !key) {
    // Return a dummy client that won't crash but won't work
    // This only happens during static build
    return createBrowserClient("https://placeholder.supabase.co", "placeholder");
  }
  return createBrowserClient(url, key);
}

// Simple client for server-side (API routes)
export function getSupabase() {
  if (!supabaseUrl) {
    return createClient("https://placeholder.supabase.co", "placeholder");
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = getSupabase();

export function getServerSupabase() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;
  if (!supabaseUrl) {
    return createClient("https://placeholder.supabase.co", "placeholder");
  }
  return createClient(supabaseUrl, serviceKey);
}
