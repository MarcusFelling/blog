---
layout: post
title: "Handling Azure AD/Entra ID Authentication with Playwright"
date: 2023-02-21 12:00:00 -0500
categories: [Azure, Authentication, Playwright]
---

In this post, we will explore how to handle Azure AD/Entra ID authentication with Playwright. Playwright is a powerful end-to-end testing framework for web applications, and Azure AD/Entra ID is a popular identity and access management service. By integrating these two tools, you can automate the authentication process and test your web applications more effectively.

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
  await page.goto('https://login.microsoftonline.com/');
  await page.fill('input[name="loginfmt"]', 'your-email@example.com');
  await page.click('input[type="submit"]');
  await page.fill('input[name="passwd"]', 'your-password');
  await page.click('input[type="submit"]');
  await page.click('input[type="button"][value="Yes"]');
  console.log('Logged in successfully');
  await browser.close();
})();
```

This script launches a Chromium browser, navigates to the Azure AD login page, fills in the email and password fields, clicks the submit button, and then clicks the "Yes" button to stay signed in. Finally, it logs a message indicating that the login was successful and closes the browser.

## Handling Multi-Factor Authentication (MFA)

If your Azure AD/Entra ID account requires multi-factor authentication (MFA), you need to handle the additional authentication step in your Playwright script. Here is an example of how to handle MFA using a code sent to your phone:

```js
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://login.microsoftonline.com/');
  await page.fill('input[name="loginfmt"]', 'your-email@example.com');
  await page.click('input[type="submit"]');
  await page.fill('input[name="passwd"]', 'your-password');
  await page.click('input[type="submit"]');
  await page.fill('input[name="otc"]', 'your-mfa-code');
  await page.click('input[type="submit"]');
  await page.click('input[type="button"][value="Yes"]');
  console.log('Logged in successfully with MFA');
  await browser.close();
})();
```

In this script, after filling in the email and password fields and clicking the submit button, the script fills in the MFA code field and clicks the submit button again. Finally, it clicks the "Yes" button to stay signed in, logs a message indicating that the login was successful with MFA, and closes the browser.

## Conclusion

By integrating Playwright with Azure AD/Entra ID, you can automate the authentication process and test your web applications more effectively. Whether your account requires single-factor or multi-factor authentication, Playwright provides the flexibility and power you need to handle the authentication process and ensure the quality of your web applications.
