"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { FeaturedProject } from "@/data/projects";

type FeaturedWorksProps = {
  projects: FeaturedProject[];
};

export function FeaturedWorks({ projects }: FeaturedWorksProps) {
  const [activeId, setActiveId] = useState(projects[0]?.id ?? "");
  const activeProject = projects.find((project) => project.id === activeId) ?? projects[0];

  return (
    <section id="works" className="bg-[var(--color-paper)] px-5 py-18 text-[var(--color-ink)] sm:px-8 sm:py-24">
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="reveal-section mb-10 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end sm:gap-10">
          <h2 className="reveal-title font-editorial text-[clamp(2.8rem,9.2vw,9.5rem)] uppercase leading-[0.86] tracking-[-0.02em]">
            Lames Choisies
          </h2>
          <p className="max-w-[38ch] text-xs uppercase tracking-[0.18em] text-[var(--color-fade)]">
            Pieces de cuisine et de table pensees comme des objets de service durables.
          </p>
        </div>

        <div className="grid gap-9 lg:grid-cols-[0.5fr_0.5fr] lg:gap-12">
          <ul className="border-y border-[var(--color-divider)]">
            {projects.map((project) => {
              const isActive = activeProject?.id === project.id;

              return (
                <li key={project.id} className="project-row border-b border-[var(--color-divider)] last:border-b-0">
                  <Link
                    href={`/works/${project.slug}`}
                    onMouseEnter={() => setActiveId(project.id)}
                    onFocus={() => setActiveId(project.id)}
                    className="group flex w-full flex-col gap-4 py-7 text-left sm:py-8"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[11px] uppercase tracking-[0.28em] text-[var(--color-fade)]">
                        {project.number}
                      </span>
                      <span className="project-row-meta text-[10px] uppercase tracking-[0.22em] text-[var(--color-fade)] transition-transform duration-300 group-hover:-translate-x-1 group-focus-visible:-translate-x-1">
                        {project.category} / {project.year}
                      </span>
                    </div>

                    <h3 className="project-row-title font-editorial text-[clamp(2.4rem,7.4vw,6.8rem)] uppercase leading-[0.87] tracking-[-0.02em]">
                      {project.title}
                    </h3>

                    <p className="project-row-copy max-w-[45ch] text-sm leading-relaxed text-[var(--color-soft-ink)] transition-transform duration-300 group-hover:translate-x-2 group-focus-visible:translate-x-2 sm:text-base">
                      {project.summary}
                    </p>

                    <div className="project-image relative overflow-hidden border border-[var(--color-divider)] bg-[#12110f] lg:hidden">
                      <Image
                        src={project.image}
                        alt={project.title}
                        width={900}
                        height={620}
                        className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105 group-focus-visible:scale-105 sm:h-56"
                      />
                    </div>

                    <span
                      className={`h-px w-full transition-colors duration-300 ${
                        isActive ? "bg-[var(--color-ink)]" : "bg-[var(--color-divider)]"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <aside className="hidden lg:block">
            <div className="works-preview-panel sticky top-28 h-[68vh] min-h-[500px] overflow-hidden border border-[var(--color-divider)] bg-[#120f0d]">
              {projects.map((project) => {
                const isActive = activeProject?.id === project.id;

                return (
                  <article
                    key={project.id}
                    className={`works-preview-layer absolute inset-0 transition-[opacity,transform,clip-path] duration-500 ${
                      isActive ? "z-10 opacity-100 scale-100" : "z-0 opacity-0 scale-[1.04]"
                    }`}
                    style={{ clipPath: isActive ? "inset(0 0 0 0)" : "inset(0 0 100% 0)" }}
                    aria-hidden={!isActive}
                  >
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="50vw"
                      className="works-preview-media object-cover"
                    />
                    <div className={`absolute inset-0 bg-linear-to-br opacity-55 mix-blend-multiply ${project.accent}`} />
                    <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent_0%,#0d0b09_74%)] p-8">
                      <p className="text-[10px] uppercase tracking-[0.26em] text-[var(--color-muted)]">
                        {project.number} / {project.category}
                      </p>
                      <p className="mt-3 font-editorial text-[clamp(2.1rem,4.2vw,4rem)] uppercase leading-[0.9] tracking-[-0.02em] text-[var(--color-cream)]">
                        {project.title}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
