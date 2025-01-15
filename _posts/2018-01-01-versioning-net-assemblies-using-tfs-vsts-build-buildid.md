---
title: "Versioning .NET Assemblies Using TFS VSTS Build BuildId"
date: 2018-01-01 12:00:00 -0500
categories: [TFS, VSTS, .NET, Versioning]
---

In this post, I will show you how to version .NET assemblies using the BuildId from TFS/VSTS builds. This approach ensures that each build has a unique version number, which is useful for tracking and deployment purposes.

## Step 1: Create a Build Definition

First, create a new build definition in TFS/VSTS. Add the necessary steps to build your .NET project. Make sure to include the "Visual Studio Build" task to compile your project.

## Step 2: Add a PowerShell Script to Update AssemblyInfo

Next, add a PowerShell script to update the AssemblyInfo.cs file with the BuildId. Create a new file named `UpdateAssemblyInfo.ps1` with the following content:

```powershell
param (
    [string]$BuildId
)

$assemblyInfoPath = "path\to\your\AssemblyInfo.cs"
$assemblyVersionPattern = "\[assembly: AssemblyVersion\(\"[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+\"\)\]"
$assemblyFileVersionPattern = "\[assembly: AssemblyFileVersion\(\"[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+\"\)\]"

$assemblyVersion = "1.0.0.$BuildId"
$assemblyFileVersion = "1.0.0.$BuildId"

(Get-Content $assemblyInfoPath) -replace $assemblyVersionPattern, "[assembly: AssemblyVersion(`"$assemblyVersion`")]" | Set-Content $assemblyInfoPath
(Get-Content $assemblyInfoPath) -replace $assemblyFileVersionPattern, "[assembly: AssemblyFileVersion(`"$assemblyFileVersion`")]" | Set-Content $assemblyInfoPath
```

## Step 3: Add the PowerShell Script to the Build Definition

Add a new "PowerShell" task to your build definition. Set the "Script Path" to the location of the `UpdateAssemblyInfo.ps1` file. In the "Arguments" field, pass the BuildId as a parameter:

```
-BuildId $(Build.BuildId)
```

## Step 4: Verify the Versioning

Queue a new build and verify that the AssemblyInfo.cs file has been updated with the correct version number. The version should be in the format `1.0.0.BuildId`.

By following these steps, you can ensure that your .NET assemblies are versioned using the BuildId from TFS/VSTS builds. This approach provides a unique version number for each build, making it easier to track and deploy your applications.
