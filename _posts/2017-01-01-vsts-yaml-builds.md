---
layout: post
title: "VSTS YAML Builds"
date: 2017-01-01 12:00:00 -0500
categories: [VSTS, YAML, CI/CD]
---

In this post, we will explore how to create YAML builds in Visual Studio Team Services (VSTS). YAML builds provide a way to define your build pipeline as code, making it easier to version, review, and maintain your build definitions.

## Prerequisites

Before you begin, make sure you have the following prerequisites:

- A VSTS account and a project
- A repository with your source code
- Basic knowledge of YAML syntax

## Step 1: Create a New YAML Build Definition

To create a new YAML build definition, navigate to the "Builds" section in VSTS and click on "New build pipeline". Select your repository and choose the "YAML" option for defining your build pipeline.

## Step 2: Define Your Build Pipeline

In the YAML editor, define your build pipeline using the following example:

```yaml
trigger:
- master

pool:
  vmImage: 'ubuntu-latest'

steps:
- task: UseDotNet@2
  inputs:
    packageType: 'sdk'
    version: '5.x'
    installationPath: $(Agent.ToolsDirectory)/dotnet

- script: dotnet build
  displayName: 'Build project'

- script: dotnet test
  displayName: 'Run tests'

- task: PublishBuildArtifacts@1
  inputs:
    PathtoPublish: '$(Build.ArtifactStagingDirectory)'
    ArtifactName: 'drop'
    publishLocation: 'Container'
```

This example defines a simple build pipeline with the following steps:

1. **Trigger**: The build is triggered on changes to the `master` branch.
2. **Pool**: The build runs on an Ubuntu virtual machine.
3. **UseDotNet**: The .NET SDK is installed.
4. **Build project**: The project is built using the `dotnet build` command.
5. **Run tests**: Tests are run using the `dotnet test` command.
6. **PublishBuildArtifacts**: Build artifacts are published to the VSTS drop location.

## Step 3: Save and Run Your Build

Save your YAML build definition and run the build. VSTS will execute the steps defined in your YAML file and display the build results.

## Conclusion

By using YAML builds in VSTS, you can define your build pipeline as code, making it easier to version, review, and maintain your build definitions. This approach provides greater flexibility and control over your build process, allowing you to create more complex and customized build pipelines.
