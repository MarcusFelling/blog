import { test, expect } from '@playwright/test';

test('latest post should not show "Next Post" link', async ({ page }) => {
  // Navigate to the homepage and find the first (latest) post link
  await page.goto('');
  const firstPostLink = page.locator('.post-card a[href*="/20"]').first();
  const href = await firstPostLink.getAttribute('href');
  expect(href).toBeTruthy();

  await page.goto(href!);

  const pager = page.locator('.blog-pager');
  await expect(pager).toBeVisible();

  // "Previous Post" link should exist (navigates to the older post)
  await expect(pager.locator('text=Previous Post')).toBeVisible();

  // "Next Post" link must NOT exist on the latest post — there is no newer post
  await expect(pager.locator('text=Next Post')).toHaveCount(0);
});

test('middle post should show both nav links', async ({ page }) => {
  // Navigate to the homepage and find the second post (guaranteed to have both neighbors)
  await page.goto('');
  const secondPostLink = page.locator('.post-card a[href*="/20"]').nth(1);
  const href = await secondPostLink.getAttribute('href');
  expect(href).toBeTruthy();

  await page.goto(href!);

  const pager = page.locator('.blog-pager');
  await expect(pager).toBeVisible();

  // A middle post should show both navigation links
  await expect(pager.locator('text=Previous Post')).toBeVisible();
  await expect(pager.locator('text=Next Post')).toBeVisible();
});
