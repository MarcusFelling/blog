---
layout: post
title: "Porting an Azure Pipeline YAML to a GitHub Action"
date: 2020-01-01
categories: azure pipelines github actions
---

In this post, we will discuss how to port an Azure Pipeline YAML to a GitHub Action. This can be useful if you are migrating your CI/CD pipelines from Azure DevOps to GitHub Actions.

## Why Port to GitHub Actions?

GitHub Actions is a powerful CI/CD platform that is tightly integrated with GitHub. It offers many features and benefits, including:

- Native integration with GitHub repositories
- Extensive marketplace of pre-built actions
- Flexible and customizable workflows
- Free tier for public repositories

## Example Azure Pipeline YAML

Let's start with an example Azure Pipeline YAML file:

```yaml
trigger:
- main

pool:
  vmImage: 'ubuntu-latest'

steps:
- task: UseNode@2
  inputs:
    version: '14.x'
- script: npm install
- script: npm test
```

## Porting to GitHub Actions

To port this Azure Pipeline YAML to a GitHub Action, we need to create a new workflow file in the `.github/workflows` directory of our repository. Let's create a file named `ci.yml` with the following content:

```yaml
name: CI

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout repository
      uses: actions/checkout@v2

    - name: Set up Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '14'

    - name: Install dependencies
      run: npm install

    - name: Run tests
      run: npm test
```

## Explanation

Let's break down the GitHub Action workflow file:

- `name: CI`: This sets the name of the workflow.
- `on: push: branches: - main`: This triggers the workflow on pushes to the `main` branch.
- `jobs: build: runs-on: ubuntu-latest`: This defines a job named `build` that runs on the `ubuntu-latest` virtual environment.
- `steps`: This defines the steps to be executed in the job.
  - `name: Checkout repository`: This step uses the `actions/checkout` action to check out the repository.
  - `name: Set up Node.js`: This step uses the `actions/setup-node` action to set up Node.js version 14.
  - `name: Install dependencies`: This step runs `npm install` to install the project dependencies.
  - `name: Run tests`: This step runs `npm test` to execute the tests.

## Conclusion

Porting an Azure Pipeline YAML to a GitHub Action is a straightforward process. By following the steps outlined in this post, you can easily migrate your CI/CD pipelines to GitHub Actions and take advantage of its powerful features and benefits.
