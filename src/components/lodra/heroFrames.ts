// Lodra hero — frame config + sequence loader (TypeScript, browser-only logic guarded for SSR).
// Counts MUST match what scripts/extract-frames.sh produces.

export type FrameSet = {
  dir: string;
  prefix: string;
  ext: string;
  count: number;
  pad: number;
  poster: string;
};

export const HERO = {
  // How long the hero stays pinned, as a multiple of viewport height. Higher = slower scrub.
  scrollLengthVh: 300,
  // Below this width we use the portrait set.
  mobileMaxWidth: 768,
  desktop: {
    dir: "/frames/desktop",
    prefix: "frame_",
    ext: "webp",
    count: 180,
    pad: 4,
    poster: "/frames/desktop/poster.webp",
  } as FrameSet,
  mobile: {
    dir: "/frames/mobile",
    prefix: "frame_",
    ext: "webp",
    count: 96,
    pad: 4,
    poster: "/frames/mobile/poster.webp",
  } as FrameSet,
};

export function framePath(set: FrameSet, i: number): string {
  return `${set.dir}/${set.prefix}${String(i + 1).padStart(set.pad, "0")}.${set.ext}`;
}

export type Sequence = {
  preload: () => Promise<void>;
  draw: (ctx: CanvasRenderingContext2D, progress: number) => void;
  destroy: () => void;
};

export function createSequence(set: FrameSet): Sequence {
  const frames: Array<CanvasImageSource | null> = new Array(set.count).fill(null);
  let cancelled = false;

  function blobToImage(blob: Blob): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(blob);
    });
  }

  async function loadOne(i: number): Promise<void> {
    try {
      const res = await fetch(framePath(set, i));
      const blob = await res.blob();
      const bmp =
        typeof createImageBitmap === "function"
          ? await createImageBitmap(blob)
          : await blobToImage(blob);
      if (!cancelled) frames[i] = bmp;
    } catch {
      // leave null; nearest() fills the gap
    }
  }

  async function preload(): Promise<void> {
    // Sparse pass first so the whole timeline is roughly scrubbable fast, then fill in.
    const step = Math.max(1, Math.round(set.count / 24));
    const order: number[] = [];
    for (let i = 0; i < set.count; i += step) order.push(i);
    for (let i = 0; i < set.count; i += 1) if (!order.includes(i)) order.push(i);
    for (const i of order) {
      if (cancelled) return;
      // eslint-disable-next-line no-await-in-loop
      await loadOne(i);
    }
  }

  function nearest(i: number): CanvasImageSource | null {
    if (frames[i]) return frames[i];
    for (let d = 1; d < set.count; d += 1) {
      if (i - d >= 0 && frames[i - d]) return frames[i - d];
      if (i + d < set.count && frames[i + d]) return frames[i + d];
    }
    return null;
  }

  function draw(ctx: CanvasRenderingContext2D, progress: number): void {
    const idx = Math.max(0, Math.min(set.count - 1, Math.round(progress * (set.count - 1))));
    const img = nearest(idx);
    if (!img) return;
    const meta = img as unknown as { width: number; height: number };
    const cw = ctx.canvas.width;
    const ch = ctx.canvas.height;
    const s = Math.max(cw / meta.width, ch / meta.height);
    const w = meta.width * s;
    const h = meta.height * s;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
  }

  return { preload, draw, destroy: () => { cancelled = true; } };
}
