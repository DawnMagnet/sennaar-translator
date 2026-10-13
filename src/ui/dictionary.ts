import type { Entry, Pos } from "../engine/types";
import { label, posKey, t, typedForm, type Lang } from "../i18n";
import type { LanguageModule } from "../languages/types";
import { glyphElement } from "../render/glyphs";
import { h } from "./dom";

const ORDER: Pos[] = [
  "pronoun",
  "person",
  "verb",
  "object",
  "concept",
  "place",
  "adjective",
  "number",
  "other",
];

export function renderDictionary(
  lang: Lang,
  language: LanguageModule,
  onPick: (entry: Entry) => void,
): HTMLElement {
  return h(
    "div",
    { class: "dictionary" },
    ...ORDER.map((pos) => {
      const group = language.lexicon.entries.filter((e) => e.pos === pos);
      if (group.length === 0) return null;
      return h(
        "section",
        { class: "dictionary__group" },
        h("h3", null, t(lang, posKey[pos])),
        h(
          "div",
          { class: "dictionary__grid" },
          ...group.map((entry) => {
            const typable = typedForm(lang, entry) !== undefined;
            return h(
              "button",
              {
                type: "button",
                class: "card",
                disabled: !typable,
                title: [
                  entry.en.join(", ") || label("en", entry),
                  entry.zh.join("、") || label("zh", entry),
                ].join("\n"),
                onclick: () => onPick(entry),
              },
              glyphElement(language, entry.id),
              h("span", { class: "card__label" }, label(lang, entry)),
              entry.inferred &&
                h("i", { class: "card__inferred", title: t(lang, "inferred") }, "?"),
            );
          }),
        ),
      );
    }),
  );
}
