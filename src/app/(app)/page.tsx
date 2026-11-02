"use client";

import { useTable } from "@/lib/use-table";
import { useToday } from "@/lib/use-today";
import { daysBetween, inDays, label } from "@/lib/dates";
import { Check, CourseTag, Empty, PageTitle } from "@/components/ui";

export default function HeutePage() {
  const today = useToday();
  const courses = useTable("courses");
  const blocks = useTable("study_blocks");
  const exams = useTable("exams");
  const course = (id: string | null) => courses.rows.find((c) => c.id === id);

  if (!today) return null;
  const todays = blocks.rows.filter((b) => b.date === today).sort((a, b) => a.start.localeCompare(b.start));
  const next = exams.rows
    .filter((e) => !e.done && e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  return (
    <>
      <PageTitle>{label(today)}</PageTitle>

      <section className="mb-12">
        <h2 className="mb-2 text-sm font-medium text-mute">Lernblöcke heute</h2>
        {todays.length === 0 && <Empty>Heute nichts geplant.</Empty>}
        <ul className="divide-y divide-line border-y border-line">
          {todays.map((b) => {
            const c = course(b.course_id);
            return (
              <li key={b.id} className="flex items-center gap-4 py-3">
                <Check done={b.done} onClick={() => blocks.patch(b.id, { done: !b.done })} label="Abhaken" />
                <span className="w-36 shrink-0 tabular-nums text-mute">
                  {b.start} bis {b.end}
                </span>
                <span className={`min-w-0 flex-1 truncate ${b.done ? "text-mute line-through" : ""}`}>{b.title}</span>
                {c && <CourseTag color={c.color}>{c.short || c.name}</CourseTag>}
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-medium text-mute">Als Nächstes</h2>
        {next.length === 0 && <Empty>Keine offenen Prüfungen.</Empty>}
        <ul className="grid gap-3 sm:grid-cols-3">
          {next.map((e) => {
            const c = course(e.course_id);
            return (
              <li key={e.id} className="rounded-lg border border-line p-4">
                <div className="text-3xl font-semibold tabular-nums tracking-tight">{inDays(daysBetween(today, e.date))}</div>
                <div className="mt-2 font-medium">{e.title}</div>
                <div className="mt-1 flex items-center gap-2 text-sm text-mute">
                  {label(e.date)} {c && <CourseTag color={c.color}>{c.short || c.name}</CourseTag>}
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
