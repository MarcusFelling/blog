---
description: "Review the local blog diff with Squad for concrete regressions and missing tests, without GitHub Issues."
agent: "Squad"
argument-hint: "Optional files or scope to review"
---

Review the user's specified files, or the current staged and unstaged diff if no scope is given.
Follow the [repo instructions](../copilot-instructions.md) and [routing](../../.squad/routing.md).

Keaton owns the review. Add only the specialist needed for a concrete risk; do not launch the entire team.
Read the changed code and nearby callers/tests. Prioritize broken reader journeys, Liquid/Jekyll output,
accessibility, security, and missing regression coverage. Use focused tests when useful.

This is a review, not authorization to edit, commit, publish, or open issues. Preserve the working tree.
Return actionable findings ordered by severity with file references, followed by tests run and gaps.
If there are no findings, say so without claiming unperformed checks passed.