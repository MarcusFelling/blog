---
id: 534
title: 'Chef recipe to install VSTS agents (Windows)'
date: '2017-12-26T16:47:20+00:00'
layout: post
guid: 'https://marcusfelling.com/?p=534'
permalink: /blog/2017/chef-recipe-install-vsts-agents-windows/
thumbnail-img: /content/uploads/2017/12/chef-1.png
nav-short: true
tags: [Azure DevOps, Windows]
---


I recently set out to automate the creation of our Windows build servers that run VSTS agents. Previously the build servers were thought of as “snowflake” servers because of all the software components and customization’s that were needed. This was even more reason to use Infrastructure as Code to get rid of manual run books that were previously used to document the creation of a build server. Our Infrastructure team already decided on a tool chain for Infrastructure as Code, which included Chef for Configuration Management.

Before getting started on re-creating the wheel, I searched the web for existing Cookbooks to install VSTS agents and came across [“Visual Studio Team Services Build Agent Cookbook”.](https://supermarket.chef.io/cookbooks/vsts_build_agent) Unfortunately this Cookbook didn’t support Windows Server 2016 and I ran into various errors. Instead, I decided to create my own recipe to install the VSTS agents. The recipe downloads the installation zip from S3, creates a folder for the agent to be installed in, then installs/registers the agent (if it’s not already installed). In order to make the array of agent names “dynamic” I prefix hostname `#{node['hostname']}-#{agentname)`. I setup this recipe to run via Chef solo in the build server’s CloudFormation launch config. Note: The variables in the beginning of the recipe would normally be stored in an attributes or environments file, I added them to the recipe to simplify things.

Feel free to post questions in the comment section!

<script src="https://gist.github.com/MarcusFelling/f1f2039d9d5ca11cb20ae17412ccdbac.js"></script>