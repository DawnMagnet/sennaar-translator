# Devotee font

`Devotee.ttf` comes from the [FontsOfSennaar](https://github.com/FontsOfSennaar/fontsofsennaar.github.io) project, a font that
maps typed English abbreviations to the Devotee glyphs of *Chants of Sennaar* through OpenType ligatures.

- Base font: LT Superior Mono, Copyright (c) 2024 LyonsType (lyonstype4.wixsite.com/lyonstype-beta), with Reserved Font Name "LT Superior Mono".
- License: SIL Open Font License 1.1, <http://scripts.sil.org/OFL>.
- The font is renamed "Devotee", as the OFL's Reserved Font Name clause requires.
- The in-game glyph designs belong to Rundisc. This is an unofficial fan project.

This repository uses the font only at build time: `tools/extract-glyphs.ts` converts each vocabulary ligature into SVG path data
(`src/data/devotee.glyphs.json`). The font file is not served to browsers.
