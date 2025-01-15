---
layout: post
title: "Setting Up a CI Pipeline to Run Functional Tests in TFS 2018 and Visual Studio Team Services VSTS"
date: 2018-01-01 12:00:00 -0500
categories: [TFS, VSTS, CI Pipeline, Functional Tests]
---

In this post, we will explore how to set up a CI pipeline to run functional tests in TFS 2018 and Visual Studio Team Services (VSTS). Continuous Integration (CI) is a crucial practice in modern software development, and running functional tests as part of your CI pipeline helps ensure the quality and reliability of your application.

## Prerequisites

Before you begin, make sure you have the following prerequisites:

- A TFS 2018 or VSTS account
- A project in TFS or VSTS with a repository
- A build agent configured and running
- Functional tests written using a testing framework (e.g., Selenium, Coded UI)

## Step 1: Create a Build Definition

First, you need to create a build definition in TFS or VSTS. A build definition defines the steps required to build and test your application.

1. Go to your TFS or VSTS project and navigate to the "Build and Release" section.
2. Click on "New" to create a new build definition.
3. Select the appropriate template for your project (e.g., ASP.NET, .NET Core).
4. Configure the build steps, including restoring NuGet packages, building the solution, and running unit tests.

## Step 2: Add Functional Tests to the Build Definition

Next, you need to add a step to run your functional tests as part of the build definition.

1. In the build definition editor, click on "Add Task" to add a new task.
2. Search for the "Visual Studio Test" task and add it to your build definition.
3. Configure the task to run your functional tests. Specify the path to your test assemblies and any additional settings required for your testing framework.

### Example Configuration

```yaml
- task: VSTest@2
  inputs:
    testSelector: 'testAssemblies'
    testAssemblyVer2: '**\*test*.dll'
    searchFolder: '$(System.DefaultWorkingDirectory)'
    runSettingsFile: '$(System.DefaultWorkingDirectory)\test.runsettings'
    codeCoverageEnabled: true
    diagnosticsEnabled: true
```

## Step 3: Configure Test Settings

To ensure your functional tests run correctly, you may need to configure additional test settings. This can include specifying browser settings for Selenium tests or configuring test data.

### Example Test Settings (test.runsettings)

```xml
<RunSettings>
  <RunConfiguration>
    <TargetPlatform>x64</TargetPlatform>
    <ResultsDirectory>TestResults</ResultsDirectory>
  </RunConfiguration>
  <TestRunParameters>
    <Parameter name="Browser" value="Chrome" />
    <Parameter name="BaseUrl" value="http://localhost:5000" />
  </TestRunParameters>
</RunSettings>
```

## Step 4: Queue a Build

Once you have configured your build definition and added the functional test step, you can queue a build to run the pipeline.

1. Save your build definition.
2. Click on "Queue" to start a new build.
3. Monitor the build process and check the test results to ensure your functional tests are running as expected.

## Conclusion

By setting up a CI pipeline to run functional tests in TFS 2018 and Visual Studio Team Services (VSTS), you can automate the process of building and testing your application. This helps ensure the quality and reliability of your software, and allows you to catch issues early in the development process. With the steps outlined in this post, you can get started with creating a CI pipeline and integrating functional tests into your workflow.
