---
id: 821
title: 'Associating automated tests with Azure Test Cases'
date: '2020-04-01T18:15:39+00:00'
author: Marcus
layout: post
guid: 'https://marcusfelling.com/?p=821'
permalink: /blog/2020/associating-automated-tests-with-azure-test-cases/
wpmdr_menu:
    - '1'
thumbnail-img: /content/uploads/2020/04/TestPlans-1.png
categories:
    - Uncategorized
---

  
I often get asked, “why can’t I update any of the fields on the Associated Automation tab of a [Test Case](https://docs.microsoft.com/en-us/azure/devops/test/create-test-cases?view=azure-devops)?”

![](/content/uploads/2020/04/AssociatedAutomation.png)

*Example of a manual test case with no automation*

**TL;DR**: These fields are read-only in the web portal and can be updated via Test Explorer in Visual Studio.

## Why would you want to associate automated tests with Test Cases, a *manual* testing tool?

1. **End-to-end traceability**. By linking your requirements (PBI’s, User Stories) to test cases, you can establish the quality of the requirements based on test results. Ideally a test case is created for each of the acceptance criteria listed for the requirement. Are any of the test cases failing? If so, the requirement is not complete.
2. **More user-friendly**. Some of your testers may not be familiar with Azure Pipelines (CI/CD). The automated tests can be run by triggering a Test Case, rather than a pipeline.

## Setting up the automated tests

Before we can associate an automated test with a Test Case, we’ll need to do a couple of things. First, the automated tests will need to be stored in source control. This can be GitHub, Azure Repos, Bitbucket, or any other source control provider of your choice. Azure Pipelines can consume code from just about anywhere. Next, we’ll need to build and package our tests by [creating a continuous integration build](https://docs.microsoft.com/en-us/azure/devops/pipelines/apps/windows/dot-net?view=azure-devops&tabs=vsts#set-up-continuous-integration). Finally, our release can consume the build artifact and execute the tests using the VsTest task:  
  
Create a new release definition (or use the application’s release that’s being tested):

![](/content/uploads/2020/04/CreateRelease.png)

Add the build artifact that contains the automated tests:

![](/content/uploads/2020/04/AddArtifact.png)

Add 2 tasks to a stage. In my example I’m using my “Test” environment for the stage. The first task will install the Visual Studio Test Platform. The second task will execute the tests using VsTest. Set the second task’s platform version to “Installed by Tools Installer” so you don’t need to manually install anything on the environment/server that’s running the tests. We’ll be triggering these tests through a Test Case, so set the “Select tests using” field to “Test Run”.

![](/content/uploads/2020/04/Tasks.png)

## Configuring Azure Test Plans

Next, we can configure our Test Plan to use our build and release definitions. This can be done in Test Plan settings:

![](/content/uploads/2020/04/TestPlanSettings.png)

![](/content/uploads/2020/04/TestPlanSettingBuildReleases.png)

We can now execute automated tests in our Test Plan using our automated tests pipeline.

## Using Visual Studio to associate to Test Case

The last step is actually associating the tests with Test Cases using Visual Studio. Open the solution containing the tests, then use Test Explorer to right click “Associate to Test Case”:

![](/content/uploads/2020/04/AssociateTestCase.png)

Find the Test Case:

![](/content/uploads/2020/04/FindTestCase.png)

After saving, you can then find the fields in the Test Case’s Associated Automation tab populated:

![](/content/uploads/2020/04/TestCaseFieldsPopulated.png)

## Running the tests

Finally, testers can now trigger the automated Test Case!

![](/content/uploads/2020/04/Trigger1-1024x233.png)

![](/content/uploads/2020/04/Trigger2.png)

Then see the results in Test Runs:

![](/content/uploads/2020/04/RunResults.png)

Happy testing!

*My examples use the open source TailSpin Space Game web application that can be found on GitHub here: <https://github.com/MicrosoftDocs?q=spacegame>*