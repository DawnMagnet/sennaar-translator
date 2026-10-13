# Sennaar Translator: agent notes

- TypeScript only, built with Vite+ (`pnpm exec vp ...`). Install with pnpm; npm crashes resolving `vite-plus`.
- Publishing is automatic. After finishing each unit of work (a new language, a feature, a fix):
  1. `pnpm exec vp check`, `pnpm exec vp test`, `pnpm exec vp build` must pass.
  2. Commit and `git push origin main` (never force-push). The push triggers `.github/workflows/deploy.yml`, which re-runs the checks, builds and deploys GitHub Pages.
  3. Confirm the Actions run succeeded with `gh run watch` or `gh run list`.
- Git on this machine has no global identity and SSH to github.com is not trusted yet. Do not edit git config. Commit and push like this:

  ```bash
  git -c user.name="Dawn Magnet" -c user.email="61567130+DawnMagnet@users.noreply.github.com" commit -m "..."
  git -c credential.helper= -c credential.helper='!gh auth git-credential' push origin main
  ```

- This directory is live-synced with devvm by Mutagen (see `../AGENTS.md`). Run git on WSL only, never on both machines at once.
