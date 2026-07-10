---
id: 1289
title: 'An AI Analyst That Shows Its Work'
date: '2026-07-07'
description: 'A natural-language analyst that connects evidence across the data landscape, routes questions to governed models, applies the required filters, runs queries under your identity, and shows its work. The LLM handles the conversation; governed models and model-specific guidance determine how each question is answered.'
excerpt: 'A natural-language analyst that connects evidence across the data landscape, routes questions to governed models, and shows its work.'
layout: post
guid: 'https://marcusfelling.com/?p=1289'
permalink: /blog/2026/ai-analyst-that-shows-its-work
thumbnail-img: /content/uploads/2026/07/ask-not-dashboard.webp
thumbnail-alt: 'AI analyst interface answering a weekly revenue question with a sourced result and a show-the-query option.'
nav-short: true
tags: [AI, Power BI, Fabric, GitHub Copilot]
---
Ask an AI tool a data question and it will usually give you an answer that sounds finished. That does not mean it chose the measure your team uses, applied the filters everyone assumes, or even queried the right source. [Vibe analytics](https://mitsloan.mit.edu/ideas-made-to-matter/working-definitions/what-is-vibe-analytics) is the habit of taking that answer at face value. The name comes from [vibe coding](https://en.wikipedia.org/wiki/Vibe_coding), Andrej Karpathy's term for letting AI write the code and accepting it without reading the diffs.

I built this analyst to keep the speed without hiding the work. For a focused question, it finds the governed semantic model that owns the answer. For a broader briefing, it can pull evidence together across the data landscape. Queries run under the user's identity, and every answer carries its sources, periods, and filters. Type `show dax` to see the query. The LLM is the interface. Most of the work is in the institutional knowledge that tells it what a correct answer requires.

This started as a side project around three months ago and turned out useful enough that people started using it across our org. It is far enough along now that I want to talk about how it works.

Some context for anyone reading from outside my world: I work at Microsoft on an analytics team supporting a large ecommerce business. We aren't short on data. However, it can be a pain in the ass to find where the data lives, stitch it together across a bunch of reports and one-off spreadsheets, and then craft a story out of it.

The goal is not to replace reports or analysts. It is to make the governed semantic models built over our Microsoft Fabric gold layer easier to use, cut the manual stitching, capture the institutional knowledge that makes a number trustworthy, and give us more time to actually make decisions.

## Using it

Three sizes of question, one place to ask.

**Small: a single metric.** "What was yesterday's value for Metric A?" It picks the right semantic model and hands you the number.

**Medium: a health check.** One command gets you a cross-source briefing across a set of business areas, with each line graded against a threshold. It answers "Is anything on fire right now?" on one screen.

**Large: an executive readout.** One prompt and it pulls data across every relevant model, grades each area against a performance framework, and writes an actual decision brief: what happened, why it matters, and what to do about it, ending in a ranked action list with owners.

The executive readout is where this saves the most time. Before this, putting one together meant opening a stack of reports, lining up the numbers, writing the narrative, and formatting it for leadership. The agent can do that in a couple of minutes and attach the sources. You can still inspect the query behind any answer, because "trust me" is not a feature.

Here is what that looks like. Ask a plain-English question and the number comes back with its receipt, the source, filters, and period it used:

> **you:** what was the value of Metric A in Region A last quarter?
>
> **analyst:** Metric A in Region A was **X.X units**.
> _Source: semantic model A | Filters: Region = Region A, Scenario = Actuals | Period: Previous quarter_

Type `show dax` and it hands back the query it ran (real table and measure names swapped out here):

```dax
EVALUATE
ROW( "Metric A",
    CALCULATE(
        [Metric A],
        'Geography'[Region] = "Region A",
        'Calendar'[Relative Quarter] = "Previous Quarter"
    )
)
```

## How it actually works

The LLM handles the conversation. Routing, model guidance, and query execution are what make the answers useful.

I currently support three hosts: GitHub Copilot, Microsoft 365 Copilot Cowork, and Microsoft Scout. It started as a [GitHub Copilot custom agent](https://code.visualstudio.com/docs/agent-customization/custom-agents) wired up with several [MCP servers](https://code.visualstudio.com/docs/copilot/chat/mcp-servers). [MCP](https://modelcontextprotocol.io/docs/getting-started/intro), the Model Context Protocol, is the open standard that lets an agent talk to external tools in a consistent way.

### The MCP servers

- The core is [Power BI's remote MCP server](https://learn.microsoft.com/en-us/power-bi/developer/mcp/remote-mcp-server-get-started) (in preview). It separates two steps: generating a [DAX](https://learn.microsoft.com/en-us/dax/) query from a plain-English question and executing it against a [semantic model](https://learn.microsoft.com/en-us/power-bi/connect-data/service-datasets-understand) under your identity. A one-off question gets a query generated inside the guardrails set by the model guidance: the right measures and required filters. Bigger briefings skip generation and run prewritten DAX from those files.
- Other tools extend the workflow:
    - The [Azure DevOps MCP Server](https://github.com/microsoft/azure-devops-mcp) files a bug when something looks broken.
    - [Web IQ](https://webiq.microsoft.ai/) fetches external market intelligence.
    - [Work IQ](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/work-iq/) brings in work context from Microsoft 365, such as files, meetings, mail, and chats. It runs under your identity, so it only reaches content you can already access.

### The governed model

The part that makes any of this trustworthy is not the LLM. It is the governed semantic model it queries. Each model encodes certified business logic, agreed definitions for core business measures, and the row-level security that decides who sees which slice. That is what separates a number you can act on from one that merely looks right.

In a medallion architecture, data lands raw (bronze), gets cleaned and conformed (silver), then is shaped into business-ready governed tables (gold). My team's semantic models are built over that Microsoft Fabric gold layer. What I built is a thin natural-language layer that queries those models in place.

At a high level, a request moves through this path:

> **Question** <span aria-hidden="true">&rarr;</span> **agent routing** <span aria-hidden="true">&rarr;</span> **registry and model guidance** <span aria-hidden="true">&rarr;</span> **governed semantic model** <span aria-hidden="true">&rarr;</span> **query result and source metadata** <span aria-hidden="true">&rarr;</span> **answer or briefing**

### The main components

**The agent file.** Defines routing, workflow, and every mode and command.

**A model registry.** Maps each report to its exact workspace and semantic-model IDs. Once routing has picked a model, the registry resolves the target up front, so the agent does not wander around discovering what exists at runtime.

**Per-model guidance.** One prompt file per report, in plain Markdown, encodes the institutional knowledge: which filters must always be present, which measures are named inconsistently across tables, which dimension value looks like a total but is not, and which measures must never feed a narrative. This is the actual product. The LLM is the flexible interface; these files carry the accumulated product knowledge.

The exact rules vary by model, but a sanitized sketch of the shape looks like this:

```markdown
## Required filters
- Scope: required on every query
- Scenario: Actuals

## Measure guidance
- Metric A: use the certified measure
- Never narrate from measures listed as unsafe
```

**The execution layer.** Where the query runs: the Power BI remote MCP server in GitHub Copilot, or [Fabric IQ](https://learn.microsoft.com/en-us/fabric/iq/overview) in the case of Cowork.

## One brain, three front doors

I shipped it first as the GitHub Copilot custom agent. The first practical question was, "Great, how do I use this without opening an IDE?"

So it now has three front doors:

- The [GitHub Copilot custom agent](https://code.visualstudio.com/docs/agent-customization/custom-agents) in VS Code, with the full set of MCP servers.
- A plugin for [Microsoft 365 Copilot Cowork](https://learn.microsoft.com/en-us/microsoft-365/copilot/cowork/), where Power BI access is backed by [Fabric IQ](https://learn.microsoft.com/en-us/fabric/iq/overview) rather than provided by a bundled MCP server.
- A plugin for [Microsoft Scout](https://learn.microsoft.com/en-us/microsoft-scout/overview), an OpenClaw-like desktop app for Windows and macOS that acts across your files, shell, browser, and Microsoft 365. Scout supports a compatible agent-and-plugin shape built on the GitHub Copilot CLI, so the Markdown files ported cleanly; the plugin adds the MCP servers the host does not already ship.

The agent file and per-report prompt files form one canonical spec. A script generates the Scout desktop plugin from it by rewriting the front matter, re-anchoring file paths, and transforming the MCP configuration for that host. The Cowork edition reuses the same prompt files. These hosts are increasingly converging on the same basic shape: MCP for tools plus similar agent and skill formats. That keeps the host-specific glue small.

## Where it is going

The next step is hosting it as a [Foundry hosted agent](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/hosted-agents). Foundry Agent Service can run a packaged agent on managed infrastructure that handles scaling and session state. A hosted version could then be published to Microsoft Teams and Microsoft 365 Copilot Chat. That would address the "meet people where they already are" problem at the platform level.

After that, the roadmap is to add more data sources and embed the analyst more deeply into the workflows people already use every day.

## Stuff I learned

**The AI was the easy part.** Drop an LLM on your data and you get a confident, plausible, occasionally very wrong number. The hard and valuable work was writing down or referencing the institutional knowledge that makes an answer correct. That is the durable part.

**"Show me the query" makes review concrete.** People do not trust a black box, and they are right not to. Letting someone inspect the filters and measures does more for trust than a claim about accuracy can.

**Static checks protect the contract today.** Relevant changes run a batch of fast checks: do the golden questions still route where they should, does each model file still require the right filters, are known-bad measures still quarantined, and are the safety sections intact? The checks need no credentials or live queries and run in seconds. It is the difference between "move fast" and "move fast and start returning garbage."

**End-to-end trace evals are next.** The next tier will record real runs and check whether generated DAX keeps its required filters and whether every number in a narrative came from a query result rather than the model. That needs the agent running unattended, which is part of why I want it hosted on Foundry.

**Adding another supported semantic model is mostly configuration.** It needs a registry entry, per-model guidance, and routing and eval cases rather than a rebuilt application. I wrote a `CONTRIBUTING.md` with step-by-step instructions and practices that make the process repeatable.

## Wrapping up

The useful lesson is not that an LLM can write a briefing. It is that governed models, explicit routing, documented exceptions, and reviewable queries can turn a plain-English answer into something a person can verify. What I still need to automate is checking the whole run: that the agent picks the right model, keeps the required filters, and only writes numbers returned by a query.

If you are building something similar, I would like to compare how you encode business rules and test that every narrative claim traces back to a query result.