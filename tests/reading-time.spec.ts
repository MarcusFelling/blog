import { test, expect } from '@playwright/test';

test('blog post should display reading time', async ({ page }) => {
  // Navigate to the homepage and find the first post link
  await page.goto('');
  const firstPostLink = page.locator('.post-card a[href*="/20"]').first();
  const href = await firstPostLink.getAttribute('href');
  expect(href).toBeTruthy();

  await page.goto(href!);

  // Reading time element should be visible
  const readingTime = page.locator('.reading-time');
  await expect(readingTime).toBeVisible();

  // Text should match the "X min read" pattern
  await expect(readingTime).toHaveText(/\d+ min read/);

  // Reading time value should be a reasonable number (>= 1)
  const text = await readingTime.textContent();
  const minutes = parseInt(text!.match(/(\d+)/)?.[1] ?? '0', 10);
  expect(minutes).toBeGreaterThanOrEqual(1);
});
