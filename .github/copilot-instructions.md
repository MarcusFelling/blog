# Blog Repository Instructions

## Work Intake and Boundaries

- GitHub Issues are not used. Work from the user's request, supplied files, local diff, or failing test. Do not create issues, labels, assignments, or a background work queue.
- Preserve unrelated uncommitted work. Stay on the current branch unless asked to change it; do not stash, commit, push, or publish without explicit authorization.
- Never merge or complete a pull request or enable auto-merge. PR completion is always a human action.

## Squad

- Use Squad when the user selects the Squad agent or requests team work. Ordinary Copilot sessions do not require the coordinator or its canary token.
- Read `.squad/team.md` and `.squad/routing.md`, then only the relevant member's charter and task-specific skills. Do not load the entire history or all skills by default.
- Team definitions are maintained in Markdown. Preserve charters and histories; do not run `squad build` over them.
- Start with one owner. Add a tester or reviewer when risk warrants it; parallelize only independent work with non-overlapping file ownership.
- Ralph is inactive by default. Do not scan GitHub Issues, start heartbeat/triage/loop, or monitor email and Teams unless explicitly requested.
- Private Squad state stays local: histories, decisions, identity, logs, sessions, memory, scratch files, and learned skills (including `.copilot/skills/` copies). Never force-add these files or copy their contents into tracked templates, charters, PR descriptions, or commit messages.
- Only reviewed, reusable configuration and upstream templates are shareable. Put necessary project facts in ordinary documentation without prompts, quotations, personal context, or session narratives.
- On a fresh clone, missing local histories and decisions are expected. Start fresh or create empty local state only when needed; never recover private state from old public commits. Existing local state must be preserved.
- `npm run squad:check` checks the Git index as well as ignore rules. CI is a backstop, not a privacy boundary: run the check before committing or pushing.

## Site and Content

- This is a Jekyll/Liquid blog, not an npm application. Source lives in `_posts/`, `_layouts/`, `_includes/`, `assets/`, and `content/`. Never edit generated `_site*/` output.
- Preserve existing design and template conventions. Reuse nearby components and CSS tokens; avoid unrelated redesigns.
- For prose, name specific tools and ground claims in supplied evidence. Never invent Marcus's experiences, reactions, motivations, results, or opinions. Flag facts that need confirmation.
- Preserve published post dates, URLs, and front matter unless a change is requested. Verify local image and internal link targets.

## Validation

- Use Node 24 LTS and Ruby/Bundler. Install from the lockfile with `npm ci`.
- `npm run squad:check` enforces the local, on-demand Squad setup. `npm run squad:doctor` provides extra diagnostics but is not a failure-enforcing CI gate.
- Run scoped Playwright tests with `npm test -- tests/<file>.spec.ts`; `npm test` runs the suite. Playwright starts Jekyll on port 4000 or reuses an existing local server.
- Run `bundle exec jekyll build` for production rendering checks. For a clean check, use `bundle exec ruby -rjekyll -e 'Jekyll::Commands::Build.process({%q{incremental} => false, %q{destination} => %q{.tmp/production-check}})'`. The Ruby string syntax also works through Windows Bundler's argument handling. Jekyll 3.10 does not support `--no-incremental`. The dev config intentionally skips feed and sitemap generation.
- For visual changes, verify desktop/mobile layout and keyboard access. Open user-facing previews in Microsoft Edge.
- Report what ran, what passed, and anything unverified. Never claim a preview, test, commit, deployment, or review occurred without evidence.
