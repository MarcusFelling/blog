---
id: 1178
title: 'Handling Azure AD/Entra ID Authentication with Playwright'
date: '2023-02-21T19:29:38+00:00'
layout: post
guid: 'https://marcusfelling.com/?p=1178'
permalink: /blog/2023/handling-azure-ad-authentication-with-playwright/
thumbnail-img: /content/uploads/2023/02/DALL·E-3d-render-of-a-theatre-mask-with-a-key.png
nav-short: true
tags: [Playwright]
---

One of the most frequently asked questions I get is how to test web apps that use Azure AD/Entra ID. Rather than repeating myself, I figured I’d write a blog post to expand on the [official docs](https://playwright.dev/docs/auth).

*NOTE: the creepy feature image for this post was generated via [DALL-E](https://openai.com/dall-e-2/)*

## Environment Variables

Storing secrets in plain text in our code or configuration files can pose a significant security risk, especially if we share our code with others or publish it on public repositories like GitHub. Instead, we can store the credentials of our test accounts using environment variables. The environment variables are then referenced in our tests using the process core module of Node.js:

![](/content/uploads/2023/02/process-node-core-module.png)

To set the values of these variables we can use our CI system’s secret management. For GitHub Actions, setting the values in the pipeline would look something like this:

![](/content/uploads/2023/02/gha-secrets-playwright.png)

*example GitHub Actions workflow setting env vars scoped to job*

To make local development easier, we can use [.env files](https://github.com/motdotla/dotenv) that are added to .gitignore to make sure they don’t get committed to source control.

![](/content/uploads/2023/02/example-dotenv-file.png)

*example .env file with key-value pairs*

## Tips

- As a starting point, use [codegen](https://playwright.dev/docs/codegen-intro) to walk through logging in, then refactor.
- Create a new tenant for testing and turn off MFA and security defaults. MFA cannot be fully automated and requires manual intervention.
- Optionally, set [conditional access policies](https://learn.microsoft.com/en-us/azure/active-directory/conditional-access/overview) on your test environment to bypass login, then have a separate environment and tests for the login scenario itself.
- The test account will need to be granted permission to the app under test for the first time. You can either add conditionals to your test script (if X locator is present, then click Yes) to account for this or manually log in once to grant permissions. This is a one-time step.
    ![Azure AD App Permissions for login auth](/content/uploads/2023/02/aad-app-permissions.jpg)

<script src="https://gist.github.com/MarcusFelling/b28e64cc083aac32311ba5721deee14f.js"></script>

- Auth can be set up to run at various stages of test execution. <s>If all of your tests require auth, I’d recommend logging in once and re-using the signed-in state via [global setup](https://playwright.dev/docs/auth#reuse-signed-in-state). If only a subset of tests requires auth, you can use a [beforeAll hook](https://playwright.dev/docs/auth#reuse-the-signed-in-page-in-multiple-tests) or [fixture](https://playwright.dev/docs/test-fixtures).</s>  
    **\*\*EDIT\*\*:** As of 1.31, Playwright now has [test project dependencies](https://playwright.dev/docs/release-notes#new-apis), which allows you to perform setup in a more advantageous approach compared to a global setup script (e.g. produce traces and HTML report). Docs now have example scripts to walk through this: <https://playwright.dev/docs/auth#basic-shared-account-in-all-tests>

## Example setup 

Create auth.setup.ts

<script src="https://gist.github.com/MarcusFelling/ac5486defbafd734ee23783859658c13.js"></script>

Update playwright.config.ts with project dependencies, so the script above gets run before tests that need to be authenticated:

<script src="https://gist.github.com/MarcusFelling/dbb6b893676b181ed849308bed707fbc.js"></script>

When the tests get run, the following will happen:

1. auth.setup.ts logs into AAD/Entra ID using creds from env variables
2. the signed-in state is saved to file storageState.json
3. the browser context for all of the test cases is created using the already logged-in state via storageState.json

With this setup, we reduce the test execution time by only logging in once, rather than in every individual test case.

## Wrapping up

I’m curious to learn about other ways that people are handling AAD/Entra ID authentication in their Playwright tests. If you have experience with this, I’d love to hear about the challenges you faced and the solutions you came up with. Your insights could be valuable to others who are also working on Playwright test automation and facing similar issues.

Happy testing!