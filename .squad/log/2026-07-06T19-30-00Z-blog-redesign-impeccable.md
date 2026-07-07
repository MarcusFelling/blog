# Session Log — Blog Redesign (Impeccable Design Skills)

**Date:** 2026-07-06
**Requested by:** Marcus Felling
**Topic:** Full blog redesign — "distinctive editorial," dark-only — using the impeccable design skills (`.agents/skills/`).
**Status:** Implemented + polished & QA-green (12 specs / 71 tests). **STAGED, awaiting Marcus's review.** No commit (No-Auto-Commit directive). *(Polish pass appended below — the three follow-ups are now cleared.)*

## Summary

Marcus asked the team to redesign the blog with the impeccable design skills. The work ran as a disciplined arc — discovery → scope → direction checkpoint → token consolidation → design spec → baseline → restyle → regression — and every file change is staged, not committed, for his review.

**The problem that shaped everything:** the blog was running **two competing design systems** — the intended one in `assets/css/blog.css` (`:root`) and a second, older one in the `_includes/head.html` inline `<style>` (blue `--accent`, purple→blue `--accent-grad`, glass tokens, `body.modern { font-family:'Open Sans' }`, a radial background + animated `sheen` veil). Because `body.modern` is on every page, the older layer sometimes won — and the provable consequence was that **body copy rendered `system-ui` site-wide** (Open Sans was never loaded), silently defeating the documented Inter-body decision. Consolidation was therefore a correctness fix, not cosmetics.

**Direction (Marcus, at the checkpoint):** distinctive **editorial**, not merely restrained — personality from **typography + layout rhythm + one confident orange accent**, never from re-adding glass/gradients/KPI widgets. **Dark-only.** The homepage "Pulse" KPI panel is replaced by a quiet **Popular-posts** list of plain links. Concept anchor: **"Engineer's field notes, not a dashboard."**

## The arc

1. **Fenster — critique + direction discovery** (read-only). Verdict: PARTIAL AI-slop; the post reading experience is good, the chrome around it is where the AI tells live. Found the two-system split + the body-font bug. → `fenster-redesign-direction.md`, skill `css-token-audit`.
2. **Keaton — scope & sequence** (read-only, parallel). Diagnosis: over-designed, not under-designed. **M1 token consolidation is the gate.** Enumerated the ~80-hook selector contract + hard guardrails + acceptance criteria. → `keaton-redesign-scope.md`, skill `impeccable-redesign`.
3. **Direction checkpoint (Marcus via Coordinator).** Distinctive-editorial, dark-only, Pulse → Popular list, boldness via type/layout/accent not effects. → `coordinator-redesign-direction.md`.
4. **McManus — M1 token consolidation** (staged). Merged the two systems into one `:root` in `blog.css`; reduced `head.html` to metadata; fixed the Inter body-font bug. Behavior-preserving apart from the font fix. → `mcmanus-m1-token-consolidation.md`.
5. **Fenster — editorial design spec** (read-only). Fraunces display face (titles only), one heading treatment, asymmetric hero + featured post, single-orange-accent discipline, full token table. **Supersedes** the #1 discovery draft. → `fenster-editorial-spec.md`, skill `editorial-dark-theme`.
6. **Hockney — pre-redesign baseline** (tests/ only). 65/65 green (fixed one pre-existing content-coupled red in `images.spec.ts` first); enumerated the selector contract; captured baseline screenshots; refreshed the `jekyll-workflow` skill (6 → 12 specs, confidence low → medium). → `hockney-redesign-baseline.md`.
7. **McManus — editorial restyle** (staged). Implemented Fenster's full spec: Fraunces, asymmetric hero, Popular list, un-nested post, single orange accent; removed glass/gradient/veil/Pulse. Verified in-browser. → `mcmanus-editorial-restyle.md`.
8. **Hockney — restyle regression** (tests/ only). Updated `landing.spec.ts` + added a font guard; **12 specs / 70 tests green**; captured "after" screenshots; verified wide-viewport 3-col grid + reduced-motion + AA contrast. → `hockney-redesign-regression.md`.

## Agents

- **Fenster** (Design/UX) — critique/direction discovery + the authoritative editorial spec
- **Keaton** (Lead) — scope, guardrails, skill sequence, acceptance criteria
- **McManus** (Frontend Dev) — M1 token consolidation + M2 editorial restyle
- **Hockney** (Tester) — pre-redesign baseline + restyle regression
- **Marcus Felling** — direction calls at the checkpoint

## Decisions

- All eight inbox decisions merged into `.squad/decisions.md` as one consolidated section, **"Blog Redesign — Distinctive Editorial, Dark-Only."** Fenster's editorial spec is recorded as authoritative and noted as superseding his earlier discovery draft. Inbox cleared.
- New skills produced: `css-token-audit`, `impeccable-redesign`, `editorial-dark-theme`; the `jekyll-workflow` skill was refreshed (12 specs).

## Follow-ups (non-blocking, for the optional polish pass)

1. `.search-trigger` + `.cmd-palette-hint` miss the branded `:focus-visible` ring.
2. 320px post-page horizontal scroll — **pre-existing**, not a redesign regression (the restyle halved it); driver is a long unwrapped URL in prose (`.blog-post a` needs `overflow-wrap: anywhere`).
3. Dead `DOMContentLoaded` JS in `_includes/footer-scripts.html` — safe to delete.

## Polish pass (follow-up, same day)

After the redesign was staged, Marcus greenlit the optional polish pass to clear the three non-blocking findings. Two more spawns, same No-Auto-Commit discipline — everything staged for his review.

- **McManus — 3 fixes (staged).** Two files, additive, personality unchanged. (a) Branded `:focus-visible` ring (`2px var(--focus-ring)`, offset 2px) on `.search-trigger` + `.cmd-palette-hint`; (b) `overflow-wrap: anywhere` on `.blog-post a` + zeroed the un-carded `.post-body > .row` margins (kills the long-URL 320px spill; the wrap rule is load-bearing — 23 posts A/B); (c) removed the dead `DOMContentLoaded` handler (inert `[data-delay]` loop + `.read-more-chip` shim) from `_includes/footer-scripts.html`. → `mcmanus-polish-pass.md`.
- **Hockney — polish regression (tests/ only).** **12 specs / 71 tests GREEN** (added one non-flaky focus-ring Tab test to `landing.spec.ts` + a `tests/redesign/verify-polish.mjs` harness). All three fixes verified. **Corrected McManus's drawer hypothesis:** the `.mobile-drawer` contributes 0px (`position:fixed`, out of flow, no transformed ancestor) — the real ~30–360px horizontal overflow is **pre-existing content on 9/48 posts** (long unbroken `<em>`/`<code>` tokens, one unconstrained `<img>`, a wide code `<table>`), a Fenster design call, not a regression and not the drawer. Refreshed the stale `jekyll-workflow` spec-count table. → `hockney-polish-regression.md`.

**Net:** redesign + polish complete, QA-green at **12 specs / 71 tests**, staged. Both polish drafts merged into the "Blog Redesign" decision; inbox cleared. One documented follow-up remains — the pre-existing content-overflow on 9 posts (a Fenster design call, not scheduled).

## Git

- Site changes (`assets/css/blog.css`, `_layouts/base.html`, `_layouts/home.html`, `_layouts/post.html`, `_includes/head.html`, `_includes/footer-scripts.html`, `tests/`) and all `.squad/` logging **staged, not committed**. Per the standing No-Auto-Commit directive, Marcus reviews and commits everything (site + `.squad/`) himself.
