# MarcusFelling.com blog

Jekyll blog hosted on GitHub Pages at [marcusfelling.com](https://marcusfelling.com). Covers DevOps, CI/CD, cloud engineering, AI, Playwright, GitHub Actions, Terraform, Bicep, and more.

## Running Locally

1. Install [Ruby and Bundler](https://jekyllrb.com/docs/installation/).
   Use Node.js 24 LTS for the test and Squad tooling.
2. Install dependencies:
   ```
   bundle install
   npm ci
   ```
3. Serve the site locally using the dev config for faster builds:
   ```
   bundle exec jekyll serve --config _config.yml,_config-dev.yml
   ```
4. Open http://localhost:4000

> The dev config (`_config-dev.yml`) skips feed and sitemap generation, cutting cold build time roughly in half. Production builds on GitHub Pages use only `_config.yml`.

## Project Structure

```
_posts/          # Blog posts (Markdown)
_layouts/        # Page templates (base, home, post, page)
_includes/       # Reusable partials (head, nav, footer)
_data/           # Data files (top_pages.yml)
assets/          # CSS and JS
content/         # Images and uploads
tests/           # Playwright E2E tests
.github/workflows/  # CI/CD workflows
```

## Testing

[Playwright](https://playwright.dev/) E2E tests live in `tests/` and cover the landing page, archives, post navigation, search, scroll-to-top, images, and 404 handling.

```
npx playwright test
```

Tests run automatically on PRs to `main` and on a daily schedule via the [Playwright workflow](.github/workflows/playwright.yml).

## Squad Without GitHub Issues

Select **Squad** in VS Code Copilot Chat and describe the work, name a file, or provide a failing test.
The existing team handles content, frontend work, design, testing, and promotion on demand.
Team definitions live in [.squad/team.md](.squad/team.md), agent charters, and
[routing.md](.squad/routing.md). Markdown is the source of truth; do not run `squad build` over it.

- `/squad-review` reviews the current diff without changing it.
- `/squad-post` reviews a named draft or published post for writing, evidence, metadata, and links.
- Direct requests also work: "Hockney, diagnose this failing test" or "McManus, fix this navigation bug."

No GitHub Issues, labels, auto-assignment, scheduled heartbeat, or release-promotion workflows are needed.
Ralph is inactive by default. Work starts with one owner and expands only when review or testing warrants it.
Agent model preferences are preserved. Commits, pushes, and publishing require explicit authorization;
PR completion is always a human action.

| Command | Purpose |
|---------|---------|
| `npm run squad:check` | Check pinned tooling, issue-free setup, ignore rules, and the index for private state; run before committing or pushing |
| `npm run squad:doctor` | Inspect team and runtime health; read warnings because doctor always exits successfully |
| `npm run squad:status` | Show the active team |
| `npm run squad:cost` | Report usage recorded in orchestration logs, not account-wide billing |
| `npm run squad:nap:preview` | Preview context cleanup without changing team history |
| `npm run squad` | Open the interactive team shell; requires an authenticated GitHub Copilot CLI |
| `npm test -- tests/landing.spec.ts` | Run a focused Playwright spec |

The optional CLI MCP state bridge in [.mcp.json](.mcp.json) is pinned to the same release as the CLI.
VS Code discovers the [Squad agent](.github/agents/squad.agent.md) independently.

### Private Local Memory

Squad histories, logs, decisions, identity, memory, learned skills, and scratch files are local-only.
The ignore rules default to excluding new `.squad/` state and explicitly allow reviewed team configuration,
charters, casting configuration, and upstream templates. Generated `.copilot/skills/` copies are also ignored.
Reusable prompt templates are public configuration; conversation prompts and session records are not.

Untracking preserves existing local files, but fresh clones do not receive this memory. Start fresh rather
than restoring old state from public commits. `squad doctor` may report missing local memory on a fresh clone;
the CI configuration check deliberately does not require it.

Run `npm run squad:check` before committing or pushing. It rejects tracked private-state paths even when
they were force-added. CI repeats the check, but a public push exposes content before CI can reject it.
This is a path safeguard, not a content scanner: do not paste private context into allowed files.

Removing files in a new commit does not erase earlier commits, PR diffs, forks, or clones. Previously
published memory remains in Git history unless a separately approved history cleanup is performed.

### Upgrading Squad

The repo pins `0.11.0`. On September 19, 2026, the published `0.12.0` CLI failed installation because
it required `@modelcontextprotocol/sdk@^1.30.0`, while the registry's latest was `1.29.0`.
Recheck that dependency before upgrading; do not force an unsupported override.

1. Install a verified release with `npm install --save-dev --save-exact @bradygaster/squad-cli@<version>`.
2. Run `npx --no-install squad upgrade`. It refreshes the coordinator, templates, and skills, but can
   also recreate issue/release workflows and overwrite repo-specific Copilot instructions.
3. Review the diff. Preserve this repo's instructions and team state, remove regenerated Squad workflows,
   and update the MCP package version in `.mcp.json`. Local coordinator backups are ignored, not deleted.
4. Run `npm run squad:check`, `npm run squad:doctor`, and `npm run test:list`. Review `npm audit` separately;
   the pinned Squad toolchain currently has dependency advisories. Do not apply `npm audit fix --force` blindly.

### Dependency Security

The OpenTelemetry dependency uses a scoped override for `@opentelemetry/propagator-jaeger@2.9.0`
to fix malformed-header denial of service (GHSA-45rx-2jwx-cxfr). Remove the override when Squad's
dependency tree resolves a patched propagator without it. Use `npm ci` so the lockfile and override apply.

As of September 19, 2026, `npm audit` still reports nine affected packages (five moderate, four high)
in the Squad development-tool dependency tree. Compatible patched releases are unavailable for
the affected Hono, Hono Node adapter, fast-uri, ip-address, and qs dependencies in the configured registry.
`npm audit fix` does not resolve them; its forced alternative downgrades Squad to 0.9.4.
These dependencies are not shipped in the static Jekyll site, but remain a risk for local and CI tooling.
Keep the optional MCP bridge on local stdio, do not expose it as a network service, and rerun
`npm audit` when upgrading. This mitigation is not a substitute for patched dependencies.

## CI/CD

- **GitHub Pages** — the site is built and deployed automatically on push to `main`.
- **Playwright Tests** — run on every PR and nightly via [playwright.yml](.github/workflows/playwright.yml).

## Contributing

Contributions are welcome via pull requests.

