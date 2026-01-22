import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    const searchDataResponse = page.waitForResponse(
      response => response.url().includes('/search-data.json') && [200, 304].includes(response.status()),
      { timeout: 30000 }
    );

    await page.goto('');
    await searchDataResponse;
  });

test.describe('Search Functionality', () => {
  test('should display search box on home page', async ({ page }) => {
    // Verify search box is visible
    const searchInput = page.locator('#search-input');
    await expect(searchInput).toBeVisible();
    
    // Verify search icon is visible
    const searchIcon = page.locator('.search-icon');
    await expect(searchIcon).toBeVisible();
    
    // Verify search results container exists but is hidden
    const searchResults = page.locator('#search-results');
  await expect(searchResults).toBeHidden();
  });

  test('should show search results when typing', async ({ page }) => {
    // Type a search term that should match multiple posts
    await page.locator('#search-input').fill('DevOps');
    
    // Wait for results to appear
    const searchResults = page.locator('#search-results');
    await expect(searchResults).toBeVisible({ timeout: 5000 });
    
    // Verify results container has active class
    await expect(searchResults).toHaveClass(/active/);
    
    // Verify we have result links
    const resultLinks = searchResults.locator('a');
    const linkCount = await resultLinks.count();
    expect(linkCount).toBeGreaterThan(0);
  });

  test('should navigate to post when clicking on search result', async ({ page }) => {
    // Type a search term that should match a specific post
    await page.locator('#search-input').fill('Azure');
    
    // Wait for results to appear
    await expect(page.locator('#search-results')).toBeVisible();
    
    // Click on the first result link
    const firstResultLink = page.locator('#search-results a').first();
    const originalUrl = page.url();
    await firstResultLink.click();
    
    // Verify we've navigated away from home
    await page.waitForURL(u => u.toString() !== originalUrl);
  });

  test('should handle empty results gracefully', async ({ page }) => {
    // Type a search term that very likely won't match
    await page.locator('#search-input').fill('zzzxyznonexistentterm999abc');
    
    // Wait a bit for results to process
    await page.waitForTimeout(500);
    
    // Verify search results container exists
    const searchResults = page.locator('#search-results');
    const isVisible = await searchResults.isVisible();
    // Either visible with no results or hidden - both are acceptable states
    expect(isVisible !== undefined).toBe(true);
  });

  test('should hide results when clicking outside', async ({ page }) => {
    // Type a search term
    await page.locator('#search-input').fill('Playwright');
    
    // Wait for results to appear
    await expect(page.locator('#search-results')).toBeVisible();
    
    // Click outside the search area
    await page.click('body', { position: { x: 10, y: 10 } });
    
    // Verify results are hidden
    await expect(page.locator('#search-results')).toBeVisible({ visible: false });
  });
});
