---
layout: post
title: "Using Terraform's Azure provider (azurerm) with GitHub Actions and Terraform Cloud"
date: 2021-02-06 12:00:00 -0500
categories: [Terraform, Azure, GitHub Actions, CI/CD]
---

In this post, we will explore how to use Terraform's Azure provider (azurerm) with GitHub Actions and Terraform Cloud to automate the deployment of infrastructure to Azure. Terraform is an open-source infrastructure as code (IaC) tool that allows you to define and provision infrastructure using a declarative configuration language.

## Prerequisites

Before we get started, make sure you have the following prerequisites:

- An Azure account. If you don't have one, you can create a free account at [Azure](https://azure.microsoft.com/).
- A GitHub account. If you don't have one, you can create a free account at [GitHub](https://github.com/).
- A Terraform Cloud account. If you don't have one, you can create a free account at [Terraform Cloud](https://app.terraform.io/signup).

## Step 1: Create a Terraform Configuration

First, create a new directory for your Terraform configuration files. In this directory, create a file named `main.tf` and add the following code:

```hcl
provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "example" {
  name     = "example-resources"
  location = "East US"
}

resource "azurerm_storage_account" "example" {
  name                     = "examplestorageacct"
  resource_group_name      = azurerm_resource_group.example.name
  location                 = azurerm_resource_group.example.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}
```

This configuration defines an Azure resource group and a storage account.

## Step 2: Initialize the Terraform Configuration

Next, initialize the Terraform configuration by running the following command in your project directory:

```sh
terraform init
```

This command downloads the necessary provider plugins and prepares your working directory for other Terraform commands.

## Step 3: Create a GitHub Repository

Create a new GitHub repository for your Terraform configuration. You can do this by navigating to [GitHub](https://github.com/) and clicking on the "New" button. Give your repository a name and select the visibility (public or private).

## Step 4: Add Your Terraform Configuration to the Repository

Add your Terraform configuration files to the GitHub repository. You can do this by running the following commands in your project directory:

```sh
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

## Step 5: Create a GitHub Actions Workflow

Create a new directory named `.github/workflows` in your project directory. In this directory, create a file named `main.yml` and add the following code:

```yaml
name: Terraform

on:
  push:
    branches:
      - main

jobs:
  terraform:
    name: 'Terraform'
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set up Terraform
        uses: hashicorp/setup-terraform@v1
        with:
          terraform_version: 0.14.7

      - name: Terraform Init
        run: terraform init

      - name: Terraform Plan
        run: terraform plan

      - name: Terraform Apply
        run: terraform apply -auto-approve
```

This workflow runs the `terraform init`, `terraform plan`, and `terraform apply` commands whenever there is a push to the `main` branch.

## Step 6: Configure Terraform Cloud

In your Terraform Cloud account, create a new workspace for your project. Connect the workspace to your GitHub repository by following the instructions in the Terraform Cloud UI.

## Step 7: Add Environment Variables

In your GitHub repository, add the following environment variables to the repository settings:

- `ARM_CLIENT_ID`: The Azure client ID.
- `ARM_CLIENT_SECRET`: The Azure client secret.
- `ARM_SUBSCRIPTION_ID`: The Azure subscription ID.
- `ARM_TENANT_ID`: The Azure tenant ID.
- `TF_API_TOKEN`: The Terraform Cloud API token.

These environment variables are used by the GitHub Actions workflow to authenticate with Azure and Terraform Cloud.

## Conclusion

By using Terraform's Azure provider (azurerm) with GitHub Actions and Terraform Cloud, you can automate the deployment of infrastructure to Azure. This allows you to define your infrastructure as code and manage it using version control. With GitHub Actions, you can create CI/CD pipelines that automatically deploy your infrastructure changes, and with Terraform Cloud, you can manage your Terraform state and collaborate with your team.
