# Decision: CSS Variables Over Hardcoded Colors in Extracted Classes

**Date:** 2026-03-05  
**Author:** McManus (Frontend Dev)  
**Related task:** Template cleanup — hero panel inline style extraction

## Decision

When extracting inline styles from `_layouts/home.html` into named CSS classes in `blog.css`, color values were converted from hardcoded hex (`#d4e3ee`, `#8cafc8`, `#ccdcea`) to CSS custom properties (`var(--text-col)`, `var(--mid-col)`, `var(--link-col)`).

## Rationale

The original inline styles used hardcoded hex values. Lifting those exact values into a stylesheet would make future theme changes require touching both `blog.css` and any other file that repeats them. Since the project already uses CSS custom properties throughout the stylesheet, the extracted classes should use the same variables — this keeps a single source of truth for palette values and makes Fenster's CSS rewrite easier (change variables, not individual rules).

## Impact

- `.pulse-heading`, `.top-pages-label`, `.top-page-link` now use `var(--text-col)`, `var(--mid-col)`, `var(--link-col)`.
- If the design intentionally wants these elements to deviate from the global text/mid/link palette, the variables should be overridden at the component scope rather than reverting to hardcoded values.
