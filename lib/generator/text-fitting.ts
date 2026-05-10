/**
 * Fit a single string into a fixed-width box on a 2D canvas.
 *
 * Strategy:
 *   1. Try the configured `maxFontSize`. If the text fits, done.
 *   2. Shrink the font size in 4-px steps down to `minFontSize`. If it fits
 *      at any step, use that size.
 *   3. If still too wide, split into 2 lines balancing word counts so neither
 *      line is much longer than the other, then shrink again until both
 *      lines fit.
 *   4. If even 2 lines won't fit at the minimum size, return the
 *      best-effort result with `overflow: true` so the caller can flag the
 *      row as a warning.
 *
 * The algorithm mutates `ctx.font` while measuring, so callers should save
 * and restore canvas state if they care about the original font.
 */
export type FitTextResult = {
  fontSize: number;
  lines: string[];
  overflow: boolean;
};

export function fitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  options: {
    maxWidth: number;
    maxFontSize: number;
    minFontSize: number;
    fontFamily: string;
    fontWeight: string;
    step?: number;
  },
): FitTextResult {
  const {
    maxWidth,
    maxFontSize,
    minFontSize,
    fontFamily,
    fontWeight,
    step = 4,
  } = options;

  const setFont = (size: number) => {
    ctx.font = `${fontWeight} ${size}px ${fontFamily}`;
  };

  const measure = (s: string) => ctx.measureText(s).width;

  // Step 1+2: try to fit on a single line by shrinking.
  for (let size = maxFontSize; size >= minFontSize; size -= step) {
    setFont(size);
    if (measure(text) <= maxWidth) {
      return { fontSize: size, lines: [text], overflow: false };
    }
  }

  // Step 3: try 2-line wrap.
  const words = text.trim().split(/\s+/);
  if (words.length < 2) {
    // Single token — nothing to wrap. Return at min size and flag overflow.
    setFont(minFontSize);
    return {
      fontSize: minFontSize,
      lines: [text],
      overflow: measure(text) > maxWidth,
    };
  }

  // Pick the split that balances character counts most evenly.
  let best: { split: number; diff: number } | null = null;
  for (let i = 1; i < words.length; i++) {
    const left = words.slice(0, i).join(" ");
    const right = words.slice(i).join(" ");
    const diff = Math.abs(left.length - right.length);
    if (!best || diff < best.diff) best = { split: i, diff };
  }
  const splitAt = best?.split ?? Math.ceil(words.length / 2);
  const lines = [
    words.slice(0, splitAt).join(" "),
    words.slice(splitAt).join(" "),
  ];

  for (let size = maxFontSize; size >= minFontSize; size -= step) {
    setFont(size);
    const w0 = measure(lines[0]);
    const w1 = measure(lines[1]);
    if (Math.max(w0, w1) <= maxWidth) {
      return { fontSize: size, lines, overflow: false };
    }
  }

  // Best effort.
  setFont(minFontSize);
  const overflow = Math.max(measure(lines[0]), measure(lines[1])) > maxWidth;
  return { fontSize: minFontSize, lines, overflow };
}
