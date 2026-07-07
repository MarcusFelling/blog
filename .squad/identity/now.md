---
updated_at: 2026-07-06T20:30:00.000Z
focus_area: Blog redesign + polish — complete, QA-green (12 specs / 71 tests), staged awaiting Marcus's review + commit
active_issues:
  - "pre-existing content-overflow on 9 posts (long em/code tokens, 1 img, 1 code table) — Fenster design call, not scheduled"
---

# What We're Focused On

**Blog redesign + polish — "distinctive editorial," dark-only — using the impeccable design skills. COMPLETE and QA-green (12 specs / 71 tests), STAGED awaiting Marcus's review + commit.** No commit — Marcus reviews and commits everything (site + `.squad/`) himself.

Personality now comes from **type + layout + one orange accent**, not effects: Fraunces display titles over Inter body, an asymmetric hero, a featured + index post grid, an un-nested post at a 72ch measure, and a quiet Popular-posts list replacing the Pulse/KPI panel — on flat GitHub-dark surfaces. The AI-slop chrome (glass, gradients, sheen veil, dashboard widgets) is gone. Root fix underneath it: one design-token system in `assets/css/blog.css` (the two competing systems + the Open Sans body-font bug are resolved). The follow-up polish pass then cleared the three non-blocking findings — a branded `:focus-visible` ring on the ⌘K controls, long-URL wrap + un-carded row spill, and dead footer JS.

## Current State

- **Direction:** distinctive-editorial, dark-only (Marcus's checkpoint call).
- **Design spec:** Fenster's `editorial-dark-theme` — Fraunces (titles only), one heading kicker rule, single orange accent `#f97316`, full token table.
- **Implementation:** McManus — M1 (token consolidation, the gate) + M2 (editorial restyle) + the polish pass (3 fixes). Staged.
- **QA:** Hockney — 12 specs / 71 tests green; wide-viewport 3-col grid, reduced-motion, AA contrast, and the three polish fixes all verified.
- **Decisions:** consolidated in `.squad/decisions.md` ("Blog Redesign — Distinctive Editorial, Dark-Only"); all polish drafts merged, inbox cleared.

## Active follow-up (non-blocking, not scheduled)

- **Pre-existing content-overflow on 9 of 48 posts** — long unbroken `<em>`/`<code>` prose tokens, one unconstrained `<img>`, one wide code `<table>`. It is **not a regression** (present before the redesign) and the **mobile drawer is NOT the cause** (measured 0px; the standing "no drawer assertions" decision holds). Fixing it is a **Fenster design call** (broadening `overflow-wrap` would break inline `<code>` mid-token), not a CSS-cleanup edit.

## Next

- Marcus reviews the staged diff (site + `.squad/`) and commits.
