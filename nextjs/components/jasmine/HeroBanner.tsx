"use client";

import { useLayoutEffect, useRef } from "react";
import { ensureJasmineGsap } from "@/lib/animations/eases";
import { splitText } from "@/lib/animations/split";

export function HeroBanner() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const { gsap, ScrollTrigger } = ensureJasmineGsap();
    const q = gsap.utils.selector(section);
    const titleWrapper = q(".hg-1-wrapper")[0] as HTMLElement;
    const title = q(".hg-1")[0] as HTMLElement;
    const video = videoRef.current;
    const mediaWrapper = q(".media-wrapper")[0] as HTMLElement;
    const mediaOuter = q(".media-outer")[0] as HTMLElement;
    const mediaCaptions = q(".media-caption-inner");
    const headingLeft = q(".hg-2--left .hg-2-inner")[0] as HTMLElement;
    const headingRight = q(".hg-2--right .hg-2-inner")[0] as HTMLElement;
    const scrollIndicator = q(".scroll-indicator")[0] as HTMLElement;
    const header = document.querySelector<HTMLElement>(".main-header");
    const titleSplit = splitText(title, { type: "chars", mask: "chars" });
    const cleanups: Array<() => void> = [];

    if (video) {
      video.play().catch(() => undefined);
    }

    if (reducedMotion) {
      gsap.set([titleWrapper, video, mediaCaptions, headingLeft, headingRight, scrollIndicator], {
        clearProps: "all",
        opacity: 1,
      });
      return () => titleSplit.revert();
    }

    gsap.set(header, { opacity: 0 });
    gsap.set(scrollIndicator, { opacity: 0.2, yPercent: 100 });
    gsap.set([mediaCaptions, headingLeft, headingRight], { yPercent: -100 });
    gsap.set(mediaWrapper, {
      xPercent: -50,
      yPercent: -50,
      top: "50%",
      clipPath: "inset(0 0 100% 0)",
    });
    gsap.set(video, { yPercent: -100, scale: 1.6 });
    gsap.set(titleWrapper, { yPercent: -50 });

    titleSplit.chars.forEach((char) => {
      const enter = () => {
        gsap.timeline().to(char, {
          yPercent: -55,
          duration: 0.18,
          ease: "expo.out",
          yoyo: true,
          repeat: 1,
        });
      };
      char.addEventListener("pointerenter", enter);
      cleanups.push(() => char.removeEventListener("pointerenter", enter));
    });

    const intro = gsap.timeline({ delay: 1.15 });
    intro
      .fromTo(
        title,
        { yPercent: 100 },
        { yPercent: 0, ease: "ease-inout-1", duration: 0.9 },
      )
      .to(
        titleWrapper,
        {
          "--margin-top": 1.025,
          top: "1.25%",
          yPercent: -1.25,
          ease: "expo.inOut",
          duration: 1.6,
        },
        "-=0.15",
      )
      .to(
        titleWrapper,
        {
          "--margin-top": 1,
          top: 0,
          yPercent: 0,
          ease: "none",
          duration: 0.8,
        },
        "-=0.4",
      )
      .fromTo(
        video,
        { yPercent: -100, scale: 1.6 },
        {
          yPercent: 0,
          scale: 1,
          clipPath: "inset(0 0 0% 0)",
          ease: "expo.out",
          duration: 1.8,
          clearProps: "clipPath",
        },
        "-=1.04",
      )
      .to(mediaWrapper, { clipPath: "inset(0 0 0% 0)", duration: 1.8, ease: "expo.out" }, "<")
      .fromTo(
        [mediaCaptions, headingLeft, headingRight],
        { yPercent: -100 },
        { yPercent: 0, ease: "expo.out", duration: 1.8 },
        "<+=0.1",
      )
      .to(header, { opacity: 1, duration: 1.2, ease: "ease-x" }, "-=0.7")
      .to(scrollIndicator, { yPercent: 0, opacity: 1, ease: "expo.out", duration: 1.2 }, "<");

    const updateHeroSpacing = () => {
      const wrapper = q(".t-cr-wrapper")[0] as HTMLElement;
      const mediaBounds = mediaOuter.getBoundingClientRect();
      const wrapperBounds = wrapper.getBoundingClientRect();
      const available =
        Math.max(window.innerHeight, (q(".t-cr")[0] as HTMLElement).getBoundingClientRect().height) -
        (mediaBounds.top - wrapperBounds.top + mediaBounds.height);
      section.style.paddingBottom = `${window.innerHeight - available}px`;
    };

    updateHeroSpacing();

    const scroll = gsap.timeline({
      scrollTrigger: {
        refreshPriority: 1,
        trigger: q(".t-cr-wrapper")[0],
        pin: true,
        start: "top top",
        end: "bottom+=150% top",
        scrub: true,
        pinSpacing: true,
      },
    });

    scroll
      .to(mediaWrapper, { top: "100%", yPercent: 0, duration: 1.8, ease: "none" }, 0)
      .to(headingLeft, { x: "-32vw", duration: 1.8, ease: "none" }, 0)
      .to(headingRight, { x: "32vw", duration: 1.8, ease: "none" }, 0)
      .to(mediaCaptions[0], { x: "-32vw", duration: 1.8, ease: "none" }, 0)
      .to(mediaCaptions[1], { x: "32vw", duration: 1.8, ease: "none" }, 0)
      .to(
        mediaWrapper,
        {
          width: "100vw",
          height: "100vh",
          duration: 2,
          ease: "none",
        },
        0.2,
      )
      .to(video, { scale: 1.2, duration: 1, ease: "none" }, 0.2);

    const onResize = () => {
      updateHeroSpacing();
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cleanups.forEach((cleanup) => cleanup());
      titleSplit.revert();
      intro.kill();
      scroll.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} id="home" className="section-hero-banner">
      <div className="t-cr-wrapper">
        <div className="t-cr">
          <div className="t-box spacer" />
          <div className="t-box title-intro">
            <div className="hg-1-wrapper">
              <h1 className="hg-1">Jasmine Gunarto</h1>
            </div>
          </div>
          <div className="t-box video-intro">
            <div className="media-outer">
              <div className="media-caption-container-wrapper">
                <div className="media-caption-container">
                  <div className="media-caption media-caption--left">
                    <div className="media-caption-inner">MOTION DESIGN</div>
                  </div>
                  <div className="media-caption media-caption--right">
                    <div className="media-caption-inner">2026</div>
                  </div>
                </div>
              </div>
              <div className="media-wrapper">
                <video
                  ref={videoRef}
                  className="t-ma"
                  src="/jasmine/media/demoreel.mp4"
                  loop
                  muted
                  playsInline
                  autoPlay
                  preload="auto"
                />
              </div>
            </div>
            <div className="heading-2-container-wrapper">
              <div className="heading-2-container">
                <div className="hg-2 hg-2--left">
                  <div className="hg-2-inner">A VISUAL</div>
                </div>
                <div className="hg-2 hg-2--right">
                  <div className="hg-2-inner">DESIGNER</div>
                </div>
              </div>
            </div>
          </div>
          <div className="t-box media-scroll-placeholder" />
          <div className="t-box scroll-indicator-wrapper">
            <div className="scroll-indicator">scroll down</div>
          </div>
        </div>
      </div>
    </section>
  );
}

