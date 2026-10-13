# Sennaar Translator

A static website that translates Chinese and English into the five languages of _Chants of Sennaar_ (Devotees, Warriors, Bards, Alchemists, Anchorites) and draws the result as SVG glyphs.
The translation is one-way and uses a closed vocabulary: only words that have an in-game glyph can be written.
Anything else is flagged, with spelling suggestions.

Live site: <https://dawnmagnet.github.io/sennaar-translator/>

Everything is TypeScript, built with [Vite+](https://viteplus.dev) (`vite-plus`). Pushes to `main` are checked, built and deployed to GitHub Pages by `.github/workflows/deploy.yml`.

## Commands

Install with pnpm. `npm install` crashed with `Cannot read properties of null (reading 'edgesOut')` when resolving `vite-plus` on npm 10.9.8.

```bash
pnpm install
pnpm exec vp dev        # dev server
pnpm exec vp test       # unit tests (Vitest)
pnpm exec vp check      # format, lint, type-check
pnpm exec vp build      # static site in dist/
pnpm run extract        # regenerate every src/languages/*/glyphs.json
pnpm run favicon        # regenerate public/favicon.svg
```

`dist/` is plain static files and can be hosted anywhere (`base` is `./`).

## How it works

```
text --parse--> items (word | number | ignored | unknown) --arrange--> glyph cells --> SVG
```

- `src/engine/`: language-independent parts. `lexicon.ts` indexes a vocabulary (English inflection, Chinese longest match, spelling suggestions), `parse.ts` turns a sentence into items, `roles.ts` tags subject, verb and object.
- `src/languages/<id>/`: one folder per language with its `lexicon.ts`, `content.ts` (texts, examples, grammar notes), `index.ts` (the `arrange` function with that language's grammar) and the generated `glyphs.json`.
- `src/render/`: glyph SVG elements and SVG/PNG export. Every language has its own cell metrics and alignment line, so Bard glyphs stand on a baseline while the others are centred.
- `src/art/`: the page illustration (tower, dunes, clouds, birds, figures, logo), generated as SVG strings. The palette and line style follow the game's key art; nothing is copied from it.
- `tools/`: build-time scripts. `extract-devotee.ts` shapes the Devotee font's ligatures into outlines; `extract-svg-glyphs.ts` converts `third_party/glyph-svgs/` into glyph data and cross-checks it against the lexicons.

Grammar summary:

| Language  | Order                     | Plural                    | Negation                     | Extras                                         |
| --------- | ------------------------- | ------------------------- | ---------------------------- | ---------------------------------------------- |
| Devotee   | SVO                       | noun written twice        | glyph before the verb        |                                                |
| Warrior   | SVO                       | marker before the noun    | glyph before the verb        | no personal pronouns                           |
| Bard      | OSV, VS without an object | marker after the noun     | glyph wraps the sentence     | question marker wraps outside; shared baseline |
| Alchemist | SVO, modifiers after noun | marker after the noun     | glyph before the verb        | numbers 0-9999 as one four-quadrant glyph      |
| Anchorite | SVO                       | radical overlaid on glyph | radical overlaid on the verb | ready-made glyphs for doors, peoples, we, stop |

Adding a language means adding a lexicon, a glyph source and an `arrange` function, then registering it in `src/languages/index.ts`.

## Known assumptions

- Chinese glosses are our own wording, not the game's official localisation.
- Meanings marked `?` in a vocabulary (for example Devotee `pr` and `shop`) are inferred from the glyph shapes.
- The position of the `not` glyph is unconfirmed for Devotee, Warrior and Alchemist; we keep it where the source sentence put the negation.
- Bard plural placement, the question-marker stacking order, Alchemist numbers above 9 and the Anchorite overlays beyond the game's own composites follow fan-written rules and our reading of the digit glyphs, and may differ from the game.

## Credits

Unofficial fan project, not affiliated with Rundisc or Focus Entertainment. Please support the game.

- Devotee glyph outlines come from the Devotee font by FontsOfSennaar, itself based on LyonsType's Superior Mono (SIL OFL 1.1); see `third_party/devotee/NOTICE.md`.
- Vector glyphs of the other four languages come from the fan project [CoSTranslator](https://github.com/EnBlkd/CoSTranslator); see `third_party/glyph-svgs/NOTICE.md`.
- Vocabulary groundwork builds on community dictionaries, notably Pere_Quisition's glyph dictionary on r/ChantsofSennaar.
