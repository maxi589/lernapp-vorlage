"use client";

import { useState } from "react";
import { useTable } from "@/lib/use-table";
import { useToday } from "@/lib/use-today";
import { daysBetween, inDays, label } from "@/lib/dates";
import type { Exam } from "@/lib/types";
import { button, Check, CourseTag, Empty, ghost, input, PageTitle } from "@/components/ui";

const KIND: Record<Exam["kind"], string> = { pruefung: "Prüfung", abgabe: "Abgabe", frist: "Frist" };

export default function PruefungenPage() {
  const today = useToday();
  const courses = useTable("courses");
  const exams = useTable("exams");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [kind, setKind] = useState<Exam["kind"]>("pruefung");
  const [courseId, setCourseId] = useState("");

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !date) return;
    await exams.add({ title: title.trim(), date, kind, course_id: courseId || null, done: false });
    setTitle("");
    setDate("");
  }

  const sorted = [...exams.rows].sort((a, b) => Number(a.done) - Number(b.done) || a.date.localeCompare(b.date));

  return (
    <>
      <PageTitle>Prüfungen</PageTitle>
      <form onSubmit={add} className="mb-8 flex flex-wrap gap-2">
        <input id="pr-titel" className={`${input} basis-full sm:basis-0 sm:flex-1`} placeholder="z. B. Klausur Statistik" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input id="pr-datum" type="date" className={input} value={date} onChange={(e) => setDate(e.target.value)} aria-label="Datum" />
        <select id="pr-art" className={input} value={kind} onChange={(e) => setKind(e.target.value as Exam["kind"])} aria-label="Art">
          {Object.entries(KIND).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <select id="pr-kurs" className={input} value={courseId} onChange={(e) => setCourseId(e.target.value)} aria-label="Kurs">
          <option value="">Ohne Kurs</option>
          {courses.rows.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button className={button}>Eintragen</button>
      </form>

      {!exams.loading && sorted.length === 0 && <Empty>Noch keine Prüfungen.</Empty>}
      <ul className="divide-y divide-line border-y border-line">
        {sorted.map((e) => {
          const c = courses.rows.find((x) => x.id === e.course_id);
          const d = today ? daysBetween(today, e.date) : null;
          return (
            <li key={e.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3">
              <Check done={e.done} onClick={() => exams.patch(e.id, { done: !e.done })} label="Erledigt" />
              <span className={`min-w-0 flex-1 ${e.done ? "text-mute line-through" : "font-medium"}`}>{e.title}</span>
              <span className="text-sm text-mute">{KIND[e.kind]}</span>
              {c && <CourseTag color={c.color}>{c.short || c.name}</CourseTag>}
              <span className="w-20 text-right tabular-nums text-mute">{label(e.date)}</span>
              <span className={`w-24 text-right tabular-nums ${d !== null && d >= 0 && d <= 7 && !e.done ? "font-semibold text-[var(--c-rot)]" : "text-mute"}`}>
                {d !== null ? inDays(d) : ""}
              </span>
              <button className={ghost} onClick={() => exams.del(e.id)}>
                Löschen
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}
