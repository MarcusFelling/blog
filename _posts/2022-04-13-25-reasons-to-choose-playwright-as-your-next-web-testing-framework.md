---
id: 1117
title: '25 reasons to choose Playwright as your next web testing framework'
date: '2022-04-13T16:44:00+00:00'
layout: post
guid: 'https://marcusfelling.com/?p=1117'
permalink: /blog/2022/25-reasons-to-choose-playwright-as-your-next-web-testing-framework/
thumbnail-img: /content/uploads/2022/04/8e60bbf1-one-does-not-y49d8t-overlay.png
nav-short: true
tags: [Playwright]
---

I wanted a place to capture a list of highlights that make Playwright awesome. Here it is, in no particular order:

1. Supports testing scenarios for [multi-tab](https://playwright.dev/docs/pages#multiple-pages), [multi-user](https://playwright.dev/docs/test-auth#multiple-signed-in-roles), multi-origin/domain, and [iframes](https://playwright.dev/docs/frames). *“Playwright is an out-of-process automation driver that is not limited by the scope of in-page JavaScript execution”*
2. Uses the concept of [browser contexts ](https://playwright.dev/docs/browser-contexts)(equivalent to a brand new browser profile) to run tests in isolation with zero overhead (super fast!).
3. [VS Code extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) has features to run tests with a single click, debug step by step, explore selectors, and record new tests (codegen).
4. [HTML report](https://playwright.dev/docs/release-notes#html-report-update) to view execution results in your browser. Includes visual diffs, and artifacts like traces, error logs, video recordings, and screenshots. The entire report is a self-contained page that can be [easily hosted anywhere](https://marcusfelling.com/blog/2021/publishing-playwright-test-results-to-github-pages/).
5. Fastest test execution time in [Checkly’s benchmarks](https://rag0g.medium.com/cypress-vs-selenium-vs-playwright-vs-puppeteer-speed-comparison-73fd057c2ae9) versus Cypress, Selenium, and Puppeteer.
6. Built-in [toMatchScreenshot()](https://playwright.dev/docs/test-snapshots) to support visual regression testing, with [recent improvements such as disabling animations and masking elements](https://github.com/microsoft/playwright/issues?q=+label%3Afeature-visual-regression-testing+).
7. [Parallel test execution](https://playwright.dev/docs/test-parallel) is supported locally, or remotely for grids such as Selenium Grid. In addition, you can [shard tests between machines](https://playwright.dev/docs/test-parallel#shard-tests-between-multiple-machines) to run different tests in parallel e.g. using a [GitHub Action CI job matrix.](https://docs.github.com/en/github-ae@latest/actions/using-jobs/using-a-build-matrix-for-your-jobs)
8. Async test code uses standard JavaScript async/await syntax.
9. [Cross-browser compatibility](https://playwright.dev/docs/browsers) for Chromium, Chrome, Microsoft Edge, Firefox, WebKit.
10. Built and maintained by Microsoft ♥️ Ok, I’m probably being biased here...
11. Multi-language support: [JavaScript, TypeScript](https://playwright.dev/docs/intro) ([no transpilation required](https://playwright.dev/docs/test-typescript)), [.NET](https://playwright.dev/dotnet/docs/intro), [Python](https://playwright.dev/python/docs/intro), [Java](https://playwright.dev/java/docs/intro), and [Go](https://github.com/playwright-community/playwright-go) (supported by the community).
12. [Tracing](https://playwright.dev/docs/trace-viewer) that helps with troubleshooting test runs in a post-mortem manner. This works great to repro failed CI tests.
13. [Re-use signed-in state](https://playwright.dev/docs/auth) so tests can start as a logged-in user, saving time.
14. [Emulation](https://playwright.dev/docs/emulation) for mobile devices, user agents, locales & timezones, permissions, geolocation, and dark/light mode.
15. Works well with the [white-box testing](https://en.wikipedia.org/wiki/White-box_testing) approach to [prioritize user-facing attributes](https://playwright.dev/docs/selectors#best-practices) like text, instead of CSS selectors that can change frequently.
16. Support for [API Testing](https://playwright.dev/docs/test-api-testing), to do things in your e2e test like set up data or assert things like response code = 200.
17. Stub and mock network requests with [network interception](https://playwright.dev/docs/network).
18. Actions have [auto-waiting built-in](https://playwright.dev/docs/actionability), so you don’t need to rely on hard-coded sleep commands that can cause flakiness and slow down tests. Also has [custom waits](https://playwright.dev/docs/navigations#custom-wait) such as until an element is visible, or until a pop-up is loaded.
19. Support for recording user actions as Playwright test code aka [Test Generator](https://playwright.dev/docs/codegen), that can be run via CLI or the [record button in VS Code](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright#record-new-tests).
20. Supports device-specific events like [hovering with mouse](https://playwright.dev/docs/api/class-locator#locator-hover), [tapping on mobile](https://playwright.dev/docs/api/class-locator#locator-tap), and [keyboard shortcuts](https://playwright.dev/docs/api/class-locator#locator-press).
21. [Upload](https://playwright.dev/docs/input#upload-files) and [download](https://playwright.dev/docs/downloads) files supported out of the box.
22. The [magic of Locators](https://marcusfelling.com/blog/2022/create-more-reliable-playwright-tests-with-locators/) eliminates flakiness caused by dynamic controls.
23. Playwright Test uses the same Expect assertion library as Jest which will be familiar to many JS devs.
24. Supports [tagging of tests](https://playwright.dev/docs/test-annotations#tag-tests) so you can run groups of related tests e.g. `@priority=high`, `@duration=short`.
25. Provides [docker images](https://playwright.dev/docs/docker) that have dependencies and browsers baked in. This makes [CI configuration](https://playwright.dev/docs/ci) simple and fast.

Did I miss anything? Post your thoughts in the comments…

Happy testing!

**EDIT**: I wanted to add a comment from a former colleague ([Adam Bjerstedt](https://www.linkedin.com/in/adam-bjerstedt-45536835/)), with his list of Playwright favorites, in comparison to Selenium:

> 1.) Playwright treats locators as a first-class citizen and eliminates stale elements. Selenium finds the pointer to the DOM element and then passes that around; whereas Playwright passes the locator to the action/assertion.  
> 2.) Playwright has baked in implicit waits without the problems that Selenium has for negative tests.  
> 3.) Playwright allows super powerful frame handling.  
> 4.) Playwright has built-in mocking which allows you to write minified e2e tests at the component level (you don’t even need to use the component testing aspect).  
> 5.) Playwright is so fast that we have to manually handle race conditions at times.  
> 6.) Playwright supports powerful pseudo-CSS selectors that replace the only use cases for xpath (searching by text and traversing up the DOM). Xpath leads to many terrible habits and should be avoided.  
> 7.) Playwright supports automation IDs as a first-class citizen. (Granted I still use them as data attributes so that I can write compound selectors).