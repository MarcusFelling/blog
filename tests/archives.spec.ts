import { test, expect } from '@playwright/test';

test.describe('Archives Page', () => {

  // ---------------------------------------------------------------------------
  // 1. Page loads correctly
  // ---------------------------------------------------------------------------
  test('page loads correctly', async ({ page }) => {
    await page.goto('/archives');

    await expect(page).toHaveTitle(/Archives/);

    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    await expect(h1).toHaveText('Archives');

    // archives.md uses layout: post but is NOT a collection post, so
    // "Posted on" meta must not appear
    await expect(page.locator('text=Posted on')).toHaveCount(0);
  });

  // ---------------------------------------------------------------------------
  // 2. Filter buttons render
  // ---------------------------------------------------------------------------
  test('all 12 filter buttons are present and "All" is active by default', async ({ page }) => {
    await page.goto('/archives');

    const expectedFilters = [
      'all',
      'azure-devops',
      'cicd',
      'playwright',
      'git',
      'github-actions',
      'octopus-deploy',
      'infra-as-code',
      'windows',
      'vs-code-extensions',
      'ai',
      'other',
    ];

    for (const filter of expectedFilters) {
      await expect(page.locator(`.tag-filter[data-filter="${filter}"]`)).toBeVisible();
    }

    // Exactly 12 filter buttons
    await expect(page.locator('.tag-filter')).toHaveCount(12);

    // "All" button is active on initial load
    await expect(page.locator('.tag-filter[data-filter="all"]')).toHaveClass(/active/);
  });

  // ---------------------------------------------------------------------------
  // 3. Post count and items
  // ---------------------------------------------------------------------------
  test('post count and items are rendered', async ({ page }) => {
    await page.goto('/archives');

    const visibleCountText = await page.locator('#visible-count').textContent();
    const visibleCount = parseInt(visibleCountText ?? '0', 10);
    expect(visibleCount).toBeGreaterThan(0);

    // At least one post item is visible
    const firstItem = page.locator('.archive-post-item').first();
    await expect(firstItem).toBeVisible();

    // At least one year group section is visible
    const firstGroup = page.locator('.archive-year-group').first();
    await expect(firstGroup).toBeVisible();
  });

  // ---------------------------------------------------------------------------
  // 4. Filter button click — filtering works
  // ---------------------------------------------------------------------------
  test('clicking playwright filter shows only playwright posts', async ({ page }) => {
    await page.goto('/archives');

    // Capture total count before filtering
    const totalText = await page.locator('#visible-count').textContent();
    const totalCount = parseInt(totalText ?? '0', 10);

    const playwrightBtn = page.locator('.tag-filter[data-filter="playwright"]');
    const allBtn = page.locator('.tag-filter[data-filter="all"]');

    await playwrightBtn.click();

    // playwright button becomes active, all loses it
    await expect(playwrightBtn).toHaveClass(/active/);
    await expect(allBtn).not.toHaveClass(/active/);

    // Filtered count is less than total
    const filteredText = await page.locator('#visible-count').textContent();
    const filteredCount = parseInt(filteredText ?? '0', 10);
    expect(filteredCount).toBeLessThan(totalCount);
    expect(filteredCount).toBeGreaterThan(0);

    // All VISIBLE items must have playwright in their data-tags
    const visibleItems = page.locator('.archive-post-item:visible');
    const count = await visibleItems.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const tags = await visibleItems.nth(i).getAttribute('data-tags');
      expect(tags).toContain('playwright');
    }
  });

  // ---------------------------------------------------------------------------
  // 5. Filter button click — All restores full list
  // ---------------------------------------------------------------------------
  test('clicking All after a filter restores the full list', async ({ page }) => {
    await page.goto('/archives');

    const totalText = await page.locator('#visible-count').textContent();
    const totalCount = parseInt(totalText ?? '0', 10);

    // Filter first
    await page.locator('.tag-filter[data-filter="playwright"]').click();

    // Then reset
    const allBtn = page.locator('.tag-filter[data-filter="all"]');
    await allBtn.click();

    await expect(allBtn).toHaveClass(/active/);

    const restoredText = await page.locator('#visible-count').textContent();
    const restoredCount = parseInt(restoredText ?? '0', 10);
    expect(restoredCount).toBe(totalCount);

    // No items should be hidden — every .archive-post-item must be visible
    const allItems = page.locator('.archive-post-item');
    const itemCount = await allItems.count();
    for (let i = 0; i < itemCount; i++) {
      await expect(allItems.nth(i)).toBeVisible();
    }
  });

  // ---------------------------------------------------------------------------
  // 6. Hash-based filter activation on page load
  // ---------------------------------------------------------------------------
  test('navigating to /archives#ai activates the ai filter', async ({ page }) => {
    await page.goto('/archives#ai');

    const aiBtn = page.locator('.tag-filter[data-filter="ai"]');
    const allBtn = page.locator('.tag-filter[data-filter="all"]');

    await expect(aiBtn).toHaveClass(/active/);
    await expect(allBtn).not.toHaveClass(/active/);

    // Every visible post item must have "ai" in data-tags
    const visibleItems = page.locator('.archive-post-item:visible');
    const count = await visibleItems.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const tags = await visibleItems.nth(i).getAttribute('data-tags');
      expect(tags).toContain('ai');
    }
  });

  // ---------------------------------------------------------------------------
  // 7. Hackathon post is tagged AI
  // ---------------------------------------------------------------------------
  test('hackathon post appears under the ai filter', async ({ page }) => {
    await page.goto('/archives#ai');

    // The post link should be visible after the ai filter is applied
    const hackathonLink = page.locator(
      'a[href*="three-day-hackathon-shipping-ai-agent-mvps"]'
    );
    await expect(hackathonLink).toBeVisible();
  });

  // ---------------------------------------------------------------------------
  // 9. Squad post tag normalization (GitHub Copilot → ai, DevOps → cicd)
  // ---------------------------------------------------------------------------
  test('squad post data-tags contains "ai" and "cicd" after normalization', async ({ page }) => {
    await page.goto('/archives');

    const squadItem = page.locator(
      '.archive-post-item:has(a[href*="building-an-ai-agent-squad"])'
    );
    await expect(squadItem).toBeVisible();

    const tags = await squadItem.getAttribute('data-tags');
    expect(tags).toContain('ai');
    expect(tags).toContain('cicd');
  });

  // ---------------------------------------------------------------------------
  // 10. Tag link on a post navigates to archives with filter activated
  // ---------------------------------------------------------------------------
  test('AI tag link on hackathon post navigates to /archives#ai and activates filter', async ({ page }) => {
    await page.goto('/blog/2026/three-day-hackathon-shipping-ai-agent-mvps');

    // Find the AI tag link inside .blog-tags
    const aiTagLink = page.locator('.blog-tags a', { hasText: 'AI' });
    await expect(aiTagLink).toBeVisible();

    const href = await aiTagLink.getAttribute('href');
    expect(href).toMatch(/\/archives#ai$/);

    // Click it and verify we land on archives with the ai filter active
    await aiTagLink.click();

    await expect(page).toHaveURL(/\/archives\/?#ai/);
    await expect(page.locator('.tag-filter[data-filter="ai"]')).toHaveClass(/active/);
  });

});
