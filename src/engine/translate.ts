import { arrange } from "./devotee";
import { parseSentence, splitSentences } from "./parse";
import type { Translation } from "./types";

export function translate(text: string): Translation {
  return { lines: splitSentences(text).map((sentence) => arrange(parseSentence(sentence))) };
}
