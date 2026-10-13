import type { Entry } from "../../engine/types";

/**
 * Alchemist vocabulary. `id` is the source glyph file stem (third_party/glyph-svgs/alchemist/alchemist_<id>.svg).
 * The ten digit glyphs are also the building blocks of the four-quadrant number glyphs (see numbers.ts).
 * Chinese terms are our own renderings, not the game's official localisation.
 */
export const ALCHEMIST_LEXICON: Entry[] = [
  // Pronouns
  { id: "me", pos: "pronoun", en: ["i", "me"], zh: ["我"] },
  { id: "you", pos: "pronoun", en: ["you"], zh: ["你", "您"] },

  // People
  { id: "alchemist", pos: "person", en: ["alchemist", "scientist"], zh: ["炼金术士", "科学家"] },
  { id: "bard", pos: "person", en: ["bard", "singer"], zh: ["吟游诗人", "诗人"] },
  { id: "warrior", pos: "person", en: ["warrior", "soldier"], zh: ["战士", "武士"] },
  { id: "brother", pos: "person", en: ["brother"], zh: ["兄弟"] },
  { id: "monster", pos: "person", en: ["monster", "creature"], zh: ["怪物", "怪兽"] },
  { id: "fairy", pos: "person", en: ["fairy", "sprite"], zh: ["仙子", "妖精", "精灵"] },

  // Verbs
  {
    id: "seek",
    pos: "verb",
    en: ["seek", "want", "search", "wish"],
    zh: ["寻找", "想要", "想", "要", "追寻"],
  },
  { id: "find", pos: "verb", en: ["find", "discover"], zh: ["找到", "发现"] },
  { id: "make", pos: "verb", en: ["make", "create", "build"], zh: ["制造", "创造", "做", "建造"] },
  { id: "help", pos: "verb", en: ["help", "assist"], zh: ["帮助", "帮"] },
  { id: "open", pos: "verb", en: ["open"], zh: ["打开", "开"] },
  { id: "close", pos: "verb", en: ["close", "shut"], zh: ["关闭", "关"] },
  { id: "fear", pos: "verb", en: ["fear", "afraid", "scared"], zh: ["害怕", "恐惧", "畏惧"] },

  // Objects
  { id: "book", pos: "object", en: ["book"], zh: ["书", "书本"] },
  { id: "door", pos: "object", en: ["door", "gate"], zh: ["门"] },
  { id: "plant", pos: "object", en: ["plant", "flower"], zh: ["植物", "花"] },
  { id: "formula", pos: "object", en: ["formula", "equation"], zh: ["公式", "配方"] },
  { id: "fire", pos: "object", en: ["fire", "flame"], zh: ["火", "火焰"] },
  { id: "carbon", pos: "object", en: ["carbon"], zh: ["碳"] },
  { id: "copper", pos: "object", en: ["copper"], zh: ["铜"] },
  { id: "silver", pos: "object", en: ["silver"], zh: ["银"] },
  { id: "gold", pos: "object", en: ["gold"], zh: ["黄金", "金"] },

  // Concepts
  { id: "death", pos: "concept", en: ["death", "dead", "die"], zh: ["死亡", "死"] },
  {
    id: "transformation",
    pos: "concept",
    en: ["transformation", "change"],
    zh: ["转变", "变化", "变形"],
  },

  // Places
  { id: "lab", pos: "place", en: ["lab", "laboratory"], zh: ["实验室"] },
  { id: "library", pos: "place", en: ["library"], zh: ["图书馆"] },
  { id: "mine", pos: "place", en: ["mine"], zh: ["矿井", "矿山", "矿"] },
  { id: "refectory", pos: "place", en: ["refectory", "canteen"], zh: ["食堂", "餐厅"] },

  // Digits
  { id: "zero", pos: "number", en: ["zero"], zh: ["零"] },
  { id: "one", pos: "number", en: ["one"], zh: ["一"] },
  { id: "two", pos: "number", en: ["two"], zh: ["二", "两"] },
  { id: "three", pos: "number", en: ["three"], zh: ["三"] },
  { id: "four", pos: "number", en: ["four"], zh: ["四"] },
  { id: "five", pos: "number", en: ["five"], zh: ["五"] },
  { id: "six", pos: "number", en: ["six"], zh: ["六"] },
  { id: "seven", pos: "number", en: ["seven"], zh: ["七"] },
  { id: "eight", pos: "number", en: ["eight"], zh: ["八"] },
  { id: "nine", pos: "number", en: ["nine"], zh: ["九"] },

  // Markers
  {
    id: "not",
    pos: "other",
    en: ["not", "no", "never", "cannot"],
    zh: ["不", "没有", "没", "别", "无", "非", "未", "勿"],
  },
  { id: "plural", pos: "other", en: [], zh: [], name: { en: "plural suffix", zh: "复数后缀" } },
];
