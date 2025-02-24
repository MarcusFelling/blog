---
id: 693
title: 'Azure DevOps Pipelines: Variables, $Variables, __Variables__, $env:Variables, $(Variables), %VARIABLES%'
date: '2019-08-24T16:35:47+00:00'

layout: post
guid: 'https://marcusfelling.com/?p=693'
permalink: /blog/2019/azure-devops-pipeline-variables/
wpmdr_menu:
    - '1'
thumbnail-img: /content/uploads/2019/08/AzureDevOpsPipelineVariables.png
categories:
    - Uncategorized
nav-short: true
tags: [Azure DevOps, Azure Pipelines, CI/CD]
---


If you’re working with Azure DevOps Pipelines, you should be aware of all your options when it comes to using variables. They make it possible to “***Build Once, Deploy Anywhere”***, prevent code-reuse, and build scale-able CI/CD pipelines.

## User-Defined Vs. System variables

First, I want to start off with the distinction between user-defined variables and system variables. User-defined variables are variables that are defined by you, the end-user (duh!); these are set for things like build tasks, scripts, when queuing a build, creating a release, etc. System variables are automatically set by the system and the values cannot be changed by you, the end-user (read-only). System variables can be also referred to as “predefined variables”, these are the system variables defined by Azure DevOps. In the context of build or release runtime, the variables are available as “Environment Variables”. You can find the list of system variables that are available for builds [here](https://docs.microsoft.com/en-us/azure/devops/pipelines/build/variables?view=azure-devops&tabs=designer) and for releases [here](https://docs.microsoft.com/en-us/azure/devops/pipelines/release/variables?view=azure-devops&tabs=batch#default-variables).

## Setting Pipeline variables

User-defined variables that are specific to the pipeline can be set on the variables tab of the build or release definitions. After adding variables, you can use the variable as an input to a task or inside the scripts in your pipeline. To reference these variables in tasks, wrap is using $(), such as $(exampleVariableName).

Example:  
1. Set variable

![](/content/uploads/2019/04/VariablesTabAzureDevOpsPipelines-1.png)

2. Reference variable in task

![](/content/uploads/2019/04/VariablesTabAzureDevOpsPipelines2.png)To reference the variables in scripts, you can refer to the Microsoft doc [here](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/variables?view=azure-devops&tabs=designer%2Cbatch#set-variables-in-pipeline).

> Notice that variables are also made available to scripts through environment variables. The syntax for using these environment variables depends on the scripting language. Name is upper-cased, `.` replaced with `_`, and automatically inserted into the process environment. Here are some examples:

> **Batch script:** `%VARIABLE_NAME%`
> 
> **PowerShell script:** `$env:VARIABLE_NAME`
> 
> **Bash script:** `$VARIABLE_NAME`

## Variable Groups

[Variable groups](https://docs.microsoft.com/en-us/azure/devops/pipelines/library/variable-groups?view=azure-devops&tabs=yaml) are groups of variables that you can share across multiple pipelines. Rather than setting the same variable across definitions, you can add it to a group so it can be managed in one place. I often see variable groups setup for each environment a set of applications flows through (e.g. DEV, TEST, PROD). This is a great spot to store things like connection strings. I’d recommend storing secrets in Azure Key Vault, then [linking the Azure Key Vault](https://docs.microsoft.com/en-us/azure/devops/pipelines/library/variable-groups?view=azure-devops&tabs=yaml#link-secrets-from-an-azure-key-vault) to the variable group.

## Expressions

Expressions can be used to access and define variables. The following [logging command](https://github.com/microsoft/azure-pipelines-tasks/blob/master/docs/authoring/commands.md) can be run in a PowerShell task to set a variable:

```
Write-Host "##vso[task.setvariable variable=testvar;]testvalue"
```

I like to version my builds using a counter expression. To do this I set the following variables:

![](/content/uploads/2019/08/AzureDevOpsBuildCounter-1024x178.png)

Then change the build number format to reference them:

![](/content/uploads/2019/08/AzureDevOpsBuildCounterOptions.png)

You can find the list of functions available for expressions in the docs [here](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/expressions?view=azure-devops#functions).

What creative ways have you used variables in an Azure DevOps pipeline? Feel free to share in the comments below.