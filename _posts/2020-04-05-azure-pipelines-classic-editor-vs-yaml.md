---
id: 858
title: 'Azure Pipelines: Classic Editor VS. YAML'
date: '2020-04-05T18:11:09+00:00'

layout: post
guid: 'https://marcusfelling.com/?p=858'
permalink: /blog/2020/azure-pipelines-classic-editor-vs-yaml/
thumbnail-img: /content/uploads/2020/04/classicYAMLBattle.png
wpmdr_menu:
    - '1'
categories:
    - Uncategorized
nav-short: true
tags: [Azure DevOps, Azure Pipelines]
---


In this post, the two configuration options in Azure Pipelines will go head to head in an epic battle…

Ok, maybe this won’t be an epic battle, just a friendly pro and con list between the two.

## Classic Editor

### Pros

- User friendly
- Mature feature set for CD

### Cons

- One live version of each definition
- No longer the default

**User friendly**: Even a cave man knows how to click around in a browser. No need to learn Yet Another Markup Language (YAML).

**Mature feature set** **for CD:** There are a lot of really useful features that are not yet available in YAML: [steps for manual validation](https://dev.azure.com/mseng/AzureDevOpsRoadmap/_workitems/edit/1663893), [automated checks (gates) between stages](https://dev.azure.com/mseng/AzureDevOpsRoadmap/_workitems/edit/1570285), [ability to scope environments to multiple projects](https://developercommunity.visualstudio.com/idea/889113/shared-pipeline-environments-within-projects.html) (Deployment Groups can do this).

**One live version of each definition**: It can be difficult to isolate changes to definitions because you effectively have one live version of each definition. To make changes without affecting others, you could clone the definition, make changes, test, then manually add the changes to the live version. This is kind of a pain and it doesn’t include a review process for others to have visibility into the changes before they’re applied. Task Groups have [a feature to draft and preview changes](https://docs.microsoft.com/en-us/azure/devops/pipelines/library/task-groups?view=azure-devops#create-previews-and-updated-versions-of-task-groups), but they’re not always in use and can create unnecessary complexity for simple pipelines.

**No longer the default**: When creating new definitions, the classic editor is no longer the default option. It’s now hidden towards the bottom, making it harder to find. YAML is the future, hint, hint, nudge, nudge.

![](/content/uploads/2020/04/classicHidden.png)

*Let’s make it really difficult for users to NOT use YAML. Muahhahaha!*

## YAML

### Pros

- Easy to collaborate
- Repository portability
- CI/CD industry standard

### Cons

- Steeper learning curve
- CD features not at parity with classic (yet)

**Easy to collaborate**: You can use the same branching and merging strategy and workflow as your applications. Topic branches can be used to isolate pipeline changes, then pull requests can be used to review the changes with teammates before the changes get merged.

**Repository portability:** You can place your YAML file alongside your application code, making your repository more “portable”. Pipelines are a black box for users that don’t have access to your CI/CD platform. By cloning a repository that has a YAML pipeline, others know exactly what is takes to build and deploy the application.

**CI/CD industry standard**: most CI/CD tools support YAML (GitHub Actions, GitLab CI, Travis CI, Drone) C’mon, everybody else is doing it!

**Steeper learning curve:** It may take users longer to get the hang of working with YAML files. However, the [Task Assistant](https://docs.microsoft.com/en-us/azure/devops/release-notes/2019/sprint-150-update#task-assistant-for-editing-yaml-files) can help. There is also a Visual Studio Code [Azure Pipelines extension](https://marketplace.visualstudio.com/items?itemName=ms-azure-devops.azure-pipelines) to assist with syntax highlighting and IntelliSense. Still afraid of YAML? You could start with the classic editor, then make the switch to YAML using the “View YAML” button later down the road:

![](/content/uploads/2020/04/viewYAML.png)

![](/content/uploads/2020/04/copyYAML.png)

## Judge?

 There really isn’t a clear winner. As with most of these types of decisions, *it depends*.  
  
**If**: You’re new to Azure Pipelines OR require advanced CD features OR prefer working in a GUI over code.  
**Then:** Start with the classic editor, then make the switch to YAML when you’re ready.  
**Else:** Use YAML.