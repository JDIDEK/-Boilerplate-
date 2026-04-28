"use client";

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

let registered = false;

export function ensureJasmineGsap() {
  if (registered) {
    return { gsap, ScrollTrigger, SplitText };
  }

  gsap.registerPlugin(CustomEase, ScrollTrigger, SplitText);
  CustomEase.create("ease-inout-1", "M0,0 C0.496,0.004 0,1 1,1");
  CustomEase.create("ease-x", "0.47, 0.82, 0.03, 0.97");
  CustomEase.create("ease-inout-2", ".79,.19,.24,.98");
  gsap.ticker.lagSmoothing(0);

  registered = true;
  return { gsap, ScrollTrigger, SplitText };
}

