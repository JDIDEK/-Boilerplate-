"use client";

import { useLayoutEffect, useRef, type AnchorHTMLAttributes, type ReactNode } from "react";
import { ensureJasmineGsap } from "@/lib/animations/eases";

type MagneticButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
};

export function MagneticButton({ children, className = "", ...props }: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement | null>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const { gsap } = ensureJasmineGsap();
    const inner = element.querySelector<HTMLElement>(".btn-cta-inner");
    if (!inner) {
      return;
    }

    const xTo = gsap.quickTo(inner, "x", { duration: 0.5, ease: "expo.out" });
    const yTo = gsap.quickTo(inner, "y", { duration: 0.5, ease: "expo.out" });

    const onMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.18;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.18;
      xTo(x);
      yTo(y);
    };

    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    element.addEventListener("pointermove", onMove);
    element.addEventListener("pointerleave", onLeave);
    element.addEventListener("blur", onLeave);

    return () => {
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerleave", onLeave);
      element.removeEventListener("blur", onLeave);
    };
  }, []);

  return (
    <a ref={ref} className={`btn-cta solid ${className}`} {...props}>
      <span className="btn-cta-inner">
        <span className="btn-cta-text">{children}</span>
      </span>
    </a>
  );
}

