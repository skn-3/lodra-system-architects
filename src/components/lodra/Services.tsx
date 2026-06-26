import { SectionLabel } from "./CornerMarks";

const services = [
  { n: "A", title: "Interna system", body: "Skräddarsydd mjukvara för era processer. CRM, planering, lager, ekonomi — sammansatt som ni faktiskt jobbar." },
  { n: "B", title: "Hemsidor", body: "Snabba, distinkta sajter som ser ut som hantverk, inte mall. SEO och prestanda från första raden kod." },
  { n: "C", title: "Appar", body: "Webb- och mobilappar för kunder, fältarbete eller interna verktyg. Byggt för att hålla i tio år." },
];

export function Services() {
  return (
    <section className="relative bg-graphite-2 hairline-b">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-28 md:py-40">
        <div className="grid grid-cols-12 gap-6 mb-16">
          <div className="col-span-12 md:col-span-3">
            <SectionLabel>04 / Vad vi gör</SectionLabel>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2
              className="reveal font-display font-black text-concrete text-[clamp(2rem,4.5vw,4rem)] leading-[0.95]"
              style={{ letterSpacing: "-0.04em" }}
            >
              Tre verktyg.
              <br />
              <span className="text-steel">Samma hantverk.</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 hairline-t">
          {services.map((s, i) => (
            <div key={s.n} className={`reveal p-8 md:p-10 hairline-b flex flex-col ${i > 0 ? "md:hairline-l" : ""}`}>
              <div className="flex items-center justify-between mb-12">
                <span className="font-display font-black text-signal text-5xl">{s.n}</span>
                <span className="mono-label">Tjänst</span>
              </div>
              <h3
                className="font-display font-extrabold text-concrete text-2xl md:text-3xl mb-4"
                style={{ letterSpacing: "-0.03em" }}
              >
                {s.title}
              </h3>
              <p className="text-concrete/70 leading-relaxed font-light mb-10 flex-1">{s.body}</p>
              <div className="mono-label pt-6 hairline-t">Från offert</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}