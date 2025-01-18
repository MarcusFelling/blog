---
id: 891
title: 'How to reduce the size of your TFS/Azure DevOps Server collection databases'
date: '2020-06-22T14:58:08+00:00'

layout: post
guid: 'https://marcusfelling.com/?p=891'
permalink: /blog/2020/how-to-reduce-the-size-of-your-tfs-azure-devops-server-collection-databases/
wpmdr_menu:
    - '1'
thumbnail-img: /content/uploads/2020/06/Untitled.png
categories:
    - Uncategorized
nav-short: true
---

The size of your TFS/Azure DevOps Server collection databases will grow over time, and it’s not a trivial task figuring out how to cleanup. This conversation usually begins in preparation for an upgrade or migration to Azure DevOps Services. I have some general steps you can take to begin these efforts.

## Delete unused projects

Deleting unused projects is the simplest first step and will often have the biggest impact in cleaning up. You can choose to delete projects from the [web interface](https://docs.microsoft.com/en-us/azure/devops/organizations/projects/delete-project?view=azure-devops-2019&tabs=browser%2Cazure-devops-cli), which will retain them for 28 days, or you can use the [TFSDeleteproject ](https://docs.microsoft.com/en-us/azure/devops/server/command-line/tfsdeleteproject-cmd?view=azure-devops-2019#prerequisites)command to start the deletion process immediately.

## Reduce retention settings

You can reduce retention settings throughout the suite: [manual tests](https://docs.microsoft.com/en-us/azure/devops/test/how-long-to-keep-test-results?view=azure-devops#manual-test-results), [automated test results ](https://docs.microsoft.com/en-us/azure/devops/test/how-long-to-keep-test-results?view=azure-devops#automated-test-results), [global release retention](https://docs.microsoft.com/en-us/azure/devops/pipelines/policies/retention?view=azure-devops&tabs=classic#global-release-retention-policy), and pipeline retention (Project settings -> Pipelines: Settings -> Retention Settings).

## Test attachment cleaner

Run the test attachment cleaner to cleanup attachments created during test runs. The tcmpt.exe can be found in [Power Tools](https://marketplace.visualstudio.com/items?itemName=TFSPowerToolsTeam.MicrosoftVisualStudioTeamFoundationServer2013Power). After install, instructions can be found in “C:\\Program Files (x86)\\Microsoft Team Foundation Server 2013 Power Tools\\Help\\**TestAttachmentCleaner.mht**“

## Destroy XAML build history

The XAML build system was [deprecated ](https://devblogs.microsoft.com/bharry/evolving-tfsteam-services-build-automation-capabilities/)quite some time ago, so you probably don’t need your old build logs to stick around. Identify XAML definitions, then run: [tfsbuild destroy](https://docs.microsoft.com/en-us/previous-versions/visualstudio/visual-studio-2010/ee794689%28v%3dvs.100%29) /collection:http://serverName:8080/tfs/ProjectCollection /dateRange:01/01/2017~01/12/2019 /buildDefinition:teamProject\\Builddefinition

## Destroy TFVC content

It’s pretty common to see large binaries stored in centralized version control systems (as apposed to Distributed/Git). To identify big binary files in a TFVC repository, we can use the following SQL query:

```
-- Query for Big Binary TFVC Files, including the last update of project
DECLARE @partitionId INT = 1 
SELECT p.project_name, 
       SUM (CONVERT(BIGINT, fm.CompressedLength, 2)) AS TotalProjectBytes,
          p.last_update
FROM   tbl_FileReference fr 
INNER LOOP JOIN   tbl_FileMetadata fm 
ON     fm.PartitionId = fr.PartitionId 
       AND fm.ResourceId = fr.ResourceId 
JOIN   tbl_Dataspace ds 
ON     ds.PartitionId = fr.PartitionId 
       AND ds.DataspaceId = fr.DataspaceId 
LEFT JOIN   tbl_projects p 
ON     p.PartitionId = fr.PartitionId 
       AND p.project_id = ds.DataspaceIdentifier 
WHERE  fr.PartitionId = @partitionId 
       AND fr.OwnerId = 1 
       AND fr.FileName IS NULL
GROUP BY p.project_name, p.last_update
OPTION (OPTIMIZE FOR (@partitionId UNKNOWN))
```

Once identified, you can use [tf.exe to destroy](https://docs.microsoft.com/en-us/azure/devops/repos/tfvc/destroy-command-team-foundation-version-control?view=azure-devops) the files.

## Cleanup large Git repos

Consider reducing the size of your Git repos using tools like [BFG Repo Cleaner](https://rtyley.github.io/bfg-repo-cleaner/) or [GitAlias ](https://github.com/GitAlias/gitalias)pruner and repacker

## Force Cleanup

After the steps above are complete, you can trigger cleanup by executing a couple of stored procedures on the collection DB:

```
EXEC prc_CleanupDeletedFileContent 1
EXEC prc_DeleteUnusedFiles 1, 0, 100000
```

The second stored proc has batch size of 100000 files, so you may need to execute it more than once.

Finally, if space allocation of DB’s is low after cleanup, consider shrinking then rebuild indexes.