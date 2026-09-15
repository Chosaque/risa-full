"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import styles from "./CurtainEntrance.module.css";

export function CurtainEntrance({ children, locale }: { children: ReactNode; locale: string }) {
  const pathname = usePathname();
  const home = pathname.replace(/\/$/, "") === `/${locale}`;
  const stage = useRef<HTMLElement>(null);
  const navigation = useRef<HTMLDivElement>(null);
  const logo = useRef<HTMLImageElement>(null);
  const th = locale === "th";

  useEffect(() => {
    if (!home || !stage.current || !navigation.current) return;
    const scene = stage.current;
    const nav = navigation.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const paint = () => {
      frame = 0;
      const bounds = scene.getBoundingClientRect();
      const viewport = scene.firstElementChild?.clientHeight || window.innerHeight;
      const distance = Math.max(1, scene.offsetHeight - viewport);
      const p = motion.matches ? 1 : Math.min(1, Math.max(0, -bounds.top / distance));
      const eased = p * p * (3 - 2 * p);
      scene.style.setProperty("--open", String(eased));
      const visible = p >= 0.96 || motion.matches;
      scene.dataset.open = String(visible);
      const backdrop = scene.querySelector<HTMLElement>("[data-backdrop]");
      if (backdrop) backdrop.inert = !visible;
      nav.dataset.visible = String(visible);
      nav.inert = !visible;
      nav.setAttribute("aria-hidden", String(!visible));
      const destination = nav.querySelector("img")?.getBoundingClientRect();
      if (logo.current && destination) {
        const width = Math.min(window.innerWidth * 0.78, 860);
        const startX = (window.innerWidth - width) / 2;
        const startY = viewport * 0.4 - width * (368 / 1280) / 2;
        logo.current.style.width = `${width + (destination.width - width) * eased}px`;
        logo.current.style.left = `${startX + (destination.left - startX) * eased}px`;
        logo.current.style.top = `${startY + (destination.top - startY) * eased}px`;
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    motion.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      motion.removeEventListener("change", schedule);
      nav.inert = false;
      nav.removeAttribute("aria-hidden");
    };
  }, [home, pathname]);

  function reveal() {
    if (!stage.current) return;
    const viewport = stage.current.firstElementChild?.clientHeight || window.innerHeight;
    window.scrollTo({ top: window.scrollY + stage.current.getBoundingClientRect().top + stage.current.offsetHeight - viewport,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  return <>
    <div ref={navigation} className={home ? styles.homeNav : styles.normalNav} data-visible={home ? undefined : "true"}>
      {children}
    </div>
    {home && <section ref={stage} className={styles.stage} aria-label={th ? "ยินดีต้อนรับสู่ RISA" : "Welcome to RISA"}>
      <div className={styles.scene}>
        <div className={styles.backdrop} data-backdrop>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/msic-2026/student-presentation.jpg" alt="" fetchPriority="high" />
          <div className={styles.caption}>
            <p>RESEARCH · INDUSTRY · STANDARDS</p>
            <h1>{th ? <>เชื่อมงานวิจัย<br />สู่อนาคตอุตสาหกรรม</> : <>Connecting research.<br />Advancing industry.</>}</h1>
            <a href="#main">{th ? "สำรวจ RISA" : "Explore RISA"} <span aria-hidden>↓</span></a>
          </div>
        </div>
        <div className={`${styles.panel} ${styles.left}`} aria-hidden />
        <div className={`${styles.panel} ${styles.right}`} aria-hidden />
        {/* Use the existing transparent official logo lockup, not a reconstructed wordmark. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={logo} className={styles.logo} src="/risa-lockup.png" alt="RISA — Research and Industry Standards Advancement Association" fetchPriority="high" />
        <div className={styles.invitation}>
          <p>{th ? "งานวิจัย · อุตสาหกรรม · มาตรฐาน" : "RESEARCH · INDUSTRY · STANDARDS"}</p>
          <button type="button" onClick={reveal}>{th ? "เลื่อนเพื่อเปิด" : "SCROLL TO OPEN"}<span aria-hidden>↓</span></button>
        </div>
        <button className={styles.skip} type="button" onClick={reveal}>{th ? "ข้ามบทนำ" : "Skip intro"}</button>
      </div>
    </section>}
    <noscript><style>{`.${styles.homeNav}{opacity:1!important;visibility:visible!important;position:sticky!important}.${styles.stage}{display:none!important}`}</style></noscript>
  </>;
}
