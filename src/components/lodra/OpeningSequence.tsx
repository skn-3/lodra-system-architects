import { useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HERO, createSequence, framePath, type Sequence } from "./heroFrames";

gsap.registerPlugin(ScrollTrigger);

// How long the whole opening stays pinned (desktop). Higher = slower, more deliberate scrub.
const DESKTOP_VH = 560;
const MOBILE_VH = 340;

// Scroll-progress map for the two halves of the film.
// Steel frames play 0 → STEEL_END, the cross-fade runs FADE_A → FADE_B,
// and the digital video scrubs DIGITAL_START → 1.
const STEEL_END = 0.42;
const FADE_A = 0.42;
const FADE_B = 0.5;
const DIGITAL_START = 0.46;

function isMobile(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia(`(max-width:${HERO.mobileMaxWidth}px)`).matches
  );
}

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

type Mode = "desktop" | "mobile" | "static";

export function OpeningSequence() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const deskRef = useRef<HTMLVideoElement | null>(null);
  const mobRef = useRef<HTMLVideoElement | null>(null);
  const [mode, setMode] = useState<Mode>("desktop");

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const lowCap = lowCapability();
    const mobile = isMobile();
    const nextMode: Mode = lowCap ? "static" : mobile ? "mobile" : "desktop";
    setMode(nextMode);

    const set = mobile ? HERO.mobile : HERO.desktop;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let p = 0;
    let seq: Sequence | null = null;
    let st: ScrollTrigger | null = null;
    let still: HTMLImageElement | null = null;

    const steelProgress = (prog: number) =>
      Math.max(0, Math.min(1, prog / STEEL_END));

    function drawStill() {
      if (!still || !ctx) return;
      const s = Math.max(canvas.width / still.width, canvas.height / still.height);
      const w = still.width * s;
      const h = still.height * s;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(still, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
    }

    function resize() {
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      if (seq) seq.draw(ctx, steelProgress(p));
      else drawStill();
    }

    window.addEventListener("resize", resize);

    // Reduced motion / weak device: one built-up steel still + the LODRA lockup.
    if (lowCap) {
      still = new Image();
      still.onload = () => resize();
      still.src = framePath(set, Math.round(set.count * 0.66));
      section.style.setProperty("--p", "0.15");
      resize();
      return () => window.removeEventListener("resize", resize);
    }

    seq = createSequence(set, () => {
      if (seq) seq.draw(ctx, steelProgress(p));
    });
    resize();
    void seq.preload();

    const deskVid = deskRef.current;
    const mobVid = mobRef.current;
    if (!mobile && deskVid) {
      deskVid.preload = "auto";
      deskVid.load();
    }
    let played = false;

    st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        p = self.progress;
        section.style.setProperty("--p", p.toFixed(4));
        seq?.draw(ctx, steelProgress(p));

        if (!mobile && deskVid) {
          const d = deskVid.duration;
          if (d && Number.isFinite(d)) {
            const dp = Math.max(0, Math.min(1, (p - DIGITAL_START) / (1 - DIGITAL_START)));
            deskVid.currentTime = dp * d;
          }
        } else if (mobile && mobVid) {
          if (p >= FADE_A && !played) {
            played = true;
            try {
              mobVid.currentTime = 0;
              void mobVid.play();
            } catch {
              /* autoplay guard */
            }
          } else if (p < FADE_A - 0.02 && played) {
            played = false;
            try {
              mobVid.pause();
              mobVid.currentTime = 0;
            } catch {
              /* noop */
            }
          }
        }
      },
    });

    return () => {
      window.removeEventListener("resize", resize);
      st?.kill();
      seq?.destroy();
    };
  }, []);

  const sectionStyle = {
    height:
      mode === "static" ? "100dvh" : mode === "mobile" ? `${MOBILE_VH}vh` : `${DESKTOP_VH}vh`,
    "--p": mode === "static" ? 0.15 : 0,
  } as unknown as CSSProperties;

  // Steel canvas fades out as the digital video fades in.
  const steelStyle: CSSProperties = { opacity: "calc((0.50 - var(--p, 0)) * 12.5)" };
  const videoStyle: CSSProperties = { opacity: "calc((var(--p, 0) - 0.42) * 12.5)" };

  // Text beats — trapezoid fades via min() of a rising and falling ramp (browser clamps 0–1).
  const beatBrand: CSSProperties = {
    opacity: "min(calc((var(--p, 0) - 0.05) * 14.3), calc((0.31 - var(--p, 0)) * 14.3))",
  };
  const beatHouses: CSSProperties = {
    opacity: "min(calc((var(--p, 0) - 0.30) * 14.3), calc((0.49 - var(--p, 0)) * 14.3))",
  };
  const beatSystems: CSSProperties = {
    opacity: "min(calc((var(--p, 0) - 0.54) * 14.3), calc((0.75 - var(--p, 0)) * 14.3))",
  };
  const beatPayoff: CSSProperties = { opacity: "calc((var(--p, 0) - 0.82) * 12.5)" };
  const cueStyle: CSSProperties = { opacity: "calc(1 - var(--p, 0) * 12)" };

  return (
    <section ref={sectionRef} className="relative w-full bg-graphite" style={sectionStyle}>
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        {/* steel — frame scrub on canvas */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full bg-graphite"
          style={steelStyle}
        />

        {/* digital — landscape (desktop, scrubbed) */}
        <video
          ref={deskRef}
          className="absolute inset-0 hidden h-full w-full object-cover md:block"
          style={videoStyle}
          muted
          playsInline
          preload="none"
          aria-hidden="true"
        >
          <source src="/lodra-systems.mp4" type="video/mp4" />
        </video>

        {/* digital — portrait (mobile, plays on reveal) */}
        <video
          ref={mobRef}
          className="absolute inset-0 h-full w-full object-cover md:hidden"
          style={videoStyle}
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/lodra-systems-mobile.mp4" type="video/mp4" />
        </video>

        {/* legibility scrim */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-graphite via-graphite/5 to-graphite/25" />

        {/* choreographed text — all beats share the same bottom-anchored focal zone */}
        <div className="pointer-events-none absolute inset-0 flex items-end justify-center px-6 pb-[14vh] text-center md:px-10">
          <div className="relative w-full max-w-5xl">
            {/* Beat 1 — brand lockup */}
            <div className="absolute inset-x-0 bottom-0" style={beatBrand}>
              <h1
                className="m-0 font-display font-black leading-[0.9] text-concrete text-[clamp(3rem,12vw,9rem)]"
                style={{ letterSpacing: "-0.04em" }}
              >
                LODRA
              </h1>
              <p className="mt-3 font-mono text-[12px] uppercase tracking-[0.28em] text-signal">
                Verksamheten i lod.
              </p>
            </div>

            {/* Beat 2 — the physical */}
            <div className="absolute inset-x-0 bottom-0" style={beatHouses}>
              <h2
                className="m-0 font-display font-black leading-[0.92] text-concrete text-[clamp(2.4rem,8vw,6rem)]"
                style={{ letterSpacing: "-0.04em" }}
              >
                Du bygger husen.
              </h2>
            </div>

            {/* Beat 3 — the turn */}
            <div className="absolute inset-x-0 bottom-0" style={beatSystems}>
              <h2
                className="m-0 font-display font-black leading-[0.92] text-concrete text-[clamp(2.4rem,8vw,6rem)]"
                style={{ letterSpacing: "-0.04em" }}
              >
                Vi bygger systemen.
              </h2>
            </div>

            {/* Beat 4 — the payoff */}
            <div className="absolute inset-x-0 bottom-0" style={beatPayoff}>
              <div className="mb-4 font-mono text-[12px] uppercase tracking-[0.25em] text-signal">
                Den digitala sidan
              </div>
              <h2
                className="m-0 font-display font-black leading-[0.92] text-concrete text-[clamp(2.4rem,8vw,6rem)]"
                style={{ letterSpacing: "-0.04em" }}
              >
                Hela driften.
                <br />
                <span className="text-steel">Ett system.</span>
              </h2>
            </div>
          </div>
        </div>

        {/* scroll cue */}
        <div
          className="absolute bottom-[3vh] left-1/2 -translate-x-1/2 font-mono text-[12px] uppercase tracking-[0.2em] text-steel"
          style={cueStyle}
          aria-hidden="true"
        >
          Scrolla
        </div>
      </div>
    </section>
  );
}
