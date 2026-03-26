---
id: 1288
title: 'I Automated Meeting Action Items Into Azure DevOps Using GitHub Copilot and Work IQ MCP'
date: '2026-03-24'
description: 'How I wired together GitHub Copilot, Work IQ MCP, and Azure DevOps MCP to turn meeting transcripts into draft work items I review and approve.'
layout: post
guid: 'https://marcusfelling.com/?p=1288'
permalink: /blog/2026/automating-meeting-action-items-into-azure-devops-with-github-copilot-and-work-iq-mcp
thumbnail-img: /content/uploads/2026/03/ghcp-workiq-ado.png
nav-short: true
tags: [AI, Azure DevOps]
---

My meetings produce action items. Most of the time, those action items should become work items in Azure DevOps. And between a meeting ending and me opening ADO to create them, there's a gap where my motivation goes to die.

So I wired together GitHub Copilot, Work IQ, and Azure DevOps to pull meeting transcripts, extract action items, and draft work items for me to review before anything gets created or modified.

---

**TL;DR**: I connected Work IQ MCP (reads Microsoft 365 meeting data) and Azure DevOps MCP (creates work items) to GitHub Copilot in VS Code. I record most of my meetings, so GitHub Copilot reads the transcript, extracts action items, and drafts ADO work items for me to review. I sign off before anything gets created or modified.

---

## The Toolchain

Four things wired together:

1. **GitHub Copilot** in VS Code: the orchestration layer. Runs the prompt, calls the MCP tools, handles the back-and-forth.
2. **Work IQ MCP**: reads my Microsoft 365 data (meetings, emails, Teams messages). This is where meeting context comes from.
3. **Azure DevOps MCP Server**: creates work items, sets fields, assigns owners.
4. **Custom instructions and prompt files**: the glue that tells GitHub Copilot what to extract and how to structure the output.

## Work IQ: Reading Meeting Data

[Work IQ](https://github.com/microsoft/work-iq) is a Microsoft-built, first-party MCP server that exposes your Microsoft 365 work data — mail, calendar, Teams, files, people — as MCP tools.

How it works: you ask a natural-language question about your M365 data, the Work IQ MCP server translates that into Microsoft Graph requests behind the scenes, and you get structured data back. It runs under user-delegated permissions, so you're scoped to what you already have access to.

It's a single MCP server that handles all M365 domains, not separate servers per data type. You query it the way you'd ask a person: "what happened in my last meeting with the platform team?" and it figures out the right Graph calls to make. Work IQ is currently in public preview, so the specific tools and APIs may shift.

For this project, meeting transcripts are what matter. I record most of my meetings, so the transcripts are available. Work IQ can pull the full transcript, which gives GitHub Copilot much richer context for extracting action items. Who said what, what was agreed on, what was left open. That detail matters when you're trying to turn a conversation into structured work items.

## Azure DevOps MCP: Creating Real Work Items

The other half is the [Azure DevOps MCP server](https://github.com/microsoft/azure-devops-mcp). It gives GitHub Copilot the ability to perform actual ADO operations: creating work items, setting fields like title, description, assigned to, area path, iteration, priority. Not generating JSON that you paste somewhere.

## How It Actually Works

The flow:

1. A meeting happens. I try to record most meetings, the transcript is available in M365.
2. I ask GitHub Copilot to pull the meeting transcript via Work IQ MCP.
3. GitHub Copilot extracts the action items: who's responsible, what needs to happen, any deadlines mentioned.
4. GitHub Copilot drafts the ADO work items and presents them to me for review.
5. I review the draft. Edit titles and descriptions, remove anything that shouldn't be there. Then I approve.
6. Only after I sign off does GitHub Copilot call the ADO MCP server to create the work items.

I don't let GitHub Copilot create work items unsupervised. Meetings have nuance: speculative ideas, tangential discussions, someone volunteering someone else for work they don't know about yet. An AI reading a transcript doesn't know the difference between a decision and someone thinking out loud. I do.

A couple of things I learned that help a lot:

**Reference your ADO org and project in your instructions file.** If you put your default org URL and project name in your custom instructions or `.github/copilot-instructions.md`, GitHub Copilot doesn't have to ask you every time. It just knows where to create work items. One less round-trip in every conversation.

**Point to a parent work item.** I usually reference the Epic I'm currently working under in my prompt. That way Copilot knows to create child Features, User Stories, or Tasks underneath it instead of dumping loose items into the backlog. Without this, you end up with orphaned work items that need manual reparenting. If your team structures work under Epics or Features, give GitHub Copilot that context upfront.

In practice, a prompt looks something like:

```text
Read the transcript from my most recent meeting with 
the platform team. Extract action items and draft 
Azure DevOps work items in the Platform project under 
Epic #4521. Show me the draft before creating anything.
```

GitHub Copilot makes the Work IQ tool call, gets the transcript back, parses out action items, and shows me a structured draft. I make edits, say "looks good," and then GitHub Copilot makes the ADO MCP calls. You can watch the tool calls happening in real time in the GitHub Copilot chat.

> The interesting part isn't any single tool call. It's that GitHub Copilot handles the orchestration between two completely separate MCP servers in one conversation. Read from one system, get human approval, write to another.

## Why GitHub Copilot Over Copilot Cowork

This is the question I keep getting. Microsoft has [Copilot Cowork](https://www.microsoft.com/en-us/microsoft-365/blog/2026/03/09/copilot-cowork-a-new-way-of-getting-work-done/), built on [Claude Cowork](https://www.anthropic.com/product/claude-cowork), an enterprise work orchestration agent that can [plan multi-step tasks across M365](https://www.microsoft.com/en-us/microsoft-365/blog/2026/03/09/powering-frontier-transformation-with-copilot-and-agents/) (calendar, Teams, Excel, email) with basically zero setup. It supports [skills](https://claude.com/skills), [plugins](https://claude.com/plugins), and [MCP connectors](https://claude.com/connectors), so it's not short on extensibility. For one-off knowledge work across M365, it works well.

But I chose GitHub Copilot + MCP for this, and here's why: it lives where my dev tools already are.

**Everything is in the repo.** My custom instructions, prompt files, and skill definitions are files that live in version control. I can diff them, review them in PRs, and share them across the team through normal git workflows. Cowork's skills and plugins exist in their own ecosystem outside of source control.

**Built for developer workflows.** Cowork is designed for knowledge workers doing non-technical tasks across M365, and it's good at that. GitHub Copilot + MCP is designed for people who want to wire systems together programmatically, inspect tool calls, and iterate on prompts the way they iterate on code.

They solve different problems. Cowork gives you zero-friction M365 orchestration with guardrails. GitHub Copilot + MCP gives you a developer-native platform where the customization lives in your repo and the workflow runs in your IDE. For repeatable workflows that need to reach into ADO and stay under version control, I'll take GitHub Copilot + MCP.

## Where I'm Currently At

The setup works. I've used it on a handful of real meetings and the output is good enough that I keep using it. The drafts are usually 80-90% right. I fix a title here, remove a non-actionable item there, adjust an assignment. But the baseline is solid and the review step keeps me in control.

The prompt file is versioned, the instructions are tuned for my ADO setup, and the whole thing runs in about 30 seconds of GitHub Copilot chat plus a minute of review. Beats the 15 minutes of copy-paste-and-forget that it replaced. Or the zero minutes I spent when I just forgot entirely.

## What's Next

Right now this lives in my prompt files and custom instructions. It works for me, but if I want other people on the team to use it, I need to package it up somehow.

GitHub Copilot has three mechanisms for this: [custom agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents) (`.agent.md`), [prompt files](https://code.visualstudio.com/docs/copilot/customization/prompt-files) (`.prompt.md`), and [skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills) (`SKILL.md`). They all live in the repo, version in git, and give the team a single file to iterate on. But they work differently, and the differences matter for something that creates real work items in an external system.

I'm leaning toward a [custom agent](https://code.visualstudio.com/docs/copilot/customization/custom-agents). The main reason is tool restriction. An `.agent.md` file can restrict Copilot to only the tools you declare in frontmatter, so when someone invokes `@meeting-actions`, Copilot operates with only the Work IQ and ADO MCP tools. No stray tool calls against your codebase when the intent is "process a meeting." For a workflow that writes to a real system, scoped tool access matters from day one.

Agents also let you bake in custom instructions, model preferences, and the human review step as part of the agent definition itself. The team invokes it with `@meeting-actions`, and everything about how the workflow runs is encapsulated in one file. The extraction logic, the field mappings, what counts as an action item vs. a discussion point, the "show me the draft before creating anything" gate.

A prompt file (`.prompt.md`) is the lighter alternative. It can declare MCP tool dependencies in frontmatter and you invoke it with `/meeting-work-items`. The difference is that prompt files don't restrict Copilot to only those tools. If you want to prototype the instructions first and don't need tool scoping yet, a prompt file is less conceptual overhead. And upgrading from a prompt file to an agent later is low-cost since the instructions body is the same Markdown either way.

Skills were actually my first instinct, but they're the weakest fit here. A `SKILL.md` gets auto-discovered by Copilot when it matches what you're asking about, which is useful for guidance and reusable patterns. But auto-discovery is a liability when the end result is writing work items to ADO. You can disable auto-discovery with `disable-model-invocation: true` in the frontmatter, but at that point you've turned a skill into a slash command without the tool restriction or model preference support that agents and prompt files offer. Skills also can't declare tool dependencies in machine-readable frontmatter. They reference tools in body text only.
