"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { breakItems, type BreakItem } from "@/data/jasmine";
import { ensureJasmineGsap } from "@/lib/animations/eases";
import { useJasmineLoopCarousel } from "@/lib/animations/useJasmineLoopCarousel";
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
  const total = useMemo(() => items.length.toString().padStart(2, "0"), [items.length]);
  const loopedItems = useMemo(
    () =>
      Array.from({ length: 3 }, (_, copy) =>
        items.map((item, index) => ({
          copy,
          index,
          item,
        })),
      ).flat(),
    [items],
  );
  const carousel = useJasmineLoopCarousel({
    sectionRef,
    length: items.length,
    mode: "break",
  });
  const active = carousel.active;

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
    const cards = q(".card-container .t-card") as HTMLElement[];
    const visibleCards = [cards[items.length - 2], cards[items.length - 1], cards[items.length], cards[items.length + 1], cards[items.length + 2]]
      .filter(Boolean);
    const visibleMedia = visibleCards.map((card) => card.querySelector(".t-card-media")).filter(Boolean);
    const isMobile = window.matchMedia("(max-width: 601px)").matches;

    const intro = gsap.timeline({ delay: 0.75 });
    intro
      .fromTo(
        visibleMedia,
        isMobile
          ? { xPercent: (index: number) => (index % 2 ? 100 : -100), opacity: 0 }
          : { yPercent: (index: number) => (index % 2 ? 100 : -100), opacity: 0 },
        isMobile
          ? { xPercent: 0, opacity: 1, ease: "ease-x", duration: 1.6, stagger: 0.06 }
          : { yPercent: 0, opacity: 1, ease: "ease-x", duration: 1.6, stagger: 0.06 },
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
  }, [items.length]);

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
                  {loopedItems.map(({ copy, index, item }) => (
                    <a href={item.href} className="title-slider-item" key={`${item.slug}-title-${copy}-${index}`}>
                      <div className="title-slider-inner">{item.title}</div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="card-slider">
              <div className="card-container-wrapper">
                <div className="card-container">
                  {loopedItems.map(({ copy, index, item }) => (
                    <div className="t-card" key={`${item.slug}-card-${copy}-${index}`}>
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
              <button className="t-slide-navigation prev" type="button" onClick={carousel.prev}>
                PREV
              </button>
              <div className="t-slide-number-current-container-wrapper">
                <div className="t-slide-number-current-container">
                  <div>{items[active]?.number}</div>
                </div>
              </div>
              <div className="t-slide-number-separator">/</div>
              <div className="t-slide-number-total">{total}</div>
              <button className="t-slide-navigation next" type="button" onClick={carousel.next}>
                NEXT
              </button>
              <div className="t-slide-navigation-number-wrapper">
                <div className="t-slide-navigation-number-container">
                  {items.map((item, index) => (
                    <button type="button" className="t-slide-navigation-number" key={item.slug} onClick={() => carousel.goTo(index)}>
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
