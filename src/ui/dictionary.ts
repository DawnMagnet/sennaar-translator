import { entries } from "../engine/lexicon";
import type { Entry, Pos } from "../engine/types";
import { label, posKey, t, type Lang } from "../i18n";
import { glyphElement } from "../render/glyphs";
import { h } from "./dom";

const ORDER: Pos[] = ["pronoun", "person", "verb", "object", "concept", "place", "other"];

export function renderDictionary(lang: Lang, onPick: (entry: Entry) => void): HTMLElement {
  return h(
    "div",
    { class: "dictionary" },
    ...ORDER.map((pos) => {
      const group = entries.filter((e) => e.pos === pos);
      return h(
        "section",
        { class: "dictionary__group" },
        h("h3", null, t(lang, posKey[pos])),
        h(
          "div",
          { class: "dictionary__grid" },
          ...group.map((entry) =>
            h(
              "button",
              {
                type: "button",
                class: "card",
                title: `${entry.en.join(", ")}\n${entry.zh.join("、")}`,
                onclick: () => onPick(entry),
              },
              glyphElement(entry.id),
              h("span", { class: "card__label" }, label(lang, entry)),
              entry.inferred &&
                h("i", { class: "card__inferred", title: t(lang, "inferred") }, "?"),
            ),
          ),
        ),
      );
    }),
  );
}
