"use client";

import { useLayoutEffect, useRef } from "react";
import type { BreakItem } from "@/data/jasmine";
import { ensureJasmineGsap } from "@/lib/animations/eases";
import { splitText } from "@/lib/animations/split";
import { HoverRevealImage } from "./HoverRevealImage";
import { MagneticButton } from "./MagneticButton";

type BreakSectionProps = {
  items: BreakItem[];
};

function AnimatedTitle({ title }: { title: string }) {
  return (
    <span className="t-card-link">
      {title.split("").map((char, index) => (
        <span className="break-char" key={`${char}-${index}`}>
          <span>{char === " " ? "\u00a0" : char}</span>
          <span>{char === " " ? "\u00a0" : char}</span>
        </span>
      ))}
    </span>
  );
}

export function BreakSection({ items }: BreakSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const { gsap } = ensureJasmineGsap();
    const q = gsap.utils.selector(section);
    const heading = q(".hg")[0] as HTMLElement;
    const line = q(".i-line")[0] as HTMLElement;
    const label = q(".s-tag-label")[0] as HTMLElement;
    const tags = q(".t-tag");
    const cards = gsap.utils.toArray<HTMLElement>(".section-break .t-card");
    const headingSplit = splitText(heading, { type: "chars", mask: "chars" });
    const cleanups: Array<() => void> = [];

    cards.forEach((card) => {
      const reveal = card.querySelector<HTMLElement>(".hover-reveal");
      const revealInner = card.querySelector<HTMLElement>(".hover-reveal__inner");
      const revealImage = card.querySelector<HTMLElement>(".hover-reveal__img");
      const topChars = gsap.utils.toArray<HTMLElement>(".break-char span:first-child", card);
      const bottomChars = gsap.utils.toArray<HTMLElement>(".break-char span:nth-child(2)", card);
      if (!reveal || !revealInner || !revealImage) {
        return;
      }

      const xTo = gsap.quickTo(reveal, "x", { duration: 0.12, ease: "ease-inout-1" });
      const yTo = gsap.quickTo(reveal, "y", { duration: 0.12, ease: "ease-inout-1" });

      gsap.set(bottomChars, { yPercent: 100 });

      const move = (event: PointerEvent) => {
        const rect = card.getBoundingClientRect();
        xTo(event.clientX - rect.left - reveal.offsetWidth / 2);
        yTo(event.clientY - rect.top - reveal.offsetHeight / 2);
      };

      const enter = (event: PointerEvent) => {
        move(event);
        gsap
          .timeline()
          .set(card, { zIndex: 3 })
          .fromTo(
            revealInner,
            { opacity: 0, scale: 0.6, yPercent: 50 },
            { opacity: 1, scale: 1, yPercent: 0, duration: 1.8, ease: "expo.out" },
            0,
          )
          .fromTo(revealImage, { scale: 1.4 }, { scale: 1, duration: 1.8, ease: "expo.out" }, 0)
          .to(topChars, { yPercent: -100, duration: 0.8, ease: "expo.out", stagger: 0.01 }, 0)
          .to(bottomChars, { yPercent: 0, duration: 0.8, ease: "expo.out", stagger: 0.01 }, 0.18);
      };

      const leave = () => {
        gsap
          .timeline()
          .set(card, { zIndex: 1 })
          .to(revealInner, { opacity: 0, scale: 0.3, duration: 0.8, ease: "expo.out" }, 0)
          .to(revealImage, { scale: 1, duration: 0.4, ease: "expo.out" }, 0)
          .to(bottomChars, { yPercent: 100, duration: 0.8, ease: "expo.out", stagger: 0.012 }, 0)
          .to(topChars, { yPercent: 0, duration: 0.8, ease: "expo.out", stagger: 0.012 }, 0.18);
      };

      card.addEventListener("pointermove", move);
      card.addEventListener("pointerenter", enter);
      card.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        card.removeEventListener("pointermove", move);
        card.removeEventListener("pointerenter", enter);
        card.removeEventListener("pointerleave", leave);
      });
    });

    if (reducedMotion) {
      gsap.set([headingSplit.chars, line, label, tags, cards], {
        clearProps: "all",
        opacity: 1,
      });
      return () => {
        cleanups.forEach((cleanup) => cleanup());
        headingSplit.revert();
      };
    }

    const intro = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top+=10% bottom",
        once: true,
      },
    });

    intro
      .set([label, heading], { overflow: "hidden", height: "fit-content" })
      .fromTo(
        headingSplit.chars,
        { yPercent: 120 },
        { yPercent: 0, duration: 1.2, ease: "ease-x", stagger: 0.06 },
      )
      .fromTo(
        line,
        { opacity: 0.2, scaleX: 0 },
        { opacity: 1, scaleX: 1, duration: 1.4, ease: "ease-x" },
        "<",
      )
      .fromTo(label, { yPercent: 120 }, { yPercent: 0, duration: 1.2, ease: "expo.out" }, "<+=0.6")
      .fromTo(
        tags,
        { opacity: 0, xPercent: 20 },
        { opacity: 1, xPercent: 0, duration: 2, ease: "expo.out", stagger: { each: 0.05 } },
        "<+=0.3",
      )
      .fromTo(
        cards,
        { yPercent: -100, opacity: 0 },
        { yPercent: 0, opacity: 1, ease: "expo.out", duration: 1.6, stagger: { each: 0.04 } },
        "<-=0.4",
      );

    const parallax = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    parallax.fromTo(
      section.children[0],
      { y: -section.children[0].clientWidth / 4 },
      { y: section.children[0].clientWidth / 4, ease: "none" },
    );

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      headingSplit.revert();
      intro.kill();
      parallax.kill();
    };
  }, [items]);

  return (
    <section ref={sectionRef} id="break" className="section-break">
      <div className="t-cr">
        <div className="t-box text-intro">
          <div className="t-marquee">
            <div className="hg">BREAK</div>
          </div>
          <div className="i-line-wrapper">
            <div className="i-line" />
          </div>
          <div className="s-tag">
            <div className="s-tag-label">short, experimental designS</div>
            <div className="cr-tag">
              <div className="t-tag">SMALL SCALE VISUAL</div>
            </div>
          </div>
        </div>
        <div className="t-box breaks-wrapper">
          <article className="list-break">
            <div className="t-cr">
              <div className="t-card-container">
                {items.map((item) => (
                  <a className="t-card" href={item.href} data-transition-type="break" key={item.title}>
                    <div className="t-card-inner">
                      <h3 className="t-card-title">
                        <span className="t-card-number">{item.number}</span>
                        <AnimatedTitle title={item.title} />
                      </h3>
                    </div>
                    <HoverRevealImage src={item.previewImage} />
                  </a>
                ))}
              </div>
            </div>
          </article>
        </div>
        <div className="t-box bottom-cta">
          <div className="cta-wrapper">
            <MagneticButton href="#break" data-transition-type="break">
              See All Work
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}

