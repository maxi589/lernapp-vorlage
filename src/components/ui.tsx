// Kleine Bausteine, die alle Seiten teilen.

export function PageTitle({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <h1 className="text-3xl font-semibold tracking-tight">{children}</h1>
      {right}
    </div>
  );
}

export function CourseTag({ color, children }: { color?: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 text-xs font-medium" style={{ background: `color-mix(in srgb, var(--c-${color ?? "grau"}) 14%, transparent)`, color: `var(--c-${color ?? "grau"})` }}>
      {children}
    </span>
  );
}

export const input = "min-w-0 rounded-md border border-line bg-bg px-3 py-2";
export const button = "rounded-md bg-ink px-3 py-2 font-medium text-bg";
export const ghost = "rounded-md px-2 py-1 text-sm text-mute hover:text-ink";

export function Check({ done, onClick, label }: { done: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={done}
      className={`grid size-6 shrink-0 place-items-center rounded-full border ${done ? "border-ink bg-ink text-bg" : "border-line"}`}
    >
      {done && <span className="text-xs">✓</span>}
    </button>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="py-6 text-mute">{children}</p>;
}
