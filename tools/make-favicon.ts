// Usage: node tools/make-favicon.ts <glyphs.json> <out.svg>
// Draws the "god" glyph in wine ink on a yellow badge.
import { readFileSync, writeFileSync } from "node:fs";

const [glyphsPath, outPath] = process.argv.slice(2);
if (!glyphsPath || !outPath) {
  console.error("usage: node tools/make-favicon.ts <glyphs.json> <out.svg>");
  process.exit(1);
}

const { metrics, glyphs } = JSON.parse(readFileSync(glyphsPath, "utf8")) as {
  metrics: { above: number; below: number };
  glyphs: Record<string, { x0: number; w: number; d?: string; p: string[] }>;
};
const yMax = metrics.above;
const yMin = -metrics.below;
const glyph = glyphs["god"]!;
const size = 64;
const height = yMax - yMin;
const scale = (size * 0.66) / height;
const x = (size - glyph.w * scale) / 2 - glyph.x0 * scale;
const y = (size - height * scale) / 2 + yMax * scale;

writeFileSync(
  outPath,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">` +
    `<rect width="${size}" height="${size}" rx="14" fill="#ffe94a"/>` +
    `<rect x="1.5" y="1.5" width="${size - 3}" height="${size - 3}" rx="12.5" fill="none" stroke="#7b1d43" stroke-width="3"/>` +
    `<path transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${scale.toFixed(4)})" d="${glyph.p.join(" ")}" fill="#7b1d43"/>` +
    `</svg>\n`,
);
console.log(`favicon -> ${outPath}`);
