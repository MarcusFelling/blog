---
id: 574
title: 'Setting up a CI pipeline to run functional tests in TFS 2018 and Azure Pipelines (Formerly VSTS)'
date: '2018-07-09T15:58:30+00:00'

layout: post
guid: 'https://marcusfelling.com/?p=574'
permalink: /blog/2018/setting-up-a-ci-pipeline-to-run-functional-tests-in-tfs-2018-and-visual-studio-team-services-vsts/
wpmdr_menu:
    - '1'
thumbnail-img: /content/uploads/2018/07/VSTest.png
categories:
    - Uncategorized
nav-short: true
---


The new TFS/Azure Pipelines build and release tasks to run functional tests make setting up a CI pipeline pretty dang easy. The VSTest task can now run unit tests AND functional tests. Microsoft deprecated the “Run Functional Tests” task in favor of consolidating all things test related. In this post I will outline the steps to: trigger a CI build that builds and packages your functional test project, executes the tests, then provides test run results. This will be fairly high level and I’m going to assume you already know the basics of installing agents and creating build/release definitions.

### 1. Install a build agent that can be used to run the functional tests.

The agent must be installed in interactive mode with auto-logon enabled. There is plenty of documentation on that [here](https://docs.microsoft.com/en-us/vsts/pipelines/agents/agents?view=vsts#account), so I won’t go in to detail. After the agent is installed, add a capability to the agent so we can later restrict our release definition to use the interactive agent only:  
![](/content/uploads/2018/07/interactiveAgentCapability.png)

### 2. Create a build definition to build the project.

This is pretty straightforward: Restore NuGet packages, build solution, then copy output to file share.

![](/content/uploads/2018/07/qaBuild.png)

I also set it to trigger on any changes in my project (CI).  

![](/content/uploads/2018/07/trigger.png)

### 3. Create a release definition that will use the output from the build definition we created, then execute the functional tests.

Set the Artifact to reference the build definition

![](/content/uploads/2018/07/buildartifact.png)

 **Not required:** Replace tokens. I setup my app configs with tokens so I can build my project once, then execute the tests against any environment. I use place holders in my Release build configuration app config that are replaced with variables from the Release definition.  

![](/content/uploads/2018/07/replaceTokens.png)

Use the “Visual Studio Test Platform Installer” step to acquire the test platform from nuget.org (or tools cache). This package contains the full set of binaries for the Visual Studio Test Platform. This means you don’t need to manually install anything on the machine that will be executing the tests.  

![](/content/uploads/2018/07/VSTestPlatformInstaller.png)

Next, use the new VSTest step! I used all the defaults here. The release definition downloads the artifacts, so we can reference $(System.DefaultWorkingDirectory) to search for the test assemblies.  
**Note**: The “Test mix contains UI tests” check box isn’t required. It’s just a reminder to use an interactive agent.  

![](/content/uploads/2018/07/VSTestAssemblies.png)

Finally, set the definition demand so it points to the interactive agent.  

![](/content/uploads/2018/07/agentDemandInteractiveAgent.png)

### 4. Now we can create a new release to run our release definition that will execute the tests and gather test run results.

Happy testing!