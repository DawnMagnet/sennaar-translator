import { describe, expect, it } from "vite-plus/test";
import { translate } from "../../engine/translate";
import { warrior } from "./index";

const ids = (text: string) =>
  translate(text, warrior).lines.flatMap((l) => l.cells.map((c) => c.glyph));
const roles = (text: string) =>
  translate(text, warrior).lines.flatMap((l) => l.cells.map((c) => c.role));

describe("Warrior grammar", () => {
  it("keeps subject-verb-object order", () => {
    expect(ids("The warrior protects the chosen")).toEqual(["warrior", "protect", "chosen"]);
    expect(roles("The warrior protects the chosen")).toEqual(["S", "V", "O"]);
  });

  it("writes the plural marker before the noun", () => {
    expect(ids("The warriors seek the key")).toEqual(["plural", "warrior", "seek", "key"]);
    expect(roles("The warriors seek the key")).toEqual(["plural", "S", "V", "O"]);
    expect(ids("战士们寻找钥匙")).toEqual(["plural", "warrior", "seek", "key"]);
  });

  it("puts negation in front of the verb", () => {
    expect(ids("The warrior does not fear death")).toEqual(["warrior", "not", "fear", "death"]);
    expect(ids("战士不害怕死亡")).toEqual(["warrior", "not", "fear", "death"]);
  });

  it("matches multi-word phrases", () => {
    expect(ids("The warrior calls the chosen one")).toEqual(["warrior", "call", "chosen"]);
  });

  it("does not pluralise verbs or concepts", () => {
    expect(ids("The warrior seeks duties")).toEqual(["warrior", "seek", "duty"]);
  });
});

describe("Warrior pronouns", () => {
  it("rejects every personal pronoun with the no-pronouns hint", () => {
    for (const text of ["I protect you", "He pushes us", "我保护你", "他们推开我们"]) {
      const { lines } = translate(text, warrior);
      const unknowns = lines[0]!.items.filter((i) => i.kind === "unknown");
      expect(unknowns.length).toBeGreaterThan(0);
      for (const item of unknowns) expect(item).toMatchObject({ hint: "no-pronouns" });
    }
  });

  it("still writes the rest of the sentence", () => {
    expect(ids("I protect the chosen")).toEqual(["protect", "chosen"]);
  });
});
