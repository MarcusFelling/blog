---
id: 426
title: 'TFS/VSTS Build  System Capabilities and Demands'
date: '2017-09-27T21:05:18+00:00'
author: Marcus
layout: post
guid: 'https://marcusfelling.com/?p=426'
permalink: /blog/2017/tfsvsts-build-system-capabilities-demands/
wpmdr_menu:
    - '1'
categories:
    - Uncategorized
---

## System Capabilities

If you’ve installed or used private builds agent for VSTS or TFS, you’ve probably noticed the Agent’s System Capabilities are listed in the Agent Pool hub (https://ACCOUNTNAME.visualstudio.com/\_admin/\_AgentPool):

![Agent System Capabilities](/content/uploads/2017/09/agentCapabilities-1024x441.png)

These capabilities are automatically discovered when registering the agent. The agent’s capabilities are cataloged so that only the builds and releases it can handle are assigned to it. For example, if your build includes a MSBuild 15.0 task, then the build won’t run unless there’s a build agent in the pool that has MSBuild 15.0 installed.

Note: You’ll need to restart (possibly even re-configure) your agent to update capabilities that are added/removed.

## Demands

The requirements for capabilities are controlled in the build definition’s Demands section (under Options). Demands are automatically added if required by the build steps in the definition. The demands can have conditions that check if the capabilities exist, or equal a value.

![build Definition Demands](/content/uploads/2017/09/buildDefinitionDemands-1024x603.png)

## Taking demands a step further for troubleshooting

I was just recently troubleshooting a build that ran fine on one build machine, but not the others. In order to control the pool/agents that the build ran on, I added a new demand to the definition:

![agent MachineName variable VSTS build](/content/uploads/2017/09/agent.MachineName.png)

I then added the variable AgentComputerName to the definition and set it to “Settable at queue time”. This way I could queue a build, enter the machine name I wanted it to run on, and the demand would ensure the assigned agent ran on the chosen machine.