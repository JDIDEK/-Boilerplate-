"use client";

import { useLayoutEffect, useRef } from "react";
import type { JasmineWork } from "@/data/jasmine";
import { ensureJasmineGsap } from "@/lib/animations/eases";
import { splitText } from "@/lib/animations/split";
import { MagneticButton } from "./MagneticButton";

type FeaturedWorksProps = {
  works: JasmineWork[];
};

export function FeaturedWorks({ works }: FeaturedWorksProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const { gsap } = ensureJasmineGsap();
    const q = gsap.utils.selector(section);
    const heading = q(".hg")[0] as HTMLElement;
    const line = q(".i-line")[0] as HTMLElement;
    const label = q(".s-tag-label")[0] as HTMLElement;
    const tags = q(".t-tag");
    const cards = gsap.utils.toArray<HTMLElement>(".section-featured-works .t-card");
    const headingSplit = splitText(heading, { type: "chars,lines", mask: "chars" });
    const cleanups: Array<() => void> = [];

    cards.forEach((card) => {
      const video = card.querySelector<HTMLVideoElement>(".t-card-hover-media");
      if (!video) {
        return;
      }

      const show = () => {
        card.classList.add("is--active");
        video.play().catch(() => undefined);
      };
      const hide = () => {
        card.classList.remove("is--active");
        video.currentTime = 0;
        video.pause();
      };

      card.addEventListener("pointerenter", show);
      card.addEventListener("pointerleave", hide);
      cleanups.push(() => {
        card.removeEventListener("pointerenter", show);
        card.removeEventListener("pointerleave", hide);
      });
    });

    if (reducedMotion) {
      gsap.set([headingSplit.chars, line, label, tags, cards], {
        clearProps: "all",
        opacity: 1,
      });
      return () => {
        cleanups.forEach((cleanup) => cleanup());
        headingSplit.revert();
      };
    }

    gsap.set([heading, label], { overflow: "hidden", height: "fit-content" });
    gsap.set(line, { transformOrigin: "left" });

    const intro = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        once: true,
      },
    });

    intro
      .fromTo(
        headingSplit.chars,
        { yPercent: 120 },
        { yPercent: 0, duration: 1.2, ease: "ease-x", stagger: 0.06 },
      )
      .fromTo(
        line,
        { opacity: 0.2, scaleX: 0 },
        { opacity: 1, scaleX: 1, duration: 1.4, ease: "ease-x" },
        "<",
      )
      .fromTo(
        label,
        { yPercent: 120 },
        { yPercent: 0, duration: 1.2, ease: "expo.out" },
        "<+=0.6",
      )
      .fromTo(
        tags,
        { opacity: 0, xPercent: 20 },
        { opacity: 1, xPercent: 0, duration: 2, ease: "expo.out", stagger: { each: 0.05 } },
        "<+=0.3",
      );

    cards.forEach((card, index) => {
      const inner = card.querySelector<HTMLElement>(".t-card-inner");
      if (!inner) {
        return;
      }

      gsap
        .timeline({
          delay: index % 2 === 0 ? 0.6 : 0,
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            once: true,
          },
        })
        .fromTo(inner, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: "ease-inout-1" })
        .fromTo(card, { yPercent: 20 }, { yPercent: 0, duration: 1.6, ease: "expo.out" }, "<");

      const media = card.querySelector<HTMLElement>(".t-card-media-wrapper");
      if (media) {
        gsap.fromTo(
          media,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      headingSplit.revert();
      intro.kill();
    };
  }, [works]);

  return (
    <section ref={sectionRef} id="works" className="section-featured-works">
      <div className="t-cr">
        <div className="t-box text-intro">
          <div className="hg">FEATURED WORKS</div>
          <div className="i-line" />
          <div className="s-tag-label">DESIGN INSIGHTS</div>
          <div className="cr-tag">
            <div className="t-tag">CONCEPTUAL</div>
            <div className="t-tag">expressive</div>
            <div className="t-tag">immersive</div>
          </div>
        </div>
        <div className="t-box works-wrapper">
          <article className="list-work">
            <div className="t-cr">
              <div className="t-card-container">
                {works.map((work) => (
                  <a
                    className="t-card"
                    href={`#${work.slug}`}
                    data-transition-type={work.transitionType}
                    data-slug={work.slug}
                    key={work.slug}
                  >
                    <div className="t-card-inner" data-parallax="8">
                      <div className="t-card-media-wrapper">
                        <div className="t-card-hover-media-wrapper">
                          {work.hoverVideo ? (
                            <video
                              className="t-card-hover-media"
                              src={work.hoverVideo}
                              muted
                              playsInline
                              preload="metadata"
                              loop
                            />
                          ) : null}
                        </div>
                        <picture className="t-card-featured-image-wrapper">
                          <img className="t-card-featured-image" src={work.image} alt="" />
                        </picture>
                      </div>
                      <div className="t-card-intro">
                        <div className="t-card-number">{work.number}</div>
                        <h3 className="t-card-title">{work.title}</h3>
                        <div className="t-card-tags">
                          {work.tags.map((tag) => (
                            <div className="t-card-term" key={tag}>
                              <div className="t-card-term-name">{tag}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </article>
        </div>
        <div className="t-box bottom-cta">
          <div className="cta-wrapper">
            <MagneticButton href="#works" data-transition-type="project">
              See All Work
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}

