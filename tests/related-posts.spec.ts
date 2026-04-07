import { test, expect } from '@playwright/test';

const postUrl = '/blog/2023/using-azure-test-plans-with-playwright/';

test.describe('Related Posts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(postUrl);
  });

  test('related posts section is visible', async ({ page }) => {
    await expect(page.locator('.related-posts')).toBeVisible();
  });

  test('heading says "Related Posts"', async ({ page }) => {
    await expect(page.locator('.related-posts-heading')).toContainText('Related Posts');
  });

  test('shows exactly 3 related post cards', async ({ page }) => {
    await expect(page.locator('.related-post-card')).toHaveCount(3);
  });

  test('each card has a non-empty title', async ({ page }) => {
    const cards = page.locator('.related-post-card');
    for (let i = 0; i < 3; i++) {
      const title = cards.nth(i).locator('.related-post-title');
      await expect(title).toBeVisible();
      await expect(title).not.toHaveText('');
    }
  });

  test('each card has a non-empty date', async ({ page }) => {
    const cards = page.locator('.related-post-card');
    for (let i = 0; i < 3; i++) {
      const date = cards.nth(i).locator('.related-post-date');
      await expect(date).toBeVisible();
      await expect(date).not.toHaveText('');
    }
  });

  test('each card has a link with a valid href', async ({ page }) => {
    const links = page.locator('.related-post-card .related-post-link');
    await expect(links).toHaveCount(3);
    for (let i = 0; i < 3; i++) {
      const href = await links.nth(i).getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toMatch(/^\/blog\//);
    }
  });

  test('each card has an arrow indicator', async ({ page }) => {
    const cards = page.locator('.related-post-card');
    for (let i = 0; i < 3; i++) {
      await expect(cards.nth(i).locator('.related-post-arrow')).toBeVisible();
    }
  });

  test('shared tag chips are present on cards', async ({ page }) => {
    const sharedTags = page.locator('.related-post-card .shared-tag');
    const count = await sharedTags.count();
    expect(count).toBeGreaterThan(0);
  });

  test('clicking a card navigates to the related post', async ({ page }) => {
    const firstLink = page.locator('.related-post-card .related-post-link').first();
    const href = await firstLink.getAttribute('href');
    expect(href).toBeTruthy();

    await firstLink.click();
    await expect(page).toHaveURL(new RegExp(href!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  });

  test('cards stack vertically on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    // Allow layout to settle after resize
    const cards = page.locator('.related-post-card');
    await expect(cards).toHaveCount(3);

    // All cards should share the same x position when stacked
    const firstBox = await cards.nth(0).boundingBox();
    const secondBox = await cards.nth(1).boundingBox();
    const thirdBox = await cards.nth(2).boundingBox();

    expect(firstBox).toBeTruthy();
    expect(secondBox).toBeTruthy();
    expect(thirdBox).toBeTruthy();

    // Stacked = same left position, increasing top position
    expect(firstBox!.x).toBeCloseTo(secondBox!.x, 0);
    expect(secondBox!.x).toBeCloseTo(thirdBox!.x, 0);
    expect(firstBox!.y).toBeLessThan(secondBox!.y);
    expect(secondBox!.y).toBeLessThan(thirdBox!.y);
  });
});
