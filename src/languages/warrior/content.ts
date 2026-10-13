import type { LanguageContent } from "../types";

export const WARRIOR_CONTENT: LanguageContent = {
  name: { zh: "战士语", en: "Warriors" },
  blurb: {
    zh: "要塞的语言。字形像用刀刻出的北欧符文，词汇围绕职责与守卫。",
    en: "The language of the Fortress: runes cut with a blade, with words about duty and guarding.",
  },
  examples: {
    zh: ["战士保护选民", "战士们寻找钥匙", "战士推开不洁者", "战士不害怕死亡"],
    en: [
      "The warrior protects the chosen",
      "The warriors seek the key",
      "The warrior pushes the impure",
      "The warrior does not fear death",
    ],
  },
  hints: {
    "no-pronouns": {
      zh: "战士语没有「我、你、他」这类人称代词，要用职业或称呼来指代，例如「战士」「选民」「不洁者」。",
      en: "Warriors have no personal pronouns. Name people by role or title instead, such as “warrior”, “chosen” or “impure”.",
    },
  },
  notes: {
    zh: [
      {
        title: "主语 + 动词 + 宾语",
        body: "语序和中文、英文一致，所以多数句子可以直接逐词对应。",
        certainty: "confirmed",
      },
      {
        title: "复数标记写在名词前面",
        body: "要表示复数，先写复数标记再写名词：「战士们」是「复数 战士」。这是游戏里唯一用前缀表示复数的语言。",
        certainty: "community",
      },
      {
        title: "否定词放在前面",
        body: "否定字形写在被否定的词之前。译者把它放在原句中否定词所在的位置，通常紧贴动词之前。",
        certainty: "assumed",
      },
      {
        title: "没有人称代词",
        body: "战士语没有「我、你、他」。说话时只能用职业、身份或特征称呼对方，所以像「我爱你」这样的句子在这里写不出来。",
        certainty: "community",
      },
      {
        title: "没有时态、冠词和系动词",
        body: "和其他语言一样，时态和冠词不写出来，意思靠上下文判断。",
        certainty: "community",
      },
      {
        title: "词汇有限",
        body: "战士语在游戏里只有三十几个词，这里只收录有对应字形的词。「敲钟人」「容器」「放置」「平衡」的含义是根据字形和上下文推断的；中文释义是我们自己的译法，不是官方译名。",
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
        title: "The plural marker comes first",
        body: "Write the plural marker, then the noun: “warriors” is “plural warrior”. This is the only language in the game that marks the plural with a prefix.",
        certainty: "community",
      },
      {
        title: "Negation goes in front",
        body: "The negation glyph is written before the word it negates. We place it where the negating word sat in your sentence, usually right before the verb.",
        certainty: "assumed",
      },
      {
        title: "No personal pronouns",
        body: "Warriors have no word for I, you or he. People must be named by role, title or trait, so a sentence like “I love you” cannot be written.",
        certainty: "community",
      },
      {
        title: "No tense, articles or copula",
        body: "As elsewhere, tense and articles are not written and context carries the meaning.",
        certainty: "community",
      },
      {
        title: "Small vocabulary",
        body: "The game teaches only about three dozen Warrior words, and only those with a glyph are included. The meanings of “bellman”, “vessel”, “lay” and “balance” are inferred from their glyphs and context; the Chinese glosses are our own, not official translations.",
        certainty: "assumed",
      },
    ],
  },
};
