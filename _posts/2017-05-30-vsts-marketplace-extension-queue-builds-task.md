---
id: 249
title: 'VSTS Marketplace Extension: Queue Build(s) Task'
date: '2017-05-30T23:31:56+00:00'
author: Marcus
layout: post
guid: 'https://marcusfelling.com/?p=249'
permalink: /blog/2017/vsts-marketplace-extension-queue-builds-task/
wpmdr_menu:
    - '1'
categories:
    - Uncategorized
---

Currently the TFS/VSTS build system has a pretty big bottleneck: tasks run in serial. For build steps that run PowerShell, I’ve implemented runspaces to run processes in parallel ([Invoke-Parallel](https://gallery.technet.microsoft.com/scriptcenter/Run-Parallel-Parallel-377fd430) is amazing). However, that only works for one build step. The rest have to wait until it’s finished.

Enter [Queue Build(s) Task](https://marketplace.visualstudio.com/items?itemName=jb.queue-build). This extension sounds pretty simple, right? Queue a build as part of a build…. But it has potential to do much more. It has the ability to use configurations (JSON) to pass variables from the build that’s queuing other builds, including [system variables](https://www.visualstudio.com/en-us/docs/build/define/variables) (source branch name, build id, build name, etc.).

[![vsts marketplace extension](/content/uploads/2017/05/queueabuildconfiguration.png)](/content/uploads/2017/05/queueabuildconfiguration.png)

In theory, this means you could break down any build into multiple builds to run each in parallel with multiple build agents. This also means you can create a wrapper build that queues a bunch of builds so you don’t have to manually queue them.

Hopefully the VSTS team will eventually implement parallel tasks, but for now this serves as a good workaround.

**Update:** The VSTS team is planning on adding the ability to run tasks in parallel: <https://visualstudio.uservoice.com/forums/330519-team-services/suggestions/13481574-add-ability-to-run-build-steps-in-parallel>