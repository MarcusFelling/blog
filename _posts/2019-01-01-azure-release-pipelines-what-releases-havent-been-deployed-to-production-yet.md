---
title: "Azure Release Pipelines: What Releases Haven't Been Deployed to Production Yet?"
date: 2019-01-01
categories:
  - Azure
  - DevOps
tags:
  - Azure
  - DevOps
  - Release Pipelines
  - Production
---

In this post, I will show you how to use Azure DevOps Release Pipelines to determine which releases haven't been deployed to production yet. This can be useful for tracking the progress of your deployments and ensuring that all necessary releases are deployed to production.

## Prerequisites

Before you begin, you will need the following:

- An Azure DevOps account
- A project in Azure DevOps
- A release pipeline in Azure DevOps

## Step 1: Create a Release Pipeline

If you don't already have a release pipeline, you will need to create one. To do this, follow these steps:

1. In your Azure DevOps project, navigate to the Pipelines section.
2. Click on "Releases" and then click on "New pipeline".
3. Select a template for your release pipeline or create a new one from scratch.
4. Configure the stages and tasks for your release pipeline.

## Step 2: Add a PowerShell Task to the Release Pipeline

To determine which releases haven't been deployed to production yet, we will use a PowerShell script. Add a PowerShell task to your release pipeline by following these steps:

1. In your release pipeline, click on the "+" icon to add a new task.
2. Search for "PowerShell" and select the "PowerShell" task.
3. Configure the PowerShell task with the following settings:
   - Script Path: Path to your PowerShell script
   - Arguments: Any arguments required by your script
   - Working Directory: The directory where your script is located

## Step 3: Write the PowerShell Script

The PowerShell script will use the Azure DevOps REST API to retrieve information about the releases and determine which ones haven't been deployed to production yet. Here is an example script:

```powershell
# Define the Azure DevOps organization and project
$organization = "your-organization"
$project = "your-project"

# Define the release definition ID and the production environment name
$releaseDefinitionId = "your-release-definition-id"
$productionEnvironmentName = "Production"

# Get the list of releases
$releasesUrl = "https://vsrm.dev.azure.com/$organization/$project/_apis/release/releases?api-version=6.0"
$releases = Invoke-RestMethod -Uri $releasesUrl -Method Get -Headers @{Authorization = "Bearer $env:AZURE_DEVOPS_PAT"}

# Filter the releases to find those that haven't been deployed to production yet
$releasesNotDeployedToProduction = $releases.value | Where-Object {
    $_.environments | Where-Object { $_.name -eq $productionEnvironmentName -and $_.status -ne "succeeded" }
}

# Output the list of releases that haven't been deployed to production yet
$releasesNotDeployedToProduction | ForEach-Object {
    Write-Output "Release ID: $($_.id), Release Name: $($_.name)"
}
```

## Step 4: Run the Release Pipeline

Once you have added the PowerShell task and script to your release pipeline, you can run the pipeline to determine which releases haven't been deployed to production yet. The output of the PowerShell script will be displayed in the pipeline logs.

## Conclusion

In this post, we have shown you how to use Azure DevOps Release Pipelines and a PowerShell script to determine which releases haven't been deployed to production yet. This can help you track the progress of your deployments and ensure that all necessary releases are deployed to production.
