import type { LanguageContent } from "../types";

export const ALCHEMIST_CONTENT: LanguageContent = {
  name: { zh: "炼金术士语", en: "Alchemists" },
  blurb: {
    zh: "实验室的语言。字形像炼金术符号与几何图案，数字用一个字形的四个象限书写。",
    en: "The language of the Laboratories: alchemical symbols and geometry, with numbers written in the four quadrants of a single glyph.",
  },
  examples: {
    zh: ["我寻找铜矿", "炼金术士们制造黄金", "怪物不害怕火", "你找到5039"],
    en: [
      "I seek the copper mine",
      "The alchemists make gold",
      "The monster does not fear fire",
      "You find 5039",
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
        title: "复数后缀",
        body: "复数字形写在名词或代词的后面：「炼金术士们」是「炼金术士 复数」，「我们」是「我 复数」。",
        certainty: "community",
      },
      {
        title: "修饰语放在名词后面",
        body: "修饰成分跟在被修饰的词后面：「铜矿」写作「矿 铜」。译者把连续的几个名词整体倒过来写，中心词在最前。",
        certainty: "community",
      },
      {
        title: "否定词放在前面",
        body: "否定字形写在被否定的词之前。游戏里它只在很晚才出现，用例极少，社区对它的位置有不同说法。译者把它放在原句中否定词所在的位置。",
        certainty: "assumed",
      },
      {
        title: "一个字形写出 0 到 9999",
        body: "数字是一个字形：中间一根竖线，个位的记号在右下，十位在左下，百位在右上，千位在左上。这个设计来自中世纪西多会数字，游戏里的开锁密码 5039 就是这样写的。",
        certainty: "community",
      },
      {
        title: "合成数字由译者生成",
        body: "游戏只给出 0 到 9 十个基础字形。十位、百位、千位是把同一个记号按西多会数字的规则镜像到其他象限得到的，可能和游戏里的画法有细微差别。",
        certainty: "assumed",
      },
      {
        title: "没有时态、冠词和疑问标记",
        body: "和多数语言一样，这些都不写出来，意思靠上下文判断。",
        certainty: "community",
      },
      {
        title: "词汇有限",
        body: "炼金术士语在游戏里有四十几个词，其中十个是数字。这里只收录有对应字形的词；中文释义是我们自己的译法，不是官方译名。",
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
        title: "Plural as a suffix",
        body: "The plural glyph follows the noun or pronoun: “alchemists” is “alchemist plural”, “we” is “I plural”.",
        certainty: "community",
      },
      {
        title: "Modifiers follow the noun",
        body: "A modifier comes after what it describes: “copper mine” is written “mine copper”. We reverse a whole run of consecutive nouns so the head comes first.",
        certainty: "community",
      },
      {
        title: "Negation goes in front",
        body: "The negation glyph precedes the word it negates. It appears late in the game with very few examples, and the community disagrees on its position. We place it where the negating word sat in your sentence.",
        certainty: "assumed",
      },
      {
        title: "Numbers 0-9999 in one glyph",
        body: "A number is a single glyph: a vertical stem with the units mark at lower right, tens at lower left, hundreds at upper right and thousands at upper left. The design is borrowed from medieval Cistercian numerals, and the in-game lock code 5039 is written this way.",
        certainty: "community",
      },
      {
        title: "Larger numbers are generated",
        body: "The game only shows the ten base digit glyphs. Tens, hundreds and thousands are the same mark mirrored into the other quadrants following the Cistercian rule, so details may differ slightly from the game.",
        certainty: "assumed",
      },
      {
        title: "No tense, articles or question marker",
        body: "As in most languages these are not written; context carries the meaning.",
        certainty: "community",
      },
      {
        title: "Small vocabulary",
        body: "The game has around forty Alchemist words, ten of them digits, and only words with a glyph are included. The Chinese glosses are our own, not official translations.",
        certainty: "assumed",
      },
    ],
  },
};
