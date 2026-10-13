import { describe, expect, it } from "vite-plus/test";
import { translate } from "../../engine/translate";
import { bard } from "./index";

const ids = (text: string) =>
  translate(text, bard).lines.flatMap((l) => l.cells.map((c) => c.glyph));
const roles = (text: string) =>
  translate(text, bard).lines.flatMap((l) => l.cells.map((c) => c.role));

describe("Bard word order", () => {
  it("writes object, subject, verb", () => {
    expect(ids("The bard loves music")).toEqual(["music", "bard", "love"]);
    expect(roles("The bard loves music")).toEqual(["O", "S", "V"]);
    expect(ids("我寻找书")).toEqual(["book", "me", "seek"]);
  });

  it("writes verb then subject when there is no object", () => {
    expect(ids("The bard goes")).toEqual(["go", "bard"]);
    expect(ids("吟游诗人走")).toEqual(["go", "bard"]);
  });

  it("keeps input order when there is no verb", () => {
    expect(ids("Hello bard")).toEqual(["greetings", "bard"]);
  });

  it("puts a leading greeting before the rest of the sentence", () => {
    expect(ids("Hello, I love music")).toEqual(["greetings", "music", "me", "love"]);
  });

  it("writes the copula last", () => {
    expect(ids("I am a bard")).toEqual(["bard", "me", "be"]);
    expect(ids("我是吟游诗人")).toEqual(["bard", "me", "be"]);
  });
});

describe("Bard plural", () => {
  it("follows the noun", () => {
    expect(ids("The bards love music")).toEqual(["music", "bard", "plural", "love"]);
    expect(roles("The bards love music")).toEqual(["O", "S", "plural", "V"]);
    expect(ids("吟游诗人们爱音乐")).toEqual(["music", "bard", "plural", "love"]);
  });

  it("treats we as a plural I", () => {
    expect(ids("We love music")).toEqual(["music", "me", "plural", "love"]);
  });
});

describe("Bard negation and questions", () => {
  it("wraps the sentence in the negation glyph", () => {
    expect(ids("The warrior does not love music")).toEqual([
      "not",
      "music",
      "warrior",
      "love",
      "not",
    ]);
    expect(roles("战士不爱音乐")).toEqual(["neg", "O", "S", "V", "neg"]);
  });

  it("wraps questions outside the negation", () => {
    expect(ids("Do you love music?")).toEqual(["question", "music", "you", "love", "question"]);
    expect(ids("你爱音乐吗？")).toEqual(["question", "music", "you", "love", "question"]);
    expect(ids("Do you not love music?")).toEqual([
      "question",
      "not",
      "music",
      "you",
      "love",
      "not",
      "question",
    ]);
  });

  it("undoes copula inversion in English questions", () => {
    expect(ids("Are you a bard?")).toEqual(["question", "bard", "you", "be", "question"]);
    expect(ids("你是吟游诗人吗？")).toEqual(["question", "bard", "you", "be", "question"]);
  });

  it("does not turn a lone negation word into an empty wrapper", () => {
    expect(ids("no")).toEqual(["not"]);
  });
});

describe("Bard layout", () => {
  it("is a connected script with the baseline below every glyph's foot", () => {
    expect(bard.connected).toBe(true);
    const { above, below } = bard.glyphs.metrics;
    for (const glyph of Object.values(bard.glyphs.glyphs)) {
      expect(glyph.a).toBeLessThanOrEqual(above);
      expect(glyph.a).toBeGreaterThan(0);
      expect(below).toBeGreaterThan(0);
    }
  });
});
