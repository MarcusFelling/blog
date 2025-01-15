---
layout: post
title: "Associating Automated Tests with Azure Test Cases"
date: 2020-01-01 12:00:00 -0500
categories: [Azure, Test Cases, Automated Testing]
---

In this post, we will explore how to associate automated tests with Azure Test Cases to streamline your testing process and improve traceability. Azure Test Plans is a powerful tool that allows you to plan, track, and manage your testing efforts, while automated tests help you ensure the quality of your applications.

## Setting Up Azure Test Plans

To get started with Azure Test Plans, you need to have an Azure DevOps account. If you don't have one, you can sign up for free at [Azure DevOps](https://dev.azure.com/).

### Step 1: Create a New Project

Once you have an Azure DevOps account, create a new project by clicking on the "New Project" button. Give your project a name and select the visibility (public or private) and version control (Git or Team Foundation Version Control).

### Step 2: Create a Test Plan

After creating your project, navigate to the "Test Plans" section and click on the "New Test Plan" button. Give your test plan a name and select the area path and iteration path for your tests.

### Step 3: Create Test Suites and Test Cases

Within your test plan, you can create test suites and test cases. Test suites are used to group related test cases, while test cases define the individual tests that you want to run. To create a test suite, click on the "New Test Suite" button and give it a name. To create a test case, click on the "New Test Case" button and fill in the details, such as the title, steps, and expected results.

## Associating Automated Tests with Test Cases

Now that you have set up your test plan, you can associate automated tests with your test cases to streamline your testing process.

### Step 1: Create Automated Tests

Create automated tests using your preferred testing framework, such as NUnit, MSTest, or xUnit. For example, here is a simple NUnit test:

```csharp
using NUnit.Framework;

[TestFixture]
public class SampleTests
{
    [Test]
    public void TestMethod1()
    {
        Assert.IsTrue(true);
    }
}
```

### Step 2: Add Test Case ID to Automated Tests

To associate an automated test with a test case, you need to add the test case ID to the automated test. You can do this by adding a `TestCategory` attribute with the test case ID. For example:

```csharp
using NUnit.Framework;

[TestFixture]
public class SampleTests
{
    [Test]
    [TestCategory("TestCaseID:12345")]
    public void TestMethod1()
    {
        Assert.IsTrue(true);
    }
}
```

### Step 3: Configure Azure Pipelines

To run your automated tests and associate them with test cases, you need to configure an Azure Pipelines build or release pipeline. Create a new pipeline configuration file named `azure-pipelines.yml` in your project directory and add the following configuration:

```yaml
trigger:
- main

pool:
  vmImage: 'ubuntu-latest'

steps:
- task: UseDotNet@2
  inputs:
    packageType: 'sdk'
    version: '5.x'
    installationPath: $(Agent.ToolsDirectory)/dotnet

- script: |
    dotnet build
    dotnet test --logger trx --results-directory $(System.DefaultWorkingDirectory)/TestResults
  displayName: 'Run Automated Tests'

- task: PublishTestResults@2
  inputs:
    testResultsFiles: '**/*.trx'
    searchFolder: '$(System.DefaultWorkingDirectory)/TestResults'
    testRunTitle: 'Automated Tests'
```

This configuration triggers the pipeline on changes to the `main` branch, installs the .NET SDK, builds the project, runs the automated tests, and publishes the test results.

### Step 4: Associate Test Results with Test Cases

To associate the test results with test cases, you need to enable the "Test Plans" feature in your Azure DevOps project. Navigate to the "Project Settings" section, click on "Overview", and enable the "Test Plans" feature.

## Conclusion

By associating automated tests with Azure Test Cases, you can streamline your testing process and improve traceability. This allows you to ensure the quality of your applications and manage your testing efforts more effectively. With Azure Test Plans, you can plan, track, and manage your testing efforts, while automated tests help you ensure the quality of your applications.
