import type { Lexicon } from "../engine/lexicon";
import type { Entry, Item, Line, UnknownHint } from "../engine/types";

export type LangCode = "zh" | "en";
export type LanguageId = "devotee" | "warrior" | "bard" | "alchemist" | "anchorite";

export interface GlyphPath {
  d: string;
  /** SVG transform applied to this path only. */
  t?: string;
  /** Fill with the even-odd rule, so overlapping subpaths cancel out (an XOR of the shapes). */
  evenodd?: boolean;
}

export interface GlyphData {
  /** Left edge of the ink, in glyph coordinates. */
  x0: number;
  /** Ink width. */
  w: number;
  /** The y coordinate that sits on the shared alignment line (baseline or centre). */
  a: number;
  paths: GlyphPath[];
}

export interface GlyphTable {
  /** Room above and below the alignment line for the tallest glyph, plus padding around every glyph. */
  metrics: { above: number; below: number; pad: number; padX?: number };
  glyphs: Readonly<Record<string, GlyphData>>;
}

export interface GrammarNote {
  title: string;
  body: string;
  certainty: "confirmed" | "community" | "assumed";
}

export interface LanguageContent {
  name: Record<LangCode, string>;
  /** Who speaks it and where, one short line. */
  blurb: Record<LangCode, string>;
  examples: Record<LangCode, string[]>;
  notes: Record<LangCode, GrammarNote[]>;
  /** Language-specific wording for unknown-word hints. */
  hints?: Partial<Record<UnknownHint, Record<LangCode, string>>>;
}

export interface ArrangeContext {
  question: boolean;
}

export interface LanguageModule {
  id: LanguageId;
  lexicon: Lexicon;
  /** "none": the language has no personal pronouns at all; "third-person": only he/she/it/they are missing. */
  pronouns: "none" | "third-person";
  numbers: boolean;
  /** Glyphs hang from one continuous line (Bard): no gap between cells. */
  connected?: boolean;
  glyphs: GlyphTable;
  /** Resolves synthetic glyph ids that are not in the static table (numbers, overlays). */
  resolveGlyph?: (id: string) => GlyphData | undefined;
  content: LanguageContent;
  arrange(items: Item[], context: ArrangeContext): Line;
}

export type { Entry };
