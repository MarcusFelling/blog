---
id: 1216
title: 'Measuring Website Performance with Playwright Test and Navigation Timing API'
date: '2023-04-27T14:40:19+00:00'
author: Marcus
layout: post
guid: 'https://marcusfelling.com/?p=1216'
permalink: /blog/2023/measuring-website-performance-with-playwright-test-and-navigation-timing-api/
wpmdr_menu:
    - '1'
ig_es_is_post_notified:
    - '1'
thumbnail-img: /content/uploads/2023/04/playwright-performance-testing.jpg
categories:
    - Uncategorized
---


I was recently tasked with measuring the impact of a Redis cache on an e-commerce site. This was pretty simple with [Azure Load Testing](https://azure.microsoft.com/en-us/products/load-testing/), by comparing the results of 2 sites, one with cache, and one without. However, to better exercise the site and understand the user experience, I wanted also to use Playwright.

Playwright already has useful features built in to report on things like the HTML report test step timing and the trace viewer that includes the call duration of each action.

![](/content/uploads/2023/04/test-step-example.png)](/content/uploads/2023/04/test-step-example.png)
HTML report test step duration

I wanted to take this a step further by using the Navigation Timing API, measuring start to loadEventEnd. All of the examples I found online used [performance.timing](https://developer.mozilla.org/en-US/docs/Web/API/Performance/timing), which is now deprecated. This is a very simple code snippet, but posting this will hopefully help others find a solution faster.

Here we have a function **measurePerformance** that can be called inside any test case to get navigation start to load event end times. This could easily be wrapped in a conditional to fail the test based on times. In my case, I just wanted it to be surfaced in the HTML report as a custom annotation to compare between sites, by toggling baseURL.

<script src="https://gist.github.com/MarcusFelling/88f8ddde9941ec1cef19667892dbe2d0.js"></script>As a result, this is what the HTML report looks like:

![](/content/uploads/2023/04/performance-playwright-html-report.png)](/content/uploads/2023/04/performance-playwright-html-report.png)

Happy testing!