# Project Context

- **Owner:** Marcus Felling
- **Project:** blog — technical blog built with Jekyll and hosted on GitHub Pages
- **Stack:** Jekyll, Liquid templates, HTML/CSS/JS, Playwright (TypeScript), GitHub Pages
- **Created:** 2026-03-04

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

### 2026-03-04 — Archives Design Spec

- **Tag accent strategy:** Assigned each filter slug a distinct brand-appropriate accent color. The three Microsoft-adjacent tags (azure-devops, windows, vs-code-extensions) required deliberate hue separation: Azure blue (#0078D4), cornflower blue (#68B5FB), and VS Code teal (#4EC9B0) to avoid clustering. Light accents (windows, vs-code-extensions, ai) need `color: #111` on the active button — always check contrast when accent is light.
- **Sticky bar pattern:** `position: sticky` + `backdrop-filter: blur(10px)` + semi-transparent bg is the standard dark-theme sticky treatment. Always verify `top` offset against the nav height — easy to miss when nav is also sticky.
- **Filter animation:** `max-height` + `opacity` transition is the correct approach for filtering list items — avoids layout flash and degrades gracefully. The stagger (opacity slightly shorter than max-height) makes collapse read more cleanly than simultaneous.
- **Empty state:** Always include `aria-live="polite"` on the empty state container so screen readers announce the change. The reset button inside the empty state should delegate to the "All" filter button's click handler, not duplicate filter logic.
- **Archive count placement:** Moving the count inside the sticky flex bar (`margin-left: auto`) is strictly better than below it — it updates in context without the user needing to scroll back up to find it.
- **`data-tag` attribute gap:** The current template does not emit `data-tag` on `.archive-tag` spans. This is a prerequisite for per-tag pill tinting. McManus must add this before the pill CSS rules will have any effect.
