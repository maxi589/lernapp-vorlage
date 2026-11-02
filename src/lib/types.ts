// Die Datenarten der App. Jede Tabelle in supabase/schema.sql hat genau diese Felder (plus user_id).

export type Course = {
  id: string;
  name: string; // z. B. "Kostenrechnung"
  short: string; // Kürzel, z. B. "KORE"
  color: string; // Farbname aus COURSE_COLORS
  notes: string; // freie Notizen zum Kurs
  created_at?: string;
};

export type CourseLink = {
  id: string;
  course_id: string;
  title: string;
  url: string; // Link zu Folien, Moodle, OneDrive …
  created_at?: string;
};

export type Exam = {
  id: string;
  course_id: string | null;
  title: string;
  date: string; // JJJJ-MM-TT
  kind: "pruefung" | "abgabe" | "frist";
  done: boolean;
  created_at?: string;
};

export type StudyBlock = {
  id: string;
  course_id: string | null;
  title: string;
  date: string; // JJJJ-MM-TT
  start: string; // HH:MM
  end: string; // HH:MM
  done: boolean;
  created_at?: string;
};

export type Tables = {
  courses: Course;
  course_links: CourseLink;
  exams: Exam;
  study_blocks: StudyBlock;
};

export const COURSE_COLORS = ["blau", "gruen", "orange", "rot", "violett", "grau"] as const;
