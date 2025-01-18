---
id: 603
title: 'Deploying IIS hosted ASP.NET Core apps using app_offline.htm'
date: '2018-09-20T20:12:14+00:00'
author: Marcus
layout: post
guid: 'https://marcusfelling.com/?p=603'
permalink: /blog/2018/deploying-iis-hosted-asp-net-core-apps-using-app_offline-htm/
wpmdr_menu:
    - '1'
thumbnail-img: /content/uploads/2018/09/websitertemporarilyoffline.jpg
categories:
    - Uncategorized
nav-short: true
---

In the past, I’ve used the method of placing a app\_offline.htm file at the root of an IIS website to throw up a maintenance page. This has been available since ASP.NET 2.0 / 3.5. Lately I’ve got used to deploying sites with no downtime approaches, such as [rolling](https://marcusfelling.com/blog/2017/rolling-deployments-aws-using-octopus-deploy-auto-scaling-groups/) and blue/green. I had forgot about app\_offline.htm when I recently set up deployment pipelines for some ASP.NET Core sites.

Downtime wasn’t a concern for these sites and I didn’t really think a maintenance page was necessary. These were internal apps only that are rarely updated.

At first I setup deployment steps to:

1. `iisreset /stop`
2. Copy files to sites using Robocopy
3. `iisreset /start`

This worked fine the *first* deployment. However, subsequent file copies would error with “The process cannot access the file because it is being used by another process.”. I tried manually killing the dotnet.exe processes in task manager, then the file copy would proceed.

As a hack, I added some PowerShell to the deployment to kill the dotnet.exe processes:  
<script src="https://gist.github.com/MarcusFelling/ef56317fb78dfa725428eacd6d9163e1.js"></script>

I then had an Aha! moment after speaking with a an old coworker. Use app\_offline.htm to gracefully shutdown the app!

I removed the steps to stop/start IIS and simply added a PowerShell step to add the app\_offline.htm file.

From the [Microsoft Docs](https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/aspnet-core-module?view=aspnetcore-2.1#app_offlinehtm):

> If a file with the name *app\_offline.htm* is detected in the root directory of an app, the ASP.NET Core Module attempts to gracefully shutdown the app and stop processing incoming requests. If the app is still running after the number of seconds defined in `shutdownTimeLimit`, the ASP.NET Core Module kills the running process.
> 
> While the *app\_offline.htm* file is present, the ASP.NET Core Module responds to requests by sending back the contents of the *app\_offline.htm* file. When the *app\_offline.htm* file is removed, the next request starts the app.