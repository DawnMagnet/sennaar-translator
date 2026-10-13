import { PLURABLE, type Entry } from "./types";

export interface Lexicon {
  entries: readonly Entry[];
  byId: ReadonlyMap<string, Entry>;
  maxZhTermLength: number;
  maxPhraseWords: number;
  /** Exact English lemma, no inflection. */
  exactEn(term: string): Entry | undefined;
  /** English word with simple inflection (plural, 3rd person, -ing, -ed, a few irregulars). */
  lookupEn(word: string): { entry: Entry; plural: boolean } | undefined;
  /** Multi-word English phrase, e.g. "my people". */
  lookupPhrase(words: string[]): Entry | undefined;
  entryForZh(term: string): Entry | undefined;
  suggestEn(word: string, limit?: number): Entry[];
  suggestZh(source: string, limit?: number): Entry[];
}

export const isPlurable = (entry: Entry) => PLURABLE.has(entry.pos);

const IRREGULAR: Record<string, readonly [lemma: string, plural: boolean]> = {
  men: ["man", true],
  people: ["man", true],
  went: ["go", false],
  gone: ["go", false],
  saw: ["see", false],
  seen: ["see", false],
  found: ["find", false],
  made: ["make", false],
  said: ["talk", false],
  told: ["talk", false],
  spoke: ["talk", false],
  spoken: ["talk", false],
  died: ["die", false],
};

/** Candidate lemmas for an inflected English word, most specific first. */
function* lemmaCandidates(word: string): Generator<readonly [lemma: string, viaS: boolean]> {
  yield [word, false];
  if (word.endsWith("ies") && word.length > 4) yield [`${word.slice(0, -3)}y`, true];
  if (word.endsWith("es")) yield [word.slice(0, -2), true];
  if (word.endsWith("s") && !word.endsWith("ss")) yield [word.slice(0, -1), true];
  if (word.endsWith("ing") && word.length > 4) {
    const stem = word.slice(0, -3);
    yield [stem, false];
    yield [`${stem}e`, false];
    if (stem.at(-1) === stem.at(-2)) yield [stem.slice(0, -1), false];
  }
  if (word.endsWith("ied") && word.length > 4) yield [`${word.slice(0, -3)}y`, false];
  if (word.endsWith("ed") && word.length > 3) {
    const stem = word.slice(0, -2);
    yield [stem, false];
    yield [`${stem}e`, false];
    if (stem.at(-1) === stem.at(-2)) yield [stem.slice(0, -1), false];
  }
}

/** Levenshtein distance where swapping two adjacent letters costs one edit. */
function editDistance(a: string, b: string): number {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array<number>(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0]![j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let best = Math.min(d[i - 1]![j]! + 1, d[i]![j - 1]! + 1, d[i - 1]![j - 1]! + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        best = Math.min(best, d[i - 2]![j - 2]! + 1);
      }
      d[i]![j] = best;
    }
  }
  return d[a.length]![b.length]!;
}

function uniqueEntries(ranked: Iterable<Entry>, limit: number): Entry[] {
  const out: Entry[] = [];
  for (const entry of ranked) {
    if (!out.includes(entry)) out.push(entry);
    if (out.length === limit) break;
  }
  return out;
}

export function createLexicon(entries: readonly Entry[]): Lexicon {
  const byId = new Map(entries.map((e) => [e.id, e]));
  const enIndex = new Map<string, Entry>();
  const zhIndex = new Map<string, Entry>();
  for (const entry of entries) {
    for (const term of entry.en) if (!enIndex.has(term)) enIndex.set(term, entry);
    for (const term of entry.zh) if (!zhIndex.has(term)) zhIndex.set(term, entry);
  }
  const enTerms = [...enIndex.keys()].filter((t) => !t.includes(" "));
  const zhTerms = [...zhIndex.keys()];

  return {
    entries,
    byId,
    maxZhTermLength: Math.max(...zhTerms.map((t) => t.length)),
    maxPhraseWords: Math.max(1, ...[...enIndex.keys()].map((t) => t.split(" ").length)),
    exactEn: (term) => enIndex.get(term),
    entryForZh: (term) => zhIndex.get(term),
    lookupPhrase: (words) => enIndex.get(words.join(" ")),

    lookupEn(word) {
      const exact = enIndex.get(word);
      if (exact) return { entry: exact, plural: false };
      const irregular = IRREGULAR[word];
      if (irregular) {
        const entry = enIndex.get(irregular[0]);
        if (entry) return { entry, plural: irregular[1] && isPlurable(entry) };
      }
      for (const [lemma, viaS] of lemmaCandidates(word)) {
        const entry = enIndex.get(lemma);
        if (entry) return { entry, plural: viaS && isPlurable(entry) };
      }
      return undefined;
    },

    suggestEn(word, limit = 3) {
      const maxDistance = word.length >= 4 ? 2 : 1;
      const scored = enTerms
        .map((term) => {
          const near = word.length >= 3 && (term.startsWith(word) || word.startsWith(term));
          return { term, score: near ? 0 : editDistance(word, term) };
        })
        .filter((s) => s.score <= maxDistance)
        .sort((a, b) => a.score - b.score);
      return uniqueEntries(
        scored.map((s) => enIndex.get(s.term)!),
        limit,
      );
    },

    suggestZh(source, limit = 3) {
      const chars = new Set(source);
      const hits = zhTerms.filter((term) => [...term].some((c) => chars.has(c)));
      return uniqueEntries(
        hits.map((term) => zhIndex.get(term)!),
        limit,
      );
    },
  };
}
