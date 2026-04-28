"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { curatedWorks, type JasmineWork } from "@/data/jasmine";
import { ensureJasmineGsap } from "@/lib/animations/eases";
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

function useBoundedIndex(length: number) {
  const [active, setActive] = useState(0);
  const update = (next: number) => setActive(((next % length) + length) % length);
  return [active, update] as const;
}

function CuratedWorksSlider({ works }: { works: JasmineWork[] }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useBoundedIndex(works.length);
  const total = useMemo(() => works.length.toString().padStart(2, "0"), [works.length]);

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
    const cards = q(".t-card");
    const firstCards = [cards[0], cards[1], cards[cards.length - 1]].filter(Boolean);

    gsap.set([cards[1], cards[cards.length - 1]], { opacity: 0 });
    const intro = gsap.timeline({ delay: 0.75 });
    intro
      .set([cards[1], cards[cards.length - 1]], { opacity: 1 })
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
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }
    const { gsap } = ensureJasmineGsap();
    const cards = gsap.utils.toArray<HTMLElement>(".section-curated-works .t-card");
    const titles = gsap.utils.toArray<HTMLElement>(".section-curated-works .title-slider-item");
    const nums = gsap.utils.toArray<HTMLElement>(".section-curated-works .t-slide-navigation-number");
    const activeCard = cards[active];

    cards.forEach((card, index) => {
      const offset = index - active;
      const wrapped = offset > works.length / 2 ? offset - works.length : offset < -works.length / 2 ? offset + works.length : offset;
      gsap.to(card, {
        yPercent: wrapped * 112,
        scale: Math.max(0.52, 1 - Math.abs(wrapped) * 0.16),
        opacity: Math.abs(wrapped) > 2 ? 0 : 1,
        zIndex: 50 - Math.abs(wrapped),
        duration: 1.2,
        ease: "ease-inout-1",
      });
      card.classList.toggle("is--active", index === active);
      const video = card.querySelector<HTMLVideoElement>("video");
      if (index === active && video) {
        video.play().catch(() => undefined);
      } else if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });

    titles.forEach((title, index) => {
      gsap.to(title, {
        yPercent: (index - active) * -100,
        opacity: index === active ? 1 : 0.28,
        duration: 1.1,
        ease: "ease-inout-1",
      });
    });

    nums.forEach((num, index) => {
      gsap.to(num.querySelector(".t-slide-navigation-number-inner"), {
        scale: index === active ? 1 : 0.52,
        opacity: index === active ? 1 : 0.28,
        duration: 0.8,
        ease: "expo.out",
      });
    });

    if (activeCard) {
      gsap.to(".section-curated-works .line-ornament-container-wrapper-inner", {
        y: 0,
        scale: 1,
        ease: "expo.out",
        duration: 0.8,
      });
    }
  }, [active, works.length]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }
    let locked = false;
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      if (locked) {
        return;
      }
      locked = true;
      setActive(active + (event.deltaY > 0 ? 1 : -1));
      window.setTimeout(() => {
        locked = false;
      }, 620);
    };
    section.addEventListener("wheel", wheel, { passive: false });
    return () => section.removeEventListener("wheel", wheel);
  }, [active, setActive]);

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
                  {works.map((work, index) => (
                    <a
                      href={`/works/${work.slug}`}
                      className="title-slider-item"
                      data-transition-type="project"
                      data-slug={work.slug}
                      key={work.slug}
                      onMouseEnter={() => setActive(index)}
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
                  {works.map((work, index) => (
                    <a
                      href={`/works/${work.slug}`}
                      className="t-card"
                      data-transition-type="project"
                      data-slug={work.slug}
                      key={work.slug}
                      onMouseEnter={() => setActive(index)}
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
              <button className="t-slide-navigation prev" type="button" onClick={() => setActive(active - 1)}>
                PREV
              </button>
              <div className="t-slide-number-current-container-wrapper">
                <div className="t-slide-number-current-container">
                  <div>{works[active]?.number}</div>
                </div>
              </div>
              <div className="t-slide-number-separator">/</div>
              <div className="t-slide-number-total">{total}</div>
              <button className="t-slide-navigation next" type="button" onClick={() => setActive(active + 1)}>
                NEXT
              </button>
              <div className="t-slide-navigation-number-wrapper">
                <div className="t-slide-navigation-number-container">
                  {works.map((work, index) => (
                    <button
                      type="button"
                      className="t-slide-navigation-number"
                      key={work.slug}
                      onClick={() => setActive(index)}
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
