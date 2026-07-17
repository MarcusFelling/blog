---
id: 1288
title: 'I Automated Meeting Action Items Into Azure DevOps Using GitHub Copilot and Work IQ MCP'
date: '2026-03-24'
description: 'How I wired together GitHub Copilot, Work IQ MCP, and Azure DevOps MCP to turn meeting transcripts into draft work items I review and approve.'
layout: post
guid: 'https://marcusfelling.com/?p=1288'
permalink: /blog/2026/automating-meeting-action-items-into-azure-devops-with-github-copilot-and-work-iq-mcp
thumbnail-img: /content/uploads/2026/03/ghcp-workiq-ado.webp
nav-short: true
tags: [AI, Azure DevOps]
---

My meetings produce action items, and many belong in Azure DevOps. Between a meeting ending and me opening ADO to create them, there's a gap where my motivation goes to die.

I wired together GitHub Copilot, Work IQ, and Azure DevOps to pull meeting transcripts, extract action items, and draft work items for my review. I approve each draft before GitHub Copilot creates or changes a work item.

---

**TL;DR**: I connected Work IQ MCP (reads Microsoft 365 meeting data) and Azure DevOps MCP (creates work items) to GitHub Copilot in VS Code. I record most of my meetings, so GitHub Copilot reads the transcript, extracts action items, and drafts ADO work items for me to review. I sign off before GitHub Copilot creates or changes anything.

---

## The Toolchain

The workflow combines four pieces:

1. **[GitHub Copilot](https://code.visualstudio.com/docs/copilot/overview)** in VS Code: the orchestration layer. Runs the prompt, calls the MCP tools, handles the back-and-forth.
2. **[Work IQ MCP](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/workiq-overview)**: reads my Microsoft 365 data (meetings, emails, Teams messages). This is where meeting context comes from.
3. **[Azure DevOps MCP Server](https://github.com/microsoft/azure-devops-mcp)**: creates work items, sets fields, assigns owners.
4. **[Custom instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions) and [prompt files](https://code.visualstudio.com/docs/copilot/customization/prompt-files)**: the glue that tells GitHub Copilot what to extract and how to structure the output.

## Work IQ: Reading Meeting Data

[Work IQ](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/workiq-overview) is a Microsoft-built, first-party MCP server that exposes your Microsoft 365 work data as MCP tools: mail, calendar, Teams, files, and people.

Work IQ takes a natural-language question about your M365 data, translates it into Microsoft Graph requests, and returns structured data. It uses user-delegated permissions and accesses content available to you.

One MCP server handles all M365 domains. You query it the way you'd ask a person: "what happened in my last meeting with the platform team?" and it figures out the right Graph calls to make. Work IQ remains in public preview, so the specific tools and APIs may shift.

I use meeting transcripts for this project. I record most of my meetings, so the transcripts sit in M365. Work IQ pulls the full transcript, giving GitHub Copilot context about who said what, what people agreed to, and which items remained unresolved. I get enough detail to act on a draft three weeks later.

## Azure DevOps MCP: Creating Real Work Items

The [Azure DevOps MCP server](https://github.com/microsoft/azure-devops-mcp) lets GitHub Copilot create work items and set fields such as title, description, assigned to, area path, iteration, and priority. It writes the items to the backlog, so I do not have to paste JSON somewhere and tidy it up by hand.

## How It Works

I use this six-step flow:

1. I record most meetings, which makes their transcripts available in M365.
2. I ask GitHub Copilot to pull the meeting transcript via Work IQ MCP.
3. GitHub Copilot extracts the action items: who's responsible, what needs to happen, any deadlines mentioned.
4. GitHub Copilot drafts the ADO work items and presents them to me for review.
5. I review the draft, edit titles and descriptions, and remove anything that should not be there.
6. After I sign off, GitHub Copilot calls the ADO MCP server to create the work items.

I don't let GitHub Copilot create work items unsupervised. Meetings are messy: speculative ideas, tangents, and the time-honored move of someone volunteering a colleague for work that colleague hasn't heard about yet. I was in the room, so I can separate real decisions from speculation during review.

Two details reduce cleanup:

**Reference your ADO org and project in your instructions file.** Add your default organization URL and project name to your custom instructions or `.github/copilot-instructions.md`. GitHub Copilot can then target the right project without another round trip.

**Point to a parent work item.** I include the Epic I'm working under in my prompt. Copilot can then create child Features, User Stories, or Tasks beneath it. Otherwise, Copilot may create orphaned work items that I have to reparent. If your team structures work under Epics or Features, give GitHub Copilot that context up front.

My prompt looks like this:

```text
Read the transcript from my most recent meeting with 
the platform team. Extract action items and draft 
Azure DevOps work items in the Platform project under 
Epic #4521. Show me the draft before creating anything.
```

GitHub Copilot makes the Work IQ tool call, gets the transcript back, parses out action items, and shows me a structured draft. I make edits, say "looks good," and GitHub Copilot makes the ADO MCP calls. You can watch the tool calls in GitHub Copilot chat.

GitHub Copilot orchestrates two separate MCP servers in one conversation: it reads from one system, waits for my approval, and writes to another.

## Choosing GitHub Copilot Over Copilot Cowork

Microsoft has [Copilot Cowork](https://www.microsoft.com/en-us/microsoft-365/blog/2026/03/09/copilot-cowork-a-new-way-of-getting-work-done/), built on [Claude Cowork](https://www.anthropic.com/product/claude-cowork), an enterprise work orchestration agent that can [plan multi-step tasks across M365](https://www.microsoft.com/en-us/microsoft-365/blog/2026/03/09/powering-frontier-transformation-with-copilot-and-agents/) across calendar, Teams, Excel, and email with little setup. It also supports [skills](https://claude.com/skills), [plugins](https://claude.com/plugins), and [MCP connectors](https://claude.com/connectors). For one-off knowledge work across M365, it works well.

I chose GitHub Copilot + MCP because it lives where my dev tools are.

**Everything is in the repo.** My custom instructions, prompt files, and skill definitions are files that live in version control. I can diff them, review them in PRs, and share them across the team through normal git workflows. Cowork's skills and plugins exist in their own ecosystem outside of source control.

**Built for developer workflows.** Cowork is designed for knowledge workers doing non-technical tasks across M365, and it's good at that. GitHub Copilot + MCP is designed for people who want to wire systems together through code, inspect tool calls, and iterate on prompts the way they iterate on code.

Cowork handles M365 orchestration with built-in guardrails. GitHub Copilot + MCP gives you a developer-native platform where the customization lives in your repo and the workflow runs in your IDE. For repeatable workflows that need to reach into ADO and stay under version control, I'll take GitHub Copilot + MCP.

## Current Results

I've run the setup against a handful of real meetings. The drafts land around 80-90% right: I fix a title, delete an item that was never an action item, and tweak an assignment or two. The review step keeps me in control.

I keep the prompt file in version control and tune the instructions for my ADO setup. The workflow takes about 30 seconds of GitHub Copilot chat plus a minute of review. I used to spend 15 minutes copying and pasting, or zero minutes when I forgot the work.

## Packaging It for the Team

The workflow lives in my prompt files and custom instructions. To share it with the team, I need to package it as a reusable Copilot customization.

GitHub Copilot offers three mechanisms for this: [custom agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents) (`.agent.md`), [prompt files](https://code.visualstudio.com/docs/copilot/customization/prompt-files) (`.prompt.md`), and [skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills) (`SKILL.md`). All three live in the repo, use git for versioning, and give the team a single file to iterate on. Their differences matter for a workflow that creates work items in an external system.

I plan to use a [custom agent](https://code.visualstudio.com/docs/copilot/customization/custom-agents) because it supports tool restriction. An `.agent.md` file can restrict Copilot's tool set to declarations in frontmatter. When you invoke `@meeting-actions`, Copilot uses the Work IQ and ADO MCP tools without access to unrelated codebase tools. For a workflow that writes to a real system, scoped tool access matters from day one.

Agents also let you include custom instructions, model preferences, and the human review step in the agent definition. The team invokes it with `@meeting-actions`. One file contains the extraction logic, field mappings, definition of an action item, and the "show me the draft before creating anything" gate.

A prompt file (`.prompt.md`) is the lighter alternative. It can declare MCP tool dependencies in frontmatter, and you invoke it with `/meeting-work-items`. Prompt files leave Copilot's other tools available. If you want to prototype the instructions first and don't need tool scoping yet, a prompt file has less conceptual overhead. Moving from a prompt file to an agent costs little because the instructions body uses the same Markdown.

I considered skills first, but they fit this workflow least well. Copilot auto-discovers a `SKILL.md` when it matches your request, which helps with guidance and reusable patterns. Auto-discovery adds risk when the result writes work items to ADO. You can disable it with `disable-model-invocation: true` in the frontmatter. Doing so turns a skill into a slash command without the tool restriction or model preference support that agents and prompt files offer. Skills also can't declare tool dependencies in machine-readable frontmatter. They reference tools in body text.
