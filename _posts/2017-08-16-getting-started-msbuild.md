---
id: 348
title: 'Getting started with MSBuild'
date: '2017-08-16T01:09:08+00:00'
author: Marcus
layout: post
guid: 'https://marcusfelling.com/?p=348'
permalink: /blog/2017/getting-started-msbuild/
wpmdr_menu:
    - '1'
categories:
    - Uncategorized
---

![MSBuild ](/content/uploads/2017/08/MSBuild.png)

The majority of developers spend most of their time in Visual Studio and don’t have to understand what happens under the hood with MSBuild. Click the play button and magic happens! However, you may need to troubleshoot a failing build or extend the build to automate things. For those scenarios I’d like to provide a quick intro to what MSBuild is made up of and some tips on troubleshooting. Note: I’ll be using some of the code snippets from the Microsoft docs.

# Basics of MSBuild

**Properties** – Similar to variables with a single value.

```
<span style="color: #a65700;"><</span><span style="color: #5f5035;">PropertyGroup</span><span style="color: #a65700;">></span>
<span style="color: #a65700;">   <</span><span style="color: #5f5035;">BuildDir</span><span style="color: #a65700;">></span>Build<span style="color: #a65700;"></</span><span style="color: #5f5035;">BuildDir</span><span style="color: #a65700;">></span>
<span style="color: #a65700;"></</span><span style="color: #5f5035;">PropertyGroup</span><span style="color: #a65700;">></span>
```

**Items** – List of things (typically filenames). Input for the build.

```
<span style="color: #a65700;"><</span><span style="color: #5f5035;">ItemGroup</span><span style="color: #a65700;">></span>
   <span style="color: #a65700;"><</span><span style="color: #5f5035;">Compile</span> <span style="color: #274796;">Include</span> <span style="color: #808030;">=</span> <span style="color: #800000;">"</span><span style="color: #0000e6;">file1.cs</span><span style="color: #800000;">"</span><span style="color: #a65700;">/></span>
   <span style="color: #a65700;"><</span><span style="color: #5f5035;">Compile</span> <span style="color: #274796;">Include</span> <span style="color: #808030;">=</span> <span style="color: #800000;">"</span><span style="color: #0000e6;">file2.cs</span><span style="color: #800000;">"</span><span style="color: #a65700;">/></span>
<span style="color: #a65700;"></</span><span style="color: #5f5035;">ItemGroup</span><span style="color: #a65700;">></span>
```

**Tasks** – Things that do something. Invokes an action such as copying a file or calling compiler.

```
<span style="color: #a65700;"><</span><span style="color: #5f5035;">Target</span> <span style="color: #274796;">Name</span><span style="color: #808030;">=</span><span style="color: #800000;">"</span><span style="color: #0000e6;">MakeBuildDirectory</span><span style="color: #800000;">"</span><span style="color: #a65700;">></span>
   <span style="color: #a65700;"><</span><span style="color: #5f5035;">MakeDir</span> <span style="color: #274796;">Directories</span><span style="color: #808030;">=</span><span style="color: #800000;">"</span><span style="color: #0000e6;">$(BuildDir)</span><span style="color: #800000;">"</span> <span style="color: #a65700;">/></span>
<span style="color: #a65700;"></</span><span style="color: #5f5035;">Target</span><span style="color: #a65700;">></span>
```

Don’t recreate the wheel if you don’t have to. MSBuild comes with a bunch of [build in tasks](https://msdn.microsoft.com/en-us/library/7z253716.aspx) that can be used inside your targets. There are also tasks created by the MSBuild community: <https://github.com/loresoft/msbuildtasks>

**Targets** – Tasks go in Targets. Targets order the tasks and have dependancies between them.

```
<span style="color: #a65700;"><</span><span style="color: #5f5035;">Target</span> <span style="color: #274796;">Name</span><span style="color: #808030;">=</span><span style="color: #800000;">"</span><span style="color: #0000e6;">AfterBuild</span><span style="color: #800000;">"</span> <span style="color: #a65700;">></span>
   <span style="color: #a65700;"><</span><span style="color: #5f5035;">Message</span> <span style="color: #274796;">Text</span><span style="color: #808030;">=</span><span style="color: #800000;">"</span><span style="color: #0000e6;">First occurrence</span><span style="color: #800000;">"</span> <span style="color: #a65700;">/></span>
<span style="color: #a65700;"></</span><span style="color: #5f5035;">Target</span><span style="color: #a65700;">></span>
<span style="color: #a65700;"><</span><span style="color: #5f5035;">Target</span> <span style="color: #274796;">Name</span><span style="color: #808030;">=</span><span style="color: #800000;">"</span><span style="color: #0000e6;">AfterBuild</span><span style="color: #800000;">"</span> <span style="color: #a65700;">></span>
   <span style="color: #a65700;"><</span><span style="color: #5f5035;">Message</span> <span style="color: #274796;">Text</span><span style="color: #808030;">=</span><span style="color: #800000;">"</span><span style="color: #0000e6;">Second occurrence</span><span style="color: #800000;">"</span> <span style="color: #a65700;">/></span>
<span style="color: #a65700;"></</span><span style="color: #5f5035;">Target</span><span style="color: #a65700;">></span>
```

When you build in Visual Studio, it goes through the list of values in the DefaultTargets attribute. If you add a custom target and want it to always execute when Visual Studio build, then you should consider puting it in the DefaultTargets attribute.

**Imports**  
Properties and Targets can be imported

```
<span style="color: #a65700;"><</span><span style="color: #5f5035;">Import</span> <span style="color: #274796;">Project</span><span style="color: #808030;">=</span><span style="color: #800000;">"</span><span style="color: #0000e6;">Properties.props</span><span style="color: #800000;">"</span> <span style="color: #a65700;">/></span>
<span style="color: #a65700;"><</span><span style="color: #5f5035;">Import</span> <span style="color: #274796;">Project</span><span style="color: #808030;">=</span><span style="color: #800000;">"</span><span style="color: #0000e6;">Targets.targets</span><span style="color: #800000;">"</span> <span style="color: #a65700;">/></span>
```

The syntax of these files is exactly the same as the project.

Example content of .props file:

```
<span style="color: #004a43;"><?</span><span style="color: #800000; font-weight: bold;">xml</span> <span style="color: #074726;">version</span><span style="color: #808030;">=</span><span style="color: #800000;">"</span><span style="color: #7d0045;">1.0</span><span style="color: #800000;">"</span> <span style="color: #074726;">encoding</span><span style="color: #808030;">=</span><span style="color: #800000;">"</span><span style="color: #0000e6;">utf-8</span><span style="color: #800000;">"</span><span style="color: #004a43;">?></span>
<span style="color: #a65700;"><</span><span style="color: #5f5035;">Project</span> <span style="color: #666616;">xmlns</span><span style="color: #808030;">=</span><span style="color: #800000;">"</span><span style="color: #666616;">http</span><span style="color: #800080;">:</span><span style="color: #800000; font-weight: bold;">//</span><span style="color: #5555dd;">schemas.microsoft.com</span><span style="color: #40015a;">/developer/msbuild/2003</span><span style="color: #800000;">"</span><span style="color: #a65700;">></span>
   <span style="color: #a65700;"><</span><span style="color: #5f5035;">PropertyGroup</span><span style="color: #a65700;">></span>
      <span style="color: #a65700;"><</span><span style="color: #5f5035;">MyProperty</span><span style="color: #a65700;">></span>My Value<span style="color: #a65700;"></</span><span style="color: #5f5035;">MyProperty</span><span style="color: #a65700;">></span>
   <span style="color: #a65700;"></</span><span style="color: #5f5035;">PropertyGroup</span><span style="color: #a65700;">></span>
<span style="color: #a65700;"></</span><span style="color: #5f5035;">Project</span><span style="color: #a65700;">></span>
```

# Troubleshooting

Generally I start at the bottom of the log and work my way up. The MSBuild errors aren’t always super helpful. If I’m having a hard time figuring our where an error is coming from, I’ll use preprocessing. Preprocessing takes the project file and walks through all of the imports and produces a flat file so that all of the targets will be in one file. This way you can see everything that is affecting your build. This makes things a lot easier to follow compared to juggling between a bunch of files trying to follow imports. This file can get big, Ctrl + F is your friend.

```
MSBuild project.csproj /pp:FileName.xml
```

**TreatAsLocalProperty** – By default, properties that are passed at the command line override properties inside property groups. To make sure local properties override properties that are passed at the command line you can add the following at the top of your project file:

```
<span style="color: #a65700;"><</span><span style="color: #5f5035;">Project</span> <span style="color: #274796;">TreatAsLocalProperty</span><span style="color: #808030;">=</span><span style="color: #800000;">"</span><span style="color: #0000e6;">PropertyName</span><span style="color: #800000;">"</span> <span style="color: #274796;">DefaultTargets</span><span style="color: #808030;">=</span><span style="color: #800000;">"</span><span style="color: #0000e6;">Build</span><span style="color: #800000;">"</span> <span style="color: #666616;">xmlns</span><span style="color: #808030;">=</span><span style="color: #800000;">"</span><span style="color: #666616;">http</span><span style="color: #800080;">:</span><span style="color: #800000; font-weight: bold;">//</span><span style="color: #5555dd;">schemas.microsoft.com</span><span style="color: #40015a;">/developer/msbuild/2003</span><span style="color: #800000;">"</span><span style="color: #a65700;">></span>
```

Hopefully this post helped get you up to speed on MSBuild and was a little more enjoyable than reading the Microsoft docs 🙂