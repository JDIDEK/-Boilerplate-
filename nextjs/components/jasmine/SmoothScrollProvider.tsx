"use client";

import Lenis from "lenis";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { ensureJasmineGsap } from "@/lib/animations/eases";

type SmoothScrollContextValue = {
  lenisRef: RefObject<Lenis | null> | null;
};

const SmoothScrollContext = createContext<SmoothScrollContextValue>({ lenisRef: null });

export function useJasmineLenis() {
  return useContext(SmoothScrollContext).lenisRef;
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      return;
    }

    const { gsap, ScrollTrigger } = ensureJasmineGsap();
    const smoothScroll = new Lenis({
      duration: 3,
      easing: (progress: number) => 1 - Math.pow(1 - progress, 16),
      syncTouchLerp: 0.2,
      touchInertiaExponent: 2,
      touchMultiplier: 2.3,
      syncTouch: false,
    });

    const updateScrollTrigger = () => ScrollTrigger.update();
    const raf = (time: number) => smoothScroll.raf(time * 1000);

    smoothScroll.on("scroll", updateScrollTrigger);
    gsap.ticker.add(raf);
    smoothScroll.scrollTo("top", { immediate: true, force: true });
    lenisRef.current = smoothScroll;

    return () => {
      smoothScroll.off("scroll", updateScrollTrigger);
      gsap.ticker.remove(raf);
      smoothScroll.destroy();
      lenisRef.current = null;
    };
  }, []);

  const value = useMemo(() => ({ lenisRef }), []);

  return (
    <SmoothScrollContext.Provider value={value}>
      <div className="main-content-wrapper" data-scroll-wrapper>
        <div className="main-content main-content--current" data-scroll-content>
          {children}
        </div>
      </div>
    </SmoothScrollContext.Provider>
  );
}
