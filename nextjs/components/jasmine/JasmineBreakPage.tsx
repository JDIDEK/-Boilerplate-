"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { breakItems, type BreakItem } from "@/data/jasmine";
import { ensureJasmineGsap } from "@/lib/animations/eases";
import { splitText } from "@/lib/animations/split";
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

function AllBreakSlider({ items }: { items: BreakItem[] }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(0);
  const total = useMemo(() => items.length.toString().padStart(2, "0"), [items.length]);
  const wrap = useCallback(
    (value: number) => setActive(((value % items.length) + items.length) % items.length),
    [items.length],
  );

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }
    const { gsap } = ensureJasmineGsap();
    const q = gsap.utils.selector(section);
    const heading = q(".t-hg")[0] as HTMLElement;
    const headingSplit = splitText(heading, { type: "chars", mask: "chars" });
    const lines = q(".line-ornament-container .t-line");
    const corners = q(".corner-ornament-wrapper");
    const controls = q(".t-slide-controls, .title-slider");
    const cards = q(".t-card");
    const visibleMedia = cards.map((card) => card.querySelector(".t-card-media")).filter(Boolean);

    const intro = gsap.timeline({ delay: 0.75 });
    intro
      .fromTo(
        visibleMedia,
        { yPercent: (index: number) => (index % 2 ? 100 : -100), opacity: 0 },
        { yPercent: 0, opacity: 1, ease: "ease-x", duration: 1.6, stagger: 0.06 },
      )
      .fromTo(".section-all-break .line-ornament-container-wrapper-inner", { scale: 1.15 }, { scale: 1, ease: "ease-inout-1", duration: 2 }, "<+=.1")
      .fromTo(
        lines.map((line, index) => line.children[index % 3]),
        { scaleX: 0, scaleY: 0, filter: "brightness(2)" },
        { scaleX: 1, scaleY: 1, filter: "brightness(1)", ease: "ease-x", duration: 1.8, stagger: 0.1 },
        "<",
      )
      .fromTo(corners, { opacity: 0 }, { opacity: 1, ease: "ease-inout-1", duration: 1.6, stagger: 0.08 }, "<")
      .fromTo(controls, { opacity: 0 }, { opacity: 1, ease: "ease-inout-1", duration: 1, stagger: 0.08 }, "0.6")
      .fromTo(headingSplit.chars, { yPercent: 120 }, { yPercent: 0, duration: 1.2, ease: "ease-x", stagger: 0.1 }, "<-=.1");

    return () => {
      headingSplit.revert();
      intro.kill();
    };
  }, []);

  useLayoutEffect(() => {
    const { gsap } = ensureJasmineGsap();
    const isMobile = window.matchMedia("(max-width: 601px)").matches;
    const cards = gsap.utils.toArray<HTMLElement>(".section-all-break .t-card");
    const titles = gsap.utils.toArray<HTMLElement>(".section-all-break .title-slider-item");
    const nums = gsap.utils.toArray<HTMLElement>(".section-all-break .t-slide-navigation-number");

    cards.forEach((card, index) => {
      const offset = index - active;
      const wrapped = offset > items.length / 2 ? offset - items.length : offset < -items.length / 2 ? offset + items.length : offset;
      gsap.to(card, {
        [isMobile ? "xPercent" : "yPercent"]: wrapped * 112,
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
  }, [active, items.length]);

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
      wrap(active + (event.deltaY > 0 ? 1 : -1));
      window.setTimeout(() => {
        locked = false;
      }, 620);
    };
    section.addEventListener("wheel", wheel, { passive: false });
    return () => section.removeEventListener("wheel", wheel);
  }, [active, wrap]);

  return (
    <section ref={sectionRef} className="section-all-break">
      <div className="t-cr">
        <div className="t-box list-all-break-wrapper">
          <div className="list-all-break">
            <OrnamentFrame />
            <div className="t-hg-wrapper">
              <h1 className="t-hg">Break</h1>
            </div>
            <div className="title-slider">
              <div className="title-slider-container-wrapper">
                <div className="title-slider-container">
                  {items.map((item, index) => (
                    <a href={item.href} className="title-slider-item" key={item.slug} onMouseEnter={() => wrap(index)}>
                      <div className="title-slider-inner">{item.title}</div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="card-slider">
              <div className="card-container-wrapper">
                <div className="card-container">
                  {items.map((item, index) => (
                    <div className="t-card" key={item.slug} onMouseEnter={() => wrap(index)}>
                      <div className="t-card-media">
                        {item.hoverVideo ? (
                          <video className="t-card-hover-media" src={item.hoverVideo} loop muted playsInline preload="metadata" />
                        ) : null}
                        <picture className="t-card-featured-image-wrapper">
                          <img className="t-card-featured-image" src={item.previewImage} alt="" />
                        </picture>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="t-slide-controls">
              <button className="t-slide-navigation prev" type="button" onClick={() => wrap(active - 1)}>
                PREV
              </button>
              <div className="t-slide-number-current-container-wrapper">
                <div className="t-slide-number-current-container">
                  <div>{items[active]?.number}</div>
                </div>
              </div>
              <div className="t-slide-number-separator">/</div>
              <div className="t-slide-number-total">{total}</div>
              <button className="t-slide-navigation next" type="button" onClick={() => wrap(active + 1)}>
                NEXT
              </button>
              <div className="t-slide-navigation-number-wrapper">
                <div className="t-slide-navigation-number-container">
                  {items.map((item, index) => (
                    <button type="button" className="t-slide-navigation-number" key={item.slug} onClick={() => wrap(index)}>
                      <span className="t-slide-navigation-number-inner">{item.number}</span>
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

export function JasmineBreakPage() {
  return (
    <JasminePageShell footer={false}>
      <AllBreakSlider items={breakItems} />
    </JasminePageShell>
  );
}
