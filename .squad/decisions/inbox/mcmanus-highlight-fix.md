# Decision: Eliminate empty blocks in Jekyll code highlights

**Date:** 2026-03-04  
**Author:** McManus (Frontend Dev)  
**Requested by:** Marcus Felling  

## Context

Jekyll renders fenced code blocks as `div.highlight > pre.highlight > code`. The `.highlight` div carries a `background-color`. The `pre` element's default `margin: 1em 0` creates visible coloured empty space above and below the code. The previous `padding: 1px` on `.highlight` exacerbated this.

## Decision

In `assets/css/blog.css`:

- Remove `padding: 1px` from `.highlight`
- Add `overflow: hidden` to `.highlight` so `border-radius` correctly clips child content
- Add `.highlight > pre { margin: 0; }` to suppress the `pre` margin inside the coloured wrapper

## Resulting CSS

```css
.highlight {
  background-color: var(--card-image-placeholder);
  border-radius: 3px;
  overflow: hidden;
}

.highlight > pre {
  margin: 0;
}
```

## Rationale

`overflow: hidden` is the idiomatic way to ensure border-radius clips child backgrounds/content. Setting `margin: 0` only on `pre` elements that are direct children of `.highlight` keeps the fix scoped and avoids affecting `pre` margins elsewhere in the layout.
