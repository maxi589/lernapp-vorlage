"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

// Schützt alle Seiten der App: Ohne Anmeldung geht es zur Login-Seite.
// Im Browser-Modus (ohne Supabase) gibt es keinen Login.
// Die eigentliche Sicherheit liegt in der Datenbank (Zugriffsregeln in supabase/schema.sql).
export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      setReady(true);
      return;
    }
    sb.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
      else router.replace("/login");
    });
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) => {
      if (!session) router.replace("/login");
    });
    return () => sub.subscription.unsubscribe();
  }, [router]);

  if (!ready) return <div className="p-8 text-mute">Lädt …</div>;
  return <>{children}</>;
}
