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

test('post title renders Fraunces and article body renders Inter', async ({ page }) => {
  // Land on the newest post the same way the reading-time test does
  await page.goto('');
  const firstPostLink = page.locator('.post-card a[href*="/20"]').first();
  const href = await firstPostLink.getAttribute('href');
  expect(href).toBeTruthy();
  await page.goto(href!);

  const fontOf = (selector: string) =>
    page.locator(selector).first().evaluate((el) => getComputedStyle(el).fontFamily);

  // Post h1 uses the Fraunces display face; the running body uses Inter.
  expect(await fontOf('.post-heading h1')).toMatch(/fraunces/i);
  expect(await fontOf('.blog-post')).toMatch(/inter/i);
});
