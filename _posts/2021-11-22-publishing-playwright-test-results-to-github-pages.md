---
id: 1044
title: 'Publishing 🎭 Playwright test results to GitHub Pages'
date: '2021-11-22T19:49:09+00:00'
layout: post
guid: 'https://marcusfelling.com/?p=1044'
permalink: /blog/2021/publishing-playwright-test-results-to-github-pages/
thumbnail-img: /content/uploads/2021/11/playwright-test-results.png
nav-short: true
tags: [Playwright, GitHub Actions]
---

Now that [Playwright ](https://playwright.dev/)has a fancy new [HTML reporter](https://playwright.dev/docs/test-reporters/#html-reporter), I wanted to host test results to show the latest state of my GitHub Action test runs. Adding a step to my pipeline that publishes the results to GitHub Pages made this pretty simple.

The Playwright [1.17.0-rc1 release](https://github.com/microsoft/playwright/releases/tag/v1.17.0-rc1) included an update to the HTML reporter to produce a single static HTML file. This makes it easy to share test results with others, via email, chat, or host it somewhere. A natural fit for me, was to host it on GitHub Pages, in the same repo as my tests.

> GitHub Pages is a static site hosting service that takes HTML, CSS, and JavaScript files straight from a repository on GitHub, optionally runs the files through a build process, and publishes a website.
> 
> [About GitHub Pages – GitHub Docs](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages)

## Enable GitHub Pages in your GitHub repository

GitHub has docs on this here: <https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site>

I chose to go with most of the defaults. The content lives in a separate branch `gh-pages` at the root. I chose to set up a custom domain at [testresults.marcusfelling.com](https://testresults.marcusfelling.com/). This is what my configuration looks like:

![](/content/uploads/2021/11/github-pages-configuration-1024x646.png){: .img-fluid }

## Configuring GitHub Actions

1. Make sure you’re using Playwright [1.17.0-rc1 ](https://github.com/microsoft/playwright/releases/tag/v1.17.0-rc1)or later
2. Use the [HTML reporter](https://playwright.dev/docs/test-reporters/#html-reporter) when running tests   
    e.g.  
    `npx playwright test --reporter=html`  
    Note: the index.html file will be output to a folder called `playwright-report`
3. Use the [peaceiris/actions-gh-pages](https://github.com/marketplace/actions/github-pages-action) GitHub Action to publish index.html to GitHub Pages

<script src="https://gist.github.com/MarcusFelling/3219b99dc64937bedc4eda30e291a900.js"></script>

I left comments in the above snippet to explain what each property does.

## Working example

You can find a working example of this in my demo.playwright repo: <https://github.com/MarcusFelling/demo.playwright>

Happy testing!