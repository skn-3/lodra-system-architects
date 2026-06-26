import { SectionLabel } from "./CornerMarks";

export function Problem() {
  return (
    <section className="relative bg-graphite hairline-t">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-28 md:py-40 grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-3">
          <SectionLabel>01 / Driften</SectionLabel>
        </div>
        <div className="col-span-12 md:col-span-9">
          <h2
            className="reveal font-display font-black text-concrete text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.92]"
            style={{ letterSpacing: "-0.04em" }}
          >
            Du bygger husen.
            <br />
            <span className="text-steel">Vi bygger systemen.</span>
          </h2>
          <p className="reveal mt-10 max-w-2xl text-concrete/80 text-lg md:text-xl leading-relaxed font-light">
            Små byggföretag drunknar i kalkylark, lösa papper och information som
            försvinner i telefonsamtal. Vi bygger skräddarsydda system som håller
            offerter, order, fakturering och kunder på ett ställe — exakt
            anpassat efter hur ni faktiskt jobbar.
          </p>
        </div>
      </div>
    </section>
  );
}