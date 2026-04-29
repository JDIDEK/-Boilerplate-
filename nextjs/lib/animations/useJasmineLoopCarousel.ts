"use client";

import { RefObject, useCallback, useLayoutEffect, useRef, useState } from "react";
import { ensureJasmineGsap } from "./eases";

type JasmineCarouselMode = "works" | "break";
type CarouselAxis = "x" | "y";

type UseJasmineLoopCarouselOptions = {
  sectionRef: RefObject<HTMLElement | null>;
  length: number;
  mode: JasmineCarouselMode;
  loopCopies?: number;
  durationSelector?: string;
  stateSelector?: string;
};

function wrapIndex(value: number, length: number) {
  return ((value % length) + length) % length;
}

function wrapDelta(value: number, length: number) {
  const half = length / 2;
  return ((((value + half) % length) + length) % length) - half;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatTime(seconds: number) {
  const hour = Math.floor(seconds / 3600);
  const minute = Math.floor((seconds % 3600) / 60);
  const second = Math.floor(seconds % 60);
  return [hour, minute, second].map((part) => part.toString().padStart(2, "0")).join(":");
}

export function useJasmineLoopCarousel({
  sectionRef,
  length,
  mode,
  loopCopies = 3,
  durationSelector,
  stateSelector,
}: UseJasmineLoopCarouselOptions) {
  const baseIndex = length;
  const [active, setActive] = useState(0);
  const targetRef = useRef(baseIndex);
  const progressRef = useRef(baseIndex);
  const activeVirtualRef = useRef(baseIndex);
  const activeCanonicalRef = useRef(0);
  const dragRef = useRef({
    active: false,
    coordinate: 0,
    target: baseIndex,
    moved: false,
  });

  const getAxis = useCallback((): CarouselAxis => {
    if (mode === "works") {
      return "x";
    }

    return window.matchMedia("(max-width: 601px)").matches ? "x" : "y";
  }, [mode]);

  const normalizeLoop = useCallback(() => {
    if (length <= 0) {
      return;
    }

    const min = length * 0.5;
    const max = length * (loopCopies - 0.5);

    while (targetRef.current < min) {
      targetRef.current += length;
      progressRef.current += length;
    }

    while (targetRef.current > max) {
      targetRef.current -= length;
      progressRef.current -= length;
    }
  }, [length, loopCopies]);

  const goTo = useCallback(
    (index: number) => {
      const roundedTarget = Math.round(targetRef.current);
      const currentIndex = wrapIndex(roundedTarget, length);
      targetRef.current = roundedTarget + wrapDelta(index - currentIndex, length);
      normalizeLoop();
    },
    [length, normalizeLoop],
  );

  const next = useCallback(() => {
    targetRef.current = Math.round(targetRef.current) + 1;
    normalizeLoop();
  }, [normalizeLoop]);

  const prev = useCallback(() => {
    targetRef.current = Math.round(targetRef.current) - 1;
    normalizeLoop();
  }, [normalizeLoop]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || length === 0) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const { gsap } = ensureJasmineGsap();
    const q = gsap.utils.selector(section);
    const cardSlider = q(".card-slider")[0] as HTMLElement | undefined;
    const cardWrapper = q(".card-container-wrapper")[0] as HTMLElement | undefined;
    const cardContainer = q(".card-container")[0] as HTMLElement | undefined;
    const cards = q(".card-container .t-card") as HTMLElement[];
    const titleContainer = q(".title-slider-container")[0] as HTMLElement | undefined;
    const titleWrapper = q(".title-slider-container-wrapper")[0] as HTMLElement | undefined;
    const titles = q(".title-slider-item") as HTMLElement[];
    const numbers = q(".t-slide-navigation-number-inner") as HTMLElement[];
    const frame = q(".line-ornament-container-wrapper-inner")[0] as HTMLElement | undefined;
    const duration = durationSelector ? (q(durationSelector)[0] as HTMLElement | undefined) : undefined;
    const state = stateSelector ? (q(stateSelector)[0] as HTMLElement | undefined) : undefined;
    const totalSlides = cards.length;
    let snapTimeout = 0;

    if (!cardSlider || !cardWrapper || !cardContainer || totalSlides === 0) {
      return undefined;
    }

    targetRef.current = baseIndex;
    progressRef.current = baseIndex;
    activeVirtualRef.current = baseIndex;
    activeCanonicalRef.current = 0;

    const getStep = (axis: CarouselAxis) => {
      const first = cards[0];
      const second = cards[1];
      if (!first) {
        return 1;
      }

      if (!second) {
        const bounds = first.getBoundingClientRect();
        return axis === "x" ? bounds.width : bounds.height;
      }

      return axis === "x" ? second.offsetLeft - first.offsetLeft : second.offsetTop - first.offsetTop;
    };

    const applyVideoState = (virtualIndex: number | null) => {
      cards.forEach((card, index) => {
        const video = card.querySelector<HTMLVideoElement>("video");
        const isActive = virtualIndex === index;
        card.classList.toggle("is--active", isActive);

        if (!video) {
          return;
        }

        if (isActive) {
          video.play().catch(() => undefined);
        } else {
          video.pause();
          video.currentTime = 0;
        }
      });

      const activeVideo = virtualIndex === null ? null : cards[virtualIndex]?.querySelector<HTMLVideoElement>("video");
      if (state) {
        state.textContent = activeVideo ? "playing" : "paused";
      }
      if (duration) {
        duration.textContent = activeVideo ? formatTime(activeVideo.currentTime) : "00:00:00";
      }
    };

    const renderFrameOffset = (axis: CarouselAxis, virtualIndex: number) => {
      if (!frame || !dragRef.current.active) {
        return;
      }

      const media = cards[virtualIndex]?.querySelector<HTMLElement>(".t-card-media");
      if (!media) {
        return;
      }

      const bounds = media.getBoundingClientRect();
      const viewportCenter = axis === "x" ? window.innerWidth / 2 : window.innerHeight / 2;
      const mediaCenter = axis === "x" ? bounds.left + bounds.width / 2 : bounds.top + bounds.height / 2;
      const value = -(viewportCenter - mediaCenter);

      gsap.to(frame, {
        [axis]: value,
        duration: 1.2,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const render = () => {
      const axis = getAxis();
      const velocity = targetRef.current - progressRef.current;
      progressRef.current += velocity * (dragRef.current.active ? 0.3 : 0.12);

      if (Math.abs(velocity) < 0.0005) {
        progressRef.current = targetRef.current;
      }

      normalizeLoop();

      const firstCard = cards[0];
      const step = getStep(axis);
      const wrapperSize = axis === "x" ? cardWrapper.clientWidth : cardWrapper.clientHeight;
      const firstCenter = axis === "x" ? firstCard.offsetLeft + firstCard.offsetWidth / 2 : firstCard.offsetTop + firstCard.offsetHeight / 2;
      const containerPosition = wrapperSize / 2 - firstCenter - progressRef.current * step;
      const virtualIndex = clamp(Math.round(progressRef.current), 0, totalSlides - 1);
      const canonicalIndex = wrapIndex(virtualIndex, length);

      gsap.set(cardContainer, axis === "x" ? { x: containerPosition, y: 0 } : { x: 0, y: containerPosition });

      cards.forEach((card, index) => {
        const media = card.querySelector<HTMLElement>(".t-card-media");
        const diff = index - progressRef.current;
        const mediaScale = clamp(1 - Math.abs(diff) * 0.1406417112, 0, 1);

        if (media) {
          gsap.set(media, { scale: mediaScale });
        }
      });

      if (titleContainer && titles.length > 0) {
        const titleStep = titles[1] ? titles[1].offsetTop - titles[0].offsetTop : titles[0].offsetHeight;
        const titleY = -titles[0].offsetTop - progressRef.current * titleStep;
        gsap.set(titleContainer, { y: titleY });

        titles.forEach((title, index) => {
          const inner = title.querySelector<HTMLElement>(".title-slider-inner");
          const diff = index - progressRef.current;
          const shift = mode === "break" && axis === "y" ? clamp(1 - Math.abs(diff), 0, 1) * 15 : 0;
          title.classList.toggle("is--active", index === virtualIndex);

          if (inner) {
            gsap.set(inner, { x: shift });
          }
        });

        if (titleWrapper) {
          gsap.set(titleWrapper, { height: titles[0].offsetHeight });
        }
      }

      numbers.forEach((number, index) => {
        const diff = wrapDelta(index - progressRef.current, length);
        const abs = Math.abs(diff);
        gsap.set(number, {
          opacity: clamp(1 - abs * 1.9, 0, 1),
          scale: clamp(1 - abs * 0.2, 0, 1),
        });
      });

      if (canonicalIndex !== activeCanonicalRef.current) {
        activeCanonicalRef.current = canonicalIndex;
        setActive(canonicalIndex);
      }

      if (virtualIndex !== activeVirtualRef.current) {
        activeVirtualRef.current = virtualIndex;
        if (!dragRef.current.active) {
          applyVideoState(virtualIndex);
        }
      }

      const activeVideo = cards[virtualIndex]?.querySelector<HTMLVideoElement>("video");
      if (duration && activeVideo && !dragRef.current.active) {
        duration.textContent = formatTime(activeVideo.currentTime);
      }

      renderFrameOffset(axis, virtualIndex);
    };

    const snapToTarget = () => {
      window.clearTimeout(snapTimeout);
      snapTimeout = window.setTimeout(() => {
        targetRef.current = Math.round(targetRef.current);
        normalizeLoop();
      }, 120);
    };

    const onWheel = (event: WheelEvent) => {
      const axis = getAxis();
      if (mode === "break" && axis === "x") {
        return;
      }

      event.preventDefault();
      const delta = axis === "x" ? event.deltaX + event.deltaY : event.deltaY;
      targetRef.current += clamp(delta, -120, 120) / 280;
      normalizeLoop();
      snapToTarget();
    };

    const onPointerDown = (event: PointerEvent) => {
      const axis = getAxis();
      dragRef.current = {
        active: true,
        coordinate: axis === "x" ? event.clientX : event.clientY,
        target: targetRef.current,
        moved: false,
      };
      cardSlider.setPointerCapture(event.pointerId);
      applyVideoState(null);
      if (frame) {
        gsap.to(frame, {
          scale: window.matchMedia("(max-width: 601px)").matches ? 1.05 : 1.15,
          duration: 0.8,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
      gsap.set(cardSlider, { cursor: "grabbing" });
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragRef.current.active) {
        return;
      }

      event.preventDefault();
      const axis = getAxis();
      const current = axis === "x" ? event.clientX : event.clientY;
      const step = Math.max(getStep(axis), 1);
      const delta = current - dragRef.current.coordinate;
      dragRef.current.moved = Math.abs(delta) > 4;
      targetRef.current = dragRef.current.target - delta / step;
      normalizeLoop();
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!dragRef.current.active) {
        return;
      }

      dragRef.current.active = false;
      targetRef.current = Math.round(targetRef.current);
      normalizeLoop();
      try {
        cardSlider.releasePointerCapture(event.pointerId);
      } catch {
        /* pointer capture can already be released after a cancelled drag */
      }
      applyVideoState(clamp(Math.round(targetRef.current), 0, totalSlides - 1));
      if (frame) {
        gsap.to(frame, { scale: 1, x: 0, y: 0, duration: 0.8, ease: "power3.out", overwrite: "auto" });
      }
      gsap.set(cardSlider, { cursor: "grab" });
    };

    const onClickCapture = (event: MouseEvent) => {
      if (!dragRef.current.moved) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      dragRef.current.moved = false;
    };

    const onResize = () => {
      render();
    };

    applyVideoState(baseIndex);
    render();

    if (reducedMotion) {
      return undefined;
    }

    gsap.ticker.add(render);
    cardSlider.addEventListener("wheel", onWheel, { passive: false });
    cardSlider.addEventListener("pointerdown", onPointerDown);
    cardSlider.addEventListener("pointermove", onPointerMove);
    cardSlider.addEventListener("pointerup", onPointerUp);
    cardSlider.addEventListener("pointercancel", onPointerUp);
    cardSlider.addEventListener("click", onClickCapture, true);
    window.addEventListener("resize", onResize);
    gsap.set(cardSlider, { cursor: "grab" });

    return () => {
      window.clearTimeout(snapTimeout);
      gsap.ticker.remove(render);
      cardSlider.removeEventListener("wheel", onWheel);
      cardSlider.removeEventListener("pointerdown", onPointerDown);
      cardSlider.removeEventListener("pointermove", onPointerMove);
      cardSlider.removeEventListener("pointerup", onPointerUp);
      cardSlider.removeEventListener("pointercancel", onPointerUp);
      cardSlider.removeEventListener("click", onClickCapture, true);
      window.removeEventListener("resize", onResize);
    };
  }, [baseIndex, durationSelector, getAxis, length, loopCopies, mode, normalizeLoop, sectionRef, stateSelector]);

  return { active, goTo, next, prev };
}
