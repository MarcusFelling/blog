---
id: 949
title: 'Reasons to use Bicep over Terraform'
date: '2021-01-14T21:30:09+00:00'

layout: post
guid: 'https://marcusfelling.com/?p=949'
permalink: /blog/2021/reasons-to-use-bicep-over-terraform/
wpmdr_menu:
    - '1'
thumbnail-img: /content/uploads/2021/01/bicepLogo-1.png
categories:
    - Uncategorized
nav-short: true
tags: [IaC, Azure Bicep, Terraform]
---


Why would you choose Microsoft’s new Bicep DSL over HashiCorp’s Terraform? I would like to give you my perspective, as someone who ditched ARM templates for Terraform in most of my Infrastructure as Code projects. To set the context of this blog post, I’ll be talking about Azure focused customers. Also, I won’t be going over the basics of what Bicep is (that can be found in README [here](https://github.com/Azure/bicep)) or comparing it to other IaC solutions like [Pulumi](https://www.pulumi.com/) or [Farmer](https://compositionalit.github.io/farmer/). If there is interest, I can cover those in another blog post. This will be a direct comparison to Terraform.  

*Note: Opinions expressed are solely my own and do not express the views or opinions of my employer.*

Don’t get me wrong, there are some great reasons to use Terraform. Multi-cloud support is one of them. Or for some of you who already have large investments in Terraform, starting over may not make sense. If that’s the case, you’re still in good hands. There is a dedicated team at Microsoft responsible for making Terraform on Azure as good as it can possibly be. However, there are some benefits that come with the first class, Azure native, experience of Bicep:

## Day zero support for all resource types &amp; API versions

With Bicep, there will be day 0 support for new resources. Similar to ARM templates, the schema of the resource provider is used directly. With Terraform there is potential for a delay between new Azure resources being released and them being available to create in Terraform. A Terraform community member must add any new Azure features to the Azure Terraform provider. Yes, you can have Terraform deploy an ARM template or use the Azure CLI, but that can get messy stringing it all together, and none of these resources will be tracked by TF state.

## No state files

Terraform’s source of truth is the state file, which comes with some baggage. With the state file, you have an extra file that is critical to your deployments that you need to manage and keep safe. If you lose your state file or it gets overwritten, you could be in a lot of trouble. With Bicep, the state is maintained by Azure. You can perform a what-if (TF Plan equivalent) operation without any state file management. Azure IS the state.

## Preflight validation

Bicep/ARM does preflight validation on the entire template, so you can fail fast. Resource Manager checks the template before starting the deployment to make sure the deployment will succeed. Because of this, your deployment is less likely to stop in a half-finished state.

## Tooling

The [Terraform VS Code extension](https://marketplace.visualstudio.com/items?itemName=HashiCorp.terraform&ssr=false#overview) leaves a lot to be desired. The [Bicep extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep) is superior in many ways. It gets you rich validation and Intellisense with GET properties from the Azure Swagger documents of the resource providers. The Intellisense can even see into modules, to assist with inserting parameters.   
  
Both [Az CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) (2.20.0+) and the [PowerShell Az module](https://docs.microsoft.com/en-us/powershell/azure/install-az-ps?view=azps-5.5.0) (v5.6.0+) have Bicep support built-in.

> This means you can use the standard deployment commands with your `bicep` files and the tooling will transpile the code and send it to ARM on your behalf. For example, to deploy `main.bicep` to a resource group `my-rg`, we can use the CLI command we are already used to: `az deployment group create -f ./main.bicep -g my-rg`

In addition to the VS Code extension, you can use the web-based [Bicep Playground](https://aka.ms/bicepdemo). This is an interactive playground where you can author Bicep code and have it auto-generate the corresponding ARM template without needing to use the CLI. It also has features to share links to your playground, insert example templates, and even decompile an ARM template into Bicep code.

## Deep integration with other Azure Services

For example, with Azure Policy; remediating non-compliant resources are done via ARM Templates, which can be generated using Bicep, and in the future Bicep will be a supported file type.

Another example is using [Template Specs](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/template-specs) as a source for modules. This offers benefits like managing access to templates through Azure RBAC, so users can deploy templates without having write access.

## Automate Portal Actions

Use the Azure portal as a Bicep template generator. Export a deployable Bicep template for any portal deployment actions. Currently, you’ll need to decompile the exported ARM template but in the near future Bicep templates will be supported.

## Support

As of v.03, Bicep is 100% supported by Microsoft Support Plans. With Terraform (open-source), you may need to wait for someone in the Terraform community to lend a hand (Stack Exchange, mailing list, Gitter, IRC, GitHub, etc.).

## What’s stopping you?

To see an example of Bicep code that deploys Azure Web App for Containers and Azure SQL, check out my Space Game repo: [https://github.com/MarcusFelling/demo-space-game-vnext/tree/main/IaC](https://github.com/MarcusFelling/demo-space-game-vnext/tree/main/iac)

Now that the 0.3 release is production-ready, as an Azure customer, would you choose Bicep over Terraform? If not, what would prevent you from making the switch? I would love to hear your thoughts in the comments below.