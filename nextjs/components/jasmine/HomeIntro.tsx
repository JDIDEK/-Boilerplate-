"use client";

import { useLayoutEffect, useRef } from "react";
import { ensureJasmineGsap } from "@/lib/animations/eases";
import { splitText } from "@/lib/animations/split";

export function HomeIntro() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const { gsap, ScrollTrigger } = ensureJasmineGsap();
    const q = gsap.utils.selector(section);
    const heading = q(".heading-display")[0] as HTMLElement;
    const desktopLines = q(".heading-display-inner:not(.heading-display-inner-mobile) .hg-1");
    const mobileLines = q(".heading-display-inner-mobile .hg-1");
    const captions = q(".t-caption");
    const captionSplits = captions.map((caption) =>
      splitText(caption as Element, { type: "lines", mask: "lines" }),
    );

    if (reducedMotion) {
      gsap.set([desktopLines, mobileLines, captions], { clearProps: "all", opacity: 1 });
      return () => captionSplits.forEach((split) => split.revert());
    }

    const intro = gsap.timeline({
      scrollTrigger: {
        trigger: heading,
        start: "top bottom",
        once: true,
      },
    });

    desktopLines.forEach((line, index) => {
      intro.fromTo(
        line,
        { xPercent: index % 2 === 0 ? -100 : 100 },
        { xPercent: 0, duration: 0.95, ease: "ease-inout-1" },
        index === 0 ? 0 : "<+=0.34",
      );
    });

    mobileLines.forEach((line, index) => {
      intro.fromTo(
        line,
        { xPercent: index % 2 === 0 ? -100 : 100 },
        { xPercent: 0, duration: 0.95, ease: "ease-inout-1" },
        index === 0 ? 0 : "<+=0.34",
      );
    });

    captionSplits.forEach((split, index) => {
      intro.fromTo(
        split.lines,
        { xPercent: index === 1 ? 100 : -100 },
        {
          xPercent: 0,
          duration: 1.5,
          stagger: 0.05,
          ease: "expo.out",
        },
        index === 0 ? 1.2 : "<",
      );
    });

    const parallax = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    parallax.fromTo(
      section.children[0],
      { y: 0 },
      { y: section.clientWidth / 4, ease: "none" },
    );

    return () => {
      captionSplits.forEach((split) => split.revert());
      intro.kill();
      parallax.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === heading || trigger.trigger === section) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <section ref={sectionRef} id="intro" className="section-home-intro">
      <div className="t-cr">
        <div className="t-caption-wrapper-mobile">
          <div className="t-caption caption-1">
            PURPOSEFUL <br />
            Design
          </div>
        </div>
        <h2 className="t-box heading-display">
          <div className="heading-display-inner">
            <div className="t-line">
              <div className="t-caption-wrapper">
                <div className="t-caption caption-1">
                  PURPOSEFUL <br />
                  Design
                </div>
              </div>
              <div className="t-line-mask">
                <div className="hg-1">CREATING</div>
              </div>
            </div>
            <div className="t-line">
              <div className="t-line-mask">
                <div className="hg-1">MOTION</div>
              </div>
              <div className="t-caption-wrapper">
                <div className="t-caption caption-2">Narrative through ANIMATION</div>
              </div>
            </div>
            <div className="t-line">
              <div className="t-line-mask">
                <div className="hg-1">WITH MEANING</div>
              </div>
            </div>
          </div>
          <div className="heading-display-inner heading-display-inner-mobile">
            <div className="t-line">
              <div className="t-caption-wrapper">
                <div className="t-caption caption-1">
                  PURPOSEFUL <br />
                  Design
                </div>
              </div>
              <div className="t-line-mask">
                <div className="hg-1">CREATING</div>
              </div>
            </div>
            <div className="t-line">
              <div className="t-line-mask">
                <div className="hg-1">MOTION</div>
              </div>
              <div className="t-caption-wrapper">
                <div className="t-caption caption-2">Narrative through ANIMATION</div>
              </div>
            </div>
            <div className="t-line">
              <div className="t-line-mask">
                <div className="hg-1">WITH</div>
              </div>
            </div>
            <div className="t-line">
              <div className="t-line-mask">
                <div className="hg-1">MEANING</div>
              </div>
            </div>
          </div>
        </h2>
        <div className="t-caption-wrapper-mobile">
          <div className="t-caption caption-2">Narrative through ANIMATION</div>
        </div>
      </div>
    </section>
  );
}

