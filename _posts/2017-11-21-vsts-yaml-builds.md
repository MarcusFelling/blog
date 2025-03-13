---
id: 517
title: 'Azure Pipelines YAML Builds (Pipeline as code)'
date: '2017-11-21T22:33:18+00:00'
layout: post
guid: 'https://marcusfelling.com/?p=517'
permalink: /blog/2017/vsts-yaml-builds/
nav-short: true
tags: [Azure DevOps, CICD]
---

Last week Microsoft [announced](https://blogs.msdn.microsoft.com/devops/2017/11/15/pipeline-as-code-yaml-preview/) “Pipeline as code (YAML)” giving us the ability to store our builds in source control. This allows us to take advantage of Configuration as Code as well as other benefits not available through the Visual Designer builds:

- The YAML files follow the same branching structure as your code. This gives us multiple versions of the build, preventing breaking changes to the build process.
- Validate changes through code reviews in pull requests and branch build policies.
- If the build breaks, changes can be easily identified in version control.
- Working with code is preferable to using the Web interface.
- Fan build steps in/out across build agents.

I’ll let you read the [getting started guide](https://docs.microsoft.com/en-us/azure/devops/pipelines/get-started-yaml?view=azure-devops) which walks you through the basics. In this post I wanted to go through the process I used to convert some of my builds and some gotchas I found on the way.

## Where is the export button?

**Edit: This is no longer necessary. You can now click “View YAML”.**

Unfortunately Microsoft hasn’t created an easy way to export an existing build definition. This means we’ll need to use the API to get the JSON from a build definition, convert it to YAML, tweak the syntax, and update the tasks that are referenced.

1. Use the API to get a definition: `https://{instance}/DefaultCollection/{project}/_apis/build/definitions/{definitionId}?api-version={version}[&revision={int}]`
2. Copy/paste the JSON into a JSON to YAML converter. Example: <https://www.json2yaml.com/>
3. Copy the YAML to a text editor.
4. Use the [guide](https://github.com/Microsoft/vsts-agent/blob/master/docs/preview/yamlgettingstarted-tasks.md) to tweak the syntax.
5. Replace the refName key values with task names and version. Built in tasks can be found here (look in task.json file) [https://github.com/Microsoft/vsts-tasks/tree/master/Tasks ](https://github.com/Microsoft/vsts-tasks/tree/master/Tasks)All the tasks in your account can be found here:  
    `https://{instance}/DefaultCollection/{project}/_apis/distributedtask/tasks`
6. Replace all tabs with spaces in case you accidentally added them (YAML syntax).

## Phases

The YAML builds provide the ability to separate steps by phases. The phases can be run in parallel and even fanned in and out across agents.

Fan out example:

```
phases:
- phase: InitialPhase
  steps:
  - script: echo hello from initial phase
- phase: SubsequentA
  dependsOn: InitialPhase
  steps:
  - script: echo hello from subsequent A
- phase: SubsequentB
  dependsOn: InitialPhase
  steps:
  - script: echo hello from subsequent B
```

Take advantage of this anywhere that steps can run in parallel. Keep in mind that when you fan out across agents, each phase will have it’s own working, staging, and artifact directories.

## Gotchas

– Task Groups cannot be referenced as tasks. Same process above can be used to convert these using the API.  
– When adding service endpoints you will need to re-save the build definition in order to authenticate.

## Example

Here is an example YAML file I created that has 5 phases. The first 4 fan out and run in parallel and the last phase waits for all of them to complete before beginning. I removed endpoints and all company specific data.

<script src="https://gist.github.com/MarcusFelling/15a369d8503f249ef7719c2de1ad6207.js"></script>