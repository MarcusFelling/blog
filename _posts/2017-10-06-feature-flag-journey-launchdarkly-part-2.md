---
id: 432
title: 'Feature Flag journey with LaunchDarkly  Part 2'
date: '2017-10-06T20:28:39+00:00'
author: Marcus
layout: post
guid: 'https://marcusfelling.com/?p=432'
permalink: /blog/2017/feature-flag-journey-launchdarkly-part-2/
thumbnail-img: /content/uploads/2017/10/LaunchDarklyLogo-1-300x89.png
wpmdr_menu:
    - '1'
categories:
    - Uncategorized
nav-short: true
---


I previously posted about how I discovered LaunchDarkly and wanted to introduce it at my current employer. See Part 1 [here](https://marcusfelling.com/blog/2017/feature-flag-journey-launchdarkly/). Our pilot with LaunchDarkly went great. So great that we purchased a subscription.

The product will help give us fine grained control over who will see particular features: internal vs external users; particular clients; groups of users; a percentage of randomized users/clients (canary model), and so on. This has some very significant potential benefits, including:

## Risk Mitigation

### Gradually roll out new features and turn off poorly performing features instantly

- **Reducing risk for Production deployments.** Features can be decoupled from the deployment itself. New features can be deployed to production turned off, then turned on for a group of testers before releasing the new feature into the wild.
- **Reducing the investment in UAT:** because features can now be included in releases but enabled in production at different times, it allows for a less “all-or-nothing” approach to UAT, which extends the time-frame of launches as specific blocking features need to sometimes have multiple issues addressed.

## Feature personalization

### Reducing the IT investment in infrastructure

- **Beta features:** rather than potentially having to support two parallel prod environments for beta/current parallel paths, all code can be deployed to a single prod environment, with feature switches used to determine visibility of beta features.
- **Blue/Green production environments:** 2 production environments will not be necessary to reap the benefits of a [blue/green setup](https://martinfowler.com/bliki/BlueGreenDeployment.html).

## Empowered Product Development and Shortening the feedback loop between customers &amp; development

Allowing for the running of true beta cycles, whereby feature visibility can be simply managed in a dashboard by Product, rolled out to customers in a controlled fashion, requiring much less ongoing coding and deployment work for Development and Infrastructure to support multiple paths and release chains.