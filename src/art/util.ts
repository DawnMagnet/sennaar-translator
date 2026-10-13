/** Colours sampled from the game's key art: flat yellow sky, wine-coloured line work, magenta robes. */
export const PALETTE = {
  wine: "#7b1d43",
  wineDeep: "#4a0f27",
  yellow: "#ffe94a",
  sand: "#f6b64c",
  sandDeep: "#f0a04a",
  cream: "#fff6d6",
  cloud: "#f7f1d6",
  pink: "#d7196a",
  teal: "#6fae96",
  tealDeep: "#2d5f55",
  skin: "#c9764f",
  stone: "#e0c03c",
  stoneShade: "#b8941f",
} as const;

/** Small deterministic PRNG so hand-scattered details look the same on every load. */
export function rng(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const n = (v: number) => String(Math.round(v * 10) / 10);

/** Diagonal line hatching, the comic-style shading used all over the game's art. */
export function hatchPattern(id: string, gap = 6, opacity = 0.4, width = 1.1): string {
  return (
    `<pattern id="${id}" width="${gap}" height="${gap}" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">` +
    `<line x1="0" y1="0" x2="0" y2="${gap}" stroke="${PALETTE.wine}" stroke-width="${width}" opacity="${opacity}"/></pattern>`
  );
}
