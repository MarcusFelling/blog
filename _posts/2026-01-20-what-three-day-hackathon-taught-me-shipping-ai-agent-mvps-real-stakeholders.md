---
id: 1276
title: 'Shipping an AI Agent MVP: What Actually Worked'
date: '2026-01-20'
description: 'Shipping an AI Agent MVP: What Actually Worked'
layout: post
guid: 'https://marcusfelling.com/?p=1276'
permalink: /blog/2026/three-day-hackathon-shipping-ai-agent-mvps
thumbnail-img: /content/uploads/2026/01/ai-hackathon-mvp.png
nav-short: true
tags: [AI, Fabric]
---

## Introduction

I recently led a 3 day hackathon to build an AI solution that streamlines our monthly business reviews for our Microsoft direct to consumer ecommerce store (think Surface devices, M365, Xbox). Our team had been spending way too much time talking at high levels and planning what to build; this was an opportunity to dive in and start executing. In this post I'll summarize the practical lessons learned from the experience.

To set some context, our team builds on [Microsoft Fabric](https://learn.microsoft.com/en-us/fabric/fundamentals/microsoft-fabric-overview) (data analytics SaaS platform) which recently announced [Fabric IQ](https://learn.microsoft.com/en-us/fabric/iq/overview) that included new features/capabilities such as Ontology and Data Agents, so the timing worked out great to kick the tires on what's actually possible in practice.

## TL;DR

- Start with the real problem, not the tools.
- Cut scope ruthlessly and ship something valuable, not everything.
- Keep the delivery simple while you're figuring out if it even works.
- Break big agents into smaller, more focused sub agents.
- Engage stakeholders throughout the process.
- Test often and iterate fast.

## Begin With a Clear Business Problem

Instead of jumping straight into tool selection, we focused on understanding the problem first. Before the hack, we had a brainstorming session to come up with a list of high impact use cases we could tackle. We landed on preparing monthly business reviews, specifically, analyzing KPI shifts, and writing up narratives. This takes our team a lot of time (hundreds of hours) and a lot of it gets repeated every single month. That helped us figure out what actually needed automating and what value an AI agent could realistically add in three days.

When we talked to stakeholders, they were pretty clear about what they needed: spot the biggest KPI moves, connect those changes to contextual factors, and provide concise summaries for leadership review. Those requirements told us which agent capabilities actually mattered and confirmed that building KPI and commentary prototypes was worth the effort.

## Reduce Scope Early and Create a Practical MVP

There are a ton of options when it comes to user experience and how stakeholders would interact with our agents. To keep it simple, we decided the MVP would generate insights on a schedule and deliver them by email. It was more important that we get the outputs in the hands of the stakeholders ASAP to provide feedback and validate, than spend a bunch of time on a polished interface that provided garbage outputs.

From a tooling perspective, this allowed us to leverage tools we already had experience with to move fast: we chose Logic Apps to orchestrate Fabric data agents, passing outputs as variables, and merging them together to send the final email. There was quite a learning curve that came with ramping up on AI native orchestrators (Copilot Studio, AI Foundry, etc.) and environment setup, that just wasn't realistic for a 3 day timeline.

## Break big agents into smaller, more focused sub agents

We started with a plan for two big agents: one for KPI analysis, one for writing narratives. As we threw more and more data sources at our agents, we found their accuracy turned to slop. We moved to finely scoped sub agents that were specialized for their tasks. We stripped out tables and measures we didn't need, cleaned up the filtering logic, and set the agents to use narrower data sources. Those tweaks stabilized things and made sure each piece was actually doing what it was supposed to do. When we split up the work and trimmed unnecessary complexity from the agents, accuracy went way up. 

Specific to Fabric data agents, we experienced issues like using incorrect DAX queries and tables/columns that weren't even in scope. To overcome this, we implemented a few practices:

- Keep the Semantic Model as clear as possible, especially custom DAX measures.
- Use the [Prepare your data for AI](https://learn.microsoft.com/en-us/power-bi/create-reports/copilot-prepare-data-ai) tool on the published semantic model.
- Select only the essential measures and tables when creating the agent.
- Provide explicit instructions to the agent about when it should perform its own calculations.

## Engage Stakeholders Throughout the Process

Having stakeholders involved throughout the hackathon was extremely valuable. This helped us continuously validate what we were building and speed up the feedback loop. Which KPI moves actually mattered, how they wanted the summaries written, and what context was missing, etc. Bringing them in early meant we didn't waste time building stuff nobody wanted. We could pivot fast based on what they told us.

## Closing Thoughts

Three days gave us a chance to see what AI-powered agents could actually do. And honestly, it showed that with a tight timeline, you can still ship something real if you nail the problem, keep scope tight, and iterate like crazy.

Since the hackathon, we've come a long way with our solution but this gave us a jump start on the work.
