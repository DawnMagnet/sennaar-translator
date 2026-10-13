import type { Entry, Item, Translation, UnknownHint } from "../engine/types";
import { label, t, type Key, type Lang } from "../i18n";
import type { LanguageModule } from "../languages/types";
import { glyphElement } from "../render/glyphs";
import { h } from "./dom";

export interface TokensOptions {
  lang: Lang;
  language: LanguageModule;
  onReplace: (source: string, replacement: string) => void;
}

const HINT_KEYS: Record<UnknownHint, Key> = {
  "third-person": "thirdPerson",
  "no-pronouns": "noPronouns",
  "no-numbers": "noNumbers",
  "number-range": "numberRange",
};

function chip(item: Item, { lang, language }: TokensOptions): HTMLElement {
  if (item.kind === "word") {
    return h(
      "span",
      {
        class: "chip chip--word",
        title: `${label("en", item.entry)} · ${label("zh", item.entry)}`,
      },
      glyphElement(language, item.entry.id),
      h("span", null, item.source),
      item.plural && h("b", null, "×2"),
    );
  }
  if (item.kind === "number") {
    return h("span", { class: "chip chip--word" }, h("span", null, item.source));
  }
  if (item.kind === "ignored") {
    return h("span", { class: "chip chip--ignored", title: t(lang, "ignored") }, item.source);
  }
  return h("span", { class: "chip chip--unknown", title: t(lang, "unknown") }, item.source);
}

function suggestion(entry: Entry, options: TokensOptions, source: string): HTMLElement {
  const { lang, language, onReplace } = options;
  return h(
    "button",
    {
      type: "button",
      class: "suggestion",
      onclick: () => onReplace(source, (lang === "zh" ? entry.zh[0] : entry.en[0]) ?? source),
    },
    glyphElement(language, entry.id),
    label(lang, entry),
  );
}

export function renderTokens(translation: Translation, options: TokensOptions): HTMLElement {
  const { lang, language } = options;
  const lines = translation.lines.map((line) => {
    const help: HTMLElement[] = [];
    for (const item of line.items) {
      if (item.kind !== "unknown") continue;
      if (item.hint) {
        const text = language.content.hints?.[item.hint]?.[lang] ?? t(lang, HINT_KEYS[item.hint]);
        help.push(h("p", { class: "help" }, `“${item.source}”：${text}`));
      } else if (item.suggestions.length > 0) {
        help.push(
          h(
            "p",
            { class: "help" },
            `“${item.source}” ${t(lang, "didYouMean")}`,
            ...item.suggestions.map((entry) => suggestion(entry, options, item.source)),
          ),
        );
      } else {
        help.push(h("p", { class: "help" }, `“${item.source}”：${t(lang, "unknown")}`));
      }
    }
    if (line.warnings.includes("no-verb")) help.push(h("p", { class: "help" }, t(lang, "noVerb")));

    return h(
      "div",
      { class: "parsed-line" },
      h("div", { class: "chips" }, ...line.items.map((i) => chip(i, options))),
      ...help,
    );
  });
  return h("div", { class: "parsed" }, ...lines);
}
