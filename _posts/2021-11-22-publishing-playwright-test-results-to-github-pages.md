---
layout: post
title: "Publishing Playwright test results to GitHub Pages"
date: 2021-11-22 12:00:00 -0500
categories: [Playwright, GitHub Pages, CI/CD]
---

In this post, we will explore how to publish Playwright test results to GitHub Pages. Playwright is a powerful end-to-end testing framework, and GitHub Pages is a static site hosting service that allows you to publish web content directly from a GitHub repository.

## Setting Up Playwright

To get started with Playwright, you need to have Node.js installed on your machine. You can download Node.js from [nodejs.org](https://nodejs.org/).

### Step 1: Install Playwright

To install Playwright, run the following command in your project directory:

```sh
npm install playwright
```

### Step 2: Create a Playwright Test Script

Create a new file in your project directory and add the following code to create a simple Playwright test script:

```js
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  await page.screenshot({ path: 'example.png' });
  await browser.close();
})();
```

This script launches a Chromium browser, navigates to a website, takes a screenshot, and then closes the browser.

## Running Playwright Tests in CI/CD

To run your Playwright tests in a CI/CD pipeline, you can use GitHub Actions. GitHub Actions is a powerful automation tool that allows you to define workflows for your GitHub repository.

### Step 1: Create a GitHub Actions Workflow

Create a new file named `ci.yml` in the `.github/workflows` directory of your repository and add the following configuration:

```yaml
name: Playwright Tests

on:
  push:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'

      - name: Install dependencies
        run: npm install

      - name: Run Playwright tests
        run: npm test
```

This workflow triggers on pushes to the `main` branch, sets up Node.js, installs dependencies, and runs Playwright tests.

## Publishing Test Results to GitHub Pages

To publish your Playwright test results to GitHub Pages, you can use the `actions-gh-pages` action.

### Step 1: Add a GitHub Actions Step to Publish Test Results

Update your `ci.yml` file to include a step for publishing test results to GitHub Pages:

```yaml
name: Playwright Tests

on:
  push:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'

      - name: Install dependencies
        run: npm install

      - name: Run Playwright tests
        run: npm test

      - name: Publish test results to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./test-results
```

This step uses the `actions-gh-pages` action to publish the contents of the `./test-results` directory to GitHub Pages.

## Conclusion

By using Playwright and GitHub Actions, you can automate the process of running tests and publishing test results to GitHub Pages. This allows you to ensure the quality of your web applications and share test results with your team or stakeholders.
