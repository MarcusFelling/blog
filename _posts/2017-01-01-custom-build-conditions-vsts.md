---
layout: post
title: "Custom Build Conditions VSTS"
date: 2017-01-01 12:00:00 -0500
categories: [VSTS, Build, Conditions]
---

In this post, we will explore how to create custom build conditions in VSTS (Visual Studio Team Services). Custom build conditions allow you to define specific criteria that must be met before a build is triggered. This can help you manage your build pipeline more effectively and ensure that builds are only triggered when necessary.

## Prerequisites

Before you begin, make sure you have the following prerequisites:

- A VSTS account
- A project in VSTS with a build definition

## Step 1: Create a Custom Build Condition

First, navigate to your build definition in VSTS. Click on the "Triggers" tab and then click on the "Add" button to create a new build condition. In the "Add Build Condition" dialog, you can define the criteria for your custom build condition.

### Example: Trigger Build on Specific Branch

In this example, we will create a custom build condition that triggers a build only when changes are made to the "develop" branch. To do this, select the "Branch" option and enter "develop" in the "Branch" field.

### Example: Trigger Build on Specific Path

In this example, we will create a custom build condition that triggers a build only when changes are made to files in the "src" directory. To do this, select the "Path" option and enter "src/*" in the "Path" field.

## Step 2: Save and Test Your Build Condition

After defining your custom build condition, click on the "Save" button to save your changes. You can now test your build condition by making changes to the specified branch or path and observing whether the build is triggered.

## Conclusion

Custom build conditions in VSTS allow you to define specific criteria that must be met before a build is triggered. This can help you manage your build pipeline more effectively and ensure that builds are only triggered when necessary. By following the steps outlined in this post, you can create and test custom build conditions in VSTS to meet your specific requirements.
