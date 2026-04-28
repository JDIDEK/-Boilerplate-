const socials = ["Instagram", "Atelier", "Catalogue", "Mail"];
const footerNav = [
  { label: "Accueil", href: "#home" },
  { label: "Lames", href: "#works" },
  { label: "Atelier", href: "#break" },
  { label: "Contact", href: "#footer" },
];

export function FooterCTA() {
  return (
    <footer id="footer" className="border-t border-[var(--color-border)] bg-[var(--color-ink)] px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto w-full max-w-[1600px] space-y-10">
        <div className="overflow-hidden border-y border-[var(--color-border)] py-5">
          <p className="footer-marquee font-editorial text-[clamp(2.6rem,8.5vw,8rem)] uppercase tracking-[-0.02em] text-[var(--color-cream)]">
            COMMANDER UNE PIECE · COMMANDER UNE PIECE · COMMANDER UNE PIECE ·
          </p>
        </div>

        <p className="font-editorial text-[clamp(2.1rem,6.2vw,5.6rem)] uppercase leading-[0.88] tracking-[-0.018em] text-[var(--color-cream)]">
          Discuter D&apos;Une
          <br />
          Lame Sur Mesure
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-[var(--color-muted)]">Contact</p>
            <a
              href="mailto:atelier@maisonlame.fr"
              className="text-xl leading-tight text-[var(--color-cream)] transition-colors hover:text-[var(--color-paper)]"
            >
              atelier@maisonlame.fr
            </a>
          </div>
          <nav aria-label="Social links" className="space-y-2 text-[11px] uppercase tracking-[0.22em]">
            {socials.map((social) => (
              <a key={social} href="#" className="block text-[var(--color-muted)] transition-colors hover:text-[var(--color-cream)]">
                {social}
              </a>
            ))}
          </nav>
          <nav aria-label="Footer navigation" className="space-y-2 text-[11px] uppercase tracking-[0.22em]">
            {footerNav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block text-[var(--color-muted)] transition-colors hover:text-[var(--color-cream)]"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] pt-5 text-[10px] uppercase tracking-[0.24em] text-[var(--color-muted)]">
          <span>Thiers, France</span>
          <span>Pieces sur commande</span>
          <a href="#home" className="transition-colors hover:text-[var(--color-cream)]">
            Retour haut
          </a>
          <span>2026</span>
        </div>
      </div>
    </footer>
  );
}
