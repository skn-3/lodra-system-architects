import { SectionLabel } from "./CornerMarks";

const cases = [
  {
    tag: "CRM / PIPELINE",
    name: "CaseFlow",
    client: "Fönstermontör · Stockholm",
    body: "Komplett pipeline för besök, hit-rate, A-order och fakturering. Säljarna ser sin egen statistik i realtid, ledningen ser verksamheten.",
    metric: "—42% adminarbete",
  },
  {
    tag: "BOKNING / ADMIN / WEBB",
    name: "Grana",
    client: "Städbolag · Mälardalen",
    body: "Bokningssystem för slutkund, adminpanel för planering och en helt ny varumärkesplattform. Allt byggt från grunden, allt deras eget.",
    metric: "3 system · 1 leverans",
  },
];

export function Cases() {
  return (
    <section className="relative bg-graphite hairline-b">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-28 md:py-40">
        <div className="grid grid-cols-12 gap-6 mb-16">
          <div className="col-span-12 md:col-span-3">
            <SectionLabel>03 / Byggt</SectionLabel>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2
              className="reveal font-display font-black text-concrete text-[clamp(2rem,4.5vw,4rem)] leading-[0.95]"
              style={{ letterSpacing: "-0.04em" }}
            >
              Senast ur verkstan.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 hairline-t hairline-l">
          {cases.map((c) => (
            <article key={c.name} className="reveal hairline-r hairline-b p-10 md:p-14 group">
              <div className="flex items-center justify-between mb-12">
                <span className="mono-label">{c.tag}</span>
                <span className="mono-label text-signal">●</span>
              </div>
              <h3
                className="font-display font-black text-concrete text-5xl md:text-7xl mb-3"
                style={{ letterSpacing: "-0.04em" }}
              >
                {c.name}
              </h3>
              <div className="mono-label mb-8">{c.client}</div>
              <p className="text-concrete/75 text-lg leading-relaxed font-light max-w-md">
                {c.body}
              </p>
              <div className="mt-12 pt-6 hairline-t flex justify-between items-baseline">
                <span className="mono-label">Resultat</span>
                <span className="font-display font-bold text-timber text-xl">{c.metric}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}