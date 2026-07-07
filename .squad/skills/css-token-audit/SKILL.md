---
name: "css-token-audit"
description: "Detect and reconcile competing design-token systems in this Jekyll blog before shipping any CSS/visual change"
domain: "design-system"
confidence: "medium"
source: "observed"
---

## Context

This blog has (as of 2026-07) **two** places that declare design tokens and global styles:

1. `assets/css/blog.css` `:root` — the intended system: Inter + JetBrains Mono, orange `#f97316`, GitHub-dark `#0d1117` surface ramp, per-tag accent palette.
2. `_includes/head.html` inline `<style>` — an older parallel system: a second `:root` (blue `#4f9cff`, purple→blue `--accent-grad`, `--home-*` glass tokens) plus `body.modern { font-family:'Open Sans'… }`, a radial-gradient background and an animated sheen veil.

Because `body.modern` is on `<body>` for **every** page (set in `_layouts/base.html`), the head.html layer can silently override blog.css. Read this before any typography, color, spacing, or "homepage polish" change.

## The Gotcha (verified in-browser 2026-07-06)

`body.modern` forces body `font-family:'Open Sans'`, but Open Sans is **never loaded** — `_layouts/base.html` only requests Inter + JetBrains Mono. Result: body copy computes to `system-ui / Segoe UI` **site-wide**; only headings (which have their own `h1–h6{font-family:var(--header-font)}` rule) actually render Inter. A documented "we use Inter for body" decision was silently defeated for months.

Lesson: a token existing in `:root` does **not** mean it's the one rendering. A competing selector (or an unloaded font) can win.

## Pattern

1. **Inventory both layers first.** Grep both files for `:root`, `--`, `font-family`, `background`, `body.modern` before changing anything:
   - `grep -n "\-\-[a-z]" assets/css/blog.css _includes/head.html`
2. **Verify what actually renders — don't trust the source.** Build, serve `_site/` over HTTP (never `file:` — blocked in Playwright), and check computed styles:
   - `getComputedStyle(document.body).fontFamily`
   - `getComputedStyle(document.querySelector('.blog-post p')).fontFamily`
   - Confirm any web font you rely on is in the `base.html` Google Fonts request.
3. **Reconcile toward `blog.css`.** Per repo direction, `_includes/head.html` holds metadata/SEO/shared-head only; visual tokens and global styles live in `blog.css`. Move the inline styles into `blog.css`; **delete only provably-dead tokens** — grep `var(--name)` across css/html/js first; a token with zero consumers is safe to drop. Retire the unloaded font (`Open Sans`). Do NOT delete a token just because it *looks* vestigial. (M1/2026-07-06 caught this: `--accent-grad` looks like dead System-B cruft but is **live** via `.navbar-modern .brand-badge` and `.social-chips a:hover` — deleting it would change the render, so it was kept and flagged for the restyle pass. Genuinely dead and dropped: `--accent`, `--home-accent-strong`, `--home-surface`, `--radius-*`, `--glass-*`, `--chip-fg-hover`, `--success/warning/error`. Note the glass *look* is literal `backdrop-filter`+`rgba()`, not the `--glass-*` tokens.)
4. **Move cascade-safely.** The inline `<style>` loads *after* `blog.css` (via `base.html`), so it wins equal-specificity ties (`.hero-intro h1`, `.search-input`, `.hero-grid`, `.footer-modern`, `.social-chips`, …). Preserve that by **appending** the moved rules at the *end* of `blog.css`, never the middle/top. Merging the two `:root` blocks is cascade-neutral **only if their keys don't collide** — check first (System A vs System B had zero overlap, so the merge was a no-op for the cascade).
5. **Re-verify after the change** with the same computed-style checks (body should now report the intended font), confirm the served CSS has no leftover bad declaration, then run `npx playwright test`.

## Anti-Patterns

- Editing one `:root` and assuming the change takes effect without checking the other layer or computed styles.
- Referencing a font/token in CSS that isn't actually loaded/defined (silent fallback, no error).
- Adding new homepage styles to `_includes/head.html` — that perpetuates the split. New visual styles go in `blog.css`.

## Related

- Repo memory: `homepage-style-ownership.md` (consolidate head.html → blog.css, pass by pass).
- Decision draft: `.squad/decisions/inbox/fenster-redesign-direction.md` (2026-07-06).
- Decision draft: `.squad/decisions/inbox/mcmanus-m1-token-consolidation.md` (2026-07-06) — this skill applied end-to-end: two `:root` systems merged into `blog.css`, dead tokens dropped, Inter body-font bug fixed and verified in-browser. head.html is now style-free.
- Skill: `jekyll-workflow` (build/serve/test loop — ground truth is a build + computed styles).
