import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Supabase ist nur aktiv, wenn beide Werte in .env.local (bzw. auf Vercel) stehen.
// Ohne sie läuft die App im Browser-Speicher (siehe lib/data.ts).
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

export const supabaseConfigured = Boolean(URL && KEY);

let client: SupabaseClient | null = null;

// Der Client entsteht erst beim ersten Aufruf im Browser, nie beim Bauen der Seiten.
export function getSupabase(): SupabaseClient | null {
  if (!supabaseConfigured || typeof window === "undefined") return null;
  if (!client) client = createClient(URL, KEY);
  return client;
}
