import { createLexicon } from "../../engine/lexicon";
import { cellOf, finishLine, tagRoles, type Tagged } from "../../engine/roles";
import { PLURABLE, type Cell, type Item } from "../../engine/types";
import { loadGlyphTable } from "../glyph-table";
import type { ArrangeContext, LanguageModule } from "../types";
import { BARD_CONTENT } from "./content";
import raw from "./glyphs.json";
import { BARD_LEXICON } from "./lexicon";

const lexicon = createLexicon(BARD_LEXICON);
const marker = (id: string) => lexicon.byId.get(id)!;

/**
 * "Are you a bard?" puts the copula first. Bard grammar needs subject and object, so the first
 * nominal after a leading "be" becomes the subject and the rest become objects.
 */
function undoCopulaInversion(body: Tagged[]): void {
  const [first, ...rest] = body;
  const isBe = first?.item.kind === "word" && first.item.entry.id === "be";
  const nominals = rest.filter((t) => t.role === "S" || t.role === "O");
  if (!isBe || nominals.length < 2) return;
  nominals.forEach((t, i) => (t.role = i === 0 ? "S" : "O"));
}

/**
 * Object-subject-verb, or verb-subject when there is no object. The plural marker follows its noun.
 * Negation wraps the whole sentence, and the question marker wraps outside the negation.
 */
function arrange(items: Item[], { question }: ArrangeContext) {
  const tagged = tagRoles(items);
  const negation = tagged.find((t) => t.role === "neg");
  const body = tagged.filter((t) => t.role !== "neg");
  if (question) undoCopulaInversion(body);

  const of = (role: Tagged["role"]) => body.filter((t) => t.role === role);
  const [others, objects, subjects, verbs] = [of("other"), of("O"), of("S"), of("V")];
  let ordered = body;
  if (verbs.length > 0) {
    ordered =
      objects.length > 0
        ? [...others, ...objects, ...subjects, ...verbs]
        : [...others, ...verbs, ...subjects];
  }

  const core: Cell[] = ordered.flatMap(({ item, role }) => {
    if (item.kind !== "word") return [];
    const cells = [cellOf(item.entry, role, item.source)];
    if (item.plural && PLURABLE.has(item.entry.pos)) {
      cells.push(cellOf(marker("plural"), "plural", item.source));
    }
    return cells;
  });

  let cells = core;
  if (negation && negation.item.kind === "word") {
    const not = cellOf(negation.item.entry, "neg", negation.item.source);
    cells = core.length > 0 ? [not, ...core, not] : [not];
  }
  if (question && cells.length > 0) {
    const mark = cellOf(marker("question"), "question", "?");
    cells = [mark, ...cells, mark];
  }
  return finishLine(items, cells);
}

export const bard: LanguageModule = {
  id: "bard",
  lexicon,
  pronouns: "third-person",
  numbers: false,
  connected: true,
  glyphs: loadGlyphTable(raw),
  content: BARD_CONTENT,
  arrange,
};
