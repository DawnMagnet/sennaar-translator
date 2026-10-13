// Usage: node tools/extract-svg-glyphs.ts
// Reads third_party/glyph-svgs/<language>/<language>_<name>.svg and writes src/languages/<language>/glyphs.json.
// Every lexicon id must have a source file (an id may map to a differently named file via FILE_ALIASES),
// and every source file must be used by some lexicon entry, so the two sides cannot drift apart.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { ALCHEMIST_LEXICON } from "../src/languages/alchemist/lexicon.ts";
import { ANCHORITE_LEXICON } from "../src/languages/anchorite/lexicon.ts";
import { BARD_LEXICON } from "../src/languages/bard/lexicon.ts";
import { WARRIOR_LEXICON } from "../src/languages/warrior/lexicon.ts";
import type { Entry } from "../src/engine/types.ts";

interface Source {
  id: "warrior" | "bard" | "alchemist" | "anchorite";
  lexicon: Entry[];
  /** Lexicon id -> source file stem, when they differ. */
  aliases?: Record<string, string>;
  /** Source files that are intentionally unused. */
  skip?: string[];
  /** Extra ids rendered by the language itself rather than read from a file. */
  synthetic?: string[];
}

const SOURCES: Source[] = [
  { id: "warrior", lexicon: WARRIOR_LEXICON },
  { id: "bard", lexicon: BARD_LEXICON },
  { id: "alchemist", lexicon: ALCHEMIST_LEXICON, synthetic: [] },
  { id: "anchorite", lexicon: ANCHORITE_LEXICON },
];

const tenth = (v: number) => Math.round(v * 10) / 10;
const round = (d: string) =>
  d
    .replace(/-?\d+\.\d+(?:e-?\d+)?/g, (n) => String(tenth(Number(n))))
    .replace(/\s+/g, " ")
    .trim();

function parse(svg: string, file: string) {
  const vb = svg
    .match(/viewBox="([^"]+)"/)?.[1]
    ?.split(/\s+/)
    .map(Number);
  if (!vb || vb.length !== 4) throw new Error(`${file}: no viewBox`);
  if (/<(g|rect|circle|ellipse|line|polygon|polyline|use|clipPath|mask|defs)\b/.test(svg)) {
    throw new Error(`${file}: contains non-path elements`);
  }
  if (/transform=|stroke=/.test(svg)) throw new Error(`${file}: has transform or stroke`);
  const paths = [...svg.matchAll(/<path\b[^>]*\sd="([^"]+)"/g)].map((m) => round(m[1]!));
  if (paths.length === 0) throw new Error(`${file}: no paths`);
  return { w: vb[2]!, h: vb[3]!, paths };
}

/**
 * Where the alignment line sits for a glyph of the given height, in the glyph's own coordinates.
 * The line is always y = a, drawn at `above` units below the cell top.
 * - warrior / anchorite / alchemist: glyphs are centred vertically on one line, as in the game.
 * - bard: every glyph sits on a baseline (the shirorekha), so the line is the glyph's bottom edge.
 */
const ALIGN: Record<Source["id"], (height: number, maxH: number) => number> = {
  warrior: (h) => h / 2,
  anchorite: (h) => h / 2,
  alchemist: (h) => h / 2,
  bard: (h) => h,
};
const ABOVE: Record<Source["id"], (maxH: number) => number> = {
  warrior: (m) => m / 2,
  anchorite: (m) => m / 2,
  alchemist: (m) => m / 2,
  bard: (m) => m,
};
const BELOW: Record<Source["id"], (maxH: number) => number> = {
  warrior: (m) => m / 2,
  anchorite: (m) => m / 2,
  alchemist: (m) => m / 2,
  bard: () => 0,
};

for (const source of SOURCES) {
  const dir = `third_party/glyph-svgs/${source.id}`;
  const files = new Map(
    readdirSync(dir)
      .filter((f) => f.endsWith(".svg"))
      .map((f) => [f.replace(/\.svg$/, "").replace(`${source.id}_`, ""), f]),
  );
  const used = new Set<string>();
  const glyphs: Record<string, { x0: number; w: number; a: number; p: string[]; h: number }> = {};

  for (const entry of source.lexicon) {
    const stem = source.aliases?.[entry.id] ?? entry.id;
    const file = files.get(stem);
    if (!file) throw new Error(`${source.id}: lexicon id "${entry.id}" has no file "${stem}"`);
    used.add(stem);
    const { w, h, paths } = parse(readFileSync(`${dir}/${file}`, "utf8"), file);
    glyphs[entry.id] = { x0: 0, w, a: 0, p: paths, h };
  }

  const unused = [...files.keys()].filter((k) => !used.has(k) && !source.skip?.includes(k));
  if (unused.length)
    throw new Error(`${source.id}: source files not in the lexicon: ${unused.join(", ")}`);

  // Alignment: the SVG viewBox starts at y = 0, so the line is the cell's top edge. Glyphs are
  // top-aligned inside one shared cell height, except for languages that align elsewhere (see below).
  const maxH = Math.max(...Object.values(glyphs).map((g) => g.h));
  const out = Object.fromEntries(
    Object.entries(glyphs).map(([id, g]) => {
      const { h: height, ...rest } = g;
      return [id, { ...rest, a: ALIGN[source.id](height, maxH) }];
    }),
  );
  const pad = Math.round(maxH * 0.1);
  const metrics = { above: ABOVE[source.id](maxH), below: BELOW[source.id](maxH), pad };
  writeFileSync(`src/languages/${source.id}/glyphs.json`, JSON.stringify({ metrics, glyphs: out }));
  console.log(
    `${source.id}: ${Object.keys(out).length} glyphs, maxH ${maxH}, metrics ${JSON.stringify(metrics)}`,
  );
}
