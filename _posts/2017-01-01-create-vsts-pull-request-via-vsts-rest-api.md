---
layout: post
title: "Create VSTS Pull Request via VSTS REST API"
date: 2017-01-01 12:00:00 -0500
categories: [VSTS, REST API, Pull Request]
---

In this post, we will explore how to create a pull request in VSTS (Visual Studio Team Services) using the VSTS REST API. This can be useful for automating the process of creating pull requests as part of your CI/CD pipeline.

## Prerequisites

Before you begin, make sure you have the following prerequisites:

- A VSTS account and a personal access token (PAT)
- A project in VSTS with a repository
- A branch that you want to create a pull request for

## Step 1: Generate a Personal Access Token (PAT)

To authenticate with the VSTS REST API, you need to generate a personal access token (PAT). Follow these steps to generate a PAT:

1. Go to your VSTS account and click on your profile picture in the top right corner.
2. Select "Security" from the dropdown menu.
3. Click on "New Token" to create a new personal access token.
4. Give your token a name and select the scopes you need (e.g., "Code (read and write)").
5. Click "Create Token" and copy the token to a secure location.

## Step 2: Create a Pull Request

To create a pull request using the VSTS REST API, you need to make a POST request to the following endpoint:

```
POST https://dev.azure.com/{organization}/{project}/_apis/git/repositories/{repositoryId}/pullRequests?api-version=6.0
```

Replace `{organization}`, `{project}`, and `{repositoryId}` with your VSTS organization name, project name, and repository ID, respectively.

### Example Request

Here is an example of how to create a pull request using the VSTS REST API with curl:

```sh
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic $(echo -n :<your_pat> | base64)" \
  -d '{
    "sourceRefName": "refs/heads/feature-branch",
    "targetRefName": "refs/heads/master",
    "title": "My Pull Request",
    "description": "This is a pull request created via the VSTS REST API.",
    "reviewers": [
      {
        "id": "<reviewer_id>"
      }
    ]
  }' \
  https://dev.azure.com/{organization}/{project}/_apis/git/repositories/{repositoryId}/pullRequests?api-version=6.0
```

In this example, replace `<your_pat>` with your personal access token and `<reviewer_id>` with the ID of the reviewer you want to add to the pull request.

## Step 3: Automate the Process

You can automate the process of creating pull requests by integrating the VSTS REST API into your CI/CD pipeline. For example, you can use a script to create a pull request after a successful build.

### Example Script

Here is an example script that you can use to create a pull request in your CI/CD pipeline:

```sh
#!/bin/bash

# Variables
organization="your_organization"
project="your_project"
repositoryId="your_repository_id"
sourceBranch="refs/heads/feature-branch"
targetBranch="refs/heads/master"
title="My Pull Request"
description="This is a pull request created via the VSTS REST API."
reviewerId="reviewer_id"
pat="your_pat"

# Create Pull Request
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic $(echo -n :$pat | base64)" \
  -d '{
    "sourceRefName": "'$sourceBranch'",
    "targetRefName": "'$targetBranch'",
    "title": "'$title'",
    "description": "'$description'",
    "reviewers": [
      {
        "id": "'$reviewerId'"
      }
    ]
  }' \
  https://dev.azure.com/$organization/$project/_apis/git/repositories/$repositoryId/pullRequests?api-version=6.0
```

In this script, replace the variables with your own values.

## Conclusion

By using the VSTS REST API, you can automate the process of creating pull requests in VSTS. This can help streamline your development workflow and improve collaboration within your team. With the examples provided in this post, you can get started with creating pull requests via the VSTS REST API and integrate it into your CI/CD pipeline.
