import { test, expect } from '@playwright/test';

test.describe('Archives Page', () => {

  const expectedFilters = [
    'all', 'azure-devops', 'cicd', 'playwright', 'git',
    'github-actions', 'octopus-deploy', 'infra-as-code',
    'windows', 'vs-code-extensions', 'ai', 'other',
  ];

  test('page loads with correct heading and no post meta', async ({ page }) => {
    await page.goto('/archives');

    await expect(page).toHaveTitle(/Archives/);
    await expect(page.getByRole('heading', { level: 1, name: 'Archives' })).toBeVisible();
    // archives.md uses layout: post but is NOT a posts-collection page
    await expect(page.locator('text=Posted on')).toHaveCount(0);
  });

  test('all filter buttons are present and All is active by default', async ({ page }) => {
    await page.goto('/archives');

    for (const filter of expectedFilters) {
      await expect(page.locator(`.tag-filter[data-filter="${filter}"]`)).toBeVisible();
    }

    const allBtn = page.getByRole('button', { name: 'All', exact: true });
    await expect(allBtn).toHaveClass(/active/);
  });

  test('posts are listed with year groups and a visible count', async ({ page }) => {
    await page.goto('/archives');

    await expect(page.locator('#visible-count')).not.toHaveText('0');
    await expect(page.locator('.archive-post-item').first()).toBeVisible();
    await expect(page.locator('.archive-year-group').first()).toBeVisible();
  });

  test('filtering by tag shows matching posts and All resets the list', async ({ page }) => {
    await page.goto('/archives');

    const initialCount = await page.locator('#visible-count').textContent();
    const playwrightBtn = page.getByRole('button', { name: 'Playwright' });
    const allBtn = page.getByRole('button', { name: 'All', exact: true });

    // Apply filter
    await playwrightBtn.click();
    await expect(playwrightBtn).toHaveClass(/active/);
    await expect(allBtn).not.toHaveClass(/active/);

    // Count should drop and every visible item should carry the tag
    const filteredCount = await page.locator('#visible-count').textContent();
    expect(Number(filteredCount)).toBeLessThan(Number(initialCount));
    expect(Number(filteredCount)).toBeGreaterThan(0);

    const allTags = await page.locator('.archive-post-item:visible').evaluateAll(
      items => items.map(el => el.getAttribute('data-tags') ?? '')
    );
    for (const tags of allTags) {
      expect(tags).toContain('playwright');
    }

    // Reset
    await allBtn.click();
    await expect(allBtn).toHaveClass(/active/);
    await expect(page.locator('#visible-count')).toHaveText(initialCount!);

    // Every item should be visible again
    for (const item of await page.locator('.archive-post-item').all()) {
      await expect(item).toBeVisible();
    }
  });

  test('hash-based deep link activates the correct filter', async ({ page }) => {
    await page.goto('/archives#ai');

    const aiBtn = page.locator('.tag-filter[data-filter="ai"]');
    const allBtn = page.getByRole('button', { name: 'All', exact: true });

    await expect(aiBtn).toHaveClass(/active/);
    await expect(allBtn).not.toHaveClass(/active/);

    const allTags = await page.locator('.archive-post-item:visible').evaluateAll(
      items => items.map(el => el.getAttribute('data-tags') ?? '')
    );
    expect(allTags.length).toBeGreaterThan(0);
    for (const tags of allTags) {
      expect(tags).toContain('ai');
    }
  });

  test('every archive post link returns 200', async ({ page, request }) => {
    test.slow();
    await page.goto('/archives');

    const hrefs = await page.locator('a.archive-post-title').evaluateAll(
      links => links.map(a => a.getAttribute('href')).filter(Boolean) as string[]
    );
    expect(hrefs.length).toBeGreaterThan(0);

    for (const href of hrefs) {
      const response = await request.get(href);
      expect(response.status(), `Broken link: ${href}`).toBe(200);
    }
  });

});
