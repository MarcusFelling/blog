---
updated_at: 2026-07-07T14:15:00.000Z
focus_area: Blog redesign on PR #84 — open, CI green, Lead-approved; homepage grid-completeness fix applied; about to commit + push
active_issues:
  - "pre-existing content-overflow on 9 posts (long em/code tokens, 1 img, 1 code table) — Fenster design call, not scheduled"
---

# What We're Focused On

**Blog redesign — "distinctive editorial," dark-only — using the impeccable design skills. Now on PR #84 (`redesign-impeccable-editorial` → `main`): open, CI green (12 specs / 71 tests), and Lead-approved (approve-worthy; posted as a review comment since GitHub blocks self-approval). A homepage grid-completeness fix is applied on-branch and we are about to commit + push it.** The coordinator stages, commits, and pushes; the merge decision on the PR is Marcus's.

Personality now comes from **type + layout + one orange accent**, not effects: Fraunces display titles over Inter body, an asymmetric hero, a featured + index post grid, an un-nested post at a 72ch measure, and a quiet Popular-posts list replacing the Pulse/KPI panel — on flat GitHub-dark surfaces. The AI-slop chrome (glass, gradients, sheen veil, dashboard widgets) is gone. Root fix underneath it: one design-token system in `assets/css/blog.css` (the two competing systems + the Open Sans body-font bug are resolved). The follow-up polish pass then cleared the three non-blocking findings — a branded `:focus-visible` ring on the ⌘K controls, long-URL wrap + un-carded row spill, and dead footer JS.

## Current State

- **PR:** #84 (`redesign-impeccable-editorial` → `main`) — open, **CI green**, **Lead-approved** (approve-worthy; review comment, self-approval blocked). Merge is Marcus's call.
- **Direction:** distinctive-editorial, dark-only (Marcus's checkpoint call).
- **Design spec:** Fenster's `editorial-dark-theme` — Fraunces (titles only), one heading kicker rule, single orange accent `#f97316`, full token table.
- **Implementation:** McManus — M1 (token consolidation, the gate) + M2 (editorial restyle) + the polish pass (3 fixes) + the homepage **grid-completeness** fix (`_layouts/home.html` `limit: 12` → `13`, so 1 featured + 12 index cards fill complete rows). Staged, about to commit + push.
- **QA:** Hockney — 12 specs / 71 tests green; wide-viewport 3-col grid, reduced-motion, AA contrast, and the three polish fixes all verified. The grid fix needs no test change (`landing.spec` asserts featured = 1 + count > 0, not a total).
- **Decisions:** consolidated in `.squad/decisions.md` ("Blog Redesign — Distinctive Editorial, Dark-Only"); the PR #84 review + grid-completeness fix now merged in, inbox cleared.

## Active follow-up (non-blocking, not scheduled)

- **Pre-existing content-overflow on 9 of 48 posts** — long unbroken `<em>`/`<code>` prose tokens, one unconstrained `<img>`, one wide code `<table>`. It is **not a regression** (present before the redesign) and the **mobile drawer is NOT the cause** (measured 0px; the standing "no drawer assertions" decision holds). Fixing it is a **Fenster design call** (broadening `overflow-wrap` would break inline `<code>` mid-token), not a CSS-cleanup edit.

## Next

- Coordinator commits + pushes the grid-completeness fix to PR #84.
- Marcus makes the merge call on PR #84.
