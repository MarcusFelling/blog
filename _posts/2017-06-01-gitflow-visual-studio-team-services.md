---
id: 261
title: 'Gitflow and Visual Studio Team Services'
date: '2017-06-01T23:35:59+00:00'
layout: post
guid: 'https://marcusfelling.com/?p=261'
permalink: /blog/2017/gitflow-visual-studio-team-services/
nav-short: true
tags: [Azure DevOps, CICD, Git]
---

This last year our team made the decision to move from Team Foundation Version Control (TFVC) to Git.

This decision was made for various reasons:

1. Branching is lightweight, enabling us to merge more frequently, creating less conflicts.
2. It’s distributed (vs. central). Commits can be made on your own computer, without relying on network access.
3. It’s cross platform, which means all of our codebases can use the same Git server.
4. **Gitflow**.

If you aren’t already familiar with Gitflow, I’ll let the creator Vincent Driessen [explain](http://nvie.com/posts/a-successful-git-branching-model/). I’d like to explain how to get the most out of Gitflow using VSTS.

**Pull Requests**

VSTS provides a very intuitive pull request experience similar to [Github](https://help.github.com/articles/about-pull-requests/). Pull requests are a collaborative process that let your team discuss changes in a branch and agree to merge them once everyone approves. VSTS has branch policies that can be setup to define required criteria before a pull request can be completed. The policies can be configured to best fit your team and will be different for everyone. I would suggest setting policies on the long running branches, develop and master.

Branch policies can be found here: https://*ExampleAccountName*.visualstudio.com/*ProjectName*/\_admin/\_policies

Some examples of policies to enforce:

Minimum # of reviewers. This comes down to preference.

![](/content/uploads/2017/06/minNumberofApprovers.png)

Enforce a work item to be linked to the pull request. This really helps tractability when digging through history.

![](/content/uploads/2017/06/checkForLinkedWorkItems.png)

Set up a build to be triggered when a pull request is submitted. I recommend setting up CI builds that run unit tests to ensure the code compiles and passes tests before it is merged. If the build fails, the pull request cannot be completed (yes you can override policies).

![](/content/uploads/2017/06/buildpolicy.png)

Have subject matter experts in different parts of the code base? This is where you’d setup the policy to require certain reviewers based on the code that has changed.

![](/content/uploads/2017/06/codereviewers.png)

Once the policies are setup, developers can start working on topic branches, deploying, and testing their changes. Once they’re ready to merge their changes into the main line, they create a pull request. The team collaborates on the changes, ensure they all agree, then complete the pull request when they’re ready.

**Tweaking the Gitflow process to enable more automation**

One of the downsides to using branch policies is that they have to be manually setup for short lived branches. I created a [PowerShell script](https://github.com/MarcusFelling/PowerShell/blob/master/TFS_CreateBranchPolicies.ps1) that uses the TFS/VSTS RESTful API to create new policies which I setup to be run via build that I would trigger after creating a new release branch. This worked pretty well, but I also wanted to setup CI for the release branches, which also need to be manually configured. I found a workaround by modifying the Gitflow process; change the release branches from short lived (release/v0.1) to long running (similar to develop and master). There really isn’t any benefit to cutting a new release branch off of develop when you can just create a pull request to merge the changes. This change allows us to setup CI in the build definitions for the release branch, without having to edit build definitions every time a release branch is cut.