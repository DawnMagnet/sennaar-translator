import { PALETTE, hatchPattern, n, rng } from "./util";

const CLOUD =
  "M20 150 C4 150 0 120 30 112 C24 80 70 66 94 86 C104 40 170 20 214 52 C240 24 300 30 316 70 " +
  "C350 56 392 78 384 112 C420 108 440 148 410 150 Z";

/** `id` keeps gradient/clip ids unique when the cloud is inlined more than once. */
export function cloudSvg(id: string): string {
  return (
    `<svg class="art" viewBox="0 0 440 170" overflow="visible" focusable="false">` +
    `<defs>${hatchPattern(`cl-h-${id}`, 5, 0.32)}<clipPath id="cl-c-${id}"><path d="${CLOUD}"/></clipPath></defs>` +
    `<path d="M-230 147 L30 151" stroke="${PALETTE.wine}" stroke-width="1.4" stroke-linecap="round"/>` +
    `<path d="${CLOUD}" fill="${PALETTE.cloud}"/>` +
    `<g clip-path="url(#cl-c-${id})">` +
    `<path d="M250 150 C270 110 330 100 440 120 V160 H250 Z" fill="#e8dfb6" opacity=".7"/>` +
    `<rect x="236" y="20" width="220" height="140" fill="url(#cl-h-${id})"/></g>` +
    `<path d="${CLOUD}" fill="none" stroke="${PALETTE.wine}" stroke-width="1.6" stroke-linejoin="round"/>` +
    `</svg>`
  );
}

export function birdsSvg(): string {
  const rand = rng(31);
  let birds = "";
  for (let i = 0; i < 16; i++) {
    const x = 6 + rand() * 230;
    const y = 8 + rand() * 120 + x * 0.12;
    const s = 0.7 + rand() * 0.9;
    const r = rand() * 36 - 18;
    birds +=
      `<path transform="translate(${n(x)} ${n(y)}) rotate(${n(r)}) scale(${n(s)})" ` +
      `d="M-6 -1 Q-3 -5 0 0 Q3 -5 6 -1" fill="none" stroke="${PALETTE.wine}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  return `<svg class="art" viewBox="0 0 260 170" focusable="false">${birds}</svg>`;
}
