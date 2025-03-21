---
id: 681
title: 'Bulk update Azure Release Pipelines tasks'
date: '2019-03-05T21:16:52+00:00'
layout: post
guid: 'https://marcusfelling.com/?p=681'
permalink: /blog/2019/bulk-update-azure-release-pipelines-tasks/
thumbnail-img: /content/uploads/2019/03/AzurePipelinesTasksOpenSourceCrossPlatform.png
nav-short: true
tags: [Azure Pipelines, CICD]
---


If you’re attempting to update a sprawling amount of release definitions, clicking through each definition using the visual designer can be a real chore. That’s why [Task Groups](https://docs.microsoft.com/en-us/azure/devops/pipelines/library/task-groups?view=azure-devops) really come in handy…But if you’re already stuck with a bunch of definitions that don’t utilize task groups, you’ll probably want to turn to the REST API using PowerShell.

Start by getting a list of all release definitions:

```powershell
GET https://vsrm.dev.azure.com/{organization}/{project}/_apis/release/definitions?api-version=5.0
```

Loop through each definition using the ID from the response above:

```powershell
GET https://vsrm.dev.azure.com/{organization}/{project}/_apis/release/definitions/{definitionId}?api-version=5.0
```

Using the response above, navigate to the task field of the object:

```powershell
$GetDefinitionResponse.environments.deployPhases.workflowTasks
```

Loop through each task and set desired properties on the object. [Use the catalog of tasks](https://docs.microsoft.com/en-us/azure/devops/pipelines/tasks/?view=azure-devops) to figure out required arguments for each task.

```powershell
$Task.version = '2.*'
```

Convert the definition object to JSON to be used in PUT below:

```powershell
$GetDefinitionResponse | ConvertTo-Json -Depth 100
```

Use updated definition object to update the definition via PUT:

```powershell
PUT https://vsrm.dev.azure.com/{organization}/{project}/_apis/release/definitions?api-version=5.0
```

Here is an example script I used to update all release definition’s WindowsMachineFileCopy task from version 1 to version 2:

<script src="https://gist.github.com/MarcusFelling/8133b371db63abce8a88ce79d04e3f65.js"></script>