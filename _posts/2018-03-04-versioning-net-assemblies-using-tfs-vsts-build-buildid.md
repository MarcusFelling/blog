---
id: 546
title: 'Versioning .Net assemblies using TFS/VSTS Build.BuildID'
date: '2018-03-04T16:32:03+00:00'

layout: post
guid: 'https://marcusfelling.com/?p=546'
permalink: /blog/2018/versioning-net-assemblies-using-tfs-vsts-build-buildid/
wpmdr_menu:
    - '1'
thumbnail-img: /content/uploads/2018/03/semVer.png
categories:
    - Uncategorized
nav-short: true
tags: [Azure Pipelines, .NET]
---


The semantic versioning used in all of our TFS/VSTS CI builds uses the predefined variable `Build.BuildID` for the buildnumber portion of `major.minor.revision.buildnumber`. The build id is used so we have traceability when troubleshooting. We can easily search for the build and see the associated changes. `Major.minor.revision` is set in a [variable group](https://docs.microsoft.com/en-us/vsts/build-release/concepts/library/variable-groups) so it can be shared and updated in one place, across build definitions.

I set the version in the AssemblyInfo.cs file of all projects before compilation to version our assemblies. This is done via a simple PowerShell script:

<script src="https://gist.github.com/MarcusFelling/97a7b9a70685080bfe490f46df5cd02a.js"></script>

When our build id reached 65535, Roslyn (.NET Compiler Platform) error-ed when building our projects:

`AssemblyInfo.cs: Error CS7034: The specified version string does not conform to the required format - major[.minor[.build[.revision]]]`

It turns out that the compiler uses the data type “unsigned \_\_int16” (i.e. unsigned 2-byte int) which has a range from [0 to 65,535](https://msdn.microsoft.com/en-us/library/s3f49ktz.aspx).

![](/content/uploads/2018/03/picard-facepalm.jpg)

As a workaround, I modified the script above to remove the first digit from the build id `$env:Build_BuildID.Substring(1)`. VSTS support said it would not be possible to reset the build id’s…

Has anybody out there come up with a better solution?