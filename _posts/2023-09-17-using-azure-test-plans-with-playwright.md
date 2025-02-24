---
id: 1237
title: 'Using Azure Test Plans with Playwright'
date: '2023-09-17T21:01:58+00:00'

layout: post
guid: 'https://marcusfelling.com/?p=1237'
permalink: /blog/2023/using-azure-test-plans-with-playwright/
ig_es_is_post_notified:
    - '1'
thumbnail-img: /content/uploads/2023/09/test-run-ado.png
categories:
    - Uncategorized
nav-short: true
tags: [Azure Test Plans, Playwright, TypeScript, .NET]
---

In 2020, I blogged about associating [automated tests with Azure Test Cases](https://marcusfelling.com/blog/2020/associating-automated-tests-with-azure-test-cases/). The post had 18 questions, which indicates there is still confusion on how this works, especially how to set it up with Playwright (which was pre-stable release at the time).

In this post, I’ll walk through how to configure both Playwright Test (JavaScript/TypeScript) and Playwright .NET to get test results in Azure Test Plans. Each option uses abstractions built on the Azure DevOps [REST API](https://learn.microsoft.com/en-us/rest/api/azure/devops/test/?view=azure-devops-rest-5.0) so you don’t have to write additional code to accomplish this.

## Why?

Azure Test Plans is a popular service that many teams are using for manual testing. By publishing your automated Playwright tests to the service, you get a couple of benefits:

1. **Traceability**. This gives you the option to link your requirements (Azure Boards) to automated tests and the pipeline that ran them. By mapping the two, you can establish the quality of the requirements based on test results. Ideally, a test case is created for each of the acceptance criteria listed for the requirement.
2. **History**. Drilling into every pipeline run to see test results over time is a pain. Azure Test Plans allows you to see results through features like the [progress report](https://learn.microsoft.com/en-us/azure/devops/test/progress-report?view=azure-devops) and [charts](https://learn.microsoft.com/en-us/azure/devops/test/track-test-status?view=azure-devops#track-testing-progress).
3. **Test inventory.** By tracking automated AND manual test cases, you can do things like [track the status of a test case](https://learn.microsoft.com/en-us/azure/devops/test/track-test-status?view=azure-devops#track-test-case-status) (not automated, planned to be automated, or automated). This makes it easy to track the progress of automated testing efforts, e.g. how many manual tests have been converted to automated, how many remain, etc.

## What are the options?

I’ll show working code examples for both Playwright Test (TypeScript) and Playwright .NET using NUnit. If you’re already sick of reading and want to see them in action, here are some links.

**TypeScript:** [tests](https://dev.azure.com/marcusfelling/Playground/_git/PlaywrightTest?path=/tests), [pipeline to run tests](https://dev.azure.com/marcusfelling/Playground/_build?definitionId=24), [test plan](https://dev.azure.com/marcusfelling/Playground/_testPlans/execute?planId=442&suiteId=443)

**.NET**: [tests](https://dev.azure.com/marcusfelling/Playground/_git/PlaywrightDotnet?path=/PlaywrightTests/Header.cs), [build to publish binaries](https://dev.azure.com/marcusfelling/Playground/_build?definitionId=24), [release to run tests](https://dev.azure.com/marcusfelling/Playground/_release?_a=releases&view=mine&definitionId=2), [test plan](https://dev.azure.com/marcusfelling/Playground/_testPlans/execute?planId=432&suiteId=433)

## Playwright Test (TypeScript)

[playwright-azure-reporter](https://www.npmjs.com/package/@alex_neo/playwright-azure-reporter) is a custom reporter (npm package) that allows you to post test results by annotating your test case name with the Azure test plan ID. The README has instructions for installing the package and adding the reporter to `playwright.config.ts`

My example project’s config looks like this: [playwright](https://gist.github.com/MarcusFelling/66356db19ecb20ff798150ddd91900da)[.config.ts](https://dev.azure.com/marcusfelling/Playground/_git/PlaywrightTest?path=/playwright.config.ts&version=GBmain&line=31&lineEnd=32&lineStartColumn=1&lineEndColumn=1&lineStyle=plain&_a=contents).

Once that is in place:

1. Manually create new test cases in Azure Test Plans taking note of the ID (planID in query string of URL)
2. Add the ID in brackets to the test case title. 444, 445 in this example:

![](/content/uploads/2023/09/annotation-test-id-1024x329.png)

When these tests get run, you will then be able to see the outcome for each test case:

![](/content/uploads/2023/09/outcome-1024x388.png)

My example pipeline runs these tests for every commit on main and also uses the JUnit reporter to publish results to the pipeline’s Test tab:

![](/content/uploads/2023/09/test-tab.png)

## Playwright .NET

This option works out of the box but has some caveats and complexity: A Windows runner and a release pipeline are required to use the Visual Studio test platform installer and Visual Studio Test tasks. Also, Visual Studio must be used to associate test cases.

Here is how I set this up in my example project:

1. Manually create new Azure Test Plans test cases
2. Use Visual Studio’s test explorer to associate the automated test cases:

    ![](/content/uploads/2023/09/associate-test-case.png)
    
    This will change the Automation status field on the test case work item to automated:
    
    ![](/content/uploads/2023/09/automation-status.png)

Once the test cases are configured, we can set up our pipelines to run the tests.

3. Create a build pipeline that runs `dotnet publish` (using Windows agent) in order to create an artifact with the Playright binaries: [playwright-dotnet.yml](https://dev.azure.com/marcusfelling/Playground/_git/PlaywrightDotnet?path=/playwright-dotnet.yml)

4. Create a [release pipeline](https://dev.azure.com/marcusfelling/Playground/_releaseDefinition?definitionId=2&_a=definition-tasks&environmentId=4) referencing the artifact created in the previous step:

![](/content/uploads/2023/09/artifact.png)

5. Add install tasks (that run on Windows agent) for “Visual Studio Test Platform Installer” (prereq for VS Test task), .NET, and Playwright browsers:

![](/content/uploads/2023/09/tasks.png)

6. Add the VS Test task and reference your test plan:

![](/content/uploads/2023/09/vstest-task.png)

7. Create a new release to run the tests. Example results: [Test tab](https://dev.azure.com/marcusfelling/Playground/_releaseProgress?_a=release-environment-extension&releaseId=12&environmentId=12&extensionId=ms.vss-test-web.test-result-in-release-environment-editor-tab), [test plan results](https://dev.azure.com/marcusfelling/Playground/_testPlans/_results?testCaseId=434&contextPointId=31).

![](/content/uploads/2023/09/test-case-results.png)

## Summary

Hopefully, you were able to follow my examples to get this set up in your own environment. I’d love to hear feedback on anything I may have missed, new features you’d like to see from the product team at Microsoft, or interesting use cases you have experience with.

Happy testing,
Marcus