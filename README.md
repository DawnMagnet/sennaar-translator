# Sennaar Translator

A static website that translates Chinese and English into the Devotee language of _Chants of Sennaar_ and draws the result as SVG glyphs.
The translation is one-way and uses a closed vocabulary: only words that have an in-game glyph can be written.
Anything else is flagged, with spelling suggestions.

Everything is TypeScript, built with [Vite+](https://viteplus.dev) (`vite-plus`).

## Commands

Install with pnpm. `npm install` crashed with `Cannot read properties of null (reading 'edgesOut')` when resolving `vite-plus` on npm 10.9.8.

```bash
pnpm install
pnpm exec vp dev        # dev server
pnpm exec vp test       # unit tests (Vitest)
pnpm exec vp check      # format, lint, type-check
pnpm exec vp build      # static site in dist/
pnpm run extract        # regenerate src/data/devotee.glyphs.json from third_party/devotee/Devotee.ttf
pnpm run favicon        # regenerate public/favicon.svg
```

`dist/` is plain static files and can be hosted anywhere (`base` is `./`).

## How it works

```
text --parse--> items (word | ignored | unknown) --arrange--> glyph cells --> SVG
```

- `src/data/devotee.lexicon.ts`: the vocabulary. Each entry's `id` is the ligature key of its glyph; synonyms that share a glyph in the game are merged.
- `src/engine/parse.ts`: tokenizes English (with simple inflection) and Chinese (longest match), drops articles, copulas and similar function words, and flags unknown words.
- `src/engine/devotee.ts`: the grammar. Subject-verb-object order, plural by writing a noun or pronoun twice, role tagging for the UI.
- `src/render/`: glyph SVG elements and SVG/PNG export.
- `src/art/`: the page illustration (tower, dunes, clouds, birds, figures, logo), generated as SVG strings. The palette and line style follow the game's key art; nothing is copied from it.

Supporting another language means adding a lexicon, a glyph source and an `arrange` function with that language's rules.

## Known assumptions

- Chinese glosses are our own wording, not the game's official localisation.
- The meanings of the `pr` (priest) and `shop` glyphs are inferred from their shapes (marked `?` in the vocabulary).
- Where the `not` glyph goes is unconfirmed in the community notes; we keep it where the source sentence put the negation.

## Credits

Unofficial fan project, not affiliated with Rundisc or Focus Entertainment. Please support the game.
Glyph outlines come from the Devotee font by FontsOfSennaar, itself based on LyonsType's Superior Mono (SIL OFL 1.1); see `third_party/devotee/NOTICE.md`.
Vocabulary groundwork builds on community dictionaries, notably Pere_Quisition's glyph dictionary on r/ChantsofSennaar.
