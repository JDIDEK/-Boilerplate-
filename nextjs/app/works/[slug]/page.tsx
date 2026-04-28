import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { featuredProjects, getProjectBySlug } from "@/data/projects";

type WorkPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return featuredProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: WorkPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {};
  }

  return {
    title: `${project.title} - Maison Lame`,
    description: project.summary,
  };
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-[var(--color-divider)] bg-[color-mix(in_oklab,var(--color-paper),transparent_8%)] backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-6 px-5 py-4 text-[10px] uppercase tracking-[0.26em] text-[var(--color-fade)] sm:px-8">
          <Link href="/#works" className="transition-colors hover:text-[var(--color-ink)]">
            Retour
          </Link>
          <span>{project.number} / Maison Lame</span>
          <Link href="/#footer" className="transition-colors hover:text-[var(--color-ink)]">
            Commander
          </Link>
        </div>
      </header>

      <section className="px-5 pb-12 pt-24 sm:px-8 sm:pb-16 sm:pt-28">
        <div className="mx-auto grid w-full max-w-[1600px] gap-8 lg:grid-cols-[0.58fr_0.42fr] lg:items-end">
          <div>
            <p className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[var(--color-fade)]">
              {project.category} / {project.year}
            </p>
            <h1 className="font-editorial text-[clamp(4.4rem,16vw,17rem)] uppercase leading-[0.78] tracking-[-0.04em]">
              {project.title}
            </h1>
          </div>
          <p className="max-w-[48ch] text-sm leading-relaxed text-[var(--color-soft-ink)] sm:text-base">
            {project.detail}
          </p>
        </div>
      </section>

      <section className="relative h-[72vh] min-h-[520px] overflow-hidden bg-[#111]">
        <Image src={project.image} alt={project.title} fill priority sizes="100vw" className="object-cover" />
        <div className={`absolute inset-0 bg-linear-to-br opacity-45 mix-blend-multiply ${project.accent}`} />
        <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.72)_100%)] px-5 py-6 text-[var(--color-cream)] sm:px-8">
          <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-end justify-between gap-5">
            <p className="max-w-[34ch] text-[10px] uppercase tracking-[0.26em] text-[var(--color-muted)]">
              Steel: {project.steel}
            </p>
            <p className="max-w-[34ch] text-right text-[10px] uppercase tracking-[0.26em] text-[var(--color-muted)]">
              Handle: {project.handle}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-earth)] px-5 py-18 text-[var(--color-cream)] sm:px-8 sm:py-24">
        <div className="mx-auto grid w-full max-w-[1600px] gap-10 lg:grid-cols-[0.35fr_0.65fr]">
          <div className="space-y-3 text-[10px] uppercase tracking-[0.26em] text-[var(--color-muted)]">
            <p>Fiche piece</p>
            <p>{project.steel}</p>
            <p>{project.handle}</p>
          </div>
          <div>
            <h2 className="font-editorial text-[clamp(2.8rem,8vw,8rem)] uppercase leading-[0.86] tracking-[-0.02em]">
              Details de fabrication
            </h2>
            <ul className="mt-8 border-t border-[var(--color-border)]">
              {project.specs.map((spec, index) => (
                <li
                  key={spec}
                  className="flex items-center justify-between gap-6 border-b border-[var(--color-border)] py-5 text-sm uppercase tracking-[0.18em] text-[var(--color-soft)]"
                >
                  <span>0{index + 1}</span>
                  <span className="text-right">{spec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
