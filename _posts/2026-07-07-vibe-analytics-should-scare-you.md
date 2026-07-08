---
id: 1289
title: 'An AI Analyst That Shows Its Work'
date: '2026-07-07'
description: 'A natural-language analyst that routes plain-English questions to the right governed model, applies the filters people would forget, runs the query under your identity, and shows its work. The twist: most of it is not AI. The real product is institutional knowledge, written down as markdown.'
excerpt: 'A natural-language analyst that routes plain-English questions to the right governed model, applies the filters people would forget, runs the query under your identity, and shows its work.'
layout: post
guid: 'https://marcusfelling.com/?p=1289'
permalink: /blog/2026/ai-analyst-that-shows-its-work
thumbnail-img: /content/uploads/2026/07/ask-not-dashboard.webp
nav-short: true
tags: [AI, Power BI, Fabric, GitHub Copilot]
---
To set some context:

- [Vibe coding](https://en.wikipedia.org/wiki/Vibe_coding) is Andrej Karpathy's term, from a February 2025 post: you describe what you want, the AI writes the code, and, in his words, you "Accept All" and stop reading the diffs.
- [Vibe analytics](https://mitsloan.mit.edu/ideas-made-to-matter/working-definitions/what-is-vibe-analytics) is the same idea pointed at data. MIT Sloan's Michael Schrage calls it vibe coding's cousin: ask a question in plain English and take the answer. That is the part worth questioning. A wrong number looks exactly like a right number, right up until someone acts on it in a leadership meeting.

With this in mind, I built an AI analyst that shows its work. You can ask a business question or generate a briefing; it pulls data across relevant models, grades each area against a performance framework, and writes an actual decision brief: what happened, why it matters, and what to do about it, ending in a ranked action list with owners. This started as a side project around 3 months ago and turned out useful enough that people started using it across our org. It is far enough along now that I want to talk about how it works.

Some context for anyone reading from outside my world: I work at Microsoft, on the analytics team behind the direct-to-consumer Microsoft Store (Microsoft.com), where we sell Surface, Xbox, and Microsoft 365. We aren't short on data. However, it can be a pain in the ass to find where the data lives, stitch it together across a bunch of reports and one-off spreadsheets, and then craft a story out of it.

The goal was not to replace the reports or the analysts. It is to make the trusted layer, built on our Microsoft Fabric gold layer, easier to use, cut the manual stitching, capture the tribal knowledge that makes a number trustworthy, and give us more time to actually make decisions.

## Using it

Three sizes of question, one place to ask.

**Small: a single metric.** "What were X gross sales yesterday?" It picks the right data source/model and hands you the number.

**Medium: a health check.** One command gets you a cross-source briefing (revenue, traffic, operations, inventory, promotions, sentiment, etc.), each line flagged red, yellow, or green against a threshold. "Is anything on fire right now," on one screen.

**Large: an executive readout.** One prompt and it pulls data across every relevant model, grades each area against a performance framework, and writes an actual decision brief: what happened, why it matters, and what to do about it, ending in a ranked action list with owners.

That last one is the kind of readout that could eat up a ton of analyst hours: open a stack of reports, wrangle them into a narrative, reformat for leadership, etc. Now it comes back in a couple of minutes with its sources attached. Every answer, at every size, can show you the exact query behind it, because "trust me" is not a feature.

Here is what that looks like. Ask a plain-English question and the number comes back with its receipt, the source, filters, and period it used:

> **you:** what were Americas web store sales for Q3 quarter-to-date?
>
> **analyst:** Americas Q3-QTD gross sales were **$X.XM**.
> _Source: web store sales model | Filters: Region = Americas, Channel = Direct, Data = Actuals | Period: FY26-Q3 QTD_

Type `show dax` and it hands back the query it ran (real table and measure names swapped out here):

```dax
EVALUATE
ROW( "Gross Sales",
    CALCULATE(
        [Revenue],
        'Geography'[Region] = "Americas",
        'Calendar'[Quarter] = "FY26-Q3"
    )
)
```

## How it actually works

Most of it is not AI. That is the interesting part.

I currently support 3 agent tools/experiences (GitHub Copilot, Copilot Cowork, and MS Scout). It started out as a [GitHub Copilot custom agent](https://code.visualstudio.com/docs/agent-customization/custom-agents) wired up with several [MCP servers](https://code.visualstudio.com/docs/copilot/chat/mcp-servers). [MCP](https://modelcontextprotocol.io/docs/getting-started/intro), the Model Context Protocol, is the open standard that lets an agent talk to external tools in a consistent way.

### The MCP servers

- The core is [Power BI's remote MCP server](https://learn.microsoft.com/en-us/power-bi/developer/mcp/remote-mcp-server-get-started) (in preview). It keeps two steps apart: generating a [DAX](https://learn.microsoft.com/en-us/dax/) query from a plain-English question, and executing DAX against a [semantic model](https://learn.microsoft.com/en-us/power-bi/connect-data/service-datasets-understand) under your identity. A one-off question gets a query generated on the spot, inside the guardrails the cheat sheet sets: the right measures, the required filters. The bigger briefings skip generation and run pre-written DAX straight from the cheat sheets.
- Some servers suppliment the experience:
    - Azure DevOps: filing a bug when something looks broken
    -  ([Web IQ](https://webiq.microsoft.ai/)): fetching external market intelligence
    - [Work IQ](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/work-iq/): brings in the work context around the numbers. It is Microsoft 365's intelligence layer over your mail, meetings, files, and chats. It pulls that context together for the agent instead of making me stitch it in by hand, so a narrative can put a metric next to what a recent business review actually said about it. Like the Power BI server, it runs scoped to your identity, so it only reaches what you can already see (e.g. meeting recordings).

### The governed model

The part that makes any of this trustworthy is not the llm, it is the governed semantic model it queries: each one encodes certified business logic, the measures, the agreed definitions of things like revenue and conversion, and the row-level security that decides who sees which slice. It is the shared source of truth, and it is what separates a number you can act on from one that merely looks right. In a medallion architecture, data lands raw (bronze), gets cleaned and conformed (silver), then is shaped into business-ready governed tables (gold), which is the tier you actually let people report on. My team's semantic models live on our Microsoft Fabric gold layer. What I built is a thin natural-language layer that sits on top of these models and queries them in place.

### The main components

**The agent file.** Routing, workflow, and every mode/command.

**A model registry.** A lookup from each report to its exact workspace and dataset IDs. Once routing has picked a model, the registry resolves the target up front, so the agent never wanders around discovering what exists at runtime.

**Per-model cheat sheets.** One prompt file per report, in plain markdown, encoding the institutional knowledge: which filters have to go on every single time, which measures are named inconsistently across tables, which dimension value looks like a total but is not, and which measures are quietly wrong and must never feed a narrative. This is the actual product. The LLM is just the thing that reads it.

**The execution layer.** Where the query runs: the Power BI remote MCP server in GitHub Copilot, or [Fabric IQ](https://learn.microsoft.com/en-us/fabric/iq/overview) in the case of Cowork.

## One brain, three front doors

I shipped it first as the GitHub Copilot custom agent. The first question everyone asked was "great, how do I use this without an IDE or CLI?"

So it now has three front doors:

- The [GitHub Copilot custom agent](https://code.visualstudio.com/docs/agent-customization/custom-agents) in the editor, with the full set of MCP servers.
- A plugin for [Microsoft 365 Copilot Cowork](https://learn.microsoft.com/en-us/microsoft-365/copilot/cowork/), where Power BI access is backed by [Fabric IQ](https://learn.microsoft.com/en-us/fabric/iq/overview) rather than provided by a bundled MCP server.
- A plugin for [Microsoft Scout](https://learn.microsoft.com/en-us/microsoft-scout/overview), an OpenClaw like desktop app for Windows and macOS that acts across your files, shell, browser, and Microsoft 365. Scout supports a compatible agent-and-plugin shape (built on GHCP CLI), so the markdown files ported pretty cleanly; the plugin just adds the MCP servers the host does not already ship.

The domain knowledge has one source of truth. There is a single canonical spec, the agent file plus the per-report prompt files, and the editions are built from it. A script generates the Scout desktop plugin from that spec, rewriting the frontmatter, re-anchoring the file paths, and transforming the MCP config for the host. The Cowork edition reuses the very same prompt files. What makes this cheap is that the runtimes are converging on one shape: MCP for tools, and a skills-and-agent file format that is becoming a de facto standard. The knowledge drops into each host with a little glue.

## Where it is going

The next step is hosting it as a [Foundry hosted agent](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/hosted-agents). Foundry Agent Service lets you package an agent as a container, bring your own code and framework, and runs it on managed infrastructure that handles scaling and session state. This can be published to Microsoft Teams and Microsoft 365 Copilot Chat, which is the "meet people where they already are" problem from the last section, solved at the platform level.

After that, the roadmap is to add more data sources, and deeper embedding into the workflows people already move through every day.

## Stuff I learned

**The AI was the easy part.** Drop an LLM on your data and you get a confident, plausible, occasionally very wrong number. The hard and valuable work was writing down or being able to reference the tribal knowledge that makes an answer correct; that is the moat.

**"Show me the query" helps skeptics.** People do not trust a black box, and they are right not to. Letting anyone pop the hood and check the filters and measures converted skeptics faster than any claim I could make about accuracy.

**Evals keep it honest.** Relevant changes run a batch of cheap static checks: do the golden questions still route where they should, do the checked per-model cheat sheets still apply their required filters, are the known-bad measures still quarantined, are the safety sections intact. No credentials, no live queries, runs in seconds. It is the difference between "move fast" and "move fast and start returning garbage." The next tier is more thorough: record real runs and check the agent's actual output, that the generated DAX keeps its filters and that every number in a narrative came from a query result, not the model. That one needs the agent running unattended, which is part of why I want it hosted on Foundry.

**Adding a new data source should be simple.** A new data source is a new cheat sheet, not a rebuild. I crafted a contributing.md that contains step by step instructions and best practices to make this repeatable.

## Wrapping up

So that is the whole thing: ask a business question in plain English, and it routes to the right governed model, runs the query under your identity, and shows its work when you ask. It runs in three places from one spec, and most of what makes it trustworthy is not the AI, it is the institutional knowledge written down as markdown.

Thanks for reading. If you are poking at the same problem, I am always up for comparing notes.