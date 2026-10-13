import { certaintyKey, grammarNotes, t, type Lang } from "../i18n";
import { h } from "./dom";

export function renderNotes(lang: Lang): HTMLElement {
  return h(
    "ol",
    { class: "notes" },
    ...grammarNotes[lang].map((note) =>
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
