---
layout: post
title: "Publishing Playwright Test Results to GitHub Pages"
date: 2021-01-01
categories: [Playwright, GitHub Pages]
---

In this post, I'll walk you through the steps to publish Playwright test results to GitHub Pages. This is a great way to share your test results with your team or the public.

## Prerequisites

Before we get started, make sure you have the following:

- A GitHub repository
- Playwright installed
- GitHub Pages enabled for your repository

## Step 1: Run Playwright Tests

First, run your Playwright tests and generate the test results. You can do this by running the following command:

```sh
npx playwright test --reporter=html
```

This will generate an HTML report of your test results in the `playwright-report` directory.

## Step 2: Create a GitHub Action Workflow

Next, create a GitHub Action workflow to publish the test results to GitHub Pages. Create a file named `.github/workflows/publish-playwright-results.yml` in your repository with the following content:

```yaml
name: Publish Playwright Results

on:
  push:
    branches:
      - main

jobs:
  build:
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
        run: npx playwright test --reporter=html

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./playwright-report
```

This workflow will run your Playwright tests and publish the test results to GitHub Pages whenever you push to the `main` branch.

## Step 3: Commit and Push

Finally, commit and push your changes to the `main` branch of your repository:

```sh
git add .
git commit -m "Add GitHub Action to publish Playwright test results"
git push origin main
```

Your Playwright test results will now be published to GitHub Pages whenever you push to the `main` branch.

That's it! You've successfully set up a GitHub Action to publish Playwright test results to GitHub Pages.
