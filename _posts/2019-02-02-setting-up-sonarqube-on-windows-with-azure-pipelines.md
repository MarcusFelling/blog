---
id: 639
title: 'Setting up SonarQube (on Windows) with Azure Pipelines'
date: '2019-02-02T16:32:43+00:00'
layout: post
guid: 'https://marcusfelling.com/?p=639'
permalink: /blog/2019/setting-up-sonarqube-on-windows-with-azure-pipelines/
thumbnail-img: /content/uploads/2019/02/SonarQube-1.png
nav-short: true
tags: [Azure DevOps, Windows, CICD]
---

I recently setup a new SonarQube instance to perform static code analysis as part of CI builds. In this post I’d like to document what I learned to hopefully make it easier for you (I assume that’s why you’re reading this).

I’m not going to go into details on [requirements ](https://docs.sonarqube.org/latest/requirements/requirements/)and [installation](https://docs.sonarqube.org/latest/setup/install-server/) as those are well documented. What I’d like to go over are details on configurations for Windows, SQL Server, and Azure Pipelines.

The install itself is pretty straight forward. I used SonarQube CE 7.6 on a Windows Server 2016 VM with a SonarQube DB on SQL Server 2016. However, I did run into DB connection issues using Integrated Security, as indicated in logs\\sonar.log. After downloading the [Microsoft SQL JDBC driver package](http://www.microsoft.com/en-us/download/details.aspx?displaylang=en&id=11774) and copying sqljdbc\_auth.dll to my path (C:\\Windows\\System32), I was able to get it started up. my connection string in sonar-project.properties looks like this:

```csharp
# Microsoft SQL Server 2014/2016 and SQL Azure
sonar.jdbc.url=jdbc:sqlserver://$DBINSTANCENAME;databaseName=SonarQube;integratedSecurity=true
```

## LDAP Configuration

Once my instance was up and running on http://localhost:9000, I wanted to configure LDAP so users could log in using their Active Directory credentials. My properties file ended up looking like this ($ denotes a variable):

```csharp
# LDAP CONFIGURATION

# Enable the LDAP feature
sonar.security.realm=LDAP

# Set to true when connecting to a LDAP server using a case-insensitive setup.
sonar.authenticator.downcase=true

# URL of the LDAP server. Note that if you are using ldaps, then you should install the server certificate into the Java truststore.
ldap.url=LDAP://$PREFERREDDOMAINCONTROLLERNAME:Port

# Bind DN is the username of an LDAP user to connect (or bind) with. Leave this blank for anonymous access to the LDAP directory (optional)
ldap.bindDn=CN=$SERVICEACCOUNTNAME,OU=Users,DC=$DOMAIN

# Bind Password is the password of the user to connect with. Leave this blank for anonymous access to the LDAP directory (optional)
ldap.bindPassword=$SERVICEACCOUNTPWD

# USER MAPPING

# Distinguished Name (DN) of the root node in LDAP from which to search for users (mandatory)
ldap.user.baseDn=DC=$DOMAIN

# LDAP user request. (default: (&(objectClass=inetOrgPerson)(uid={login})) )
ldap.user.request=(&(objectClass=user)(sAMAccountName={login}))

# GROUP MAPPING

# Distinguished Name (DN) of the root node in LDAP from which to search for groups. (optional, default: empty)
ldap.group.baseDn=DC=$DOMAIN

# LDAP group request (default: (&(objectClass=groupOfUniqueNames)(uniqueMember={dn})) )
ldap.group.request=(&(objectClass=group)(member={dn}))
```

Save the properties file with the new values above, then restart the service. Check the logs (\\logs\\web.log) and you should see a line indicating the LDAP connection was successful:

```csharp
INFO  web[][o.s.p.l.LdapContextFactory] Test LDAP connection on LDAP://$DBINSTANCENAME:PORT: OK
```

User should now be able to login using their AD credentials.

## Azure DevOps Integration

Next up is using the SonarQube Azure DevOps Marketplace Extension to setup a dedicated SonarQube EndPoint. The endpoint will define the SonarQube server to be used in SonarQube build tasks for CI builds.

1. Head to the marketplace and install the [SonarQube Azure DevOps Extension](https://marketplace.visualstudio.com/items?itemName=SonarSource.sonarqube)
2. Go to Project Settings -> Pipelines: Service Connections
3. New Service Connection -> SonarQube
4. Add a connection name (I used “SonarQube”), Server URL, and Token.

To generate a token, login to SonarQube, go to your profile (upper right) -> My Account, click the Security Tab, enter a token name -> Generate.

Next, you will want to make sure proper permissions are setup. Users that will be configuring the build definitions will need permissions to use the new Service connection. By default, the group \[projectName\]\\Endpoint Administrators is added. Add new users to that group, add a new group, or add individual users to suit your needs.

![](/content/uploads/2019/02/SonarQubeServiceConnection.png){: .img-fluid }

## Azure Pipelines Configuration

Now that we have a service connection, we can add the SonarQube build tasks to a build definition. For this post, I’m going to use the Visual Designer. Later on you can convert to YAML if you choose to do so.

1. Add the task: **Prepare Analysis Configuration**

    This step needs to be added as the first task in the definition. When SonarQube uploads the analysis it will automatically create the new project using the Project Name, Project Key, and Project Version. I chose to use Azure DevOps [Predefined Variables](https://docs.microsoft.com/en-us/azure/devops/pipelines/build/variables?view=azure-devops) for these values.
    
    ![](/content/uploads/2019/02/PrepareAnalysisSonarQubeBuild-1024x577.png){: .img-fluid }

2. Add the task: **Run Code Analysis**

    You will want to add this task towards the end of the build.
    
    ![](/content/uploads/2019/02/RunCodeAnalysisSonarQube.png){: .img-fluid }

3. Add the task: **Publish Quality Gate Result** (Optional)

    This task will display the Quality Gate status in the build summary and give you a sense of whether the application is ready for production “quality-wise”.   
    Note: This task can significantly increase build time because it polls the SonarQube server until the analysis is complete.
    
    ![](/content/uploads/2019/02/PublishQualityGateResultSonarQubeBuild.png){: .img-fluid }
    
    Our build definition is now ready. You will notice that adding the new SonarQube tasks will add a new demand, requiring Java as as an agent capability. This means you will need to install Java on your build server if you’re using a Private agent/pool.
    
    ![](/content/uploads/2019/02/JavaDemandSonarQube-1024x562.png){: .img-fluid }

4. Time to queue the build!

## SonarQube

After running the build with the SonarQube tasks, you should now see a new project in SonarQube.

![](/content/uploads/2019/02/BlogSonarQubeExample-1024x141.png){: .img-fluid }

That’s all for now folks…