import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export function useScrollReveal() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let lenis: Lenis | undefined;
    let rafId = 0;
    if (!reduce) {
      lenis = new Lenis({ duration: 1.1, smoothWheel: true });
      const raf = (time: number) => {
        lenis!.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    }

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".reveal");
      items.forEach((el) => {
        if (reduce) {
          gsap.set(el, { opacity: 1, y: 0 });
          return;
        }
        gsap.fromTo(
          el,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    });

    return () => {
      ctx.revert();
      if (lenis) {
        cancelAnimationFrame(rafId);
        lenis.destroy();
      }
      ScrollTrigger.getAll().forEach((s) => s.kill());
    };
  }, []);
}