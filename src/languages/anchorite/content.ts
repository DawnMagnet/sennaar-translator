import type { LanguageContent } from "../types";

export const ANCHORITE_CONTENT: LanguageContent = {
  name: { zh: "隐修者语", en: "Anchorites" },
  blurb: {
    zh: "流放地的语言。字形画在 16 段数码管式的网格里，只有直线和直角，是写给屏幕看的。",
    en: "The language of Exile: glyphs on a 16-segment display grid, all straight lines and right angles, made for screens.",
  },
  examples: {
    zh: ["我们攀登高塔", "我不去", "陌生人们寻找门", "我等待我的族人"],
    en: [
      "We climb the tower",
      "I do not go",
      "The strangers seek the door",
      "I wait for my people",
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
        title: "复数与否定是字形里的部首",
        body: "这门语言把意义拼进字形：复数不另占位置，而是把复数部首叠在名词字形的右上角；否定则把一条横线叠在字形正中一行。",
        certainty: "community",
      },
      {
        title: "游戏自带的合成字形",
        body: "「门（复数）」「民族（复数）」「我们」是游戏里现成的字形；「停止 = 不 + 去」「无视 = 不 + 寻找」「复活 = 不 + 死」也是现成的，译者直接使用它们。",
        certainty: "confirmed",
      },
      {
        title: "其他词的复数和否定由译者叠加",
        body: "游戏没有给出其他词的复数或否定。译者把同一个部首按相同位置叠上去，重叠的笔画互相抵消，这是社区提出的叠加规则，结果可能与游戏里的画法不同。",
        certainty: "assumed",
      },
      {
        title: "同形异义",
        body: "叠加会让不同的词偶尔长得很像，社区把它看作这门语言的缺陷：它是个精巧的谜题，却不太像能真正使用的文字。",
        certainty: "community",
      },
      {
        title: "字形像 16 段数码管",
        body: "所有字形都画在同一个 16 段数码管网格里，没有曲线。它不是为手写设计的，而是为了在屏幕上显示。",
        certainty: "community",
      },
      {
        title: "没有关系从句",
        body: "游戏里只有隐修者语出现了关系从句，例如「你是我等待的人」。译者不处理关系从句，请把句子拆开。",
        certainty: "community",
      },
      {
        title: "词汇有限",
        body: "隐修者语在游戏里只有三十几个词，这里只收录有对应字形的词；中文释义是我们自己的译法，不是官方译名。",
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
        title: "Plural and negation are radicals inside the glyph",
        body: "Meaning is built into the glyph: the plural is a radical overlaid at the upper right of the noun, and negation is a bar overlaid on the middle row.",
        certainty: "community",
      },
      {
        title: "Ready-made composites from the game",
        body: "“doors”, “peoples” and “we” exist as glyphs in the game, and so do “stop = not + go”, “disregard = not + seek” and “revive = not + die”. We use those as they are.",
        certainty: "confirmed",
      },
      {
        title: "Other plurals and negations are overlaid by us",
        body: "The game shows no other plural or negated word. We overlay the same radical at the same place and let shared strokes cancel out, the rule the community proposed; the result may differ from what the game would draw.",
        certainty: "assumed",
      },
      {
        title: "Homographs",
        body: "Overlaying can make different words look alike. The community counts this as the language’s weakness: a clever puzzle that works poorly as real writing.",
        certainty: "community",
      },
      {
        title: "Glyphs of a 16-segment display",
        body: "Every glyph sits on one 16-segment grid with no curves. It was not designed for handwriting but for being shown on a screen.",
        certainty: "community",
      },
      {
        title: "No relative clauses here",
        body: "Anchorite is the only language with relative clauses in the game, as in “you are the one I waited for”. The translator does not handle them; split such sentences up.",
        certainty: "community",
      },
      {
        title: "Small vocabulary",
        body: "The game has about three dozen Anchorite words, and only words with a glyph are included. The Chinese glosses are our own, not official translations.",
        certainty: "assumed",
      },
    ],
  },
};
