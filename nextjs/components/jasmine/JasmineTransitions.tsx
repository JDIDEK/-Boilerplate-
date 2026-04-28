"use client";

import { useLayoutEffect, useRef } from "react";
import { ensureJasmineGsap } from "@/lib/animations/eases";
import { useJasmineLenis } from "./SmoothScrollProvider";

export function JasmineTransitions() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const lenisRef = useJasmineLenis();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const { gsap } = ensureJasmineGsap();
    const panels = {
      home: root.querySelector<HTMLElement>(".transition-home"),
      about: root.querySelector<HTMLElement>(".transition-about"),
      break: root.querySelector<HTMLElement>(".transition-break"),
      project: root.querySelector<HTMLElement>(".transition-project"),
    };

    gsap.set(Object.values(panels), {
      opacity: 0,
      pointerEvents: "none",
      clipPath: "inset(110% 0 0 0)",
    });

    const playTransition = (type: keyof typeof panels, targetHash?: string, targetUrl?: string) => {
      const panel = panels[type] ?? panels.home;
      if (!panel) {
        return;
      }

      const titleLines = gsap.utils.toArray<HTMLElement>(".t-title, .section-heading__inner", panel);
      const captions = gsap.utils.toArray<HTMLElement>(".t-caption", panel);
      const media = panel.querySelector<HTMLElement>(".t-media");
      const image = media?.querySelector<HTMLElement>("img");

      const timeline = gsap.timeline();
      timeline
        .set(root, { zIndex: 12 })
        .set(panel, {
          opacity: 1,
          pointerEvents: "all",
          clipPath: "inset(110% 0 0 0)",
          zIndex: 13,
        })
        .fromTo(
          panel,
          { clipPath: "inset(110% 0 0 0)" },
          { clipPath: "inset(0% 0 0 0)", duration: 1.28, ease: "ease-inout-1" },
        )
        .fromTo(
          titleLines,
          { yPercent: type === "project" ? 0 : 120, xPercent: type === "project" ? -100 : 0 },
          { yPercent: 0, xPercent: 0, duration: 1.2, ease: "ease-inout-1", stagger: 0.05 },
          "<",
        );

      if (captions.length) {
        timeline.fromTo(
          captions,
          { yPercent: 100 },
          { yPercent: 0, duration: 1, ease: "ease-inout-1", stagger: 0.05 },
          "<+=0.1",
        );
      }

      if (media) {
        timeline.fromTo(
          media,
          { scale: 0.7, clipPath: "inset(0 50% 0 50%)" },
          { scale: 1, clipPath: "inset(0 0% 0 0%)", duration: 1.4, ease: "ease-inout-1" },
          "<",
        );
      }

      if (image) {
        timeline.fromTo(image, { scale: 2 }, { scale: 1, duration: 1.4, ease: "ease-inout-1" }, "<");
      }

      timeline
        .add(() => {
          if (targetHash) {
            lenisRef?.current?.scrollTo(targetHash, { duration: 1.2 });
          }
          if (targetUrl) {
            window.location.href = targetUrl;
          }
        }, "-=0.35")
        .to(panel, { clipPath: "inset(0 0 100% 0)", duration: 1.1, ease: "ease-inout-1" })
        .set(panel, { opacity: 0, pointerEvents: "none" })
        .set(root, { zIndex: 12 });
    };

    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>("[data-transition-type]");
      if (!link) {
        return;
      }

      const href = link.getAttribute("href");
      if (!href) {
        return;
      }

      event.preventDefault();
      const type = link.dataset.transitionType as keyof typeof panels;
      if (href.startsWith("#")) {
        playTransition(type, href);
        return;
      }

      const target = new URL(href, window.location.origin);
      if (target.origin !== window.location.origin) {
        window.location.href = href;
        return;
      }
      if (target.pathname === window.location.pathname && !target.hash) {
        return;
      }
      playTransition(type, undefined, target.pathname + target.search + target.hash);
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
    };
  }, [lenisRef]);

  return (
    <div ref={rootRef} className="t-transition" aria-hidden="true">
      <div className="transition-home">
        <div className="transition-home__inner">
          <div className="section-heading">
            <div className="section-heading__inner">JASMINE GUNARTO</div>
          </div>
        </div>
      </div>
      <div className="transition-about">
        <div className="transition-about__inner">
          <div className="section-heading">
            <div className="section-heading__inner">ABOUT JASMINE</div>
          </div>
        </div>
      </div>
      <div className="transition-break">
        <div className="t-cr">
          <div className="t-box caption-container">
            <div className="t-caption">SINGLE FRAME<br />EXPRESSION</div>
            <div className="t-caption">FUN<br />EXPERIMENTS</div>
          </div>
          <div className="t-title-container">
            <div className="t-box t-title t-title-1">CREATIVE</div>
            <div className="t-box t-title t-title-2">BREAK</div>
          </div>
          <div className="t-box t-media">
            <picture>
              <img src="/jasmine/media/avantgarde.webp" alt="" />
            </picture>
          </div>
        </div>
      </div>
      <div className="transition-project">
        <div className="t-cr">
          <div className="t-box caption-container">
            <div className="t-caption">PRECISELY<br />REFINED SELECTION</div>
            <div className="t-caption">FOCUSED<br />VISUAL SHOWCASE</div>
            <div className="t-caption">CAREFULLY<br />CHOSEN NARRATIVES</div>
          </div>
          <div className="t-title-container">
            <div className="t-box t-title t-title-1">CURATED</div>
            <div className="t-box t-title t-title-2">PROJECT</div>
          </div>
          <div className="t-box t-media">
            <picture>
              <img src="/jasmine/media/hotpot-styleframe.webp" alt="" />
            </picture>
          </div>
        </div>
      </div>
    </div>
  );
}
