import { describe, expect, it } from "vite-plus/test";
import { LANGUAGE_ORDER, getLanguage } from "./index";

const implemented = LANGUAGE_ORDER.map((id) => getLanguage(id)).filter((l) => l !== undefined);

describe.each(implemented.map((l) => [l.id, l] as const))("%s lexicon", (_id, language) => {
  const entries = language.lexicon.entries;

  it("has unique ids", () => {
    const ids = entries.map((e) => e.id);
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
  });

  it("gives every term to a single entry", () => {
    for (const lang of ["en", "zh"] as const) {
      const terms = entries.flatMap((e) => e[lang]);
      expect(terms.filter((t, i) => terms.indexOf(t) !== i)).toEqual([]);
    }
  });

  it("has a glyph for every entry", () => {
    for (const entry of entries) expect(language.glyphs.glyphs).toHaveProperty(entry.id);
  });

  it("names every entry that cannot be typed", () => {
    for (const entry of entries) {
      if (entry.en.length === 0 || entry.zh.length === 0) expect(entry.name).toBeDefined();
    }
  });

  it("has content in both languages", () => {
    for (const lang of ["zh", "en"] as const) {
      expect(language.content.name[lang]).toBeTruthy();
      expect(language.content.examples[lang].length).toBeGreaterThan(0);
      expect(language.content.notes[lang].length).toBeGreaterThan(0);
    }
  });

  it("translates its own examples into at least one glyph each", () => {
    // imported lazily to avoid a cycle with the registry
    return import("../engine/translate").then(({ translate }) => {
      for (const lang of ["zh", "en"] as const) {
        for (const example of language.content.examples[lang]) {
          const { lines } = translate(example, language);
          expect(lines.flatMap((l) => l.cells).length, example).toBeGreaterThan(0);
          const unknown = lines.flatMap((l) => l.items).filter((i) => i.kind === "unknown");
          expect(
            unknown.map((i) => i.source),
            example,
          ).toEqual([]);
        }
      }
    });
  });
});
