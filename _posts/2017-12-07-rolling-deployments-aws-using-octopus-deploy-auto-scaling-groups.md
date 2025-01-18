---
id: 528
title: 'Rolling deployments to AWS using Octopus Deploy and Auto Scaling Groups'
date: '2017-12-07T20:10:19+00:00'

layout: post
guid: 'https://marcusfelling.com/?p=528'
permalink: /blog/2017/rolling-deployments-aws-using-octopus-deploy-auto-scaling-groups/
wpmdr_menu:
    - '1'
thumbnail-img: /content/uploads/2017/12/AWSOctopusDeploy.png
categories:
    - Uncategorized
nav-short: true
---


In order to gracefully deploy releases to our application servers, I wanted to utilize rolling deployments in Octopus Deploy. If you aren’t familiar, rolling deployments slowly roll out a release one instance at a time (vs. all instances at once). The goal of this being reduced overall downtime. To accomplish this, I wrote PowerShell scripts to leverage AWS Auto Scaling Groups (ASG) that are run as part of Octopus deployments.

The deploy process is setup in the following order for each role that use ASG’s (Web servers, enterprise service bus, CMS, etc.):  
1\. Octopus picks first instance to run on  
2\. Instance is placed in standby mode, removing it from the load balancer (EnterStandby.ps1)  
3\. Normal deploy activities run  
4\. Instance exits standby mode, placing it back in service (ExitStandby.ps1)  
Octopus then moves on to next instance…

The deploy steps that are run for a role are grouped. There is a parent step that has the rolling deployment setting, with child steps to perform the deploy activities.  
Example parent step:

![web app rolling deploy](/content/uploads/2017/12/webapprollingdeploy.png)

The first script (EnterStandby.ps1) gets the instance id, gets the ASG name using it’s instance ID, sets an Octopus output variable with the ASG name (that’s referenced in ExitStandby.ps1), then places the instance in standby mode (if it isn’t already).

The second script (ExitStandby.ps1) gets the instance id, gets the ASG name using the Octopus output variable above, exits standby mode using instance ID and ASG Name, then waits until the instance’s state is InService.

## EnterStandby.ps1

<script src="https://gist.github.com/MarcusFelling/18a2bb32f17306f726e59d1175167983.js"></script>## ExitStandby.ps1

<script src="https://gist.github.com/MarcusFelling/a8e555dfa6a22f026f9db377d8988367.js"></script>