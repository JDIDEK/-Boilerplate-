"use client";

import Link from "next/link";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { curatedWorks, type JasmineProject } from "@/data/jasmine";
import { ensureJasmineGsap } from "@/lib/animations/eases";
import { splitText } from "@/lib/animations/split";
import { JasminePageShell } from "./JasminePageShell";
import { MagneticButton } from "./MagneticButton";

function ProjectBanner({ project }: { project: JasmineProject }) {
  const ref = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const section = ref.current;
    if (!section) {
      return;
    }
    const { gsap } = ensureJasmineGsap();
    const heading = section.querySelector<HTMLElement>(".hg");
    const line = section.querySelector<HTMLElement>(".i-line");
    const tags = gsap.utils.toArray<HTMLElement>(".section-post-banner .t-tag");
    const media = section.querySelector<HTMLElement>(".media-wrapper");
    const video = section.querySelector<HTMLVideoElement>("video");
    const split = heading ? splitText(heading, { type: "chars", mask: "chars" }) : null;
    video?.play().catch(() => undefined);

    const intro = gsap.timeline({ delay: 0.8 });
    if (split) {
      intro.fromTo(split.chars, { yPercent: 120 }, { yPercent: 0, duration: 1.2, ease: "ease-x", stagger: 0.035 });
    }
    intro
      .fromTo(line, { scaleX: 0, opacity: 0.2 }, { scaleX: 1, opacity: 1, transformOrigin: "left", duration: 1.4, ease: "ease-x" }, "<")
      .fromTo(tags, { opacity: 0, xPercent: 20 }, { opacity: 1, xPercent: 0, duration: 1.4, ease: "expo.out", stagger: 0.05 }, "<+=.4")
      .fromTo(media, { clipPath: "inset(100% 0 0 0)", scale: 1.08 }, { clipPath: "inset(0% 0 0 0)", scale: 1, duration: 1.6, ease: "ease-inout-1" }, "<+=.1");

    return () => {
      split?.revert();
      intro.kill();
    };
  }, [project.slug]);

  return (
    <section ref={ref} className="section-post-banner">
      <div className="t-cr">
        <div className="t-box t-box-a">
          <h1 className="hg">{project.title}</h1>
          <div className="i-line" />
        </div>
        <div className="t-box t-box-b">
          <div className="container-studies">
            <div className="label-studies">FORM STUDY</div>
            {project.studies.map((study) => (
              <div className="t-tag" key={study}>{study}</div>
            ))}
          </div>
          <div className="container-roles">
            <div className="label-roles">ROLE</div>
            {project.roles.map((role) => (
              <div className="t-tag" key={role}>{role}</div>
            ))}
          </div>
        </div>
        <div className="t-box t-box-c">
          <div className="media-wrapper">
            <div className="media-overlay">
              <div className="media-overlay-placeholder--mask">
                <div className="media-overlay-placeholder--text">Visit Full Video</div>
              </div>
            </div>
            <a className="t-media-wrapper" href={project.heroVideo ?? project.image} target="_blank" rel="noreferrer">
              {project.heroVideo ? (
                <video className="t-media" src={project.heroVideo} loop muted playsInline autoPlay />
              ) : (
                <img className="t-media" src={project.image} alt="" />
              )}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectDetail({ project }: { project: JasmineProject }) {
  const ref = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const section = ref.current;
    if (!section) {
      return;
    }
    const { gsap } = ensureJasmineGsap();
    const dot = section.querySelector<HTMLElement>(".post-detail__tab-dot");
    const tabs = gsap.utils.toArray<HTMLElement>(".post-detail__tab", section);
    const bodies = gsap.utils.toArray<HTMLElement>(".post-detail__tab-body-item", section);
    const images = gsap.utils.toArray<HTMLElement>(".post-detail__media-image", section);

    tabs.forEach((tab, index) => tab.classList.toggle("is--active", index === active));
    bodies.forEach((body, index) => body.classList.toggle("is--active", index === active));
    images.forEach((image, index) => image.classList.toggle("is--active", index === active));

    const activeBody = bodies[active];
    const split = activeBody ? splitText(activeBody, { type: "lines", mask: "lines", linesClass: "u-inline-block o-line" }) : null;

    const tabHeight = tabs[active]?.getBoundingClientRect().height ?? 1;
    gsap.to(dot, { y: tabHeight * active + tabHeight / 2, duration: 0.8, ease: "ease.out" });
    gsap.to(tabs.filter((_, index) => index !== active), { opacity: 0.4, duration: 0.8, ease: "ease.out" });
    gsap.to(tabs[active], { opacity: 1, duration: 0.8, ease: "ease.out" });
    if (split) {
      gsap.fromTo(split.lines, { yPercent: 120 }, { yPercent: 0, duration: 1.1, stagger: { each: 0.11 }, ease: "ease-inout-1" });
    }
    images.forEach((image, index) => {
      const img = image.querySelector("img");
      gsap.to(image, {
        clipPath: index === active ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
        duration: 1.6,
        ease: "power4.out",
      });
      gsap.to(img, { scale: index === active ? 1 : 1.3, duration: 1.6, ease: "power4.out" });
    });

    return () => {
      split?.revert();
    };
  }, [active, project.slug]);

  return (
    <section ref={ref} className="section-post-detail">
      <div className="t-cr">
        <header className="t-box-a post-detail__meta">
          <div className="post-detail__heading">(PROJECT DETAIL)</div>
          <div className="post-info">
            <div className="post-info__item">
              <div className="post-info__item-background" />
              <div className="post-info__item-label">MEDIUM</div>
              <div className="post-info__item-value">collage, 2d, 3d, mixed media</div>
            </div>
            <div className="post-info__item">
              <div className="post-info__item-background" />
              <div className="post-info__item-label">TOOLS</div>
              <div className="post-info__item-value">ADOBE AFTER EFFECTS, ILLUSTRATOR, PHOTOSHOP</div>
            </div>
          </div>
        </header>
        <div className="t-box-b post-detail__body">
          <nav className="post-detail__tabs" aria-label="Project details">
            <div className="post-detail__tab-dot" />
            <ul className="post-detail__tab-list">
              {project.detailTabs.map((tab, index) => (
                <button className="post-detail__tab" type="button" onMouseEnter={() => setActive(index)} key={tab.label}>
                  {tab.label}
                </button>
              ))}
            </ul>
          </nav>
          <div className="post-detail__tab-body">
            <ul className="post-detail__tab-body-list">
              {project.detailTabs.map((tab) => (
                <li className="post-detail__tab-body-item" key={tab.label}>{tab.body}</li>
              ))}
            </ul>
          </div>
          <div className="post-detail__media-container">
            {project.detailTabs.map((tab) => (
              <picture className="post-detail__media-image" key={tab.label}>
                <img src={tab.image} alt="" />
              </picture>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectGallery({ project }: { project: JasmineProject }) {
  const ref = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const section = ref.current;
    if (!section) {
      return;
    }
    const { gsap } = ensureJasmineGsap();
    const tween = gsap.fromTo(
      section.children[0],
      { y: -section.clientWidth / 4 },
      {
        y: section.clientWidth / 4,
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
    <section ref={ref} className="section-post-gallery">
      <div className="t-cr">
        <div className="t-box t-box-a">
          <h2 className="hg">DESIGN</h2>
          <div className="i-line" />
        </div>
        <div className="t-box t-box-b">
          <div className="caption-1">(INFO)</div>
          <div className="t-body">Hand-painted human touch mixed with digital elements. The blend brought warmth, contrast, and a sense of home.</div>
          <div className="caption-2">SCROLL DOWN</div>
        </div>
        <div className="t-box t-box-c">
          <div className="container-media">
            {project.gallery.map((item, index) => (
              <div className="t-cr item-media" key={`${item.image}-${index}`}>
                <div className="t-box media-number">
                  <div className="media-number__current">{String(index + 1).padStart(2, "0")}</div>
                  <div className="media-number__total">{String(project.gallery.length).padStart(2, "0")}</div>
                </div>
                <div className="t-box wrapper-media-image">
                  <picture className="media-image">
                    <img src={item.image} alt="" />
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

function ProjectProcess({ project }: { project: JasmineProject }) {
  const ref = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const section = ref.current;
    if (!section) {
      return;
    }
    const { gsap } = ensureJasmineGsap();
    const track = section.querySelector<HTMLElement>(".container-media");
    const bodies = gsap.utils.toArray<HTMLElement>(".item-media-body", section);
    const tween = gsap.to(track, {
      xPercent: -45,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
    bodies.forEach((body, index) => {
      body.classList.toggle("is--active", index === active);
      gsap.to(body, { opacity: index === active ? 1 : 0, duration: 0.6, ease: "ease-inout-1" });
    });
    return () => {
      tween.kill();
    };
  }, [active]);

  return (
    <section ref={ref} className="section-post-process">
      <div className="t-cr">
        <div className="t-box t-box-a">
          <h2 className="hg">THE PROCESS</h2>
          <div className="sub-hg">BEHIND THE SCENES + AFTER THOUGHTS</div>
        </div>
        <div className="t-box t-box-b">
          <div className="wrapper-container-media--slider">
            <div className="container-media">
              {project.process.map((item, index) => (
                <div className="t-cr item-media" key={`${item.media}-${index}`} onMouseEnter={() => setActive(index)}>
                  <div className="t-box item-media__number">
                    <div className="item-media__number-current">{String(index + 1).padStart(2, "0")}</div>
                    <div className="item-media__number-total">{String(project.process.length).padStart(2, "0")}</div>
                  </div>
                  <div className="t-box wrapper-item-media__image">
                    {item.type === "video" ? (
                      <video className="item-media__image" src={item.media} loop muted playsInline autoPlay />
                    ) : (
                      <picture className="item-media__image">
                        <img src={item.media} alt="" />
                      </picture>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="t-box t-box-c">
          <div className="t-cr">
            <div className="t-box container-media-body">
              {project.process.map((item, index) => (
                <div className="item-media-body" key={`${item.body}-${index}`}>{item.body}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PostNext({ project }: { project: JasmineProject }) {
  const next = useMemo(() => curatedWorks.find((work) => work.slug === project.nextSlug) ?? curatedWorks[0], [project.nextSlug]);

  return (
    <section className="post-next">
      <div className="t-cr">
        <header className="t-box-a">
          <a href={`/works/${next.slug}`} className="label-section" data-transition-type="project" data-slug={next.slug}>SEE NEXT</a>
          <a href={`/works/${next.slug}`} className="title-section" data-transition-type="project" data-slug={next.slug}>{next.title}</a>
        </header>
        <div className="i-line" />
        <div className="t-box-b">
          <div className="t-cr">
            <a href={`/works/${next.slug}`} className="t-box media-project" data-transition-type="project" data-slug={next.slug}>
              <div className="media-project__number">
                <div className="media-project__number-current">{next.number}</div>
                <div className="media-project__number-total">{String(curatedWorks.length).padStart(2, "0")}</div>
                <div className="media-project__number-suffix">PROJECTS</div>
              </div>
              <picture className="t-box media-project__picture">
                <img className="media-project__image" src={next.image} alt={next.title} />
              </picture>
            </a>
            <div className="t-box navigation-section">
              <Link className="link-home" href="/">HOME</Link>
              <MagneticButton href={`/works/${next.slug}`} data-transition-type="project">VISIT</MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function JasmineProjectPage({ project }: { project: JasmineProject }) {
  return (
    <JasminePageShell>
      <ProjectBanner project={project} />
      <ProjectDetail project={project} />
      <ProjectGallery project={project} />
      <ProjectProcess project={project} />
      <PostNext project={project} />
    </JasminePageShell>
  );
}
