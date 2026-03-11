### Archives Spec Cleanup — Remove Content-Coupled Tests

**Date:** 2026-03-11
**Author:** Hockney (Tester)

**Decision:** Removed three tests from `archives.spec.ts` that targeted specific blog posts by URL slug:

1. "hackathon post appears under the ai filter" — matched `a[href*="three-day-hackathon-shipping-ai-agent-mvps"]`
2. "squad post data-tags contains ai after normalization" — matched `a[href*="building-an-ai-agent-squad"]`
3. "AI tag link on hackathon post navigates to /archives#ai" — navigated to the hackathon post page

**Rationale:** These tests break when a post is renamed, moved, or deleted — failures caused by content changes, not feature regressions. The behaviors they guarded (tag normalization, hash deep-linking, filter activation) are already covered generically by the remaining filter and deep-link tests, which validate the mechanism without depending on specific post slugs.

**Rule going forward:** Archive tests should assert feature behavior (filtering, deep-linking, link validity) without referencing specific post URLs or titles. If a post-specific regression guard is needed, it belongs in a separate content-focused spec, not in the feature tests.
