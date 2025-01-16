---
id: 627
title: 'Azure Release Pipelines: What releases havent been deployed to Production yet?'
date: '2019-01-15T00:46:28+00:00'
author: Marcus
layout: post
guid: 'https://marcusfelling.com/?p=627'
permalink: /blog/2019/azure-release-pipelines-what-releases-havent-been-deployed-to-production-yet/
wpmdr_menu:
    - '1'
thumbnail-img: /content/uploads/2019/01/Azure-Release-Pipelines-1.jpg
categories:
    - Uncategorized
---


The filtering options on the release pipeline dashboard leave a lot to be desired. As the number of definitions and releases grow, it gets harder and harder to have overall visibility across releases. Currently there isn’t a great reporting solution that can be used to gather such info.

1. SSRS, data warehouse and SQL Server Analysis Services cube all went away with Azure DevOps Services.
2. [Analytics Service](https://docs.microsoft.com/en-us/azure/devops/report/analytics/what-is-analytics?view=vsts) is still in public preview and we have no idea how much it’s going to cost.

What does that leave us with? Manually clicking into 100’s of release definitions to figure out where they’re at in the pipeline **OR** the Azure DevOps Services REST API. As you probably could have guessed, I don’t like to do things manually 🙂

I set up the following PowerShell script to be executed in a release pipeline. The result is an an HTML report that’s sent via email. The report contains a list of releases that have been successfully deployed to a “QA” environment, but not yet deployed to a “Prod” environment. I’ll let the comments do the talking. Feel free to drop a line in the comment section if you have any questions.

<script src="https://gist.github.com/MarcusFelling/a5152cfd1c3ba9b73d71e3da03f918e1.js"></script>