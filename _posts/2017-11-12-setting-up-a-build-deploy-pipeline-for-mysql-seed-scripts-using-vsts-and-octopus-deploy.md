---
id: 467
title: 'Setting up a build/deploy pipeline for MySQL seed scripts using VSTS and Octopus Deploy'
date: '2017-11-12T16:12:41+00:00'
layout: post
guid: 'https://marcusfelling.com/?p=467'
permalink: /blog/2017/setting-up-a-build-deploy-pipeline-for-mysql-seed-scripts-using-vsts-and-octopus-deploy/
nav-short: true
tags: [Octopus Deploy, CICD]
---

My team wanted the ability to populate test data into new data warehouse instances (MySQL on Linux) that are created via [Infrastructure as Code](https://en.wikipedia.org/wiki/Infrastructure_as_Code) (CloudFormation and Chef). They already had the SQL scripts they used for local development, so I would just need to setup a process to package and deploy them. This process would then be automatically triggered when a new instance is created.

## Setting up the VSTS build

The first step will be pretty simple. Copy the SQL scripts from the build source directory (Git repo) to the build staging directory.

**Add a copy step for the SQL scripts**

![copy SQL Scripts](/content/uploads/2017/11/copySQLScripts.png)

Next we will add a shell script to source control that is used to execute the scripts.

<script src="https://gist.github.com/MarcusFelling/1875b97b924562aab3ca1b10fd949d4c.js"></script>

This is a pretty straightforward script. It will be executed on the target server, so we can use localhost along with service account credentials. Add the service account password in Octopus and choose the variable type: “Sensitive” so it is securely passed to the MySQL commands. The script sets the location of the SQL scripts to the directory which Octopus pushes the package to. Back to the build…

**Add a copy step for the shell script**

![copy Shell Script](/content/uploads/2017/11/copyShellScript.png)

You could also just copy everything in one step using contents wildcard \*\* vs. file extension filter…

**Package everything in the build staging directory**

![package NuGet](/content/uploads/2017/11/packageNuGet.png)

I have the version set to $(Version) which is passed in via a [VSTS variable group](https://docs.microsoft.com/en-us/vsts/build-release/concepts/library/variable-groups) so I can manage it across all builds. I use a network share on our build servers to store all packages.

**Push NuGet Package to Octopus**

![push NuGet Package To Octopus](/content/uploads/2017/11/pushNuGetPackageToOctopus.png)

**Create an Octopus release**

![Create Octopus Release](/content/uploads/2017/11/createOctopusRelease.png)

I decided to include the version along with the Git branch name in the release number. I added a build definition variable $(environmentName) and set it to “Settable at queue time”. Setting the environment name will auto-deploy the newly created release to the environment chosen at queue time.

## **Setting up Octopus for the deployment**

Create a new Octopus project or integrate the following steps into an existing project. You can see above that I chose to create a new project call “DataWarehouse”. The following steps will execute on the target through an SSH endpoint. More on setting up Octopus SSH connections [here](https://octopus.com/docs/deployment-targets/ssh-targets/configuring-ssh-connection).

**Add step to push the NuGet package to the target server**

![Push NuGet Package To Server](/content/uploads/2017/11/pushNuGetPackageToServer.png)

The step name is important here as it’s referenced in the Shell script to find the SQL scripts:

`OctopusDrop=$(get_octopusvariable "Octopus.Action[Push seed script package].Output.Octopus.Action.Package.InstallationDirectoryPath")`

**Add a step to execute the shell script**

![Execute Shell Script](/content/uploads/2017/11/ExecuteShellScript.png)

I have the step setup to execute on the deploy target. When the instance is created it is setup with the SSH endpoint, tagged with the DataWarehouse role, and auto-deploys the last successful release to itself.

Time to queue a new build and test it out!