---
id: 723
title: 'Start-IISCommitDelay / Stop-IISCommitDelay'
date: '2019-06-19T17:46:53+00:00'
author: Marcus
layout: post
guid: 'https://test.local/?p=723'
permalink: /blog/2019/start-iiscommitdelay-stop-iiscommitdelay/
wpmdr_menu:
    - '1'
image: /wp-content/uploads/2019/06/ImportModuleIISAdministration.png
categories:
    - Uncategorized
---

Today I discovered the Start-IISCommitDelay and Stop-IISCommitDelay cmdlets available in the IISAdministration module. In the past I’ve randomly encountered errors when issuing back to back commands that modify the applicationHost.config file:

```
Filename: \\?\C:\Windows\system32\inetsrv\config\applicationHost.config
Error: Cannot write configuration file
```

A workaround that works *most* of the time, is adding start-sleeps to ensure the previous command is complete before beginning the next one. However, adding a bunch of sleeps makes for some ugly code and the scripts will take longer than necessary.

Example:

```
<span style="color:#800000; ">"</span><span style="color:#0000e6; ">Setting app pool start mode to Always Running</span><span style="color:#800000; ">"</span>
<span style="color:#666616; ">Set-ItemProperty</span> <span style="color:#797997; ">$appPoolPath</span> <span style="color:#074726; ">-Name</span> <span style="color:#0000e6; ">startMode</span> <span style="color:#074726; ">-Value</span> <span style="color:#008c00; ">1</span> <span style="color:#696969; ">#1 = AlwaysRunning, 0 = OnDemand  </span>

<span style="color:#800000; ">"</span><span style="color:#0000e6; ">Sleeping for 10 seconds to avoid conflicts on applicationHost.config</span><span style="color:#800000; ">"</span>
<span style="color:#666616; ">start-sleep</span> <span style="color:#074726; ">-s</span> <span style="color:#008c00; ">10</span> 
     
<span style="color:#800000; ">"</span><span style="color:#0000e6; ">Setting app pool idle timeout to 0 (No Timeout)</span><span style="color:#800000; ">"</span>
<span style="color:#666616; ">Set-ItemProperty</span> <span style="color:#797997; ">$appPoolPath</span> <span style="color:#074726; ">-Name</span> <span style="color:#0000e6; ">processModel.idleTimeout</span> <span style="color:#074726; ">-Value</span> <span style="color:#800000; ">"</span><span style="color:#0000e6; ">00:00:00</span><span style="color:#800000; ">"</span> <span style="color:#696969; ">#0 = No timeout</span>
```

##  Start-IISCommitDelay / Stop-IISCommitDelay 

From the docs:

> *“By enclosing your operations between these commands, you can make sure that your changes are committed at the same time.”*
> 
> <cite> [https://docs.microsoft.com/en-us/iis/get-started/whats-new-in-iis-10/iisadministration-powershell-cmdlets#start-iiscommitdelay–stop-iiscommitdelay](https://docs.microsoft.com/en-us/iis/get-started/whats-new-in-iis-10/iisadministration-powershell-cmdlets#start-iiscommitdelay--stop-iiscommitdelay) </cite>

If I convert my previous example, it would look like this:

```
<span style="color:#800000; ">"</span><span style="color:#0000e6; ">Delay the commitment of changes to IIS until Stop-IISCommitDelay cmdlet is executed below</span><span style="color:#800000; ">"</span>
<span style="color:#005fd2; ">Start-IISCommitDelay</span>

<span style="color:#800000; ">"</span><span style="color:#0000e6; ">Setting app pool start mode to Always Running</span><span style="color:#800000; ">"</span>
<span style="color:#666616; ">Set-ItemProperty</span> <span style="color:#797997; ">$appPoolPath</span> <span style="color:#074726; ">-Name</span> <span style="color:#0000e6; ">startMode</span> <span style="color:#074726; ">-Value</span> <span style="color:#008c00; ">1</span> <span style="color:#696969; ">#1 = AlwaysRunning, 0 = OnDemand   </span>
     
<span style="color:#800000; ">"</span><span style="color:#0000e6; ">Setting app pool idle timeout to 0 (No Timeout)</span><span style="color:#800000; ">"</span>
<span style="color:#666616; ">Set-ItemProperty</span> <span style="color:#797997; ">$appPoolPath</span> <span style="color:#074726; ">-Name</span> <span style="color:#0000e6; ">processModel.idleTimeout</span> <span style="color:#074726; ">-Value</span> <span style="color:#800000; ">"</span><span style="color:#0000e6; ">00:00:00</span><span style="color:#800000; ">"</span> <span style="color:#696969; ">#0 = No timeout</span>

<span style="color:#800000; ">"</span><span style="color:#0000e6; ">Instruct IIS configuration system to resume commitment of changes.</span><span style="color:#800000; ">"</span>
<span style="color:#005fd2; ">Stop-IISCommitDelay</span>
```

In summary, using these cmdlets will allow us to make IIS configuration changes in bulk, while avoiding conflicts with the applicationHost.config file.

```

```