---
name: "project-conventions"
description: "Core conventions and patterns for this codebase"
---

## Context

> **This is a starter template.** Replace the placeholder patterns below with your actual project conventions. Skills train agents on codebase-specific practices — accurate documentation here improves agent output quality.

## Patterns

### Liquid snippet reuse across responsive variants

If the same link or chip markup needs to appear in both desktop and mobile navigation, capture the shared anchors once with Liquid (`{% capture %}`) inside the include and render that captured snippet in both places. This keeps Jekyll templates aligned while still letting CSS apply different layout rules for navbar vs drawer contexts.

### Error Handling

<!-- Example: How does your project handle errors? -->
<!-- - Use try/catch with specific error types? -->
<!-- - Log to a specific service? -->
<!-- - Return error objects vs throwing? -->

### Testing

<!-- Example: What test framework? Where do tests live? How to run them? -->
<!-- - Test framework: Jest/Vitest/node:test/etc. -->
<!-- - Test location: test/, __tests__/, *.test.ts, etc. -->
<!-- - Run command: npm test, etc. -->

### Code Style

<!-- Example: Linting, formatting, naming conventions -->
<!-- - Linter: ESLint config? -->
<!-- - Formatter: Prettier? -->
<!-- - Naming: camelCase, snake_case, etc.? -->

### File Structure

<!-- Example: How is the project organized? -->
<!-- - src/ — Source code -->
<!-- - test/ — Tests -->
<!-- - docs/ — Documentation -->

## Examples

```
// Add code examples that demonstrate your conventions
```

## Anti-Patterns

<!-- List things to avoid in this codebase -->
- **[Anti-pattern]** — Explanation of what not to do and why.
