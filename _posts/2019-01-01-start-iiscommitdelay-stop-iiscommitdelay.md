---
layout: post
title: "Start IISCommitDelay Stop IISCommitDelay"
date: 2019-01-01 12:00:00 -0500
categories: [IIS, Deployment]
---

When deploying web applications to IIS, you may encounter issues with files being locked by the web server, preventing the deployment from completing successfully. One way to address this issue is by using the `IISCommitDelay` feature, which allows you to delay the commit of changes to the IIS configuration until after the deployment is complete.

## What is IISCommitDelay?

`IISCommitDelay` is a feature in IIS that allows you to delay the commit of changes to the IIS configuration until after the deployment is complete. This can be useful for preventing file locking issues during deployment, as it ensures that the web server does not lock files until the deployment is finished.

## How to Use IISCommitDelay

To use `IISCommitDelay`, you need to add the `IISCommitDelay` and `IISCommitDelayTimeout` attributes to the `<system.webServer>` section of your web.config file. The `IISCommitDelay` attribute specifies whether to enable the delay, and the `IISCommitDelayTimeout` attribute specifies the timeout period for the delay.

### Step 1: Add IISCommitDelay to web.config

Open your web.config file and add the following lines to the `<system.webServer>` section:

```xml
<system.webServer>
  <IISCommitDelay enabled="true" timeout="00:05:00" />
</system.webServer>
```

This configuration enables the `IISCommitDelay` feature and sets the timeout period to 5 minutes.

### Step 2: Deploy Your Application

Deploy your web application as usual. The `IISCommitDelay` feature will delay the commit of changes to the IIS configuration until after the deployment is complete, preventing file locking issues.

### Step 3: Verify the Deployment

After the deployment is complete, verify that your web application is running correctly and that there are no file locking issues.

## Conclusion

The `IISCommitDelay` feature in IIS can be a useful tool for preventing file locking issues during deployment. By delaying the commit of changes to the IIS configuration until after the deployment is complete, you can ensure that your web application is deployed successfully without encountering file locking issues.
