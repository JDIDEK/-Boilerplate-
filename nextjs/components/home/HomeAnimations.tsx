"use client";

import { useEffect } from "react";
import gsap from "gsap";

export function HomeAnimations() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];

    if (reducedMotion) {
      gsap.set(".hero-reveal, .reveal-title", { clearProps: "all", opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      heroTimeline.from(".hero-reveal", {
        yPercent: 28,
        opacity: 0,
        duration: 1,
        stagger: 0.09,
      });

      const revealTargets = gsap.utils.toArray<HTMLElement>(".reveal-section");
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            const section = entry.target as HTMLElement;
            const title = section.querySelector<HTMLElement>(".reveal-title");
            if (!title) {
              observer.unobserve(section);
              return;
            }

            gsap.fromTo(
              title,
              { y: 56, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.95, ease: "power3.out" },
            );
            observer.unobserve(section);
          });
        },
        { threshold: 0.25 },
      );

      revealTargets.forEach((section) => {
        observer.observe(section);
      });
      cleanups.push(() => observer.disconnect());

      const rows = gsap.utils.toArray<HTMLElement>(".project-row");
      rows.forEach((row) => {
        const title = row.querySelector<HTMLElement>(".project-row-title");
        const meta = row.querySelector<HTMLElement>(".project-row-meta");

        if (!title || !meta) {
          return;
        }

        const enter = () => {
          gsap.to(title, { x: 12, duration: 0.45, ease: "power2.out" });
          gsap.to(meta, { x: -8, opacity: 0.7, duration: 0.45, ease: "power2.out" });
        };

        const leave = () => {
          gsap.to(title, { x: 0, duration: 0.45, ease: "power2.out" });
          gsap.to(meta, { x: 0, opacity: 1, duration: 0.45, ease: "power2.out" });
        };

        row.addEventListener("pointerenter", enter);
        row.addEventListener("pointerleave", leave);

        cleanups.push(() => {
          row.removeEventListener("pointerenter", enter);
          row.removeEventListener("pointerleave", leave);
        });
      });

      const previewLayers = gsap.utils.toArray<HTMLElement>(".works-preview-layer");
      previewLayers.forEach((layer) => {
        gsap.set(layer, { clipPath: "inset(0 0 0 0)" });
      });
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      ctx.revert();
    };
  }, []);

  return null;
}