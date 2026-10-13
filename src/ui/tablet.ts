import type { Translation } from "../engine/types";
import { label, roleKey, t, type Lang } from "../i18n";
import { glyphElement } from "../render/glyphs";
import { h } from "./dom";

export interface TabletOptions {
  lang: Lang;
  captions: boolean;
  roles: boolean;
}

export function renderTablet(
  translation: Translation,
  { lang, captions, roles }: TabletOptions,
): HTMLElement {
  const lines = translation.lines.filter((line) => line.cells.length > 0);
  if (lines.length === 0) return h("p", { class: "tablet__empty" }, t(lang, "emptyTablet"));

  let index = 0;
  return h(
    "div",
    { class: "tablet__lines" },
    ...lines.map((line) =>
      h(
        "div",
        { class: "line" },
        ...line.cells.map((cell) => {
          const roleName = roleKey[cell.role];
          return h(
            "figure",
            {
              class: "cell",
              "data-role": cell.role,
              "data-copy": cell.copy,
              style: `--i:${index++}`,
              title: `${cell.entry.en[0]} · ${cell.entry.zh[0]}`,
            },
            glyphElement(cell.glyph),
            captions &&
              h("figcaption", null, cell.copy ? t(lang, "plural") : label(lang, cell.entry)),
            roles && roleName && h("span", { class: "cell__role" }, t(lang, roleName)),
          );
        }),
      ),
    ),
  );
}
