"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { curatedWorks, type JasmineWork } from "@/data/jasmine";
import { ensureJasmineGsap } from "@/lib/animations/eases";
import { useJasmineLoopCarousel } from "@/lib/animations/useJasmineLoopCarousel";
import { JasminePageShell } from "./JasminePageShell";

function OrnamentFrame() {
  return (
    <div className="line-ornament-container-wrapper">
      <div className="line-ornament-container-wrapper-inner">
        <div className="corner-ornament-container">
          {[0, 1, 2, 3].map((index) => (
            <div className="corner-ornament-wrapper" key={index}>
              <svg className="corner-ornament" width="29" height="24" viewBox="0 0 29 24" fill="none">
                <path d="M28.1497 1.08252H0.76149V23.906" stroke="currentColor" />
              </svg>
            </div>
          ))}
        </div>
        <div className="line-ornament-container">
          {[0, 1, 2, 3].map((index) => (
            <div className="t-line" key={index}>
              <div />
              <div />
              <div />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CuratedWorksSlider({ works }: { works: JasmineWork[] }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const total = useMemo(() => works.length.toString().padStart(2, "0"), [works.length]);
  const loopedWorks = useMemo(
    () =>
      Array.from({ length: 3 }, (_, copy) =>
        works.map((work, index) => ({
          copy,
          index,
          work,
        })),
      ).flat(),
    [works],
  );
  const carousel = useJasmineLoopCarousel({
    sectionRef,
    length: works.length,
    mode: "works",
    durationSelector: ".play-state-duration",
    stateSelector: ".play-state-label-text",
  });
  const active = carousel.active;

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }
    const { gsap } = ensureJasmineGsap();
    const q = gsap.utils.selector(section);
    const lines = q(".line-ornament-container .t-line");
    const corners = q(".corner-ornament-wrapper");
    const controls = q(".t-slide-controls, .title-slider, .play-state");
    const cards = q(".card-container .t-card") as HTMLElement[];
    const firstCards = [cards[works.length], cards[works.length + 1], cards[works.length - 1]].filter(Boolean);

    gsap.set([cards[works.length + 1], cards[works.length - 1]], { opacity: 0 });
    const intro = gsap.timeline({ delay: 0.75 });
    intro
      .set([cards[works.length + 1], cards[works.length - 1]], { opacity: 1 })
      .fromTo(
        firstCards.map((card) => card.querySelector("img")).filter(Boolean),
        { xPercent: (index: number) => (index === 1 ? 100 : -100) },
        { xPercent: 0, ease: "ease-x", duration: 1.6, stagger: 0.06 },
      )
      .fromTo(".line-ornament-container-wrapper-inner", { scale: 1.15 }, { scale: 1, ease: "ease-inout-1", duration: 2 }, "<+=.1")
      .fromTo(
        lines.map((line, index) => line.children[index % 3]),
        { scaleX: 0, scaleY: 0, filter: "brightness(2)" },
        { scaleX: 1, scaleY: 1, filter: "brightness(1)", ease: "ease-x", duration: 1.8, stagger: 0.1 },
        "<",
      )
      .fromTo(corners, { opacity: 0 }, { opacity: 1, ease: "ease-inout-1", duration: 1.6, stagger: 0.08 }, "<")
      .fromTo(controls, { opacity: 0 }, { opacity: 1, ease: "ease-inout-1", duration: 1, stagger: 0.08 }, "0.6");

    return () => {
      intro.kill();
    };
  }, [works.length]);

  return (
    <section ref={sectionRef} className="section-curated-works">
      <div className="t-cr">
        <div className="t-box list-curated-work-wrapper">
          <div className="list-curated-work">
            <div className="play-state">
              <div className="play-state-duration">00:00:00</div>
              <div className="play-state-label">
                <div className="play-state-label-dot" />
                <div className="play-state-label-text">{works[active]?.hoverVideo ? "PLAYING" : "PAUSED"}</div>
              </div>
            </div>
            <OrnamentFrame />
            <div className="title-slider">
              <div className="title-slider-container-wrapper">
                <div className="title-slider-container">
                  {loopedWorks.map(({ copy, index, work }) => (
                    <a
                      href={`/works/${work.slug}`}
                      className="title-slider-item"
                      data-transition-type="project"
                      data-slug={work.slug}
                      key={`${work.slug}-title-${copy}-${index}`}
                    >
                      <div className="title-slider-inner">{work.title}</div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="card-slider">
              <div className="card-container-wrapper">
                <div className="card-container">
                  {loopedWorks.map(({ copy, index, work }) => (
                    <a
                      href={`/works/${work.slug}`}
                      className="t-card"
                      data-transition-type="project"
                      data-slug={work.slug}
                      key={`${work.slug}-card-${copy}-${index}`}
                    >
                      <div className="t-card-media">
                        {work.hoverVideo ? (
                          <video className="t-card-hover-media" src={work.hoverVideo} loop muted playsInline preload="metadata" />
                        ) : null}
                        <picture className="t-card-featured-image-wrapper">
                          <img className="t-card-featured-image" src={work.image} alt="" />
                        </picture>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="t-slide-controls">
              <button className="t-slide-navigation prev" type="button" onClick={carousel.prev}>
                PREV
              </button>
              <div className="t-slide-number-current-container-wrapper">
                <div className="t-slide-number-current-container">
                  <div>{works[active]?.number}</div>
                </div>
              </div>
              <div className="t-slide-number-separator">/</div>
              <div className="t-slide-number-total">{total}</div>
              <button className="t-slide-navigation next" type="button" onClick={carousel.next}>
                NEXT
              </button>
              <div className="t-slide-navigation-number-wrapper">
                <div className="t-slide-navigation-number-container">
                  {works.map((work, index) => (
                    <button
                      type="button"
                      className="t-slide-navigation-number"
                      key={work.slug}
                      onClick={() => carousel.goTo(index)}
                    >
                      <span className="t-slide-navigation-number-inner">{work.number}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function JasmineWorksPage() {
  return (
    <JasminePageShell footer={false}>
      <CuratedWorksSlider works={curatedWorks} />
    </JasminePageShell>
  );
}
