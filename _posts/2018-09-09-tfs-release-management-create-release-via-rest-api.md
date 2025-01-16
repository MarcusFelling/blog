---
id: 592
title: 'TFS Release Management: Create Release via REST API'
date: '2018-09-09T20:21:08+00:00'
author: Marcus
layout: post
guid: 'https://marcusfelling.com/?p=592'
permalink: /blog/2018/tfs-release-management-create-release-via-rest-api/
wpmdr_menu:
    - '1'
thumbnail-img: /content/uploads/2018/09/CreateReleaseFunction-e1536520560720.png
categories:
    - Uncategorized
---


I recently had to come up with a solution to perform a bulk deploy of all apps to an environment using the latest build artifacts. I wanted to use a “wrapper” release definition to orchestrate all of the deployments; similar to how Octopus Deploy’s [“Deploy Release Step”](https://octopus.com/docs/deployment-process/projects/coordinating-multiple-projects/deploy-release-step) works.

However, TFS Release Management currently lacks functionality to create releases from within a build or release definition. There are [3rd party extensions](https://marketplace.visualstudio.com/search?term=queue%20build&target=VSTS&category=Build%20and%20release&sortBy=Relevance) to queue/trigger other builds within a build definition, but nothing to create releases.

I created a PowerShell script, [CreateRelease.ps1](https://gist.github.com/MarcusFelling/3a0d9387495c0be3ee664dea541b4fc4), that creates a new release for the specified release definition name, using the latest artifact versions available. I created a new “wrapper” release definition, that has multiple “Run a PowerShell script” steps that run [CreateRelease.ps1](https://gist.github.com/MarcusFelling/3a0d9387495c0be3ee664dea541b4fc4), for each release definition I want to create releases for.

At a high level level, the steps that the script performs are as follows:

1. Finds release definition using $ReleaseDefinitionName that’s passed as an argument
2. Gets list of all linked artifacts
3. Gets list of artifact versions
4. Creates a new release using latest version of linked artifacts
5. Wait for deployment to complete (triggered upon release creation)

<script src="https://gist.github.com/MarcusFelling/3a0d9387495c0be3ee664dea541b4fc4.js"></script>