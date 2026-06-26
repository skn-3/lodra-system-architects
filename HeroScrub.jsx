import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HERO } from './heroConfig';
import { createSequence } from './sequence';
import './hero.css';

gsap.registerPlugin(ScrollTrigger);

function isMobile() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(`(max-width:${HERO.mobileMaxWidth}px)`).matches;
}

function pickSet() {
  return isMobile() ? HERO.mobile : HERO.desktop;
}

// Decide whether to skip the scrub and show a single beautiful still instead.
function lowCapability() {
  if (typeof window === 'undefined') return true;
  const c = navigator.connection || {};
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = !!c.saveData;
  const slow = /(^|-)2g$/.test(c.effectiveType || '');
  const lowMem = (navigator.deviceMemory || 8) <= 4 && isMobile();
  return reduce || saveData || slow || lowMem;
}

export default function HeroScrub() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const [staticMode] = useState(() => lowCapability());

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return undefined;

    const ctx = canvas.getContext('2d');
    const set = pickSet();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let seq = null;
    let st = null;
    let progress = staticMode ? 1 : 0;

    function resize() {
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      if (seq) seq.draw(ctx, progress);
    }

    // Low-power path: draw the poster once, no scroll listeners.
    if (staticMode) {
      const img = new Image();
      img.onload = () => {
        resize();
        const s = Math.max(canvas.width / img.width, canvas.height / img.height);
        const w = img.width * s;
        const h = img.height * s;
        ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
      };
      img.src = set.poster;
      window.addEventListener('resize', resize);
      return () => window.removeEventListener('resize', resize);
    }

    // Full scrub path.
    seq = createSequence(set);
    resize();
    window.addEventListener('resize', resize);
    seq.preload();

    st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        progress = self.progress;
        seq.draw(ctx, progress);
        section.style.setProperty('--p', progress.toFixed(4));
      },
    });

    return () => {
      window.removeEventListener('resize', resize);
      if (st) st.kill();
      if (seq) seq.destroy();
    };
  }, [staticMode]);

  return (
    <section
      ref={sectionRef}
      className="lodra-hero"
      style={{
        height: staticMode ? '100dvh' : `${HERO.scrollLengthVh}vh`,
        // CSS custom prop drives the overlay reveal; 1 = fully shown (static mode).
        '--p': staticMode ? 1 : 0,
      }}
    >
      <div className="lodra-hero__sticky">
        <canvas ref={canvasRef} className="lodra-hero__canvas" aria-hidden="true" />
        <div className="lodra-hero__overlay">
          <h1 className="lodra-hero__wordmark">LODRA</h1>
          <p className="lodra-hero__tagline">Verksamheten i lod.</p>
        </div>
        <div className="lodra-hero__cue" aria-hidden="true">scrolla</div>
      </div>
    </section>
  );
}
