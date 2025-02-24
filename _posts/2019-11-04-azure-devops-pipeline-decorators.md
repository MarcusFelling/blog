---
id: 778
title: 'Azure DevOps Pipeline Decorators'
date: '2019-11-04T20:02:12+00:00'

layout: post
guid: 'https://marcusfelling.com/?p=778'
permalink: /blog/2019/azure-devops-pipeline-decorators/
wpmdr_menu:
    - '1'
thumbnail-img: /content/uploads/2019/11/createextension.png
categories:
    - Uncategorized
nav-short: true
tags: [Azure DevOps, Azure Pipelines]
---


Governance around CI/CD pipelines can be challenging. As the number of your applications and pipelines grow, it’s tough to make sure everybody is playing by the rules. [Pipeline decorators](https://docs.microsoft.com/en-us/azure/devops/extend/develop/add-pipeline-decorator) can help us with this by injecting mandatory steps to the beginning and/or end of each pipeline.

Decorators will allow us to define required steps in one YAML file, that will be applied across all pipelines in an organization. Say our company wants to require running [SonarQube analysis](https://docs.sonarqube.org/latest/analysis/scan/sonarscanner-for-azure-devops/) on all builds for the master branch. Rather than having developers add the SonarQube steps to all of their definitions, we can create a decorator that automatically runs the steps. I’ll walk through what is takes to setup decorators for this scenario. TLDR; create/install an extension with a YAML file that defines the steps to inject.

## Enable the decorators feature at the organization level

Currently Pipeline Decorators are in preview. To enable this preview feature, we’ll need to [enable it at the organization level](https://docs.microsoft.com/en-us/azure/devops/project/navigation/preview-features?view=azure-devops#enable-features-at-the-organization-level-for-all-users).

1. Click on your profile in the upper right -> Preview Features  
    ![](/content/uploads/2019/11/EnablePreviewFeatureDecorators.png)
2. Toggle Pipeline decorators  
    ![](/content/uploads/2019/11/EnablePreviewFeatureDecorators2.png)

## Create an Azure DevOps Extension

1. Create an extension using NodeJS, typescript and tfx-cli. The Microsoft docs walk through this step by step here: <https://docs.microsoft.com/en-us/azure/devops/extend/develop/add-build-task>
2. Edit vss-extension.json and [add contributions for our new pipeline decorators](https://docs.microsoft.com/en-us/azure/devops/extend/develop/add-pipeline-decorator?view=azure-devops#author-a-pipeline-decorator). I want the step that prepares for SonarQube analysis to run at the beginning of the build, and the step that runs the analysis to run at the end of the build. I specify this by using targets `ms.azure-pipelines-agent-job.pre-job-tasks` and `ms.azure-pipelines-agent-job.post-job-tasks`

<script src="https://gist.github.com/MarcusFelling/a93bc07e163df2b6ad4ee6ecd931d2c9.js"></script>

## Create Decorator YAML

Next, we create the YAML files that define the SonarQube steps to inject. For this example, I use [SonarQubeDecoratorPrepare.yml](https://github.com/MarcusFelling/PipelineDecorator/blob/master/SonarQubeDecoratorPrepare.yml "SonarQubeDecoratorPrepare.yml") and [SonarQubeDecoratorAnalysis.yml](https://github.com/MarcusFelling/PipelineDecorator/blob/master/SonarQubeDecoratorAnalysis.yml "SonarQubeDecoratorAnalysis.yml"). The syntax is no different than a typical YAML pipeline. I use [conditional injection](https://docs.microsoft.com/en-us/azure/devops/extend/develop/add-pipeline-decorator?view=azure-devops#conditional-injection) to control when the decorator runs, in this case I only want the tasks to run for the master branch (which is the default branch).  
<script src="https://gist.github.com/MarcusFelling/e662ba61e34ba9a801902bf5e2cd03cd.js"></script><script src="https://gist.github.com/MarcusFelling/2459525147d92eb26c5454a6f5073af5.js"></script>

## Build and install the private extension

There is detailed documentation on this [here](https://docs.microsoft.com/en-us/azure/devops/extend/develop/add-pipeline-decorator?view=azure-devops#installating-the-decorator). When building the extension I like to rev the version number using: `tfx extension create --manifest-globs vss-extension.json <strong>--rev-version`

That way I don’t need to manually update the version in vss-extension.json every time.

After uploading the extension to the marketplace, it’s time to queue a build to test!

## Troubleshooting

To log additional output produced during the build, set system.debugContext to True when queuing a build.

![](/content/uploads/2019/11/debugBuild.png)

This will result in an additional section in the logs containing all of the information about the decorator.

![](/content/uploads/2019/11/AzureDevOpsPipelineDecoratorContextLog.png)

The complete source for the examples above can be found in my GitHub repo here: <https://github.com/MarcusFelling/PipelineDecorator>