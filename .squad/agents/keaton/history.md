# Project Context

- **Owner:** Marcus Felling
- **Project:** blog — technical blog built with Jekyll and hosted on GitHub Pages
- **Stack:** Jekyll, Liquid templates, HTML/CSS/JS, Playwright (TypeScript), GitHub Pages
- **Created:** 2026-03-04

## Core Context

Condensed pre-2026-07-06 Lead learnings (full detail in git history):

- **Tag normalization (2026-03-04):** `archives.md` + `_layouts/post.html` normalize multi-word/aliased tags via a Liquid `if/elsif` chain (default `tag | slugify`); the two **must stay in sync**. Any new tag that doesn't slugify to a valid filter slug needs either a new filter button or an `elsif` in both files.
- **Unused-code audit (2026-03-05):** a full CSS-selector cross-reference found ~23 issues — legacy Bootstrap-era nav/footer classes, an inert scroll-animation system (~58 lines, no JS), a superseded syntax-token block (~100 lines), and 2 unused `_config.yml` vars (`social-share`, `rss-description`). Root cause: the "modern redesign" inline `<style>` in `head.html` introduced new class names; the old parallel selectors in `blog.css` were never cleaned up.
- **Bootstrap stays (2026-03-05):** `post.html` grid classes are structural — removing mid-redesign is out of scope. Vanilla JS (`scroll-to-top.js`, `search.js`) uses no jQuery; jQuery+Popper+Bootstrap JS load solely for pagination `data-toggle="tooltip"`. Flagged quick-win: swap to native `title` to drop 3 CDN requests.
- **Reduced-motion scope (2026-03-06):** navbar social-chip breakpoint rules must stay top-level `@media`; nesting inside `@media (prefers-reduced-motion: reduce)` breaks responsive behavior. Reduced-motion overrides carry motion/a11y only — never layout/breakpoint rules.
- **Work IQ post factual review (2026-03-24):** repo is `microsoft/work-iq` (NOT `-mcp`); it exposes `ask_work_iq` + `accept_eula`, not individual Graph tools; it's one MCP server, not a "family." ADO MCP + Copilot `SKILL.md` claims verified; "Copilot Cowork" has no findable public docs (comparison claims unverifiable).
- **Jekyll workflow skill (2026-04-07):** extracted `.squad/skills/jekyll-workflow/SKILL.md` (confidence low) — local build, tests, CI, config roles, anti-patterns. Playwright `webServer` auto-starts Jekyll on :4000; CI Chromium-only, 4 workers. Route to any agent touching templates/CSS/CI.
- **Reading time (2026-04-07):** pure Liquid — `content | number_of_words` ÷ 200, 1-min floor, a `.reading-time` span after the date in `post.html`. Reuses `.post-meta`; no plugin/JS (GH Pages safe). Rejected `jekyll-reading-time` (not on allowlist), client JS, and an `_includes` partial (over-engineering).

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

### 2026-07-06 — Impeccable redesign scoping

- Scoped the full-site redesign against the 18 impeccable design skills at `.agents/skills/`. Read-only planning pass; filed scope + sequence to `.squad/decisions/inbox/keaton-redesign-scope.md`.
- **Diagnosis that drives the whole plan:** this blog is NOT under-designed, it's over-designed. The current look carries the exact AI-slop tells the `frontend-design` skill warns against — a purple→blue `--accent-grad` (`#5d3bff→#2491ff→#19c6ff`), an animated `sheen` veil on `body.modern:before`, glassmorphism (`backdrop-filter` on hero panel / search results / footer), forced dark-with-glow, and `pulse-glow` keyframes. So the sequence favors **quieter + distill + normalize over bolder + colorize**. This aligns with the existing "Homepage Restrained Polish" decision. Stated it plainly so nobody spends a cycle making it louder.
- **Central architectural risk:** homepage visual ownership is split between a ~180-line inline `<style>` in `_includes/head.html` and `assets/css/blog.css`. There are TWO `:root` token systems (blog.css §1 + the head.html inline block). Consolidation into blog.css is guardrail #1 (matches repo memory + homepage-style-ownership note). Nothing else should start until tokens have a single source of truth.
- **Font drift found:** `_layouts/base.html` loads Inter + JetBrains Mono via Google Fonts, but `head.html` `body.modern` sets `font-family: 'Open Sans'` — which is never loaded. Real bug and a design decision point for Fenster (frontend-design skill also flags Inter as overused).
- **Test-contract surface is larger than the jekyll-workflow skill documents:** 12 specs now, not 6 (added `command-palette`, `copy-code`, `post-nav`, `post-toc`, `reading-time`, `related-posts`). ~80 class/id hooks are the redesign's API. Enumerated them in the decision so any rename pairs with a Hockney test update in the same PR. Flagged that the jekyll-workflow skill's "Test Suite Coverage" table is stale and should be refreshed.
- **Bootstrap stays** (prior decision holds): `post.html` grid (`.container-md`/`.row`/`.col-xl-8`) is structural. The JS stack (jQuery+Popper+Bootstrap) only powers pagination tooltips — still the flagged quick-win (swap to native `title`), but out of scope for the aesthetic pass unless we want it.
- **Dark mode is forced** (`html.dark-theme` + inline script + `body.modern`). Respect it as the single supported theme — do NOT add light mode as scope creep.
- Extracted a reusable skill: `.squad/skills/impeccable-redesign/SKILL.md` — how to sequence the impeccable skills against a contract-protected Jekyll site.

### 2026-07-06 — [Scribe] Redesign direction landed "distinctive editorial" (not "quieter"); shipped QA-green

- **Direction shift to remember:** my scope draft assumed a *restraint/quieter* direction (deferred `bolder`). At the checkpoint Marcus chose **"distinctive editorial"** instead — personality via **type + layout rhythm + one orange accent**, still with the AI-slop chrome removed. Marcus overrode the *direction*, not the *guardrails* — every hard constraint I set (GH Pages allowlist, no remote theme, the ~80-hook selector contract, tag-slug sync, reading-time, ⌘K palette, footer-minimal, no-auto-commit, M1 token consolidation) held.
- **Outcome:** the redesign is implemented, **QA-green (12 specs / 70 tests)**, and **STAGED** for Marcus. All eight redesign inbox decisions are consolidated into `.squad/decisions.md` under "Blog Redesign — Distinctive Editorial, Dark-Only."
- **Canonical going forward:** single-source design tokens live in `assets/css/blog.css` (never in `head.html`); **Fraunces** is the display "title voice" only (hero `h1`, post `h1`, featured card title), Inter everywhere else. Three non-blocking polish findings remain open for McManus.

### 2026-07-07 — PR #84 Lead review: approve-worthy (posted as comment)

- Reviewed the redesign PR (`redesign-impeccable-editorial` → `main`, +2046/−639, 1 commit). CI green: Playwright 12 specs / 71 tests + Squad guard. **Verdict: approve-worthy.** Posted as a review COMMENT — GitHub blocks self-approval, so no formal Approve. Merge stays Marcus's call.
- **Every guardrail held.** Verified directly against the checked-out branch: exactly one `:root` in `blog.css`; `head.html` is metadata/shared-head only (no `<style>`/`:root`); `html,body` font resolves to Inter (Open Sans bug dead, 0 refs); Fraunces scoped to exactly 3 title slots (grep `--font-display` → hero h1 L3022, post h1 L271, featured card title L3109); `--accent:#f97316` single, `--accent-grad`/blue accent gone; only `@keyframes` is `rise` (reduced-motion-gated, base opacity 1); `sheen`/`pulse-glow` gone.
- **`backdrop-filter` audit:** 4 remaining, all on floating overlays (mobile drawer L981, ⌘K backdrop L2219, mobile TOC sheet L2721, explore tooltip L2877) — none on page chrome. Within the spirit of the "palette + drawer" allowlist; noted the decision language should broaden to "floating overlays."
- **Key technique confirmed OK to ship:** the legacy-alias token layer (`--*-col`, `--home-*` re-pointed to flat values) is a documented cascade-safety shim, not reintroduced glass. Decision said `--home-*` was "killed" — names persist, values are flat. Non-blocking; future inline cleanup once consumers migrate.
- **Tag-slug sync guardrail:** `post.html` diff is byte-minimal (`.container-md` → `.container-md post-body` only); the normalization chain is untouched, so sync is preserved. Separately noted a PRE-EXISTING drift (table lists `GitHub Copilot→ai`, `DevOps→cicd` that neither template implements as explicit elsif) — out of scope for this PR, tracked as a nit only, NOT a blocker. Do not block a redesign PR on a chain it doesn't touch.
- **Tests moved in lockstep:** `landing.spec` enforces the full contract delta with placement assertions + count-0 on removed selectors; computed-`font-family` guard locks the M1 fix network-independently; focus-ring guard Tab-reaches both ⌘K controls; `images.spec` validates images-that-exist (no content-coupling). Good discipline from Hockney.
- Filed the review decision to `.squad/decisions/inbox/keaton-pr84-review.md`.