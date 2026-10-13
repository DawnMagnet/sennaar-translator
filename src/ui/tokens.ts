import type { Entry, Item, Translation } from "../engine/types";
import { label, t, type Lang } from "../i18n";
import { glyphElement } from "../render/glyphs";
import { h } from "./dom";

export interface TokensOptions {
  lang: Lang;
  onReplace: (source: string, replacement: string) => void;
}

function chip(item: Item, lang: Lang): HTMLElement {
  if (item.kind === "word") {
    return h(
      "span",
      { class: "chip chip--word", title: `${item.entry.en[0]} · ${item.entry.zh[0]}` },
      glyphElement(item.entry.id),
      h("span", null, item.source),
      item.plural && h("b", null, "×2"),
    );
  }
  if (item.kind === "ignored") {
    return h("span", { class: "chip chip--ignored", title: t(lang, "ignored") }, item.source);
  }
  return h("span", { class: "chip chip--unknown", title: t(lang, "unknown") }, item.source);
}

function suggestion(entry: Entry, { lang, onReplace }: TokensOptions, source: string): HTMLElement {
  const replacement = lang === "zh" ? entry.zh[0]! : entry.en[0]!;
  return h(
    "button",
    { type: "button", class: "suggestion", onclick: () => onReplace(source, replacement) },
    glyphElement(entry.id),
    label(lang, entry),
  );
}

export function renderTokens(translation: Translation, options: TokensOptions): HTMLElement {
  const { lang } = options;
  const lines = translation.lines.map((line) => {
    const help: HTMLElement[] = [];
    for (const item of line.items) {
      if (item.kind !== "unknown") continue;
      if (item.hint === "third-person") {
        help.push(h("p", { class: "help" }, `“${item.source}”：${t(lang, "thirdPerson")}`));
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
      h("div", { class: "chips" }, ...line.items.map((i) => chip(i, lang))),
      ...help,
    );
  });
  return h("div", { class: "parsed" }, ...lines);
}
