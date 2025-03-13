---
id: 937
title: 'Azure Pipelines: YAML Templates VS. Custom Tasks'
date: '2020-11-05T19:07:10+00:00'
layout: default
guid: 'https://marcusfelling.com/?p=937'
permalink: /blog/2020/azure-pipelines-yaml-templates-vs-custom-tasks/
thumbnail-img: /content/uploads/2020/11/extensionORTemplate.png
nav-short: true
tags: [Azure DevOps, CICD]
---

There are two main ways to create re-usable components for Azure Pipelines. I’ll review the pros and cons of each and talk about when it makes sense to use one over the other. Keep in mind that the two are not mutually exclusive, so it may make sense to use a combination of both.

Note: I won’t be including [task groups](https://docs.microsoft.com/en-us/azure/devops/pipelines/library/task-groups?view=azure-devops) as they’re not supported in YAML pipelines. Why use YAML over Classic Editor? See my previous blog post here: [Classic Editor VS. YAML](https://marcusfelling.com/blog/2020/azure-pipelines-classic-editor-vs-yaml)

## Custom pipeline task extension

## Pros
- Discoverability
- Helpers can assist users with parameters
- Azure Pipelines Task SDK

## Cons
- Learning curve and effort that comes with creating, testing, packaging, versioning, publishing, and installing extension
- Complexity

Why would you use a [custom pipeline task extension](https://docs.microsoft.com/en-us/azure/devops/extend/develop/add-build-task?view=azure-devops) over a YAML template?

**Pros**

- **Discoverability** – Once installed, the pipeline consumers can search for custom tasks using the [Task Assistant](https://devblogs.microsoft.com/devops/whats-new-with-azure-pipelines/#getting-going-with-yaml).
- **Helpers** - You can add helpers ([helpMarkDown ](https://github.com/Microsoft/azure-pipelines-task-lib/blob/master/tasks.schema.json#L200)in task.json) that assist users with filling in the necessary param’s for the task, through the Task Assistant.
- **SDK** - Extensions make it easy to bundle and utilize the functions available in the [Azure Pipelines Task SDK](https://github.com/microsoft/azure-pipelines-task-lib).

**Cons**

- **Learning curve** – There is definitely a learning curve that comes with figuring out how to author, test, package, version, publish, and install extensions.
- **More than 1 file required** – There is complexity that comes with the required config files, dependencies, and [TFX CLI](https://www.npmjs.com/package/tfx-cli), compared to a single YAML template file.

## YAML template

## Pros
- Simplicity
- Security and governance features
- Easy updates

## Cons
- Difficult to discover templates that are available
- Figuring out parameters may not be obvious

Why would you use a [YAML template](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/templates?view=azure-devops) over a custom pipeline task extension?

**Pros**

- **Simplicity** – Only a single file required.
- **Security and governance features** – There are bunch of [security features that can be enforced through YAML](https://docs.microsoft.com/en-us/azure/devops/pipelines/security/templates?view=azure-devops#security-features-enforced-through-yaml). My favorite is the [required template check](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/approvals?view=azure-devops&tabs=check-pass#required-template). You can set up certain environments or service connections (e.g. production) to require that a template is referenced in the pipeline. This enables an [inner sourcing workflow](https://resources.github.com/whitepapers/introduction-to-innersource/) where SME’s (security, database, networking teams) define their standards in templates, then only allow contributions through a pull request to sign off on changes. Ideally the pipeline consumers have read-access to the template repo’s so they have visibility into what the templates do and can submit a pull request with changes to extend the functionality or fix a bug. This way the SME’s aren’t a bottleneck.
- **Easy updates** - Git branches can be used to isolate and test changes, then pull requests can be used to collaborate with others on changes.

**Cons**

- **Parameters** – Consumers would need to go to the template YAML file and/or documentation to understand parameters. Having README markdown files alongside templates helps.
- **What templates can I use?** - Discovering all of the templates available requires searching across repositories.

## Use them together

Sometimes it makes sense to create a custom task extension, then reference it in templates. In that case, consumers can still use the task individually (outside of the template), but things like security can be enforced when it makes sense. I have some examples of this on GitHub; I have a template repo [here](https://github.com/MarcusFelling/Demo.Templates), that get’s referenced in my YAML pipeline [here](https://github.com/MarcusFelling/Demo.SpaceGame/blob/master/azure-pipelines.yml).