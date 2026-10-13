export type Pos = "pronoun" | "person" | "verb" | "object" | "concept" | "place" | "other";

export interface Entry {
  /** Key into the glyph table (the font's ligature input). */
  id: string;
  pos: Pos;
  /** Lemmas; the first one is the headword. */
  en: string[];
  zh: string[];
  /** Glyph meaning is a guess rather than something the source material states. */
  inferred?: boolean;
}

export const PLURABLE: ReadonlySet<Pos> = new Set<Pos>(["pronoun", "person", "object", "place"]);

export type Role = "S" | "V" | "O" | "neg" | "other";

export type UnknownHint = "third-person";

export interface WordItem {
  kind: "word";
  entry: Entry;
  source: string;
  plural: boolean;
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

export type Item = WordItem | IgnoredItem | UnknownItem;

export interface Cell {
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

export interface Translation {
  lines: Line[];
}
