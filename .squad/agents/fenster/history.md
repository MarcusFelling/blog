# Project Context

- **Owner:** Marcus Felling
- **Project:** blog — technical blog built with Jekyll and hosted on GitHub Pages
- **Stack:** Jekyll, Liquid templates, HTML/CSS/JS, Playwright (TypeScript), GitHub Pages
- **Created:** 2026-03-04

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

### 2026-03-06 — Navbar Utility Items

- Utility links in the sticky navbar must read as secondary actions, not compete with primary navigation. The right pattern here is: brand on the left, primary page links in the middle, utility/social chips as a smaller trailing cluster separated by whitespace or a hairline divider.
- Social chips that work in the footer are too visually detached for the navbar unless they are tightened for the header context: 34–36px touch targets, lower-contrast resting state, and a restrained hover lift are enough. Save the loud accent fill for interaction, not idle state.
- On mobile, do not cram social chips into the top bar beside the menu button. Keep the header focused on brand + menu, then move the same social destinations into the drawer as a distinct secondary section with full 44px targets and clear heading/spacing.

### 2026-03-05 — Full CSS Redesign

- **Font decision:** Replaced Lora + Open Sans (the single most template-signalling combo on the internet) with Inter (body + headings at 700–800 weight) and JetBrains Mono (code). Inter at 800 weight is a credible heading font on its own — no separate display font needed. One Google Fonts request instead of two. Added `--body-font`, `--header-font`, `--mono-font` CSS variables; `--header-font` was already referenced in the pagination rule so this also fixed a latent undefined-variable bug.
- **Accent color:** Replaced `#008aff` (ubiquitous generic blue) with `#f97316` amber-orange. Orange on dark is almost never used in the DevOps/tech blog space — it signals confidence and differentiates immediately. `--link-col` and `--accent-col` are both `#f97316`; the distinction is intentional (semantic vs structural), keeps the door open for future divergence.
- **Color palette depth:** Moved from flat `#121212` background to `#0d1117` (GitHub's dark bg). The difference is subtle but the palette coherence across `--page-col` / `--card-bg` (`#161b22`) / `--card-image-placeholder` (`#1c2128`) creates three distinct depth levels that make the UI feel designed rather than defaulted.
- **Card redesign:** Reduced border from 2px to 1px, softened radius from 8px to 12px, replaced flat box-shadow with deeper `rgba(0,0,0,0.4)` resting shadow. Hover accent: left border transitions to `--accent-col` — creates a directional focus cue that reads as intentional, not just a hover state.
- **Blog post h1:** Removed the gradient-background treatment (unmistakably 2019 tutorial CSS). Replaced with clean bottom border in accent color, `clamp()` font size, weight 800, tight letter-spacing. This is the most impactful single change — it resets the reader's first impression of every post.
- **Code blocks (terminal style):** Added `.highlight::before` with `"● ● ●"` chrome bar using `#1c2128` header + `#0d1117` body. This pattern is recognized as "premium DevOps tooling" by the target audience. Required updating the Unified Syntax Highlight Theme's `!important` overrides and adding a `.highlight > pre` specificity override to keep the inner pre transparent.
- **`!important` cascade:** The Unified Syntax Highlight Theme block uses `!important` to lock in consistent syntax colors across all posts. New `.highlight > pre { background: transparent !important; border: none !important; }` rule placed after that block uses higher specificity to punch through — avoid putting structural code-block rules in the unified theme block itself; keep the theme block purely about token colors.
- **Archive page color consistency:** `archive-filters` had hardcoded `rgba(18,18,18,0.88)` — updated to `rgba(13,17,23,0.88)` to match new `--page-col`. `archive-year-heading` border-bottom had hardcoded blue `rgba(0,138,255,0.25)` — updated to orange. Always grep for hardcoded hex values when doing a palette swap.

### 2026-03-04 — Archives Design Spec

- **Tag accent strategy:** Assigned each filter slug a distinct brand-appropriate accent color. The three Microsoft-adjacent tags (azure-devops, windows, vs-code-extensions) required deliberate hue separation: Azure blue (#0078D4), cornflower blue (#68B5FB), and VS Code teal (#4EC9B0) to avoid clustering. Light accents (windows, vs-code-extensions, ai) need `color: #111` on the active button — always check contrast when accent is light.
- **Sticky bar pattern:** `position: sticky` + `backdrop-filter: blur(10px)` + semi-transparent bg is the standard dark-theme sticky treatment. Always verify `top` offset against the nav height — easy to miss when nav is also sticky.
- **Filter animation:** `max-height` + `opacity` transition is the correct approach for filtering list items — avoids layout flash and degrades gracefully. The stagger (opacity slightly shorter than max-height) makes collapse read more cleanly than simultaneous.
- **Empty state:** Always include `aria-live="polite"` on the empty state container so screen readers announce the change. The reset button inside the empty state should delegate to the "All" filter button's click handler, not duplicate filter logic.
- **Archive count placement:** Moving the count inside the sticky flex bar (`margin-left: auto`) is strictly better than below it — it updates in context without the user needing to scroll back up to find it.
- **`data-tag` attribute gap:** The current template does not emit `data-tag` on `.archive-tag` spans. This is a prerequisite for per-tag pill tinting. McManus must add this before the pill CSS rules will have any effect.
