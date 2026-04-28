"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { navItems } from "@/data/jasmine";
import { ensureJasmineGsap } from "@/lib/animations/eases";

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

export function JasmineHeader() {
  const time = useNewYorkClock();

  useLayoutEffect(() => {
    const { gsap } = ensureJasmineGsap();
    const links = gsap.utils.toArray<HTMLElement>(".main-header .nav-item");
    const cleanups: Array<() => void> = [];

    links.forEach((link) => {
      const enter = () => gsap.to(link, { yPercent: -18, duration: 0.28, ease: "expo.out" });
      const leave = () => gsap.to(link, { yPercent: 0, duration: 0.35, ease: "expo.out" });

      link.addEventListener("pointerenter", enter);
      link.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        link.removeEventListener("pointerenter", enter);
        link.removeEventListener("pointerleave", leave);
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return (
    <header className="main-header">
      <div className="main-header-inner">
        <div className="location">NEW YORK, US</div>
        <div className="time">{time}</div>
        <div className="coords">36.7783° N, 119.4179°</div>
        <nav aria-label="Primary navigation">
          {navItems.map((item) => (
            <a
              className="nav-item__outer"
              href={item.href}
              data-transition-type={item.transitionType}
              key={item.href}
            >
              <span className="nav-item">{item.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

