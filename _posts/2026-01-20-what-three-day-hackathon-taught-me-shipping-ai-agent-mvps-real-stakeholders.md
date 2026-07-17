---
id: 1276
title: 'Shipping an AI Agent MVP: What Worked'
date: '2026-01-20'
description: 'Shipping an AI Agent MVP: What Worked'
layout: post
guid: 'https://marcusfelling.com/?p=1276'
permalink: /blog/2026/three-day-hackathon-shipping-ai-agent-mvps
thumbnail-img: /content/uploads/2026/01/ai-hackathon-mvp.webp
nav-short: true
tags: [AI]
---

I led a three-day hackathon to build an AI solution that streamlines monthly business reviews for our Microsoft direct-sales ecommerce store, including Surface devices, Microsoft 365, and Xbox. Our team had spent too much time on high-level planning. The hackathon gave us three days to move from planning to execution.

Our team builds on [Microsoft Fabric](https://learn.microsoft.com/en-us/fabric/fundamentals/microsoft-fabric-overview), a data analytics SaaS platform. Microsoft announced [Fabric IQ](https://learn.microsoft.com/en-us/fabric/iq/overview), including Ontology and Data Agents, before the hackathon, so we tested those capabilities in a real scenario.

---

## TL;DR

- **Start with the business problem**
- **Cut scope to a useful MVP**
- **Use a simple delivery path for the first test**
- **Break big agents into smaller**, more focused sub agents
- **Engage stakeholders** throughout the process
- **Test often** and iterate fast

## Begin With a Clear Business Problem

We began by defining the problem. Before the hack, we listed candidate use cases and chose monthly business review preparation: analyzing KPI shifts and writing narratives. The team spends hundreds of hours on this work each month. We used that scope to identify what needed automation and what an AI agent could deliver in three days.

Stakeholders asked us to spot the biggest KPI moves, connect those changes to contextual factors, and provide concise summaries for leadership review. We used those requirements to prioritize KPI analysis and commentary prototypes.

## Reduce Scope and Create a Practical MVP

We needed a way for stakeholders to receive the agent's output. For the MVP, we scheduled insight generation and delivered the result by email. Email put outputs in stakeholders' hands fast, so they could validate the content before we invested in a polished interface.

We also chose tools we knew. Logic Apps orchestrated the Fabric data agents, passed outputs as variables, and merged them into the final email. Learning Copilot Studio or AI Foundry and setting up their environments would have consumed most of the three-day hackathon.

## Break Big Agents Into Smaller, More Focused Sub Agents

We started with a plan for two big agents: one for KPI analysis and one for writing narratives. As we added data sources, their accuracy turned to slop. We split them into specialized subagents with narrow scopes. We stripped out tables and measures we didn't need, cleaned up the filtering logic, and set the agents to use narrower data sources. Narrowing the scope this way stabilized the output and improved accuracy. The prototype grew to six specialized agents.

### Lessons Learned: Fabric Data Agents

Fabric data agents sometimes generated incorrect DAX or referenced tables and columns outside their scope. We responded with four practices:

> **Good Practices for Fabric Data Agents:**
> 
> - Keep the semantic model and its custom DAX measures clear
> - Use the [Prepare your data for AI](https://learn.microsoft.com/en-us/power-bi/create-reports/copilot-prepare-data-ai) tool on the published semantic model
> - Select the essential measures and tables when creating the agent
> - Provide explicit instructions to the agent about when it should perform its own calculations

## Engage Stakeholders Throughout the Process

Stakeholders reviewed the work throughout the hackathon, which shortened the feedback loop. They told us which KPI moves mattered, how they wanted the summaries written, and what context was missing. Their early feedback kept us from building features nobody wanted and let us adjust the prototypes during the hackathon.

---

## Closing Thoughts

In three days, we tested AI agents against a real monthly-review workflow. A clear problem and tight scope let us ship a working prototype. Stakeholder feedback guided each adjustment.

The three-day prototype gave us the starting point for the solution we continued to build.
