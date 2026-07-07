# Project Context

- **Owner:** Marcus Felling
- **Project:** blog — technical blog built with Jekyll and hosted on GitHub Pages
- **Stack:** Jekyll, Liquid templates, HTML/CSS/JS, Playwright (TypeScript), GitHub Pages
- **Created:** 2026-03-04

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

### 2026-03-04 — Tag normalization in archives.md

- The archives page uses a Liquid `if/elsif` chain in `archives.md` to normalize multi-word/aliased tags to their filter slugs. The default fallback is `tag | slugify`.
- `GitHub Copilot` → `ai`, `DevOps` → `cicd` were added as explicit mappings.
- Removed orphaned `Fabric` tag from the hackathon post (no filter button, no sensible mapping).
- Pattern: any new tag that doesn't produce a valid filter slug via `| slugify` needs either a new filter button or an `elsif` entry in the slug normalization block.

### 2026-03-05 — Unused code audit

- Performed full cross-reference of all CSS selectors in `assets/css/blog.css` against every template, include, layout, post, and page.
- Found ~23 discrete issues. The largest categories are: (1) legacy Bootstrap-era footer/nav classes (`.navbar-brand`, `.navbar-toggler`, `.dropdown-*`, `.social-list`, `.footer-links`, `.rss-subscribe`, `.copyright`) never applied by the current custom nav and footer templates; (2) a full scroll-animation system (`.scroll-fade-in`, `.scroll-slide-*`, `.scroll-scale-in`, `.post-card.scroll-animate`) with no JS and no class applications — ~58 lines of inert CSS; (3) an overridden first syntax-highlight token block (~100 lines) superseded by the `!important` block at EOF.
- Key pattern: the "modern redesign" in `_includes/head.html` (large inline `<style>`) introduced new class names for nav, footer, cards, and hero; the parallel selectors for the old names in `blog.css` were never cleaned up.
- `window.__searchDataReady` in `search.js` is written but never read — UNCERTAIN pending external confirmation.
- Live bug found during audit: `_layouts/post.html` is missing `DevOps → cicd` and `GitHub Copilot → ai` slug mappings that exist in `archives.md`. Affects one current post (`2026-02-26`). Filed alongside audit findings.
- Two `_config.yml` variables are unused: `social-share: false` (remote-theme carry-over) and `rss-description` (not read by any template or by `jekyll-feed`).

### 2026-03-05  Bootstrap removal decision

- Assessed Bootstrap 4.4.1 usage across `_layouts/base.html`, `_layouts/post.html`, and both custom JS files.
- Decision: **Keep Bootstrap this iteration.** Grid classes in `post.html` are structural; removing them mid-redesign is out of scope for an aesthetic pass.
- Finding: `scroll-to-top.js` and `search.js` are pure vanilla JS  neither uses jQuery. jQuery, Popper.js, and Bootstrap JS are loaded solely to power `data-toggle="tooltip"` on pagination links in `post.html`.
- Flagged as Phase 2 quick-win: drop Bootstrap JS + Popper + jQuery by replacing pagination tooltips with native `title` attributes. Three CDN requests eliminated, no functional regression.
- Decision filed at `.squad/decisions/inbox/keaton-bootstrap-decision-2026.md`.

### 2026-03-06 — Keep responsive navbar media queries outside reduced-motion

- The navbar social-chip breakpoint rules in `assets/css/blog.css` must stay as top-level `@media` blocks. Nesting them inside `@media (prefers-reduced-motion: reduce)` breaks responsive navbar/drawer behavior for most users and makes the stylesheet structure misleading.
- For this codebase, reduced-motion overrides should only contain motion/accessibility adjustments; layout and breakpoint rules belong at the normal top level.

### 2026-03-24 — Factual review of Work IQ MCP + ADO MCP blog post

- Work IQ repo is at `microsoft/work-iq`, NOT `microsoft/work-iq-mcp`. Easy URL mistake.
- Work IQ MCP exposes `ask_work_iq` (natural language) and `accept_eula` — NOT individual Graph API tools. The blog fabricated tool names like `graph_mail_getMessage`.
- Work IQ is a single MCP server, not a "family" of domain-specific servers (Mail MCP, Calendar MCP, etc.). Three plugins exist: `workiq`, `microsoft-365-agents-toolkit`, `workiq-productivity`.
- Azure DevOps MCP claims are accurate — `create_work_item` with standard ADO fields works as described.
- Copilot Skills (`SKILL.md`) claims check out against VS Code docs. Auto-discovery, slash commands, three-level loading all confirmed.
- "Copilot Cowork" has no findable public documentation as of 2026-03-24. All learn.microsoft.com and support URLs return 404. Comparison claims are unverifiable.

### 2026-04-07 — Jekyll workflow skill extraction

- Audited the full build-test-deploy pipeline: `Gemfile`, `_config.yml`, `_config-dev.yml`, `playwright.config.ts`, `package.json`, all 6 test specs, and `.github/workflows/playwright.yml`.
- Extracted `.squad/skills/jekyll-workflow/SKILL.md` (confidence: low) covering local build, test execution, CI workflow, config file roles, and anti-patterns.
- Key structural facts: Playwright `webServer` auto-starts Jekyll on port 4000; CI is Chromium-only with 4 workers; dev config drift is a documented gotcha from wisdom.md.
- Skill is now routable — any agent touching templates, CSS, or CI should get it in their spawn prompt.

### 2026-04-07 — Reading time architecture decision

- Decided on pure Liquid approach: `content | number_of_words` divided by 200, rounded up via `divided_by` + `modulo` pattern. No plugins, no JS — GitHub Pages safe.
- Placement: new `<span class="post-meta reading-time">` immediately after the existing date span in `_layouts/post.html` line 13, separated by `&middot;`.
- Reuses `.post-meta` styling — no CSS changes needed. Added `.reading-time` as a hook class for future use.
- Edge case: any post with 1–200 words shows "1 min read". Zero-word posts show "0 min read" but shouldn't exist in production.
- Rejected alternatives: `jekyll-reading-time` plugin (not on GH Pages allowlist), client-side JS (unnecessary complexity), `_includes` partial (over-engineering for a single call site).
- Decision filed at `.squad/decisions/inbox/keaton-reading-time.md`.

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