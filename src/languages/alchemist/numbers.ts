import type { GlyphData, GlyphPath, GlyphTable } from "../types";

/**
 * Alchemist numbers 0-9999 are one glyph: a vertical stem with a mark for each decimal place in a
 * quadrant around it, like medieval Cistercian numerals. The ten in-game digit glyphs are all drawn
 * as the stem plus a mark in the lower right (the units quadrant); the other places are the same
 * mark mirrored across the stem, across the middle, or both. The mirroring rule is our inference
 * from the Cistercian system, not something the game shows beyond the ten base glyphs.
 */
const DIGIT_IDS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
] as const;

/** Stem width and height of every digit glyph, in glyph units. */
const STEM_W = 8;
const STEM_H = 125.3;

const PLACES = [
  { transform: undefined, leftward: false }, // units: lower right
  { transform: `matrix(-1 0 0 1 ${STEM_W} 0)`, leftward: true }, // tens: lower left
  { transform: `matrix(1 0 0 -1 0 ${STEM_H})`, leftward: false }, // hundreds: upper right
  { transform: `matrix(-1 0 0 -1 ${STEM_W} ${STEM_H})`, leftward: true }, // thousands: upper left
] as const;

export const NUMBER_PREFIX = "num:";
export const MAX_NUMBER = 9999;

export const digitId = (digit: number) => DIGIT_IDS[digit]!;

export function composeNumber(glyphs: GlyphTable["glyphs"], value: number): GlyphData | undefined {
  if (!Number.isInteger(value) || value < 0 || value > MAX_NUMBER) return undefined;
  const digits = [...String(value)].reverse().map(Number);
  const paths: GlyphPath[] = [];
  let left = 0;
  let right = STEM_W;

  digits.forEach((digit, place) => {
    const { transform, leftward } = PLACES[place]!;
    // The units glyph always goes in, so the stem is drawn even for 0, 10, 100...
    if (digit === 0 && place > 0) return;
    const glyph = glyphs[digitId(digit)]!;
    for (const { d } of glyph.paths) paths.push(transform ? { d, t: transform } : { d });
    if (leftward) left = Math.min(left, STEM_W - glyph.w);
    else right = Math.max(right, glyph.w);
  });

  return { x0: left, w: right - left, a: glyphs.zero!.a, paths };
}
