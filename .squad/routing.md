# Work Routing

How to decide who handles what.

## Routing Table

| Work Type | Route To | Examples |
|-----------|----------|---------|
| Architecture, decisions, code review | Keaton | Site structure changes, reviewing PRs, scoping new features |
| Blog post writing/editing | Verbal | New posts, editing drafts, front matter, SEO copy |
| Templates, layouts, CSS, JS | McManus | `_layouts/`, `_includes/`, `assets/css/`, `assets/js/` |
| Tests and quality | Hockney | Playwright specs, edge case coverage, CI reliability |
| Visual design and UX | Fenster | Typography, spacing, color, reader experience, accessibility |
| Community and promotion | Kobayashi | Social copy, post announcements, discoverability, open graph |
| Session decisions | Scribe | Durable decisions after substantial work; no transcript dumps |

## On-Demand Workflows

GitHub Issues are not used. No issue intake, labels, auto-assignment, heartbeat, or scheduled team work.

| Request | Owner | Additional help when needed | Completion check |
|---------|-------|-----------------------------|------------------|
| Review a draft or post | Verbal | Hockney for rendering/link regressions; fact-checker for sourced claims | Existing front matter and URLs preserved; unsupported claims flagged |
| Fix a template or interaction | McManus | Hockney for scoped Playwright coverage; Fenster for visual changes | Relevant tests pass; responsive and keyboard behavior checked |
| Review the local diff | Keaton | Relevant domain owner for concrete risks | Findings with file references; no edits or commits unless requested |
| Diagnose a test failure | Hockney | McManus when the failure is in site behavior | Reproduce the failure, repair the owning slice, rerun the failing test |
| Prepare post promotion | Kobayashi | Verbal for voice and evidence | Draft copy only; no publishing without approval |
| Check Squad health | Coordinator | Keaton only if diagnostics expose a problem | Run `npm run squad:check` and `npm run squad:doctor`; report failures |

VS Code shortcuts: `/squad-review` for the current diff and `/squad-post` for a selected post.

## Model Policy

GPT-6 Astra is the preferred model for domain specialists, including high-risk reviews and visual analysis. The agent charters specify default reasoning effort: high for Keaton, McManus, Hockney, and Fenster; medium for Verbal and Kobayashi. Optional Rai and fact-checker work also uses GPT-6 Astra with high effort. Scribe uses `claude-haiku-4.5` with automatic effort for mechanical logging.

- Resolve `GPT-6 Astra` against the current client's model catalog and use its exact supported identifier. The bundled upstream catalog may be older; do not guess an API slug or substitute a different model variant to change thinking effort.
- Adjust effort to the task using the charter rationale: low for mechanical work, medium for bounded edits, high for implementation, diagnosis, visual analysis, and substantive review. Use xhigh only for unusually complex, high-risk work, not every review.
- Pass effort through a supported session/config parameter when available. If the client only accepts a model parameter, include the requested effort in the specialist prompt as guidance, but do not claim the runtime effort setting was applied.
- If Astra is unavailable, report the limitation. Use `claude-sonnet-4.6` for implementation and writing, or `claude-opus-4.6` for high-risk review and visual analysis when available; verify image support for visual tasks. If those are unavailable, use the platform default and disclose the substitution. Scribe follows the upstream fast-model fallback chain.
- These repository preferences take precedence over the bundled role-to-model defaults. Honor explicit task-specific user choices. Do not spawn extra specialists merely to exercise a model or effort tier.

## Rules

1. Quick facts and narrow mechanical tasks stay with the coordinator. Otherwise start with one domain owner.
2. Add a reviewer or tester only when the task's risk warrants it. Do not start speculative downstream work or automatically launch the whole team.
3. Parallel tasks must have independent outcomes and non-overlapping write ownership. Pass explicit paths, acceptance criteria, and the relevant skill, not the entire repo history.
4. Follow the Model Policy and each agent's charter. Optimize reasoning effort, task sizing, and selective context loading before changing models.
5. Scribe records decisions and session context only in ignored local state. Never commit histories, logs, decisions, learned skills, or prompt quotations. Use foreground handoff when background execution is unavailable; do not repeatedly spawn Scribe for trivial answers.
6. Ralph is on-demand only and inactive by default. Do not inspect remote issues or start an unattended loop to find more work.
7. Stay on the current branch and preserve unrelated edits. No automatic commit, push, issue creation, publication, PR completion, or auto-merge.
8. Finish with the result, checks actually run, and unresolved blockers. For reviews, lead with actionable findings; for prose, distinguish evidence from facts needing confirmation.
