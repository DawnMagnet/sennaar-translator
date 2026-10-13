import type { LanguageContent } from "../types";

export const DEVOTEE_CONTENT: LanguageContent = {
  name: { zh: "信徒语", en: "Devotees" },
  blurb: {
    zh: "修道院的语言。字形像泥板上一笔笔压出的短划，词汇围绕信仰与修行。",
    en: "The language of the Abbey: short strokes pressed into clay, with words about faith and devotion.",
  },
  examples: {
    zh: ["我爱你", "信徒寻找神", "我没有找到钥匙", "祭司说话。我们看见门"],
    en: [
      "I love you",
      "The devotees seek god",
      "I did not find the key",
      "The priest talks. We see the door",
    ],
  },
  notes: {
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
  },
};
