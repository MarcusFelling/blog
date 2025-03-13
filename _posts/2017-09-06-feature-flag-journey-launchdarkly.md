---
id: 399
title: 'Feature Flag journey with LaunchDarkly  Part 1'
date: '2017-09-06T21:09:43+00:00'
layout: post
guid: 'https://marcusfelling.com/?p=399'
permalink: /blog/2017/feature-flag-journey-launchdarkly/
nav-short: true
tags: [Other]
---

At [DevOpsDays Minneapolis](https://www.devopsdays.org/events/2017-minneapolis/welcome/) I was the facilitator for an Open Space discussion (largest group of the day!!) on my proposed topic of “Release Management and Deploying to Prod Multiple Times a Day”. More on what an Open Space discussion is [here](http://www.openspaceworld.org/files/tmnfiles/2pageos.htm). I received a ton of really great feedback on my employer’s current processes and what we can do to move to a faster release cadence in the future. The TL;DR of the discussion was, use feature flags!

## What is a feature flag?

If you aren’t familiar, feature flagging is a way to control the visibility and on/off state of a particular feature by wrapping the code in a conditional. This can be done as a front-end flag, back-end flag, or both (front-end flags to control UI visibility, back-end flags can control APIs, configurations, etc.). When the new feature is deployed to lower environments it should be tested in both on and off states. When the feature is ready for production, it is dark launched (in the off state). It can then be rolled out to a percentage or group of users (tools like [LaunchDarkly](https://launchdarkly.com/) make this easy).

![kill switch for the internet](/content/uploads/2017/09/killSwitch-300x279.png)

## Speed up the feedback loop!

Our sprint teams would be able to change the definition of done to “Working In Production”. Features would be dark launched to Production throughout the sprint and once the product team is ready, they have access to a feature toggle dashboard to toggle the sprint’s features on/off. Again, LaunchDarkly provides user friendly dashboards for this vs. having to build our own. The value in all of this really comes down to speeding up the feedback loop. It would allow our team to iterate faster on changes that are made to production rather than calling it a sprint and starting new work, before the sprint’s production deployment is complete.

## More to come…

I signed up for a trial with LaunchDarkly and helped our dev team get started. We’ll be starting our pilot off by using the flags for two new features that are not operationally critical to the business. Looking forward to seeing how this works out!

[See Part 2 Here](https://marcusfelling.com/blog/2017/feature-flag-journey-launchdarkly-part-2/)