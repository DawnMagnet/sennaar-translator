export type Pos =
  | "pronoun"
  | "person"
  | "verb"
  | "object"
  | "concept"
  | "place"
  | "number"
  | "adjective"
  | "other";

export interface Entry {
  /** Key into the language's glyph table. */
  id: string;
  pos: Pos;
  /** Lemmas; the first one is the headword. Multi-word phrases are allowed. */
  en: string[];
  zh: string[];
  /** Display name for entries that cannot be typed (grammatical markers have no terms). */
  name?: { en: string; zh: string };
  /** Glyph meaning is a guess rather than something the source material states. */
  inferred?: boolean;
}

export const PLURABLE: ReadonlySet<Pos> = new Set<Pos>(["pronoun", "person", "object", "place"]);

export type Role = "S" | "V" | "O" | "mod" | "neg" | "plural" | "question" | "other";

export type UnknownHint = "third-person" | "no-pronouns" | "no-numbers" | "number-range";

export interface WordItem {
  kind: "word";
  entry: Entry;
  source: string;
  plural: boolean;
}

export interface NumberItem {
  kind: "number";
  value: number;
  source: string;
}

export interface IgnoredItem {
  kind: "ignored";
  source: string;
}

export interface UnknownItem {
  kind: "unknown";
  source: string;
  suggestions: Entry[];
  hint?: UnknownHint;
}

export type Item = WordItem | NumberItem | IgnoredItem | UnknownItem;

export interface Cell {
  /** Key into the glyph table, or a synthetic id resolved by the language (numbers, overlays). */
  glyph: string;
  entry: Entry;
  role: Role;
  /** Second and later repetitions produced by plural reduplication. */
  copy: boolean;
  source: string;
}

export type Warning = "no-verb";

export interface Line {
  items: Item[];
  cells: Cell[];
  warnings: Warning[];
}

export interface Sentence {
  text: string;
  question: boolean;
}

export interface Translation {
  lines: Line[];
}
