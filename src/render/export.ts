import type { LanguageModule } from "../languages/types";
import { boxWidth, cellBox, glyphOf, originX } from "./glyphs";

export interface ExportCell {
  glyph: string;
  caption?: string;
}

export interface ExportOptions {
  color: string;
  background?: string;
  captionColor?: string;
}

/** Layout constants are fractions of the cell height, so every language exports at the same visual scale. */
const GAP = 0.11;
const MARGIN = 0.2;
const LINE_GAP = 0.13;
const CAPTION_BAND = 0.22;
const MAX_LINE_WIDTH = 6.8;
const MIN_CONTENT_WIDTH = 1.1;
const CELL_PIXELS = 170;

const escapeXml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]!,
  );

const num = (v: number) => String(Math.round(v * 100) / 100);

export function composeSvg(
  language: LanguageModule,
  lines: ExportCell[][],
  options: ExportOptions,
): string {
  const { height: H, top } = cellBox(language);
  const gap = language.connected ? 0 : H * GAP;
  const widthOf = (cell: ExportCell) => boxWidth(language, glyphOf(language, cell.glyph));

  const wrap = (cells: ExportCell[]): ExportCell[][] => {
    const rows: ExportCell[][] = [];
    let row: ExportCell[] = [];
    let width = 0;
    for (const cell of cells) {
      const w = widthOf(cell) + gap;
      if (row.length && width + w > H * MAX_LINE_WIDTH) {
        rows.push(row);
        row = [];
        width = 0;
      }
      row.push(cell);
      width += w;
    }
    if (row.length) rows.push(row);
    return rows;
  };

  const hasCaptions = lines.some((line) => line.some((c) => c.caption));
  const band = hasCaptions ? H * CAPTION_BAND : 0;
  const rows = lines.flatMap(wrap);

  const rowWidth = (row: ExportCell[]) => row.reduce((sum, c) => sum + widthOf(c) + gap, -gap);
  const margin = H * MARGIN;
  const contentWidth = Math.max(H * MIN_CONTENT_WIDTH, ...rows.map(rowWidth));
  const width = contentWidth + margin * 2;
  const rowHeight = H + band + H * LINE_GAP;
  const height = rows.length * rowHeight - H * LINE_GAP + margin * 2;
  const scale = CELL_PIXELS / H;

  const parts: string[] = [];
  rows.forEach((row, r) => {
    let x = margin + (contentWidth - rowWidth(row)) / 2;
    const y = margin + r * rowHeight;
    for (const cell of row) {
      const glyph = glyphOf(language, cell.glyph);
      const w = boxWidth(language, glyph);
      const paths = glyph.paths
        .map(
          ({ d, t, evenodd }) =>
            `<path d="${d}"${t ? ` transform="${t}"` : ""}${evenodd ? ' fill-rule="evenodd"' : ""}/>`,
        )
        .join("");
      parts.push(
        `<g transform="translate(${num(x - originX(language, glyph))} ${num(y + top - glyph.a)})">${paths}</g>`,
      );
      if (cell.caption) {
        parts.push(
          `<text x="${num(x + w / 2)}" y="${num(y + H + H * 0.14)}" text-anchor="middle" font-size="${num(H * 0.1)}" ` +
            `fill="${options.captionColor ?? options.color}" fill-opacity=".7" ` +
            `font-family="'Noto Serif SC','Source Han Serif SC','Songti SC',serif">${escapeXml(cell.caption)}</text>`,
        );
      }
      x += w + gap;
    }
  });

  const background = options.background
    ? `<rect width="100%" height="100%" fill="${options.background}"/>`
    : "";
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${num(width)} ${num(height)}" ` +
    `width="${Math.round(width * scale)}" height="${Math.round(height * scale)}">` +
    `${background}<g fill="${options.color}">${parts.join("")}</g></svg>`
  );
}

export async function svgToPng(svg: string, scale = 2): Promise<Blob> {
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth * scale;
    canvas.height = image.naturalHeight * scale;
    canvas.getContext("2d")!.drawImage(image, 0, 0, canvas.width, canvas.height);
    return await new Promise((resolve, reject) =>
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("PNG encoding failed"))),
        "image/png",
      ),
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function download(content: Blob | string, filename: string, type = "image/svg+xml"): void {
  const blob = typeof content === "string" ? new Blob([content], { type }) : content;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
