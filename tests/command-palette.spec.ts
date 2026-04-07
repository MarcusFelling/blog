import { test, expect } from '@playwright/test';

// Helper: the command palette dialog (distinguished from the mobile nav drawer)
const palette = (page: import('@playwright/test').Page) =>
  page.locator('#cmd-palette');

const paletteInput = (page: import('@playwright/test').Page) =>
  page.locator('#cmd-palette-input');

const paletteResults = (page: import('@playwright/test').Page) =>
  palette(page).locator('[role="option"]');

async function openPalette(page: import('@playwright/test').Page) {
  await page.keyboard.press('Control+k');
  await expect(palette(page)).toBeVisible();
  // Wait for search data to load and results to render
  await expect(paletteResults(page).first()).toBeVisible({ timeout: 10000 });
}

test.beforeEach(async ({ page }) => {
  await page.goto('');
});

test.describe('Command Palette', () => {
  test('keyboard shortcut opens palette', async ({ page }) => {
    await page.keyboard.press('Control+k');
    await expect(palette(page)).toBeVisible();
  });

  test('Escape closes palette', async ({ page }) => {
    await openPalette(page);

    await page.keyboard.press('Escape');
    await expect(palette(page)).toBeHidden();
  });

  test('backdrop click closes palette', async ({ page }) => {
    await openPalette(page);

    const backdrop = page.locator('#cmd-palette-backdrop');
    await backdrop.click({ force: true });

    await expect(palette(page)).toBeHidden();
  });

  test('search input auto-focuses on open', async ({ page }) => {
    await openPalette(page);
    await expect(paletteInput(page)).toBeFocused();
  });

  test('shows recent posts when search is empty', async ({ page }) => {
    await openPalette(page);

    const count = await paletteResults(page).count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThanOrEqual(5);
  });

  test('search returns matching results', async ({ page }) => {
    await openPalette(page);

    await paletteInput(page).fill('Azure');
    await expect(paletteResults(page).first()).toBeVisible({ timeout: 5000 });

    const count = await paletteResults(page).count();
    expect(count).toBeGreaterThan(0);

    const allText = await palette(page).textContent();
    expect(allText?.toLowerCase()).toContain('azure');
  });

  test('no results state shows message', async ({ page }) => {
    await openPalette(page);

    await paletteInput(page).fill('zzzxyznonexistentterm999abc');

    // Wait for debounce + render
    await expect(palette(page).locator('.cmd-palette-empty')).toBeVisible({ timeout: 3000 });

    const dialogText = await palette(page).textContent();
    expect(dialogText?.toLowerCase()).toMatch(/no.*found/);
  });

  test('keyboard navigation highlights results', async ({ page }) => {
    await openPalette(page);

    await paletteInput(page).fill('DevOps');
    await expect(paletteResults(page).first()).toBeVisible({ timeout: 5000 });

    // Wait for debounce (150ms) to fully settle before sending keys
    await page.waitForTimeout(300);

    await page.keyboard.press('ArrowDown');

    const highlighted = palette(page).locator('[aria-selected="true"]');
    await expect(highlighted).toHaveCount(1, { timeout: 3000 });
  });

  test('Enter navigates to the selected post', async ({ page }) => {
    await openPalette(page);

    await paletteInput(page).fill('Azure');
    await expect(paletteResults(page).first()).toBeVisible({ timeout: 5000 });

    await page.keyboard.press('ArrowDown');

    const originalUrl = page.url();
    await page.keyboard.press('Enter');

    await page.waitForURL(url => url.toString() !== originalUrl, { timeout: 10000 });
    expect(page.url()).not.toBe(originalUrl);
  });

  test('clicking a result navigates to that post', async ({ page }) => {
    await openPalette(page);

    await paletteInput(page).fill('Azure');
    await expect(paletteResults(page).first()).toBeVisible({ timeout: 5000 });

    const originalUrl = page.url();
    await paletteResults(page).first().click();

    await page.waitForURL(url => url.toString() !== originalUrl, { timeout: 10000 });
    expect(page.url()).not.toBe(originalUrl);
  });

  test('discovery hint badge is visible on page', async ({ page }) => {
    const hint = page.locator('.cmd-palette-hint');
    await expect(hint.first()).toBeVisible();

    const hintText = await hint.first().textContent();
    expect(hintText).toMatch(/Ctrl\+K|⌘K/);
  });

  test('search trigger on homepage opens palette', async ({ page }) => {
    const trigger = page.locator('.search-trigger');
    await trigger.click();

    await expect(palette(page)).toBeVisible();
    await expect(paletteInput(page)).toBeFocused();
  });

  test('palette works on a post page', async ({ page }) => {
    const firstPostLink = page.locator('.post-card a[href*="/20"]').first();
    const href = await firstPostLink.getAttribute('href');
    expect(href).toBeTruthy();

    await page.goto(href!);

    // Open palette — on post pages there's no inline search, so data loads on first interaction
    await page.keyboard.press('Control+k');
    await expect(palette(page)).toBeVisible();
    await expect(paletteInput(page)).toBeFocused();

    // Wait for data to load and recent posts to render
    await expect(paletteResults(page).first()).toBeVisible({ timeout: 15000 });

    await paletteInput(page).fill('DevOps');
    await expect(paletteResults(page).first()).toBeVisible({ timeout: 10000 });
  });
});
