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

[Squad](https://github.com/bradygaster/squad) gives your repo a team of AI agents: a lead, a frontend dev, a tester, and a content writer, each with a separate context window, persistent memory, and defined boundaries.

[Brady Gaster](https://github.com/bradygaster) created the open-source framework to build AI development teams through GitHub Copilot. You describe what you're building, and Squad proposes a team of specialists that live in your repo as files. They persist across sessions, learn your codebase, share decisions, and improve as you use them.

Each team member runs in its own context, reads its own knowledge, and writes back what it learned.

I set it up for the repo behind this blog.

## Installing Squad

Getting started takes two commands:

```bash
npm i -g @bradygaster/squad-cli
squad
```

For additional installation options (including npx and cloning from source), see the [official installation guide](https://bradygaster.github.io/squad/docs/get-started/installation/).

Then open Copilot in VS Code, type `@squad`, and tell it what you're building:

```text
I'm starting a new project. Set up the team.
```

Squad proposes a team with names from a persistent thematic cast. Once you approve it, the team is ready.

## The Team

Squad generated a team tailored to my blog's needs:

- 🏗️ **Mal** / Lead: architecture, code review, cross-agent coordination
- ⚛️ **Kaylee** / Designer/Dev: CSS, layout, responsive design
- 📝 **Wash** / Content Dev: blog posts, frontmatter, SEO
- 🧪 **Zoe** / Tester: Playwright tests, accessibility, performance
- 📋 **Scribe** / Session logger: decisions, session summaries
- 🔄 **Ralph** / Work monitor: backlog, issue triage, CI monitoring

The casting system keeps each name after assignment, so a teammate who clones the repo gets the same team and cast.

Each agent has a **charter** (`charter.md`) that defines scope and boundaries: what they own, what files they can modify, and what they *don't* touch. Kaylee owns CSS but never writes tests. Wash owns blog posts but never touches layout. These boundaries prevent agents from stepping on each other.

## What Gets Created

Everything lives in a `.squad/` directory:

```text
.squad/
├── team.md            # Roster
├── routing.md         # Who handles what
├── decisions.md       # Shared brain
├── ceremonies.md      # Design reviews, retros
├── casting/
│   ├── policy.json
│   ├── registry.json
│   └── history.json
├── agents/
│   ├── kaylee/
│   │   ├── charter.md # Identity, expertise, voice
│   │   └── history.md # Project-specific learnings
│   ├── wash/
│   │   ├── charter.md
│   │   └── history.md
│   └── zoe/
│       ├── charter.md
│       └── history.md
└── log/               # Session history
```

Commit this folder, and the team's names and knowledge persist in git.

## Parallel Agents, Not Sequential

I did not expect Squad to run work in parallel. When you give it a task, the coordinator launches all relevant agents at once:

```text
You: "Team, redesign the blog"
  🏗️ Mal    → analyzing architecture requirements
  ⚛️ Kaylee → building new layout             (all launched
  🧪 Zoe    → writing test cases from spec     in parallel)
  📋 Scribe → logging everything
```

As agents finish, the coordinator chains follow-up work. A test can expose an edge case, and another agent can pick it up without waiting for you to ask.

Each agent gets its own context window. With Claude Sonnet 4 or Claude Opus 4's 200K token window, a lightweight coordinator leaves each agent ~78–83% of its context for project work. Fan out to 5 agents and you're working with ~1M tokens of total reasoning capacity.

## Knowledge That Compounds

Every time an agent works, it writes lasting learnings to its `history.md`. After a few sessions, agents know your conventions, your preferences, your architecture. They stop asking questions they've already answered.

Team-wide decisions live in `decisions.md`, which every agent reads before working. Personal knowledge stays in each agent's `history.md`. The Scribe keeps session logs searchable in `log/`.

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

## Lessons From Using It

**The first session is the least capable.** Knowledge compounds. By the third or fourth session, agents were making decisions based on prior context without me having to repeat anything.

**Clear charters need explicit exclusions.** Define what each agent owns and what it cannot touch. That separation keeps agents from duplicating or conflicting with one another.

**The Scribe does the most valuable work for me.** Its searchable log of decisions and sessions saves me from reconstructing what past-me was thinking the next day.

If you're using GitHub Copilot for your repo today, give Squad a try. It splits work across separate contexts while keeping the team configuration in git.
