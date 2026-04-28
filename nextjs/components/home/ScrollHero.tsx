"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const mediaStates = [
  {
    id: "state-1",
    image: "/media/knife-workbench.jpg",
    caption: "Santoku d'atelier / 01",
  },
  {
    id: "state-2",
    image: "/media/craftsman-workshop.jpg",
    caption: "Emouture main / 02",
  },
  {
    id: "state-3",
    image: "/media/knife-workbench.jpg",
    caption: "Acier & laiton / 03",
  },
  {
    id: "state-4",
    image: "/media/craftsman-workshop.jpg",
    caption: "Serie cuisine / 04",
  },
];

export function ScrollHero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyPreference = () => setReducedMotion(mediaQuery.matches);

    applyPreference();
    mediaQuery.addEventListener("change", applyPreference);

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(section);
      const titleLines = q(".hero-title-line");
      const metaLine = q(".hero-meta-line");
      const sideLabels = q(".hero-side-label");
      const mediaFrame = q(".hero-media-frame");
      const mediaItems = q(".hero-media-item");
      const mediaCaptions = q(".hero-media-caption");
      const darkOverlay = q(".hero-dark-overlay");
      const titleGroup = q(".hero-title-group");

      if (mediaQuery.matches) {
        gsap.set([titleLines, metaLine, sideLabels, mediaFrame, mediaItems, mediaCaptions], {
          clearProps: "all",
          opacity: 1,
        });
        gsap.set(mediaItems, { opacity: 0 });
        gsap.set(mediaItems[0], { opacity: 1 });
        gsap.set(mediaCaptions, { opacity: 0 });
        gsap.set(mediaCaptions[0], { opacity: 1 });
        gsap.set(darkOverlay, { opacity: 0.2 });
        return;
      }

      gsap.set(titleLines, { yPercent: 102 });
      gsap.set(metaLine, { y: 30, opacity: 0 });
      gsap.set(sideLabels, { y: 44, opacity: 0 });
      gsap.set(mediaFrame, {
        clipPath: "inset(100% 0 0 0)",
        y: 70,
        scale: 0.9,
      });
      gsap.set(mediaItems, {
        opacity: 0,
        scale: 1.1,
        clipPath: "inset(0 0 100% 0)",
      });
      gsap.set(mediaCaptions, { opacity: 0, y: 10 });
      gsap.set([mediaItems[0], mediaCaptions[0]], {
        opacity: 1,
        clipPath: "inset(0 0 0 0)",
        y: 0,
        scale: 1,
      });
      gsap.set(darkOverlay, { opacity: 0 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      timeline
        .to(titleLines, { yPercent: 0, duration: 0.42, stagger: 0.08, ease: "power3.out" }, 0)
        .to(metaLine, { y: 0, opacity: 1, duration: 0.2, ease: "power2.out" }, 0.1)
        .to(sideLabels, { y: 0, opacity: 1, duration: 0.28, stagger: 0.08, ease: "power2.out" }, 0.18)
        .to(mediaFrame, { clipPath: "inset(0% 0 0 0)", y: 0, scale: 1, duration: 0.35, ease: "power3.out" }, 0.28)
        .to(titleGroup, { yPercent: -8, scale: 0.985, transformOrigin: "center top", duration: 0.9, ease: "none" }, 0.45)
        .to(mediaFrame, { yPercent: -6, scale: 1.03, duration: 0.32, ease: "none" }, 0.5)
        .to(mediaItems[0], { opacity: 0, clipPath: "inset(0 0 100% 0)", scale: 1.07, duration: 0.2, ease: "power1.inOut" }, 0.55)
        .to(mediaCaptions[0], { opacity: 0, y: -8, duration: 0.12, ease: "power1.out" }, 0.55)
        .to(mediaItems[1], { opacity: 1, clipPath: "inset(0 0 0 0)", scale: 1, duration: 0.23, ease: "power1.out" }, 0.58)
        .to(mediaCaptions[1], { opacity: 1, y: 0, duration: 0.12, ease: "power1.out" }, 0.6)
        .to(mediaFrame, { yPercent: -13, scale: 1.05, duration: 0.35, ease: "none" }, 0.68)
        .to(mediaItems[1], { opacity: 0, clipPath: "inset(100% 0 0 0)", scale: 1.05, duration: 0.2, ease: "power1.inOut" }, 0.73)
        .to(mediaCaptions[1], { opacity: 0, y: -8, duration: 0.1, ease: "power1.out" }, 0.73)
        .to(mediaItems[2], { opacity: 1, clipPath: "inset(0 0 0 0)", scale: 1, duration: 0.22, ease: "power1.out" }, 0.76)
        .to(mediaCaptions[2], { opacity: 1, y: 0, duration: 0.12, ease: "power1.out" }, 0.79)
        .to(mediaFrame, { yPercent: -20, scale: 1.08, duration: 0.35, ease: "none" }, 0.82)
        .to(mediaItems[2], { opacity: 0, clipPath: "inset(0 100% 0 0)", scale: 1.06, duration: 0.2, ease: "power1.inOut" }, 0.86)
        .to(mediaCaptions[2], { opacity: 0, y: -8, duration: 0.1, ease: "power1.out" }, 0.86)
        .to(mediaItems[3], { opacity: 1, clipPath: "inset(0 0 0 0)", scale: 1, duration: 0.24, ease: "power1.out" }, 0.9)
        .to(mediaCaptions[3], { opacity: 1, y: 0, duration: 0.12, ease: "power1.out" }, 0.92)
        .to(darkOverlay, { opacity: 0.92, duration: 0.5, ease: "none" }, 0.72);
    }, section);

    return () => {
      mediaQuery.removeEventListener("change", applyPreference);
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative h-[400vh] bg-[var(--color-paper)] text-[var(--color-ink)]"
      style={reducedMotion ? { height: "190vh" } : undefined}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[var(--color-paper)]" />
        <div className="hero-dark-overlay absolute inset-0 bg-[var(--color-earth)]" />

        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1600px] flex-col px-5 pb-8 pt-26 sm:px-8 sm:pt-30">
          <div className="hero-title-group">
            <div className="overflow-hidden">
              <h1 className="hero-title-line font-editorial text-[clamp(4.8rem,17vw,18rem)] uppercase leading-[0.78] tracking-[-0.04em]">
                Maison
              </h1>
            </div>
            <div className="overflow-hidden">
              <h1 className="hero-title-line pl-[8vw] font-editorial text-[clamp(4.8rem,17vw,18rem)] uppercase leading-[0.78] tracking-[-0.04em] sm:pl-[11vw] lg:pl-[8.8vw]">
                Lame
              </h1>
            </div>
          </div>

          <p className="hero-meta-line mt-4 text-[11px] uppercase tracking-[0.24em] text-[var(--color-fade)]">
            Coutellerie contemporaine pour cuisine, table et gestes precis.
          </p>

          <div className="relative mt-6 flex-1">
            <p className="hero-side-label absolute left-0 top-6 text-[11px] uppercase tracking-[0.24em] text-[var(--color-fade)] sm:top-10">
              ACIER
            </p>
            <p className="hero-side-label absolute right-0 top-6 text-[11px] uppercase tracking-[0.24em] text-[var(--color-fade)] sm:top-10">
              MAIN
            </p>

            <div className="hero-media-frame absolute left-1/2 top-[14%] h-[58vh] w-[74vw] max-w-[880px] -translate-x-1/2 overflow-hidden border border-[var(--color-border)] bg-[#1a140f] shadow-[0_35px_90px_rgba(0,0,0,0.35)] sm:top-[16%] sm:w-[66vw] lg:h-[62vh]">
              {mediaStates.map((state) => (
                <div key={state.id} className="hero-media-item absolute inset-0">
                  <Image
                    src={state.image}
                    alt="Detail d'un atelier de coutellerie"
                    fill
                    priority={state.id === "state-1"}
                    sizes="(max-width: 768px) 74vw, 880px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,transparent_0%,rgba(0,0,0,0.1)_36%,rgba(0,0,0,0.68)_100%)]" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.64)_82%)]" />
                </div>
              ))}

              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                {mediaStates.map((state) => (
                  <p
                    key={`${state.id}-caption`}
                    className="hero-media-caption absolute bottom-4 left-4 text-[10px] uppercase tracking-[0.26em] text-[var(--color-cream)] sm:bottom-6 sm:left-6"
                  >
                    {state.caption}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
