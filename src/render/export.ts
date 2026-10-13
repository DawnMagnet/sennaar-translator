import { HEIGHT, TOP, boxWidth, originX, pathOf } from "./glyphs";

export interface ExportCell {
  glyph: string;
  caption?: string;
}

export interface ExportOptions {
  color: string;
  background?: string;
  captionColor?: string;
}

const GAP = 120;
const MARGIN = 220;
const MAX_LINE_WIDTH = 7200;
const LINE_GAP = 140;
const CAPTION_BAND = 230;
const PIXELS_PER_UNIT = 0.16;

const escapeXml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]!,
  );

function wrap(cells: ExportCell[]): ExportCell[][] {
  const rows: ExportCell[][] = [];
  let row: ExportCell[] = [];
  let width = 0;
  for (const cell of cells) {
    const w = boxWidth(cell.glyph) + GAP;
    if (row.length && width + w > MAX_LINE_WIDTH) {
      rows.push(row);
      row = [];
      width = 0;
    }
    row.push(cell);
    width += w;
  }
  if (row.length) rows.push(row);
  return rows;
}

export function composeSvg(lines: ExportCell[][], options: ExportOptions): string {
  const hasCaptions = lines.some((line) => line.some((c) => c.caption));
  const band = hasCaptions ? CAPTION_BAND : 0;
  const rows = lines.flatMap(wrap);

  const rowWidth = (row: ExportCell[]) =>
    row.reduce((sum, c) => sum + boxWidth(c.glyph) + GAP, -GAP);
  const contentWidth = Math.max(1200, ...rows.map(rowWidth));
  const width = contentWidth + MARGIN * 2;
  const rowHeight = HEIGHT + band + LINE_GAP;
  const height = rows.length * rowHeight - LINE_GAP + MARGIN * 2;

  const parts: string[] = [];
  rows.forEach((row, r) => {
    let x = MARGIN + (contentWidth - rowWidth(row)) / 2;
    const y = MARGIN + r * rowHeight;
    for (const cell of row) {
      const w = boxWidth(cell.glyph);
      parts.push(
        `<path transform="translate(${x - originX(cell.glyph)} ${y - TOP})" d="${pathOf(cell.glyph)}"/>`,
      );
      if (cell.caption) {
        parts.push(
          `<text x="${x + w / 2}" y="${y + HEIGHT + 150}" text-anchor="middle" font-size="110" ` +
            `fill="${options.captionColor ?? options.color}" fill-opacity=".7" ` +
            `font-family="'Noto Serif SC','Source Han Serif SC','Songti SC',serif">${escapeXml(cell.caption)}</text>`,
        );
      }
      x += w + GAP;
    }
  });

  const background = options.background
    ? `<rect width="100%" height="100%" fill="${options.background}"/>`
    : "";
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" ` +
    `width="${Math.round(width * PIXELS_PER_UNIT)}" height="${Math.round(height * PIXELS_PER_UNIT)}">` +
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
