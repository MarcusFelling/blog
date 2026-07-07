---
name: "editorial-dark-theme"
description: "Add distinctive editorial personality to a dark technical theme using type + layout + one accent, WITHOUT reintroducing AI-slop effects"
domain: "visual-design"
confidence: "low"
source: "observed"
---

## Context

Use this after the AI-slop chrome has been (or is being) stripped from a dark technical site, when the direction is **"make it distinctive/editorial"** but the guardrail is **"personality must NOT come from effects."** This is the trap: a request to be "bolder" reads to most implementers as "add blur/gradients/glow/animation back." On a dark technical theme that is exactly wrong — those *are* the AI-slop tells (`frontend-design` skill). Written for this Jekyll blog (Fenster's 2026-07 "distinctive editorial" spec) but the pattern generalizes.

Read `.squad/skills/css-token-audit/SKILL.md` (one token source) and `.squad/skills/impeccable-redesign/SKILL.md` (diagnose direction) first. Respect `.squad/decisions.md`.

## The pattern — personality from three levers only

Distinctiveness on a de-slopped dark theme comes from **type, layout, and one accent** — never effects. If a proposed change can't be expressed through one of these three, it doesn't ship.

1. **Type — a display face used as a "title voice" ONLY.**
   - Pair a distinctive display face with the existing workhorse sans (structure contrast: serif display + grotesque body). Reserve it for hero headline + page/post title + the one featured item. Sections, body, UI, meta, and dense/index content stay the workhorse sans; code stays mono. Reserving the display face keeps its impact high and keeps technical content scannable — using it on every `h2`/`h3` dilutes it and hurts scanning.
   - Choose against the AI-defaults. For "editorial serif," **Playfair Display** is the AI cliché → prefer **Fraunces** (or Newsreader). For "techie sans," **Space Grotesk** is the AI cliché. Keep quirk axes (e.g. Fraunces `WONK`/`SOFT`) at `0` so it reads credible, not costume.
   - Load performantly: one variable woff2, needed axes/weights only, Latin subset, `font-display: swap`. Reuse an already-loaded italic for editorial italics instead of adding a face.

2. **Layout — asymmetry + rhythm, not widgets.**
   - Break the symmetric grid: a left-weighted hero (~60/40), intentional negative space, a true reading measure (**68–72ch**), generous fluid vertical rhythm.
   - Give the newest/featured item asymmetric emphasis via **scale + a typeface shift** (featured = display face, larger; the rest = a tighter sans "index"). That contrast *is* the boldness — no KPI boxes, no dashboard.
   - Un-nest cards: prose on the page at measure, not card-on-card. If a grid framework can't be removed (structural), **un-card it** (strip bg/border/shadow) rather than removing the grid.

3. **One accent, confident and disciplined.**
   - Reserve the single brand accent for links, `:focus-visible`, active state, and **one** structural marker. A clean, high-impact "one marker" is a short **solid** accent kicker rule (e.g. `2.5rem × 2px`) above the top heading level — collapse any over-varied per-level heading decoration (underline + left-bar + colored italic) down to this single treatment; lower levels differentiate by size/weight/space alone. Solid, never a `→ transparent` gradient fade (that's the AI-fade tell).
   - Depth comes from a surface ramp + **1px hairlines**, not blur or drop shadows. Reserve `backdrop-filter` for **genuinely floating layers only** (command palette, mobile drawer) — not the sticky nav or footer.
   - Keep any purposeful categorical color (e.g. per-tag palette) **scoped** to where it aids wayfinding (filters, tag chips); it must not bleed into the hero/prose, where the single accent rules.

## Guardrails that still apply

- **AA contrast on the muted grays.** Editorial restraint tempts faint metadata. Set an **AA floor** for muted text and verify against *every* surface in the ramp (a gray that passes on the darkest page bg can fail on a raised card). Compute, don't eyeball.
- **Motion:** one orchestrated page-load (staggered `translateY`+opacity, ~60–80ms, ease-out-quint) + hover/focus micro-interactions. Everything under `prefers-reduced-motion`. No ambient veils, pulse-glows, parallax, or elastic easing.
- **Overflow:** `text-wrap: balance` + `overflow-wrap: anywhere` on titles; cap hero width in `ch`; no horizontal scroll at 320px.
- **Selectors are a contract.** Removing effect-driven modules (e.g. a KPI panel, a redundant "read more" chip) deletes test-asserted selectors — pair every removal with the test update in the same PR, and assert **placement, not hard-coded lists**.

## Anti-patterns

- Reading "bolder/distinctive" as "add blur, gradients, glow, or more animation." On a dark technical theme that reverts the de-slop work.
- Applying the display face to every heading (dilutes it; hurts scannability).
- Picking the AI-default display font (Playfair / Space Grotesk) — distinctive means *chosen*, not defaulted.
- Colored/gradient heading decoration on every level; `→ transparent` gradient rules.
- New "personality" delivered as a widget/panel instead of through type, layout, or the one accent.

## Implementation traps (verified on this blog's M2 restyle, 2026-07-06)

Two CSS-cascade gotchas bite when you add the "featured item" and the "quiet list":

- **A `--featured` modifier can silently lose to the base card rules.** If the base is `.post-card.modern-card X` (specificity 0,3,0), a `.post-card--featured X` modifier (0,2,0) is *lower* and gets overridden — the display-font title / transparent surface revert to the index style with no error. Write the modifier selectors to include the base classes: `.post-card.modern-card.post-card--featured X` (0,4,0). Don't lean on equal-specificity source-order ties, and remember **media queries add no specificity** — your desktop rule will otherwise beat the mobile-stack rule inside its own `@media` block.
- **A semantic `<nav>` inherits the site's generic nav chrome.** Legacy global rules like `nav { background … } / nav a { color … !important } / nav { border-bottom … !important }` will paint a panel behind (and recolor the links of) any new `<nav>` you add — exactly the "glass panel" the quiet list must not have. Use `<aside aria-label="…">` for a complementary link list (it escapes `nav {}`/`nav a {}` cleanly) plus a defensive `background:transparent; border:0; box-shadow:none`, instead of fighting an `!important` border with more `!important`.
</content>
