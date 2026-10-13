// Usage: node tools/extract-svg-glyphs.ts
// Reads third_party/glyph-svgs/<language>/<language>_<name>.svg and writes src/languages/<language>/glyphs.json.
// Every lexicon id must have a source file and every source file must be used by some lexicon entry,
// so the two sides cannot drift apart.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import type { Entry } from "../src/engine/types.ts";
import { ALCHEMIST_LEXICON } from "../src/languages/alchemist/lexicon.ts";
import { ANCHORITE_LEXICON } from "../src/languages/anchorite/lexicon.ts";
import { BARD_LEXICON } from "../src/languages/bard/lexicon.ts";
import { WARRIOR_LEXICON } from "../src/languages/warrior/lexicon.ts";

interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

interface Info {
  w: number;
  h: number;
  paths: string[];
  bounds: Bounds[];
}

interface Source {
  id: "warrior" | "bard" | "alchemist" | "anchorite";
  lexicon: Entry[];
  /** Fraction of the tallest glyph used as padding around every cell. */
  pad: number;
  /** The y coordinate (in the glyph's own coordinates) that lies on the shared alignment line. */
  align(info: Info): number;
  /** Extra paths added to every glyph, given its alignment line and the cell padding. */
  extend?(info: Info, a: number, pad: number): string[];
}

const tenth = (v: number) => Math.round(v * 10) / 10;
const round = (d: string) =>
  d
    .replace(/-?\d+\.\d+(?:e-?\d+)?/g, (n) => String(tenth(Number(n))))
    .replace(/\s+/g, " ")
    .trim();

/** Bounding box of an absolute-command path (M L H V C Z). Control points are included, which is conservative. */
function pathBounds(d: string): Bounds {
  const b = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
  let x = 0;
  let y = 0;
  const add = (px: number, py: number) => {
    b.minX = Math.min(b.minX, px);
    b.maxX = Math.max(b.maxX, px);
    b.minY = Math.min(b.minY, py);
    b.maxY = Math.max(b.maxY, py);
  };
  for (const [, cmd, args] of d.matchAll(/([MLHVCZ])([^MLHVCZ]*)/g)) {
    const n = (args!.match(/-?\d*\.?\d+(?:e-?\d+)?/gi) ?? []).map(Number);
    if (cmd === "M" || cmd === "L") {
      for (let i = 0; i < n.length; i += 2) {
        x = n[i]!;
        y = n[i + 1]!;
        add(x, y);
      }
    } else if (cmd === "H") {
      for (const v of n) {
        x = v;
        add(x, y);
      }
    } else if (cmd === "V") {
      for (const v of n) {
        y = v;
        add(x, y);
      }
    } else if (cmd === "C") {
      for (let i = 0; i < n.length; i += 2) add(n[i]!, n[i + 1]!);
      x = n.at(-2)!;
      y = n.at(-1)!;
    }
  }
  return b;
}

function parse(svg: string, file: string): Info {
  const vb = svg
    .match(/viewBox="([^"]+)"/)?.[1]
    ?.split(/\s+/)
    .map(Number);
  if (!vb || vb.length !== 4) throw new Error(`${file}: no viewBox`);
  if (/<(g|rect|circle|ellipse|line|polygon|polyline|use|clipPath|mask|defs)\b/.test(svg)) {
    throw new Error(`${file}: contains non-path elements`);
  }
  if (/transform=|stroke=/.test(svg)) throw new Error(`${file}: has transform or stroke`);
  const raw = [...svg.matchAll(/<path\b[^>]*\sd="([^"]+)"/g)].map((m) => m[1]!);
  if (raw.length === 0) throw new Error(`${file}: no paths`);
  return { w: vb[2]!, h: vb[3]!, paths: raw.map(round), bounds: raw.map(pathBounds) };
}

/**
 * Bard glyphs stand on a baseline bar. Place-like glyphs carry a small dot underneath the bar; that dot
 * is the only thing allowed below the line, so the line sits at the bottom of everything else.
 */
function bardBaseline({ h, bounds }: Info): number {
  if (bounds.length < 2) return h;
  const sorted = [...bounds].sort((p, q) => q.maxY - p.maxY);
  const lowest = sorted[0]!;
  const restBottom = Math.max(...sorted.slice(1).map((b) => b.maxY));
  const isDot = lowest.maxX - lowest.minX < 30 && lowest.maxY - lowest.minY < 30;
  return isDot && lowest.minY >= restBottom - 2 ? restBottom : h;
}

const BARD_BAR = 12.4;
const bardBar = ({ w }: Info, a: number, pad: number) => [
  `M${-pad} ${tenth(a - BARD_BAR)}H${tenth(w + pad)}V${tenth(a)}H${-pad}Z`,
];

const SOURCES: Source[] = [
  { id: "warrior", lexicon: WARRIOR_LEXICON, pad: 0.1, align: ({ h }) => h / 2 },
  { id: "bard", lexicon: BARD_LEXICON, pad: 0.1, align: bardBaseline, extend: bardBar },
  { id: "alchemist", lexicon: ALCHEMIST_LEXICON, pad: 0.1, align: ({ h }) => h / 2 },
  { id: "anchorite", lexicon: ANCHORITE_LEXICON, pad: 0.1, align: ({ h }) => h / 2 },
];

for (const source of SOURCES) {
  const dir = `third_party/glyph-svgs/${source.id}`;
  const files = new Map(
    readdirSync(dir)
      .filter((f) => f.endsWith(".svg"))
      .map((f) => [f.replace(/\.svg$/, "").replace(`${source.id}_`, ""), f]),
  );
  const used = new Set<string>();
  const infos = new Map<string, Info>();

  for (const entry of source.lexicon) {
    const file = files.get(entry.id);
    if (!file) throw new Error(`${source.id}: lexicon id "${entry.id}" has no file`);
    used.add(entry.id);
    infos.set(entry.id, parse(readFileSync(`${dir}/${file}`, "utf8"), file));
  }
  const unused = [...files.keys()].filter((k) => !used.has(k));
  if (unused.length) {
    throw new Error(`${source.id}: source files not in the lexicon: ${unused.join(", ")}`);
  }

  const aligned = [...infos].map(([id, info]) => ({ id, info, a: source.align(info) }));
  const above = Math.max(...aligned.map(({ a }) => a));
  const below = Math.max(...aligned.map(({ info, a }) => info.h - a));
  const maxH = Math.max(...aligned.map(({ info }) => info.h));
  const pad = Math.round(maxH * source.pad);

  const glyphs = Object.fromEntries(
    aligned.map(({ id, info, a }) => [
      id,
      {
        x0: 0,
        w: info.w,
        a: tenth(a),
        p: [...info.paths, ...(source.extend?.(info, a, pad) ?? [])],
      },
    ]),
  );
  const metrics = { above: tenth(above), below: tenth(below), pad };
  writeFileSync(`src/languages/${source.id}/glyphs.json`, JSON.stringify({ metrics, glyphs }));
  console.log(`${source.id}: ${aligned.length} glyphs, metrics ${JSON.stringify(metrics)}`);
}
