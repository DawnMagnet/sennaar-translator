import type { Entry, Pos, Role } from "./engine/types";
import type { LangCode, LanguageId } from "./languages/types";

export type Lang = LangCode;

const zh = {
  title: "圣歌译者",
  subtitle: "把文字译成《巴别塔圣歌》中的语言",
  tabDevotees: "信徒语",
  tabWarriors: "战士语",
  tabBards: "吟游诗人语",
  tabAlchemists: "炼金术士语",
  tabAnchorites: "隐修者语",
  inputLabel: "输入文字",
  inputPlaceholder: "试试：我爱你 / The priest talks to the devotees",
  examples: "示例",
  inputHint: "支持中文和英文。每种语言只有几十个词，不在词表里的词会被标出。",
  tokens: "解析",
  emptyTablet: "在上方输入文字，字形会出现在这里",
  showCaptions: "显示释义",
  showRoles: "标注句法",
  exportSvg: "下载 SVG",
  exportPng: "下载 PNG",
  copyLink: "复制链接",
  githubTitle: "在 GitHub 上查看源码，欢迎 Star",
  linkCopied: "链接已复制",
  copyFailed: "复制失败，请手动复制地址栏",
  exportFailed: "导出失败",
  plural: "复数",
  ignored: "已省略：这门语言没有对应的词",
  unknown: "词表里没有这个词",
  didYouMean: "你是不是想说",
  thirdPerson: "这门语言没有第三人称代词，请改用名词，例如「信徒」「祭司」。",
  noPronouns: "这门语言没有人称代词，请改用名词或称呼。",
  noNumbers: "这门语言没有数字字形。",
  numberRange: "只支持 0 到 9999 的数字。",
  noVerb: "这句话没有动词。句子通常是 主语 + 动词 + 宾语。",
  dictionary: "词汇表",
  dictionaryHint: "点击字形把它加入输入框。",
  inferred: "含义由字形推断",
  grammar: "语法笔记",
  certaintyConfirmed: "已证实",
  certaintyCommunity: "社区共识",
  certaintyAssumed: "译者假设",
  footerDisclaimer:
    "非官方同人作品，与 Rundisc 和 Focus Entertainment 无关。《Chants of Sennaar》及其字形版权归原作者所有，请支持正版。",
  footerCredits:
    "信徒语字形取自 FontsOfSennaar 制作的 Devotee 字体（基于 LyonsType 的 Superior Mono，SIL OFL 1.1）；其余语言的矢量字形来自粉丝整理的 CoSTranslator 项目。",
  roleS: "主语",
  roleV: "动词",
  roleO: "宾语",
  roleNeg: "否定",
  rolePlural: "复数",
  roleQuestion: "疑问",
  posPronoun: "代词",
  posPerson: "人物",
  posVerb: "动词",
  posObject: "事物",
  posConcept: "概念",
  posPlace: "地点",
  posNumber: "数字",
  posAdjective: "形容词",
  posOther: "其他",
  roleMod: "修饰",
};

export type Key = keyof typeof zh;

const en: Record<Key, string> = {
  title: "Sennaar Translator",
  subtitle: "Turn words into the languages of Chants of Sennaar",
  tabDevotees: "Devotees",
  tabWarriors: "Warriors",
  tabBards: "Bards",
  tabAlchemists: "Alchemists",
  tabAnchorites: "Anchorites",
  inputLabel: "Your text",
  inputPlaceholder: "Try: I love you / 祭司对信徒说话",
  examples: "Examples",
  inputHint:
    "English and Chinese work. Each language has only a few dozen words; anything outside it is flagged.",
  tokens: "Parsing",
  emptyTablet: "Type above and the glyphs will appear here",
  showCaptions: "Show meanings",
  showRoles: "Mark roles",
  exportSvg: "Download SVG",
  exportPng: "Download PNG",
  copyLink: "Copy link",
  githubTitle: "View the source on GitHub, a star is welcome",
  linkCopied: "Link copied",
  copyFailed: "Copy failed, please copy the address bar",
  exportFailed: "Export failed",
  plural: "plural",
  ignored: "Dropped: this language has no word for it",
  unknown: "Not in the vocabulary",
  didYouMean: "Did you mean",
  thirdPerson:
    "This language has no third-person pronouns. Use a noun instead, such as “devotee” or “priest”.",
  noPronouns: "This language has no personal pronouns. Use a noun or a title instead.",
  noNumbers: "This language has no number glyphs.",
  numberRange: "Only numbers from 0 to 9999 are supported.",
  noVerb: "This sentence has no verb. Sentences are usually subject + verb + object.",
  dictionary: "Vocabulary",
  dictionaryHint: "Click a glyph to add it to the input.",
  inferred: "Meaning inferred from the glyph",
  grammar: "Grammar notes",
  certaintyConfirmed: "Confirmed",
  certaintyCommunity: "Community consensus",
  certaintyAssumed: "Our assumption",
  footerDisclaimer:
    "An unofficial fan project, not affiliated with Rundisc or Focus Entertainment. Chants of Sennaar and its glyphs belong to their creators. Please support the game.",
  footerCredits:
    "Devotee glyphs come from the Devotee font by FontsOfSennaar (based on LyonsType’s Superior Mono, SIL OFL 1.1); the other languages’ vector glyphs come from the fan project CoSTranslator.",
  roleS: "Subject",
  roleV: "Verb",
  roleO: "Object",
  roleNeg: "Negation",
  rolePlural: "Plural",
  roleQuestion: "Question",
  posPronoun: "Pronouns",
  posPerson: "People",
  posVerb: "Verbs",
  posObject: "Things",
  posConcept: "Concepts",
  posPlace: "Places",
  posNumber: "Numbers",
  posAdjective: "Adjectives",
  posOther: "Other",
  roleMod: "Modifier",
};

const dictionaries: Record<Lang, Record<Key, string>> = { zh, en };

export const t = (lang: Lang, key: Key) => dictionaries[lang][key];

/** Shown name of an entry: its explicit name (markers) or its first term. */
export const label = (lang: Lang, entry: Entry) =>
  entry.name?.[lang] ?? (lang === "zh" ? entry.zh[0] : entry.en[0]) ?? entry.id;

/** Text inserted into the input when an entry is picked from the vocabulary. */
export const typedForm = (lang: Lang, entry: Entry): string | undefined =>
  (lang === "zh" ? entry.zh[0] : entry.en[0]) ?? undefined;

export const posKey: Record<Pos, Key> = {
  pronoun: "posPronoun",
  person: "posPerson",
  verb: "posVerb",
  object: "posObject",
  concept: "posConcept",
  place: "posPlace",
  number: "posNumber",
  adjective: "posAdjective",
  other: "posOther",
};

export const roleKey: Record<Role, Key | null> = {
  S: "roleS",
  V: "roleV",
  O: "roleO",
  neg: "roleNeg",
  plural: "rolePlural",
  question: "roleQuestion",
  mod: "roleMod",
  other: null,
};

export const tabKey: Record<LanguageId, Key> = {
  devotee: "tabDevotees",
  warrior: "tabWarriors",
  bard: "tabBards",
  alchemist: "tabAlchemists",
  anchorite: "tabAnchorites",
};

export const certaintyKey = {
  confirmed: "certaintyConfirmed",
  community: "certaintyCommunity",
  assumed: "certaintyAssumed",
} as const satisfies Record<string, Key>;
