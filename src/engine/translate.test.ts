import { describe, expect, it } from "vite-plus/test";
import glyphData from "../data/devotee.glyphs.json";
import { DEVOTEE_LEXICON } from "../data/devotee.lexicon";
import { translate } from "./translate";

const ids = (text: string) => translate(text).lines.flatMap((l) => l.cells.map((c) => c.glyph));
const roles = (text: string) => translate(text).lines.flatMap((l) => l.cells.map((c) => c.role));

describe("lexicon integrity", () => {
  it("has no duplicate ids", () => {
    const seen = DEVOTEE_LEXICON.map((e) => e.id);
    expect(new Set(seen).size).toBe(seen.length);
  });

  it("has no term claimed by two entries", () => {
    for (const lang of ["en", "zh"] as const) {
      const terms = DEVOTEE_LEXICON.flatMap((e) => e[lang]);
      expect(terms.filter((t, i) => terms.indexOf(t) !== i)).toEqual([]);
    }
  });

  it("has an extracted glyph for every entry", () => {
    for (const entry of DEVOTEE_LEXICON) expect(glyphData.glyphs).toHaveProperty(entry.id);
  });
});

describe("English input", () => {
  it("translates a plain SVO sentence", () => {
    expect(ids("I love you")).toEqual(["me", "love", "you"]);
    expect(roles("I love you")).toEqual(["S", "V", "O"]);
  });

  it("drops articles, auxiliaries and copulas", () => {
    expect(ids("The priest is talking to the man")).toEqual(["pr", "talk", "man"]);
  });

  it("duplicates plural nouns", () => {
    expect(ids("The devotees seek god")).toEqual(["dvt", "dvt", "seek", "god"]);
    expect(ids("Doors")).toEqual(["door", "door"]);
    expect(ids("people")).toEqual(["man", "man"]);
  });

  it("does not pluralise verbs that end in s", () => {
    expect(ids("God sees you")).toEqual(["god", "see", "you"]);
    expect(ids("The priest goes")).toEqual(["pr", "go"]);
  });

  it("handles we as a doubled first-person pronoun", () => {
    expect(ids("We love you")).toEqual(["me", "me", "love", "you"]);
  });

  it("handles negation, including contractions", () => {
    expect(ids("I do not see the key")).toEqual(["me", "not", "see", "key"]);
    expect(ids("I don't see the key")).toEqual(["me", "not", "see", "key"]);
    expect(roles("I do not see the key")).toEqual(["S", "neg", "V", "O"]);
  });

  it("inflects verbs", () => {
    expect(ids("I loved you")).toEqual(["me", "love", "you"]);
    expect(ids("I made a door")).toEqual(["me", "make", "door"]);
    expect(ids("I am making a door")).toEqual(["me", "make", "door"]);
    expect(ids("God died")).toEqual(["god", "dead"]);
  });

  it("splits sentences into separate lines", () => {
    const t = translate("Hello! I love you.");
    expect(t.lines.map((l) => l.cells.map((c) => c.glyph))).toEqual([
      ["gb"],
      ["me", "love", "you"],
    ]);
  });
});

describe("Chinese input", () => {
  it("translates a plain SVO sentence", () => {
    expect(ids("我爱你")).toEqual(["me", "love", "you"]);
  });

  it("segments by longest match", () => {
    expect(ids("我想要钥匙")).toEqual(["me", "seek", "key"]);
    expect(ids("祭司说话")).toEqual(["pr", "talk"]);
  });

  it("handles negation", () => {
    expect(ids("我不爱你")).toEqual(["me", "not", "love", "you"]);
    expect(ids("我没有找到钥匙")).toEqual(["me", "not", "find", "key"]);
  });

  it("handles plural pronouns and the 们 suffix", () => {
    expect(ids("我们爱你")).toEqual(["me", "me", "love", "you"]);
    expect(ids("你们看见神")).toEqual(["you", "you", "see", "god"]);
    expect(ids("信徒们寻找神")).toEqual(["dvt", "dvt", "seek", "god"]);
  });

  it("ignores function characters", () => {
    expect(ids("我打开了门")).toEqual(["me", "open", "door"]);
  });

  it("accepts mixed-language input", () => {
    expect(ids("I 爱 you")).toEqual(["me", "love", "you"]);
  });
});

describe("unknown words", () => {
  it("flags third-person pronouns with a hint", () => {
    const [item] = translate("He loves you").lines[0]!.items;
    expect(item).toMatchObject({ kind: "unknown", hint: "third-person" });
    expect(ids("他爱你")).toEqual(["love", "you"]);
  });

  it("suggests close matches for typos", () => {
    const item = translate("I lvoe you").lines[0]!.items[1]!;
    expect(item.kind).toBe("unknown");
    if (item.kind === "unknown") expect(item.suggestions.map((e) => e.id)).toContain("love");
  });

  it("treats a swapped pair of letters as one typo and ranks it first", () => {
    const item = translate("I see the kye").lines[0]!.items.at(-1)!;
    expect(item.kind).toBe("unknown");
    if (item.kind === "unknown") expect(item.suggestions[0]?.id).toBe("key");
  });

  it("skips unknown words in the glyph output", () => {
    expect(ids("I love quantum")).toEqual(["me", "love"]);
  });

  it("returns no lines for empty input", () => {
    expect(translate("  ").lines).toEqual([]);
  });
});

describe("warnings", () => {
  it("warns when two nominals have no verb", () => {
    expect(translate("priest god").lines[0]!.warnings).toEqual(["no-verb"]);
    expect(translate("Hello priest").lines[0]!.warnings).toEqual([]);
  });
});
