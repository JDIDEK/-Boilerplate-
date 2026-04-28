const navLinks = [
  { label: "Accueil", href: "#home" },
  { label: "Lames", href: "#works" },
  { label: "Atelier", href: "#break" },
  { label: "Contact", href: "#footer" },
];

export function MinimalNavigation() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-ink),transparent_15%)] backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-6 px-5 py-4 text-[10px] uppercase tracking-[0.26em] text-[var(--color-muted)] sm:px-8">
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <span>Thiers / FR</span>
          <span>45.8569 N 3.5476 E</span>
          <span>2026</span>
          <span>Sur commande</span>
        </div>
        <nav aria-label="Primary" className="flex items-center gap-4 sm:gap-7">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors duration-300 hover:text-[var(--color-cream)] focus-visible:text-[var(--color-cream)]"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
