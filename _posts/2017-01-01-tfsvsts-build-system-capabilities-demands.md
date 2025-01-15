---
layout: post
title: "TFSVSTS Build System Capabilities Demands"
date: 2017-01-01 12:00:00 -0500
categories: [TFS, VSTS, Build, System, Capabilities, Demands]
---

In this post, we will explore the build system capabilities and demands in TFS (Team Foundation Server) and VSTS (Visual Studio Team Services). Understanding these concepts is crucial for optimizing your build and release pipelines.

## Build System Capabilities

Build system capabilities refer to the features and resources available on the build agent. These capabilities can be used to determine which build agent is suitable for running a particular build. There are two types of capabilities:

1. **System Capabilities**: These are automatically detected by the build agent and include information such as the operating system, installed software, and environment variables.
2. **User Capabilities**: These are custom capabilities defined by the user. They can be used to specify additional requirements for the build agent.

### Viewing System Capabilities

To view the system capabilities of a build agent, follow these steps:

1. Navigate to the "Agent pools" page in TFS or VSTS.
2. Select the desired agent pool.
3. Click on the agent you want to view.
4. The "Capabilities" tab will display the system capabilities of the selected agent.

### Adding User Capabilities

To add user capabilities to a build agent, follow these steps:

1. Navigate to the "Agent pools" page in TFS or VSTS.
2. Select the desired agent pool.
3. Click on the agent you want to modify.
4. Click on the "Capabilities" tab.
5. Click on the "Add capability" button.
6. Enter the name and value of the user capability.
7. Click "Save" to add the user capability.

## Build Demands

Build demands are used to specify the requirements for running a build. These demands are matched against the capabilities of the build agents to determine which agent can run the build. There are two types of demands:

1. **System Demands**: These are automatically added based on the tasks and tools used in the build definition.
2. **User Demands**: These are custom demands defined by the user. They can be used to specify additional requirements for the build agent.

### Adding User Demands

To add user demands to a build definition, follow these steps:

1. Navigate to the "Builds" page in TFS or VSTS.
2. Select the desired build definition.
3. Click on the "Options" tab.
4. In the "Demands" section, click on the "Add demand" button.
5. Enter the name and value of the user demand.
6. Click "Save" to add the user demand.

## Conclusion

Understanding build system capabilities and demands is essential for optimizing your build and release pipelines in TFS and VSTS. By leveraging these features, you can ensure that your builds run on the appropriate agents with the necessary resources and requirements. This will help you achieve more efficient and reliable build processes.
