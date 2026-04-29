"use client";

import gsapCore from "gsap";
import { usePathname, useRouter } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import { ensureJasmineGsap } from "@/lib/animations/eases";
import { splitText } from "@/lib/animations/split";
import { useJasmineLenis } from "./SmoothScrollProvider";

type TransitionType = "home" | "about" | "break" | "project";
type GsapTimeline = ReturnType<typeof gsapCore.timeline>;
type SplitInstance = ReturnType<typeof splitText>;

type ComplexTransitionParts = {
  panel: HTMLElement;
  captions: HTMLElement[];
  captionLines: Element[];
  titleChars: Element[];
  titleLines: Element[];
  titleOne: HTMLElement;
  titleTwo: HTMLElement;
  media: HTMLElement;
  image: HTMLElement;
};

const leaveDelays: Record<TransitionType, number> = {
  project: 1150,
  break: 1150,
  about: 1220,
  home: 1220,
};

function isTransitionType(value: string | undefined): value is TransitionType {
  return value === "home" || value === "about" || value === "break" || value === "project";
}

function viewportOffset(element: HTMLElement, bounds: "left" | "right" | "center") {
  const rect = element.getBoundingClientRect();
  const centerToLeft = window.innerWidth / 2 - rect.left;

  if (bounds === "left") {
    return centerToLeft;
  }

  if (bounds === "right") {
    return centerToLeft - rect.width;
  }

  return centerToLeft - rect.width / 2;
}

function widthOf(element: HTMLElement) {
  return element.getBoundingClientRect().width || 1;
}

export function JasmineTransitions() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const lenisRef = useJasmineLenis();
  const router = useRouter();
  const pathname = usePathname();
  const pathnameRef = useRef<string | null>(null);
  const pendingTypeRef = useRef<TransitionType | null>(null);
  const transitionActiveRef = useRef(false);
  const activeTimelineRef = useRef<GsapTimeline | null>(null);
  const finishTransitionRef = useRef<((type: TransitionType) => void) | null>(null);
  const timerRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const { gsap } = ensureJasmineGsap();
    const splits: SplitInstance[] = [];
    const delayedCalls: Array<{ kill: () => void }> = [];
    const panels = {
      home: root.querySelector<HTMLElement>(".transition-home"),
      about: root.querySelector<HTMLElement>(".transition-about"),
      break: root.querySelector<HTMLElement>(".transition-break"),
      project: root.querySelector<HTMLElement>(".transition-project"),
    };

    const split = (target: Element, vars: SplitText.Vars) => {
      const instance = splitText(target, vars);
      splits.push(instance);
      return instance;
    };

    const setupSimpleParts = (type: "home" | "about") => {
      const panel = panels[type];
      const heading = panel?.querySelector<HTMLElement>(".section-heading__inner");
      if (!panel || !heading) {
        return null;
      }

      split(heading, { type: "words,chars", mask: "chars" });
      return { panel, heading };
    };

    const setupComplexParts = (type: "project" | "break"): ComplexTransitionParts | null => {
      const panel = panels[type];
      if (!panel) {
        return null;
      }

      const captions = gsap.utils.toArray<HTMLElement>(".t-caption", panel);
      const titles = gsap.utils.toArray<HTMLElement>(".t-title", panel);
      const media = panel.querySelector<HTMLElement>(".t-media");
      const image = media?.querySelector<HTMLElement>("img");
      const [titleOne, titleTwo] = titles;

      if (!titleOne || !titleTwo || !media || !image) {
        return null;
      }

      const captionLines = captions.flatMap((caption) => split(caption, { type: "lines", mask: "lines" }).lines);
      const titleSplits = titles.map((title) =>
        split(title, {
          type: "lines,chars",
          mask: "chars",
          linesClass: "t-line",
        }),
      );
      const orderedTitleSplits = type === "break" ? [...titleSplits].reverse() : titleSplits;
      const titleChars = orderedTitleSplits.flatMap((titleSplit) => titleSplit.chars);
      const titleLines = titleSplits.flatMap((titleSplit) => titleSplit.lines);

      return {
        panel,
        captions,
        captionLines,
        titleChars,
        titleLines,
        titleOne,
        titleTwo,
        media,
        image,
      };
    };

    const simpleParts = {
      home: setupSimpleParts("home"),
      about: setupSimpleParts("about"),
    };
    const complexParts = {
      project: setupComplexParts("project"),
      break: setupComplexParts("break"),
    };

    gsap.set(Object.values(panels), {
      opacity: 0,
      pointerEvents: "none",
    });
    gsap.set(root, { zIndex: 12 });

    const isMobile = () => window.matchMedia("(max-width: 601px)").matches;

    const createSimpleEnter = (type: "home" | "about") => {
      const parts = simpleParts[type];
      if (!parts) {
        return null;
      }

      const timeline = gsap.timeline({ paused: true });
      timeline
        .set(parts.panel, { opacity: 0, pointerEvents: "none", willChange: "clip-path" })
        .set(parts.panel, { opacity: 1, pointerEvents: "all" })
        .set(root, { zIndex: 10 })
        .fromTo(
          parts.panel,
          { clipPath: "inset(110% 0 0 0)", zIndex: 13 },
          { clipPath: "inset(0% 0 0 0)", duration: 1.6 * 0.8, ease: "ease-inout-1" },
        )
        .fromTo(parts.heading, { yPercent: 120 }, { yPercent: 0, ease: "ease-inout-1", duration: 1.2 }, "<");

      return timeline;
    };

    const createSimpleLeave = (type: "home" | "about") => {
      const parts = simpleParts[type];
      if (!parts) {
        transitionActiveRef.current = false;
        return;
      }

      activeTimelineRef.current?.pause();
      gsap
        .timeline({
          onComplete: () => {
            gsap.set(parts.panel, { opacity: 0, pointerEvents: "none" });
            transitionActiveRef.current = false;
            activeTimelineRef.current = null;
          },
        })
        .set(parts.panel, { clipPath: "inset(0 0 100% 0)" })
        .set(root, { zIndex: 12 });
    };

    const addCaptionSequence = (timeline: GsapTimeline, parts: ComplexTransitionParts) => {
      timeline
        .set(parts.captionLines, { willChange: "transform" })
        .fromTo(parts.captions, { yPercent: 0 }, { yPercent: -80, duration: 2.6, ease: "ease" }, "0")
        .fromTo(
          parts.captionLines,
          { yPercent: 100 },
          { yPercent: 0, duration: 1, ease: "ease-inout-1", stagger: 0.05 },
          "<+=0.1",
        )
        .fromTo(parts.captionLines, { yPercent: 0 }, { yPercent: -100, duration: 1.2, ease: "ease-inout-1" }, "<+=0.9");
    };

    const addProjectTitleExit = (timeline: GsapTimeline, parts: ComplexTransitionParts) => {
      const titleOneLine = parts.titleOne.querySelector<HTMLElement>(".t-line") ?? parts.titleOne;
      const titleTwoLine = parts.titleTwo.querySelector<HTMLElement>(".t-line") ?? parts.titleTwo;

      if (isMobile()) {
        timeline.fromTo(titleOneLine, { yPercent: 0 }, { yPercent: -100, duration: 1.4, ease: "ease-inout-1" }, "-=0.25");
        timeline.fromTo(titleTwoLine, { yPercent: 0 }, { yPercent: 100, duration: 1.4, ease: "ease-inout-1" }, "<");
        return;
      }

      const titleOffset = (widthOf(parts.titleOne) - widthOf(parts.titleTwo)) / 2;
      const mediaHalf = widthOf(parts.media) / 2 * 1.04;
      const titleOneX =
        ((viewportOffset(parts.titleOne, "right") + titleOffset - mediaHalf) * Math.pow(1.2903225806, 3.3)) /
        widthOf(parts.titleOne) *
        100;
      const titleTwoX =
        ((viewportOffset(parts.titleTwo, "left") + titleOffset + mediaHalf + mediaHalf / 40) * Math.pow(1.2903225806, 3.3)) /
        widthOf(parts.titleTwo) *
        100;

      timeline
        .set([parts.titleOne, parts.titleTwo], { willChange: "transform" })
        .fromTo(titleOneLine, { xPercent: 0, scale: 1 }, { xPercent: titleOneX, scale: 1.2903225806, duration: 1.4, ease: "ease-inout-1" }, "-=0.25")
        .fromTo(titleTwoLine, { xPercent: 0, scale: 1 }, { xPercent: titleTwoX, scale: 1.2903225806, duration: 1.4, ease: "ease-inout-1" }, "<");
    };

    const addBreakTitleExit = (timeline: GsapTimeline, parts: ComplexTransitionParts) => {
      const titleOneLine = parts.titleOne.querySelector<HTMLElement>(".t-line") ?? parts.titleOne;
      const titleTwoLine = parts.titleTwo.querySelector<HTMLElement>(".t-line") ?? parts.titleTwo;
      const distance = isMobile() ? 100 : 115;
      const scale = isMobile() ? 1 : 1.2;

      timeline
        .fromTo(titleOneLine, { yPercent: 0, scale: 1 }, { yPercent: -distance, scale, duration: 1.4, ease: "ease-inout-1" }, "-=0.25")
        .fromTo(titleTwoLine, { yPercent: 0, scale: 1 }, { yPercent: distance, scale, duration: 1.4, ease: "ease-inout-1" }, "<");
    };

    const addMediaEnter = (timeline: GsapTimeline, type: "project" | "break", parts: ComplexTransitionParts) => {
      if (type === "project" && !isMobile()) {
        timeline
          .fromTo(
            parts.media,
            { scale: 0.7, clipPath: "inset(0 50% 0 50%)" },
            { scale: 1, clipPath: "inset(0 0% 0 0%)", ease: "ease-inout-1", duration: 1.4 },
            "<",
          )
          .fromTo(parts.image, { scale: 2 }, { scale: 1, ease: "ease-inout-1", duration: 1.4 }, "<");
        return;
      }

      timeline
        .fromTo(
          parts.media,
          { clipPath: "inset(50% 0 50% 0)" },
          { clipPath: "inset(0% 0 0% 0)", ease: "ease-inout-1", duration: 1.4 },
          "<",
        )
        .fromTo(parts.image, { scale: 1.2 }, { scale: 1, ease: "ease-inout-1", duration: 1.4 }, "<");
    };

    const createComplexEnter = (type: "project" | "break") => {
      const parts = complexParts[type];
      if (!parts) {
        return null;
      }

      const timeline = gsap.timeline({ paused: true });
      const mobile = isMobile();
      const panelStart = type === "project" ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)";
      const chars = type === "break" ? [...parts.titleChars].reverse() : parts.titleChars;
      const charStart = type === "project" || mobile ? -100 : 100;
      const lineStart = type === "project" ? -15 : 15;

      timeline
        .set(parts.panel, { opacity: 0, pointerEvents: "none" })
        .set(parts.panel, { opacity: 1, pointerEvents: "all", zIndex: 13 })
        .set(root, { zIndex: 12 })
        .set(parts.titleLines, mobile ? { yPercent: 0 } : { xPercent: 0, scale: 1 })
        .set(parts.media, type === "project" && !mobile ? { clipPath: "inset(0 50% 0 50%)" } : { clipPath: "inset(50% 0 50% 0)" })
        .fromTo(parts.panel, { clipPath: panelStart }, { clipPath: "inset(0 0% 0 0)", duration: 1.6 * 0.8, ease: "ease-inout-1" })
        .fromTo(
          chars,
          { xPercent: charStart },
          { xPercent: 0, duration: 1 * 0.8, ease: "ease-inout-1", overwrite: true, stagger: 0.05 * 0.8 },
          "0",
        )
        .fromTo(parts.titleLines, { xPercent: lineStart }, { xPercent: 0, duration: 1.4, ease: "ease-inout-1" }, mobile && type === "break" ? "0" : "<");

      if (type === "project") {
        addProjectTitleExit(timeline, parts);
      } else {
        addBreakTitleExit(timeline, parts);
      }

      addMediaEnter(timeline, type, parts);
      addCaptionSequence(timeline, parts);
      return timeline;
    };

    const createComplexLeave = (type: "project" | "break", onComplete: () => void) => {
      const parts = complexParts[type];
      if (!parts) {
        onComplete();
        return null;
      }

      const timeline = gsap.timeline({ paused: true, onComplete });
      const endClip = type === "project" ? "inset(0 0 100% 0)" : "inset(0 100% 0 0)";
      timeline
        .fromTo(parts.panel, { clipPath: "inset(0 0 0% 0)" }, { clipPath: endClip, duration: 1.6, ease: "ease-inout-1" })
        .set(parts.panel, { opacity: 0, pointerEvents: "none" })
        .set(root, { zIndex: 12 });
      return timeline;
    };

    const cleanupAfterTransition = () => {
      transitionActiveRef.current = false;
      activeTimelineRef.current = null;
    };

    const playEnter = (type: TransitionType) => {
      activeTimelineRef.current?.kill();
      const timeline = type === "home" || type === "about" ? createSimpleEnter(type) : createComplexEnter(type);
      if (!timeline) {
        return;
      }

      activeTimelineRef.current = timeline;
      timeline.invalidate().play(0);
    };

    finishTransitionRef.current = (type: TransitionType) => {
      if (type === "home" || type === "about") {
        createSimpleLeave(type);
        return;
      }

      const playLeave = () => {
        const leave = createComplexLeave(type, cleanupAfterTransition);
        leave?.invalidate().play(0);
      };
      const activeTimeline = activeTimelineRef.current;

      if (activeTimeline?.isActive()) {
        const delay = Math.max(0, activeTimeline.duration() - activeTimeline.time() - 0.6);
        const delayedCall = gsap.delayedCall(delay, playLeave);
        delayedCalls.push(delayedCall);
        return;
      }

      playLeave();
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>("[data-transition-type]");
      const href = link?.getAttribute("href");

      if (!link || !href || link.target || link.hasAttribute("download")) {
        return;
      }

      const type = isTransitionType(link.dataset.transitionType) ? link.dataset.transitionType : "home";

      if (href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) {
        return;
      }

      const target = new URL(href, window.location.href);
      if (target.origin !== window.location.origin) {
        return;
      }

      const current = new URL(window.location.href);
      const samePath = target.pathname === current.pathname && target.search === current.search;
      if (samePath && !target.hash) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      if (transitionActiveRef.current) {
        return;
      }

      transitionActiveRef.current = true;
      pendingTypeRef.current = type;
      playEnter(type);

      const delay = leaveDelays[type] + (isMobile() && (type === "home" || type === "about") ? 80 : 0);
      timerRef.current = window.setTimeout(() => {
        if (samePath && target.hash) {
          lenisRef?.current?.scrollTo(target.hash, { duration: 1.2 });
          finishTransitionRef.current?.(type);
          pendingTypeRef.current = null;
          return;
        }

        lenisRef?.current?.scrollTo("top", { immediate: true, force: true });
        router.push(`${target.pathname}${target.search}${target.hash}`, { scroll: false });
      }, delay);
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
      delayedCalls.forEach((delayedCall) => delayedCall.kill());
      activeTimelineRef.current?.kill();
      finishTransitionRef.current = null;
      splits.forEach((instance) => instance.revert());
    };
  }, [lenisRef, router]);

  useLayoutEffect(() => {
    if (pathnameRef.current === null) {
      pathnameRef.current = pathname;
      return;
    }

    if (pathnameRef.current === pathname) {
      return;
    }

    pathnameRef.current = pathname;
    const type = pendingTypeRef.current;
    if (!type) {
      return;
    }

    pendingTypeRef.current = null;
    finishTransitionRef.current?.(type);
  }, [pathname]);

  return (
    <div ref={rootRef} className="t-transition" aria-hidden="true">
      <div className="transition-home">
        <div className="transition-home__inner">
          <div className="section-heading">
            <div className="section-heading__inner">JASMINE GUNARTO</div>
          </div>
        </div>
      </div>
      <div className="transition-about">
        <div className="transition-about__inner">
          <div className="section-heading">
            <div className="section-heading__inner">ABOUT JASMINE</div>
          </div>
        </div>
      </div>
      <div className="transition-break">
        <div className="t-cr">
          <div className="t-box caption-container">
            <div className="t-caption t-caption-1">SINGLE FRAME<br />EXPRESSION</div>
            <div className="t-caption t-caption-2">FUN<br />EXPERIMENTS</div>
          </div>
          <div className="t-title-container">
            <div className="t-box t-title t-title-1">CREATIVE</div>
            <div className="t-box t-title t-title-2">BREAK</div>
          </div>
          <div className="t-box t-media">
            <picture>
              <img src="/jasmine/media/transition-break-avantgarde.webp" alt="" />
            </picture>
          </div>
        </div>
      </div>
      <div className="transition-project">
        <div className="t-cr">
          <div className="t-box caption-container">
            <div className="t-caption t-caption-1">PRECISELY<br />REFINED SELECTION</div>
            <div className="t-caption t-caption-2">FOCUSED<br />VISUAL SHOWCASE</div>
            <div className="t-caption t-caption-3">CAREFULLY<br />CHOSEN NARRATIVES</div>
          </div>
          <div className="t-title-container">
            <div className="t-box t-title t-title-1">CURATED</div>
            <div className="t-box t-title t-title-2">PROJECT</div>
          </div>
          <div className="t-box t-media">
            <picture>
              <img src="/jasmine/media/transition-project-hotpot.webp" alt="" />
            </picture>
          </div>
        </div>
      </div>
    </div>
  );
}
