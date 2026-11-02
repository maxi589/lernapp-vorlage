// Platzhalter für Seiten, die noch gebaut werden. Wird ersetzt, sobald die Seite Inhalt hat.
export function EmptyPage({ title, hint }: { title: string; hint: string }) {
  return (
    <section>
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-3 text-mute">{hint}</p>
    </section>
  );
}
