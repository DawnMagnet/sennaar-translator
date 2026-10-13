import "./styles.css";
import { iconMarkup, type IconName } from "./art/icons";
import { logoSvg } from "./art/logo";
import { sceneMarkup } from "./art/scene";
import { PALETTE } from "./art/util";
import { translate } from "./engine/translate";
import type { Entry, Translation } from "./engine/types";
import { label, t, tabKey, typedForm, type Lang } from "./i18n";
import { LANGUAGE_ORDER, getLanguage, isLanguageId } from "./languages";
import type { LanguageId } from "./languages/types";
import { composeSvg, download, svgToPng, type ExportCell } from "./render/export";
import { renderDictionary } from "./ui/dictionary";
import { clear, fromMarkup, h } from "./ui/dom";
import { renderNotes } from "./ui/notes";
import { renderTablet } from "./ui/tablet";
import { renderTokens } from "./ui/tokens";

const INK = PALETTE.wine;
const PAPER = PALETTE.cream;

interface State {
  lang: Lang;
  languageId: LanguageId;
  /** Text typed per language, so switching tabs does not lose it. */
  texts: Partial<Record<LanguageId, string>>;
  captions: boolean;
  roles: boolean;
}

const params = new URLSearchParams(location.hash.slice(1));
const hashLang = params.get("l");
const hashTab = params.get("g");
const lang: Lang =
  hashLang === "zh" || hashLang === "en"
    ? hashLang
    : navigator.language.toLowerCase().startsWith("zh")
      ? "zh"
      : "en";
const initialId: LanguageId = isLanguageId(hashTab) && getLanguage(hashTab) ? hashTab : "devotee";

const state: State = {
  lang,
  languageId: initialId,
  texts: params.has("t") ? { [initialId]: params.get("t")! } : {},
  captions: true,
  roles: false,
};

let current: Translation = { lines: [] };
let hashTimer: ReturnType<typeof setTimeout> | undefined;

const app = document.getElementById("app")!;
const activeLanguage = () => getLanguage(state.languageId)!;
const defaultText = () => activeLanguage().content.examples[state.lang][1] ?? "";
const currentText = () => state.texts[state.languageId] ?? defaultText();

function syncHash(): void {
  clearTimeout(hashTimer);
  hashTimer = setTimeout(() => {
    const next = new URLSearchParams({ l: state.lang, g: state.languageId });
    if (currentText().trim()) next.set("t", currentText());
    history.replaceState(null, "", `#${next}`);
  }, 250);
}

function toast(message: string): void {
  const el = h("div", { class: "toast", role: "status" }, message);
  document.body.append(el);
  setTimeout(() => el.remove(), 2200);
}

function exportLines(): ExportCell[][] {
  return current.lines
    .filter((line) => line.cells.length > 0)
    .map((line) =>
      line.cells.map((cell) => ({
        glyph: cell.glyph,
        caption: state.captions && !cell.copy ? label(state.lang, cell.entry) : undefined,
      })),
    );
}

const buildSvg = () =>
  composeSvg(activeLanguage(), exportLines(), { color: INK, background: PAPER });

function build(): void {
  const { lang } = state;
  const language = activeLanguage();
  clear(app);
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  document.title = `${language.content.name[lang]} · ${t(lang, "title")}`;

  const textarea = h("textarea", {
    id: "input",
    rows: 3,
    placeholder: t(lang, "inputPlaceholder"),
    spellcheck: false,
    autocomplete: "off",
    oninput: () => {
      state.texts[state.languageId] = textarea.value;
      update();
      syncHash();
    },
  });
  textarea.value = currentText();

  const tabletBody = h("div", { class: "tablet__body", "aria-live": "polite" });
  const parsedBody = h("div");
  const exportButtons: HTMLButtonElement[] = [];

  const setText = (text: string) => {
    state.texts[state.languageId] = text;
    textarea.value = text;
    update();
    syncHash();
    textarea.focus();
  };

  const replaceWord = (source: string, replacement: string) => {
    const escaped = source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    setText(currentText().replace(new RegExp(escaped, "i"), replacement));
  };

  const pick = (entry: Entry) => {
    const word = typedForm(lang, entry);
    if (!word) return;
    const base = currentText().trimEnd();
    setText(`${base ? `${base} ` : ""}${word}`);
  };

  function update(): void {
    current = translate(currentText(), language);
    tabletBody.replaceChildren(renderTablet(current, { ...state, language }));
    parsedBody.replaceChildren(renderTokens(current, { lang, language, onReplace: replaceWord }));
    const empty = !current.lines.some((l) => l.cells.length > 0);
    for (const b of exportButtons) b.disabled = empty;
  }

  const ACTION_ICONS: Record<"exportSvg" | "exportPng" | "copyLink", IconName> = {
    exportSvg: "download",
    exportPng: "image",
    copyLink: "link",
  };

  const actionButton = (key: "exportSvg" | "exportPng" | "copyLink", onclick: () => void) => {
    const button = h(
      "button",
      { type: "button", class: "btn", onclick },
      fromMarkup(iconMarkup(ACTION_ICONS[key])),
      t(lang, key),
    );
    if (key !== "copyLink") exportButtons.push(button);
    return button;
  };

  const toggle = (key: "showCaptions" | "showRoles", field: "captions" | "roles") =>
    h(
      "label",
      { class: "toggle" },
      h("input", {
        type: "checkbox",
        checked: state[field],
        onchange: (e: Event) => {
          state[field] = (e.target as HTMLInputElement).checked;
          update();
        },
      }),
      t(lang, key),
    );

  const selectLanguage = (id: LanguageId) => {
    if (id === state.languageId) return;
    state.languageId = id;
    syncHash();
    build();
  };

  app.append(
    fromMarkup(sceneMarkup()),
    h(
      "header",
      { class: "top" },
      h(
        "div",
        { class: "brand" },
        fromMarkup(logoSvg()),
        h(
          "div",
          { class: "brand__text" },
          h("h1", null, t(lang, "title")),
          h("p", null, t(lang, "subtitle")),
        ),
      ),
      h(
        "button",
        {
          type: "button",
          class: "btn btn--ghost lang-toggle",
          "aria-label": "Switch language",
          onclick: () => {
            state.lang = lang === "zh" ? "en" : "zh";
            syncHash();
            build();
          },
        },
        lang === "zh" ? "EN" : "中文",
      ),
    ),
    h(
      "nav",
      { class: "tabs" },
      ...LANGUAGE_ORDER.map((id) => {
        const available = getLanguage(id) !== undefined;
        return h(
          "button",
          {
            type: "button",
            class: "tab",
            disabled: !available,
            "aria-current": id === state.languageId ? "page" : null,
            title: available ? null : t(lang, "comingSoon"),
            onclick: () => selectLanguage(id),
          },
          !available && fromMarkup(iconMarkup("lock")),
          t(lang, tabKey[id]),
        );
      }),
    ),
    h(
      "main",
      null,
      h(
        "section",
        { class: "panel" },
        h("label", { class: "panel__title", for: "input" }, t(lang, "inputLabel")),
        h("p", { class: "blurb" }, language.content.blurb[lang]),
        textarea,
        h("p", { class: "hint" }, t(lang, "inputHint")),
        h(
          "div",
          { class: "examples" },
          h("span", null, t(lang, "examples")),
          ...language.content.examples[lang].map((example) =>
            h(
              "button",
              { type: "button", class: "pill", onclick: () => setText(example) },
              example,
            ),
          ),
        ),
      ),
      h(
        "section",
        { class: "tablet" },
        h(
          "div",
          { class: "tablet__bar" },
          h(
            "div",
            { class: "toggles" },
            toggle("showCaptions", "captions"),
            toggle("showRoles", "roles"),
          ),
          h(
            "div",
            { class: "actions" },
            actionButton("exportSvg", () => download(buildSvg(), `sennaar-${language.id}.svg`)),
            actionButton("exportPng", async () => {
              try {
                download(await svgToPng(buildSvg()), `sennaar-${language.id}.png`, "image/png");
              } catch {
                toast(t(lang, "exportFailed"));
              }
            }),
            actionButton("copyLink", async () => {
              try {
                await navigator.clipboard.writeText(location.href);
                toast(t(lang, "linkCopied"));
              } catch {
                toast(t(lang, "copyFailed"));
              }
            }),
          ),
        ),
        tabletBody,
      ),
      h(
        "section",
        { class: "panel" },
        h("h2", { class: "panel__title" }, t(lang, "tokens")),
        parsedBody,
      ),
      h(
        "section",
        { class: "panel" },
        h(
          "h2",
          { class: "panel__title" },
          `${t(lang, "dictionary")} · ${language.lexicon.entries.length}`,
        ),
        h("p", { class: "hint" }, t(lang, "dictionaryHint")),
        renderDictionary(lang, language, pick),
      ),
      h(
        "section",
        { class: "panel" },
        h("h2", { class: "panel__title" }, t(lang, "grammar")),
        renderNotes(lang, language),
      ),
    ),
    h(
      "footer",
      { class: "foot" },
      h("p", null, t(lang, "footerDisclaimer")),
      h("p", null, t(lang, "footerCredits")),
    ),
  );

  update();
}

build();
