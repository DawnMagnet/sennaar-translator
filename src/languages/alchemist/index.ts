import { createLexicon } from "../../engine/lexicon";
import { cellOf, finishLine, tagRoles, type Tagged } from "../../engine/roles";
import { PLURABLE, type Cell, type Entry, type Item, type NumberItem } from "../../engine/types";
import { loadGlyphTable } from "../glyph-table";
import type { LanguageModule } from "../types";
import { ALCHEMIST_CONTENT } from "./content";
import raw from "./glyphs.json";
import { ALCHEMIST_LEXICON } from "./lexicon";
import { NUMBER_PREFIX, composeNumber, digitId } from "./numbers";

const glyphs = loadGlyphTable(raw);
const lexicon = createLexicon(ALCHEMIST_LEXICON);
const pluralMarker = lexicon.byId.get("plural")!;

const NOUN_LIKE = new Set(["person", "object", "place", "concept", "number"]);
const isNounLike = ({ item, role }: Tagged) =>
  item.kind === "number" ||
  (item.kind === "word" && NOUN_LIKE.has(item.entry.pos) && ["S", "O", "mod"].includes(role));

/** Modifiers follow the noun they describe, so a run like "copper mine" is written head first. */
function headFirst(tagged: Tagged[]): Tagged[] {
  const out: Tagged[] = [];
  let run: Tagged[] = [];
  const flush = () => {
    out.push(...run.reverse());
    run = [];
  };
  for (const t of tagged) {
    if (isNounLike(t)) run.push(t);
    else {
      flush();
      out.push(t);
    }
  }
  flush();
  return out;
}

function numberCell({ value, source }: NumberItem): Cell {
  const entry: Entry = {
    id: `${NUMBER_PREFIX}${value}`,
    pos: "number",
    en: [`${value}`],
    zh: [`${value}`],
  };
  const glyph = value < 10 ? digitId(value) : entry.id;
  return cellOf(entry, "mod", source, { glyph });
}

/** Subject-verb-object, plural as a suffix, modifiers after the noun, numbers as one four-quadrant glyph. */
function arrange(items: Item[]) {
  const cells: Cell[] = [];
  for (const { item, role } of headFirst(tagRoles(items))) {
    if (item.kind === "number") {
      cells.push(numberCell(item));
      continue;
    }
    cells.push(cellOf(item.entry, role, item.source));
    if (item.plural && PLURABLE.has(item.entry.pos)) {
      cells.push(cellOf(pluralMarker, "plural", item.source));
    }
  }
  return finishLine(items, cells);
}

export const alchemist: LanguageModule = {
  id: "alchemist",
  lexicon,
  pronouns: "third-person",
  numbers: true,
  glyphs,
  resolveGlyph: (id) =>
    id.startsWith(NUMBER_PREFIX)
      ? composeNumber(glyphs.glyphs, Number(id.slice(NUMBER_PREFIX.length)))
      : undefined,
  content: ALCHEMIST_CONTENT,
  arrange,
};
