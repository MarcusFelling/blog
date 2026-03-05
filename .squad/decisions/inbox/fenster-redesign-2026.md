# CSS Redesign: Typography, Palette, and Component Refresh

**Date:** 2026-03-05
**Author:** Fenster (Design/UX)
**Requested by:** Marcus Felling

---

## Decision Summary

Full visual redesign of `assets/css/blog.css` and font imports in `_layouts/base.html`. The goal was to move the blog from "vibe-coded template" to credible, aesthetically distinguished, and modern.

---

## Changes Made

### Typography
- **Replaced** Lora (headings) + Open Sans (body) with **Inter** (body + headings) and **JetBrains Mono** (code/mono).
- Rationale: Lora + Open Sans is the single most common default blog font pairing. Inter at 700–800 weight is a complete heading solution — no separate display font needed. JetBrains Mono is contextually appropriate for a DevOps blog.
- One Google Fonts request now instead of two.
- Added CSS variables: `--body-font`, `--header-font`, `--mono-font`.
- Set `html, body { font-size: 17px; line-height: 1.75; -webkit-font-smoothing: antialiased; }`.

### Color Palette
- **Accent:** `#008aff` → `#f97316` (amber-orange). Rationale: orange on dark is almost never used in the DevOps tech blog space. Blue-on-dark is exhausted.
- **Background:** `#121212` → `#0d1117`. Three-level depth system: page (`#0d1117`), card surface (`#161b22`), card inset (`#1c2128`).
- Full variable update: `--page-col`, `--card-bg`, `--card-border`, `--navbar-col`, `--navbar-border-col`, `--footer-col`, `--text-col`, `--mid-col`, `--footer-text-col`, `--footer-link-col`, `--link-col`, `--hover-col`, `--tag-bg`, `--card-image-placeholder`.
- Added `--accent-col: #f97316` as a structural counterpart to `--link-col`.

### Card Redesign
- Border: 2px → 1px solid `--card-border`.
- Border-radius: 8px → 12px.
- Box-shadow: deeper resting shadow `rgba(0,0,0,0.4)`, hover `rgba(0,0,0,0.6)`.
- Hover transform: `translateY(-5px)` → `translateY(-2px)` (less aggressive).
- Hover accent: left border transitions to `--accent-col`.

### Blog Post H1
- Removed: gradient background, negative margins, box-shadow, text-shadow.
- Added: `clamp()` font size, weight 800, `letter-spacing: -0.5px`, bottom border in `--accent-col`.

### Code Blocks — Terminal Style
- `.highlight` now renders with a `::before` chrome bar (`"● ● ●"` dots, `#1c2128` background) — standard premium DevOps tool aesthetic.
- `.highlight > pre` is transparent (no double-background).
- Standalone `pre` keeps left accent border in `--accent-col`.
- Updated Unified Syntax Highlight Theme `!important` overrides to match new palette.
- Added `.highlight > pre { background: transparent !important; ... }` after the unified theme block to override the `!important` pre rule via higher specificity.

### Navigation
- Added `.brand span { font-weight: 800; letter-spacing: -0.5px; }`.
- Added `.nav-links { gap: 2rem; }`.

### Reading Experience
- Added `.blog-post p { font-size: 1.0625rem; line-height: 1.85; max-width: 72ch; }`.
- Added `.hero-intro h1` with `clamp()` size, weight 800, tight letter-spacing.

---

## Rules Going Forward

1. **Accent color is orange (`#f97316` / `#fb923c` hover).** Do not introduce a second accent color without a design review.
2. **The three-depth palette is the surface system.** New components should use `--page-col`, `--card-bg`, or `--card-image-placeholder` — no new hardcoded dark hex values.
3. **Hardcoded color values must be grepped** whenever a palette variable is changed. This redesign found `rgba(18,18,18,0.88)` in archives, `rgba(0,138,255,0.25)` in archive headings, and hardcoded `#161616` in search — all updated.
4. **`!important` cascade:** The Unified Syntax Highlight Theme block owns token colors only. Structural code-block layout rules (background, border, padding) belong in the main sections plus a post-theme override using specificity.
5. **Inter is the sole typeface.** Do not reintroduce Lora, Open Sans, or any serif for body/headings without a full typography review.
