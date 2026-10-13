import {
  byId,
  entryForZh,
  isPlurable,
  lookupEn,
  maxZhTermLength,
  suggestEn,
  suggestZh,
} from "./lexicon";
import type { Item, UnknownItem, WordItem } from "./types";

const SENTENCE_BREAK = /[.!?;。！？；\n]+/;
const TOKEN = /[A-Za-z]+(?:['’][A-Za-z]+)?|[㐀-鿿]+/g;

const EN_FUNCTION_WORDS = new Set(
  `a an the to of is am are was were be been being do does did will would shall should can could
   may might must and or but please that this these those there here very`.split(/\s+/),
);
const EN_THIRD_PERSON = new Set([
  "he",
  "she",
  "it",
  "they",
  "him",
  "her",
  "them",
  "his",
  "its",
  "their",
]);
const EN_FIRST_PERSON_PLURAL = new Set(["we", "us"]);

const ZH_FUNCTION_CHARS = new Set("的了着是吗呢吧啊把被个这那和与并也都一");
const ZH_THIRD_PERSON = ["他们", "她们", "它们", "他", "她", "它"];
const ZH_PRONOUN_PLURAL: Record<string, string> = {
  我们: "me",
  咱们: "me",
  你们: "you",
  您们: "you",
};

const word = (id: string, source: string, plural = false): WordItem => ({
  kind: "word",
  entry: byId.get(id)!,
  source,
  plural,
});

function parseLatin(raw: string): Item {
  const source = raw.replace("’", "'");
  const lower = source.toLowerCase();
  if (lower.endsWith("n't")) return word("not", source);
  if (EN_FUNCTION_WORDS.has(lower)) return { kind: "ignored", source };
  if (EN_FIRST_PERSON_PLURAL.has(lower)) return word("me", source, true);
  if (EN_THIRD_PERSON.has(lower))
    return { kind: "unknown", source, suggestions: [], hint: "third-person" };
  const hit = lookupEn(lower);
  if (hit) return { kind: "word", entry: hit.entry, source, plural: hit.plural };
  return { kind: "unknown", source, suggestions: suggestEn(lower) };
}

function parseCjk(run: string, out: Item[]): void {
  let pending = "";
  const flushUnknown = () => {
    if (!pending) return;
    out.push({ kind: "unknown", source: pending, suggestions: suggestZh(pending) });
    pending = "";
  };

  for (let i = 0; i < run.length;) {
    const pluralPronoun = ZH_PRONOUN_PLURAL[run.slice(i, i + 2)];
    if (pluralPronoun) {
      flushUnknown();
      out.push(word(pluralPronoun, run.slice(i, i + 2), true));
      i += 2;
      continue;
    }

    const third = ZH_THIRD_PERSON.find((p) => run.startsWith(p, i));
    if (third) {
      flushUnknown();
      out.push({
        kind: "unknown",
        source: third,
        suggestions: [],
        hint: "third-person",
      } satisfies UnknownItem);
      i += third.length;
      continue;
    }

    let matched = 0;
    for (let len = Math.min(maxZhTermLength, run.length - i); len >= 1; len--) {
      const entry = entryForZh(run.slice(i, i + len));
      if (entry) {
        flushUnknown();
        out.push({ kind: "word", entry, source: run.slice(i, i + len), plural: false });
        matched = len;
        break;
      }
    }
    if (matched) {
      i += matched;
      continue;
    }

    const char = run[i]!;
    if (char === "们") {
      flushUnknown();
      const previous = out.at(-1);
      if (previous?.kind === "word" && isPlurable(previous.entry)) {
        previous.plural = true;
        previous.source += char;
      } else {
        out.push({ kind: "ignored", source: char });
      }
    } else if (ZH_FUNCTION_CHARS.has(char)) {
      flushUnknown();
      out.push({ kind: "ignored", source: char });
    } else {
      pending += char;
    }
    i++;
  }
  flushUnknown();
}

export function parseSentence(text: string): Item[] {
  const items: Item[] = [];
  for (const match of text.matchAll(TOKEN)) {
    const token = match[0];
    if (/^[A-Za-z]/.test(token)) items.push(parseLatin(token));
    else parseCjk(token, items);
  }
  return items;
}

export function splitSentences(text: string): string[] {
  return text
    .split(SENTENCE_BREAK)
    .map((s) => s.trim())
    .filter(Boolean);
}
