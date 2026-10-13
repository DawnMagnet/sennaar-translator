import type { LanguageModule } from "../languages/types";
import { parseSentence, splitSentences } from "./parse";
import type { Translation } from "./types";

export function translate(text: string, language: LanguageModule): Translation {
  return {
    lines: splitSentences(text).map(({ text: sentence, question }) =>
      language.arrange(parseSentence(sentence, language), { question }),
    ),
  };
}
