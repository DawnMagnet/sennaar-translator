import "./styles.css";
import { translate } from "./engine/translate";
import type { Entry, Translation } from "./engine/types";
import { entries } from "./engine/lexicon";
import { iconMarkup, type IconName } from "./art/icons";
import { logoSvg } from "./art/logo";
import { sceneMarkup } from "./art/scene";
import { PALETTE } from "./art/util";
import { label, t, type Lang } from "./i18n";
import { composeSvg, download, svgToPng, type ExportCell } from "./render/export";
import { renderDictionary } from "./ui/dictionary";
import { clear, fromMarkup, h } from "./ui/dom";
import { renderNotes } from "./ui/notes";
import { renderTablet } from "./ui/tablet";
import { renderTokens } from "./ui/tokens";

const INK = PALETTE.wine;
const PAPER = PALETTE.cream;

const EXAMPLES: Record<Lang, string[]> = {
  zh: ["我爱你", "信徒寻找神", "我没有找到钥匙", "祭司说话。我们看见门"],
  en: [
    "I love you",
    "The devotees seek god",
    "I did not find the key",
    "The priest talks. We see the door",
  ],
};

interface State {
  lang: Lang;
  text: string;
  captions: boolean;
  roles: boolean;
}

const params = new URLSearchParams(location.hash.slice(1));
const hashLang = params.get("l");
const lang: Lang =
  hashLang === "zh" || hashLang === "en"
    ? hashLang
    : navigator.language.toLowerCase().startsWith("zh")
      ? "zh"
      : "en";

const state: State = {
  lang,
  text: params.get("t") ?? EXAMPLES[lang][1]!,
  captions: true,
  roles: false,
};

let current: Translation = { lines: [] };
let hashTimer: ReturnType<typeof setTimeout> | undefined;

const app = document.getElementById("app")!;

function syncHash(): void {
  clearTimeout(hashTimer);
  hashTimer = setTimeout(() => {
    const next = new URLSearchParams({ l: state.lang });
    if (state.text.trim()) next.set("t", state.text);
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

const buildSvg = () => composeSvg(exportLines(), { color: INK, background: PAPER });

function build(): void {
  const { lang } = state;
  clear(app);
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  document.title = `${t(lang, "title")} · Sennaar Translator`;

  const textarea = h("textarea", {
    id: "input",
    rows: 3,
    placeholder: t(lang, "inputPlaceholder"),
    spellcheck: false,
    autocomplete: "off",
    oninput: () => {
      state.text = textarea.value;
      update();
      syncHash();
    },
  });
  textarea.value = state.text;

  const tabletBody = h("div", { class: "tablet__body", "aria-live": "polite" });
  const parsedBody = h("div");
  const exportButtons: HTMLButtonElement[] = [];

  const setText = (text: string) => {
    state.text = text;
    textarea.value = text;
    update();
    syncHash();
    textarea.focus();
  };

  const replaceWord = (source: string, replacement: string) => {
    const escaped = source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    setText(state.text.replace(new RegExp(escaped, "i"), replacement));
  };

  const pick = (entry: Entry) => {
    const base = state.text.trimEnd();
    setText(`${base ? `${base} ` : ""}${lang === "zh" ? entry.zh[0] : entry.en[0]}`);
  };

  function update(): void {
    current = translate(state.text);
    tabletBody.replaceChildren(renderTablet(current, state));
    parsedBody.replaceChildren(renderTokens(current, { lang, onReplace: replaceWord }));
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

  const tabs: [string, boolean][] = [
    [t(lang, "tabDevotees"), true],
    [t(lang, "tabWarriors"), false],
    [t(lang, "tabBards"), false],
    [t(lang, "tabAlchemists"), false],
    [t(lang, "tabAnchorites"), false],
  ];

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
      ...tabs.map(([name, active]) =>
        h(
          "button",
          {
            type: "button",
            class: "tab",
            disabled: !active,
            "aria-current": active ? "page" : null,
            title: active ? null : t(lang, "comingSoon"),
          },
          !active && fromMarkup(iconMarkup("lock")),
          name,
        ),
      ),
    ),
    h(
      "main",
      null,
      h(
        "section",
        { class: "panel" },
        h("label", { class: "panel__title", for: "input" }, t(lang, "inputLabel")),
        textarea,
        h("p", { class: "hint" }, t(lang, "inputHint")),
        h(
          "div",
          { class: "examples" },
          h("span", null, t(lang, "examples")),
          ...EXAMPLES[lang].map((example) =>
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
            actionButton("exportSvg", () => download(buildSvg(), "sennaar-devotee.svg")),
            actionButton("exportPng", async () => {
              try {
                download(await svgToPng(buildSvg()), "sennaar-devotee.png", "image/png");
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
        h("h2", { class: "panel__title" }, `${t(lang, "dictionary")} · ${entries.length}`),
        h("p", { class: "hint" }, t(lang, "dictionaryHint")),
        renderDictionary(lang, pick),
      ),
      h(
        "section",
        { class: "panel" },
        h("h2", { class: "panel__title" }, t(lang, "grammar")),
        renderNotes(lang),
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
