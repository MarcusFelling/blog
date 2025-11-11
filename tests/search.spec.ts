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
    await page.locator('#search-input').fill('Playwright');
    
    // Wait for results to appear
    const searchResults = page.locator('#search-results');
    await expect(searchResults).toBeVisible({ timeout: 5000 });
    
    // Verify we have results
    const resultItems = page.locator('.search-result-item');
    
    // Verify the first result contains the search term in title or content
    const firstResultTitle = resultItems.first().locator('h3');
    await expect(firstResultTitle).toContainText(/Playwright/i, { ignoreCase: true });
  });

  test('should navigate to post when clicking on search result', async ({ page }) => {
    // Type a search term that should match a specific post
    await page.locator('#search-input').fill('Playwright');
    
    // Wait for results to appear
    await expect(page.locator('#search-results')).toBeVisible();
    
    // Get the title of the first result
    const firstResultTitle = await page.locator('.search-result-item h3').first().textContent();
    
    // Click on the first result
  await page.locator('.search-result-link').first().click();
    
    // Verify we've navigated to the post
    await expect(page).toHaveURL(/.*\/blog\/.*/);
    
    // Verify the page title contains the expected text
    if (firstResultTitle) {
      await expect(page.locator('h1')).toContainText(firstResultTitle.trim());
    }
  });

  test('should show "No results found" when search term has no matches', async ({ page }) => {
    // Type a search term that shouldn't match any posts
    await page.locator('#search-input').fill('xyznonexistentterm123');
    
    // Wait for the no results message
    await expect(page.locator('.no-results')).toBeVisible();
    await expect(page.locator('.no-results')).toHaveText('No posts found');
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
