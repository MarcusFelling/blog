# Kaylee — History

## Project Context

- **Project:** Marcus Felling's Blog (marcusfelling.com)
- **Stack:** Jekyll, Ruby, Liquid templates, HTML, CSS/SCSS, JavaScript, YAML, Playwright
- **User:** Marcus Felling
- **Goals:** Blog redesign — new layout, improved styling, responsive design

## Learnings

<!-- Append learnings below this line -->

### Redesign v1 — "Ink" Theme (2025)

**Architecture decisions:**
- Removed Bootstrap 4.4 CSS/JS (~200KB), jQuery 3.5.1 (~70KB), Popper.js (~20KB) — net reduction ~290KB
- Created a minimal Bootstrap compat layer (~30 lines CSS) for `.container-md`, `.row`, `.col-xl-*`, `.col-lg-*`, `.offset-xl-*`, `.offset-lg-*` — required because the remote theme (`marcusfelling/blog-theme`) generates post pages with these grid classes
- Consolidated two fonts (Lora + Open Sans) → single font (Inter, weights 400-800)
- Moved ~300 lines of inline CSS from `_includes/head.html` into `assets/css/blog.css`
- Total CSS went from ~1750 lines scattered across inline + blog.css → ~700 lines in one file with 22 organized sections

**Design system (dark-first, light toggle):**
- CSS custom properties on `:root` (dark default) with `html.light` override
- Theme persistence via `localStorage('theme')` with FOUC-prevention script in `<head>` before paint
- Color palette: `--bg: #0e0e10`, `--surface: #1a1a1f`, `--accent: #6c63ff` (indigo)
- Light mode: `--bg: #fafafa`, `--surface: #ffffff`, `--accent: #5046e5`

**Key files modified:**
| File | Change |
|------|--------|
| `assets/css/blog.css` | Complete rewrite — design system, tokens, compat layer |
| `_includes/head.html` | Stripped inline CSS, kept meta tags only |
| `_layouts/base.html` | Removed Bootstrap/jQuery/Popper, added Inter, theme script |
| `_includes/nav.html` | Added theme toggle, drawer overlay, theme JS |
| `_layouts/home.html` | Redesigned hero, cards, popular reads, search |
| `_includes/footer.html` | Simplified structure |

**Files intentionally NOT modified:**
- `_includes/footer-scripts.html` — code block enhancement JS works with new CSS
- `_config.yml` — color vars no longer used but harmless
- `assets/js/search.js`, `assets/js/scroll-to-top.js` — still compatible

**Gotchas:**
- Remote theme provides `post` layout with Bootstrap grid classes — CANNOT remove Bootstrap without a compat layer
- Posts without trailing-slash permalinks produce `.html` files instead of `dir/index.html`
- `compress.html` layout strips whitespace aggressively — all output appears single-line
- The `faraday-retry` gem warning in build output is cosmetic, not an error
- Liquid warnings for `{{ }}` in markdown code blocks are pre-existing content issues
