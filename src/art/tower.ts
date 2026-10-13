import { PALETTE, hatchPattern, n } from "./util";

/** [x, width, top, bottom] of each buttress, shrinking toward the horizon. */
const PILLARS: readonly (readonly [number, number, number, number])[] = [
  [0, 58, -10, 470],
  [62, 46, 14, 462],
  [112, 38, 48, 452],
  [154, 31, 84, 444],
  [189, 26, 116, 436],
  [219, 22, 146, 430],
  [245, 18, 172, 425],
  [267, 15, 194, 420],
  [286, 12, 212, 416],
];

function pillar([x, w, top, bottom]: readonly [number, number, number, number]): string {
  const cap = 16 + w * 0.15;
  const outline = `M${n(x)} ${n(top + cap)} L${n(x + w * 0.5)} ${n(top)} L${n(x + w)} ${n(top + cap * 0.6)} V${bottom} H${x} Z`;
  const shade = `M${n(x + w * 0.62)} ${n(top + cap * 0.75)} L${n(x + w)} ${n(top + cap * 0.6)} V${bottom} H${n(x + w * 0.62)} Z`;
  return (
    `<path d="${outline}" fill="url(#tw-face)"/>` +
    `<path d="${shade}" fill="${PALETTE.stoneShade}" opacity=".5"/>` +
    `<path d="${shade}" fill="url(#tw-hatch)"/>` +
    `<path d="M${x} ${n(top + cap * 2.3)} H${x + w}" stroke="${PALETTE.wine}" stroke-width="1" opacity=".55"/>` +
    `<path d="${outline}" fill="none" stroke="${PALETTE.wine}" stroke-width="1.6" stroke-linejoin="round"/>`
  );
}

export function towerSvg(): string {
  return (
    `<svg class="art" viewBox="0 0 360 560" preserveAspectRatio="xMinYMax meet" focusable="false">` +
    `<defs>` +
    `<linearGradient id="tw-face" x1="0" y1="0" x2="1" y2="0">` +
    `<stop offset="0" stop-color="#f1d84f"/><stop offset=".6" stop-color="${PALETTE.stone}"/><stop offset="1" stop-color="#cfa92c"/>` +
    `</linearGradient>` +
    hatchPattern("tw-hatch", 5, 0.5) +
    `</defs>` +
    PILLARS.map(pillar).join("") +
    `<path d="M0 -6 Q150 28 300 214" fill="none" stroke="${PALETTE.wine}" stroke-width="1.4" opacity=".8"/>` +
    `</svg>`
  );
}
