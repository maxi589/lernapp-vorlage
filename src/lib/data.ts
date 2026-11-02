// Alle Datenzugriffe der App laufen über diese Datei.
// Zwei Speicherorte, gleiche Funktionen:
//   "supabase": Online-Datenbank mit Login (wenn .env.local ausgefüllt ist)
//   "local":    Browser-Speicher mit Beispieldaten (zum Ausprobieren, Notfallweg)

import { getSupabase, supabaseConfigured } from "./supabase";
import type { Tables } from "./types";
import { demoData } from "./demo";

export type TableName = keyof Tables;
export const dataMode: "supabase" | "local" = supabaseConfigured ? "supabase" : "local";

const LS = (t: TableName) => `lernapp:${t}`;

function readLocal<T extends TableName>(table: T): Tables[T][] {
  try {
    const raw = localStorage.getItem(LS(table));
    if (raw) return JSON.parse(raw);
    const seed = demoData()[table] as Tables[T][];
    localStorage.setItem(LS(table), JSON.stringify(seed));
    return seed;
  } catch {
    return [];
  }
}

function writeLocal<T extends TableName>(table: T, rows: Tables[T][]) {
  try {
    localStorage.setItem(LS(table), JSON.stringify(rows));
  } catch {
    // Speicher voll oder gesperrt: dann bleibt es nur für diese Sitzung
  }
}

function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

export async function list<T extends TableName>(table: T): Promise<Tables[T][]> {
  const sb = getSupabase();
  if (!sb) return readLocal(table);
  const { data, error } = await sb.from(table).select("*").order("created_at");
  if (error) throw new Error(error.message);
  return (data ?? []) as Tables[T][];
}

export async function insert<T extends TableName>(table: T, row: Omit<Tables[T], "id" | "created_at">): Promise<Tables[T]> {
  const sb = getSupabase();
  if (!sb) {
    const full = { ...row, id: newId(), created_at: new Date().toISOString() } as Tables[T];
    writeLocal(table, [...readLocal(table), full]);
    return full;
  }
  const { data, error } = await sb.from(table).insert(row as never).select().single();
  if (error) throw new Error(error.message);
  return data as Tables[T];
}

export async function update<T extends TableName>(table: T, id: string, patch: Partial<Tables[T]>): Promise<void> {
  const sb = getSupabase();
  if (!sb) {
    writeLocal(table, readLocal(table).map((r) => (r.id === id ? { ...r, ...patch } : r)));
    return;
  }
  const { error } = await sb.from(table).update(patch as never).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function remove(table: TableName, id: string): Promise<void> {
  const sb = getSupabase();
  if (!sb) {
    writeLocal(table, readLocal(table).filter((r) => r.id !== id));
    return;
  }
  const { error } = await sb.from(table).delete().eq("id", id);
  if (error) throw new Error(error.message);
}
