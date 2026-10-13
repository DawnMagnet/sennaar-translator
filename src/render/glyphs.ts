import type { GlyphData, LanguageModule } from "../languages/types";

const SVG_NS = "http://www.w3.org/2000/svg";

export function glyphOf(language: LanguageModule, id: string): GlyphData {
  const glyph = language.glyphs.glyphs[id] ?? language.resolveGlyph?.(id);
  if (!glyph) throw new Error(`No glyph "${id}" in ${language.id}`);
  return glyph;
}

const padX = (language: LanguageModule) =>
  language.glyphs.metrics.padX ?? language.glyphs.metrics.pad;

export interface CellBox {
  /** Padding applied around every glyph. */
  pad: number;
  /** Height of every cell in a language, in glyph units. */
  height: number;
  /** Distance from the top of the cell to the alignment line. */
  top: number;
}

export function cellBox(language: LanguageModule): CellBox {
  const { above, below, pad } = language.glyphs.metrics;
  return { pad, height: above + below + pad * 2, top: above + pad };
}

/** Width of a glyph's cell: its ink plus padding on both sides. */
export const boxWidth = (language: LanguageModule, glyph: GlyphData) =>
  glyph.w + padX(language) * 2;

/** Left edge of a glyph's cell in glyph coordinates. */
export const originX = (language: LanguageModule, glyph: GlyphData) => glyph.x0 - padX(language);

export function glyphElement(language: LanguageModule, id: string): SVGSVGElement {
  const glyph = glyphOf(language, id);
  const { height, top } = cellBox(language);
  const width = boxWidth(language, glyph);

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", `${originX(language, glyph)} ${-top} ${width} ${height}`);
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("glyph");
  svg.style.aspectRatio = `${width} / ${height}`;

  const group = document.createElementNS(SVG_NS, "g");
  group.setAttribute("transform", `translate(0 ${-glyph.a})`);
  group.setAttribute("fill", "currentColor");
  for (const { d, t, evenodd } of glyph.paths) {
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", d);
    if (t) path.setAttribute("transform", t);
    if (evenodd) path.setAttribute("fill-rule", "evenodd");
    group.append(path);
  }
  svg.append(group);
  return svg;
}
