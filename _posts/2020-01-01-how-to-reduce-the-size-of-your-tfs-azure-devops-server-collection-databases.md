---
layout: post
title: "How to Reduce the Size of Your TFS Azure DevOps Server Collection Databases"
date: 2020-01-01
categories: azure devops tfs
---

In this post, we will discuss various methods to reduce the size of your TFS Azure DevOps Server collection databases. Over time, these databases can grow significantly, impacting performance and storage costs. By following the steps outlined below, you can effectively manage and reduce the size of your databases.

## Identify Large Tables

The first step in reducing the size of your TFS Azure DevOps Server collection databases is to identify the large tables. You can use the following SQL query to find the top 10 largest tables in your database:

```sql
SELECT 
    t.NAME AS TableName,
    s.Name AS SchemaName,
    p.rows AS RowCounts,
    SUM(a.total_pages) * 8 AS TotalSpaceKB,
    SUM(a.used_pages) * 8 AS UsedSpaceKB,
    (SUM(a.total_pages) - SUM(a.used_pages)) * 8 AS UnusedSpaceKB
FROM 
    sys.tables t
INNER JOIN      
    sys.indexes i ON t.OBJECT_ID = i.object_id
INNER JOIN 
    sys.partitions p ON i.object_id = p.OBJECT_ID AND i.index_id = p.index_id
INNER JOIN 
    sys.allocation_units a ON p.partition_id = a.container_id
LEFT OUTER JOIN 
    sys.schemas s ON t.schema_id = s.schema_id
WHERE 
    t.NAME NOT LIKE 'dt%' 
    AND t.is_ms_shipped = 0
    AND i.OBJECT_ID > 255 
GROUP BY 
    t.Name, s.Name, p.Rows
ORDER BY 
    TotalSpaceKB DESC
```

## Clean Up Old Data

Once you have identified the large tables, you can clean up old data to reduce the size of your databases. Some common areas to clean up include:

- **Build and Release Data**: Delete old build and release data that is no longer needed.
- **Test Data**: Remove old test results and test attachments.
- **Work Item Attachments**: Delete old work item attachments that are no longer relevant.

## Enable Database Compression

Enabling database compression can help reduce the size of your TFS Azure DevOps Server collection databases. You can enable row or page compression on large tables to save space. Use the following SQL query to enable row compression on a table:

```sql
ALTER TABLE [SchemaName].[TableName]
REBUILD PARTITION = ALL
WITH (DATA_COMPRESSION = ROW)
```

## Archive and Delete Old Projects

If you have old projects that are no longer active, consider archiving and deleting them to free up space. You can use the TFSConfig command-line tool to delete old projects:

```sh
TFSConfig Collection /delete /collectionName:CollectionName
```

## Regular Maintenance

Perform regular maintenance on your TFS Azure DevOps Server collection databases to keep them optimized. This includes:

- Rebuilding indexes
- Updating statistics
- Running database consistency checks

## Conclusion

By following the steps outlined in this post, you can effectively reduce the size of your TFS Azure DevOps Server collection databases. Regular maintenance and cleanup are essential to ensure optimal performance and minimize storage costs.
