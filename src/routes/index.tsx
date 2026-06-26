import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/lodra/Hero";
import { Problem } from "@/components/lodra/Problem";
import { Method } from "@/components/lodra/Method";
import { Cases } from "@/components/lodra/Cases";
import { Services } from "@/components/lodra/Services";
import { Booking } from "@/components/lodra/Booking";
import { Footer } from "@/components/lodra/Footer";
import { useScrollReveal } from "@/components/lodra/useScrollReveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lodra — Skräddarsydda system, hemsidor och appar" },
      { name: "description", content: "Lodra är en studio som bygger skräddarsydda system, hemsidor och appar åt små företag. Hantverk i kod, byggt för att äga." },
      { property: "og:title", content: "Lodra — Verksamheten i lod." },
      { property: "og:description", content: "Studio för skräddarsydda system, hemsidor och appar. Stockholm." },
    ],
  }),
  component: Index,
});

function Index() {
  useScrollReveal();
  return (
    <main className="bg-graphite text-concrete min-h-screen overflow-x-hidden">
      <Hero />
      <Problem />
      <Method />
      <Cases />
      <Services />
      <Booking />
      <Footer />
    </main>
  );
}
