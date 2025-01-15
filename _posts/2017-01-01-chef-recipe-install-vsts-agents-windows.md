---
layout: post
title: "Chef Recipe Install VSTS Agents Windows"
date: 2017-01-01 12:00:00 -0500
categories: [Chef, VSTS, Windows]
---

In this post, we will explore how to use a Chef recipe to install VSTS agents on Windows. Chef is a powerful automation platform that can help you manage your infrastructure as code, and VSTS (Visual Studio Team Services) is a cloud-based service for version control, build, and release management.

## Prerequisites

Before you begin, make sure you have the following prerequisites:

- A Windows machine with administrative privileges
- Chef Development Kit (ChefDK) installed on your machine
- A VSTS account and a personal access token (PAT)

## Step 1: Create a Chef Cookbook

First, create a new Chef cookbook for your VSTS agent installation. Open a terminal and run the following command:

```sh
chef generate cookbook vsts_agent
```

This command will create a new directory named `vsts_agent` with the necessary files and directories for your cookbook.

## Step 2: Define the VSTS Agent Recipe

Next, navigate to the `recipes` directory within your cookbook and create a new file named `default.rb`. Add the following code to define the VSTS agent installation recipe:

```ruby
# Cookbook:: vsts_agent
# Recipe:: default

# Define the VSTS agent version and download URL
agent_version = '2.193.1'
agent_url = "https://vstsagentpackage.azureedge.net/agent/#{agent_version}/vsts-agent-win-x64-#{agent_version}.zip"

# Define the installation directory
install_dir = 'C:\\vsts_agent'

# Create the installation directory
directory install_dir do
  action :create
end

# Download the VSTS agent package
remote_file "#{install_dir}\\vsts-agent.zip" do
  source agent_url
  action :create
end

# Extract the VSTS agent package
windows_zipfile install_dir do
  source "#{install_dir}\\vsts-agent.zip"
  action :unzip
end

# Configure the VSTS agent
execute 'Configure VSTS Agent' do
  command "#{install_dir}\\config.cmd --unattended --url https://dev.azure.com/your_organization --auth pat --token your_pat --pool default --agent $(hostname)"
  action :run
end

# Install the VSTS agent as a service
execute 'Install VSTS Agent Service' do
  command "#{install_dir}\\svc.sh install"
  action :run
end

# Start the VSTS agent service
service 'vsts.agent' do
  action [:enable, :start]
end
```

This recipe performs the following tasks:

1. Defines the VSTS agent version and download URL.
2. Creates the installation directory.
3. Downloads the VSTS agent package.
4. Extracts the VSTS agent package.
5. Configures the VSTS agent using the provided URL and personal access token (PAT).
6. Installs the VSTS agent as a service.
7. Starts the VSTS agent service.

## Step 3: Run the Chef Client

Finally, run the Chef client on your Windows machine to apply the VSTS agent installation recipe. Open a terminal and run the following command:

```sh
chef-client --local-mode --runlist 'recipe[vsts_agent]'
```

This command will execute the `vsts_agent` recipe and install the VSTS agent on your Windows machine.

## Conclusion

By using a Chef recipe, you can automate the installation and configuration of VSTS agents on Windows. This approach allows you to manage your infrastructure as code and ensure consistency across your environments. With Chef and VSTS, you can streamline your build and release processes and improve the efficiency of your development workflow.
