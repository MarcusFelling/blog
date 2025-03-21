---
id: 348
title: 'Getting started with MSBuild'
date: '2017-08-16T01:09:08+00:00'
layout: post
guid: 'https://marcusfelling.com/?p=348'
permalink: /blog/2017/getting-started-msbuild/
nav-short: true
tags: [Other]
---

![MSBuild ](/content/uploads/2017/08/MSBuild.png){: .img-fluid }

The majority of developers spend most of their time in Visual Studio and don’t have to understand what happens under the hood with MSBuild. Click the play button and magic happens! However, you may need to troubleshoot a failing build or extend the build to automate things. For those scenarios I’d like to provide a quick intro to what MSBuild is made up of and some tips on troubleshooting. Note: I’ll be using some of the code snippets from the Microsoft docs.

# Basics of MSBuild

**Properties** – Similar to variables with a single value.

```xml
<PropertyGroup>
   <BuildDir>Build</BuildDir>
</PropertyGroup>
```

**Items** – List of things (typically filenames). Input for the build.

```xml
<ItemGroup>
   <Compile Include = "file1.cs"/>
   <Compile Include = "file2.cs"/>
</ItemGroup>
```

**Tasks** – Things that do something. Invokes an action such as copying a file or calling compiler.

```xml
<Target Name="MakeBuildDirectory">
   <MakeDir Directories="$(BuildDir)" />
</Target>
```

Don’t recreate the wheel if you don’t have to. MSBuild comes with a bunch of [build in tasks](https://msdn.microsoft.com/en-us/library/7z253716.aspx) that can be used inside your targets. There are also tasks created by the MSBuild community: <https://github.com/loresoft/msbuildtasks>

**Targets** – Tasks go in Targets. Targets order the tasks and have dependancies between them.

```xml
<Target Name="AfterBuild" >
   <Message Text="First occurrence" />
</Target>
<Target Name="AfterBuild" >
   <Message Text="Second occurrence" />
</Target>
```

When you build in Visual Studio, it goes through the list of values in the DefaultTargets attribute. If you add a custom target and want it to always execute when Visual Studio build, then you should consider puting it in the DefaultTargets attribute.

**Imports**  
Properties and Targets can be imported

```xml
<Import Project="Properties.props" />
<Import Project="Targets.targets" />
```

The syntax of these files is exactly the same as the project.

Example content of .props file:

```xml
<?xml version="1.0" encoding="utf-8"?>
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
   <PropertyGroup>
      <MyProperty>My Value</MyProperty>
   </PropertyGroup>
</Project>
```

# Troubleshooting

Generally I start at the bottom of the log and work my way up. The MSBuild errors aren’t always super helpful. If I’m having a hard time figuring our where an error is coming from, I’ll use preprocessing. Preprocessing takes the project file and walks through all of the imports and produces a flat file so that all of the targets will be in one file. This way you can see everything that is affecting your build. This makes things a lot easier to follow compared to juggling between a bunch of files trying to follow imports. This file can get big, Ctrl + F is your friend.

```powershell
MSBuild project.csproj /pp:FileName.xml
```

**TreatAsLocalProperty** – By default, properties that are passed at the command line override properties inside property groups. To make sure local properties override properties that are passed at the command line you can add the following at the top of your project file:

```xml
<Project TreatAsLocalProperty="PropertyName" DefaultTargets="Build" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
```

Hopefully this post helped get you up to speed on MSBuild and was a little more enjoyable than reading the Microsoft docs 🙂