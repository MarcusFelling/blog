---
id: 1197
title: '6 Nifty GitHub Actions Features 🚀'
date: '2023-03-08T19:23:17+00:00'
layout: post
guid: 'https://marcusfelling.com/?p=1197'
permalink: /blog/2023/6-nifty-github-actions-features/
thumbnail-img: /content/uploads/2023/03/Octocat-with-sunglasses-launching-rocket.png
nav-short: true
tags: [GitHub Actions, CICD]
---

I’ve been having a lot of fun with GitHub Actions lately and wanted to document some of the features I regularly use, including some tips and tricks.

## 1. Create separate environments for development, staging, and production

GitHub Actions has an [environments feature](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment) to describe a deployment target such as dev, staging, or production. By referencing the environment in a job, you can take advantage of [protection rules](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment#environment-protection-rules) and/or [secrets](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment#environment-secrets) that get scoped to the environment. Some potential use cases include requiring a particular person or team to approve workflow jobs that reference an environment (e.g. manual approval before production deploy), or limiting which branches can deploy to a particular environment. I also like to set the environment URL so it’s easily accessible from the summary page:

![](/content/uploads/2023/03/image.png){: .img-fluid }

## 2. Establish workflow breakpoints with dependencies

By default, GitHub Actions runs multiple commands simultaneously. However, you can utilize the `needs` keyword to [create dependencies between jobs](https://docs.github.com/en/actions/learn-github-actions/managing-complex-workflows#creating-dependent-jobs), meaning that if a job fails (e.g. tests), dependent jobs won’t run. This also helps you control jobs which jobs run in parallel; if there aren’t dependencies between steps, break them out into separate jobs, then set their `needs` to the next step in the process.

e.g. my app, database, and infra as code projects can be built at the same time before deploying to dev:

![](/content/uploads/2023/03/image-1.png){: .img-fluid }

## 3. Use secrets to store sensitive workflow data

GitHub’s secrets allow you to securely store sensitive data, including passwords, tokens, certificates, etc. You can directly reference secrets in workflows, meaning that you can create and share workflows with colleagues that employ secrets for secure values without hardcoding them directly into YAML workflow files. I like to scope the secrets close to the steps that require them. For example, rather than setting a secret for the entire workflow to access, it can be set for the job that contains steps that reference the secret.

e.g. Only the Playwright test job needs to reference AzureAD creds:

![](/content/uploads/2023/03/image-2.png){: .img-fluid }

## 4. Conditionals can aid in differences between environments

GitHub Actions allows you to use conditionals that employ the “if” keyword to decide whether a step should run. You can use this feature to develop dependencies so that if a dependent job fails, the workflow can continue running. You can also use specific built-in functions for data operations, as well as leverage status check functions to determine whether preceding steps have succeeded, failed, canceled, or disrupted. Moreover, you can use conditionals to share workflow data among different branches and forks, with steps tailored to different triggers or environments. The conditions can also be set in reusable workflows to toggle different steps between environments:

e.g. I want reusable workflows to be uniform across environments, with the exception of steps that are only based on environmentName conditionals:

<script src="https://gist.github.com/MarcusFelling/a24904731e73dd9b2bddeade2c459948.js"></script>

## 5. Share data between jobs to aid in “build once, deploy many”

GitHub Actions enables you to share data between jobs in any workflow as [artifacts](https://docs.github.com/en/actions/using-workflows/storing-workflow-data-as-artifacts), which are linked to the workflow run where they are produced. This can help simplify the creation of workflows and facilitate the development of more complex automation where one workflow informs another via dependencies or conditionals. This also helps enable the mantra “build once, deploy many”. In other words, build projects in an environment-agnostic fashion, upload them as artifacts, then all deployment jobs use the same set of artifacts across environments.

## 6. Use contexts to access workflow information

[Contexts ](https://docs.github.com/en/actions/learn-github-actions/contexts)represent a group of variables that can access details about workflow runs, runner environments, jobs, and steps to help derive key information about workflow operations. Contexts use expression syntax such as ${{ }}, and you can use most of them at any point in the workflow. I like to dump the entire context at the beginning of jobs to aid in troubleshooting:

<script src="https://gist.github.com/MarcusFelling/01d9e6ed08b3677b9aad5adb3a624aca.js"></script>

## Wrapping up

I’m curious to learn about other ways folks are leveraging GitHub Actions features. Add a comment to this post with any tips or tricks you’ve used with GitHub Actions!