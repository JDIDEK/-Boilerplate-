export function NarrativeSection() {
  return (
    <section className="reveal-section bg-[var(--color-earth)] px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto grid w-full max-w-[1600px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="space-y-3 text-[10px] uppercase tracking-[0.26em] text-[var(--color-muted)]">
          <p>Atelier</p>
          <p>Geste avant effet</p>
          <p>Acier / Bois / Feu</p>
        </div>
        <div className="space-y-5">
          <p className="reveal-title font-editorial text-[clamp(3rem,9.7vw,10rem)] uppercase leading-[0.84] tracking-[-0.02em] text-[var(--color-cream)]">
            Forger
            <br />
            Une Lame
            <br />
            Juste
          </p>
          <p className="max-w-[52ch] text-sm leading-relaxed text-[var(--color-soft)] sm:text-base">
            Chaque couteau part d&apos;un usage concret: le poids d&apos;une main, la hauteur d&apos;une planche,
            la cadence d&apos;un service. Les lignes restent sobres pour laisser parler l&apos;equilibre, le fil
            et la matiere.
          </p>
        </div>
      </div>
    </section>
  );
}
