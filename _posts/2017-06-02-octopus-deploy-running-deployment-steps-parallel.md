---
id: 274
title: 'Octopus Deploy: Running deployment steps in parallel'
date: '2017-06-02T21:22:33+00:00'
author: Marcus
layout: post
guid: 'https://marcusfelling.com/?p=274'
permalink: /blog/2017/octopus-deploy-running-deployment-steps-parallel/
categories:
    - Uncategorized
---

When I first got started with [Octopus Deploy](https://octopus.com/) I would setup projects to have one long deploy process that ran steps in serial. Each step would wait until finished before another one would start. Deploy times got longer and longer, so I set out to find a way to cut down deploy times.

If there are 2 or more process steps, there is an option in subsequent steps to “Run in parallel with previous steps”, however this is still limiting. This means only 2 steps can be running in parallel at a time.

![](/content/uploads/2017/06/deploystepruninparrallel.png)

To take this a step further, I wanted to setup deploy groups that could all run in parallel. This way deploy steps that run on different machines can be running at the same time. To do this, simply add a child step to any existing step:

![](/content/uploads/2017/06/addChildStep.png)

This will add a parent (Web Server, Database Server, etc). Create groups for each individual machine or role, then set the parent step’s start trigger to “Run in parallel with previous step”. The more groups you create, the more steps that will run in parallel.

![](/content/uploads/2017/06/parallelDeployGroupProcessResult.png)

If you’d like to run multiple steps per tentacle (be careful, things can get messy here), you can enable multiple processes to run on a tentacle simultaneously. Octopus Deploy has instructions here: <https://octopus.com/docs/how-to/run-multiple-processes-on-a-tentacle-simultaneously>