---
layout: post
title: "Azure Bicep CI/CD"
date: 2021-07-11 12:00:00 -0500
categories: [Azure, Bicep, CI/CD]
---

In this post, we will explore how to set up a CI/CD pipeline for Azure Bicep. Azure Bicep is a domain-specific language (DSL) for deploying Azure resources declaratively. It simplifies the process of writing and managing Azure Resource Manager (ARM) templates.

## Prerequisites

Before we get started, make sure you have the following prerequisites:

- An Azure subscription
- Azure CLI installed on your machine
- Bicep CLI installed on your machine
- A GitHub account

## Step 1: Create a Bicep File

First, create a Bicep file that defines the Azure resources you want to deploy. For example, create a file named `main.bicep` with the following content:

```bicep
resource storageAccount 'Microsoft.Storage/storageAccounts@2021-02-01' = {
  name: 'mystorageaccount'
  location: 'eastus'
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
}
```

This Bicep file defines a storage account resource.

## Step 2: Create a GitHub Repository

Create a new GitHub repository to store your Bicep files and CI/CD pipeline configuration. You can do this from the GitHub website or using the GitHub CLI.

## Step 3: Set Up a GitHub Actions Workflow

Create a GitHub Actions workflow to automate the deployment of your Bicep files. Create a new file named `ci.yml` in the `.github/workflows` directory of your repository and add the following configuration:

```yaml
name: Deploy Bicep

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Set up Azure CLI
        uses: azure/cli@v1

      - name: Login to Azure
        run: az login --service-principal -u ${{ secrets.AZURE_CLIENT_ID }} -p ${{ secrets.AZURE_CLIENT_SECRET }} --tenant ${{ secrets.AZURE_TENANT_ID }}

      - name: Install Bicep CLI
        run: az bicep install

      - name: Deploy Bicep file
        run: az deployment group create --resource-group myResourceGroup --template-file main.bicep
```

This workflow triggers on pushes to the `main` branch, sets up the Azure CLI, logs in to Azure using a service principal, installs the Bicep CLI, and deploys the Bicep file.

## Conclusion

By using Azure Bicep and GitHub Actions, you can automate the deployment of your Azure resources. This allows you to manage your infrastructure as code and ensure consistent deployments.
