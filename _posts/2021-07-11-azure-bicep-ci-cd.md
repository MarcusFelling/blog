---
id: 1007
title: '💪 Azure Bicep CI/CD 🚀'
date: '2021-07-11T22:32:36+00:00'
layout: post
guid: 'https://marcusfelling.com/?p=1007'
permalink: /blog/2021/azure-bicep-ci-cd/
thumbnail-img: /content/uploads/2021/07/githubactionspipelinebicepazure.png
nav-short: true
tags: [Infra as Code, CICD]
---

Hey, you. You’re not manually deploying your [Azure Bicep](https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/overview) Infrastructure as Code, are you?!? Let’s prevent that next production outage, help your team collaborate on changes, and enable more frequent deployments. In this post, I’ll outline what tooling is available to integrate Bicep in your pipelines, and some good practices for building and deploying.

## Resources to get started

If you’re new to Azure Bicep, I’d recommend checking out the [Microsoft Learn learning path for Bicep](https://docs.microsoft.com/en-us/learn/paths/bicep-deploy/). There are also great resources for the basics on [Deploying Bicep files by using GitHub Actions](https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/deploy-github-actions) and [Integrating Bicep with Azure Pipelines](https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/add-template-to-azure-pipelines). Once you have the fundamentals covered, you may find the remainder of this post helpful.

## Build 

### Tooling

I’m going to break things down into 2 phases of the pipeline: 1. build 2. deploy. For the build phase, we have multiple options for tooling:

- **Bicep CLI** – now included in Azure Pipelines [Microsoft-hosted agents](https://docs.microsoft.com/en-us/azure/devops/pipelines/agents/hosted?view=azure-devops&tabs=yaml) and GitHub Actions [hosted runners](https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners). You can also add script steps to install on self-hosted agents [based on OS](https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/install#install-manually).
- **Azure CLI** – Bicep is now included in v2.20.0 or later. Installing Bicep is as simple as running `az bicep install`
- [**Bicep GitHub Action**](https://github.com/marketplace/actions/bicep-build) – Action built and maintained by a community member.
- [**Bicep extension for Azure Pipelines**](https://marketplace.visualstudio.com/items?itemName=piraces.bicep-tasks) – Set of Azure Pipeline tasks built and maintained by a community member.

### Good Practices

I like to set up the build phase early in my pipeline, in order to fail fast and speed up the feedback loop. The build should make sure 3 things happen:

- Ensure transpilation (conversion to ARM template) is successful.
- Ensure linting rules pass. Configure [bicepconfig.json](https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/linter#customize-linter) to throw an error on important rule violations.
- Ensure preflight validaton is successful.

To combine all of the above using a single command, validation commands can be used. For a resource group deployment, I can use the [Azure CLI command](https://docs.microsoft.com/cli/azure/deployment/group?view=azure-cli-latest#az_deployment_group_validate) `az deployment group validate` or Azure PowerShell’s [Test-AzResourceGroupDeployment](https://docs.microsoft.com/en-us/powershell/module/az.resources/test-azresourcegroupdeployment).

For an example of this using GitHub Actions, check out my SpaceGameVNext’s pipeline [here](https://github.com/MarcusFelling/demo-space-game-vnext/blob/12b081894b10b581bdfeaedfce69a0f5165891b3/.github/workflows/pipeline.yml#L83).

![](/content/uploads/2021/07/buildBicepValidatePipeline-1024x623.png)

## Deploy

### Tooling

Similar to build, we have multiple options for deployment:

- **Azure CLI** – no install needed v2.20.0 or later. I can issue a deployment command pointed at a Bicep template and Bicep will be downloaded and installed on the fly, behind the scenes.
- **Azure PowerShell** – Unfortunately Azure PowerShell doesn’t automatically install the Bicep CLI. Instead, you must [manually install the Bicep CLI](https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/install#install-manually).
- [Deploy Azure Resource Manager (ARM) Template GitHub Action](https://github.com/marketplace/actions/deploy-azure-resource-manager-arm-template) – Action built and maintained by Microsoft Azure. Now supports Bicep.
- [ARM template deployment Azure Pipeline task](https://github.com/microsoft/azure-pipelines-tasks/tree/master/Tasks/AzureResourceManagerTemplateDeploymentV3) 
- Official Azure Pipeline task. No native Bicep support. Requires referencing transpiled ARM Template.

### Good Practices

I like to promote the same set of templates for all environments (dev -> test -> prod). This encourages the [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) (Don’t repeat yourself) principle. In order to make this happen, I can:

- Use [conditions](https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/conditional-resource-deployment) on resources that may differ. For example, if I only want to [use deployment slots in production](https://github.com/MarcusFelling/Demo.SpaceGamevNext/blob/12b081894b10b581bdfeaedfce69a0f5165891b3/IaC/webapp.bicep#L96).
- Use [ternary expressions](https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/operators-logical) on properties that differ. For example, if I want to [use different storage account SKU’s](https://github.com/Azure/bicep/blob/main/docs/tutorial/03-using-expressions.md#using-the-ternary-operator).
- Leverage pipeline environment variables to re-use same steps for each environment.

Additionally,

- Do not store secret values in templates. If you use Key Vault, check out [Use Azure Key Vault to pass secure parameter value during Bicep deployment](https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/key-vault-parameter?tabs=azure-cli).
- [Use what-if to preview changes](https://docs.microsoft.com/en-us/learn/modules/arm-template-whatif/). This is a great way to review the impact your changes will have via dry-run.
- Cleanup dev/test environment resources when no longer needed. I like to have a separate pipeline that get’s triggered on the merge of PR, that destroy’s resources that were created for the sole purpose of testing that PR’s change.

For an example of this using GitHub Actions, check out my SpaceGameVNext’s pipeline [here](https://github.com/MarcusFelling/demo-space-game-vnext/blob/main/.github/workflows/pipeline.yml).

![](/content/uploads/2021/07/githubactionspipelinebicepazure-1024x123.png)

## Summary

None of this is hard and fast guidance to follow strictly. There are many different types of architectures, environments, repository structures, etc. These are things that I’ve found success with and YMMV. What have you found success in while integrating Bicep into your pipelines? I would love to hear your thoughts in the comments.