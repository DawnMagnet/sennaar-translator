import type { GlyphData, GlyphTable } from "../types";
import { CELL_CENTER, offsetOf } from "./offsets";

export const PLURAL_OVERLAY = "ovl:plural:";
export const NOT_OVERLAY = "ovl:not:";

const tenth = (v: number) => String(Math.round(v * 10) / 10);
const numbers = (args: string) => (args.match(/-?\d*\.?\d+(?:e-?\d+)?/gi) ?? []).map(Number);

/** Translates an absolute path made of M, L, H, V and Z commands (all the Anchorite glyphs). */
function shiftPath(d: string, dx: number, dy: number): string {
  return d.replace(/([MLHVZ])([^MLHVZ]*)/g, (_, cmd: string, args: string) => {
    const n = numbers(args);
    if (cmd === "Z") return "Z";
    if (cmd === "H") return `H${n.map((v) => tenth(v + dx)).join(" ")}`;
    if (cmd === "V") return `V${n.map((v) => tenth(v + dy)).join(" ")}`;
    return `${cmd}${n.map((v, i) => tenth(v + (i % 2 === 0 ? dx : dy))).join(" ")}`;
  });
}

function horizontalExtent(d: string): { min: number; max: number } {
  let min = Infinity;
  let max = -Infinity;
  let x = 0;
  for (const [, cmd, args] of d.matchAll(/([MLHVZ])([^MLHVZ]*)/g)) {
    const n = numbers(args!);
    const xs = cmd === "H" ? n : cmd === "V" || cmd === "Z" ? [x] : n.filter((_, i) => i % 2 === 0);
    for (const v of xs) {
      x = v;
      min = Math.min(min, v);
      max = Math.max(max, v);
    }
  }
  return { min, max };
}

/**
 * Draws a radical on top of a glyph inside the shared 101 x 101 cell. The two shapes are merged into one
 * even-odd path, so strokes they share cancel out, which is how the game's own `stop` (= go + not)
 * and `we` (= me + plural) glyphs behave.
 */
export function overlay(
  glyphs: GlyphTable["glyphs"],
  baseId: string,
  radicalId: string,
): GlyphData | undefined {
  const base = glyphs[baseId];
  const radical = glyphs[radicalId];
  if (!base || !radical) return undefined;
  const [bx, by] = offsetOf(baseId);
  const [rx, ry] = offsetOf(radicalId);
  const d = [
    ...base.paths.map((p) => shiftPath(p.d, bx, by)),
    ...radical.paths.map((p) => shiftPath(p.d, rx, ry)),
  ].join(" ");
  const { min, max } = horizontalExtent(d);
  return { x0: min, w: max - min, a: CELL_CENTER, paths: [{ d, evenodd: true }] };
}
