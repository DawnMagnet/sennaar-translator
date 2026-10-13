import type { Entry } from "../../engine/types";

/**
 * Warrior vocabulary. `id` is the source glyph file stem (third_party/glyph-svgs/warrior/warrior_<id>.svg).
 * Chinese terms are our own renderings, not the game's official localisation.
 * Warriors have no personal pronouns, so people must be named by role or trait.
 */
export const WARRIOR_LEXICON: Entry[] = [
  // People
  { id: "warrior", pos: "person", en: ["warrior", "soldier"], zh: ["战士", "武士"] },
  {
    id: "chosen",
    pos: "person",
    en: ["chosen", "chosen one", "bard"],
    zh: ["选民", "被选中者", "吟游诗人"],
  },
  {
    id: "impure",
    pos: "person",
    en: ["impure", "outsider", "impure one"],
    zh: ["不洁者", "外来者", "不纯者"],
  },
  { id: "scientist", pos: "person", en: ["scientist", "alchemist"], zh: ["科学家", "炼金术士"] },
  {
    id: "bellman",
    pos: "person",
    en: ["bellman", "bell ringer"],
    zh: ["敲钟人", "钟手"],
    inferred: true,
  },

  // Verbs
  { id: "go", pos: "verb", en: ["go", "walk", "pass"], zh: ["去", "走", "通过", "经过"] },
  { id: "help", pos: "verb", en: ["help", "assist"], zh: ["帮助", "帮"] },
  {
    id: "seek",
    pos: "verb",
    en: ["seek", "want", "search", "wish"],
    zh: ["寻找", "想要", "想", "要", "追寻"],
  },
  { id: "like", pos: "verb", en: ["like", "love", "enjoy"], zh: ["爱", "喜欢", "喜爱"] },
  { id: "fear", pos: "verb", en: ["fear", "afraid", "scared"], zh: ["害怕", "恐惧", "畏惧"] },
  { id: "make", pos: "verb", en: ["make", "create", "build"], zh: ["制造", "创造", "做", "建造"] },
  { id: "protect", pos: "verb", en: ["protect", "guard", "defend"], zh: ["保护", "守卫", "守护"] },
  {
    id: "push",
    pos: "verb",
    en: ["push", "repel", "drive away"],
    zh: ["推", "推开", "驱逐", "赶走"],
  },
  { id: "carry", pos: "verb", en: ["carry", "bring"], zh: ["搬运", "携带", "搬", "带"] },
  { id: "call", pos: "verb", en: ["call", "summon"], zh: ["呼唤", "召唤", "叫"] },
  {
    id: "lay",
    pos: "verb",
    en: ["lay", "put", "place", "set"],
    zh: ["放置", "摆放", "放"],
    inferred: true,
  },
  { id: "wait", pos: "verb", en: ["wait"], zh: ["等待", "等"] },

  // Objects
  { id: "weapon", pos: "object", en: ["weapon", "sword"], zh: ["武器", "剑"] },
  { id: "key", pos: "object", en: ["key"], zh: ["钥匙"] },
  { id: "instrument", pos: "object", en: ["instrument", "harp"], zh: ["乐器", "竖琴"] },
  { id: "bottle", pos: "object", en: ["bottle"], zh: ["瓶子", "瓶"] },
  { id: "crate", pos: "object", en: ["crate", "box"], zh: ["板条箱", "箱子", "箱"] },
  { id: "trolley", pos: "object", en: ["trolley", "cart"], zh: ["手推车", "推车"] },
  {
    id: "vessel",
    pos: "object",
    en: ["vessel", "container"],
    zh: ["容器", "器皿"],
    inferred: true,
  },
  { id: "treasure", pos: "object", en: ["treasure"], zh: ["宝物", "宝藏"] },
  { id: "sun", pos: "object", en: ["sun"], zh: ["太阳", "日"] },
  { id: "moon", pos: "object", en: ["moon"], zh: ["月亮", "月"] },

  // Concepts
  { id: "duty", pos: "concept", en: ["duty", "obligation"], zh: ["职责", "义务", "使命"] },
  { id: "death", pos: "concept", en: ["death", "dead", "die"], zh: ["死亡", "死"] },
  { id: "music", pos: "concept", en: ["music", "song"], zh: ["音乐", "歌曲", "歌"] },
  { id: "balance", pos: "concept", en: ["balance"], zh: ["平衡"], inferred: true },

  // Places
  {
    id: "fortress",
    pos: "place",
    en: ["fortress", "fort", "castle"],
    zh: ["要塞", "堡垒", "城堡"],
  },

  // Adjectives
  { id: "big", pos: "adjective", en: ["big", "large", "great"], zh: ["大", "巨大"] },
  { id: "small", pos: "adjective", en: ["small", "little", "tiny"], zh: ["小", "细小"] },

  // Markers
  {
    id: "not",
    pos: "other",
    en: ["not", "no", "never", "cannot"],
    zh: ["不", "没有", "没", "别", "无", "非", "未", "勿"],
  },
  { id: "plural", pos: "other", en: [], zh: [], name: { en: "plural prefix", zh: "复数前缀" } },
];
