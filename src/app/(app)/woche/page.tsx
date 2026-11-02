"use client";

import { useEffect, useState } from "react";
import { useTable } from "@/lib/use-table";
import { useToday } from "@/lib/use-today";
import { addDays, label, weekStart } from "@/lib/dates";
import { button, Check, CourseTag, ghost, input, PageTitle } from "@/components/ui";

export default function WochePage() {
  const today = useToday();
  const courses = useTable("courses");
  const blocks = useTable("study_blocks");
  const [start, setStart] = useState("");
  const [date, setDate] = useState("");
  const [from, setFrom] = useState("09:00");
  const [to, setTo] = useState("10:30");
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState("");

  useEffect(() => {
    if (today) {
      setStart(weekStart(today));
      setDate(today);
    }
  }, [today]);

  if (!start) return null;
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !date) return;
    await blocks.add({ title: title.trim(), date, start: from, end: to, course_id: courseId || null, done: false });
    setTitle("");
  }

  return (
    <>
      <PageTitle
        right={
          <div className="flex items-center gap-1">
            <button className={ghost} onClick={() => setStart(addDays(start, -7))} aria-label="Woche zurück">
              ←
            </button>
            <button className={ghost} onClick={() => today && setStart(weekStart(today))}>
              Heute
            </button>
            <button className={ghost} onClick={() => setStart(addDays(start, 7))} aria-label="Woche vor">
              →
            </button>
          </div>
        }
      >
        Woche ab {label(start)}
      </PageTitle>

      <form onSubmit={add} className="mb-8 flex flex-wrap gap-2">
        <input id="wo-titel" className={`${input} basis-full sm:basis-0 sm:flex-1`} placeholder="Was lernst du?" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input id="wo-datum" type="date" className={input} value={date} onChange={(e) => setDate(e.target.value)} aria-label="Datum" />
        <input id="wo-von" type="time" className={input} value={from} onChange={(e) => setFrom(e.target.value)} aria-label="Von" />
        <input id="wo-bis" type="time" className={input} value={to} onChange={(e) => setTo(e.target.value)} aria-label="Bis" />
        <select id="wo-kurs" className={input} value={courseId} onChange={(e) => setCourseId(e.target.value)} aria-label="Kurs">
          <option value="">Ohne Kurs</option>
          {courses.rows.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button className={button}>Planen</button>
      </form>

      <div className="grid gap-x-3 gap-y-6 md:grid-cols-7">
        {days.map((d) => {
          const list = blocks.rows.filter((b) => b.date === d).sort((a, b) => a.start.localeCompare(b.start));
          return (
            <section key={d} className="min-w-0">
              <h2 className={`mb-2 border-b pb-1 text-sm ${d === today ? "border-ink font-semibold" : "border-line text-mute"}`}>{label(d)}</h2>
              <ul className="grid gap-2">
                {list.map((b) => {
                  const c = courses.rows.find((x) => x.id === b.course_id);
                  return (
                    <li key={b.id} className="rounded-md border border-line p-2.5 text-sm" style={c ? { borderLeftColor: `var(--c-${c.color})`, borderLeftWidth: 3 } : undefined}>
                      <div className="flex items-start gap-2">
                        <Check done={b.done} onClick={() => blocks.patch(b.id, { done: !b.done })} label="Abhaken" />
                        <div className="min-w-0 flex-1">
                          <div className={`break-words ${b.done ? "text-mute line-through" : "font-medium"}`}>{b.title}</div>
                          <div className="tabular-nums text-mute">
                            {b.start} bis {b.end}
                          </div>
                          {c && <CourseTag color={c.color}>{c.short || c.name}</CourseTag>}
                        </div>
                      </div>
                      <button className={`${ghost} mt-1 px-0`} onClick={() => blocks.del(b.id)}>
                        Löschen
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
