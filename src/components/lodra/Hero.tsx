export function Hero() {
  return (
    <section className="relative w-full h-[100dvh] bg-graphite overflow-hidden flex flex-col">
      <div className="absolute inset-0 blueprint-grid opacity-60" />
      <div className="absolute inset-0 pointer-events-none">
        <span className="absolute top-6 left-6 text-steel font-mono text-[10px]">+</span>
        <span className="absolute top-6 right-6 text-steel font-mono text-[10px]">+</span>
        <span className="absolute bottom-6 left-6 text-steel font-mono text-[10px]">+</span>
        <span className="absolute bottom-6 right-6 text-steel font-mono text-[10px]">+</span>
      </div>

      <div className="relative z-10 flex items-center justify-between px-6 md:px-10 pt-6">
        <div className="mono-label">LODRA / STUDIO</div>
        <div className="mono-label">N 59.33° · E 18.07°</div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1
          className="font-display font-black text-concrete leading-[0.82] text-[clamp(5rem,22vw,22rem)]"
          style={{ letterSpacing: "-0.04em" }}
        >
          LODRA
        </h1>
        <div
          className="mt-6 font-mono uppercase text-signal"
          style={{ letterSpacing: "0.28em", fontSize: "12px" }}
        >
          Verksamheten i lod.
        </div>
      </div>

      <div className="relative z-10 flex items-end justify-between px-6 md:px-10 pb-8">
        <div className="mono-label">© 2026</div>
        <div className="flex flex-col items-center gap-3 mono-label">
          <span>Scrolla</span>
          <span className="block w-px h-10 bg-steel/60" />
        </div>
        <div className="mono-label">STHLM / SE</div>
      </div>
    </section>
  );
}