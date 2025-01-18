---
id: 376
title: 'Configuration Management for Serverless Microservice Projects'
date: '2017-09-05T21:02:53+00:00'
author: Marcus
layout: post
guid: 'https://marcusfelling.com/?p=376'
permalink: /blog/2017/configuration-management-serverless-microservice-projects/
wpmdr_menu:
    - '1'
categories:
    - Uncategorized
nav-short: true
---

Weather you’re using AWS Lambda, Azure Functions, or Google Cloud’s Firebase, you’ll want to re-think how you approach configuration management for serverless projects. The number of projects tend to grow fast because a [microservice](https://martinfowler.com/articles/microservices.html) architecture is most commonly used. This introduces a new set of configuration management problems. Manual tasks to create and manage these projects grows exponentially. Without proper configuration management these projects can quickly spiral into the wild wild west. I’d like to review the principals of SCM and share some solutions for accomplishing these goals when working with serverless/microservice projects.

![Serverless Microservices Configuration Management](/content/uploads/2017/09/ServerlessMicroserviceConfigurationManagement.jpg)

## Configuration identification, control, status accounting, and auditing.

The first SCM goals to focus on are configuration identification, control, status accounting, and auditing. The configuration management solution should be able to identify changes from the baseline state and provide the necessary reviewers a clear view of the changes that are being made. There should be automation in place to notify these reviewers, display a status of where the change is at in the process, and safeguards with auditing that ensure all criteria is met before completing the change.

> Software configuration management is the task of tracking and controlling changes in the software. SCM practices include revision control and the establishment of baselines. If something goes wrong, SCM can determine what was changed and who changed it. If a configuration is working well, SCM can determine how to replicate it across many hosts.

Source control paired with a well thought out branching and merging strategy should accomplish most of these goals. I currently use a customized version of [git-flow](http://nvie.com/posts/a-successful-git-branching-model/) in conjunction with [VSTS.](https://www.visualstudio.com/team-services/) Git-flow’s biggest benefit (In my opinion) is the use of Pull Requests which fulfills SCM goals for change control, status accounting, and auditing. I talked about the VSTS pull request experience in a [previous post](https://marcusfelling.com/blog/2017/gitflow-visual-studio-team-services/). The [State of DevOps Report](https://puppet.com/resources/whitepaper/2014-state-devops-report) shows that source control and peer review is more effective than a change control board. A change control board can really slow things down when serverless projects have potential to release at a faster cadence.

#### Deployment automation

Deployment automation and orchestration also plays a huge role in accomplishing configuration identification. In order to trust your processes you must have reliable, repeatable, and reproducible deployment automation. It should be clear which version of each project is deployed to each environment through a dashboard, along with the many pieces that make up a Release: snapshot of variable values, logs from the deployments, and immutable packages of the artifacts. The deployment process automation should be abstracted so that scripts and steps can be used as functions with different arguments passed. This makes re-use simple for future projects: Clone an existing project’s deploy process and enter the values that are specific to that project.

To accomplish the above, I’ve been using [Octopus Deploy](https://octopus.com/). Octopus Deploy’s biggest value is providing visibility into deployments through it’s dashboard. The team always knows which version/release has been deployed to each environment. It uses lifecycles to enforce the promotion of a release through the pipeline. Manual intervention steps can be used for change control. The deploy process GUI is stupid simple so pretty much anybody on our team can dive in and figure out what’s going on. They also offer integration with a bunch of CI tools so that packaging (NuGet, Zips, Tarballs, etc.), pushing to the artifact repository, and auto-deploying releases, works out of the box.

## Build management – Managing the process and tools used for builds.

The build should provide an automated process that grabs a specific version of code from source control, creates a workspace, captures metadata about the inputs and outputs of the build process, compiles the source files, and checks code quality.

Build management can get tricky with a quickly growing number of build definitions for each serverless/microservice project. Variables should be used wherever there are shared configurations between projects. This way build definitions can be cloned for new projects vs. creating a new one from scratch. Variables should also be used for shared fields such as environments, branches, etc. to cut down on the number of definitions. The build should be run before merging code into the mainline in order to ensure code quality levels are met.

I use [VSTS builds](https://www.visualstudio.com/team-services/continuous-integration/) to accomplish the above. I use Task Groups to define a template of common steps in a build that can be shared across definitions through the use of variables, which I’ve mentioned in a [previous post](https://marcusfelling.com/blog/2017/using-task-groups-tfsvsts/). Quality gates are setup on Pull Requests for change control by running an automated build and requiring that it completes successfully before the change can be merged into the main line. Build definitions are generic for each project with only the variable values being unique so that they can be cloned when creating a new serverless/microservice project. When queuing a build, the user chooses which branch they are using and which environment they want it deployed to.

## Teamwork – Facilitate team interactions related to the process.

This SCM goal is pretty broad but absolutely important. Pull Requests also fulfill a big part of this goal as they provide a collaborative process that let the team discuss changes and agree to merge them once everyone approves. The branch policies are setup to define required criteria before a pull request can be completed which helps guide the process without manual intervention.

We also use [Slack ](https://slack.com/)to collaborate, discuss processes, and integrate with the other tools we use. Build, deployment, work item, logging and other various notifications are sent to the appropriate channel. This is a great alternative to long email chains.

## Defect tracking – Making sure every defect has traceability back to the source.

This is where SCM provides the most value. If you’ve accomplished all of the goals above, this goal should hopefully come pretty easy. Your solution should provide traceability between source control, build, deployment, and work item management. When troubleshooting a defect you should be able to see exactly what the last change was, where it came from, and why.

The toolchain I use integrates really well with one another so that most of the traceability works out of the box:

A change is committed to source control -> A Pull Request is created with a link to the work item that describes the work, a diff shows before and after the change -> a build is run that links to the Pull Request -> a release is created that contains a link to the build, it’s immutable artifacts, and Pull Request -> Change is deployed and displayed on dashboard.

In a future post I’ll dive into technical details on implementing the solutions above. If you have experience with any of these topics feel free to leave comments/questions below.