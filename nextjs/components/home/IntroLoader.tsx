"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function IntroLoader() {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [counter, setCounter] = useState(0);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (!overlayRef.current) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reducedMotion) {
        setCounter(100);
        gsap.to(overlayRef.current, {
          autoAlpha: 0,
          duration: 0.25,
          ease: "none",
          onComplete: () => setIsHidden(true),
        });
        return;
      }

      const tally = { value: 0 };
      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => setIsHidden(true),
      });

      timeline
        .to(tally, {
          value: 100,
          duration: 1.45,
          ease: "power2.out",
          onUpdate: () => setCounter(Math.floor(tally.value)),
        })
        .to(
          overlayRef.current,
          {
            clipPath: "inset(0 0 100% 0)",
            yPercent: -6,
            autoAlpha: 0,
            duration: 0.85,
            ease: "power4.inOut",
          },
          "-=0.08",
        );
    }, overlayRef);

    return () => ctx.revert();
  }, []);

  if (isHidden) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[120] grid place-items-center bg-black text-[var(--color-cream)]"
      aria-live="polite"
    >
      <p className="font-editorial text-[clamp(4.2rem,12vw,9.5rem)] uppercase leading-none tracking-[-0.02em]">
        {String(counter).padStart(3, "0")}
      </p>
    </div>
  );
}