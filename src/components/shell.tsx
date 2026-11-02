"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { dataMode } from "@/lib/data";

const NAV = [
  { href: "/", label: "Heute" },
  { href: "/kurse", label: "Kurse" },
  { href: "/pruefungen", label: "Prüfungen" },
  { href: "/woche", label: "Woche" },
];

// Rahmen der App: links die Navigation (am Handy unten), rechts der Inhalt.
export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[220px_1fr]">
      <aside className="hidden border-r border-line p-5 md:flex md:flex-col md:gap-1">
        <div className="mb-6 text-lg font-semibold tracking-tight">Lern-App</div>
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={`rounded-md px-3 py-2 ${active(n.href) ? "bg-panel font-medium" : "text-mute hover:text-ink"}`}
          >
            {n.label}
          </Link>
        ))}
        <div className="mt-auto space-y-2 text-sm text-mute">
          <div>{dataMode === "supabase" ? "Gespeichert in Supabase" : "Gespeichert im Browser"}</div>
          {dataMode === "supabase" && (
            <button onClick={() => getSupabase()?.auth.signOut({ scope: "local" })} className="hover:text-ink">
              Abmelden
            </button>
          )}
        </div>
      </aside>
      <main className="mx-auto w-full max-w-4xl px-4 pb-28 pt-6 md:px-10 md:pt-10">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 grid grid-cols-4 border-t border-line bg-bg pb-[env(safe-area-inset-bottom)] md:hidden">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className={`py-3 text-center text-sm ${active(n.href) ? "font-semibold" : "text-mute"}`}>
            {n.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
