# Archives Page — Visual Refresh Design Spec

**Author:** Fenster (Design/UX)  
**Date:** 2026-03-04  
**Implementor:** McManus (Frontend Dev)  
**Status:** Ready for implementation

---

## Overview

This spec covers a targeted visual refresh of the archives page to make filtering feel interactive, premium, and cohesive with the dark theme. All changes are additive CSS and minor JS tweaks — no restructuring of the Liquid template beyond one new empty-state element.

---

## 1. Sticky Filter Bar

**Decision: Yes, make `.archive-filters` sticky.**

The filter bar is the primary navigation control for the page. As users scroll through long post lists, losing access to filters kills usability.

### Implementation

```css
.archive-filters {
  position: sticky;
  top: 0;             /* Adjust to nav bar height if nav is also sticky — inspect current nav height */
  z-index: 50;
  background: rgba(18, 18, 18, 0.82);   /* --page-col at 82% opacity */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--card-border);
  padding: 0.75rem 0 0.75rem 0;
  margin-bottom: 0;   /* Remove existing margin-bottom — see Archive Count section */
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
```

**Notes for McManus:**
- The site nav bar appears to be fixed/sticky — check its height and set `top` to match (e.g. `top: 56px` if nav is 56px tall), otherwise the filter bar will overlap the nav on scroll.
- The `backdrop-filter` creates a frosted-glass effect that avoids the harsh opaque-bar look. It gracefully degrades in Firefox (solid background still works).
- The `border-bottom` provides a clean visual separator when content scrolls underneath.

---

## 2. Per-Tag Accent Colors

Each tag slug is assigned a distinct brand-appropriate accent. These are used in three places (detailed in each section below): active filter buttons, `.archive-tag` pills, and `.archive-post-item` hover borders.

### Color Palette

| Slug | Accent Hex | Rationale |
|------|-----------|-----------|
| `azure-devops` | `#0078D4` | Microsoft Azure official blue |
| `cicd` | `#E07B39` | Pipeline/flow orange — energetic, process-oriented |
| `playwright` | `#2EAD33` | Playwright brand green (matches their logo) |
| `git` | `#F05032` | Git official brand orange-red |
| `github-actions` | `#8957E5` | GitHub Actions workflow purple |
| `octopus-deploy` | `#00B3CE` | Octopus Deploy brand teal |
| `infra-as-code` | `#7F5AF0` | HashiCorp/Terraform violet — infrastructure category |
| `windows` | `#68B5FB` | Cornflower blue — Windows 11 widget palette tone |
| `vs-code-extensions` | `#4EC9B0` | VS Code editor teal (the "types" highlight color — recognizable to devs) |
| `ai` | `#C084FC` | AI/neural purple-pink — fashionable for AI branding in 2025–26 |
| `other` | `#6B7280` | Neutral slate gray — deliberate non-category |

### 2a. Active Filter Button — Accent Background

Replace the single `var(--link-col)` active state with per-tag data attributes:

```css
/* Default active (All button) stays: */
.tag-filter.active {
  border-color: transparent;
  color: #fff;
}

/* Per-tag active colors — add these after the base rule */
.tag-filter.active[data-filter="azure-devops"]    { background: #0078D4; }
.tag-filter.active[data-filter="cicd"]            { background: #E07B39; }
.tag-filter.active[data-filter="playwright"]      { background: #2EAD33; }
.tag-filter.active[data-filter="git"]             { background: #F05032; }
.tag-filter.active[data-filter="github-actions"]  { background: #8957E5; }
.tag-filter.active[data-filter="octopus-deploy"]  { background: #00B3CE; }
.tag-filter.active[data-filter="infra-as-code"]   { background: #7F5AF0; }
.tag-filter.active[data-filter="windows"]         { background: #68B5FB; color: #111; } /* light bg needs dark text */
.tag-filter.active[data-filter="vs-code-extensions"] { background: #4EC9B0; color: #111; } /* same — light bg */
.tag-filter.active[data-filter="ai"]              { background: #C084FC; color: #111; }
.tag-filter.active[data-filter="other"]           { background: #6B7280; }
.tag-filter.active[data-filter="all"]             { background: var(--link-col); }
```

**Note:** `windows`, `vs-code-extensions`, and `ai` accents are light enough that white text would fail contrast — override `color: #111` on those three.

### 2b. Archive Tag Pills — Tinted Accent

Each `.archive-tag` span has a `data-tag` attribute currently absent from the template. McManus will need to add it:

**Template change needed** in `archives.md` (in the tag loop):
```liquid
<span class="archive-tag" data-tag="{{ tag | slugify }}">{{ tag }}</span>
```

Then in CSS, add scoped tint rules for each pill:

```css
/* Base pill stays as-is for unknown tags */
.archive-tag { /* existing styles */ }

/* Per-tag pill tints */
.archive-tag[data-tag="azure-devops"]    { background: rgba(0, 120, 212, 0.15);  border: 1px solid rgba(0, 120, 212, 0.40);  color: #5BABF5; }
.archive-tag[data-tag="cicd"]            { background: rgba(224, 123, 57, 0.15); border: 1px solid rgba(224, 123, 57, 0.40); color: #F0A06A; }
.archive-tag[data-tag="playwright"]      { background: rgba(46, 173, 51, 0.15);  border: 1px solid rgba(46, 173, 51, 0.40);  color: #5DC962; }
.archive-tag[data-tag="git"]             { background: rgba(240, 80, 50, 0.15);  border: 1px solid rgba(240, 80, 50, 0.40);  color: #F57A60; }
.archive-tag[data-tag="github-actions"]  { background: rgba(137, 87, 229, 0.15); border: 1px solid rgba(137, 87, 229, 0.40); color: #B08FF5; }
.archive-tag[data-tag="octopus-deploy"]  { background: rgba(0, 179, 206, 0.15);  border: 1px solid rgba(0, 179, 206, 0.40);  color: #4DD0E1; }
.archive-tag[data-tag="infra-as-code"]   { background: rgba(127, 90, 240, 0.15); border: 1px solid rgba(127, 90, 240, 0.40); color: #A78BFA; }
.archive-tag[data-tag="windows"]         { background: rgba(104, 181, 251, 0.15); border: 1px solid rgba(104, 181, 251, 0.40); color: #93C5FD; }
.archive-tag[data-tag="vs-code-extensions"] { background: rgba(78, 201, 176, 0.15); border: 1px solid rgba(78, 201, 176, 0.40); color: #6EDEC8; }
.archive-tag[data-tag="ai"]              { background: rgba(192, 132, 252, 0.15); border: 1px solid rgba(192, 132, 252, 0.40); color: #D8B4FE; }
.archive-tag[data-tag="other"]           { background: rgba(107, 114, 128, 0.15); border: 1px solid rgba(107, 114, 128, 0.40); color: #9CA3AF; }
```

**Pattern:** tint = accent at 15% opacity, border = accent at 40% opacity, text = accent lightened ~25% for readability on dark card backgrounds.

---

## 3. Post Item Hover State

The current `.archive-post-item` has no hover treatment. Add a left-accent border + subtle background fill, with the accent color driven by the currently active filter.

### Approach

Use a CSS custom property `--item-accent` set dynamically by JS on the `<body>` or a wrapper element when a filter is selected. This avoids 12 sets of scoped CSS rules.

**JS change (in the filter script):**  
When a filter button is clicked, set a data attribute on the list:

```js
// After toggling .active on the button, also set:
document.querySelector('.archive-list-wrapper')
  ?.setAttribute('data-active-filter', filterValue);
// (wrap the whole year-groups area in a div.archive-list-wrapper in the template)
```

**CSS:**

```css
.archive-post-item {
  /* Existing styles + add: */
  border-left: 3px solid transparent;
  padding-left: 0.5rem;
  transition: background 0.18s ease, border-left-color 0.18s ease, padding-left 0.18s ease;
}

.archive-post-item:hover {
  background: rgba(255, 255, 255, 0.035);
  border-radius: 4px;
}

/* Per-filter hover accent via wrapper data-attribute */
[data-active-filter="azure-devops"]    .archive-post-item:hover { border-left-color: #0078D4; }
[data-active-filter="cicd"]            .archive-post-item:hover { border-left-color: #E07B39; }
[data-active-filter="playwright"]      .archive-post-item:hover { border-left-color: #2EAD33; }
[data-active-filter="git"]             .archive-post-item:hover { border-left-color: #F05032; }
[data-active-filter="github-actions"]  .archive-post-item:hover { border-left-color: #8957E5; }
[data-active-filter="octopus-deploy"]  .archive-post-item:hover { border-left-color: #00B3CE; }
[data-active-filter="infra-as-code"]   .archive-post-item:hover { border-left-color: #7F5AF0; }
[data-active-filter="windows"]         .archive-post-item:hover { border-left-color: #68B5FB; }
[data-active-filter="vs-code-extensions"] .archive-post-item:hover { border-left-color: #4EC9B0; }
[data-active-filter="ai"]              .archive-post-item:hover { border-left-color: #C084FC; }
[data-active-filter="other"]           .archive-post-item:hover { border-left-color: #6B7280; }
[data-active-filter="all"]             .archive-post-item:hover { border-left-color: var(--link-col); }
```

**Notes:**
- The `transition` on `border-left-color` + `background` makes rows feel interactive without being distracting.
- `border-radius: 4px` on hover only — avoids ugly visible radius on non-hover rows.
- Keep `border-bottom: 1px solid rgba(255,255,255,0.04)` on the base for the row separator; it stays visible through the hover state.

---

## 4. Year Heading Treatment

The current heading is `font-size: 1rem` — virtually the same size as post titles. It reads as a label, not a section divider. Make it dramatically larger and visually anchor each year block.

```css
.archive-year-heading {
  font-size: 2.6rem;
  font-weight: 800;
  color: var(--link-col);           /* Primary blue — strong year marker */
  letter-spacing: -0.02em;          /* Tight tracking for large display type */
  line-height: 1;
  margin: 0 0 0.5rem;
  padding: 0;
  border-bottom: none;              /* Remove old hairline — replaced below */
  opacity: 0.9;
}

.archive-year-group {
  margin-bottom: 3rem;
  border-top: 1px solid var(--card-border);
  padding-top: 1.5rem;              /* Space between border and year number */
}

/* First year group: suppress the top border (no content above it) */
.archive-year-group:first-of-type {
  border-top: none;
  padding-top: 0;
}
```

**Rationale:** The border-top on the group container (not underneath the heading) creates a wide visual breathing gap between year sections. The year number at `2.6rem` / `800` weight / `--link-col` is unmistakably a section marker, not inline content. The `-0.02em` letter-spacing is standard practice for large display headings to prevent optical looseness.

---

## 5. Filter Animation

Currently items appear/disappear instantly (`display: none` toggled by JS). A fade + height collapse makes filtering feel smooth and intentional.

### Recommended approach: opacity + max-height

This avoids layout reflow on initial page load since items start visible and are only hidden on filter interaction.

**CSS:**

```css
.archive-post-item {
  /* Add to existing: */
  overflow: hidden;
  transition: background 0.18s ease,
              border-left-color 0.18s ease,
              padding-left 0.18s ease,
              opacity 0.22s ease,
              max-height 0.25s ease;
  max-height: 200px;   /* Generous ceiling — no post item realistically exceeds this */
  opacity: 1;
}

.archive-post-item.hidden {
  max-height: 0;
  opacity: 0;
  pointer-events: none;
  margin: 0;
  padding-top: 0;
  padding-bottom: 0;
  border-bottom-color: transparent;
}
```

**JS change:**  
Replace `item.style.display = 'none'` / `'flex'` with toggling `.hidden` class:

```js
item.classList.toggle('hidden', !shouldShow);
```

**Year group visibility:** Hide the entire `.archive-year-group` if all its items are `.hidden`. Add a `.hidden` class to the group too (with `display: none` — no transition needed at the section level):

```css
.archive-year-group.hidden {
  display: none;
}
```

**Notes:**
- `max-height: 200px` → `0` provides the "height collapse" without needing to know the real height.
- The `0.25s` on max-height is intentionally slightly longer than the `0.22s` on opacity — this staggers the visual collapse so text fades out before the row closes, which reads more cleanly.

---

## 6. Archive Count — Reposition and Elevate

The `.archive-count` currently sits below the filter bar as a subdued `--mid-col` afterthought. Two changes: move it inline with the sticky bar and make the post count number prominent.

### Template change needed in `archives.md`:

Move the `<p class="archive-count">` inside `.archive-filters`, as the last child:

```html
<div class="archive-filters">
  <!-- ...all the .tag-filter buttons... -->
  <span class="archive-count">
    <span id="visible-count">{{ site.posts | size }}</span> of {{ site.posts | size }} posts
  </span>
</div>
```

### CSS:

```css
.archive-count {
  margin-left: auto;          /* Pushes count to the right end of the flex row */
  align-self: center;
  color: var(--mid-col);
  font-size: 0.8rem;
  white-space: nowrap;
  padding: 0.28rem 0;         /* Align vertically with pill buttons */
}

/* Highlight the number */
.archive-count #visible-count {
  color: var(--text-col);
  font-weight: 600;
  font-size: 0.9rem;
}
```

**Result:** Count lives on the right side of the sticky bar, updates as filters are applied, and the highlighted number draws the eye without being noisy.

**Responsive note:** On narrow mobile viewports, `flex-wrap: wrap` will push the count to its own row beneath the pills. This is acceptable. No special breakpoint needed.

---

## 7. Empty State

When a tag filter has zero matching posts, the post area is blank with no feedback. Add a friendly inline message.

### Template change needed in `archives.md`:

Add this element immediately after the `{% endfor %}` that closes the year group loop (i.e., the last element before `</div>` or end of front matter):

```html
<div class="archive-empty" id="archive-empty" aria-live="polite">
  <span class="archive-empty-icon">◈</span>
  <p class="archive-empty-message">No posts tagged with <strong id="archive-empty-tag"></strong> yet.</p>
  <p class="archive-empty-sub">Try <button class="archive-empty-reset">All posts</button> to see everything.</p>
</div>
```

### CSS:

```css
.archive-empty {
  display: none;             /* Hidden by default; JS toggles to flex */
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 1rem;
  color: var(--mid-col);
}

.archive-empty.visible {
  display: flex;
}

.archive-empty-icon {
  font-size: 2.8rem;
  line-height: 1;
  margin-bottom: 1rem;
  opacity: 0.35;
}

.archive-empty-message {
  font-size: 1rem;
  color: var(--text-col);
  margin: 0 0 0.5rem;
}

.archive-empty-message strong {
  color: var(--link-col);
}

.archive-empty-sub {
  font-size: 0.85rem;
  color: var(--mid-col);
  margin: 0;
}

.archive-empty-reset {
  background: none;
  border: 1px solid var(--card-border);
  border-radius: 20px;
  color: var(--link-col);
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0.2rem 0.75rem;
  transition: border-color 0.15s, background 0.15s;
}

.archive-empty-reset:hover {
  background: rgba(0, 138, 255, 0.1);
  border-color: var(--link-col);
}
```

### JS change:

In the filter click handler, after applying `.hidden` classes:

```js
const anyVisible = [...document.querySelectorAll('.archive-post-item')]
  .some(item => !item.classList.contains('hidden'));

const emptyEl = document.getElementById('archive-empty');
const emptyTag = document.getElementById('archive-empty-tag');

if (!anyVisible && filterValue !== 'all') {
  // Use the button's text label for the message
  emptyTag.textContent = event.target.textContent.trim();
  emptyEl.classList.add('visible');
} else {
  emptyEl.classList.remove('visible');
}

// Wire up the reset button inside the empty state
document.querySelector('.archive-empty-reset')?.addEventListener('click', () => {
  document.querySelector('.tag-filter[data-filter="all"]')?.click();
});
```

---

## Implementation Checklist for McManus

- [ ] **Section 1** — Add sticky + backdrop-filter to `.archive-filters`; verify `top` offset against nav height
- [ ] **Section 2a** — Add per-tag active button color overrides (12 rules)
- [ ] **Section 2b** — Add `data-tag="{{ tag | slugify }}"` to `<span class="archive-tag">` in `archives.md`; add 11 pill tint rules
- [ ] **Section 3** — Add `border-left`, hover background, and per-filter hover color rules; add `data-active-filter` attribute toggling in JS; wrap year-groups in `div.archive-list-wrapper`
- [ ] **Section 4** — Update `.archive-year-heading` and `.archive-year-group` styles
- [ ] **Section 5** — Replace display toggling with `.hidden` class + CSS max-height/opacity transition; add year-group `.hidden` suppression
- [ ] **Section 6** — Move `.archive-count` inside `.archive-filters` as last child; update CSS to `margin-left: auto`
- [ ] **Section 7** — Add `.archive-empty` HTML after the year loop; add CSS; add empty-state JS logic to filter handler

---

## Design Token Cheat Sheet

Quick reference for the new values introduced in this spec:

```
Filter bar bg:      rgba(18, 18, 18, 0.82) + backdrop-filter: blur(10px)
Filter bar border:  var(--card-border) = #333333
Filter bar z-index: 50

Year heading size:  2.6rem / 800 / color: var(--link-col)
Year group gap:     border-top: 1px solid #333333 / padding-top: 1.5rem / margin-bottom: 3rem

Post item hover:    background: rgba(255,255,255,0.035) / border-left: 3px solid {accent}
Post transition:    0.18s ease (bg + border) / 0.22s ease (opacity) / 0.25s ease (max-height)

Tag accent—azure-devops:       #0078D4  (text: #5BABF5)
Tag accent—cicd:               #E07B39  (text: #F0A06A)
Tag accent—playwright:         #2EAD33  (text: #5DC962)
Tag accent—git:                #F05032  (text: #F57A60)
Tag accent—github-actions:     #8957E5  (text: #B08FF5)
Tag accent—octopus-deploy:     #00B3CE  (text: #4DD0E1)
Tag accent—infra-as-code:      #7F5AF0  (text: #A78BFA)
Tag accent—windows:            #68B5FB  (text: #93C5FD, button text: #111)
Tag accent—vs-code-extensions: #4EC9B0  (text: #6EDEC8, button text: #111)
Tag accent—ai:                 #C084FC  (text: #D8B4FE, button text: #111)
Tag accent—other:              #6B7280  (text: #9CA3AF)
```
