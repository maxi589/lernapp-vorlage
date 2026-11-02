import type { Tables } from "./types";

// Beispieldaten für den Browser-Modus. Datumsangaben relativ zu heute, damit immer etwas ansteht.
function day(offset: number) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

export function demoData(): { [K in keyof Tables]: Tables[K][] } {
  return {
    courses: [
      { id: "c1", name: "Kostenrechnung", short: "KORE", color: "blau", notes: "Folien Kapitel 1 bis 4 sind prüfungsrelevant." },
      { id: "c2", name: "Wirtschaftsrecht", short: "WIRE", color: "orange", notes: "" },
      { id: "c3", name: "Statistik", short: "STAT", color: "gruen", notes: "Übungsblätter jeden Montag." },
    ],
    course_links: [{ id: "l1", course_id: "c1", title: "Folien auf Moodle", url: "https://learn.wu.ac.at" }],
    exams: [
      { id: "e1", course_id: "c1", title: "Zwischenklausur", date: day(9), kind: "pruefung", done: false },
      { id: "e2", course_id: "c3", title: "Übungsblatt 4", date: day(2), kind: "abgabe", done: false },
    ],
    study_blocks: [
      { id: "b1", course_id: "c1", title: "Kapitel 3 wiederholen", date: day(0), start: "10:00", end: "11:30", done: false },
      { id: "b2", course_id: "c3", title: "Übungsblatt 4", date: day(1), start: "14:00", end: "15:30", done: false },
    ],
  };
}
