---
layout: post
title: "Simple Explanation Private Pipeline Billing VSTS"
date: 2017-01-01 12:00:00 -0500
categories: [VSTS, Billing, Pipelines]
---

In this post, we will provide a simple explanation of private pipeline billing in VSTS (Visual Studio Team Services). Understanding how billing works for private pipelines can help you manage your costs effectively and make informed decisions about your pipeline usage.

## What are Private Pipelines?

Private pipelines in VSTS are build and release pipelines that run on private agents. Private agents are machines that you manage and configure to run your builds and releases. Unlike hosted agents, which are managed by Microsoft, private agents give you more control over the environment and allow you to install custom software and dependencies.

## How is Billing Calculated for Private Pipelines?

Billing for private pipelines in VSTS is based on the number of parallel jobs you use. A parallel job is a single build or release job that runs at the same time as other jobs. The more parallel jobs you use, the higher your billing will be.

### Example

Let's say you have a VSTS account with 2 parallel jobs. This means you can run up to 2 build or release jobs simultaneously. If you need to run more than 2 jobs at the same time, you will need to purchase additional parallel jobs.

## Free Tier

VSTS offers a free tier that includes 1 free parallel job for private pipelines. This means you can run 1 build or release job at a time without incurring any additional costs. If you need more parallel jobs, you can purchase them as needed.

## Managing Costs

To manage your costs effectively, consider the following tips:

1. **Optimize Pipeline Usage**: Review your pipeline usage and identify opportunities to optimize your builds and releases. For example, you can combine multiple build steps into a single job or use conditional logic to skip unnecessary steps.

2. **Monitor Parallel Job Usage**: Keep track of your parallel job usage to ensure you are not exceeding your allocated parallel jobs. VSTS provides usage reports that can help you monitor your pipeline activity and identify any bottlenecks.

3. **Scale Up or Down as Needed**: Adjust the number of parallel jobs based on your current needs. If you have a temporary increase in pipeline activity, you can purchase additional parallel jobs for that period and scale down when the activity decreases.

## Conclusion

Understanding how private pipeline billing works in VSTS can help you manage your costs and make informed decisions about your pipeline usage. By optimizing your pipeline usage, monitoring parallel job usage, and scaling up or down as needed, you can effectively manage your pipeline costs and ensure you are getting the most value out of your VSTS account.
