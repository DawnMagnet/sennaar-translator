import type { GlyphTable } from "./types";

export interface RawGlyphTable {
  metrics: { above: number; below: number; pad: number; padX?: number };
  glyphs: Record<string, { x0: number; w: number; a: number; p: string[] }>;
}

export function loadGlyphTable(raw: RawGlyphTable): GlyphTable {
  return {
    metrics: raw.metrics,
    glyphs: Object.fromEntries(
      Object.entries(raw.glyphs).map(([id, g]) => [
        id,
        { x0: g.x0, w: g.w, a: g.a, paths: g.p.map((d) => ({ d })) },
      ]),
    ),
  };
}
