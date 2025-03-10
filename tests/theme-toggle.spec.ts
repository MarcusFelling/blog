import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('');
});

test('should toggle dark mode', async ({ page }) => {
  await page.getByText('Dark Mode').click();
  // assert that the page has dark mode styles
  const body = page.locator('body');
  const backgroundColor = await body.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(backgroundColor).toBe('rgb(18, 18, 18)');
});

test('should default to light mode', async ({ page }) => {
  // assert that the page has light mode styles
  const body = page.locator('body');
  const backgroundColor = await body.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(backgroundColor).toBe('rgb(255, 255, 255)');
});