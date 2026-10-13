// Usage: node tools/extract-glyphs.ts <font.ttf> <out.json>
// Shapes every lexicon id through the font's ligature feature and stores the
// resulting glyph outline as SVG path data (y axis flipped to SVG convention).
import { writeFileSync } from "node:fs";
import * as fontkit from "fontkit";
import { DEVOTEE_LEXICON } from "../src/data/devotee.lexicon.ts";

const [fontPath, outPath] = process.argv.slice(2);
if (!fontPath || !outPath) {
  console.error("usage: node tools/extract-glyphs.ts <font.ttf> <out.json>");
  process.exit(1);
}

const opened = fontkit.openSync(fontPath);
if (!("layout" in opened)) throw new Error("font collections are not supported");
const font = opened;

const tenth = (v: number) => Math.round(v * 10) / 10;

const round = (path: string) =>
  path.replace(/-?\d+\.\d+/g, (n) => String(Math.round(Number(n) * 10) / 10));

let yMin = 0;
let yMax = 0;
const glyphs: Record<string, { x0: number; w: number; d: string }> = {};

for (const entry of DEVOTEE_LEXICON) {
  const { glyphs: shaped } = font.layout(entry.id);
  const glyph = shaped[0];
  if (shaped.length !== 1 || !glyph) {
    throw new Error(
      `"${entry.id}" did not shape into a single ligature glyph (got ${shaped.length})`,
    );
  }
  yMin = Math.min(yMin, glyph.bbox.minY);
  yMax = Math.max(yMax, glyph.bbox.maxY);
  glyphs[entry.id] = {
    x0: tenth(glyph.bbox.minX),
    w: tenth(glyph.bbox.maxX - glyph.bbox.minX),
    d: round(glyph.path.transform(1, 0, 0, -1, 0, 0).toSVG()),
  };
}

writeFileSync(outPath, JSON.stringify({ upem: font.unitsPerEm, yMin, yMax, glyphs }));
console.log(`${Object.keys(glyphs).length} glyphs, y range [${yMin}, ${yMax}] -> ${outPath}`);
