"use client";

import { useLayoutEffect, type RefObject } from "react";
import { ensureJasmineGsap } from "./eases";

export function useGsapContext<T extends HTMLElement>(
  scopeRef: RefObject<T | null>,
  setup: (scope: T) => void,
) {
  useLayoutEffect(() => {
    const scope = scopeRef.current;
    if (!scope) {
      return;
    }

    const { gsap } = ensureJasmineGsap();
    const context = gsap.context(() => setup(scope), scope);

    return () => context.revert();
  }, [scopeRef, setup]);
}

