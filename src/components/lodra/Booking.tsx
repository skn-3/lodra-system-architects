import { SectionLabel } from "./CornerMarks";
import { useState } from "react";

export function Booking() {
  const [sent, setSent] = useState(false);
  return (
    <section id="boka" className="relative bg-graphite hairline-b">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-28 md:py-40 grid grid-cols-12 gap-10">
        <div className="col-span-12 md:col-span-5">
          <SectionLabel>05 / Kontakt</SectionLabel>
          <h2
            className="reveal font-display font-black text-concrete text-[clamp(2.4rem,5.5vw,5rem)] leading-[0.9]"
            style={{ letterSpacing: "-0.04em" }}
          >
            Ta tjugo
            <br />
            minuter.
          </h2>
          <p className="reveal mt-8 text-concrete/70 max-w-md font-light leading-relaxed">
            Berätta var ni tappar tid idag. Vi säger rakt ut om vi kan bygga något
            som faktiskt löser det — eller om någon annan passar bättre.
          </p>
          <a
            href="#"
            className="reveal mt-12 inline-flex items-center gap-4 px-8 py-5 bg-signal text-graphite font-mono uppercase text-xs hover:bg-concrete transition-colors"
            style={{ letterSpacing: "0.22em" }}
          >
            Boka ett möte
            <span aria-hidden>→</span>
          </a>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="reveal col-span-12 md:col-span-7 md:col-start-6 hairline-t hairline-b md:hairline-l p-8 md:p-12 flex flex-col gap-8"
        >
          {[
            { id: "namn", label: "Namn", type: "text" },
            { id: "foretag", label: "Företag", type: "text" },
            { id: "epost", label: "E-post", type: "email" },
          ].map((f) => (
            <label key={f.id} className="flex flex-col gap-2">
              <span className="mono-label">{f.label}</span>
              <input
                type={f.type}
                required
                className="bg-transparent border-0 hairline-b py-3 text-concrete font-sans text-lg focus:outline-none placeholder:text-steel/50"
                placeholder="—"
              />
            </label>
          ))}
          <label className="flex flex-col gap-2">
            <span className="mono-label">Meddelande</span>
            <textarea
              rows={4}
              className="bg-transparent border-0 hairline-b py-3 text-concrete font-sans text-lg resize-none focus:outline-none placeholder:text-steel/50"
              placeholder="—"
            />
          </label>
          <button
            type="submit"
            className="self-start mt-4 px-8 py-4 hairline-t hairline-b hairline-l hairline-r text-concrete font-mono uppercase text-xs hover:bg-concrete hover:text-graphite transition-colors"
            style={{ letterSpacing: "0.22em" }}
          >
            {sent ? "Skickat ✓" : "Skicka förfrågan"}
          </button>
        </form>
      </div>
    </section>
  );
}