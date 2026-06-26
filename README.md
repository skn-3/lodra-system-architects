# Lodra — hero island (drop-in) 

The cinematic scroll-scrub hero for the Lodra site. It's a self-contained "island": a pinned
section that plays a pre-rendered frame sequence as you scroll (the Apple approach), with a
separate portrait set for phones and a static-still fallback for low-power devices.

It is **2D canvas only** (no WebGL), so it looks identical on a flagship iPhone and a 3-year-old
Android — no GPU lottery. That's why this route is the mobile-safe one.

---

## 1. Install dependencies

```bash
npm i lenis gsap
```

## 2. Make the frames

Download the two imagine.art clips (landscape + portrait), then:

```bash
chmod +x scripts/extract-frames.sh
./scripts/extract-frames.sh path/to/landscape.mp4 path/to/portrait.mp4
```

This writes the WebP sequences into `public/frames/desktop` and `public/frames/mobile` plus a
`poster.webp` in each. The script prints the final frame counts — paste those into
`src/hero/heroConfig.js` (`desktop.count` / `mobile.count`) so the scrub maps 1:1.

## 3. Add the files to your project

Copy the `src/hero/` folder and the `public/frames/` folder into your repo. Then mount the hero
at the very top of your landing page, and start smooth scroll once at app root:

```jsx
// App / root layout
import { useEffect } from 'react';
import { initSmoothScroll } from './hero/smoothScroll';

useEffect(() => { initSmoothScroll(); }, []);
```

```jsx
// Landing page
import HeroScrub from './hero/HeroScrub';

<HeroScrub />
{/* ...the rest of the sections below... */}
```

## 4. Push to Lovable

If your Lovable project is connected to GitHub (Settings → GitHub), just add these files to the
synced `main` branch — upload them in the GitHub web UI or push them, and Lovable pulls them in.

**Guardrail — keep Lovable's AI out of the hero.** Add this to the project's Knowledge/instructions
in Lovable, and leave the comment in the files:

> Do not modify anything under `src/hero/`. It is a hand-built canvas animation. Edit copy and
> sections elsewhere only.

That prevents the AI from refactoring the scrub when you ask it for unrelated changes. If a merge
conflict ever appears, resolve it in GitHub (don't edit the hero in Lovable while a conflict is open).

## 5. Deploy

Standard Vite/React build — deploys as-is to Vercel or Netlify. (Lovable can also publish directly.)

---

## How it behaves

- **Desktop:** landscape sequence, ~180 frames, pinned for 3 screens of scroll. Wordmark + tagline
  resolve in the last third.
- **Mobile (≤768px):** portrait sequence, ~96 frames, lighter payload.
- **Low power / Save-Data / reduced-motion / weak device:** no scrub — a single still (`poster.webp`)
  with the wordmark shown. Never janky, never broken.

Tuning lives in `src/hero/heroConfig.js`: `scrollLengthVh` (scrub speed), frame counts, breakpoint,
paths. Overlay reveal timing is the `--p` math in `src/hero/hero.css`.

## Notes

- Fonts load from Google in `hero.css` so this runs out of the box. For production, self-host
  Archivo / Inter / Geist Mono instead (faster, no layout shift).
- The motion is whatever the imagine.art clip does. If you later want pixel-precise mechanical
  assembly (beams snapping on exact cues), we re-render the clip in Blender and re-run step 2 —
  nothing else changes.

Next: the surrounding sections (problem → så funkar det → cases → paket → boka möte → footer) come
as a Lovable prompt with the brand tokens baked in, so Lovable builds those while this island stays
untouched.
