import { useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HERO, createSequence, type Sequence } from "./heroFrames";

gsap.registerPlugin(ScrollTrigger);

function isMobile(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia(`(max-width:${HERO.mobileMaxWidth}px)`).matches
  );
}

function chooseSet() {
  return isMobile() ? HERO.mobile : HERO.desktop;
}

// Skip the scrub and show a single still on weak devices / data-saver / reduced-motion.
function lowCapability(): boolean {
  if (typeof window === "undefined") return true;
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
    deviceMemory?: number;
  };
  const c = nav.connection ?? {};
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const slow = /(^|-)2g$/.test(c.effectiveType ?? "");
  const lowMem = (nav.deviceMemory ?? 8) <= 4 && isMobile();
  return reduce || Boolean(c.saveData) || slow || lowMem;
}

export function HeroScrub() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Starts false so server + first client render match (no hydration mismatch); adjusted on mount.
  const [staticMode, setStaticMode] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const lowCap = lowCapability();
    setStaticMode(lowCap);

    const set = chooseSet();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let progress = lowCap ? 1 : 0;
    let seq: Sequence | null = null;
    let st: ScrollTrigger | null = null;
    let poster: HTMLImageElement | null = null;

    function drawPoster() {
      if (!poster || !ctx) return;
      const s = Math.max(canvas.width / poster.width, canvas.height / poster.height);
      const w = poster.width * s;
      const h = poster.height * s;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(poster, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
    }

    function resize() {
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      if (seq) seq.draw(ctx, progress);
      else drawPoster();
    }

    window.addEventListener("resize", resize);

    if (lowCap) {
      poster = new Image();
      poster.onload = () => resize();
      poster.src = set.poster;
      resize();
      return () => window.removeEventListener("resize", resize);
    }

    seq = createSequence(set, () => {
      if (seq) seq.draw(ctx, progress);
    });
    resize();
    void seq.preload();

    st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        progress = self.progress;
        seq?.draw(ctx, progress);
        section.style.setProperty("--p", progress.toFixed(4));
      },
    });

    return () => {
      window.removeEventListener("resize", resize);
      st?.kill();
      seq?.destroy();
    };
  }, []);

  const sectionStyle = {
    height: staticMode ? "100dvh" : `${HERO.scrollLengthVh}vh`,
    "--p": staticMode ? 1 : 0,
  } as unknown as CSSProperties;

  const wordmarkStyle: CSSProperties = {
    letterSpacing: "-0.04em",
    opacity: "calc((var(--p, 0) - 0.6) * 4)",
    transform: "translateY(calc((1 - var(--p, 0)) * 24px))",
  };
  const taglineStyle: CSSProperties = {
    letterSpacing: "0.28em",
    opacity: "calc((var(--p, 0) - 0.8) * 5)",
  };
  const cueStyle: CSSProperties = { opacity: "calc(1 - var(--p, 0) * 10)" };

  return (
    <section ref={sectionRef} className="relative w-full bg-graphite" style={sectionStyle}>
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full bg-graphite"
        />
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end px-6 pb-[12vh] text-center md:px-10">
          <h1
            className="m-0 font-display font-black leading-[0.9] text-concrete text-[clamp(3rem,12vw,9rem)]"
            style={wordmarkStyle}
          >
            LODRA
          </h1>
          <p
            className="mt-3 font-mono uppercase text-signal text-[12px]"
            style={taglineStyle}
          >
            Verksamheten i lod.
          </p>
        </div>
        <div
          className="absolute bottom-[3vh] left-1/2 -translate-x-1/2 font-mono uppercase text-steel text-[12px]"
          style={cueStyle}
          aria-hidden="true"
        >
          Scrolla
        </div>
      </div>
    </section>
  );
}
