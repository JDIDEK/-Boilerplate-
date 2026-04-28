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
      <span className="t-card-link-layer">{title}</span>
      <span className="t-card-link-layer">{title}</span>
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
    const isMobile = window.matchMedia("(max-width: 601px)").matches;

    const lerp = (from: number, to: number, amount: number) => from * (1 - amount) + to * amount;
    const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
    const mapRange = (
      value: number,
      inputMin: number,
      inputMax: number,
      outputMin: number,
      outputMax: number,
    ) => outputMin + ((clamp(value, inputMin, inputMax) - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin);

    cards.forEach((card, index) => {
      const reveal = card.querySelector<HTMLElement>(".hover-reveal");
      const revealInner = card.querySelector<HTMLElement>(".hover-reveal__inner");
      const revealImage = card.querySelector<HTMLElement>(".hover-reveal__img");
      const titleLayers = gsap.utils.toArray<HTMLElement>(".t-card-link-layer", card);
      if (!reveal || !revealInner || !revealImage || titleLayers.length < 2) {
        return;
      }

      const titleSplits = titleLayers.map((layer) => splitText(layer, { type: "chars" }));
      const topChars = titleSplits[0].chars;
      const bottomChars = titleSplits[1].chars;
      const direction = (index + 1) % 2 ? -1 : 1;
      const mouse = { x: 0, y: 0 };
      const previousMouse = { x: 0, y: 0 };
      const animated = {
        tx: { previous: 0, current: 0, amount: 0.03 },
        ty: { previous: 0, current: 0, amount: 0.03 },
        rotation: { previous: 0, current: 0, amount: 0.08 },
        autoRotation: { previous: 0, current: 0, amount: 1 },
      };
      let firstFrame = true;
      let requestId: number | null = null;

      gsap.set(bottomChars, { yPercent: 100 });

      const render = () => {
        requestId = null;
        const rect = card.getBoundingClientRect();
        const revealRect = reveal.getBoundingClientRect();
        const velocity = clamp(Math.abs(previousMouse.x - mouse.x), 0, 100);
        const deltaX = previousMouse.x - mouse.x;

        previousMouse.x = mouse.x;
        previousMouse.y = mouse.y;

        animated.tx.current = Math.abs(mouse.x - rect.left) - revealRect.width / 2;
        animated.ty.current = Math.abs(mouse.y - rect.top) - revealRect.height / 2;
        animated.autoRotation.current += 0.003;
        animated.rotation.current = firstFrame
          ? 0
          : mapRange(velocity, 0, 175, 0, deltaX < 0 ? -60 : 60);

        Object.values(animated).forEach((property) => {
          property.previous = firstFrame
            ? property.current
            : lerp(property.previous, property.current, property.amount);
        });
        animated.autoRotation.previous = gsap.utils.wrap(0, 2, animated.autoRotation.previous);

        gsap.set(reveal, {
          x:
            animated.tx.previous +
            (rect.width / 2) * direction +
            Math.cos(Math.PI * animated.autoRotation.previous) * 7,
          y: animated.ty.previous + Math.sin(Math.PI * animated.autoRotation.previous) * 7,
        });
        gsap.set(revealInner, {
          scale: 1.2,
          rotation: 5 * direction + animated.rotation.previous * 1.5,
        });

        firstFrame = false;
        requestId = window.requestAnimationFrame(render);
      };

      const startRendering = () => {
        if (requestId === null) {
          requestId = window.requestAnimationFrame(render);
        }
      };

      const stopRendering = () => {
        if (requestId !== null) {
          window.cancelAnimationFrame(requestId);
          requestId = null;
        }
      };

      const move = (event: PointerEvent) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
      };

      const enter = (event: PointerEvent) => {
        move(event);
        firstFrame = true;
        startRendering();
        gsap.killTweensOf([revealInner, revealImage]);
        gsap
          .timeline()
          .set(reveal, { opacity: 1, transformOrigin: "0% 50%" })
          .set(revealInner, { opacity: 1 })
          .set(card, { zIndex: 120 })
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
        stopRendering();
        gsap.killTweensOf([revealInner, revealImage]);
        gsap
          .timeline({
            onComplete: () => {
              gsap.set(reveal, { opacity: 0 });
            },
          })
          .set(card, { zIndex: 1 })
          .fromTo(
            revealInner,
            { opacity: 1 },
            { opacity: 0, scale: 0.3, duration: 0.8, ease: "expo.out" },
            0,
          )
          .to(revealImage, { scale: 1, duration: 0.4, ease: "expo.out" }, 0)
          .to(bottomChars, { yPercent: 100, duration: 0.8, ease: "expo.out", stagger: 0.012 }, 0)
          .to(topChars, { yPercent: 0, duration: 0.8, ease: "expo.out", stagger: 0.012 }, 0.18);
      };

      card.addEventListener("pointermove", move);
      card.addEventListener("pointerenter", enter);
      card.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        stopRendering();
        titleSplits.forEach((split) => split.revert());
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
      { y: () => -section.children[0].clientWidth * (isMobile ? 1.2 : 0.25) },
      { y: () => section.children[0].clientWidth * (isMobile ? 1.2 : 0.25), ease: "none" },
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
            <MagneticButton href="/break" data-transition-type="break">
              See All Work
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
