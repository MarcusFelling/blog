---
id: 723
title: 'Start-IISCommitDelay / Stop-IISCommitDelay'
date: '2019-06-19T17:46:53+00:00'
layout: post
guid: 'https://marcusfelling.com/?p=723'
permalink: /blog/2019/start-iiscommitdelay-stop-iiscommitdelay/
thumbnail-img: /content/uploads/2019/06/ImportModuleIISAdministration.png
nav-short: true
tags: [CICD]
---

Today I discovered the Start-IISCommitDelay and Stop-IISCommitDelay cmdlets available in the IISAdministration module. In the past I’ve randomly encountered errors when issuing back to back commands that modify the applicationHost.config file:

```powershell
Filename: \\?\C:\Windows\system32\inetsrv\config\applicationHost.config
Error: Cannot write configuration file
```

A workaround that works *most* of the time, is adding start-sleeps to ensure the previous command is complete before beginning the next one. However, adding a bunch of sleeps makes for some ugly code and the scripts will take longer than necessary.

Example:

```powershell
"Setting app pool start mode to Always Running"
Set-ItemProperty $appPoolPath -Name startMode -Value 1 #1 = AlwaysRunning, 0 = OnDemand  

"Sleeping for 10 seconds to avoid conflicts on applicationHost.config"
start-sleep -s 10 
     
"Setting app pool idle timeout to 0 (No Timeout)"
Set-ItemProperty $appPoolPath -Name processModel.idleTimeout -Value "00:00:00" #0 = No timeout
```

##  Start-IISCommitDelay / Stop-IISCommitDelay 

From the docs:

> *“By enclosing your operations between these commands, you can make sure that your changes are committed at the same time.”*
> 
> <cite> [https://docs.microsoft.com/en-us/iis/get-started/whats-new-in-iis-10/iisadministration-powershell-cmdlets#start-iiscommitdelay–stop-iiscommitdelay](https://docs.microsoft.com/en-us/iis/get-started/whats-new-in-iis-10/iisadministration-powershell-cmdlets#start-iiscommitdelay--stop-iiscommitdelay) </cite>

If I convert my previous example, it would look like this:

```powershell
"Delay the commitment of changes to IIS until Stop-IISCommitDelay cmdlet is executed below"
Start-IISCommitDelay

"Setting app pool start mode to Always Running"
Set-ItemProperty $appPoolPath -Name startMode -Value 1 #1 = AlwaysRunning, 0 = OnDemand   
     
"Setting app pool idle timeout to 0 (No Timeout)"
Set-ItemProperty $appPoolPath -Name processModel.idleTimeout -Value "00:00:00" #0 = No timeout

"Instruct IIS configuration system to resume commitment of changes."
Stop-IISCommitDelay
```

In summary, using these cmdlets will allow us to make IIS configuration changes in bulk, while avoiding conflicts with the applicationHost.config file.