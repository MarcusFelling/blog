---
id: 1276
title: What a Three Day Hackathon Taught Me About Shipping AI Agent MVPs for Real Stakeholders
date: '2026-01-20'
description: 'What a Three Day Hackathon Taught Me About Shipping AI Agent MVPs for Real Stakeholders'
layout: post
guid: 'https://marcusfelling.com/?p=1276'
permalink: /blog/2026/three-day-hackathon-shipping-ai-agent-mvps
thumbnail-img: /content/uploads/2026/01/ai-hackathon-mvp.png
nav-short: true
tags: [AI]
---

## Introduction

Our team recently wrapped up a three day sprint to see if AI-powered reporting agents could help us cut down on manual work and get insights out faster. We built two prototype agents to handle KPI analysis and write up some initial commentary. This post walks through what we learned from the experience—the good, the rough spots, and the key takeaways from our hack sessions.

The timing was perfect too. New Fabric IQ capabilities around data agents, orchestration, and context just dropped, so we got to kick the tires on what's actually possible in practice.

## Begin With a Clear Business Problem

We started by identifying a real pain point. Preparing performance reviews, analyzing KPI shifts, and writing up narratives takes a lot of time—and a lot of it gets repeated every single month. Instead of jumping straight into tool selection, we focused on understanding the problem first. That helped us figure out what actually needed automating and what value an AI agent could realistically add in three days.

When we talked to stakeholders, they were pretty clear about what they needed: spot the biggest KPI moves across different categories, connect those changes to actual events or promotions, and give leadership a quick summary. Those requirements told us which agent capabilities actually mattered and confirmed that building KPI and commentary prototypes was worth the effort.

## Reduce Scope Early and Create a Practical MVP

With only three days on the clock, keeping scope tight was non-negotiable. Stakeholders had a wish list of metrics and context layers, but we couldn't do it all at once. So we picked one achievable goal: automatically generate insights and email them out. Plus, we learned during the sessions that some users couldn't run agents directly anyway—they needed the results scheduled and delivered to them.

By keeping it simple, we got the whole pipeline working end-to-end before we started polishing. More interactive features can come later, but at least we had a solid foundation to build on.

## Evolve from Two Agents to a More Structured Set of Components

We started with a plan for two big agents—one for KPI analysis, one for writing narratives. But as we looked at what we were getting back and what stakeholders actually wanted, it became obvious that breaking it down into smaller, more focused pieces worked better. That's exactly what we found during testing too. When we split up the work and trimmed unnecessary complexity from the model, accuracy went way up. 

TODO: approaches to referencing data: semantic model prep for AI vs. lakehouse

We stripped out tables and measures we didn't need, cleaned up the filtering logic, and set the agents to use narrower data sources. Those tweaks stabilized things and made sure each piece was actually doing what it was supposed to do.

## Engage Stakeholders Throughout the Process

Having stakeholders involved the whole way through was huge. They kept telling us which KPI moves actually mattered, how they wanted the summaries written, and what context was missing. They also walked us through their workflow—when monthly reviews happen, how everything flows into their existing process—all the stuff that matters when you're building something people actually use.

Bringing them in early meant we didn't waste time building stuff nobody wanted. We could pivot fast based on what they told us.

## Iterate Quickly to Improve Accuracy and Output Quality

Every time we got output back, we'd review it and compare it to what we expected. We ran through multiple test cycles. The team dug into the KPI math, spotted differences between regions, and made sure the narratives actually made sense. The agents needed tweaks too—better handling of filters, tighter context integration, cleaner metric relationships.

Running quick iteration cycles, we were able to mature the prototypes a ton in three days. Each pass fixed specific issues and made things clearer and more reliable.

## Key Lessons to Carry Forward

- Start with the real problem, not the tools.
- Cut scope ruthlessly and ship something valuable, not everything.
- Keep the delivery simple while you're figuring out if it even works.
- Break big agents into smaller, more focused pieces.
- Loop stakeholders in constantly—they'll tell you what matters.
- Test often and iterate fast.
- Play with new capabilities like Fabric IQ, but don't assume—actually build with them.

## Closing Thoughts

Three days gave us a chance to see what AI-powered agents could actually do for performance reporting. And honestly, it showed that with a tight timeline, you can still ship something real if you nail the problem, keep scope tight, and iterate like crazy. As Fabric IQ keeps improving, these principles are gonna be just as important for building stuff that people actually want to use.
