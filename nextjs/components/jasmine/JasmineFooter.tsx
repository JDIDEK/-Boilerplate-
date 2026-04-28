"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { navItems } from "@/data/jasmine";
import { ensureJasmineGsap } from "@/lib/animations/eases";
import { useJasmineLenis } from "./SmoothScrollProvider";

const socials = [
  { label: "INSTAGRAM", href: "https://www.instagram.com/yakinao/#" },
  { label: "LINKEDIN", href: "http://linkedin.com/in/jas-gunarto" },
  { label: "BEHANCE", href: "https://www.behance.net/jasgunarto" },
  { label: "EMAIL", href: "mailto:jasminegunarto1@gmail.com" },
];

function useNewYorkClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const localTime = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        timeStyle: "short",
      }).format(now);
      const offset =
        new Intl.DateTimeFormat("en-US", {
          timeZone: "America/New_York",
          timeZoneName: "shortOffset",
        })
          .formatToParts(now)
          .find((part) => part.type === "timeZoneName")?.value ?? "GMT";

      setTime(`${localTime}  ${offset}`);
    };

    update();
    const interval = window.setInterval(update, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  return time;
}

export function JasmineFooter() {
  const time = useNewYorkClock();
  const lenisRef = useJasmineLenis();

  useLayoutEffect(() => {
    const { gsap, ScrollTrigger } = ensureJasmineGsap();
    const footer = document.querySelector<HTMLElement>(".main-footer");
    if (!footer) {
      return;
    }

    const marquee = footer.querySelector<HTMLElement>(".t-marquee-item");
    const marqueeInner = footer.querySelector<HTMLElement>(".t-marquee-item-inner");
    const links = gsap.utils.toArray<HTMLElement>(".main-footer .nav-item");
    const cleanups: Array<() => void> = [];

    links.forEach((link) => {
      const enter = () => gsap.to(link, { x: 10, duration: 0.35, ease: "expo.out" });
      const leave = () => gsap.to(link, { x: 0, duration: 0.35, ease: "expo.out" });
      link.addEventListener("pointerenter", enter);
      link.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        link.removeEventListener("pointerenter", enter);
        link.removeEventListener("pointerleave", leave);
      });
    });

    let tween: ReturnType<typeof gsap.to> | null = null;
    if (marquee && marqueeInner) {
      marquee.innerHTML = "";
      for (let index = 0; index < 3; index += 1) {
        const clone = marqueeInner.cloneNode(true);
        marquee.appendChild(clone);
      }
      tween = gsap.to(marquee, {
        xPercent: -33.333,
        duration: 30,
        ease: "none",
        repeat: -1,
      });
      ScrollTrigger.create({
        trigger: marquee,
        start: "top-=200px bottom",
        end: "bottom+=200px top",
        onEnter: () => tween?.play(),
        onEnterBack: () => tween?.play(),
        onLeave: () => tween?.pause(),
        onLeaveBack: () => tween?.pause(),
      });
      window.setTimeout(() => tween?.pause(), 2000);
    }

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      tween?.kill();
    };
  }, []);

  const scrollTop = () => {
    const lenis = lenisRef?.current;
    if (lenis) {
      lenis.scrollTo("top", { duration: 5 });
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="main-footer">
      <div className="t-cr">
        <div className="t-box labels">
          <div className="label-left">(FOLLOW)</div>
          <div className="label-right">(NAVIGATION)</div>
        </div>
        <div className="i-line" />
        <div className="t-box navigations">
          <div className="social-container">
            {socials.map((social) => (
              <a className="nav-item" href={social.href} target="_blank" rel="noreferrer" key={social.label}>
                {social.label}
              </a>
            ))}
          </div>
          <button className="to-top" type="button" onClick={scrollTop}>
            BACK TO TOP
          </button>
          <nav className="nav-container" aria-label="Footer navigation">
            {navItems.map((item) => (
              <a
                className="nav-item"
                href={item.href}
                data-transition-type={item.transitionType}
                key={item.href}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="t-box t-marquee">
          <div className="t-marquee-item">
            <div className="t-marquee-item-inner">LET&apos;S TALK</div>
          </div>
        </div>
        <div className="t-box footer-metadata">
          <div className="t-location">NEW YORK, US</div>
          <div className="t-time">{time}</div>
          <div className="t-coords">36.7783° N, 119.4179°</div>
          <div className="copyright">
            <div className="copyright-year">
              <span className="copyright-mark">C</span>
              <span>2026</span>
            </div>
            ALL RIGHTS RESERVED
          </div>
        </div>
      </div>
    </footer>
  );
}
