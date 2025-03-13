---
id: 969
title: 'Using Terraforms Azure provider (azurerm) with GitHub Actions and Terraform Cloud'
date: '2021-02-06T18:38:44+00:00'
layout: post
guid: 'https://marcusfelling.com/?p=969'
permalink: /blog/2021/using-terraforms-azure-provider-azurerm-with-github-actions-and-terraform-cloud/
thumbnail-img: /content/uploads/2021/02/error.png
nav-short: true
tags: [Infra as Code, GitHub Actions, CICD]
---


I wanted to document this after spending a frustrating amount of time troubleshooting getting this setup. I was getting this error when running Terraform Plan:

> `Error building AzureRM Client: obtain subscription() from Azure CLI: Error parsing json result from the Azure CLI: Error waiting for the Azure CLI: exit status 1: ERROR: Please run 'az login' to setup account.`

I followed the well-documented instructions for [Authenticating to Azure using a Service Principal and a Client Secret](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/guides/service_principal_client_secret). I stored the 4 values for ARM\_CLIENT\_ID, ARM\_CLIENT\_SECRET, ARM\_SUBSCRIPTION\_ID, and ARM\_TENANT\_ID as [GitHub encrypted secrets](https://docs.github.com/en/actions/reference/encrypted-secrets), then set them as environment variables in my GitHub Actions workflow:

<script src="https://gist.github.com/MarcusFelling/55950d58da2b4a83f061cdaa52f37061.js"></script>The Azure provider has these [documented ](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs#argument-reference)and states the arguments for client\_id, client\_secret, subcription\_id, and tenant\_id can be sourced from these environment variables.

For some reason, the Terraform Plan command was not picking them up and kept throwing the error mentioned above `"Error building AzureRM Client: obtain subscription() from Azure CLI: Error parsing json result from the Azure CLI: Error waiting for the Azure CLI: exit status 1: ERROR: Please run 'az login' to setup account.`“

I re-generated the service principal, re-added the values to the GitHub Secrets, tried setting the values for the service principal in the provider block, all to no avail. I finally discovered that Terraform Cloud workspaces have a default execution mode of “Remote”, meaning plans and applies occur on Terraform Cloud’s infrastructure. Because of this, the Plan command could not pick up the environment variables from the GitHub Action. Switching the workspace to local resolved my issue (workspace -> settings -> General):

![](/content/uploads/2021/02/image-1024x252.png)

This is what the complete GitHub Action looks like:

<script src="https://gist.github.com/MarcusFelling/de04b04ab801b3fb22f0992a3ab79533.js"></script>

I hope this post will help others who were desperately weeding through search results like I was.