---
layout: post
title: "Setting Up SonarQube on Windows with Azure Pipelines"
date: 2019-01-01 12:00:00 -0500
categories: [Azure DevOps, SonarQube, Pipelines]
---

SonarQube is an open-source platform for continuous inspection of code quality. It performs static code analysis, provides detailed reports on bugs, code smells, and security vulnerabilities, and supports many programming languages. In this post, we will set up SonarQube on a Windows machine and integrate it with Azure Pipelines for continuous code quality analysis.

## Prerequisites

Before we start, ensure you have the following prerequisites:

1. A Windows machine with administrative privileges.
2. Java Development Kit (JDK) installed.
3. Azure DevOps account and a project created.
4. Git installed and configured.

## Step 1: Download and Install SonarQube

1. Download the latest version of SonarQube from the [official website](https://www.sonarqube.org/downloads/).
2. Extract the downloaded file to a directory of your choice.
3. Open a command prompt as an administrator and navigate to the `bin/windows-x86-64` directory inside the SonarQube folder.
4. Run the `StartSonar.bat` file to start the SonarQube server.

```sh
cd C:\path\to\sonarqube\bin\windows-x86-64
StartSonar.bat
```

5. Open a web browser and navigate to `http://localhost:9000`. You should see the SonarQube dashboard.

## Step 2: Configure SonarQube

1. Log in to the SonarQube dashboard using the default credentials (admin/admin).
2. Change the default password for security reasons.
3. Create a new project in SonarQube by clicking on the "Create new project" button.
4. Generate a project key and a token for the new project. Note down the token as it will be used in the Azure Pipelines configuration.

## Step 3: Set Up Azure Pipelines

1. Navigate to your Azure DevOps project and click on "Pipelines" in the left-hand menu.
2. Click on the "New pipeline" button and follow the prompts to configure your pipeline.
3. In the pipeline YAML file, add the following steps to integrate SonarQube analysis:

```yaml
trigger:
- main

pool:
  vmImage: 'windows-latest'

steps:
- task: UseJava@1
  inputs:
    versionSpec: '11'
    jdkArchitectureOption: 'x64'
    jdkSourceOption: 'PreInstalled'
    jdkUserInputPath: ''
    jdkDestinationDirectory: ''

- task: SonarQubePrepare@4
  inputs:
    SonarQube: 'SonarQube'
    scannerMode: 'MSBuild'
    configMode: 'manual'
    projectKey: 'your-project-key'
    projectName: 'your-project-name'
    extraProperties: |
      sonar.exclusions=**/bin/**/*,**/obj/**/*
      sonar.cs.opencover.reportsPaths=$(Build.SourcesDirectory)/**/coverage.opencover.xml

- task: VSBuild@1
  inputs:
    solution: '**/*.sln'
    msbuildArgs: '/p:DeployOnBuild=true /p:WebPublishMethod=Package /p:PackageAsSingleFile=true /p:SkipInvalidConfigurations=true /p:PackageLocation="$(build.artifactstagingdirectory)\\"'
    platform: '$(BuildPlatform)'
    configuration: '$(BuildConfiguration)'

- task: SonarQubeAnalyze@4

- task: SonarQubePublish@4
  inputs:
    pollingTimeoutSec: '300'
```

4. Replace `your-project-key` and `your-project-name` with the values generated in the SonarQube dashboard.
5. Save and run the pipeline.

## Conclusion

By following these steps, you have successfully set up SonarQube on a Windows machine and integrated it with Azure Pipelines. This setup will help you continuously monitor and improve the code quality of your projects.
