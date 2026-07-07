---
name: "impeccable-redesign"
description: "How to scope and sequence the impeccable design skills against an existing, contract-protected Jekyll site"
domain: "design-sequencing"
confidence: "low"
source: "observed"
---

## Context

Use this when applying the impeccable design skills (`.agents/skills/`: critique, audit, distill, normalize, quieter, colorize, bolder, polish, adapt, animate, harden, clarify, delight, onboard, extract, frontend-design, teach-impeccable) to a site that already exists and is guarded by tests. It is written for this Jekyll + Playwright + GitHub Pages blog but the sequencing logic generalizes.

Read `.squad/skills/jekyll-workflow/SKILL.md` first for build/test mechanics, and respect every active decision in `.squad/decisions.md`.

## Patterns

### First, diagnose direction — don't assume "make it bolder"

Redesign requests are ambiguous. Before sequencing, classify the starting state:

- **Over-designed** (AI-slop tells present: multi-stop gradients, animated veils, glassmorphism/`backdrop-filter`, dark-with-glow, decorative keyframes, inert animation CSS) → lead with **quieter + distill + normalize**. `bolder`/`colorize` are the wrong direction.
- **Under-designed** (flat, templated, timid palette, no hierarchy) → lead with **frontend-design direction + bolder + colorize**.

Getting this wrong wastes cycles. State the diagnosis explicitly in the scope doc so no one pushes the opposite way.

### Analysis skills vs mutating skills

- **Analysis (read-only, safe to parallelize):** `critique`, `audit`. Run a **baseline `audit`** before any change and a **final `audit`** after, so "no regression" is measurable.
- **Mutating:** everything else. Each mutating pass is followed by a full regression run before the next starts.

### Consolidate tokens before anything else

If visual ownership is split (e.g. inline `<style>` in `_includes/head.html` **and** `assets/css/blog.css`, or two `:root` systems), the first mutating pass is **`extract`** — collapse everything into one token source. Nothing else starts until tokens have a single source of truth, or parallel CSS edits create merge churn.

### Recommended spine

`critique` ‖ `audit(baseline)` → `frontend-design`(direction) → **`extract`(tokens)** → `distill` → `normalize` → `quieter`/`colorize` → `polish` → `adapt` → `animate` → `harden`+`clarify` → `audit(final)`.

Swap `quieter`↔`bolder` and drop/keep `colorize` based on the diagnosis.

### Treat test selectors as the redesign's API

Enumerate every class/id the specs assert (grep the spec files for `locator(`, `getByRole(`, `toHaveClass`, `data-*`). That list is a contract. Any rename must land with the matching test update in the same PR. On this blog the surface is ~80 hooks across 12 specs (landing, archives, command-palette, copy-code, images, post-nav, post-toc, reading-time, related-posts, scroll-to-top, search, 404).

### Map to agent roles

- **Design specs** (critique, direction, quieter/colorize intent) → the design agent (Fenster). Specs, not code.
- **Implementation** (extract, distill, normalize, polish, adapt, animate, harden CSS/JS/templates) → the frontend agent (McManus).
- **Baseline/final audit, regression gates, a11y/contrast, visual checks, test updates** → the test agent (Hockney).

Parallel: design critique ‖ baseline audit (both read-only). Sequential spine after that, with a regression gate after every mutating pass.

## Anti-Patterns

- **Making an over-designed site louder.** If the AI-slop tells are present, `bolder`/`colorize`-first fights the goal.
- **Editing CSS before token consolidation.** Guarantees cascade surprises and merge conflicts in the shared stylesheet.
- **Renaming a hook without updating its spec.** Silent test breakage; the selector list is a contract.
- **Introducing light mode / new plugins / remote themes** as "while we're here" scope creep. Respect the platform constraints (GitHub Pages allowlist, forced dark, local-only theme).
- **Verifying on an incremental build.** Aggregate files (`llms.txt`, `feed.xml`, `search-data.json`) can go stale; do a clean-destination build before sign-off.
