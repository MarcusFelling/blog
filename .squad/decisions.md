# Decisions

<!-- Canonical decision ledger. Append-only. Scribe merges from decisions/inbox/. -->

## 2026-02-24 — Blog Redesign v1: "Ink" Theme

**Author:** Kaylee (Designer/Dev) | **Status:** Implemented (pending review)

Complete visual redesign removing all framework dependencies (Bootstrap 4.4, jQuery 3.5.1, Popper.js — ~290KB savings). Replaced with ~700 lines custom CSS using CSS custom properties. Key changes: single Inter font, light/dark mode with localStorage toggle, editorial hero home page, accessibility improvements (skip-to-content, ARIA labels, reduced-motion, focus-visible). Retained Font Awesome, search.js, code block enhancements, scroll-to-top, remote theme, Jekyll/Liquid architecture.

**Risks:** Remote theme updates may introduce uncovered Bootstrap classes; light mode untested with all post content; print styles minimal. **Alternatives rejected:** restyle Bootstrap (EOL), Tailwind (build complexity), pre-built theme (creative freedom).

## 2026-02-24 — Ink Theme Redesign: Review Outcome

**Author:** Mal (Lead) | **Status:** APPROVED WITH NOTES

Code review of Kaylee's Ink redesign. CSS architecture excellent, Bootstrap removal clean, accessibility above average. Approved to ship as-is.

**Non-blocking notes:** (1) Remote theme pagination uses `d-none d-sm-inline-block` Bootstrap utilities not in compat layer — causes pagination labels to always show on mobile (~4 CSS line fix). (2) Nested `<main>` elements from remote theme post layout inside base layout's `<main>` — invalid HTML5, requires theme fork or wrapper change. (3) Dead color config values in `_config.yml` from old theme — safe but should be cleaned. (4) Font Awesome `all.min.css` loads ~60KB for few icons — could use subset build.

**Risk:** Remote theme updates could introduce uncovered Bootstrap classes beyond grid. Light mode untested against all historical post content edge cases.
