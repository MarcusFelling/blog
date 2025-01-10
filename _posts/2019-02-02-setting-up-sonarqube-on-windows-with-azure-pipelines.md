---
id: 639
title: 'Setting up SonarQube (on Windows) with Azure Pipelines'
date: '2019-02-02T16:32:43+00:00'
author: Marcus
layout: post
guid: 'https://marcusfelling.com/?p=639'
permalink: /blog/2019/setting-up-sonarqube-on-windows-with-azure-pipelines/
wpmdr_menu:
    - '1'
image: /content/uploads/2019/02/SonarQube-1.png
categories:
    - Uncategorized
---

I recently setup a new SonarQube instance to perform static code analysis as part of CI builds. In this post I’d like to document what I learned to hopefully make it easier for you (I assume that’s why you’re reading this).

I’m not going to go into details on [requirements ](https://docs.sonarqube.org/latest/requirements/requirements/)and [installation](https://docs.sonarqube.org/latest/setup/install-server/) as those are well documented. What I’d like to go over are details on configurations for Windows, SQL Server, and Azure Pipelines.

The install itself is pretty straight forward. I used SonarQube CE 7.6 on a Windows Server 2016 VM with a SonarQube DB on SQL Server 2016. However, I did run into DB connection issues using Integrated Security, as indicated in logs\\sonar.log. After downloading the [Microsoft SQL JDBC driver package](http://www.microsoft.com/en-us/download/details.aspx?displaylang=en&id=11774) and copying sqljdbc\_auth.dll to my path (C:\\Windows\\System32), I was able to get it started up. my connection string in sonar-project.properties looks like this:

```
<span style="color:#696969; "># Microsoft SQLServer 2014/2016 and SQL Azure</span>
sonar.jdbc.url<span style="color:#808030; ">=</span>jdbc:sqlserver:<span style="color:#696969; ">//$DBINSTANCENAME;databaseName=SonarQube;integratedSecurity=true</span>
```

## LDAP Configuration

Once my instance was up and running on http://localhost:9000, I wanted to configure LDAP so users could log in using their Active Directory credentials. My properties file ended up looking like this ($ denotes a variable):

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;">```
<span style="color: #888888"># LDAP CONFIGURATION</span>

<span style="color: #888888"># Enable the LDAP feature</span>
sonar.security.realm=LDAP

<span style="color: #888888"># Set to true when connecting to a LDAP server using a case-insensitive setup.</span>
sonar.authenticator.downcase=true

<span style="color: #888888"># URL of the LDAP server. Note that if you are using ldaps, then you should install the server certificate into the Java truststore.</span>
ldap.url=LDAP<span style="color: #FF0000; background-color: #FFAAAA">:</span>//<span style="color: #996633">$PREFERREDDOMAINCONTROLLERNAME</span><span style="color: #FF0000; background-color: #FFAAAA">:</span>Port

<span style="color: #888888"># Bind DN is the username of an LDAP user to connect (or bind) with. Leave this blank for anonymous access to the LDAP directory (optional)</span>
ldap.bindDn=CN=<span style="color: #996633">$SERVICEACCOUNTNAME</span>,OU=Users,DC=<span style="color: #996633">$DOMAIN</span>

<span style="color: #888888"># Bind Password is the password of the user to connect with. Leave this blank for anonymous access to the LDAP directory (optional)</span>
ldap.bindPassword=<span style="color: #996633">$SERVICEACCOUNTPWD</span>

<span style="color: #888888"># USER MAPPING</span>

<span style="color: #888888"># Distinguished Name (DN) of the root node in LDAP from which to search for users (mandatory)</span>
ldap.user.baseDn=DC=<span style="color: #996633">$DOMAIN</span>

<span style="color: #888888"># LDAP user request. (default: (&(objectClass=inetOrgPerson)(uid={login})) )</span>
ldap.user.request=(&(objectClass=user)(sAMAccountName={login}))

<span style="color: #888888"># GROUP MAPPING</span>

<span style="color: #888888"># Distinguished Name (DN) of the root node in LDAP from which to search for groups. (optional, default: empty)</span>
ldap.group.baseDn=DC=<span style="color: #996633">$DOMAIN</span>

<span style="color: #888888"># LDAP group request (default: (&(objectClass=groupOfUniqueNames)(uniqueMember={dn})) )</span>
ldap.group.request=(&(objectClass=group)(member={dn}))
```

</div>Save the properties file with the new values above, then restart the service. Check the logs (\\logs\\web.log) and you should see a line indicating the LDAP connection was successful:

```
INFO  web<span style="color:#808030; ">[</span><span style="color:#808030; ">]</span><span style="color:#808030; ">[</span>o<span style="color:#808030; ">.</span>s<span style="color:#808030; ">.</span>p<span style="color:#808030; ">.</span>l<span style="color:#808030; ">.</span>LdapContextFactory<span style="color:#808030; ">]</span> Test LDAP connection on LDAP<span style="color:#800080; ">:</span><span style="color:#696969; ">//$DBINSTANCENAME:PORT: OK</span>
```

User should now be able to login using their AD credentials.

## Azure DevOps Integration

Next up is using the SonarQube Azure DevOps Marketplace Extension to setup a dedicated SonarQube EndPoint. The endpoint will define the SonarQube server to be used in SonarQube build tasks for CI builds.

1. Head to the marketplace and install the [SonarQube Azure DevOps Extension](https://marketplace.visualstudio.com/items?itemName=SonarSource.sonarqube)
2. Go to Project Settings -&gt; Pipelines: Service Connections
3. + New Service Connection -&gt; SonarQube
4. Add a connection name (I used “SonarQube”), Server URL, and Token.

To generate a token, login to SonarQube, go to your profile (upper right) -&gt; My Account, click the Security Tab, enter a token name -&gt; Generate.

Next, you will want to make sure proper permissions are setup. Users that will be configuring the build definitions will need permissions to use the new Service connection. By default, the group \[projectName\]\\Endpoint Administrators is added. Add new users to that group, add a new group, or add individual users to suit your needs.

<figure class="wp-block-image">![](https://marcusfelling.com/content/uploads/2019/02/SonarQubeServiceConnection.png)</figure>## Azure Pipelines Configuration

Now that we have a service connection, we can add the SonarQube build tasks to a build definition. For this post, I’m going to use the Visual Designer. Later on you can convert to YAML if you choose to do so.

1. Add the task: **Prepare Analysis Configuration**

This step needs to be added as the first task in the definition. When SonarQube uploads the analysis it will automatically create the new project using the Project Name, Project Key, and Project Version. I chose to use Azure DevOps [Predefined Variables](https://docs.microsoft.com/en-us/azure/devops/pipelines/build/variables?view=azure-devops) for these values.

<figure class="wp-block-image">![](https://marcusfelling.com/content/uploads/2019/02/PrepareAnalysisSonarQubeBuild-1024x577.png)</figure>2\. Add the task: **Run Code Analysis**

You will want to add this task towards the end of the build.

<figure class="wp-block-image">![](https://marcusfelling.com/content/uploads/2019/02/RunCodeAnalysisSonarQube.png)</figure>3\. Add the task: **Publish Quality Gate Result** (Optional)

This task will display the Quality Gate status in the build summary and give you a sense of whether the application is ready for production “quality-wise”.   
Note: This task can significantly increase build time because it polls the SonarQube server until the analysis is complete.

<figure class="wp-block-image">![](https://marcusfelling.com/content/uploads/2019/02/PublishQualityGateResultSonarQubeBuild.png)</figure>Our build definition is now ready. You will notice that adding the new SonarQube tasks will add a new demand, requiring Java as as an agent capability. This means you will need to install Java on your build server if you’re using a Private agent/pool.

<figure class="wp-block-image">![](https://marcusfelling.com/content/uploads/2019/02/JavaDemandSonarQube-1024x562.png)</figure>3\. Time to queue the build!

## SonarQube

After running the build with the SonarQube tasks, you should now see a new project in SonarQube.

<figure class="wp-block-image">![](https://marcusfelling.com/content/uploads/2019/02/BlogSonarQubeExample-1024x141.png)</figure>That’s all for now folks…