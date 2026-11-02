// Datumshilfen. Nur im Browser aufrufen (in useEffect oder nach dem ersten Rendern).

const WD = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

export function iso(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function parse(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(s: string, n: number) {
  const d = parse(s);
  d.setDate(d.getDate() + n);
  return iso(d);
}

export function weekStart(s: string) {
  const d = parse(s);
  const shift = (d.getDay() + 6) % 7; // Montag = 0
  d.setDate(d.getDate() - shift);
  return iso(d);
}

// "Mo, 3.11."
export function label(s: string) {
  const d = parse(s);
  return `${WD[d.getDay()]}, ${d.getDate()}.${d.getMonth() + 1}.`;
}

export function daysBetween(from: string, to: string) {
  return Math.round((parse(to).getTime() - parse(from).getTime()) / 86400000);
}

export function inDays(n: number) {
  if (n === 0) return "heute";
  if (n === 1) return "morgen";
  if (n < 0) return `vor ${-n} Tagen`;
  return `in ${n} Tagen`;
}
