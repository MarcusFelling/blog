import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

test.describe('Search Functionality', () => {
  test('should display search trigger on home page', async ({ page }) => {
    const trigger = page.locator('.search-trigger');
    await expect(trigger).toBeVisible();
    await expect(trigger).toContainText('Search posts');
  });

  test('search trigger shows keyboard shortcut hint', async ({ page }) => {
    const kbd = page.locator('.search-trigger-kbd');
    await expect(kbd).toBeVisible();
    const text = await kbd.textContent();
    expect(text).toMatch(/Ctrl\+K|⌘K/);
  });

  test('clicking search trigger opens command palette', async ({ page }) => {
    const trigger = page.locator('.search-trigger');
    await trigger.click();

    const palette = page.locator('#cmd-palette');
    await expect(palette).toBeVisible();
    await expect(page.locator('#cmd-palette-input')).toBeFocused();
  });

  test('search works via palette after trigger click', async ({ page }) => {
    await page.locator('.search-trigger').click();
    await expect(page.locator('#cmd-palette')).toBeVisible();

    // Wait for search data to load (recent posts render when ready)
    const recentItems = page.locator('#cmd-palette [role="option"]');
    await expect(recentItems.first()).toBeVisible({ timeout: 10000 });

    await page.locator('#cmd-palette-input').fill('Azure');

    const results = page.locator('#cmd-palette [role="option"]');
    await expect(results.first()).toBeVisible({ timeout: 5000 });

    const count = await results.count();
    expect(count).toBeGreaterThan(0);
  });

  test('navigating to a post via palette search', async ({ page }) => {
    await page.locator('.search-trigger').click();
    await expect(page.locator('#cmd-palette')).toBeVisible();

    // Wait for search data to load (recent posts render when ready)
    const recentItems = page.locator('#cmd-palette [role="option"]');
    await expect(recentItems.first()).toBeVisible({ timeout: 10000 });

    await page.locator('#cmd-palette-input').fill('Azure');

    const results = page.locator('#cmd-palette [role="option"]');
    await expect(results.first()).toBeVisible({ timeout: 5000 });

    const originalUrl = page.url();
    await results.first().click();

    await page.waitForURL(u => u.toString() !== originalUrl, { timeout: 10000 });
    expect(page.url()).not.toBe(originalUrl);
  });
});
