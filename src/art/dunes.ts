import { PALETTE, n, rng } from "./util";

const BACK = "M0 70 C240 40 420 80 700 72 S1180 40 1500 78 S1800 70 1920 60 V200 H0 Z";
const MID = "M0 112 C300 88 600 132 960 110 S1560 90 1920 122 V200 H0 Z";
const FRONT = "M0 162 C400 142 800 177 1200 157 S1700 152 1920 170 V200 H0 Z";

const STROKE = `stroke="${PALETTE.wine}" stroke-width="1.6" vector-effect="non-scaling-stroke" stroke-linejoin="round"`;

function scribbles(seed: number, count: number, yMin: number, yMax: number): string {
  const rand = rng(seed);
  let out = "";
  for (let i = 0; i < count; i++) {
    const x = rand() * 1880 + 20;
    const y = yMin + rand() * (yMax - yMin);
    const len = 14 + rand() * 40;
    out += `M${n(x)} ${n(y)} q${n(len / 2)} ${n(-3 - rand() * 4)} ${n(len)} ${n(rand() * 3 - 1)} `;
  }
  return `<path d="${out}" fill="none" stroke="${PALETTE.wine}" stroke-width="1.2" stroke-linecap="round" opacity=".7" vector-effect="non-scaling-stroke"/>`;
}

const wrap = (body: string) =>
  `<svg class="art" viewBox="0 0 1920 200" preserveAspectRatio="none" focusable="false">${body}</svg>`;

/** Distant dunes, drawn behind the figures. */
export const farDunesSvg = () =>
  wrap(
    `<defs><linearGradient id="dn-sand" x1="0" y1="0" x2="0" y2="1">` +
      `<stop offset="0" stop-color="#f9c850"/><stop offset="1" stop-color="${PALETTE.sandDeep}"/></linearGradient></defs>` +
      `<path d="${BACK}" fill="#fbd24f" ${STROKE}/>` +
      `<path d="${MID}" fill="url(#dn-sand)" ${STROKE}/>` +
      scribbles(7, 26, 92, 130),
  );

/** Foreground ridge in the page's own sand colour, hiding the figures' feet. */
export const nearDunesSvg = () =>
  wrap(`<path d="${FRONT}" fill="${PALETTE.sandDeep}" ${STROKE}/>` + scribbles(19, 22, 150, 190));
