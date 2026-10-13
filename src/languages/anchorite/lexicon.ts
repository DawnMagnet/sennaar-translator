import type { Entry } from "../../engine/types";

/**
 * Anchorite vocabulary. `id` is the source glyph file stem (third_party/glyph-svgs/anchorite/anchorite_<id>.svg).
 * Several words exist in the game as ready-made composite glyphs: `doors` and `peoples` (noun + plural),
 * `stop`, `disregard` and `revive` (negation + a verb) and `we`. They are listed with their own ids.
 * Chinese terms are our own renderings, not the game's official localisation.
 */
export const ANCHORITE_LEXICON: Entry[] = [
  // Pronouns
  { id: "me", pos: "pronoun", en: ["i", "me"], zh: ["我"] },
  { id: "you", pos: "pronoun", en: ["you"], zh: ["你", "您"] },
  { id: "we", pos: "pronoun", en: ["we", "us"], zh: ["我们", "咱们"] },

  // People
  { id: "man", pos: "person", en: ["man", "human", "person"], zh: ["人", "人类"] },
  {
    id: "people",
    pos: "person",
    en: ["people", "folk", "tribe", "race"],
    zh: ["民族", "族群", "族人"],
  },
  { id: "my_people", pos: "person", en: ["my people"], zh: ["我的族人", "我族"] },
  {
    id: "stranger",
    pos: "person",
    en: ["stranger", "outsider", "foreigner"],
    zh: ["陌生人", "外人", "异乡人"],
  },
  {
    id: "peoples",
    pos: "person",
    en: [],
    zh: [],
    name: { en: "peoples", zh: "民族（复数）" },
  },

  // Verbs
  { id: "go", pos: "verb", en: ["go", "walk", "pass"], zh: ["去", "走", "通过", "经过"] },
  { id: "come", pos: "verb", en: ["come", "arrive"], zh: ["来", "到来", "前来"] },
  {
    id: "ascend",
    pos: "verb",
    en: ["ascend", "climb", "rise"],
    zh: ["攀登", "上升", "登上", "爬"],
  },
  {
    id: "seek",
    pos: "verb",
    en: ["seek", "want", "search", "wish"],
    zh: ["寻找", "想要", "想", "要", "追寻"],
  },
  { id: "make", pos: "verb", en: ["make", "create", "build"], zh: ["制造", "创造", "做", "建造"] },
  { id: "help", pos: "verb", en: ["help", "assist"], zh: ["帮助", "帮"] },
  { id: "open", pos: "verb", en: ["open"], zh: ["打开", "开"] },
  {
    id: "talk",
    pos: "verb",
    en: ["talk", "speak", "say", "tell"],
    zh: ["说话", "说", "讲", "交谈"],
  },
  { id: "wait", pos: "verb", en: ["wait"], zh: ["等待", "等"] },
  { id: "fear", pos: "verb", en: ["fear", "afraid", "scared"], zh: ["害怕", "恐惧", "畏惧"] },
  { id: "die", pos: "verb", en: ["die"], zh: ["死去", "身亡"] },
  { id: "stop", pos: "verb", en: ["stop", "halt", "cease"], zh: ["停止", "停下", "停"] },
  { id: "disregard", pos: "verb", en: ["disregard", "ignore"], zh: ["无视", "忽视", "忽略"] },
  { id: "revive", pos: "verb", en: ["revive", "resurrect"], zh: ["复活", "救活", "唤醒"] },

  // Objects
  { id: "door", pos: "object", en: ["door", "gate"], zh: ["门"] },
  { id: "key", pos: "object", en: ["key"], zh: ["钥匙"] },
  { id: "doors", pos: "object", en: [], zh: [], name: { en: "doors", zh: "门（复数）" } },

  // Concepts
  { id: "death", pos: "concept", en: ["death", "dead"], zh: ["死亡", "死"] },
  { id: "exile", pos: "concept", en: ["exile"], zh: ["流放", "放逐", "流亡"] },
  { id: "up", pos: "concept", en: ["up", "above", "high"], zh: ["上面", "上方", "上", "高"] },

  // Places
  { id: "tower", pos: "place", en: ["tower"], zh: ["高塔", "塔"] },

  // Other
  {
    id: "greetings",
    pos: "other",
    en: ["greetings", "hello", "hi", "goodbye", "bye"],
    zh: ["你好", "您好", "问候", "再见"],
  },

  // Markers
  {
    id: "not",
    pos: "other",
    en: ["not", "no", "never", "cannot"],
    zh: ["不", "没有", "没", "别", "无", "非", "未", "勿"],
  },
  { id: "plural", pos: "other", en: [], zh: [], name: { en: "plural radical", zh: "复数部首" } },
];
