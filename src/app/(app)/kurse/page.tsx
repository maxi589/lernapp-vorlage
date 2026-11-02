"use client";

import { useState } from "react";
import { useTable } from "@/lib/use-table";
import { COURSE_COLORS } from "@/lib/types";
import { button, CourseTag, Empty, ghost, input, PageTitle } from "@/components/ui";

export default function KursePage() {
  const courses = useTable("courses");
  const links = useTable("course_links");
  const [openId, setOpenId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [short, setShort] = useState("");
  const [color, setColor] = useState<string>("blau");
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  async function addCourse(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const c = await courses.add({ name: name.trim(), short: short.trim(), color, notes: "" });
    setName("");
    setShort("");
    setOpenId(c.id);
  }

  async function addLink(e: React.FormEvent, courseId: string) {
    e.preventDefault();
    if (!linkUrl.trim()) return;
    const url = /^https?:\/\//.test(linkUrl.trim()) ? linkUrl.trim() : `https://${linkUrl.trim()}`;
    await links.add({ course_id: courseId, title: linkTitle.trim() || url, url });
    setLinkTitle("");
    setLinkUrl("");
  }

  return (
    <>
      <PageTitle>Kurse</PageTitle>

      <form onSubmit={addCourse} className="mb-8 flex flex-wrap gap-2">
        <input id="kurs-name" className={`${input} basis-full sm:basis-0 sm:flex-1`} placeholder="Neuer Kurs, z. B. Statistik" value={name} onChange={(e) => setName(e.target.value)} />
        <input id="kurs-kuerzel" className={`${input} w-28`} placeholder="Kürzel" value={short} onChange={(e) => setShort(e.target.value)} />
        <select id="kurs-farbe" className={input} value={color} onChange={(e) => setColor(e.target.value)} aria-label="Farbe">
          {COURSE_COLORS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button className={button}>Anlegen</button>
      </form>

      {!courses.loading && courses.rows.length === 0 && <Empty>Noch keine Kurse.</Empty>}
      <ul className="divide-y divide-line border-y border-line">
        {courses.rows.map((c) => {
          const open = openId === c.id;
          const own = links.rows.filter((l) => l.course_id === c.id);
          return (
            <li key={c.id}>
              <button onClick={() => setOpenId(open ? null : c.id)} className="flex w-full items-center gap-3 py-4 text-left" aria-expanded={open}>
                <span className="size-3 shrink-0 rounded-sm" style={{ background: `var(--c-${c.color})` }} />
                <span className="flex-1 font-medium">{c.name}</span>
                {c.short && <CourseTag color={c.color}>{c.short}</CourseTag>}
                <span className="text-mute">{own.length > 0 ? own.length === 1 ? "1 Link" : `${own.length} Links` : ""}</span>
              </button>
              {open && (
                <div className="grid gap-6 pb-6 pl-6">
                  <label className="grid gap-1.5">
                    <span className="text-sm text-mute">Notizen</span>
                    <textarea
                      id={`notizen-${c.id}`}
                      className={`${input} min-h-32`}
                      defaultValue={c.notes}
                      onBlur={(e) => e.target.value !== c.notes && courses.patch(c.id, { notes: e.target.value })}
                      placeholder="Was ist wichtig in diesem Kurs?"
                    />
                  </label>
                  <div>
                    <div className="mb-1.5 text-sm text-mute">Kursmaterial</div>
                    <ul className="mb-3 grid gap-1">
                      {own.map((l) => (
                        <li key={l.id} className="flex items-center gap-2">
                          <a href={l.url} target="_blank" rel="noopener" className="min-w-0 flex-1 truncate underline decoration-line underline-offset-4 hover:decoration-ink">
                            {l.title}
                          </a>
                          <button className={ghost} onClick={() => links.del(l.id)}>
                            Entfernen
                          </button>
                        </li>
                      ))}
                    </ul>
                    <form onSubmit={(e) => addLink(e, c.id)} className="flex flex-wrap gap-2">
                      <input id={`link-titel-${c.id}`} className={`${input} w-40`} placeholder="Titel" value={linkTitle} onChange={(e) => setLinkTitle(e.target.value)} />
                      <input id={`link-url-${c.id}`} className={`${input} flex-1`} placeholder="Link, z. B. zu Moodle oder OneDrive" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
                      <button className={button}>Hinzufügen</button>
                    </form>
                  </div>
                  <button className={`${ghost} justify-self-start`} onClick={() => courses.del(c.id)}>
                    Kurs löschen
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
