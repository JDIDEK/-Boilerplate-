"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { awardItems } from "@/data/jasmine";
import { ensureJasmineGsap } from "@/lib/animations/eases";
import { splitText } from "@/lib/animations/split";
import { JasminePageShell } from "./JasminePageShell";
import { MagneticButton } from "./MagneticButton";

const skills = ["Motion Design", "Graphic Design", "Branding", "Storytelling", "Motion Collage"];
const markImages = ["/jasmine/media/mark-1.png", "/jasmine/media/mark-2.png", "/jasmine/media/mark-3.png"];

function setupHorizontalCharHover(chars: Element[], gsap: ReturnType<typeof ensureJasmineGsap>["gsap"]) {
  const cleanups: Array<() => void> = [];

  chars.forEach((char) => {
    const text = char.textContent ?? "";
    char.textContent = "";
    const current = document.createElement("span");
    const next = document.createElement("span");
    current.textContent = text;
    next.textContent = text;
    char.append(current, next);
    gsap.set(char, { display: "inline-block", overflow: "clip", position: "relative" });
    gsap.set([current, next], { display: "block" });
    gsap.set(next, { position: "absolute", top: "0%", right: "-100%" });

    const enter = () => {
      gsap
        .timeline()
        .fromTo(current, { xPercent: 0 }, { xPercent: -100, duration: 0.8, ease: "expo.out", overwrite: true })
        .fromTo(next, { xPercent: 0 }, { xPercent: -100, duration: 0.8, ease: "expo.out", overwrite: true }, "<+=.18");
    };

    char.addEventListener("mouseenter", enter);
    cleanups.push(() => char.removeEventListener("mouseenter", enter));
  });

  return cleanups;
}

function AboutBanner() {
  const sectionRef = useRef<HTMLElement | null>(null);

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
    const mediaIntro = q(".media-intro")[0] as HTMLElement;
    const captions = q(".media-caption-inner");
    const bodyCaptions = q(".body-caption");
    const body = q(".t-body")[0] as HTMLElement;
    const header = document.querySelector<HTMLElement>(".main-header");
    const titleSplit = splitText(title, { type: "words,chars" });
    const bodySplits = bodyCaptions.map((caption) => splitText(caption as Element, { type: "lines", mask: "lines" }));
    const bodySplit = splitText(body, { type: "lines", mask: "lines", linesClass: "u-inline-block" });
    const cleanups = setupHorizontalCharHover(titleSplit.chars, gsap);

    if (reducedMotion) {
      gsap.set([section, mediaIntro, captions, bodyCaptions, body], { clearProps: "all", opacity: 1 });
      return () => {
        cleanups.forEach((cleanup) => cleanup());
        titleSplit.revert();
        bodySplits.forEach((split) => split.revert());
        bodySplit.revert();
      };
    }

    gsap.set(header, { opacity: 0 });
    gsap.set(titleWrapper, { yPercent: -50 });
    gsap.set(mediaIntro, { "--y-pos": 1 });
    gsap.set(section, { "--height-factor": 1 });
    gsap.set(captions, { yPercent: 100 });

    const currentChars = titleSplit.chars.map((char) => char.children[0]).filter(Boolean);
    const nextChars = titleSplit.chars.map((char) => char.children[1]).filter(Boolean);

    const intro = gsap.timeline({ delay: 0.65 });
    intro
      .fromTo(title, { yPercent: 100 }, { yPercent: 0, ease: "ease-inout-1", duration: 0.9 })
      .fromTo(
        currentChars,
        { xPercent: 0 },
        { xPercent: -100, duration: 1.2, ease: "ease-inout-1", overwrite: true, stagger: { each: 0.05 } },
        "<+=.4",
      )
      .fromTo(
        nextChars,
        { xPercent: 0 },
        { xPercent: -100, duration: 0.9, ease: "expo.out", overwrite: true, stagger: { each: 0.04 } },
        "<+=1",
      )
      .to(
        titleWrapper,
        { "--margin-top": 1.025, top: "1.25%", yPercent: -1.25, ease: "expo.inOut", duration: 1.6 },
        "-=1.2",
      )
      .to(titleWrapper, { "--margin-top": 1, top: 0, yPercent: 0, ease: "none", duration: 0.8 }, "-=.4")
      .fromTo(section, { "--height-factor": 1 }, { "--height-factor": 0, ease: "expo.out", duration: 1.8 }, "-=.95")
      .fromTo(mediaIntro, { "--y-pos": 1 }, { "--y-pos": 0, ease: "expo.out", duration: 1.8 }, "<+=.1")
      .fromTo(captions, { yPercent: 100 }, { yPercent: 0, ease: "expo.out", duration: 1.8 }, "<+=.95")
      .to(header, { opacity: 1, duration: 1.2, ease: "ease-x" }, "-=.7")
      .fromTo(
        bodySplits.flatMap((split) => split.lines),
        { yPercent: 120 },
        { yPercent: 0, duration: 1.1, stagger: { each: 0.11 }, ease: "ease-inout-1" },
        "<-=1.8",
      )
      .fromTo(
        bodySplit.lines,
        { yPercent: 120 },
        { yPercent: 0, duration: 1.1, stagger: 0.11, ease: "ease-inout-1" },
        "<+=.11",
      );

    const parallax = gsap.fromTo(
      q(".media-outer")[0],
      { yPercent: 0 },
      {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: q(".media-intro-wrapper")[0],
          start: "top bottom",
          end: "bottom+=50% top",
          scrub: true,
        },
      },
    );

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      titleSplit.revert();
      bodySplits.forEach((split) => split.revert());
      bodySplit.revert();
      intro.kill();
      parallax.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === q(".media-intro-wrapper")[0]) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className="section-about-banner">
      <div className="t-cr-wrapper">
        <div className="t-cr">
          <div className="t-box title-intro">
            <div className="hg-1-wrapper">
              <h1 className="hg-1">About Jasmine</h1>
            </div>
          </div>
          <div className="t-box media-intro-wrapper">
            <div className="media-intro">
              <div className="media-outer">
                <div className="media-caption-container-wrapper">
                  <div className="media-caption-container">
                    <div className="media-caption media-caption--left">
                      <div className="media-caption-inner">WHO&apos;S THIS?</div>
                    </div>
                    <div className="media-caption media-caption--right">
                      <div className="media-caption-inner">HELLO, HI, HEY</div>
                    </div>
                  </div>
                </div>
                <div className="media-wrapper">
                  <picture className="t-ma">
                    <img src="/jasmine/media/about-portrait.webp" alt="Jasmine Gunarto" />
                  </picture>
                </div>
                <div className="media-social-container-wrapper">
                  <div className="media-social-container">
                    <MagneticButton href="/jasmine/media/JasmineGunarto_resume_MD.pdf">RESUME</MagneticButton>
                    <MagneticButton href="https://www.linkedin.com/in/jas-gunarto/">LINKEDIN</MagneticButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="t-box section-body">
            <div className="body-caption-container">
              <div className="body-caption body-caption-1">ADVOCATE OF<br />TYPE :)</div>
              <div className="body-caption body-caption-2">FUNNY?, KIND,<br />A HUMAN BEING</div>
              <div className="body-caption body-caption-3">SNACK + FOOD<br />GIVER</div>
            </div>
            <div className="t-body">
              Heya, I&apos;m Jas, a multidisciplinary designer from Jakarta, Indonesia, now in the US, working across graphic,
              motion, and brand.
              <br />
              <br />
              I love mixed media, storytelling, and letting good conversations and everyday moments sneak into my work.
              <br />
              <br />
              When I&apos;m not designing, I&apos;m usually watching films, traveling when I can, or hunting for good food.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RowGallery() {
  const ref = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const section = ref.current;
    if (!section) {
      return;
    }
    const { gsap } = ensureJasmineGsap();
    const track = section.querySelector<HTMLElement>(".container-media");
    if (!track) {
      return;
    }
    const tween = gsap.fromTo(
      track,
      { xPercent: -12 },
      {
        xPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
    return () => {
      tween.kill();
    };
  }, []);

  return (
    <section ref={ref} className="section-row-gallery">
      <div className="t-cr">
        <div className="t-box t-box-c">
          <div className="container-media">
            {markImages.map((image) => (
              <div className="item-media" key={image}>
                <div className="media-image-wrapper">
                  <picture className="media-image">
                    <img src={image} alt="" />
                  </picture>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StackedText() {
  const ref = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const section = ref.current;
    if (!section) {
      return;
    }

    const { gsap, ScrollTrigger } = ensureJasmineGsap();
    const wrappers = gsap.utils.toArray<HTMLElement>(".section-stacked-text .text-item-wrapper");
    const texts = gsap.utils.toArray<HTMLElement>(".section-stacked-text .text-item");
    const bg = section.querySelector<HTMLElement>(".dynamic-bg");
    const bgInner = bg?.children[0] as HTMLElement | undefined;
    const splits = texts.map((text) => splitText(text, { type: "lines", mask: "lines" }));
    const lines = splits.flatMap((split) => split.lines);

    const intro = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        once: true,
      },
    });

    intro
      .fromTo(
        wrappers,
        { clipPath: "inset(0% 0% 100% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", ease: "ease-inout-1", duration: 1.2, clearProps: "clipPath", stagger: { each: 0.12 } },
      )
      .fromTo(lines, { yPercent: 100 }, { yPercent: 0, ease: "ease-inout-1", duration: 1.2, stagger: { each: 0.12 } }, "-=.9")
      .set(wrappers, { background: "none" })
      .set(section.querySelector(".text-container-wrapper"), { background: "rgba(var(--cl-accent-2), 1)" });

    if (bgInner) {
      intro.fromTo(
        bgInner,
        { clipPath: "inset(0% 0% 100% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", ease: "ease-inout-1", duration: 1.2 },
      );
    }

    texts.forEach((text, index) => {
      ScrollTrigger.create({
        trigger: text,
        start: "center center",
        end: "center center",
        onEnter: () => {
          gsap.to(bg, { yPercent: index * 100, ease: "power1.out", duration: 0.4 });
          gsap.to(texts, { opacity: 0.4, filter: "contrast(1)", ease: "ease-inout-1", duration: 0.4 });
          gsap.to(text, { opacity: 1, filter: "contrast(1.2)", ease: "power1.out", duration: 0.4 });
        },
        onLeaveBack: () => {
          gsap.to(bg, { yPercent: index * 100, ease: "power1.out", duration: 0.4 });
          gsap.to(texts, { opacity: 0.4, filter: "contrast(1)", ease: "ease-inout-1", duration: 0.4 });
          gsap.to(text, { opacity: 1, filter: "contrast(1.2)", ease: "power1.out", duration: 0.4 });
        },
      });
    });

    return () => {
      splits.forEach((split) => split.revert());
      intro.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (texts.includes(trigger.trigger as HTMLElement) || trigger.trigger === section) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <section ref={ref} className="section-stacked-text">
      <div className="t-cr">
        <div className="t-box text-container-wrapper">
          <div className="dynamic-bg">
            <div className="dynamic-bg-inner" />
          </div>
          <ul className="text-container">
            {skills.map((skill) => (
              <div className="text-item-wrapper" key={skill}>
                <li className="text-item">{skill}</li>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Awards() {
  const ref = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const section = ref.current;
    if (!section) {
      return;
    }
    const { gsap } = ensureJasmineGsap();
    const heading = section.querySelector<HTMLElement>(".section-heading");
    const items = gsap.utils.toArray<HTMLElement>(".section-award .heading-item-text");
    const body = section.querySelector<HTMLElement>(".body-item.is-active");
    const headingSplit = heading ? splitText(heading, { type: "lines", mask: "lines", linesClass: "o-line" }) : null;
    const itemSplits = items.map((item) => splitText(item, { type: "lines", mask: "lines", linesClass: "o-line" }));
    const bodySplit = body ? splitText(body, { type: "lines", mask: "lines", linesClass: "o-line" }) : null;

    const intro = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        once: true,
      },
    });
    if (headingSplit) {
      intro.fromTo(headingSplit.lines, { yPercent: 150, opacity: 0 }, { yPercent: 0, opacity: 1, ease: "ease-inout-1", duration: 1.8 });
    }
    intro.fromTo(
      itemSplits.flatMap((split) => split.lines),
      { yPercent: 120 },
      { yPercent: 0, ease: "ease-inout-1", duration: 1.2, stagger: { each: 0.1 } },
      "<+=.4",
    );
    if (bodySplit) {
      intro.fromTo(bodySplit.lines, { yPercent: 120 }, { yPercent: 0, ease: "ease-inout-1", duration: 1.2, stagger: { each: 0.1 } }, "<+=.2");
    }

    return () => {
      headingSplit?.revert();
      itemSplits.forEach((split) => split.revert());
      bodySplit?.revert();
      intro.kill();
    };
  }, [active]);

  return (
    <section ref={ref} className="section-award">
      <div className="t-cr">
        <div className="t-box t-box-a">
          <h2 className="section-heading">AWARD WINNING</h2>
          <div className="heading-container-wrapper">
            <ul className="heading-container">
              {awardItems.map((award, index) => (
                <li
                  className={`heading-item${active === index ? " is-active" : ""}`}
                  key={award.title}
                  onMouseEnter={() => setActive(index)}
                >
                  <div className="heading-item-text">{award.title}</div>
                </li>
              ))}
            </ul>
          </div>
          <div className="image-container-wrapper">
            <ul className="image-container">
              {awardItems.map((award, index) => (
                <li className={`image-item${active === index ? " is-active" : ""}`} key={award.title}>
                  <picture className="image-item__image">
                    <img src={award.image} alt="" />
                  </picture>
                </li>
              ))}
            </ul>
          </div>
          <div className="body-container-wrapper">
            <ul className="body-container">
              {awardItems.map((award, index) => (
                <li className={`body-item${active === index ? " is-active" : ""}`} key={award.title}>
                  {award.body}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function JasmineAboutPage() {
  return (
    <JasminePageShell>
      <AboutBanner />
      <RowGallery />
      <StackedText />
      <Awards />
    </JasminePageShell>
  );
}
