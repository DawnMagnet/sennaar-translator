import type { LanguageContent } from "../types";

export const BARD_CONTENT: LanguageContent = {
  name: { zh: "吟游诗人语", en: "Bards" },
  blurb: {
    zh: "花园的语言。字形像毛笔一笔挥就，都站在同一条基线上，词汇围绕美与表演。",
    en: "The language of the Garden: brush-stroke glyphs that all stand on one baseline, with words about beauty and performance.",
  },
  examples: {
    zh: ["吟游诗人爱音乐", "我寻找书", "战士不爱音乐", "你是吟游诗人吗？"],
    en: [
      "The bard loves music",
      "I seek the book",
      "The warrior does not love music",
      "Are you a bard?",
    ],
  },
  notes: {
    zh: [
      {
        title: "宾语 + 主语 + 动词",
        body: "这是游戏里唯一的 OSV 语序：先写宾语，再写主语，最后是动词。「吟游诗人爱音乐」写作「音乐 吟游诗人 爱」。",
        certainty: "confirmed",
      },
      {
        title: "没有宾语时：动词 + 主语",
        body: "不及物的句子改成 VS 语序：「吟游诗人走」写作「走 吟游诗人」。游戏开头的告示就是这种句式。",
        certainty: "confirmed",
      },
      {
        title: "否定词包住整句",
        body: "否定字形写在句子的开头和结尾，把整句话包起来，有点像西班牙语的 ¿…?。",
        certainty: "community",
      },
      {
        title: "疑问标记在否定之外",
        body: "疑问字形同样写在句子两端，位于否定字形外面。游戏里只有疑问字形本身，叠加的先后顺序来自粉丝整理的语法。",
        certainty: "assumed",
      },
      {
        title: "复数标记写在名词后面",
        body: "复数字形紧跟在名词之后。社区的说法并不一致，译者采用了粉丝语法书的写法。",
        certainty: "assumed",
      },
      {
        title: "字形站在同一条基线上",
        body: "每个字形底部都有一条横线，连起来就是贯穿全句的基线。基线下面的小点表示地点和方位，右上角的小点常见于动词。",
        certainty: "community",
      },
      {
        title: "这里有「是」",
        body: "在这几种语言里，只有吟游诗人语有系动词「是」的字形：「我是吟游诗人」写作「吟游诗人 我 是」。",
        certainty: "community",
      },
      {
        title: "词汇有限",
        body: "吟游诗人语在游戏里有四十几个词，这里只收录有对应字形的词。中文释义是我们自己的译法，不是官方译名。",
        certainty: "assumed",
      },
    ],
    en: [
      {
        title: "Object + subject + verb",
        body: "The only OSV language in the game: write the object first, then the subject, then the verb. “The bard loves music” becomes “music bard love”.",
        certainty: "confirmed",
      },
      {
        title: "Without an object: verb + subject",
        body: "Intransitive sentences switch to VS: “the bard goes” becomes “go bard”. The signs at the start of the game use this form.",
        certainty: "confirmed",
      },
      {
        title: "Negation wraps the sentence",
        body: "The negation glyph is written at the start and at the end, enclosing the whole sentence, a bit like Spanish ¿…?.",
        certainty: "community",
      },
      {
        title: "The question mark goes outside",
        body: "The question glyph also wraps both ends, outside any negation. The game only shows the glyph itself; the stacking order comes from fan-written grammar.",
        certainty: "assumed",
      },
      {
        title: "Plural follows the noun",
        body: "The plural glyph comes right after the noun. Sources disagree here; we followed the fan grammar.",
        certainty: "assumed",
      },
      {
        title: "Glyphs stand on one baseline",
        body: "Every glyph has a bar at its foot, and together the bars form a baseline through the sentence. A small dot under the baseline marks places and directions; a dot at the upper right is common on verbs.",
        certainty: "community",
      },
      {
        title: "There is a word for “to be”",
        body: "Among these languages only Bard has a copula glyph: “I am a bard” becomes “bard I be”.",
        certainty: "community",
      },
      {
        title: "Small vocabulary",
        body: "The game has around forty Bard words, and only words with a glyph are included. The Chinese glosses are our own, not official translations.",
        certainty: "assumed",
      },
    ],
  },
};
