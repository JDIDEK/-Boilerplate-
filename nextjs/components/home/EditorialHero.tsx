export function EditorialHero() {
  return (
    <section id="home" className="relative overflow-hidden px-5 pb-14 pt-30 sm:px-8 sm:pb-20 sm:pt-36 lg:pt-42">
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="hero-reveal mb-8 flex flex-wrap items-center justify-between gap-3 text-[10px] uppercase tracking-[0.28em] text-[var(--color-muted)] sm:mb-10">
          <p>A motion-led portfolio for cultural and fashion narratives.</p>
          <p>Now booking: Q3 2026 commissions</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <h1 className="font-editorial text-[clamp(4.2rem,15.2vw,16rem)] uppercase leading-[0.8] tracking-[-0.035em] text-[var(--color-cream)]">
              <span className="hero-reveal block">Maison</span>
              <span className="hero-reveal block pl-[8vw] sm:pl-[10vw] lg:pl-[6.8vw]">Motion</span>
              <span className="hero-reveal block">Practice</span>
            </h1>
            <div className="hero-reveal mt-8 grid max-w-[54rem] gap-3 text-[11px] uppercase tracking-[0.22em] text-[var(--color-muted)] sm:grid-cols-3 sm:gap-5">
              <span>Visual Direction</span>
              <span>Type in Movement</span>
              <span>Independent Practice</span>
            </div>
          </div>

          <div className="hero-media relative h-[46vh] min-h-[320px] overflow-hidden border border-[var(--color-border)] bg-[var(--color-charcoal)] lg:h-[62vh]">
          <div className="absolute inset-0 bg-[linear-gradient(155deg,#e8d9be_4%,#5e4033_48%,#16110f_100%)]" />
          <div className="absolute bottom-0 left-0 right-0 bg-[linear-gradient(180deg,transparent_0%,#0b0b0b_74%)] p-6">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-muted)]">Preview Reel / 02:31</p>
            <p className="mt-2 max-w-[28ch] text-sm text-[var(--color-cream)]">
              Curated edits, title studies, and brand sequences arranged as a moving index.
            </p>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}