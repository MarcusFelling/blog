---
id: 1289
title: 'An AI Analyst That Shows Its Work'
date: '2026-07-07'
description: 'A natural-language analyst that connects evidence across the data landscape, routes questions to governed models, applies the required filters, runs queries under your identity, and shows its work. The LLM handles the conversation; governed models and model-specific guidance determine how each question is answered.'
excerpt: 'A natural-language analyst that connects evidence across the data landscape, routes questions to governed models, and shows its work.'
layout: post
guid: 'https://marcusfelling.com/?p=1289'
permalink: /blog/2026/ai-analyst-that-shows-its-work
thumbnail-img: /content/uploads/2026/07/ai-analyst-data-landscape.webp
thumbnail-alt: 'Architecture diagram showing GitHub Copilot, Microsoft 365 Copilot Cowork, and Microsoft Scout sharing a canonical agent spec, connected to a combined Power BI remote MCP and Fabric IQ layer with governed semantic models, plus Work IQ, Web IQ, and Azure DevOps MCP.'
thumbnail-zoom: true
nav-short: true
tags: [AI, Power BI, Fabric, GitHub Copilot]
---
Ask an AI tool a data question and you can get an answer that sounds finished while using the wrong measure, skipping assumed filters, or querying the wrong source. [Vibe analytics](https://mitsloan.mit.edu/ideas-made-to-matter/working-definitions/what-is-vibe-analytics) means taking that answer at face value. The name borrows from [vibe coding](https://en.wikipedia.org/wiki/Vibe_coding), Andrej Karpathy's term for letting AI write code and accepting it without reading the diffs.

I built this analyst to keep the speed and expose the work. For a focused question, it finds the governed semantic model that owns the answer. For a broader briefing, it can pull evidence together across the data landscape. The analyst runs queries under the user's identity and includes its sources, periods, and filters with each answer. Type `show dax` to see the query. The LLM handles the conversation; institutional knowledge defines what a correct answer requires.

I started this as a side project around three months ago. People across our org use it, and I want to explain how it works.

I work at Microsoft on an analytics team supporting a large ecommerce business. We have plenty of data. Finding where it lives, stitching it together across reports and one-off spreadsheets, and crafting a story can be a pain in the ass.

The analyst complements reports and analysts. It makes the governed semantic models built over our Microsoft Fabric gold layer easier to use, cuts the manual stitching, captures the institutional knowledge that makes a number trustworthy, and gives us more time to make decisions.

## Using it

I use it for three sizes of question in one place.

**Small: a single metric.** "What was yesterday's value for Metric A?" It picks the right semantic model and hands you the number.

**Medium: a health check.** One command gets you a cross-source briefing across a set of business areas, with each line graded against a threshold. It answers "Is anything on fire right now?" on one screen.

**Large: an executive readout.** One prompt pulls data across each relevant model, grades each area against a performance framework, and writes a decision brief: what happened, why it matters, and what to do about it, ending in a ranked action list with owners.

The executive readout saves me the most time. Before the agent, putting one together meant opening a stack of reports, lining up the numbers, writing the narrative, and formatting it for leadership. The agent can do that in a couple of minutes and attach the sources. I can inspect the query behind any answer and verify its filters and measures.

Ask a plain-English question and the answer includes its receipt: the source, filters, and period used.

> **you:** what was the value of Metric A in Region A last quarter?
>
> **analyst:** Metric A in Region A was **X.X units**.
> _Source: semantic model A | Filters: Region = Region A, Scenario = Actuals | Period: Previous quarter_

Type `show dax` and it returns the query it ran. I replaced the real table and measure names in this example:

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

## How it works

The LLM handles the conversation. Routing, model guidance, and query execution are what make the answers useful.

I support three hosts: GitHub Copilot, Microsoft 365 Copilot Cowork, and Microsoft Scout. I started with a [GitHub Copilot custom agent](https://code.visualstudio.com/docs/agent-customization/custom-agents) wired up with several [MCP servers](https://code.visualstudio.com/docs/copilot/chat/mcp-servers). [MCP](https://modelcontextprotocol.io/docs/getting-started/intro), the Model Context Protocol, is the open standard that lets an agent talk to external tools in a consistent way.

### The MCP servers

- The core is [Power BI's remote MCP server](https://learn.microsoft.com/en-us/power-bi/developer/mcp/remote-mcp-server-get-started) (in preview). It separates two steps: generating a [DAX](https://learn.microsoft.com/en-us/dax/) query from a plain-English question and executing it against a [semantic model](https://learn.microsoft.com/en-us/power-bi/connect-data/service-datasets-understand) under your identity. For a one-off question, the server generates a query within guardrails supplied by the model guidance: the right measures and required filters. For bigger briefings, the agent runs prewritten DAX from those files.
- Other tools extend the workflow:
    - The [Azure DevOps MCP Server](https://github.com/microsoft/azure-devops-mcp) files a bug when something looks broken.
    - [Web IQ](https://webiq.microsoft.ai/) fetches external market intelligence.
    - [Work IQ](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/work-iq/) brings in work context from Microsoft 365, such as files, meetings, mail, and chats. It runs under your identity and reaches content you can access.

### The governed model

I rely on governed semantic models for trustworthy answers. We encode certified business logic and agreed definitions for core business measures in each model. Row-level security limits each user to the data they can access.

In a medallion architecture, data engineers store raw data in bronze tables, clean and conform it in silver, then shape it into business-ready gold tables. My team's semantic models use that Microsoft Fabric gold layer. I built a thin natural-language layer that queries those models in place.

The analyst follows this path for each request:

> **Question** <span aria-hidden="true">&rarr;</span> **agent routing** <span aria-hidden="true">&rarr;</span> **registry and model guidance** <span aria-hidden="true">&rarr;</span> **governed semantic model** <span aria-hidden="true">&rarr;</span> **query result and source metadata** <span aria-hidden="true">&rarr;</span> **answer or briefing**

### The main components

**The agent file.** Defines routing, workflow, and every mode and command.

**A model registry.** Maps each report to its exact workspace and semantic-model IDs. After the agent chooses a model, the registry resolves the target up front, so the agent does not wander around discovering what exists at runtime.

**Per-model guidance.** One prompt file per report, in plain Markdown, encodes the institutional knowledge: which filters must always be present, how measure names differ across tables, which dimension value looks like a total but is not, and which measures must never feed a narrative. These files carry the accumulated product knowledge; the LLM provides a flexible interface.

The exact rules vary by model, but a sanitized sketch of the shape looks like this:

```markdown
## Required filters
- Scope: required on every query
- Scenario: Actuals

## Measure guidance
- Metric A: use the certified measure
- Never narrate from measures listed as unsafe
```

**The execution layer.** The Power BI remote MCP server runs the query in GitHub Copilot; [Fabric IQ](https://learn.microsoft.com/en-us/fabric/iq/overview) runs it in Cowork.

## One brain, three front doors

I shipped it first as the GitHub Copilot custom agent. The first practical question was, "Great, how do I use this without opening an IDE?"

It has three front doors:

- The [GitHub Copilot custom agent](https://code.visualstudio.com/docs/agent-customization/custom-agents) in VS Code, with the full set of MCP servers.
- A plugin for [Microsoft 365 Copilot Cowork](https://learn.microsoft.com/en-us/microsoft-365/copilot/cowork/), which uses [Fabric IQ](https://learn.microsoft.com/en-us/fabric/iq/overview) for Power BI access.
- A plugin for [Microsoft Scout](https://learn.microsoft.com/en-us/microsoft-scout/overview), an OpenClaw-like desktop app for Windows and macOS that acts across your files, shell, browser, and Microsoft 365. Scout supports a compatible agent-and-plugin shape built on the GitHub Copilot CLI, so I ported the Markdown files with few changes; the plugin adds the MCP servers the host does not ship.

The agent file and per-report prompt files form one canonical spec. A script generates the Scout desktop plugin from it by rewriting the front matter, re-anchoring file paths, and transforming the MCP configuration for that host. The Cowork edition reuses the same prompt files. These hosts are converging on the same basic shape: MCP for tools plus similar agent and skill formats. I can keep the host-specific glue small.

## Where it is going

Next, I plan to host it as a [Foundry hosted agent](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/hosted-agents). Foundry Agent Service can run a packaged agent on managed infrastructure that handles scaling and session state. I could publish a hosted version to Microsoft Teams and Microsoft 365 Copilot Chat, where people already work.

I also plan to add data sources and connect the analyst to daily workflows.

## Stuff I learned

**Institutional knowledge took most of the work.** A bare LLM can return a plausible but wrong number. I spent most of the effort writing down or referencing the institutional knowledge that makes an answer correct.

**"Show me the query" makes review concrete.** People do not trust a black box, and they are right not to. Letting someone inspect the filters and measures does more for trust than a claim about accuracy can.

**Static checks protect the contract today.** For relevant changes, CI checks that golden questions route to the right model, model files keep their required filters, known-bad measures stay quarantined, and safety sections remain intact. The checks need no credentials or live queries and run in seconds. They catch regressions before the analyst starts returning garbage.

**End-to-end trace evals are next.** The next tier will record real runs, check generated DAX for required filters, and trace each narrative number to a query result. I need unattended agent runs to build those evals, another reason to host it on Foundry.

**Adding another supported semantic model requires configuration.** It needs a registry entry, per-model guidance, and routing and eval cases. I wrote a `CONTRIBUTING.md` with step-by-step instructions and practices that make the process repeatable.

## Wrapping up

This is how I want data questions to work: ask in plain English, pull the answer from the right governed models, and keep the evidence attached. Each answer keeps its source, filters, and query attached for review.

If you are building something similar, I would love to compare notes on how you encode business rules and keep the work reviewable.