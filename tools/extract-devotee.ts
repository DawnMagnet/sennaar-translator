// Usage: node tools/extract-devotee.ts <font.ttf> <out.json>
// Shapes every Devotee lexicon id through the font's ligature feature and stores the resulting
// glyph outline as SVG path data (y axis flipped to SVG convention, baseline at y = 0).
import { writeFileSync } from "node:fs";
import * as fontkit from "fontkit";
import { DEVOTEE_LEXICON } from "../src/languages/devotee/lexicon.ts";

const [fontPath, outPath] = process.argv.slice(2);
if (!fontPath || !outPath) {
  console.error("usage: node tools/extract-devotee.ts <font.ttf> <out.json>");
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
const glyphs: Record<string, { x0: number; w: number; a: number; p: string[] }> = {};

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
    a: 0,
    p: [round(glyph.path.transform(1, 0, 0, -1, 0, 0).toSVG())],
  };
}

const metrics = { above: Math.ceil(yMax), below: Math.ceil(-yMin), pad: 30 };
writeFileSync(outPath, JSON.stringify({ metrics, glyphs }));
console.log(
  `${Object.keys(glyphs).length} glyphs, metrics ${JSON.stringify(metrics)} -> ${outPath}`,
);
