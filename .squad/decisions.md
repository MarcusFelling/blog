# Squad Decisions

## Active Decisions

---

### Tag Slug Normalization Strategy

**Date:** 2026-03-04  
**Authors:** Keaton (Lead), McManus (Frontend Dev)

Tag slug normalization is handled via an explicit `if/elsif` chain in both `archives.md` and `_layouts/post.html`. These two implementations **must stay in sync**. The default fallback is `tag | slugify`.

**Current mappings:**

| Raw tag value   | Slug used       |
|-----------------|-----------------|
| Azure Pipelines | `azure-devops`  |
| Azure DevOps    | `azure-devops`  |
| GitHub Copilot  | `ai`            |
| DevOps          | `cicd`          |
| CICD            | `cicd`          |
| (all others)    | `tag \| slugify` |

**Rules for future tags:** When adding a new tag that is multi-word or an alias, either add a `data-filter` button to `archives.md` **and** an `if/elsif` mapping to `_layouts/post.html`, or map to the closest existing filter slug in both files.

Also: removed orphaned `Fabric` tag from the hackathon post front matter (no filter button, no sensible mapping).

---

### Archives Page — Cleanup and AI Section Rules

**Date:** 2026-03-04  
**Author:** Verbal

1. AI tag added to tag cloud and a new `## AI` section added after `## GitHub Actions`.
2. Duplicate entry removed from `## Azure DevOps / TFS`.
3. Misplaced entry ("Visual Studio Marketplace Metrics") removed from `## VS Code Extensions`.

**Rules:**
- Tag cloud anchors and `## Section` headings must stay in sync (same lowercase-hyphenated pattern).
- A post should only appear in a section it genuinely relates to — omit rather than guess.

---

### CSS: Eliminate Empty Blocks in Jekyll Code Highlights

**Date:** 2026-03-04  
**Author:** McManus (Frontend Dev)

In `assets/css/blog.css`:
- Removed `padding: 1px` from `.highlight`
- Added `overflow: hidden` to `.highlight` so `border-radius` clips children correctly
- Added `.highlight > pre { margin: 0; }` to suppress `pre` margins inside the coloured wrapper

Pattern applies any time a background-coloured wrapper contains a block element with vertical margin.

---

### No Auto-Commit Directive

**Date:** 2026-03-05
**By:** Marcus Felling (via Copilot)

Do not auto-commit changes. Stage files but skip the `git commit` step. Marcus needs to review changes before they are committed.

---

### Navbar Social Chips Placement, CSS Scope, and Regression Rules

**Date:** 2026-03-06
**Authors:** Fenster (Design/UX), McManus (Frontend Dev), Hockney (Tester), Keaton (Lead)

Social links are part of the site chrome and now belong in the navigation system, not the footer.

**Layout and UX rules**

- Desktop order stays: brand → primary nav links → social chip cluster.
- The social cluster is a right-aligned utility group and should remain visually lighter than the primary nav.
- On mobile, hide social chips from the top bar and render them below the main drawer links as secondary utility actions.
- The footer stays minimal: copyright only.

**Implementation rules**

- Capture shared social-link markup once in `_includes/nav.html` and reuse it for both desktop navbar and mobile drawer rendering.
- Keep navbar-specific styling in `assets/css/blog.css` under `.navbar-modern .nav-social` and `.mobile-drawer .nav-social` so it does not disturb generic chip styling.
- Preserve existing icon-only `aria-label`s and strong focus treatment.

**CSS structure rules**

- Responsive navbar and drawer rules must remain in top-level breakpoint `@media` blocks.
- Reduced-motion media queries may change animation or transition behavior only; they must not own navbar layout or breakpoint behavior.

**Testing rules**

- Landing-page regression coverage should assert placement, not a hard-coded social-link list.
- Assert the navbar social-chip container exists, validate any rendered chip hrefs sanely match their labels, and assert the footer exposes no `.social-chip` links.
- Do not add mobile drawer assertions until the drawer behavior is stable in CI.

---

### Remove remote_theme Dependency

**Date:** 2026-03-11
**Author:** McManus (Frontend Dev), verified by Hockney (Tester)

Removed `remote_theme: marcusfelling/blog-theme` from `_config.yml`, removed unused `gem "minima"` from `Gemfile`, and created `_layouts/page.html` locally. All layouts/includes/assets were already local — the remote theme was redundant.

**Rules:**
- The blog has no remote theme dependency. All layouts, includes, and assets are local.
- `_layouts/page.html` extends `base` and is the default layout for non-post pages.
- The `github-pages` gem remains for GitHub Pages deployment.

---

### Archives Spec — Remove Content-Coupled Tests

**Date:** 2026-03-11
**Author:** Hockney (Tester)

Removed three tests from `archives.spec.ts` that targeted specific blog posts by URL slug. These tests broke when content changed — failures caused by content edits, not feature regressions. The behaviors they guarded (tag normalization, hash deep-linking, filter activation) are already covered generically by the remaining filter and deep-link tests.

**Rule going forward:** Archive tests should assert feature behavior (filtering, deep-linking, link validity) without referencing specific post URLs or titles. If a post-specific regression guard is needed, it belongs in a separate content-focused spec.

---

### Homepage Restrained Polish Rules

**Date:** 2026-03-13
**Author:** Marcus Felling (via Copilot)

During homepage polish passes, keep the existing homepage copy and information architecture fixed. Prefer CSS-only refinement work focused on the home hero and cards, and reduce AI-template tells by favoring solid headline typography, quieter surfaces, and restrained hover/focus states over louder gradients, glass effects, or structural rewrites.

**Rules:**

- Keep homepage copy and information architecture unchanged during restrained polish passes.
- Prefer CSS-only refinements before touching homepage markup.
- Focus visual polish on the home hero and card presentation.
- Favor quieter surfaces and restrained interactions over louder gradient-heavy or glass-heavy treatments.

---

### Temporary Workspace Gitlink Hygiene

**Date:** 2026-03-13
**Author:** Hockney (Tester)

The repository must not track temporary tooling workspaces as gitlinks. `.tmp/impeccable` was accidentally tracked as a gitlink without a matching `.gitmodules` entry, which reproduced `fatal: No url found for submodule path '.tmp/impeccable' in .gitmodules`.

**Rules:**

- Remove tracked temp-workspace gitlinks from the repository index instead of trying to repair them as submodules.
- Keep `.tmp/` ignored so temporary local workspaces cannot be recommitted accidentally.
- Treat `.tmp/` as local-only workspace state unless the team explicitly chooses to vendor content elsewhere.
- Validate cleanup with `git submodule status`, `git ls-files -s .tmp/impeccable`, and `git check-ignore -v .tmp .tmp/impeccable`.

---

### Navbar Archives Utility Pattern and Intentional Mobile Drawer

**Date:** 2026-03-06
**Authors:** Fenster (Design/UX), McManus (Frontend Dev)

When the site only exposes a single browse link in the main navigation, `Archives` should be treated as a utility action, not centered like a full primary-nav set.

**Desktop rules**

- Keep the navbar hierarchy intentional: brand on the left, then a trailing utility cluster that contains the `Archives` action and social chips.
- Style `Archives` like a quiet pill or button so it reads as a deliberate utility CTA rather than a stranded text tab.
- Prefer a tinted pill treatment with subtle inset accents and a slightly warmer border/background; avoid decorative status dots or other ornamental markers.
- Preserve the lighter visual weight of the social-chip cluster relative to primary navigation.

**Mobile rules**

- Keep the top bar limited to brand + menu trigger.
- In the drawer, surface `Archives` first as the primary browse action, then other page links, then a clearly separated social/elsewhere section.
- The drawer should feel modal: use a backdrop, lock page scroll while open, and close it on link activation.

**Implementation rules**

- Keep navbar and drawer layout rules together in `assets/css/blog.css`; do not split layout ownership between CSS files and injected head styles.
- Reuse the shared captured social-link markup inside the drawer instead of maintaining separate mobile-only social markup.
- Target the polished `Archives` utility treatment with an explicit `nav-link-archives` class in `_includes/nav.html` instead of positional selectors so future nav refinements stay tightly scoped.
- Keep the emphasis CSS-only and scoped to `.nav-link-archives` so future navbar refinements stay isolated from surrounding links.

---

### AI-Voice Detection Patterns for Blog Reviews

**Date:** 2026-03-24
**Author:** Verbal (Content Dev)

During review of the Work IQ MCP + ADO automation post, established concrete AI-voice detection patterns for Marcus's blog.

**Key tells to catch:**
- Qualifier openers ("The architecture is straightforward")
- Corporate compound phrases ("structured, governed")
- LinkedIn-style closers ("It's the difference between X and Y")
- Thought-leadership framing ("complementary, not competing")

**Marcus's natural voice:** First-person, confessional, specific to real workflow pain, with occasional dry self-deprecation. These patterns should inform future blog reviews.

---

### Blog Post Factual Accuracy — Work IQ and MCP Claims

**Date:** 2026-03-24
**Author:** Keaton (Lead)

Factual review of the Work IQ MCP + ADO automation blog post.

**Errors corrected:**
1. Work IQ repo URL fixed: `github.com/microsoft/work-iq-mcp` → `github.com/microsoft/work-iq`
2. Removed fabricated tool names (`graph_mail_getMessage`, `graph_calendar_listEvents`) — Work IQ exposes a single natural-language query tool, not individual Graph API operations
3. Removed incorrect "family of MCPs" description (Mail MCP, Calendar MCP, etc.) — Work IQ is one unified MCP server

**Flagged for Marcus:**
- Cowork comparison claims unverifiable (no public docs found)
- "User-delegated permissions" phrasing more precise than source material
- Sensitivity labels enforcement claim not documented in Work IQ repo

---

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
