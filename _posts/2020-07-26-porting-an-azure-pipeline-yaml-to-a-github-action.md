---
id: 904
title: 'Porting an Azure Pipeline (YAML) to a GitHub Action'
date: '2020-07-26T20:04:31+00:00'
layout: post
guid: 'https://marcusfelling.com/?p=904'
permalink: /blog/2020/porting-an-azure-pipeline-yaml-to-a-github-action/
thumbnail-img: /content/uploads/2020/07/GitHubActionsAzurePipelines.png
nav-short: true
tags: [Azure DevOps, GitHub Actions, CICD]

---

I’ve been a long time user of Azure Pipelines. It’s a very mature and powerful platform, that integrates really well with other parts of the Azure DevOps suite, to provide end-to-end traceability of the software development lifecycle. However, Microsoft is investing heavily in GitHub which now has some very appealing capabilities: source code security, development insights and analytics, open source and innersource management, etc. As these new capabilities get built out in GitHub, I’d like to explore what is takes to move things over. In this post I’ll be documenting what it takes to port one of my existing Azure Pipelines (YAML) to GitHub Actions.

## The Space Game Azure Pipeline

My existing Azure Pipeline builds and deploys the open source [MSLearn Tailspin Space Game](https://github.com/MicrosoftDocs/mslearn-tailspin-spacegame-web). I have a fork of the repo hosted in my GitHub repo [here](https://github.com/MarcusFelling/Demo.SpaceGame/tree/port-pipeline), which includes **azure-pipelines.yml**. The `build` stage builds the dotnet web project, runs unit tests, then publishes a pipeline artifact named `drop`. The `Dev` stage takes the `drop` artifact and deploys it to an Azure Web App.

![](/content/uploads/2020/07/image-3.png)

## Taking an inventory of dependencies

Before I get started porting this over to GitHub Actions, I need to take an inventory of the Azure DevOps dependencies I’m using in my pipeline.

- **Variables**: I try to use predefined/system variables when possible to dynamically assign values and prevent hardcoding, e.g. Build.BuildId, Build.ArtifactStagingDirectory, Build.SourcesDirectory. I’ll need to convert these to what GitHub Actions calls [environment variables](https://docs.github.com/en/actions/configuring-and-managing-workflows/using-environment-variables#default-environment-variables).
- **Variable Group:** My pipeline also uses a variable group to store variables that are shared across some of my other pipelines. I can move sensitive variables to GitHub [encrypted secrets](https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets), which offers similar functionality.
- **Service Connection**: My pipeline uses an Azure DevOps [Service Connection](https://docs.microsoft.com/en-us/azure/devops/pipelines/library/connect-to-azure?view=azure-devops) to authenticate the pipeline agent to my Azure Resource Group in order to deploy the web app. In GitHub, I’ll authenticate using [Azure Web App Publish Profile](https://github.com/projectkudu/kudu/wiki/Deployment-credentials#site-credentials-aka-publish-profile-credentials).
- **Microsoft-Hosted Agents:** My pipeline is setup to execute the pipeline tasks on a Microsoft-Hosted agent. The build stage uses the vs2017-win2016 image, and the deploy stage uses the Ubuntu-16.04 image. The equivalent in GitHub Actions is the [hosted machine pools](https://github.com/actions/virtual-environments), which offers images for Windows Server 2016 ([windows-2016](https://github.com/actions/virtual-environments/blob/main/images/win/Windows2016-Readme.md)) and Ubuntu 16.04 ([ubuntu-16.04](https://github.com/actions/virtual-environments/blob/main/images/linux/Ubuntu1604-README.md)).

## Porting to GitHub Actions

Rumor has it the Microsoft and GitHub teams are working together on migration tools to help with this, but for now I’ll need to manually port by mapping each piece of my Azure Pipeline to a new GitHub Action. I’ll start by creating a new GitHub Action by creating a workflow. “Workflow” is a suitable name, because Actions can do more than just CI/CD. They’re capable of automating just about anything in your workflow processes, such as creating an issue or tagging a new release.

As soon as I click on the Actions tab in my repository, GitHub will come up with suggested starter templates, based on the language/framework in my source code. I have the option to start with the dotnet core template, but I’m going to start from scratch then try to mimic my Azure Pipeline. This gets me a new yaml file in the directory repositoryname/[.](https://github.com/MarcusFelling/github-branch-protector/tree/master/.github)github/**workflows**.

## Starting at the top

In my Azure Pipeline I generate the build number by using semantic major.minor.patch version, in which major and minor are defined variables, and patch uses a [counter expression](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/expressions?view=azure-devops) to reset to 0 if major or minor are changed: `$[counter(format('{0}.{1}', variables['Major'], variables['Minor']), 0)]` In GitHub Actions, the name of the pipeline is defined at the top of the document and the run # is incremented each run. I’ll stick with the same naming convention and call my Action “MarcusFelling.Demo.SpaceGame”.

To mirror what I have in the Azure Pipeline, I’ll set up the Action to trigger on all pushes to my repo. In Azure Pipelines, this is the default when no trigger is defined.

```
# Trigger on push
on: push
```

Next, I’ll define my static variables. I can copy the variables section and rename if to env. I can then add the non-secret variables from my variable group and copy the secret variables to my repositories’ secret configuration. Later on, I’ll swap out predefined variables that are referenced in tasks with fitting environment variables, using the syntax ${{ env.VARIABLENAME }}.

```
env:
  buildConfiguration: 'Release'
  serviceConnection: 'tailspin-space-game-rg'
  appName: 'tailspin-space-game-web'
  appID: '26178'
  wwwrootDir: 'Tailspin.SpaceGame.Web/wwwroot'
  environmentName: 'Dev'
```

## Stages -> Jobs, Jobs -> Jobs, Tasks -> Steps

A workflow is made up of one or more jobs. I can map my stages and jobs from Azure Pipelines to jobs, then map tasks to steps.

In my Build and Deploy jobs, I’ll change `vmImage` to `runs-on`, and `dependsOn` to `needs`, to make sure the build job always runs before the deploy:

```
jobs:
  build:
    runs-on: windows-2016

  deploy:
    runs-on: ubuntu-latest
    needs: build
```

Next, I can download my source code to the agent using: `actions/checkout@v2`, as apposed to the Azure Pipelines sources tab. I’ll only need this for my build job.

```
jobs:
  build:
    runs-on: windows-2016
    steps:
    - uses: actions/checkout@v2
```

Now that I have my scaffolding, I can convert my tasks to steps. I’ll be able to use the `run` Action to run inline scripts for most things.

```
      - name: Run npm install
        run: npm install

      - name: Compile Sass assets
        run: ./node_modules/.bin/node-sass ${{ env.wwwrootDir }} --output ${{ env.wwwrootDir }}

      - name: Install Gulp CLI
        run: npm install gulp-cli
        
      - name: Run Gulp tasks
        run: gulp --gulpfile "${{ github.workspace }}\gulpfile.js"
          
      - name: Install dependencies
        run: dotnet restore
        
      - name: Build web project
        run: dotnet build "${{ github.workspace }}\Tailspin.SpaceGame.Web\Tailspin.SpaceGame.Web.csproj" --configuration ${{ env.buildConfiguration }} --no-restore
        
      - name: Test
        run: dotnet test "${{ github.workspace }}\Tailspin.SpaceGame.Web.Tests\Tailspin.SpaceGame.Web.Tests.csproj" --no-restore --verbosity normal
   
      - name: publish
        run: dotnet publish "${{ github.workspace }}\Tailspin.SpaceGame.Web\Tailspin.SpaceGame.Web.csproj" --no-build --configuration ${{ env.buildConfiguration }} --output ${{ github.workspace }}\${{ env.buildConfiguration }}\Artifact
```

Lastly, I’ll upload my published .zip as an artifact using the `actions/upload-artifact@v2` Action.

```
        # Publish zip as build artifact
      - name: Upload a Build Artifact
        uses: actions/upload-artifact@v2
        with:
          name: drop
          path: ${{ github.workspace }}\${{ env.buildConfiguration }}\Artifact\*
```

## Deploy

I’ll start the deploy job by downloading my build artifact to the agent’s workspace by using the `actions/download-artifact@v2` Action.

```
  deploy:
    runs-on: ubuntu-latest
    needs: build
    steps:
    - name: Download a Build Artifact
      uses: actions/download-artifact@v2
      with:
        # Artifact name
        name: drop
        # Destination path
        path: ${{ github.workspace }}
```

Then I can use the `azure/webapps-deploy@v2` Action to deploy the .zip package, using my publish profile that saved as an [encrypted secret](https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets).

```
    - name: 'Deploy to Azure WebApp'
      uses: azure/webapps-deploy@v2
      with:
        app-name: ${{ env.appName }}-${{ env.environmentName }}-${{ env.appID }}
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
```

## Summary

Every push to my repository will now trigger the workflow to run:

![](/content/uploads/2020/07/image-4.png)

GitHubs Actions has a lot in common with Azure Pipelines, so it’s less of a learning curve compared to starting out with a completely different platform, such as CircleCI, Jenkins, or GitLab. If you’re using other areas of the Azure DevOps suite, you’ll also get a bunch of integrations between the platforms such as [Azure Boards](https://docs.microsoft.com/en-us/azure/devops/boards/github/?view=azure-devops). For anybody currently using Azure Pipelines, I’d recommend identifying opportunities to automate workflows with GitHub Actions. Azure DevOps isn’t going away any time soon, but GitHub has some compelling capabilities, with the largest developer community and platform in the world.