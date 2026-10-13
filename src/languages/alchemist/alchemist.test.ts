import { describe, expect, it } from "vite-plus/test";
import { translate } from "../../engine/translate";
import { glyphOf } from "../../render/glyphs";
import { alchemist } from "./index";
import { composeNumber } from "./numbers";

const ids = (text: string) =>
  translate(text, alchemist).lines.flatMap((l) => l.cells.map((c) => c.glyph));
const roles = (text: string) =>
  translate(text, alchemist).lines.flatMap((l) => l.cells.map((c) => c.role));

describe("Alchemist grammar", () => {
  it("keeps subject-verb-object order", () => {
    expect(ids("The monster fears fire")).toEqual(["monster", "fear", "fire"]);
    expect(ids("怪物不害怕火")).toEqual(["monster", "not", "fear", "fire"]);
  });

  it("writes the plural marker after the noun or pronoun", () => {
    expect(ids("The alchemists make gold")).toEqual(["alchemist", "plural", "make", "gold"]);
    expect(roles("The alchemists make gold")).toEqual(["S", "plural", "V", "O"]);
    expect(ids("炼金术士们制造黄金")).toEqual(["alchemist", "plural", "make", "gold"]);
    expect(ids("We seek gold")).toEqual(["me", "plural", "seek", "gold"]);
  });

  it("writes modifiers after the noun by reversing a run of nouns", () => {
    expect(ids("I seek the copper mine")).toEqual(["me", "seek", "mine", "copper"]);
    expect(ids("我寻找铜矿")).toEqual(["me", "seek", "mine", "copper"]);
  });

  it("keeps the plural marker with its own noun when reversing", () => {
    expect(ids("I seek copper mines")).toEqual(["me", "seek", "mine", "plural", "copper"]);
  });
});

describe("Alchemist numbers", () => {
  it("uses the plain digit glyph for a single digit", () => {
    expect(ids("You find 7")).toEqual(["you", "find", "seven"]);
    expect(ids("one")).toEqual(["one"]);
  });

  it("makes one synthetic glyph for a larger number", () => {
    expect(ids("You find 5039")).toEqual(["you", "find", "num:5039"]);
    expect(ids("你找到5039")).toEqual(["you", "find", "num:5039"]);
  });

  it("rejects numbers above 9999", () => {
    const item = translate("You find 12345", alchemist).lines[0]!.items.at(-1)!;
    expect(item).toMatchObject({ kind: "unknown", hint: "number-range" });
  });

  it("composes one mirrored copy of the digit mark per decimal place", () => {
    const g = alchemist.glyphs.glyphs;
    const units = composeNumber(g, 3)!;
    expect(units.paths.every((p) => p.t === undefined)).toBe(true);

    const tens = composeNumber(g, 30)!;
    // units 0 contributes the stem, tens 3 contributes the mirrored mark
    expect(tens.paths.map((p) => p.t).filter(Boolean)).toHaveLength(g.three!.paths.length);
    expect(tens.paths.some((p) => p.t === "matrix(-1 0 0 1 8 0)")).toBe(true);
    expect(tens.x0).toBeLessThan(0);

    const full = composeNumber(g, 1234)!;
    expect(new Set(full.paths.map((p) => p.t))).toEqual(
      new Set([
        undefined,
        "matrix(-1 0 0 1 8 0)",
        "matrix(1 0 0 -1 0 125.3)",
        "matrix(-1 0 0 -1 8 125.3)",
      ]),
    );

    // 5039 has a zero in the hundreds place, so that quadrant stays empty
    const lock = composeNumber(g, 5039)!;
    expect(lock.paths.some((p) => p.t === "matrix(1 0 0 -1 0 125.3)")).toBe(false);
    expect(lock.paths.some((p) => p.t === "matrix(-1 0 0 -1 8 125.3)")).toBe(true);
  });

  it("resolves synthetic glyph ids for rendering and rejects out-of-range ones", () => {
    expect(glyphOf(alchemist, "num:1024").paths.length).toBeGreaterThan(0);
    expect(() => glyphOf(alchemist, "num:10000")).toThrow();
  });

  it("keeps every composed number inside the cell height", () => {
    const { above, below } = alchemist.glyphs.metrics;
    for (const n of [10, 99, 1000, 5039, 9999]) {
      const glyph = glyphOf(alchemist, `num:${n}`);
      expect(glyph.a).toBeLessThanOrEqual(above);
      expect(125.3 - glyph.a).toBeLessThanOrEqual(below + 1);
    }
  });
});
