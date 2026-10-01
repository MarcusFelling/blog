---
id: 1280
title: 'Building an AI Agent Squad for Your Repo'
date: '2026-02-26'
description: 'How I set up Squad, an open-source AI agent team framework, and what I learned along the way'
layout: post
guid: 'https://marcusfelling.com/?p=1280'
permalink: /blog/2026/building-an-ai-agent-squad-for-your-repo
thumbnail-img: /content/uploads/2026/02/squad.webp
nav-short: true
tags: [AI]
---

What if your AI assistant were a team instead of one chatbot switching hats? That's the idea behind [Squad](https://github.com/bradygaster/squad). It gives your repo a crew of specialists, each with its own context window, its own memory, and a charter that spells out its job. The whole team lives in your repo as files.

[Brady Gaster](https://github.com/bradygaster) built Squad as an open-source framework for AI development teams on GitHub Copilot. Describe what you're building and Squad proposes a team for it: a lead, the specialists your project needs, Scribe to keep the record, and Ralph to watch the backlog. Each member works from its own charter and history, shares decisions with the team, and writes back what it learned for next time.

I set it up for the repo behind this blog in February. Squad is alpha software, and the setup has changed since then, so I've updated this post for Squad 0.12.

## Installing Squad

From your repo root, install the CLI, initialize Squad, and check the setup:

```bash
npm install -g @bradygaster/squad-cli
squad init
squad doctor
```

The npm package needs Node.js 22.5 or later. For Homebrew, WinGet, an install script, or a standalone download, see the [official installation guide](https://bradygaster.github.io/squad/docs/get-started/installation/).

`squad init` adds the coordinator agent at `.github/agents/squad.agent.md` and creates a `.squad/` directory for team state. `squad doctor` validates that structure and configuration.

The docs recommend the [GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/install-copilot-cli) for day-to-day work with your team:

```bash
copilot --agent squad
```

In VS Code, open Copilot Chat and select **Squad** from the agent picker. Both [interfaces](https://bradygaster.github.io/squad/docs/get-started/choose-your-interface/) read the same `.squad/` directory, so you can switch between them.

Then tell Squad what you're building. The docs suggest naming your stack and key requirements up front:

```text
I'm building [brief description]. Set up the team.
Stack: [language, framework, database]
Key requirements:
- [requirement 1]
- [requirement 2]
```

Squad proposes a team with names from a persistent thematic cast. Once you approve it, the team is ready.

## The Team

Here's the team that works on this blog today. Its names come from *The Usual Suspects*:

- 🏗️ **Keaton** / Lead: architecture, scope, code review
- 📝 **Verbal** / Content Dev: blog posts, front matter, SEO copy
- ⚛️ **McManus** / Frontend Dev: Liquid templates, layouts, CSS, JavaScript
- 🧪 **Hockney** / Tester: Playwright tests, regression coverage, edge cases
- ⚛️ **Fenster** / Design/UX: visual design, reader experience, accessibility
- 📝 **Kobayashi** / DevRel: promotion, social copy, discoverability
- 📋 **Scribe** / Session logger: decisions, session logs
- 🔄 **Ralph** / Work monitor: backlog and issue triage, inactive here because this blog doesn't use GitHub Issues

Two optional specialists, Rai for responsible AI review and a fact-checker, join only when a task needs them.

The casting system keeps each name after assignment, so a teammate who clones the repo gets the same team and cast.

Each agent has a **charter** (`charter.md`) that defines scope and boundaries: what they own, what files they can modify, and what they *don't* touch. McManus owns templates and CSS but leaves tests to Hockney. Verbal owns blog posts but hands layout to McManus. Charters are instructions, not enforced permissions, but clear boundaries help keep agents from stepping on each other.

## What Gets Created

Team state lives in a `.squad/` directory:

```text
.squad/
├── team.md            # Roster
├── routing.md         # Who handles what
├── decisions.md       # Shared brain
├── decisions/inbox/   # Drop-box for parallel decision writes
├── ceremonies.md      # Design reviews, retros
├── casting/
│   ├── policy.json
│   ├── registry.json
│   └── history.json
├── agents/
│   ├── mcmanus/
│   │   ├── charter.md # Identity, expertise, boundaries
│   │   └── history.md # Project-specific learnings
│   ├── verbal/
│   │   ├── charter.md
│   │   └── history.md
│   ├── hockney/
│   │   ├── charter.md
│   │   └── history.md
│   └── scribe/
│       └── charter.md # Silent memory manager
├── identity/
│   ├── now.md         # Current team focus
│   └── wisdom.md      # Reusable patterns
├── orchestration-log/ # Per-spawn log entries
└── log/               # Session history
```

Shared skills live outside this folder in `.copilot/skills/`. Squad still reads the older `.squad/skills/` path for backward compatibility.

The docs recommend committing `.squad/` so anyone who clones the repo gets the same team, cast, and accumulated knowledge. You still control what goes in. Histories and decisions can capture project-specific details, so the docs suggest reviewing them before you share them and gitignoring histories you want to keep local. To keep state out of your working tree entirely, the `orphan` and `two-layer` [state backends](https://bradygaster.github.io/squad/docs/scenarios/team-state-storage/) store it on a separate `squad-state` branch. For this blog, I commit the team configuration and charters and keep histories, decisions, and logs local.

## Parallel Agents, Not Sequential

I did not expect Squad to run work in parallel. When you give it a task, the coordinator launches all relevant agents at once:

```text
You: "Team, redesign the blog"
  🏗️ Keaton  → analyzing architecture requirements
  ⚛️ Fenster → setting the design direction    (all launched
  ⚛️ McManus → building the new layout          in parallel)
  🧪 Hockney → writing test cases from the spec
  📋 Scribe  → logging everything
```

As agents finish, the coordinator chains follow-up work. A test can expose an edge case, and another agent can pick it up without waiting for you to ask.

Each agent gets its own context window, so agents working in parallel don't compete for space in a single conversation.

In VS Code, sub-agents launched in the same turn run in parallel but report back together, so you won't see a live launch list like the one above. For heavy fan-out of five or more agents, the [VS Code guide](https://bradygaster.github.io/squad/docs/features/vscode/) suggests the Copilot CLI.

## Knowledge That Compounds

Every time an agent works, it writes lasting learnings to its `history.md`. After a few sessions, agents know your conventions, your preferences, your architecture. They stop asking questions they've already answered.

Team-wide decisions live in `decisions.md`, which every agent reads before working. Personal knowledge stays in each agent's `history.md`. Reusable patterns become [skills](https://bradygaster.github.io/squad/docs/features/skills/) that any agent can read. Scribe keeps searchable session logs in `log/` and records what was spawned, and why, in `orchestration-log/`.

**Frontend agent knowledge over time:**
Stack, framework → Components, routing → Design system, a11y conventions

**Lead agent knowledge over time:**
Scope, roster → Trade-offs, risks → Full project history, tech debt map

**Tester agent knowledge over time:**
Framework, first cases → Edge case catalog → Regression patterns, coverage gaps

## Issue Integration

Squad ties into GitHub Issues with a labeling workflow:

1. Label an issue `squad`. The Lead triages it, determines who should handle it, and applies the right `squad:{member}` label.
2. The assigned member picks up the issue in their next Copilot session. Copilot coding agent can pick it up sooner when enabled.
3. The `sync-squad-labels` workflow syncs labels from your team roster.

Once Squad is connected to the repo, you can also skip the labels and say `Work on #12`. The coordinator routes the issue, and the agent creates a branch and opens a linked PR. Review agent PRs the same way you'd review any other PR before merging.

## Best Practices From the Docs

The Squad docs include a [tips and tricks guide](https://bradygaster.github.io/squad/docs/tips-and-tricks/) built from real usage. A few highlights:

- **Start small.** Four or five agents make a good team. Add specialists only when you need them.
- **Be specific about scope.** Say what's in, what's out, and what comes later, so agents build instead of asking questions.
- **Say "Team" for parallel work.** Name a single agent for sequential or specialized work, like a review or a one-file fix.
- **Let the batch finish.** Agents chain follow-up work on their own, and interrupting mid-batch breaks the chain. When they're done, ask what the team did.
- **Turn corrections into directives.** Say "always…" or "never…" and Squad records it in `decisions.md`, so you only have to say it once.
- **Keep memory lean.** Squad archives older history entries once a `history.md` passes about 12 KB. Run `squad nap --dry-run` to preview a [cleanup](https://bradygaster.github.io/squad/docs/features/context-hygiene/) before you run `squad nap`.

## Lessons From Using It

**The first session is the least capable.** Knowledge compounds. By the third or fourth session, agents were making decisions based on prior context without me having to repeat anything.

**Clear charters need explicit exclusions.** Define what each agent owns and what it cannot touch. That separation keeps agents from duplicating or conflicting with one another.

**The Scribe does the most valuable work for me.** Its searchable log of decisions and sessions saves me from reconstructing what past-me was thinking the next day.

If you're using GitHub Copilot for your repo today, give Squad a try. It splits work across separate contexts while keeping the team configuration in git.
