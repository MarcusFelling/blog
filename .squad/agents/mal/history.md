# Mal — History

## Project Context

- **Project:** Marcus Felling's Blog (marcusfelling.com)
- **Stack:** Jekyll, Ruby, Liquid templates, HTML, CSS/SCSS, JavaScript, YAML, Playwright
- **User:** Marcus Felling
- **Goals:** Blog redesign, full code review, ongoing maintenance and new posts

## Learnings

<!-- Append learnings below this line -->

### 2026-02-24T18:00:00Z — Kaylee Redesign Complete

Kaylee completed full blog redesign ("Ink" theme). Bootstrap/jQuery removed (~290KB), CSS consolidated to ~700 lines with custom properties, light/dark mode added, Inter font, editorial hero home page. Jekyll build passes. Remote theme compat layer in place (~30 lines CSS grid). Decision filed as `ink-redesign-v1`.

### 2026-02-24T19:00:00Z — Code Review: Ink Theme Redesign

**Verdict: APPROVED WITH NOTES**

Full review of 7 artifacts (blog.css, head.html, base.html, nav.html, home.html, footer.html, _config.yml). Jekyll build passes. Rendered post pages verified against Bootstrap compat layer — grid classes (`container-md`, `row`, `col-xl-8`, `offset-xl-2`, etc.) are covered.

**Strengths:**
- CSS architecture: 22 numbered sections, full design token system in `:root`/`html.light`, all components use custom properties consistently
- Clean dependency removal: zero references to Bootstrap/jQuery/Popper CDNs
- Accessibility above average: skip-link, ARIA labels, focus-visible, reduced-motion, prefers-contrast
- FOUC prevention: synchronous theme restore script in `<head>` before paint
- Responsive design: 4 breakpoints (1200/768/576/400), fluid clamp() values, mobile drawer with keyboard support

**Notes for future improvement (non-blocking):**
1. Dead color config in `_config.yml` (page-col, text-col, etc.) — not referenced by new CSS but may be used by remote theme layouts. Safe to leave, clean up when remote theme dependency is revisited.
2. Missing Bootstrap display utility compat (`d-none`, `d-sm-inline-block`) — pagination "Previous/Next Post" text from remote theme won't hide/show properly on mobile. ~4 lines to fix.
3. Nested `<main>` elements — base layout wraps content in `<main>`, remote theme post layout outputs another `<main class="container-md">`. Invalid HTML5. Remote theme issue, not Kaylee's fault.
4. CSS is actually 1283 lines (not ~700) — includes syntax highlighting tokens and compat layer. Core design system is roughly 700 lines as claimed.
5. Font Awesome `all.min.css` (~60KB) — only a handful of icons used. Could tree-shake later for perf.
