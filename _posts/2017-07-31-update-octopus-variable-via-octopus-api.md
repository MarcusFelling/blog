---
id: 336
title: 'Code Sharing (PowerShell): Update Octopus variable via Octopus API'
date: '2017-07-31T19:44:17+00:00'
author: Marcus
layout: post
guid: 'https://marcusfelling.com/?p=336'
permalink: /blog/2017/update-octopus-variable-via-octopus-api/
wpmdr_menu:
    - '1'
thumbnail-img: /content/uploads/2017/07/OctopusTFSVSTS.png
categories:
    - Uncategorized
---


The trace-ability features when linking between Octopus and TFS/VSTS work pretty well out of the box, especially when using the Octopus Deploy build extension. When Releases are created by a build, there is a link in the Release description that points back to the build that created it. There is also a section in the build results that points to the Octopus release that was created. This met most of my needs, but to take it a step further and reference builds/files/artifacts during deploy time, I decided to use the Octopus Deploy API. I wanted to update Octopus variables as part of the build process before a Release is created so that deploy steps could link back to builds/files/artifacts that were versioned during build.

The following script doesn’t have to be used to reference builds, it can be used to update any Octopus variable at all. I’ll let my comments do the talking. Please post in the comment section with any questions or enhancements you may have.

<script src="https://gist.github.com/MarcusFelling/357d62e3d0299b7af49b3a99d0557f51.js"></script>