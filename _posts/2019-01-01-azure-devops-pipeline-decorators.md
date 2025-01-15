---
layout: post
title: "Azure DevOps Pipeline Decorators"
date: 2019-01-01 12:00:00 -0500
categories: [Azure DevOps, Pipelines]
---

Azure DevOps Pipeline Decorators allow you to inject steps into the beginning and end of every job in a pipeline. This can be useful for adding common tasks such as setting up environment variables, running security scans, or sending notifications.

## What are Pipeline Decorators?

Pipeline Decorators are a feature in Azure DevOps that allows you to define steps that will be automatically added to the beginning and end of every job in a pipeline. This can be useful for ensuring that certain tasks are always performed, such as setting up environment variables, running security scans, or sending notifications.

## How to Use Pipeline Decorators

To use Pipeline Decorators, you need to create a decorator file and add it to your Azure DevOps repository. The decorator file is a JSON file that defines the steps to be added to the pipeline.

### Step 1: Create a Decorator File

Create a new file in your repository named `azure-pipelines-decorator.json` and add the following content:

```json
{
  "target": "job",
  "execution": {
    "before": {
      "steps": [
        {
          "script": "echo Setting up environment variables",
          "displayName": "Set up environment variables"
        }
      ]
    },
    "after": {
      "steps": [
        {
          "script": "echo Running security scan",
          "displayName": "Run security scan"
        }
      ]
    }
  }
}
```

This decorator file defines two steps: one that runs before the job to set up environment variables, and one that runs after the job to run a security scan.

### Step 2: Add the Decorator File to Your Repository

Add the `azure-pipelines-decorator.json` file to your repository and commit the changes.

### Step 3: Enable the Decorator

To enable the decorator, you need to add a reference to it in your pipeline YAML file. Add the following line to your pipeline YAML file:

```yaml
resources:
  repositories:
    - repository: decorators
      type: git
      name: your-repo-name
      ref: refs/heads/main
      endpoint: your-service-connection
```

This line tells Azure DevOps to use the decorator file from your repository.

## Conclusion

Azure DevOps Pipeline Decorators are a powerful feature that allows you to inject steps into the beginning and end of every job in a pipeline. This can be useful for adding common tasks such as setting up environment variables, running security scans, or sending notifications. By using Pipeline Decorators, you can ensure that these tasks are always performed, improving the consistency and reliability of your pipelines.
