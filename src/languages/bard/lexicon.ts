import type { Entry } from "../../engine/types";

/**
 * Bard vocabulary. `id` is the source glyph file stem (third_party/glyph-svgs/bard/bard_<id>.svg).
 * Chinese terms are our own renderings, not the game's official localisation.
 */
export const BARD_LEXICON: Entry[] = [
  // Pronouns
  { id: "me", pos: "pronoun", en: ["i", "me"], zh: ["我"] },
  { id: "you", pos: "pronoun", en: ["you"], zh: ["你", "您"] },

  // People
  { id: "bard", pos: "person", en: ["bard", "singer"], zh: ["吟游诗人", "诗人"] },
  { id: "warrior", pos: "person", en: ["warrior", "soldier"], zh: ["战士", "武士"] },
  { id: "man", pos: "person", en: ["man", "human", "person"], zh: ["人", "人类"] },
  { id: "brother", pos: "person", en: ["brother"], zh: ["兄弟"] },
  { id: "idiot", pos: "person", en: ["idiot", "fool"], zh: ["笨蛋", "傻瓜", "白痴"] },
  { id: "monster", pos: "person", en: ["monster", "creature"], zh: ["怪物", "怪兽"] },

  // Verbs
  { id: "be", pos: "verb", en: ["be", "is", "am", "are", "was", "were", "been"], zh: ["是"] },
  { id: "go", pos: "verb", en: ["go", "walk", "pass"], zh: ["去", "走", "通过", "经过"] },
  { id: "love", pos: "verb", en: ["love", "like", "enjoy"], zh: ["爱", "喜欢", "喜爱"] },
  {
    id: "seek",
    pos: "verb",
    en: ["seek", "want", "search", "wish"],
    zh: ["寻找", "想要", "想", "要", "追寻"],
  },
  { id: "find", pos: "verb", en: ["find", "discover"], zh: ["找到", "发现"] },
  { id: "carry", pos: "verb", en: ["carry", "bring"], zh: ["携带", "搬运", "搬", "带"] },
  {
    id: "ascend",
    pos: "verb",
    en: ["ascend", "climb", "rise"],
    zh: ["攀登", "上升", "登上", "爬"],
  },
  { id: "play", pos: "verb", en: ["play", "perform"], zh: ["演奏", "表演", "玩"] },

  // Objects
  { id: "book", pos: "object", en: ["book"], zh: ["书", "书本"] },
  { id: "instrument", pos: "object", en: ["instrument", "harp"], zh: ["乐器", "竖琴"] },
  { id: "weapon", pos: "object", en: ["weapon", "sword"], zh: ["武器", "剑"] },
  { id: "hammer", pos: "object", en: ["hammer"], zh: ["锤子", "锤"] },
  { id: "saw", pos: "object", en: ["saw"], zh: ["锯子", "锯"] },
  { id: "plier", pos: "object", en: ["plier", "pliers"], zh: ["钳子", "钳"] },
  { id: "compass", pos: "object", en: ["compass"], zh: ["指南针", "罗盘"] },
  { id: "windmill", pos: "object", en: ["windmill"], zh: ["风车"] },
  { id: "fire", pos: "object", en: ["fire", "flame"], zh: ["火", "火焰"] },

  // Concepts
  { id: "beauty", pos: "concept", en: ["beauty", "beautiful"], zh: ["美", "美丽", "漂亮"] },
  { id: "comedy", pos: "concept", en: ["comedy"], zh: ["喜剧"] },
  { id: "music", pos: "concept", en: ["music", "song"], zh: ["音乐", "歌曲", "歌"] },
  { id: "free", pos: "concept", en: ["free", "freedom"], zh: ["自由"] },

  // Places and directions
  { id: "abbey", pos: "place", en: ["abbey", "monastery"], zh: ["修道院"] },
  { id: "agora", pos: "place", en: ["agora", "square", "market"], zh: ["广场", "集市"] },
  {
    id: "fortress",
    pos: "place",
    en: ["fortress", "fort", "castle"],
    zh: ["要塞", "堡垒", "城堡"],
  },
  { id: "theatre", pos: "place", en: ["theatre", "theater"], zh: ["剧院", "剧场"] },
  { id: "path", pos: "place", en: ["path", "road", "way"], zh: ["道路", "小路", "路"] },
  { id: "north", pos: "place", en: ["north"], zh: ["北方", "北"] },
  { id: "south", pos: "place", en: ["south"], zh: ["南方", "南"] },
  { id: "east", pos: "place", en: ["east"], zh: ["东方", "东"] },
  { id: "west", pos: "place", en: ["west"], zh: ["西方", "西"] },

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
  { id: "plural", pos: "other", en: [], zh: [], name: { en: "plural", zh: "复数标记" } },
  { id: "question", pos: "other", en: [], zh: [], name: { en: "question mark", zh: "疑问标记" } },
];
