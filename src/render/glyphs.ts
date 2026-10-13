import data from "../data/devotee.glyphs.json";

const glyphs: Record<string, { x0: number; w: number; d: string }> = data.glyphs;
const SVG_NS = "http://www.w3.org/2000/svg";

/** Margin around each glyph's ink so strokes are never clipped; spacing between glyphs is left to the layout. */
export const PAD = 30;
export const TOP = -data.yMax - PAD;
export const HEIGHT = data.yMax - data.yMin + PAD * 2;

export const pathOf = (id: string) => glyphs[id]!.d;
/** Width of the glyph's box: its ink plus padding on both sides. */
export const boxWidth = (id: string) => glyphs[id]!.w + PAD * 2;
/** Left edge of the box in glyph coordinates. */
export const originX = (id: string) => glyphs[id]!.x0 - PAD;

export function glyphElement(id: string): SVGSVGElement {
  const width = boxWidth(id);
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", `${originX(id)} ${TOP} ${width} ${HEIGHT}`);
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("glyph");
  svg.style.aspectRatio = `${width} / ${HEIGHT}`;
  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("d", pathOf(id));
  path.setAttribute("fill", "currentColor");
  svg.append(path);
  return svg;
}
