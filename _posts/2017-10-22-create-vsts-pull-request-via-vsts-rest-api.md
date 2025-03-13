---
id: 454
title: 'Code Sharing (PowerShell): Create Pull Request via VSTS REST API'
date: '2017-10-22T20:29:36+00:00'
layout: post
guid: 'https://marcusfelling.com/?p=454'
permalink: /blog/2017/create-vsts-pull-request-via-vsts-rest-api/
thumbnail-img: /content/uploads/2017/10/VisualStudioGit.png
nav-short: true
tags: [Azure DevOps, CICD]
---


This past week I started concentrating on optimizing our release processes. I’ve talked about how our team uses VSTS and Git in a [previous post](https://marcusfelling.com/blog/2017/gitflow-visual-studio-team-services/). At the end of a sprint, pull requests are created in all of our repositories to merge to the release branches. As the number of our repositories continues to grow, the number of manual steps to merge for releases grows exponentially. Having worked with the VSTS REST API in the past I knew this wouldn’t be difficult to automate. A build would be run that runs the script below for each of our repositories to create pull requests. [Service hooks](https://docs.microsoft.com/en-us/vsts/service-hooks/overview) to Slack would then send notifications so the necessary reviewers can approve the newly created pull requests. This same script can be used post release to merge back to Master branches. I commented on every line of code in the script below so I didn’t have to go into details here 🙂

<script src="https://gist.github.com/MarcusFelling/6f4b05470d49d3afa422a4bc3f2a8f0a.js"></script>