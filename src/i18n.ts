import type { Entry, Pos, Role } from "./engine/types";

export type Lang = "zh" | "en";

const zh = {
  title: "圣歌译者",
  subtitle: "把文字译成《巴别塔圣歌》中的语言",
  tabDevotees: "信徒语",
  tabWarriors: "战士语",
  tabBards: "吟游诗人语",
  tabAlchemists: "炼金术士语",
  tabAnchorites: "隐修者语",
  comingSoon: "即将开放",
  inputLabel: "输入文字",
  inputPlaceholder: "试试：我爱你 / The priest talks to the devotees",
  examples: "示例",
  inputHint: "支持中文和英文。信徒语只有几十个词，不在词表里的词会被标出。",
  tokens: "解析",
  emptyTablet: "在上方输入文字，字形会出现在这里",
  showCaptions: "显示释义",
  showRoles: "标注句法",
  exportSvg: "下载 SVG",
  exportPng: "下载 PNG",
  copyLink: "复制链接",
  linkCopied: "链接已复制",
  copyFailed: "复制失败，请手动复制地址栏",
  exportFailed: "导出失败",
  plural: "复数",
  ignored: "已省略：信徒语没有对应的词",
  unknown: "词表里没有这个词",
  didYouMean: "你是不是想说",
  thirdPerson: "信徒语里没有第三人称代词，请改用名词，例如「信徒」「祭司」。",
  noVerb: "这句话没有动词。信徒语的句子通常是 主语 + 动词 + 宾语。",
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
    "字形取自 FontsOfSennaar 制作的 Devotee 字体（基于 LyonsType 的 Superior Mono，SIL OFL 1.1）。",
  roleS: "主语",
  roleV: "动词",
  roleO: "宾语",
  roleNeg: "否定",
  posPronoun: "代词",
  posPerson: "人物",
  posVerb: "动词",
  posObject: "事物",
  posConcept: "概念",
  posPlace: "地点",
  posOther: "其他",
};

type Key = keyof typeof zh;

const en: Record<Key, string> = {
  title: "Sennaar Translator",
  subtitle: "Turn words into the languages of Chants of Sennaar",
  tabDevotees: "Devotees",
  tabWarriors: "Warriors",
  tabBards: "Bards",
  tabAlchemists: "Alchemists",
  tabAnchorites: "Anchorites",
  comingSoon: "Coming soon",
  inputLabel: "Your text",
  inputPlaceholder: "Try: I love you / 祭司对信徒说话",
  examples: "Examples",
  inputHint:
    "English and Chinese work. Devotee has only a few dozen words; anything outside it is flagged.",
  tokens: "Parsing",
  emptyTablet: "Type above and the glyphs will appear here",
  showCaptions: "Show meanings",
  showRoles: "Mark roles",
  exportSvg: "Download SVG",
  exportPng: "Download PNG",
  copyLink: "Copy link",
  linkCopied: "Link copied",
  copyFailed: "Copy failed, please copy the address bar",
  exportFailed: "Export failed",
  plural: "plural",
  ignored: "Dropped: Devotee has no word for this",
  unknown: "Not in the vocabulary",
  didYouMean: "Did you mean",
  thirdPerson:
    "Devotee has no third-person pronouns. Use a noun instead, such as “devotee” or “priest”.",
  noVerb: "This sentence has no verb. Devotee sentences are usually subject + verb + object.",
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
    "Glyphs come from the Devotee font by FontsOfSennaar (based on LyonsType’s Superior Mono, SIL OFL 1.1).",
  roleS: "Subject",
  roleV: "Verb",
  roleO: "Object",
  roleNeg: "Negation",
  posPronoun: "Pronouns",
  posPerson: "People",
  posVerb: "Verbs",
  posObject: "Things",
  posConcept: "Concepts",
  posPlace: "Places",
  posOther: "Other",
};

const dictionaries: Record<Lang, Record<Key, string>> = { zh, en };

export const t = (lang: Lang, key: Key) => dictionaries[lang][key];

export const label = (lang: Lang, entry: Entry) => (lang === "zh" ? entry.zh[0]! : entry.en[0]!);

export const posKey: Record<Pos, Key> = {
  pronoun: "posPronoun",
  person: "posPerson",
  verb: "posVerb",
  object: "posObject",
  concept: "posConcept",
  place: "posPlace",
  other: "posOther",
};

export const roleKey: Record<Role, Key | null> = {
  S: "roleS",
  V: "roleV",
  O: "roleO",
  neg: "roleNeg",
  other: null,
};

export type Certainty = "confirmed" | "community" | "assumed";

export interface GrammarNote {
  title: string;
  body: string;
  certainty: Certainty;
}

export const grammarNotes: Record<Lang, GrammarNote[]> = {
  zh: [
    {
      title: "主语 + 动词 + 宾语",
      body: "语序和中文、英文一致，所以多数句子可以直接逐词对应。",
      certainty: "confirmed",
    },
    {
      title: "复数靠重复",
      body: "名词或代词写两遍表示复数：「信徒」写作「信徒 信徒」，「我们」写作「我 我」。动词不变化。",
      certainty: "confirmed",
    },
    {
      title: "没有时态、冠词和系动词",
      body: "「我看见钥匙」「我看见了钥匙」写出来相同。a/the、的/了/是 这类词会被省略，意思靠上下文判断。",
      certainty: "community",
    },
    {
      title: "否定词的位置",
      body: "译者把否定字形放在原句中否定词所在的位置，通常紧贴动词之前。社区对它的确切位置没有定论。",
      certainty: "assumed",
    },
    {
      title: "没有疑问标记",
      body: "疑问句和陈述句写法相同，靠语境区分，所以问号不会出现在译文里。",
      certainty: "community",
    },
    {
      title: "没有第三人称代词",
      body: "游戏的词汇里没有「他、她、它、他们」。需要指代时请直接写名词，例如「信徒」「祭司」。",
      certainty: "community",
    },
    {
      title: "词汇有限",
      body: "信徒语在游戏里只有几十个词，这里只收录有对应字形的词。「祭司」和「商店」的含义是根据字形推断的；中文释义是我们自己的译法，不是官方译名。",
      certainty: "assumed",
    },
  ],
  en: [
    {
      title: "Subject + verb + object",
      body: "Word order matches English and Chinese, so most sentences map word for word.",
      certainty: "confirmed",
    },
    {
      title: "Plural by repetition",
      body: "Write a noun or pronoun twice for the plural: “devotees” becomes “devotee devotee”, “we” becomes “I I”. Verbs never change.",
      certainty: "confirmed",
    },
    {
      title: "No tense, articles or copula",
      body: "“I see the key” and “I saw a key” look identical. Words like a/the and is/are are dropped, and context carries the meaning.",
      certainty: "community",
    },
    {
      title: "Where “not” goes",
      body: "The negation glyph is placed where the negating word sat in your sentence, usually right before the verb. The community has not settled its exact position.",
      certainty: "assumed",
    },
    {
      title: "No question marker",
      body: "Questions are written exactly like statements and told apart by context, so no question mark appears in the output.",
      certainty: "community",
    },
    {
      title: "No third-person pronouns",
      body: "The game has no word for he, she, it or they. Use a noun such as “devotee” or “priest” instead.",
      certainty: "community",
    },
    {
      title: "Small vocabulary",
      body: "Devotee has only a few dozen words in the game, and only words with a glyph are included. The meanings of “priest” and “shop” are inferred from their glyphs, and the Chinese glosses are our own, not official translations.",
      certainty: "assumed",
    },
  ],
};

export const certaintyKey: Record<Certainty, Key> = {
  confirmed: "certaintyConfirmed",
  community: "certaintyCommunity",
  assumed: "certaintyAssumed",
};
