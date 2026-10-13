import { createLexicon } from "../../engine/lexicon";
import { cellOf, finishLine, tagRoles } from "../../engine/roles";
import {
  PLURABLE,
  type Cell,
  type Entry,
  type Item,
  type Role,
  type WordItem,
} from "../../engine/types";
import { loadGlyphTable } from "../glyph-table";
import type { LanguageModule } from "../types";
import { ANCHORITE_CONTENT } from "./content";
import raw from "./glyphs.json";
import { ANCHORITE_LEXICON } from "./lexicon";
import { NOT_OVERLAY, PLURAL_OVERLAY, overlay } from "./overlay";

const glyphs = loadGlyphTable(raw);
const lexicon = createLexicon(ANCHORITE_LEXICON);

/** Nouns the game writes as a ready-made plural glyph. */
const PLURAL_FORM: Readonly<Record<string, string>> = {
  door: "doors",
  people: "peoples",
  me: "we",
};

/** Verbs whose negation the game writes as its own glyph; negating either one gives the other. */
const NEGATED_VERB: Readonly<Record<string, string>> = {
  go: "stop",
  stop: "go",
  seek: "disregard",
  disregard: "seek",
  die: "revive",
  revive: "die",
};

const first = (terms: string[], fallback: string) => terms[0] ?? fallback;

function derivedEntry(base: Entry, kind: "plural" | "not"): Entry {
  const en = first(base.en, base.id);
  const zh = first(base.zh, base.id);
  return kind === "plural"
    ? {
        id: `${PLURAL_OVERLAY}${base.id}`,
        pos: base.pos,
        en: [`${en} (plural)`],
        zh: [`${zh}（复数）`],
      }
    : { id: `${NOT_OVERLAY}${base.id}`, pos: base.pos, en: [`not ${en}`], zh: [`不${zh}`] };
}

function nounCell({ entry, source, plural }: WordItem, role: Role): Cell {
  if (!plural || !PLURABLE.has(entry.pos)) return cellOf(entry, role, source);
  const ready = PLURAL_FORM[entry.id];
  if (ready) return cellOf(lexicon.byId.get(ready)!, role, source);
  return cellOf(derivedEntry(entry, "plural"), role, source);
}

function negatedVerbCell(not: WordItem, verb: WordItem): Cell {
  const source = `${not.source} ${verb.source}`;
  const ready = NEGATED_VERB[verb.entry.id];
  if (ready) return cellOf(lexicon.byId.get(ready)!, "V", source);
  return cellOf(derivedEntry(verb.entry, "not"), "V", source);
}

/**
 * Subject-verb-object. Plural and negation are radicals drawn into the glyph itself rather than separate
 * words: the game's ready-made glyphs are used where they exist, and the radical is overlaid otherwise.
 */
function arrange(items: Item[]) {
  const tagged = tagRoles(items);
  const cells: Cell[] = [];
  for (let i = 0; i < tagged.length; i++) {
    const { item, role } = tagged[i]!;
    if (item.kind !== "word") continue;
    const next = tagged[i + 1];
    if (role === "neg" && next?.role === "V" && next.item.kind === "word") {
      cells.push(negatedVerbCell(item, next.item));
      i++;
    } else {
      cells.push(nounCell(item, role));
    }
  }
  return finishLine(items, cells);
}

export const anchorite: LanguageModule = {
  id: "anchorite",
  lexicon,
  pronouns: "third-person",
  numbers: false,
  glyphs,
  resolveGlyph(id) {
    if (id.startsWith(PLURAL_OVERLAY)) {
      return overlay(glyphs.glyphs, id.slice(PLURAL_OVERLAY.length), "plural");
    }
    if (id.startsWith(NOT_OVERLAY))
      return overlay(glyphs.glyphs, id.slice(NOT_OVERLAY.length), "not");
    return undefined;
  },
  content: ANCHORITE_CONTENT,
  arrange,
};
