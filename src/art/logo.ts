import { PALETTE } from "./util";

/** Monoline angular letterforms on a 60x100 grid, echoing the game's title lettering. */
const LETTERS: Record<string, { d: string; advance: number }> = {
  S: { d: "M52 12 H10 V48 H50 V88 H8", advance: 68 },
  E: { d: "M50 12 H10 V88 H50 M10 50 H40", advance: 58 },
  N: { d: "M10 88 V12 L50 88 V12", advance: 68 },
  A: { d: "M10 88 V30 L30 12 L50 30 V88 M10 58 H50", advance: 70 },
  R: { d: "M10 88 V12 H40 L50 22 V42 L40 52 H10 M32 52 L50 88", advance: 70 },
};

const WORD = [..."SENNAAR"];
const MARGIN = 14;
const WIDTH = MARGIN * 2 + WORD.reduce((sum, ch) => sum + LETTERS[ch]!.advance, 0);

function letters(attrs: string, dx = 0, dy = 0): string {
  let x = MARGIN + dx;
  const paths = WORD.map((ch) => {
    const { d, advance } = LETTERS[ch]!;
    const path = `<path transform="translate(${x} ${4 + dy})" d="${d}"/>`;
    x += advance;
    return path;
  }).join("");
  return `<g fill="none" stroke-linejoin="miter" stroke-miterlimit="2.5" stroke-linecap="butt" ${attrs}>${paths}</g>`;
}

export function logoSvg(): string {
  return (
    `<svg class="logo" viewBox="0 0 ${WIDTH} 112" role="img" aria-label="Sennaar" focusable="false">` +
    `<defs>` +
    `<pattern id="lg-lines" width="8" height="5" patternUnits="userSpaceOnUse"><rect width="8" height="1.7" fill="${PALETTE.cream}" opacity=".6"/></pattern>` +
    `<mask id="lg-mask">${letters('stroke="#fff" stroke-width="15"')}</mask>` +
    `</defs>` +
    letters(`stroke="${PALETTE.sandDeep}" stroke-width="15"`, 5, 5) +
    letters(`stroke="${PALETTE.wine}" stroke-width="15"`) +
    `<rect width="${WIDTH}" height="112" fill="url(#lg-lines)" mask="url(#lg-mask)"/>` +
    `</svg>`
  );
}
