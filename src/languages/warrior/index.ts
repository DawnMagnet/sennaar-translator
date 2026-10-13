import { createLexicon } from "../../engine/lexicon";
import { cellOf, finishLine, tagRoles } from "../../engine/roles";
import { PLURABLE, type Cell, type Item } from "../../engine/types";
import { loadGlyphTable } from "../glyph-table";
import type { LanguageModule } from "../types";
import { WARRIOR_CONTENT } from "./content";
import raw from "./glyphs.json";
import { WARRIOR_LEXICON } from "./lexicon";

const lexicon = createLexicon(WARRIOR_LEXICON);
const pluralMarker = lexicon.byId.get("plural")!;

/** Subject-verb-object; plural marker and negation are prefixes; no personal pronouns. */
function arrange(items: Item[]) {
  const cells: Cell[] = [];
  for (const { item, role } of tagRoles(items)) {
    if (item.kind !== "word") continue;
    if (item.plural && PLURABLE.has(item.entry.pos)) {
      cells.push(cellOf(pluralMarker, "plural", item.source));
    }
    cells.push(cellOf(item.entry, role, item.source));
  }
  return finishLine(items, cells);
}

export const warrior: LanguageModule = {
  id: "warrior",
  lexicon,
  pronouns: "none",
  numbers: false,
  glyphs: loadGlyphTable(raw),
  content: WARRIOR_CONTENT,
  arrange,
};
