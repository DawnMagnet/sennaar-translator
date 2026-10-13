import { PLURABLE, type Cell, type Item, type Line, type Role, type Warning } from "./types";

/**
 * Devotee grammar, as far as the community has pinned it down:
 *  - SVO, no tense, no articles, no copula (all dropped by the parser)
 *  - plural = the noun or pronoun glyph written twice
 *  - the `not` glyph stays where the source sentence put it (position is unconfirmed)
 */
export function arrange(items: Item[]): Line {
  const cells: Cell[] = [];
  let seenVerb = false;

  for (const item of items) {
    if (item.kind !== "word") continue;
    const { entry } = item;

    let role: Role;
    if (entry.id === "not") role = "neg";
    else if (entry.pos === "verb") {
      role = "V";
      seenVerb = true;
    } else if (entry.pos === "other") role = "other";
    else role = seenVerb ? "O" : "S";

    const repeats = item.plural && PLURABLE.has(entry.pos) ? 2 : 1;
    for (let i = 0; i < repeats; i++) {
      cells.push({ glyph: entry.id, entry, role, copy: i > 0, source: item.source });
    }
  }

  const warnings: Warning[] = [];
  const nominals = cells.filter((c) => c.role === "S" || c.role === "O").length;
  if (nominals >= 2 && !cells.some((c) => c.role === "V")) warnings.push("no-verb");

  return { items, cells, warnings };
}
