import { certaintyKey, t, type Lang } from "../i18n";
import type { LanguageModule } from "../languages/types";
import { h } from "./dom";

export function renderNotes(lang: Lang, language: LanguageModule): HTMLElement {
  return h(
    "ol",
    { class: "notes" },
    ...language.content.notes[lang].map((note) =>
      h(
        "li",
        { class: "note", "data-certainty": note.certainty },
        h(
          "div",
          { class: "note__head" },
          h("h3", null, note.title),
          h("span", { class: "badge" }, t(lang, certaintyKey[note.certainty])),
        ),
        h("p", null, note.body),
      ),
    ),
  );
}
