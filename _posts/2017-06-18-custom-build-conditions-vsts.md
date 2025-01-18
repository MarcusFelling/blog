---
id: 305
title: 'Custom Build Conditions in VSTS'
date: '2017-06-18T17:27:50+00:00'

layout: post
guid: 'https://marcusfelling.com/?p=305'
permalink: /blog/2017/custom-build-conditions-vsts/
wpmdr_menu:
    - '1'
categories:
    - Uncategorized
nav-short: true
---

On March 29th, 2017 the VSTS team released a new feature that added the ability to specify conditions for running a build task. This provides more control over your build tasks, for things such as a task to clean things up (even if a build fails), or send a message when something goes wrong, under conditions such as certain branches or with certain triggers. Custom Conditions appear in the new build definition editor under Control Options. Custom conditions are not currently available for Task Groups because they still use the old build definition editor (this is on the backlog).

![](/content/uploads/2017/06/VSTSCustomConditions.png)](/content/uploads/2017/06/VSTSCustomConditions.png)

Microsoft provides examples for various conditions here: <https://www.visualstudio.com/en-us/docs/build/concepts/process/conditions>

I found the most useful condition was checking variable values, in particular, the build.reason variable. I used this to combine multiple build definitions into one by setting conditions on certain tasks so they only ran based on what triggered the build. I had a separate build definition for CI (compilation and unit tests only) that was triggered by pull requests. Setting the following condition, the compilation and unit tests would run if the build was triggered by a pull request:

`and(succeeded(), eq(variables['Build.Reason'], 'PullRequest'))`

I had another build definition that would run CI, along with packaging and pushing packages to our artifact repository. By setting the build conditions I could combine the two definitions and only run the extra steps to package and push if the build was manually queued or scheduled as part of our nightly build.

Note: I encountered a bug where conditions do not save the first time. Reload the build definition editor, re-enter the conditions and they should save the second time around.

Have you used custom conditions? Leave a comment below!