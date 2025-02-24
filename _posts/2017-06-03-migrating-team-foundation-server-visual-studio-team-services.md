---
id: 287
title: 'Migrating Team Foundation Server to Visual Studio Team Services'
date: '2017-06-03T17:21:53+00:00'

layout: post
guid: 'https://marcusfelling.com/?p=287'
permalink: /blog/2017/migrating-team-foundation-server-visual-studio-team-services/
wpmdr_menu:
    - '1'
categories:
    - Uncategorized
nav-short: true
tags: [Azure DevOps, TFS]
---

Last month I migrated our TFS collection to VSTS using Microsoft’s Database Import Service and [migration guide](https://www.visualstudio.com/team-services/migrate-tfs-vsts). To be frank, it was a long process and it took a lot of going back and forth to make sure I fully understood the guide which is a PDF that is 58 pages long. The guide comes with several checklists and things you need to check and prep before your migration.

A rough outline of what happens is that you run a validation against your TFS collection using a command line tool to ensure everything is exportable. If there are problems, you go about fixing them following suggestions from the tool and then running the check again until you are ready to go. I ran into ~40 errors caused by our custom work items which took about 8 hours to resolve. Next, you run a prep that will generate some files you will need to map your users, followed by making a database backup (DACPAC) and entering your import invite codes (provided by Microsoft). These are then uploaded to an Azure storage account. The final step is submitting the request for import. Microsoft then takes the provided data and provisions a new VSTS account.

I’m not going to go into details about how to do the migration as this is covered in the guide, however I will highlight some things you should take into account before you migrate from TFS to VSTS.

**Azure Active Directory**

You are going to have to make sure you have this in place or have at least thought about it. If you use Active Directory in your organization a good thing to look at is replicating this to Azure. This way users can use the same credentials for the new VSTS account. If you have Office 365, then you already have access to an Azure Active Directory setup and you can make use of this. We setup [Azure AD Connect](https://docs.microsoft.com/en-us/azure/active-directory/connect/active-directory-aadconnect) to sync our on-prem AD accounts with our Office 365 accounts.

**Plan for downtime to make backups**

Even when doing multiple dry-run migration as I did, you need to plan for downtime. One of the reasons for this is that you will need to generate a DACPAC of your TFS Collection. In order to do this, you have to take the TFS collection offline and then detach it from TFS. After you have detached your TFS Collection and made a DACPAC of it, you can then reattach your collection so your team can continue working as usual. Our 180 GB collection took about 3 hours to generate the DACPAC.

**Azure Storage Accounts and SAS**

An Azure storage account needs to be setup so that you can upload your assets for Microsoft to use to provision your new account. These assets include the DACPAC and a user mapping file that includes user accounts and license keys. Once these assets are uploaded via [AZCopy](https://docs.microsoft.com/en-us/azure/storage/storage-use-azcopy) to the storage account, a SAS (shared access signature) URL needs to be generated to be used to authenticate the command line tool (TFSMigrator.exe) with the files you uploaded. The guide will provide you with a link to some PowerShell you can use to generate this URL, but I had to tweak a few settings in the script to get it to work. I uploaded the modified script to [Github](https://github.com/MarcusFelling/PowerShell/blob/master/GenerateAzureSASKey.ps1). Note: You will need to install the [Windows Azure Cmdlets Module](https://msdn.microsoft.com/en-us/library/dn135248(v=nav.70).aspx) before running the script.

**Final Notes**

Once the new account is live, you can start to re-configure or install new build agents. If you want to run more than one build at a time, you will need to purchase pipelines. Read this[ post](https://marcusfelling.com/blog/2017/simple-explanation-private-pipeline-billing-vsts/) on how billing works. Once builds are setup, the final step is to review user accounts. Basic accounts will need to be purchased (5 are included) for any users that do not have Visual Studio/MSDN subscriptions that want to: use Code, Build &amp; Release, Test, or manage backlogs. Users that just need to view/edit work items can use the free unlimited Stakeholder license.

Hopefully this post is helpful to anybody attempting this endeavor! If you would like assistance, [contact me](https://marcusfelling.com/contact/)