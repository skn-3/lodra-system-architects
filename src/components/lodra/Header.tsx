import type { CSSProperties } from "react";

function Mark({ style }: { style?: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 96 128"
      className="h-7 w-auto"
      style={style}
      fill="none"
      aria-hidden="true"
    >
      <rect x="14" y="14" width="68" height="9" rx="1.5" fill="#EDE8E0" />
      <rect x="45.5" y="23" width="5" height="4" fill="#8A847A" />
      <line x1="48" y1="27" x2="48" y2="91" stroke="#8A847A" strokeWidth="2.5" />
      <path
        d="M39 91 L57 91 Q59 91 59 93.5 L59 101 L48 122 L37 101 L37 93.5 Q37 91 39 91 Z"
        fill="#F2541B"
      />
    </svg>
  );
}

export function Header() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full">
      {/* subtle scrim so the nav stays legible over bright hero frames */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-graphite/70 to-transparent" />
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
        <a href="#" className="flex items-center gap-2.5" aria-label="Lodra">
          <Mark />
          <span className="font-display text-xl font-black uppercase tracking-[-0.04em] text-concrete">
            Lodra
          </span>
        </a>
        <a
          href="#boka"
          className="border border-steel/40 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.15em] text-concrete transition-colors hover:border-signal hover:text-signal"
        >
          Boka
        </a>
      </div>
    </header>
  );
}
