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

What if your repo had a whole team of AI agents: a lead, a frontend dev, a tester, a content writer, each with their own context window, persistent memory, and defined boundaries? That's exactly what [Squad](https://github.com/bradygaster/squad) gives you.

[Squad](https://github.com/bradygaster/squad) is an open-source framework conceived by [Brady Gaster](https://github.com/bradygaster) that creates an AI development team through GitHub Copilot. You describe what you're building, and Squad proposes a team of specialists that live in your repo as files. They persist across sessions, learn your codebase, share decisions, and get better the more you use them.

It's not a chatbot wearing hats. Each team member runs in its own context, reads only its own knowledge, and writes back what it learned.

I set it up for the repo of this blog. Here's what I learned.

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

Squad proposes a team, each member named from a persistent thematic cast. You say yes. They're ready.

## The Team

Squad generated a team tailored to my blog's needs:

- 🏗️ **Mal** / Lead: architecture, code review, cross-agent coordination
- ⚛️ **Kaylee** / Designer/Dev: CSS, layout, responsive design
- 📝 **Wash** / Content Dev: blog posts, frontmatter, SEO
- 🧪 **Zoe** / Tester: Playwright tests, accessibility, performance
- 📋 **Scribe** / Session logger: decisions, session summaries
- 🔄 **Ralph** / Work monitor: backlog, issue triage, CI monitoring

The names come from a persistent casting system. Once assigned, they stick. Anyone who clones the repo gets the same team with the same cast.

Each agent has a **charter** (`charter.md`) that defines scope and boundaries: what they own, what files they can modify, and critically, what they *don't* touch. Kaylee owns CSS but never writes tests. Wash owns blog posts but never touches layout. These boundaries prevent agents from stepping on each other.

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

Commit this folder. Your team persists. Names persist. It's all in git.

## Parallel Agents, Not Sequential

This is the part that surprised me most. When you give Squad a task, the coordinator launches every agent that can usefully start, simultaneously:

```text
You: "Team, redesign the blog"
  🏗️ Mal    → analyzing architecture requirements
  ⚛️ Kaylee → building new layout             (all launched
  🧪 Zoe    → writing test cases from spec     in parallel)
  📋 Scribe → logging everything
```

When agents finish, the coordinator immediately chains follow-up work. Tests reveal edge cases, another agent picks them up, no waiting for you to ask.

Each agent gets its own context window. With Claude Sonnet 4 or Claude Opus 4's 200K token window, and the coordinator kept thin, each agent has ~78–83% of its context available for actual work. Fan out to 5 agents and you're working with ~1M tokens of total reasoning capacity.

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

1. Label an issue `squad`. The Lead auto-triages it, determines who should handle it, and applies the right `squad:{member}` label.
2. The assigned member picks up the issue in their next Copilot session (or automatically if Copilot coding agent is enabled).
3. Labels sync automatically from your team roster via the `sync-squad-labels` workflow.

## What I Learned

**The first session is the least capable.** Knowledge compounds. By the third or fourth session, agents were making decisions based on prior context without me having to repeat anything.

**Boundaries matter more than capabilities.** Clear charters that define what an agent *doesn't* do are more important than what it can do. Overlap is the enemy.

**The Scribe is secretly the most important agent.** Coming back the next day to a searchable log of every decision and session is invaluable. Context is never lost.

If you're using GitHub Copilot for your repo(s) today, give Squad a try. The jump from one agent to a coordinated team is pretty awesome, and it all lives in git.
