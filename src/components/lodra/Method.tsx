import { SectionLabel } from "./CornerMarks";

const steps = [
  { n: "01", title: "Kartlägg din drift", body: "Vi sätter oss med dig och dokumenterar varje steg — från första kontakt till slutfaktura." },
  { n: "02", title: "Bygger i AI-fart", body: "Skarpa prototyper på dagar, inte månader. Du ser systemet växa fram och styr riktningen." },
  { n: "03", title: "Driftsätt och äg det", body: "Vi lämnar över koden, kontona och kunskapen. Inga inlåsningar, ingen prenumerationsfälla." },
];

export function Method() {
  return (
    <section className="relative bg-graphite-2 hairline-t hairline-b">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-28 md:py-40">
        <div className="grid grid-cols-12 gap-6 mb-16">
          <div className="col-span-12 md:col-span-3">
            <SectionLabel>02 / Metod</SectionLabel>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2
              className="reveal font-display font-black text-concrete text-[clamp(2rem,4.5vw,4rem)] leading-[0.95]"
              style={{ letterSpacing: "-0.04em" }}
            >
              Så funkar det.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 hairline-t">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className={`reveal p-8 md:p-10 hairline-b ${i > 0 ? "md:hairline-l" : ""}`}
            >
              <div className="mono-label text-signal mb-10">{s.n}</div>
              <h3
                className="font-display font-extrabold text-concrete text-2xl md:text-3xl mb-4"
                style={{ letterSpacing: "-0.03em" }}
              >
                {s.title}
              </h3>
              <p className="text-concrete/70 leading-relaxed font-light">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}