import { describe, expect, it } from "vite-plus/test";
import { devotee } from "../languages/devotee";
import { composeSvg } from "./export";

describe("composeSvg", () => {
  const line = [{ glyph: "me" }, { glyph: "love" }, { glyph: "you" }];

  it("draws one path per glyph", () => {
    const svg = composeSvg(devotee, [line], { color: "#000" });
    expect(svg.match(/<path /g)).toHaveLength(3);
    expect(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"')).toBe(true);
  });

  it("adds a background only when asked", () => {
    expect(composeSvg(devotee, [line], { color: "#000" })).not.toContain("<rect");
    expect(composeSvg(devotee, [line], { color: "#000", background: "#fff" })).toContain("<rect");
  });

  it("escapes caption text", () => {
    const svg = composeSvg(devotee, [[{ glyph: "me", caption: `<b>&"x"</b>` }]], { color: "#000" });
    expect(svg).toContain("&lt;b&gt;&amp;&quot;x&quot;&lt;/b&gt;");
    expect(svg).not.toContain("<b>");
  });

  it("wraps very long lines onto several rows", () => {
    const long = Array.from({ length: 40 }, () => ({ glyph: "dvt" }));
    const one = composeSvg(devotee, [line], { color: "#000" }).match(
      /viewBox="0 0 \S+ (\S+)"/,
    )![1]!;
    const many = composeSvg(devotee, [long], { color: "#000" }).match(
      /viewBox="0 0 \S+ (\S+)"/,
    )![1]!;
    expect(Number(many)).toBeGreaterThan(Number(one) * 2);
  });
});
