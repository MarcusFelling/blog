# Squad Decisions

## Active Decisions

---

### Blog Redesign — Distinctive Editorial, Dark-Only (Impeccable Design Skills)

**Date:** 2026-07-06
**Authors:** Fenster (Design/UX), Keaton (Lead), McManus (Frontend Dev), Hockney (Tester) — direction by Marcus Felling
**Status:** Implemented + polished & QA-green (12 specs / 71 tests). **On PR #84** (`redesign-impeccable-editorial` → `main`) — **open, CI green, Lead-approved** (approve-worthy; posted as a review comment since GitHub blocks self-approval — merge is Marcus's call). Homepage grid-completeness fix applied on-branch; about to commit + push the fix.
**Consolidates:** the eight redesign inbox decisions (Fenster discovery + editorial spec, Keaton scope, coordinator direction, McManus M1 + M2, Hockney baseline + regression), the two polish-pass drafts (McManus 3-fix, Hockney polish regression), plus the PR #84 Lead review and the homepage grid-completeness fix.

The blog was redesigned with the impeccable design skills. The redesign **removes the AI-slop chrome and replaces it with editorial confidence expressed through type, layout, and one accent** — not effects.

**Root problem it fixes.** The site ran **two competing design systems**: the intended one in `assets/css/blog.css` (`:root`) and an older one in the `_includes/head.html` inline `<style>` (blue `--accent`, purple→blue `--accent-grad`, glass tokens, `body.modern { font-family:'Open Sans' }`, radial background + animated `sheen` veil). Because `body.modern` is on every page, the older layer sometimes won — and `body.modern` forced the never-loaded Open Sans, so **body copy rendered `system-ui` site-wide**, silently defeating the documented Inter-body decision. Consolidation was a correctness fix, not cosmetics.

#### Direction (Marcus, at the checkpoint)

1. **Boldness = "distinctive editorial"** — personality from **typography + layout rhythm + confident use of the single orange accent**, NOT from re-adding glass/gradients/dashboard-KPI widgets.
2. **Theme = dark-only** (no light mode).
3. **References = team discretion.** Concept anchor: **"Engineer's field notes, not a dashboard."**
4. **Homepage "Pulse" KPI panel → quiet "Popular posts" list** — plain links from `_data/top_pages.yml`, no counters, no emoji.

#### Authoritative design spec (Fenster)

`fenster-editorial-spec.md` is the authoritative design spec and **supersedes** Fenster's earlier discovery draft (`fenster-redesign-direction.md`); the draft's "open questions" are resolved by Marcus's direction above.

- **Typography.** **Fraunces** (variable serif, Google Fonts, one combined request) is the display **"title voice" only** — homepage hero `h1`, post `h1`, and the featured card title. Everything else is **Inter** (body, UI, sections `h2`–`h4`, index cards); code stays **JetBrains Mono**. Fraunces was chosen over the AI-defaults Playfair Display / Space Grotesk. Body root 17px, measure **68–72ch**, fluid `clamp()` heading scale.
- **One heading treatment.** Collapse the three old in-prose decorations (h2 border + gradient `::after`, h3 orange left-bar, h4 orange italic) into **one** solid orange kicker rule (`2.5rem × 2px`) above `h1` + `h2` only; h3/h4 differ by size/weight/space alone.
- **Layout.** Asymmetric **left-weighted hero** (~61/39) with the Popular list in the right negative space (stacks below on mobile — adapt, don't amputate). Post grid = **featured (newest, full-width, Fraunces) + Inter index** (`repeat(3,1fr)` → 2 @1024 → 1 @640). Post page **un-nested** — un-card the structural `.container-md` (add `.post-body`), keep the Bootstrap columns (Keaton's constraint), constrain `.blog-post` to 72ch. Remove the redundant per-card "Read Post →" chip.
- **Color — single-accent discipline.** `#f97316` is the only accent (links, `:focus-visible`, active, the kicker rule, card-title hover). Surface ramp `--page #0d1117` → `--surface-raised #161b22` → `--surface-inset #1c2128`; depth from 1px hairlines, not blur/shadow. **Killed:** blue `--accent`, `--accent-grad`, radial background, `sheen`, `pulse-glow`, `.brand-badge` gradient, `body.modern`'s Open Sans; the `--home-*` glass **values** removed (names retained as flat-valued aliases for cascade safety). **Blur reserved for genuinely floating overlays only** (command palette, mobile drawer, mobile TOC sheet, explore tooltip). The **per-tag palette is kept but scoped** to Archives filter pills + related-post "shared tag" chips (min 3:1; light tags get `#111` text) — it must not bleed onto the homepage or into post prose.
- **Motion.** One orchestrated staggered homepage load (`translateY` + opacity, ~420ms, ease-out-quint), plus hover/focus micro-interactions — all under `prefers-reduced-motion: no-preference`, base opacity 1 so reduced-motion renders the final state. No ambient/veil/pulse/parallax/elastic.
- **A11y (WCAG AA).** Muted-text floor `#8b949e` (retires `#7f93a2` / `#6d8394` / `#8cafc8`, which failed on raised surfaces); text ramp primary `#e6edf3` / secondary `#c9d1d9` / muted `#8b949e`; orange text passes AA; visible `2px` accent focus rings; long-title/overflow handling; touch targets ≥ 44px; no horizontal scroll at 320px.

#### Token system — single source of truth (McManus, M1 gate)

- **All `:root` design tokens + global/homepage styling live in `assets/css/blog.css`.** `_includes/head.html` is **metadata / shared-head only** — never add a `:root` or inline `<style>` there again (that was the split-brain bug). Captured in the `css-token-audit` skill and repo memory `homepage-style-ownership`.
- Removing a token requires proving zero `var()` consumers first (grep css/html/js). If removing it would change the render, it is a restyle change, not cleanup.
- M1 was behavior-preserving apart from the deliberate body-font fix (`body.modern { font-family: var(--body-font) }` = Inter, verified in-browser). Cascade-safe technique: moved chrome appended at the end of `blog.css` to preserve the ties the inline block used to win.

#### Test contract & regression (Hockney)

- The **~80-hook Playwright selector contract** is the redesign's API; any rename/removal lands with the matching spec update **in the same PR**, asserting **placement, not hard-coded lists**.
- Contract delta: **removed** `.hero-panel`, `.hero-kpis`, `.read-more-chip`, `.pulse-heading`, `.top-pages-box/-label`, `.top-page-link` (and the Pulse/"Posts"/"Years" text); **added** `.popular-posts` (+ `.popular-posts-eyebrow`), `.popular-post-link`, `.post-card--featured`; **kept/restyled** `.hero-grid`, `.search-trigger` (+`-kbd/-text/-icon`), `.post-card.modern-card` / `-link` / `-image` / `-title`, `.browse-archive-btn` (now a ghost link, label unchanged). Code-block chrome, `.reading-time`, `#cmd-palette*`, TOC/progress, related-posts, pager, nav social-chips all preserved.
- **Suite: 12 specs / 71 tests green** (up from 65; landing 4→8 then +1 focus-ring, reading-time 1→2). A **font guard** (computed `font-family` — Fraunces on the three title slots, Inter on body) locks the M1 font fix + the display face and is network-independent. Verified: >1024 index grid = 3 columns, reduced-motion kills the entrance, AA contrast on all new muted text, `footer .social-chip` = 0.
- **Testing rules (reusable):** image/content specs assert "images that exist load; no broken images," never "every recent post has an image." Classify red/overflow as new-vs-pre-existing by serving both frozen builds (`_site_baseline` + `_site_redesign`) on different ports and probing the same path. Use a fresh `-d` destination + `--no-watch` frozen serve to sidestep the `incremental:true` staleness gotcha and avoid racing live edits; Jekyll's own server (not `python -m http.server`) is required for the real-404 test.

#### Guardrails preserved (unchanged by the redesign)

GitHub Pages plugin allowlist only; no remote theme; navbar social-chip placement (brand → Archives utility pill → lighter social chips → ⌘K; chips in the drawer on mobile, not the top bar); footer minimal (copyright only, zero `.social-chip`); tag-slug `if/elsif` chains in `archives.md` and `_layouts/post.html` stay identical; pure-Liquid reading-time; ⌘K command-palette contract; terminal-chrome code blocks preserved as the signature element; **no auto-commit — stage for Marcus's review.**

#### Polish pass (done — McManus fixes, Hockney verified)

The three non-blocking findings above were cleared in a follow-up pass (two files, additive; personality unchanged). **Staged, not committed.**

1. **Branded `:focus-visible` ring on the ⌘K controls.** `assets/css/blog.css`: `.search-trigger:focus-visible, .cmd-palette-hint:focus-visible { outline: 2px solid var(--focus-ring); outline-offset: 2px; }` (matches the `.nav-links a:focus-visible` convention). Verified under real keyboard **Tab** (not programmatic `.focus()`, which doesn't engage `:focus-visible` in Chromium): both compute `2px solid rgb(249,115,22)`. Locked by a non-flaky CI test in `landing.spec.ts` that Tab-*searches* to each control (no hard-coded Tab count).
2. **Long prose links wrap at 320px + un-carded row spill.** `assets/css/blog.css`: `.blog-post a { overflow-wrap: anywhere; }` (load-bearing — A/B toggling it off overflows 23 posts, on it 0) plus zeroing the `.post-body > .row` / `.header-section .container-md > .row` margins (Bootstrap negative-gutter spill; now `0px/0px`, no card chrome reintroduced).
3. **Dead footer JS removed.** `_includes/footer-scripts.html` is now a Liquid comment placeholder (the `DOMContentLoaded` handler's `[data-delay]` loop and `.read-more-chip` shim were both inert); homepage entrance still animates via CSS (`rise`, staggered, opacity 1), 0 console errors, and `base.html`'s `{% include %}` stays valid.

Verified by Hockney at **12 specs / 71 tests green** (frozen `_site_redesign2` build; +1 focus-ring test, +`tests/redesign/verify-polish.mjs` harness).

#### PR #84 — Lead review: approve-worthy (Keaton, 2026-07-07)

The redesign is up as **PR #84** (`redesign-impeccable-editorial` → `main`, 1 commit). **CI green** (Playwright 12 specs / 71 tests + Squad Protected Branch Guard). **Verdict: approve-worthy** — posted as a review **comment** (GitHub blocks self-approval); the **merge decision is Marcus's**. Review only — no merge, push, or source/test edits.

Verified against the checked-out branch (not just the diff): single `:root` in `blog.css`; `head.html` metadata/shared-head only; `html,body` → Inter (Open Sans bug dead, 0 refs); Fraunces on the 3 title slots only; single `--accent:#f97316`; only `@keyframes rise` (reduced-motion-gated); the 4 surviving `backdrop-filter`s are all floating overlays (drawer, ⌘K backdrop, mobile TOC sheet, explore tooltip); tests moved in lockstep (contract delta with placement assertions, computed-font guard, focus-ring guard on both ⌘K controls, `images.spec` validates images-that-exist). Nits 1–2 (decision language) are applied above: `--home-*` values-removed / names-retained, and the blur allowlist reworded to "floating overlays." **Nit 3 — pre-existing tag-map drift (tracked, NOT this PR):** `_layouts/post.html` implements fewer explicit tag mappings than the Tag Slug Normalization table below (`GitHub Copilot→ai`, `DevOps→cicd` missing as explicit `elsif`). This PR doesn't touch the chain, so it is **not a regression**; if the table is to be honored, that's a separate small task — route to McManus, paired with the same edit in `archives.md` + a Hockney sync check. Do not fold it into the redesign PR.

#### Homepage grid completeness — index card count must fill complete rows (McManus, 2026-07-07)

Marcus spotted an empty card slot in the last row of the homepage grid. `_layouts/home.html` looped `limit: 12`; `forloop.first` renders the full-width `.post-card--featured` lead (`grid-column: 1 / -1`, its own row), leaving **11** index cards — divisible by no multi-column regime, so a hole in the last row at 3-col (3·3·3·2) and 2-col (2·5+1). **Fix: `limit: 12` → `limit: 13`** (1 featured + **12** index), with a `{% comment %}` documenting the math so it isn't "tidied" back.

**Durable row-math rule.** With a full-width featured lead + N index cards flowing in a grid, **N must be a multiple of the LCM of every active column count** or the last row has holes. The homepage grid `.post-cards-container.modern-grid` is 3 (>1024px) → 2 (641–1024) → 1 (≤640); LCM(3,2)=6. **12 is divisible by 6 and by 4** → complete rows at 3-col (4 rows), 2-col (6 rows), and the legacy >1200px 4-col regime; 11 was the worst possible (divisible by nothing). Rule of thumb: **index cards ∈ {6, 12, 18, …}; `limit` = that + 1.**

Verified on a clean build served on a fresh port + fresh browser page: rowCounts `[3,3,3,3]` @1280 and `[2,2,2,2,2,2]` @800; featured spans the full container width at both. (Verification gotcha: the long-lived `:4000` preview tab served a **cached** pre-redesign `blog.css` — always confirm CSS-cascade claims on a fresh port + `forceNew` page, and byte-diff the served asset against source.) **No test change required** — `landing.spec.ts` asserts `.post-card--featured` = 1 and `cardCount > 0`, not a total count; a multiple-of-6 count guard would be a separate Hockney addition. Featured-lead design intact; GitHub Pages compatible (pure Liquid `limit`). **Staged; about to commit + push on PR #84.**

#### Standing follow-up (non-blocking, NOT scheduled) — pre-existing content overflow on 9 posts

The polish cleared only the *link* portion of the 320px post-page scroll. The remainder is **pre-existing content, not a regression from the redesign or the polish**, on **9 of 48 posts** (39 fully clean): long unbroken `<em>`/`<code>` prose tokens (e.g. `gitflow-visual-studio-team-services` `*ProjectName*` = +362px), one unconstrained `<img>` (`configuration-management-serverless-microservice-projects` = +39px), and a wide code `<table>` (`versioning-net-assemblies…` = +41px).

- **The mobile drawer is NOT the cause.** McManus's polish draft hypothesized the off-canvas `.mobile-drawer` as the dominant driver (~35px, ~48 posts, via a transformed ancestor). Hockney's isolation measurement (`canScrollRight` with the drawer present vs. hidden) corrects this: the drawer contributes **0px on all 48 posts** — `position:fixed` is viewport-relative and out of document flow, and there is no transformed ancestor above it. It is a red herring.
- **The standing "no mobile-drawer assertions until stable in CI" decision holds** (reinforced — the drawer is not implicated here). Do not spend effort on a drawer fix; it would needlessly touch the ⌘K/drawer contract.
- **Fixing the content is a Fenster design call, not a CSS-cleanup edit.** Broadening `overflow-wrap: anywhere` from `.blog-post a` to `.blog-post` would catch the `<em>` tokens but also break inline `<code>` mid-token; the one wide `<img>` / code `<table>` need targeted caps. Not scheduled.

---

### Tag Slug Normalization Strategy

**Date:** 2026-03-04  
**Authors:** Keaton (Lead), McManus (Frontend Dev)

Tag slug normalization is handled via an explicit `if/elsif` chain in both `archives.md` and `_layouts/post.html`. These two implementations **must stay in sync**. The default fallback is `tag | slugify`.

**Current mappings:**

| Raw tag value   | Slug used       |
|-----------------|-----------------|
| Azure Pipelines | `azure-devops`  |
| Azure DevOps    | `azure-devops`  |
| GitHub Copilot  | `ai`            |
| DevOps          | `cicd`          |
| CICD            | `cicd`          |
| (all others)    | `tag \| slugify` |

**Rules for future tags:** When adding a new tag that is multi-word or an alias, either add a `data-filter` button to `archives.md` **and** an `if/elsif` mapping to `_layouts/post.html`, or map to the closest existing filter slug in both files.

Also: removed orphaned `Fabric` tag from the hackathon post front matter (no filter button, no sensible mapping).

---

### Archives Page — Cleanup and AI Section Rules

**Date:** 2026-03-04  
**Author:** Verbal

1. AI tag added to tag cloud and a new `## AI` section added after `## GitHub Actions`.
2. Duplicate entry removed from `## Azure DevOps / TFS`.
3. Misplaced entry ("Visual Studio Marketplace Metrics") removed from `## VS Code Extensions`.

**Rules:**
- Tag cloud anchors and `## Section` headings must stay in sync (same lowercase-hyphenated pattern).
- A post should only appear in a section it genuinely relates to — omit rather than guess.

---

### CSS: Eliminate Empty Blocks in Jekyll Code Highlights

**Date:** 2026-03-04  
**Author:** McManus (Frontend Dev)

In `assets/css/blog.css`:
- Removed `padding: 1px` from `.highlight`
- Added `overflow: hidden` to `.highlight` so `border-radius` clips children correctly
- Added `.highlight > pre { margin: 0; }` to suppress `pre` margins inside the coloured wrapper

Pattern applies any time a background-coloured wrapper contains a block element with vertical margin.

---

### No Auto-Commit Directive

**Date:** 2026-03-05
**By:** Marcus Felling (via Copilot)

Do not auto-commit changes. Stage files but skip the `git commit` step. Marcus needs to review changes before they are committed.

---

### Navbar Social Chips Placement, CSS Scope, and Regression Rules

**Date:** 2026-03-06
**Authors:** Fenster (Design/UX), McManus (Frontend Dev), Hockney (Tester), Keaton (Lead)

Social links are part of the site chrome and now belong in the navigation system, not the footer.

**Layout and UX rules**

- Desktop order stays: brand → primary nav links → social chip cluster.
- The social cluster is a right-aligned utility group and should remain visually lighter than the primary nav.
- On mobile, hide social chips from the top bar and render them below the main drawer links as secondary utility actions.
- The footer stays minimal: copyright only.

**Implementation rules**

- Capture shared social-link markup once in `_includes/nav.html` and reuse it for both desktop navbar and mobile drawer rendering.
- Keep navbar-specific styling in `assets/css/blog.css` under `.navbar-modern .nav-social` and `.mobile-drawer .nav-social` so it does not disturb generic chip styling.
- Preserve existing icon-only `aria-label`s and strong focus treatment.

**CSS structure rules**

- Responsive navbar and drawer rules must remain in top-level breakpoint `@media` blocks.
- Reduced-motion media queries may change animation or transition behavior only; they must not own navbar layout or breakpoint behavior.

**Testing rules**

- Landing-page regression coverage should assert placement, not a hard-coded social-link list.
- Assert the navbar social-chip container exists, validate any rendered chip hrefs sanely match their labels, and assert the footer exposes no `.social-chip` links.
- Do not add mobile drawer assertions until the drawer behavior is stable in CI.

---

### Reading Time — Pure Liquid Approach

**Date:** 2026-04-07
**Authors:** Keaton (Lead), McManus (Frontend Dev)

Blog posts display an estimated reading time calculated with pure Liquid — no plugins, no JavaScript. Fully compatible with GitHub Pages.

**Calculation:** `content | number_of_words` divided by 200 (standard technical reading speed), rounded up. Minimum 1 minute for any non-empty post.

**Placement:** In `_layouts/post.html`, after the "Posted on" date span, separated by ` · `. Wrapped in `<span class="post-meta reading-time">`.

**CSS:** Single rule — `.reading-time { color: var(--mid-col); }` in `assets/css/blog.css`. Inherits font-size/weight from `.post-meta`.

**Files changed:**
- `_layouts/post.html` — Liquid calculation and display
- `assets/css/blog.css` — `.reading-time` style

**Rules:**
- Use 200 wpm; integer division avoids Liquid float issues.
- No plugins (`jekyll-reading-time` isn't on the GitHub Pages allowlist).
- No JavaScript — static metadata doesn't need client-side computation.
- No partial include — 4 lines of Liquid in one template doesn't warrant `_includes/`.

---

### Jekyll Workflow Skill Extraction

**Date:** 2026-04-07
**Author:** Keaton (Lead)

Created `.squad/skills/jekyll-workflow/SKILL.md` capturing the team's build-test-deploy patterns: local build commands, config file purposes (`_config.yml` vs `_config-dev.yml`), Playwright test setup, CI workflow structure, and known gotchas (dev config drift, tag slug sync, Bootstrap dependency).

**Confidence:** `low` — first formal extraction. Needs confirmation from another agent applying it successfully to bump to `medium`.

**Routing rule:** Any agent touching templates, CSS, tests, or CI should read this skill at spawn time.

---

### Remove remote_theme Dependency

**Date:** 2026-03-11
**Author:** McManus (Frontend Dev), verified by Hockney (Tester)

Removed `remote_theme: marcusfelling/blog-theme` from `_config.yml`, removed unused `gem "minima"` from `Gemfile`, and created `_layouts/page.html` locally. All layouts/includes/assets were already local — the remote theme was redundant.

**Rules:**
- The blog has no remote theme dependency. All layouts, includes, and assets are local.
- `_layouts/page.html` extends `base` and is the default layout for non-post pages.
- The `github-pages` gem remains for GitHub Pages deployment.

---

### Archives Spec — Remove Content-Coupled Tests

**Date:** 2026-03-11
**Author:** Hockney (Tester)

Removed three tests from `archives.spec.ts` that targeted specific blog posts by URL slug. These tests broke when content changed — failures caused by content edits, not feature regressions. The behaviors they guarded (tag normalization, hash deep-linking, filter activation) are already covered generically by the remaining filter and deep-link tests.

**Rule going forward:** Archive tests should assert feature behavior (filtering, deep-linking, link validity) without referencing specific post URLs or titles. If a post-specific regression guard is needed, it belongs in a separate content-focused spec.

---

### Homepage Restrained Polish Rules

**Date:** 2026-03-13
**Author:** Marcus Felling (via Copilot)

During homepage polish passes, keep the existing homepage copy and information architecture fixed. Prefer CSS-only refinement work focused on the home hero and cards, and reduce AI-template tells by favoring solid headline typography, quieter surfaces, and restrained hover/focus states over louder gradients, glass effects, or structural rewrites.

**Rules:**

- Keep homepage copy and information architecture unchanged during restrained polish passes.
- Prefer CSS-only refinements before touching homepage markup.
- Focus visual polish on the home hero and card presentation.
- Favor quieter surfaces and restrained interactions over louder gradient-heavy or glass-heavy treatments.

---

### Temporary Workspace Gitlink Hygiene

**Date:** 2026-03-13
**Author:** Hockney (Tester)

The repository must not track temporary tooling workspaces as gitlinks. `.tmp/impeccable` was accidentally tracked as a gitlink without a matching `.gitmodules` entry, which reproduced `fatal: No url found for submodule path '.tmp/impeccable' in .gitmodules`.

**Rules:**

- Remove tracked temp-workspace gitlinks from the repository index instead of trying to repair them as submodules.
- Keep `.tmp/` ignored so temporary local workspaces cannot be recommitted accidentally.
- Treat `.tmp/` as local-only workspace state unless the team explicitly chooses to vendor content elsewhere.
- Validate cleanup with `git submodule status`, `git ls-files -s .tmp/impeccable`, and `git check-ignore -v .tmp .tmp/impeccable`.

---

### Navbar Archives Utility Pattern and Intentional Mobile Drawer

**Date:** 2026-03-06
**Authors:** Fenster (Design/UX), McManus (Frontend Dev)

When the site only exposes a single browse link in the main navigation, `Archives` should be treated as a utility action, not centered like a full primary-nav set.

**Desktop rules**

- Keep the navbar hierarchy intentional: brand on the left, then a trailing utility cluster that contains the `Archives` action and social chips.
- Style `Archives` like a quiet pill or button so it reads as a deliberate utility CTA rather than a stranded text tab.
- Prefer a tinted pill treatment with subtle inset accents and a slightly warmer border/background; avoid decorative status dots or other ornamental markers.
- Preserve the lighter visual weight of the social-chip cluster relative to primary navigation.

**Mobile rules**

- Keep the top bar limited to brand + menu trigger.
- In the drawer, surface `Archives` first as the primary browse action, then other page links, then a clearly separated social/elsewhere section.
- The drawer should feel modal: use a backdrop, lock page scroll while open, and close it on link activation.

**Implementation rules**

- Keep navbar and drawer layout rules together in `assets/css/blog.css`; do not split layout ownership between CSS files and injected head styles.
- Reuse the shared captured social-link markup inside the drawer instead of maintaining separate mobile-only social markup.
- Target the polished `Archives` utility treatment with an explicit `nav-link-archives` class in `_includes/nav.html` instead of positional selectors so future nav refinements stay tightly scoped.
- Keep the emphasis CSS-only and scoped to `.nav-link-archives` so future navbar refinements stay isolated from surrounding links.

---

### AI-Voice Detection Patterns for Blog Reviews

**Date:** 2026-03-24
**Author:** Verbal (Content Dev)

During review of the Work IQ MCP + ADO automation post, established concrete AI-voice detection patterns for Marcus's blog.

**Key tells to catch:**
- Qualifier openers ("The architecture is straightforward")
- Corporate compound phrases ("structured, governed")
- LinkedIn-style closers ("It's the difference between X and Y")
- Thought-leadership framing ("complementary, not competing")

**Marcus's natural voice:** First-person, confessional, specific to real workflow pain, with occasional dry self-deprecation. These patterns should inform future blog reviews.

---

### Blog Post Factual Accuracy — Work IQ and MCP Claims

**Date:** 2026-03-24
**Author:** Keaton (Lead)

Factual review of the Work IQ MCP + ADO automation blog post.

**Errors corrected:**
1. Work IQ repo URL fixed: `github.com/microsoft/work-iq-mcp` → `github.com/microsoft/work-iq`
2. Removed fabricated tool names (`graph_mail_getMessage`, `graph_calendar_listEvents`) — Work IQ exposes a single natural-language query tool, not individual Graph API operations
3. Removed incorrect "family of MCPs" description (Mail MCP, Calendar MCP, etc.) — Work IQ is one unified MCP server

**Flagged for Marcus:**
- Cowork comparison claims unverifiable (no public docs found)
- "User-delegated permissions" phrasing more precise than source material
- Sensitivity labels enforcement claim not documented in Work IQ repo

---

### ASCII-Only in GitHub Actions Workflow Files

**Date:** 2026-04-07
**Author:** Marcus Felling (via Copilot directive)

Never use Unicode characters (em dashes, emoji, special symbols) in GitHub Actions workflow files. Use ASCII-only — plain dashes (`--`), plain text descriptions, no emoji in strings. Windows encoding mismatches corrupt Unicode in YAML.

---

### Default Model — claude-opus-4.6 for All Agents

**Date:** 2026-04-07
**Author:** Marcus Felling (via Copilot directive)

Changed the default model to `claude-opus-4.6` across all agents. No more tiered model selection (haiku/sonnet/opus) — everything runs on opus.

---

### Command Palette Architecture

**Date:** 2026-04-07
**Authors:** McManus (Frontend Dev), Hockney (Tester)

Built a ⌘K / Ctrl+K command palette for quick post navigation using vanilla JS (no framework), matching existing codebase convention.

**Implementation:**
- `_includes/command-palette.html` — dialog markup with search input, results listbox, ⌘K kbd hint
- `assets/js/command-palette.js` — keyboard shortcut listener, debounced fuzzy search against `/search-data.json`, keyboard nav ↑/↓/Enter, focus trap, backdrop click to close, highlight matching text, recent-posts default view
- `assets/css/blog.css` — section 14: COMMAND PALETTE (~200 lines)
- `search-data.json` — added `tags` field (additive, non-breaking)
- `_includes/nav.html` — ⌘K hint pill in desktop nav
- `_layouts/base.html` — include and script wired

**Rules:**
- Reuses `/search-data.json` via `window.__searchData` shared with `search.js`
- 150ms debounce on search input
- Focus trap + full keyboard nav for accessibility
- ⌘K hint pill placed next to social chips in desktop nav
- Tests use semantic selectors (`role="dialog"`, `role="option"`, `aria-selected`) with class-based fallbacks

**Test coverage:** 13 Playwright tests in `tests/command-palette.spec.ts` covering open/close, search, keyboard nav, navigation, discovery hint, and cross-page functionality.

---

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
