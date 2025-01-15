---
title: "TFS Release Management: Create Release via REST API"
date: 2018-01-01 12:00:00 -0500
categories: [TFS, Release Management, REST API]
---

In this post, I will show you how to create a release in TFS Release Management using the REST API. This can be useful if you want to automate the release creation process or integrate it with other tools.

## Prerequisites

Before you start, make sure you have the following:

- TFS account with appropriate permissions
- Personal Access Token (PAT) for authentication
- Release definition ID

## Steps

1. **Get the Release Definition ID**

   You can get the release definition ID from the TFS web portal. Navigate to the release definitions and note down the ID of the release definition you want to use.

2. **Create a JSON Payload**

   Create a JSON payload with the necessary details for the release. Here is an example:

   ```json
   {
     "definitionId": 1,
     "description": "Automated release",
     "artifacts": [
       {
         "alias": "MyArtifact",
         "instanceReference": {
           "id": "12345",
           "name": "Build_12345"
         }
       }
     ]
   }
   ```

3. **Send a POST Request**

   Use a tool like Postman or a script to send a POST request to the TFS REST API endpoint. Here is an example using PowerShell:

   ```powershell
   $url = "https://tfs.example.com/tfs/_apis/release/releases?api-version=3.2-preview.1"
   $pat = "YOUR_PERSONAL_ACCESS_TOKEN"
   $jsonPayload = @"
   {
     "definitionId": 1,
     "description": "Automated release",
     "artifacts": [
       {
         "alias": "MyArtifact",
         "instanceReference": {
           "id": "12345",
           "name": "Build_12345"
         }
       }
     ]
   }
   "@

   $headers = @{
     "Content-Type" = "application/json"
     "Authorization" = "Basic " + [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes(":$($pat)"))
   }

   $response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $jsonPayload
   $response
   ```

4. **Verify the Release**

   After sending the POST request, verify that the release has been created successfully in the TFS web portal.

## Conclusion

By following these steps, you can create a release in TFS Release Management using the REST API. This can help you automate the release process and integrate it with other tools and workflows.
