import type { Entry } from "../../engine/types";

/**
 * Devotee vocabulary. `id` is the ligature key in the Devotee font, so every
 * entry maps to exactly one in-game glyph. Synonyms that share a glyph in the
 * game (go/pass, love/like, see/look, ...) are merged into one entry.
 * Chinese terms are our own renderings, not the game's official localisation.
 */
export const DEVOTEE_LEXICON: Entry[] = [
  // Pronouns
  { id: "me", pos: "pronoun", en: ["i", "me"], zh: ["我"] },
  { id: "you", pos: "pronoun", en: ["you"], zh: ["你", "您"] },

  // People
  { id: "dvt", pos: "person", en: ["devotee", "believer"], zh: ["信徒"] },
  { id: "warr", pos: "person", en: ["warrior", "soldier"], zh: ["战士", "武士"] },
  { id: "opt", pos: "person", en: ["optician"], zh: ["验光师", "光学师"] },
  { id: "man", pos: "person", en: ["man", "human", "person"], zh: ["人", "人类"] },
  { id: "pr", pos: "person", en: ["priest", "preacher"], zh: ["祭司", "传道者"], inferred: true },
  { id: "god", pos: "person", en: ["god"], zh: ["神", "上帝"] },

  // Verbs
  { id: "go", pos: "verb", en: ["go", "pass", "walk"], zh: ["去", "走", "通过", "经过"] },
  { id: "open", pos: "verb", en: ["open"], zh: ["打开", "开"] },
  { id: "cls", pos: "verb", en: ["close", "shut"], zh: ["关闭", "关"] },
  { id: "love", pos: "verb", en: ["love", "like", "enjoy"], zh: ["爱", "喜欢", "喜爱"] },
  { id: "see", pos: "verb", en: ["see", "look", "watch"], zh: ["看", "看见", "观看"] },
  { id: "help", pos: "verb", en: ["help", "assist"], zh: ["帮助", "帮"] },
  {
    id: "talk",
    pos: "verb",
    en: ["talk", "speak", "say", "tell"],
    zh: ["说", "说话", "讲", "交谈"],
  },
  {
    id: "seek",
    pos: "verb",
    en: ["seek", "want", "search", "wish"],
    zh: ["寻找", "想要", "想", "要", "追寻"],
  },
  { id: "find", pos: "verb", en: ["find", "discover"], zh: ["找到", "发现"] },
  { id: "make", pos: "verb", en: ["make", "create", "build"], zh: ["制造", "创造", "做", "建造"] },

  // Objects
  { id: "ptn", pos: "object", en: ["potion", "medicine"], zh: ["药水", "药剂", "药"] },
  { id: "key", pos: "object", en: ["key"], zh: ["钥匙"] },
  { id: "door", pos: "object", en: ["door", "gate"], zh: ["门"] },
  { id: "lens", pos: "object", en: ["lens", "glasses"], zh: ["镜片", "透镜", "眼镜"] },
  { id: "pot", pos: "object", en: ["pot", "jar", "vase"], zh: ["罐子", "壶", "罐"] },
  { id: "plt", pos: "object", en: ["plant", "flower"], zh: ["植物", "花"] },
  { id: "inst", pos: "object", en: ["instrument"], zh: ["乐器"] },
  { id: "wpn", pos: "object", en: ["weapon", "sword"], zh: ["武器", "剑"] },
  { id: "war", pos: "object", en: ["war", "battle"], zh: ["战争", "战斗"] },

  // Concepts and states
  { id: "dead", pos: "concept", en: ["dead", "death", "die"], zh: ["死亡", "死", "已死"] },
  { id: "mus", pos: "concept", en: ["music", "song"], zh: ["音乐", "歌曲", "歌"] },
  { id: "up", pos: "concept", en: ["up", "above", "high"], zh: ["上面", "上方", "上", "高"] },
  { id: "free", pos: "concept", en: ["free", "freedom"], zh: ["自由"] },

  // Places
  { id: "abb", pos: "place", en: ["abbey", "monastery"], zh: ["修道院"] },
  { id: "ch", pos: "place", en: ["church"], zh: ["教堂"] },
  { id: "cem", pos: "place", en: ["cemetery", "graveyard"], zh: ["墓地", "墓园"] },
  { id: "gdn", pos: "place", en: ["garden"], zh: ["花园", "园子"] },
  { id: "shop", pos: "place", en: ["shop", "store"], zh: ["商店", "店"], inferred: true },

  // Other
  {
    id: "not",
    pos: "other",
    en: ["not", "no", "never", "cannot"],
    zh: ["不", "没有", "没", "别", "无", "非", "未", "勿"],
  },
  {
    id: "gb",
    pos: "other",
    en: ["hello", "hi", "goodbye", "bye", "greetings"],
    zh: ["你好", "您好", "再见", "问候"],
  },
];
