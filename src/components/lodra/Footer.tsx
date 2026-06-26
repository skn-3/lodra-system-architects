export function Footer() {
  return (
    <footer className="relative bg-graphite">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-20">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-6">
            <div
              className="font-display font-black text-concrete text-[clamp(4rem,12vw,10rem)] leading-none"
              style={{ letterSpacing: "-0.05em" }}
            >
              LODRA
            </div>
          </div>
          <div className="col-span-6 md:col-span-3 md:col-start-8 flex flex-col gap-2">
            <div className="mono-label">Kontakt</div>
            <a href="mailto:hej@lodra.se" className="text-concrete hover:text-signal transition-colors">hej@lodra.se</a>
            <a href="tel:+46000000000" className="text-concrete hover:text-signal transition-colors">+46 (0)8 — 000 00 00</a>
          </div>
          <div className="col-span-6 md:col-span-2 flex flex-col gap-2">
            <div className="mono-label">Studio</div>
            <span className="text-concrete">Folkungagatan</span>
            <span className="text-concrete">116 30 Stockholm</span>
          </div>
        </div>

        <div className="mt-20 pt-6 hairline-t flex flex-wrap justify-between gap-4">
          <div className="mono-label">LODRA · STUDIO · STOCKHOLM · ©2026</div>
          <div className="mono-label">Allt arbete utfört i lod</div>
        </div>
      </div>
    </footer>
  );
}