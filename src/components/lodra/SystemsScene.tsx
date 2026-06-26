import { useEffect, useRef } from "react";

export function SystemsScene() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const deskRef = useRef<HTMLVideoElement | null>(null);
  const mobRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const vids = [deskRef.current, mobRef.current].filter(Boolean) as HTMLVideoElement[];

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          for (const v of vids) {
            // offsetParent is null when the element is display:none (hidden breakpoint)
            if (v.offsetParent !== null) {
              try {
                v.currentTime = 0;
                void v.play();
              } catch {
                /* autoplay guard */
              }
            }
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-graphite"
    >
      {/* desktop: landscape */}
      <video
        ref={deskRef}
        className="absolute inset-0 hidden h-full w-full object-cover md:block"
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src="/lodra-systems.mp4" type="video/mp4" />
      </video>

      {/* mobile: portrait */}
      <video
        ref={mobRef}
        className="absolute inset-0 h-full w-full object-cover md:hidden"
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src="/lodra-systems-mobile.mp4" type="video/mp4" />
      </video>

      {/* legibility scrim — clear in the middle, grounded at the bottom */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-graphite via-transparent to-graphite/30" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-[14vh] md:px-10">
        <div className="mb-5 font-mono text-[12px] uppercase tracking-[0.25em] text-signal">
          Den digitala sidan
        </div>
        <h2
          className="font-display text-[clamp(2.4rem,7vw,6rem)] font-black leading-[0.9] text-concrete"
          style={{ letterSpacing: "-0.04em" }}
        >
          Hela driften.
          <br />
          <span className="text-steel">Ett system.</span>
        </h2>
        <p className="mt-8 max-w-xl text-lg font-light leading-relaxed text-concrete/75">
          Offert, pipeline, order och fakturering — i ett flöde som rör sig i
          samma takt som verksamheten.
        </p>
      </div>
    </section>
  );
}
