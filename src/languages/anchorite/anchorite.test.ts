import { describe, expect, it } from "vite-plus/test";
import { translate } from "../../engine/translate";
import { glyphOf } from "../../render/glyphs";
import { anchorite } from "./index";
import { CELL_CENTER } from "./offsets";

const ids = (text: string) =>
  translate(text, anchorite).lines.flatMap((l) => l.cells.map((c) => c.glyph));

describe("Anchorite grammar", () => {
  it("keeps subject-verb-object order", () => {
    expect(ids("We climb the tower")).toEqual(["we", "ascend", "tower"]);
    expect(ids("我们攀登高塔")).toEqual(["we", "ascend", "tower"]);
  });

  it("matches multi-word phrases and ignores prepositions", () => {
    expect(ids("I wait for my people")).toEqual(["me", "wait", "my_people"]);
    expect(ids("我等待我的族人")).toEqual(["me", "wait", "my_people"]);
  });
});

describe("Anchorite plural", () => {
  it("uses the game's ready-made plural glyphs", () => {
    expect(ids("I open the doors")).toEqual(["me", "open", "doors"]);
    expect(ids("The peoples wait")).toEqual(["peoples", "wait"]);
  });

  it("overlays the plural radical on other nouns", () => {
    expect(ids("The strangers seek the door")).toEqual(["ovl:plural:stranger", "seek", "door"]);
    expect(ids("陌生人们寻找门")).toEqual(["ovl:plural:stranger", "seek", "door"]);
    expect(ids("You men")).toEqual(["you", "ovl:plural:man"]);
  });

  it("names the overlaid plural so the caption is readable", () => {
    const cell = translate("strangers", anchorite).lines[0]!.cells[0]!;
    expect(cell.entry.en[0]).toBe("stranger (plural)");
    expect(cell.entry.zh[0]).toBe("陌生人（复数）");
  });
});

describe("Anchorite negation", () => {
  it("uses the game's own negated verbs", () => {
    expect(ids("I do not go")).toEqual(["me", "stop"]);
    expect(ids("我不去")).toEqual(["me", "stop"]);
    expect(ids("I do not seek the key")).toEqual(["me", "disregard", "key"]);
    expect(ids("I do not die")).toEqual(["me", "revive"]);
  });

  it("negating one of a pair gives the other", () => {
    expect(ids("I do not stop")).toEqual(["me", "go"]);
    expect(ids("I do not ignore the key")).toEqual(["me", "seek", "key"]);
  });

  it("overlays the negation bar on other verbs", () => {
    expect(ids("I do not talk")).toEqual(["me", "ovl:not:talk"]);
  });

  it("writes a standalone negation glyph when no verb follows", () => {
    expect(ids("no door")).toEqual(["not", "door"]);
  });
});

describe("Anchorite overlays", () => {
  it("merges base and radical into one even-odd path in cell coordinates", () => {
    const glyph = glyphOf(anchorite, "ovl:not:talk");
    expect(glyph.paths).toHaveLength(1);
    expect(glyph.paths[0]!.evenodd).toBe(true);
    expect(glyph.a).toBe(CELL_CENTER);
    expect(glyph.x0).toBeGreaterThanOrEqual(0);
    expect(glyph.w).toBeGreaterThan(90);
  });

  it("puts the plural radical at the upper right of a narrow glyph", () => {
    const me = glyphOf(anchorite, "me");
    const we = glyphOf(anchorite, "ovl:plural:me");
    expect(me.w).toBe(54);
    expect(we.x0).toBe(0);
    expect(we.w).toBeGreaterThan(95);
  });

  it("rejects overlays on glyphs that do not exist", () => {
    expect(() => glyphOf(anchorite, "ovl:plural:nothing")).toThrow();
  });

  it("anchors cropped glyphs to the middle row of the cell", () => {
    const { glyphs } = anchorite.glyphs;
    expect(glyphs.not!.a).toBeCloseTo(CELL_CENTER - 45.6, 1);
    expect(glyphs.people!.a).toBeCloseTo(CELL_CENTER - 43.2, 1);
    expect(glyphs.door!.a).toBe(CELL_CENTER);
  });
});

describe("Anchorite pronouns", () => {
  it("has I, you and we but no third person", () => {
    expect(ids("I wait for you")).toEqual(["me", "wait", "you"]);
    expect(ids("We wait")).toEqual(["we", "wait"]);
    const item = translate("He waits", anchorite).lines[0]!.items[0]!;
    expect(item).toMatchObject({ kind: "unknown", hint: "third-person" });
  });
});
