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
    const isMobile = window.matchMedia("(max-width: 601px)").matches;
    const heading = q(".heading-display")[0] as HTMLElement;
    const activeLines = q(
      isMobile
        ? ".heading-display-inner-mobile .hg-1"
        : ".heading-display-inner:not(.heading-display-inner-mobile) .hg-1",
    );
    const desktopCaptions = q(".heading-display-inner:not(.heading-display-inner-mobile) .t-caption");
    const mobileCaptions = q(".t-caption-wrapper-mobile > .t-caption");
    const captionWrappers = q(".heading-display-inner:not(.heading-display-inner-mobile) .t-caption-wrapper");
    const activeCaptions = isMobile ? mobileCaptions : desktopCaptions;
    const captionSplits = activeCaptions.map((caption) =>
      splitText(caption as Element, { type: "lines", mask: "lines" }),
    );
    const captionTweens: Array<ReturnType<typeof gsap.fromTo>> = [];

    if (reducedMotion) {
      gsap.set([activeLines, activeCaptions], { clearProps: "all", opacity: 1 });
      return () => captionSplits.forEach((split) => split.revert());
    }

    const intro = gsap.timeline({
      scrollTrigger: {
        trigger: heading,
        start: "top bottom",
        once: true,
      },
    });

    activeLines.forEach((line, index) => {
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
        isMobile
          ? { yPercent: 100 }
          : { xPercent: index === 1 ? 100 : -100 },
        {
          ...(isMobile ? { yPercent: 0 } : { xPercent: 0 }),
          duration: isMobile ? 1.4 : 1.5,
          stagger: isMobile ? 0 : 0.05,
          ease: isMobile ? "ease-inout-1" : "expo.out",
        },
        index === 0 ? (isMobile ? 1.8 : 1.2) : "<",
      );
    });

    if (!isMobile) {
      captionWrappers.forEach((wrapper) => {
        const caption = wrapper.children[0];
        if (!caption) {
          return;
        }
        const tween = gsap.fromTo(
          caption,
          { top: "100%", yPercent: -100 },
          {
            top: "0%",
            yPercent: 0,
            ease: "none",
            scrollTrigger: {
              trigger: wrapper,
              start: "top bottom",
              scrub: true,
            },
          },
        );
        captionTweens.push(tween);
      });
    }

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
      { y: () => section.clientWidth * (isMobile ? 0.5 : 0.25), ease: "none" },
    );

    return () => {
      captionSplits.forEach((split) => split.revert());
      captionTweens.forEach((tween) => tween.kill());
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
