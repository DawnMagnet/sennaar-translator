import { PALETTE, hatchPattern } from "./util";

const WINE = PALETTE.wine;

function limb(d: string, width: number, color: string = PALETTE.skin): string {
  return (
    `<path d="${d}" fill="none" stroke="${WINE}" stroke-width="${width + 3}" stroke-linecap="round"/>` +
    `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`
  );
}

/** The tall faceless hooded figure from the key art. */
function hooded(): string {
  const robe =
    "M0 0 C22 2 38 30 46 70 C56 110 66 170 70 260 L76 500 L-76 500 L-70 260 C-66 170 -56 110 -46 70 C-38 30 -22 2 0 0 Z";
  return (
    `<g transform="translate(300 70)">` +
    limb("M-50 118 C-74 190 -80 250 -76 312", 10) +
    limb("M50 118 C72 190 78 250 74 312", 10) +
    `<path d="M54 140 L61 170" stroke="#4f9d8a" stroke-width="12" stroke-linecap="butt"/>` +
    `<path d="${robe}" fill="url(#fg-robe)"/>` +
    `<path d="M-46 70 C-56 110 -66 170 -70 260 L-76 500 L-4 500 C-6 380 -8 200 -10 90 Z" fill="url(#fg-hatch)"/>` +
    `<path d="M-12 120 C-10 250 -16 380 -22 500" fill="none" stroke="${WINE}" stroke-width="1" opacity=".45"/>` +
    `<path d="${robe}" fill="none" stroke="${WINE}" stroke-width="2" stroke-linejoin="round"/>` +
    `<path d="M0 8 C16 10 27 36 30 64 C20 92 -20 92 -30 64 C-27 36 -16 10 0 8 Z" fill="#5e1030"/>` +
    `<path d="M0 8 C-16 10 -27 36 -30 64 C-24 52 -14 30 0 8 Z" fill="#3d0a20" opacity=".7"/>` +
    `<path d="M-36 82 C-14 104 14 104 36 82" fill="none" stroke="${WINE}" stroke-width="1.4" opacity=".6"/>` +
    `</g>`
  );
}

/** The short green-cowled figure with outstretched, open hands. */
function cowled(): string {
  return (
    `<g transform="translate(150 250)">` +
    limb("M-34 98 C-58 120 -74 122 -90 110", 8) +
    limb("M32 98 C56 120 70 124 86 114", 8) +
    `<ellipse cx="-95" cy="107" rx="9" ry="5" transform="rotate(-24 -95 107)" fill="${PALETTE.skin}" stroke="${WINE}" stroke-width="1.4"/>` +
    `<ellipse cx="92" cy="111" rx="9" ry="5" transform="rotate(22 92 111)" fill="${PALETTE.skin}" stroke="${WINE}" stroke-width="1.4"/>` +
    `<path d="M-38 46 L-50 320 H52 L40 46 Z" fill="url(#fg-teal)" stroke="${WINE}" stroke-width="2" stroke-linejoin="round"/>` +
    `<path d="M-38 46 L-50 320 H-6 C-8 220 -8 120 -8 46 Z" fill="url(#fg-hatch)"/>` +
    `<path d="M-34 46 C-36 6 -20 -10 2 -10 L22 -6 C38 0 40 22 38 46 Z" fill="#86c3aa" stroke="${WINE}" stroke-width="2" stroke-linejoin="round"/>` +
    `<rect x="-30" y="24" width="64" height="11" rx="1.5" fill="${PALETTE.tealDeep}" stroke="${WINE}" stroke-width="1.2"/>` +
    `<path d="M-26 28 H28" stroke="#9fd3be" stroke-width="1" opacity=".6"/>` +
    `</g>`
  );
}

/** A guard holding a tall slab-like weapon. */
function guard(): string {
  return (
    `<g transform="translate(455 300)">` +
    `<g transform="rotate(-3 33 0)">` +
    `<rect x="26" y="-96" width="14" height="178" fill="#8dbba9" stroke="${WINE}" stroke-width="1.8"/>` +
    `<path d="M26 -96 L33 -118 L40 -96 Z" fill="#8dbba9" stroke="${WINE}" stroke-width="1.8" stroke-linejoin="round"/>` +
    `<circle cx="33" cy="-72" r="1.7" fill="${WINE}"/><circle cx="33" cy="-62" r="1.7" fill="${WINE}"/><circle cx="33" cy="-52" r="1.7" fill="${WINE}"/>` +
    `<rect x="14" y="70" width="38" height="8" fill="#a9c9ba" stroke="${WINE}" stroke-width="1.6"/>` +
    `</g>` +
    `<path d="M0 0 C14 0 20 14 22 36 L28 270 H-28 L-22 36 C-20 14 -14 0 0 0 Z" fill="url(#fg-robe2)" stroke="${WINE}" stroke-width="2" stroke-linejoin="round"/>` +
    `<path d="M-22 36 L-28 270 H-6 C-6 170 -6 90 -6 36 Z" fill="url(#fg-hatch)"/>` +
    `<ellipse cx="0" cy="14" rx="9" ry="11" fill="#5e1030"/>` +
    `</g>`
  );
}

export function figuresSvg(): string {
  return (
    `<svg class="art" viewBox="0 0 520 560" preserveAspectRatio="xMaxYMax meet" focusable="false">` +
    `<defs>` +
    `<linearGradient id="fg-robe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7c1a3f"/><stop offset=".45" stop-color="#a8204f"/><stop offset="1" stop-color="#e0196c"/></linearGradient>` +
    `<linearGradient id="fg-robe2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9c1b4e"/><stop offset="1" stop-color="#e0196c"/></linearGradient>` +
    `<linearGradient id="fg-teal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8cc7ae"/><stop offset=".5" stop-color="${PALETTE.teal}"/><stop offset="1" stop-color="#cf2a68"/></linearGradient>` +
    hatchPattern("fg-hatch", 5, 0.4) +
    `</defs>` +
    guard() +
    cowled() +
    hooded() +
    `</svg>`
  );
}
