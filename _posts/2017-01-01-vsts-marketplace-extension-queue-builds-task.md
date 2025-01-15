---
layout: post
title: "VSTS Marketplace Extension Queue Builds Task"
date: 2017-01-01 12:00:00 -0500
categories: [VSTS, Marketplace, Extension]
---

In this post, we will explore how to create a VSTS Marketplace extension that queues builds. VSTS (Visual Studio Team Services) is a cloud-based service for version control, build, and release management. By creating a custom extension, you can extend the functionality of VSTS to meet your specific needs.

## Prerequisites

Before you begin, make sure you have the following prerequisites:

- A VSTS account and a personal access token (PAT)
- Node.js and npm installed on your machine
- Visual Studio Code or another code editor

## Step 1: Create a New Extension

First, create a new directory for your extension and navigate to it in your terminal. Then, run the following command to create a new extension using the `tfx` CLI:

```sh
tfx extension init --publisher your_publisher_name --extension-id queue-builds-task --name "Queue Builds Task" --targets AzureDevOps --manifest-globs vss-extension.json
```

This command will create a new extension with the necessary files and directories.

## Step 2: Define the Task

Next, navigate to the `tasks` directory within your extension and create a new directory named `QueueBuilds`. Inside the `QueueBuilds` directory, create a new file named `task.json` and add the following code to define the task:

```json
{
  "id": "your-task-id",
  "name": "QueueBuilds",
  "friendlyName": "Queue Builds",
  "description": "Queues a build in VSTS",
  "helpMarkDown": "",
  "category": "Build",
  "author": "Your Name",
  "version": {
    "Major": 1,
    "Minor": 0,
    "Patch": 0
  },
  "instanceNameFormat": "Queue a build",
  "inputs": [
    {
      "name": "buildDefinition",
      "type": "string",
      "label": "Build Definition",
      "defaultValue": "",
      "required": true,
      "helpMarkDown": "The name of the build definition to queue."
    },
    {
      "name": "branch",
      "type": "string",
      "label": "Branch",
      "defaultValue": "refs/heads/master",
      "required": true,
      "helpMarkDown": "The branch to queue the build for."
    }
  ],
  "execution": {
    "Node": {
      "target": "queuebuilds.js"
    }
  }
}
```

This `task.json` file defines the task's metadata, inputs, and execution details.

## Step 3: Implement the Task

Next, create a new file named `queuebuilds.js` in the `QueueBuilds` directory and add the following code to implement the task:

```js
const tl = require('azure-pipelines-task-lib/task');
const azdev = require('azure-devops-node-api');

async function run() {
  try {
    const buildDefinition = tl.getInput('buildDefinition', true);
    const branch = tl.getInput('branch', true);

    const orgUrl = tl.getVariable('System.TeamFoundationCollectionUri');
    const project = tl.getVariable('System.TeamProject');

    const token = tl.getEndpointAuthorizationParameter('SystemVssConnection', 'AccessToken', false);
    const authHandler = azdev.getPersonalAccessTokenHandler(token);
    const connection = new azdev.WebApi(orgUrl, authHandler);

    const buildApi = await connection.getBuildApi();
    const build = await buildApi.queueBuild({
      definition: { name: buildDefinition },
      sourceBranch: branch
    }, project);

    console.log(`Build queued: ${build.id}`);
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();
```

This `queuebuilds.js` file uses the Azure DevOps Node API to queue a build in VSTS.

## Step 4: Package and Publish the Extension

Finally, package and publish your extension to the VSTS Marketplace. Run the following command to package the extension:

```sh
tfx extension create --manifest-globs vss-extension.json
```

Then, run the following command to publish the extension:

```sh
tfx extension publish --publisher your_publisher_name --manifest-globs vss-extension.json --token your_pat
```

## Conclusion

By creating a custom VSTS Marketplace extension, you can extend the functionality of VSTS to meet your specific needs. In this post, we explored how to create an extension that queues builds in VSTS. With this extension, you can automate the process of queuing builds and streamline your development workflow.
