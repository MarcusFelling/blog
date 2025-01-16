---
id: 1065
title: 'Create resilient 🎭 Playwright e2e tests with locators'
date: '2022-01-09T19:36:48+00:00'
author: Marcus
layout: post
guid: 'https://marcusfelling.com/?p=1065'
permalink: /blog/2022/create-more-reliable-playwright-tests-with-locators/
wpmdr_menu:
    - '1'
ig_es_is_post_notified:
    - '1'
thumbnail-img: /content/uploads/2022/01/playwrighttestlocatorexample.png
categories:
    - Uncategorized
---


Modern web apps introduce some testing challenges — dynamic controls can cause flakiness and unexpected behaviors. This is where the magic of the Playwright [locator API](https://playwright.dev/docs/api/class-locator) can help us build more resilient tests.

## Why use locators?

The locator API was introduced in the [1.14 release](https://playwright.dev/docs/release-notes#-new-locators-api) and the docs describe it as:

> Locator represents a view to the element(s) on the page. It captures the logic sufficient to retrieve the element at any given moment.
> 
> <cite>https://playwright.dev/docs/api/class-locator</cite>

This means we can create smarter selectors to mitigate flaky tests. Part of the smarter logic is strictness. Operations on the target DOM element will throw if more than one element matches the given selector.   
e.g.

```typescript
// Throws if there are several buttons in DOM
await page.locator('button').click();
```

This results in 3 outcomes when using locators:

- Test works as expected
- Selector does not match anything and test fails
- Multiple elements match the selector (e.g. there is a second “button” added to the page somewhere), and test fails with helpful error message

This allows us to be less thoughtful about our selectors because we can rely on the Playwright locator magic to ensure the test is resilient.

It also enables “black box” testing. The tests could be authored by looking at a web page, without inspecting the source code, by a user who may not have insight or understanding of the technical details of the DOM, CSS, etc. The [text selector engine](https://playwright.dev/docs/selectors#text-selector) in combination with locators makes this possible.

## How can I use locators?

One of the most common cases where I’ve implemented locators is on [page.click()](https://playwright.dev/docs/api/class-page#page-click).   
Instead of this:

```typescript
await page.click('text="Login"');
```

We can use this:

```typescript
await page.locator('text="Login"').click();
```

We can also use it with Playwright Test’s many [web-first assertions](https://playwright.dev/docs/test-assertion), that offer async matchers that wait until the expected condition is met. Again, to help us battle testing the dynamic web. We can also store a locator in a variable and re-use it in combination with other locators, across multiple assertions:

```typescript
const toggle = page.locator('.setting-item-toggle');
await expect(toggle.locator('text=Show original')).not.toBeChecked();
await expect(toggle.locator('text=Compare gzipped')).toBeChecked();
await expect(toggle.locator('text=Prettify markup')).not.toBeChecked();
await expect(toggle.locator('text=Multipass')).not.toBeChecked();
```

Working with a list? This is where using an assert of [toHaveCount()](https://playwright.dev/docs/test-assertions#expectlocatortohavecountcount-options) can be useful.   
e.g.

```typescript
// Wait until there are 3 "Buy" nodes in DOM
await expect(page.locator('text=Buy')).toHaveCount(3)
```

Better yet, we can look for text using [toHaveText()](https://playwright.dev/docs/test-assertions#expectlocatortohavetextexpected-options)!  
e.g.

```typescript
// Taken from https://github.com/MarcusFelling/Demo.Playwright/blob/main/svgomg/tests/example.spec.ts
test('verify menu items', async ({ page }) => {
  await expect(page.locator('.menu li')).toHaveText([
    'Open SVG',
    'Paste markup',
    'Demo',
    'Contribute'
  ]);
});
```

Working with iFrames? The [1.17 release](https://playwright.dev/docs/release-notes#frame-locators) introduced FrameLocator, that of course makes sense to use with locator.  
e.g.

```typescript
// Click submit button inside #my-frame
const locator = page.frameLocator('#my-frame').locator('text=Submit');
await locator.click();
```

## I want to see working code!

Check out this repo that’s used to demo various testing scenarios with Playwright, using the official test-runner and scripts authored in TypeScript: <https://github.com/MarcusFelling/demo.playwright>. The majority of example scripts are leveraging locators.

Happy testing!