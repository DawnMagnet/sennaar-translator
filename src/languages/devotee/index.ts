import { createLexicon } from "../../engine/lexicon";
import { cellOf, finishLine, tagRoles } from "../../engine/roles";
import { PLURABLE, type Cell, type Item } from "../../engine/types";
import { loadGlyphTable } from "../glyph-table";
import type { LanguageModule } from "../types";
import { DEVOTEE_CONTENT } from "./content";
import raw from "./glyphs.json";
import { DEVOTEE_LEXICON } from "./lexicon";

/** Subject-verb-object; plural by writing the noun or pronoun twice; no tense, articles or copula. */
function arrange(items: Item[]) {
  const cells: Cell[] = [];
  for (const { item, role } of tagRoles(items)) {
    const repeats = item.plural && PLURABLE.has(item.entry.pos) ? 2 : 1;
    for (let i = 0; i < repeats; i++) {
      cells.push(cellOf(item.entry, role, item.source, { copy: i > 0 }));
    }
  }
  return finishLine(items, cells);
}

export const devotee: LanguageModule = {
  id: "devotee",
  lexicon: createLexicon(DEVOTEE_LEXICON),
  pronouns: "third-person",
  numbers: false,
  glyphs: loadGlyphTable(raw),
  content: DEVOTEE_CONTENT,
  arrange,
};
