# Lern-App: Regeln für Claude

Persönliche Lern-App: Kurse, Notizen, Links zum Kursmaterial, Prüfungen und Fristen, Wochenplan. Eine Person, ein Konto. Die Person, die mit dir baut, ist Einsteiger und kein Entwickler.

## Zusammenarbeit
- Deutsch, kurz, einfach. Jedes Fachwort beim ersten Mal in einem Satz erklären.
- Vor jeder größeren Änderung in 1 bis 2 Sätzen sagen, was passiert.
- Wenn die Person etwas klicken oder eintragen muss: genau eine Anweisung mit Ort und Text des Knopfs.
- Im Projektordner darfst du alles selbst machen (Dateien, Befehle, Pakete). Frag nur bei Konten, Kosten, Deploy und Push.
- Schlüssel und Passwörter nie im Chat. Die Person trägt sie selbst in `.env.local` bzw. bei Vercel ein. `.env.local` nicht lesen.
- Nach jedem Arbeitsschritt `_STATUS.md` (Stand) und am Ende `_UEBERGABE.md` (für den nächsten Chat, mit fertigen Start-Prompts) aktualisieren.

## Sparsam arbeiten (Pro-Abo)
- Keine Subagents, keine Websuche, keine Schleifen mit Browser-Screenshots.
- Nicht in `node_modules` oder `package-lock.json` lesen.
- `npm run build` nur am Ende einer Phase. Einen Fehler höchstens zweimal selbst beheben, dann der Person sagen, was los ist.

## Wo was steht
- Umfang und was nicht in v1 kommt: `Umfang_v1.md`.
- Datenarten: `src/lib/types.ts`. Tabellen und Zugriffsregeln: `supabase/schema.sql`.
- **Alle Datenzugriffe nur über `src/lib/data.ts`** (`list`, `insert`, `update`, `remove`). Ohne Supabase-Werte speichert die App im Browser mit Beispieldaten (`src/lib/demo.ts`), mit Werten in Supabase.
- Seiten: `src/app/(app)/` (Heute, Kurse, Prüfungen, Woche). Rahmen und Navigation: `src/components/shell.tsx`. Login: `src/app/login/page.tsx`, Schutz: `src/components/auth-gate.tsx`.
- Farben nur in `src/app/globals.css` (hell und dunkel). Kursfarben `--c-<farbe>`.

## Technik (nicht ändern)
- Next.js 16, React 19, Tailwind v4, Supabase. Versionen sind fest. Keine weiteren Frameworks oder UI-Bibliotheken.
- Seiten mit Daten sind Client-Komponenten (`"use client"`). „Heute“ und Datumsrechnung erst im Browser (in `useEffect`), nie beim Bauen.
- Im Browser nur der publishable key. Nie den secret oder service_role key in die App.
- Neue Tabellen: in `schema.sql` mit `user_id`, RLS und Regel wie die anderen, plus Typ in `types.ts`.

## Design
- Ruhig und klar wie Notion oder Linear. Viel Weißraum, wenig Text, keine Erklärsätze unter Überschriften.
- Eine Akzentfarbe nur für die wichtigste Aktion. Kursfarben für Kurse. Keine Verläufe, keine Schatten-Orgien, keine Emojis als Icons.
- Muss am Handy (390 px) gut aussehen: Eingabefelder 16 px, Knöpfe groß genug zum Tippen.
