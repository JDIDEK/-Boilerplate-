"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ensureJasmineGsap } from "@/lib/animations/eases";

const progressStops = [0, 7, 18, 29, 43, 58, 76, 89, 100];

function formatDigits(value: number) {
  return String(value).padStart(3, "0").slice(-3).split("");
}

export function JasminePreloader() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [hidden, setHidden] = useState(false);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const { gsap } = ensureJasmineGsap();
    const currentDigits = gsap.utils.toArray<HTMLElement>(".num-current", root);
    const nextDigits = gsap.utils.toArray<HTMLElement>(".num-next", root);
    const number = root.querySelector<HTMLElement>(".preloader-number");

    if (reducedMotion) {
      gsap.set(root, { autoAlpha: 0, pointerEvents: "none" });
      return;
    }

    const setCurrent = (value: number) => {
      formatDigits(value).forEach((digit, index) => {
        currentDigits[index].textContent = digit;
      });
    };

    const rollTo = (value: number, delay = 0) => {
      formatDigits(value).forEach((digit, index) => {
        nextDigits[index].textContent = digit;
      });

      return gsap
        .timeline({ delay })
        .fromTo(
          currentDigits,
          { yPercent: 0 },
          { yPercent: -100, ease: "ease-inout-1", stagger: 0.1, duration: 0.7 },
        )
        .fromTo(
          nextDigits,
          { yPercent: 100 },
          { yPercent: 0, ease: "ease-inout-1", stagger: 0.1, duration: 0.7 },
          "<",
        )
        .add(() => {
          setCurrent(value);
          gsap.set(currentDigits, { yPercent: 0 });
          gsap.set(nextDigits, { yPercent: 100 });
        });
    };

    setCurrent(0);
    gsap.set(nextDigits, { yPercent: 100 });

    const timeline = gsap.timeline({
      onComplete: () => setHidden(true),
    });

    timeline
      .set(number, { opacity: 1 })
      .fromTo(
        currentDigits,
        { yPercent: 100 },
        { yPercent: 0, ease: "ease-inout-1", stagger: 0.1, duration: 0.7 },
      );

    progressStops.slice(1).forEach((stop, index) => {
      timeline.add(rollTo(stop), index === 0 ? "+=0.08" : "-=0.28");
    });

    timeline
      .to(currentDigits, {
        yPercent: -100,
        ease: "ease-inout-1",
        duration: 0.7,
        stagger: 0.1,
      })
      .fromTo(
        root,
        { clipPath: "inset(0 0 0% 0)" },
        {
          clipPath: "inset(0 0 100% 0)",
          ease: "ease-inout-1",
          duration: 0.9,
          pointerEvents: "none",
        },
        "<",
      );

    return () => {
      timeline.kill();
    };
  }, []);

  if (hidden) {
    return null;
  }

  return (
    <div ref={rootRef} className="preloader">
      <div className="preloader-overlay" />
      <div className="preloader-number" aria-label="Loading">
        {[0, 1, 2].map((index) => (
          <div className="num-wrap" key={index}>
            <div className="num-current">0</div>
            <div className="num-next">0</div>
          </div>
        ))}
      </div>
    </div>
  );
}
