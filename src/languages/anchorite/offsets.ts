/**
 * Anchorite glyphs are drawn on a 101 x 101 grid, but a few source files were cropped to their ink.
 * These are the positions the cropped glyphs occupy inside the full cell, recovered by raster-matching
 * them against the game's ready-made composites (`we` = me + plural, `stop` = go + not, ...).
 * Glyphs that are not listed fill the cell and sit at (0, 0).
 */
export const CELL_CENTER = 50.5;

export const CELL_OFFSETS: Readonly<Record<string, readonly [x: number, y: number]>> = {
  plural: [43.2, 0],
  people: [0, 43.2],
  not: [0, 45.6],
};

export const offsetOf = (id: string): readonly [number, number] => CELL_OFFSETS[id] ?? [0, 0];
