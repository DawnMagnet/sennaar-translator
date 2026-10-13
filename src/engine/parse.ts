import type { LanguageModule } from "../languages/types";
import { isPlurable } from "./lexicon";
import type { Item, Sentence, UnknownHint, UnknownItem, WordItem } from "./types";

type ParseTarget = Pick<LanguageModule, "lexicon" | "pronouns" | "numbers">;

const SENTENCE = /([^.!?;。！？；\n]+)([.!?;。！？；\n]*)/g;
const TOKEN = /[A-Za-z]+(?:['’][A-Za-z]+)?|[㐀-鿿]+|\d+/g;

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
const EN_FIRST_SECOND = new Set(["i", "me", "my", "you", "your", "we", "us", "our"]);
const EN_FIRST_PERSON_PLURAL = new Set(["we", "us"]);

const ZH_FUNCTION_CHARS = new Set("的了着是吗呢吧啊把被个这那和与并也都一");
const ZH_THIRD_PERSON = ["他们", "她们", "它们", "他", "她", "它"];
const ZH_FIRST_SECOND = ["我们", "咱们", "你们", "您们", "我", "你", "您", "咱"];
const ZH_PRONOUN_PLURAL: Record<string, string> = {
  我们: "me",
  咱们: "me",
  你们: "you",
  您们: "you",
};

const sentenceQuestion = (text: string, terminator: string) =>
  /[?？]/.test(terminator) || /[吗呢]$/.test(text);

export function splitSentences(text: string): Sentence[] {
  const out: Sentence[] = [];
  for (const [, body, terminator] of text.matchAll(SENTENCE)) {
    const trimmed = body!.trim();
    if (trimmed) out.push({ text: trimmed, question: sentenceQuestion(trimmed, terminator ?? "") });
  }
  return out;
}

function unknown(
  source: string,
  hint?: UnknownHint,
  suggestions: UnknownItem["suggestions"] = [],
): UnknownItem {
  return { kind: "unknown", source, suggestions, ...(hint ? { hint } : {}) };
}

function wordOf(
  lang: ParseTarget,
  id: string,
  source: string,
  plural = false,
): WordItem | undefined {
  const entry = lang.lexicon.byId.get(id);
  return entry ? { kind: "word", entry, source, plural } : undefined;
}

function parseLatin(raw: string, lang: ParseTarget): Item {
  const lex = lang.lexicon;
  const source = raw.replace("’", "'");
  const lower = source.toLowerCase();

  if (lower.endsWith("n't")) return wordOf(lang, "not", source) ?? { kind: "ignored", source };

  const exact = lex.exactEn(lower);
  if (exact) return { kind: "word", entry: exact, source, plural: false };

  if (EN_THIRD_PERSON.has(lower))
    return unknown(source, lang.pronouns === "none" ? "no-pronouns" : "third-person");
  if (lang.pronouns === "none" && EN_FIRST_SECOND.has(lower)) return unknown(source, "no-pronouns");
  if (EN_FIRST_PERSON_PLURAL.has(lower)) {
    const me = wordOf(lang, "me", source, true);
    if (me) return me;
  }
  if (EN_FUNCTION_WORDS.has(lower)) return { kind: "ignored", source };

  const hit = lex.lookupEn(lower);
  if (hit) return { kind: "word", entry: hit.entry, source, plural: hit.plural };
  return unknown(source, undefined, lex.suggestEn(lower));
}

function parseCjk(run: string, out: Item[], lang: ParseTarget): void {
  const lex = lang.lexicon;
  let pending = "";
  const flushUnknown = () => {
    if (!pending) return;
    out.push(unknown(pending, undefined, lex.suggestZh(pending)));
    pending = "";
  };

  for (let i = 0; i < run.length;) {
    let matched = 0;
    for (let len = Math.min(lex.maxZhTermLength, run.length - i); len >= 2; len--) {
      const entry = lex.entryForZh(run.slice(i, i + len));
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

    const plural = ZH_PRONOUN_PLURAL[run.slice(i, i + 2)];
    const third = ZH_THIRD_PERSON.find((p) => run.startsWith(p, i));
    const personal = ZH_FIRST_SECOND.find((p) => run.startsWith(p, i));
    if (plural && lang.pronouns !== "none") {
      const item = wordOf(lang, plural, run.slice(i, i + 2), true);
      if (item) {
        flushUnknown();
        out.push(item);
        i += 2;
        continue;
      }
    }
    if (third || (personal && lang.pronouns === "none")) {
      const source = (third ?? personal)!;
      flushUnknown();
      out.push(unknown(source, lang.pronouns === "none" ? "no-pronouns" : "third-person"));
      i += source.length;
      continue;
    }

    const single = lex.entryForZh(run[i]!);
    if (single) {
      flushUnknown();
      out.push({ kind: "word", entry: single, source: run[i]!, plural: false });
      i++;
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

function parseDigits(token: string, lang: ParseTarget): Item {
  if (!lang.numbers) return unknown(token, "no-numbers");
  const value = Number(token);
  if (token.length > 4 || value > 9999) return unknown(token, "number-range");
  return { kind: "number", value, source: token };
}

export function parseSentence(text: string, lang: ParseTarget): Item[] {
  const tokens = [...text.matchAll(TOKEN)].map((m) => m[0]);
  const isLatin = (t: string | undefined) => !!t && /^[A-Za-z]/.test(t);
  const items: Item[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]!;
    if (isLatin(token)) {
      let phrase: WordItem | undefined;
      for (let k = Math.min(lang.lexicon.maxPhraseWords, tokens.length - i); k >= 2; k--) {
        const words = tokens.slice(i, i + k);
        if (!words.every(isLatin)) continue;
        const entry = lang.lexicon.lookupPhrase(words.map((w) => w.toLowerCase()));
        if (entry) {
          phrase = { kind: "word", entry, source: words.join(" "), plural: false };
          i += k - 1;
          break;
        }
      }
      items.push(phrase ?? parseLatin(token, lang));
    } else if (/^\d/.test(token)) {
      items.push(parseDigits(token, lang));
    } else {
      parseCjk(token, items, lang);
    }
  }
  return items;
}
