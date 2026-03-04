# Decision: Archives Spec — Selector Strategy for JS-Filtered Pages

**Date:** 2026-03-04  
**Author:** Hockney (Tester)

## Context

`archives.spec.ts` was completely rewritten to match the current JS-filter UI
(`div.archive-filters`, `button.tag-filter[data-filter]`, `#visible-count`).
The old tests targeted h2 category sections and a tag-cloud div that no longer exist.

## Decisions made in the new spec

### 1. Use `:visible` pseudo-class inside `.locator()` for filtered-item checks

After clicking a filter button, hidden items remain in the DOM (the JS toggles
`display: none`). The spec uses `.archive-post-item:visible` to count and inspect
only currently visible items. This is the correct pattern for any test that
verifies JS show/hide behaviour rather than DOM removal.

### 2. Each test navigates independently — no shared state

All 10 tests call `page.goto(...)` at the start. This costs an extra navigation
per test but prevents filter state from leaking between cases (e.g. test 4 leaves
the playwright filter active; test 5 should start clean).

### 3. Hash-navigation tests go directly to the hash URL

Tests 6 and 8 use `page.goto('/archives#ai')` rather than navigating to
`/archives` and then clicking. This exercises the JS hash-read path on
`DOMContentLoaded` independently of the click handler path tested in test 4.

### 4. Fabric and normalization tests use attribute selectors, not text matching

Tests 7-9 read `data-tags` attributes directly rather than checking visible text.
This is more reliable than text assertions and targets the actual data the filter
JS reads.

## Recommendation

These patterns (`:visible` for DOM-hidden items, direct hash navigation,
`data-*` attribute assertions) should be standard in any future test that drives
the archives filter UI.
