const experiments = [
  {
    title: "Choix de l'acier",
    note: "Inox fin pour l'entretien simple, carbone pour le mordant et la patine.",
  },
  {
    title: "Emouture lente",
    note: "La geometrie est amincie a la main pour limiter la resistance dans l'aliment.",
  },
  {
    title: "Manche sur mesure",
    note: "Bois stabilise, micarta ou laiton selon la prise, le poids et l'usage.",
  },
  {
    title: "Affutage final",
    note: "Chaque piece part avec un fil teste, une fiche d'entretien et une housse.",
  },
];

export function BreakExperiments() {
  return (
    <section id="break" className="reveal-section bg-[#090806] px-5 py-18 sm:px-8 sm:py-24">
      <div className="mx-auto w-full max-w-[1600px]">
        <h2 className="reveal-title font-editorial text-[clamp(2.8rem,8.6vw,9.2rem)] uppercase leading-[0.87] tracking-[-0.02em] text-[var(--color-cream)]">
          Atelier / Process
        </h2>
        <ol className="mt-9 border-t border-[var(--color-border)]">
          {experiments.map((item, index) => (
            <li
              key={item.title}
              className="grid gap-3 border-b border-[var(--color-border)] py-6 sm:grid-cols-[0.15fr_0.85fr] sm:items-start sm:gap-6"
            >
              <span className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-muted)]">
                0{index + 1}
              </span>
              <div className="space-y-2">
                <p className="font-editorial text-[clamp(1.8rem,5.4vw,4.9rem)] uppercase leading-[0.93] tracking-[-0.018em] text-[var(--color-cream)]">
                  {item.title}
                </p>
                <p className="max-w-[48ch] text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
                  {item.note}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
