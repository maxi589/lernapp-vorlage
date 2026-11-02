"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const sb = getSupabase();
    if (!sb) return router.replace("/");
    setBusy(true);
    setError("");
    const { error } = await sb.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setError("Mail oder Passwort stimmt nicht.");
    else router.replace("/");
  }

  return (
    <main className="grid min-h-dvh place-items-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">Anmelden</h1>
        {!supabaseConfigured && <p className="text-mute">Noch keine Datenbank verbunden. Die App speichert im Browser.</p>}
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          placeholder="Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-line bg-bg px-3 py-2.5"
        />
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-line bg-bg px-3 py-2.5"
        />
        {error && <p className="text-sm text-[var(--c-rot)]">{error}</p>}
        <button disabled={busy} className="w-full rounded-md bg-ink px-3 py-2.5 font-medium text-bg disabled:opacity-60">
          {busy ? "Anmelden …" : "Anmelden"}
        </button>
      </form>
    </main>
  );
}
