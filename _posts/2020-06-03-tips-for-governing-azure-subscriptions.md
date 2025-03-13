---
id: 881
title: 'Tips for governing Azure subscriptions'
date: '2020-06-03T15:54:49+00:00'
layout: post
guid: 'https://marcusfelling.com/?p=881'
permalink: /blog/2020/tips-for-governing-azure-subscriptions/
thumbnail-img: /content/uploads/2020/06/RentInTheCloudTooHigh.png
nav-short: true
tags: [Other]
---

I’ve seen it too many times. It all starts when somebody is given access to a new “production” Azure subscription that’s pay-as-you-go. A new resource is created for the first time on a Friday, running up costs over the weekend, resulting in a surprisingly large bill. The cloud is too expensive!

To help prevent these types of scenarios and do our best to have a predictable Azure bill, we can configure our subscriptions with the following tips in mind.

## Use Free Azure Credits

Allow developers to use their free Azure credits included with their Visual Studio subscriptions (no credit card required). Developers should be using this as their playground to learn and experiment. When you reach the monthly cap for your credits, your Azure services will stop until your next monthly credits are added. This is up to $150 a month for some subscriptions. [More info here](https://azure.microsoft.com/en-us/pricing/member-offers/credit-for-visual-studio-subscribers/).

## Setup Management Groups

Setup [Management groups](https://docs.microsoft.com/en-us/azure/governance/management-groups/create) for Non-Production and Production to keep them segmented. Put policies on each so that when you create a subscription and dump it into a group, it inherits all of the policies and things you’ve setup for them.

## Restrict Production Access

Do not allow your developers access to deploy directly to production. Nothing should be manually setup in production for the first time. Everything should be deployed through a CI/CD pipeline. The pipeline should provide governance and quality gates to the production resources. For Azure Pipelines you can use controls like: [pipeline](https://docs.microsoft.com/en-us/azure/devops/pipelines/policies/permissions?view=azure-devops), [service connection](https://docs.microsoft.com/en-us/azure/devops/pipelines/policies/permissions?view=azure-devops#service-connection-security-roles), and [agent pool](https://docs.microsoft.com/en-us/azure/devops/pipelines/agents/pools-queues?view=azure-devops&tabs=yaml%2Cbrowser#security) permissions, and [approvals and checks](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/approvals?view=azure-devops&tabs=check-pass) to require manual approvals or templates on production resources.

## Setup Budgets

Setup [budgets ](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-acm-create-budgets)for development and test environments to prevent overspend. These environments should not contain “production” resources, so you can shut them down once the budget is reached. After the fact, analyze unexpected charges, identify ways to optimize costs, or increase budget. [Alerts](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/cost-mgt-alerts-monitor-usage-spending) can be setup to notify you when spending exceeds a certain amount.

## Use ARM Policies

Setup Azure resource manager [policies ](https://docs.microsoft.com/en-us/azure/governance/policy/overview)to restrict the creation of certain resources, like large VM sizes. Policies can also be setup to do things like shutdown all VM’s at night, unless they’re part of an exclusion list.

## Azure DevTest Labs

Consider using [Azure DevTest Labs](https://azure.microsoft.com/en-us/services/devtest-lab/) to provision development and test environments, setting [lab policies](https://docs.microsoft.com/en-us/azure/lab-services/devtest-lab-set-lab-policy) to only allow certain VM sizes and auto shutdown policies.

This list is by no means comprehensive. Hopefully you’re already doing most of this, but found a tip or two to be helpful.