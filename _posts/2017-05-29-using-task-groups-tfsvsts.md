---
id: 232
title: 'Using Task Groups in TFS/VSTS'
date: '2017-05-29T15:32:13+00:00'

layout: post
guid: 'https://marcusfelling.com/?p=232'
permalink: /blog/2017/using-task-groups-tfsvsts/
wpmdr_menu:
    - '1'
categories:
    - Uncategorized
nav-short: true
tags: [Azure Pipelines, CI/CD]
---

When Microsoft announced [Task Groups](https://www.visualstudio.com/en-us/docs/build/concepts/library/task-groups) in TFS and VSTS, I couldn’t think of a practical use for them. When creating build definitions I always try to reduce the number of overall definitions by using prompted variables when possible, this way the user can modify the variable when queuing a build rather than duplicating a definition that has the same steps. Of course this doesn’t work well for things like working directory which warrant a separate build definition. This is where I found Task Groups shine.

When my team started creating microservices the number of build definitions to manage grew exponentially. This was a perfect fit for implementing Task Groups in order to make managing all of these definitions a lot easier. Need to change a build step argument? Update a single Task Group rather than each build definition. This saves a ton of time.

Here is what an example Task Group looks like:

![](/content/uploads/2017/05/TaskGroupDemo.png)

Use variables wherever the definitions will differ in each build step, then set their values in each build definition. For each Task Group parameter, enter the build variable $(VariableName). That way build definitions can easily be cloned and setup by entering the variable values in the variables tab.