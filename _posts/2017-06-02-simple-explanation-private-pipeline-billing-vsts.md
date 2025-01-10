---
id: 230
title: 'A simple explanation of private pipeline billing in VSTS'
date: '2017-06-02T21:23:26+00:00'
author: Marcus
layout: post
guid: 'https://marcusfelling.com/?p=230'
permalink: /blog/2017/simple-explanation-private-pipeline-billing-vsts/
wpmdr_menu:
    - '1'
categories:
    - Uncategorized
---

**Update: Unlimited private pipelines are now free for Build!!**

Microsoft caused a lot of confusion when they announced that you will need to pay to run private build agents, since this was free in TFS. Why should we have to pay to use our own server resources to run a build agent?!? You can see the outcry in the reviews on the Marketplace: 1.7/5 stars: <https://marketplace.visualstudio.com/items?itemName=ms.build-release-private-pipelines#review-details>

Once I fully understood how and why the billing is setup this way, I wasn’t as frustrated.

**What is a private pipeline?**

A pipeline can be thought of as both build and deploy activities for a release. You can have multiple build agents installed, but only 1 can be running at a time with 1 pipeline. Purchasing pipelines simply enables concurrency so that you can have more than one agent running at the same point in time. You can install unlimited build agents, but you’ll be restricted as soon as the number of agents running exceeds the amount of pipelines you’ve purchased.

My understanding is that this was setup to simplify billing for Release Management. Both build and deploy activities are part of a pipeline. So you’re basically just paying to use Release Management if you use private build server(s).

Ed Blankenship mentioned on [RadioTFS](http://www.radiotfs.com/Show/139/AtBuildwithEdBlankenshipChattingAboutTFSMigration) that if Microsoft was to purchase private pipelines, they would only need ~35.