import type { ReactNode } from "react";

export function CornerMarks({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <span className="absolute -top-2 -left-2 text-steel font-mono text-[10px] select-none">+</span>
      <span className="absolute -top-2 -right-2 text-steel font-mono text-[10px] select-none">+</span>
      <span className="absolute -bottom-2 -left-2 text-steel font-mono text-[10px] select-none">+</span>
      <span className="absolute -bottom-2 -right-2 text-steel font-mono text-[10px] select-none">+</span>
      {children}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <div className="mono-label mb-8 reveal">{children}</div>;
}