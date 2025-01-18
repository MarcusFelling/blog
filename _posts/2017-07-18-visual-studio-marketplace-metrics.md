---
id: 319
title: 'Visual Studio Marketplace Metrics'
date: '2017-07-18T18:58:07+00:00'

layout: post
guid: 'https://marcusfelling.com/?p=319'
permalink: /blog/2017/visual-studio-marketplace-metrics/
wpmdr_menu:
    - '1'
categories:
    - Uncategorized
nav-short: true
---

Earlier this year I decided to create some Visual Studio Marketplace build extensions. I was re-using the same tasks in multiple build definitions and there wasn’t anything published to the marketplace that accomplished what I needed. The first extension I created is used to [upload files to AWS S3](https://marketplace.visualstudio.com/items?itemName=MFelling.AWSS3Upload); this was the very first AWS related extension in the marketplace which was kind of cool. It took me longer than I expected because of all the ceremony in setting up the metadata and manifest json files, and packaging with [tfx-cli](https://www.visualstudio.com/en-us/docs/integrate/extensions/develop/add-build-task#cli). More details on creating a build task here: <https://www.visualstudio.com/en-us/docs/integrate/extensions/develop/add-build-task> Creating my [second extension](https://marketplace.visualstudio.com/items?itemName=MFelling.AzureStorageUpload) went a lot faster since I could re-use and modify most of the files. Now that these extensions were published, I was interested to see metrics on them.

Previously, I used a Chrome extension “[Visual Studio Marketplace Metrics](https://chrome.google.com/webstore/detail/visual-studio-marketplace/fifncokofckhanlhmdacdnkbempmopbo?hl=en-GB&gl=GB)” that displays some basic metrics such as number of installs and review score. This was better than nothing, but it requires installing a browser extension and lacks metrics on things like where the extension is being used (VSTS or TFS?).

Thankfully Microsoft introduced the extension reporting hub for Marketplace publishers on June 29th.

> Publishers make the ecosystem rich with their extensions – we are pleased to announce the “Extension reporting hub”, which allows publishers to track data related to their extension, ranging from page views on the extension, to acquisition related information, to user feedback and even sales information for paid extensions. In addition to providing the data related to the extension, this hub also allows publishers to take actions on the extension such as interacting with the end-users who have acquired the extension, responding to rating/reviews, unblocking questions, etc. This new extension reporting hub arms publishers with right set of information &amp; tools so that publishers can stay focused on growing their business.

#### Acquisition

The first and most valuable metrics are on the Acquisition tab. This tab gives the aggregated view of the acquisition, daily trend and conversion funnel.

[![acquisitionTab](/content/uploads/2017/07/acquisitionTab.png)](/content/uploads/2017/07/acquisitionTab.png)  
Some of the useful insights on this tab:  
-Number of users visiting the extension page and how many are acquiring the extension  
-Extension uptake on VSTS &amp; TFS  
-Acquisition split by downloads and installs  
-Conversion ratio for a selected period

#### **Ratings and Review**

Information of the average rating for the selected period along with the overall rating, the average rating by number of reviewers and the daily trend of average rating.  
Useful insights:

- average rating by number of reviewers
- reviews that have not been responded
- analysis of detailed feedback and trends

#### **Uninstalls**

Useful view of the # of uninstalls and reasons why. Only available for VSTS.

#### Q&amp;A

Central location to manage questions and answers (vs. Extension homepage). I have some catching up to do…

Have you found the new extension reporting hub useful? Leave a comment below.