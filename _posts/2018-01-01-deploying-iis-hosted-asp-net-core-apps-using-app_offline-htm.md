---
layout: post
title: "Deploying IIS Hosted ASP.NET Core Apps Using app_offline.htm"
date: 2018-01-01 12:00:00 -0500
categories: [IIS, ASP.NET Core, Deployment]
---

In this post, we will explore how to use the `app_offline.htm` file to deploy IIS-hosted ASP.NET Core applications. The `app_offline.htm` file is a special file that can be used to take an ASP.NET Core application offline during deployment, ensuring that users see a friendly message instead of encountering errors.

## Why Use app_offline.htm?

When deploying updates to an ASP.NET Core application hosted on IIS, there is a risk of users encountering errors if they try to access the application while files are being updated. The `app_offline.htm` file provides a way to gracefully take the application offline, display a maintenance message to users, and bring the application back online once the deployment is complete.

## How app_offline.htm Works

When the `app_offline.htm` file is present in the root directory of an ASP.NET Core application, IIS will stop the application and display the contents of the `app_offline.htm` file to users. Once the file is removed, IIS will restart the application.

## Creating the app_offline.htm File

To create the `app_offline.htm` file, simply create an HTML file with the desired maintenance message. Here is an example:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Maintenance</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
        }
        h1 {
            font-size: 50px;
        }
        p {
            font-size: 20px;
        }
    </style>
</head>
<body>
    <h1>We'll be back soon!</h1>
    <p>We are currently performing maintenance. Please check back later.</p>
</body>
</html>
```

## Deploying with app_offline.htm

To use the `app_offline.htm` file during deployment, follow these steps:

1. **Upload the app_offline.htm File**: Before starting the deployment, upload the `app_offline.htm` file to the root directory of your ASP.NET Core application on the IIS server. This will take the application offline and display the maintenance message to users.

2. **Deploy the Application**: Perform the deployment by copying the updated files to the IIS server. Since the application is offline, users will not encounter errors during this process.

3. **Remove the app_offline.htm File**: Once the deployment is complete, remove the `app_offline.htm` file from the root directory. This will bring the application back online, and users will be able to access the updated version.

## Automating the Process

To automate the process of using the `app_offline.htm` file during deployment, you can create a deployment script. Here is an example using PowerShell:

```powershell
# Variables
$webAppPath = "C:\inetpub\wwwroot\myapp"
$appOfflineFile = "C:\path\to\app_offline.htm"

# Upload the app_offline.htm file
Copy-Item -Path $appOfflineFile -Destination $webAppPath

# Deploy the application (example: copy files from a build directory)
Copy-Item -Path "C:\path\to\build\*" -Destination $webAppPath -Recurse -Force

# Remove the app_offline.htm file
Remove-Item -Path "$webAppPath\app_offline.htm"
```

## Conclusion

Using the `app_offline.htm` file is a simple and effective way to ensure a smooth deployment process for IIS-hosted ASP.NET Core applications. By taking the application offline during deployment, you can prevent users from encountering errors and provide a friendly maintenance message. Automating the process with a deployment script can further streamline your deployment workflow.
