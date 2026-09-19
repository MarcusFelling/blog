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

  test('topic controls and post topics work from the keyboard', async ({ page }) => {
    await page.goto('/archives');

    const allButton = page.getByRole('button', { name: 'All', exact: true });
    const azureButton = page.getByRole('button', { name: 'Azure DevOps', exact: true });
    await allButton.focus();
    await page.keyboard.press('Tab');
    await expect(azureButton).toBeFocused();
    await expect(azureButton).toHaveCSS('outline-style', 'solid');
    await page.keyboard.press('Enter');
    await expect(azureButton).toHaveAttribute('aria-pressed', 'true');
    await expect(allButton).toHaveAttribute('aria-pressed', 'false');
    await expect(page.getByRole('status')).toContainText('posts');

    await allButton.focus();
    await page.keyboard.press('Space');
    await expect(allButton).toHaveAttribute('aria-pressed', 'true');

    const aiTopic = page.locator('a.archive-tag[data-filter="ai"]').first();
    await aiTopic.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('button', { name: 'AI', exact: true })).toHaveAttribute('aria-pressed', 'true');
    const visibleItems = page.locator('.archive-post-item:visible');
    await expect(visibleItems.first()).toBeVisible();
    for (const item of await visibleItems.all()) {
      await expect(item).toHaveAttribute('data-tags', /\bai\b/);
    }
    await expect(page.locator('#visible-count')).toHaveText(String(await visibleItems.count()));
    for (const group of await page.locator('.archive-year-group:visible').all()) {
      await expect(group.locator('.archive-post-item:visible').first()).toBeVisible();
    }
  });

  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }, { width: 320, height: 740 }]) {
    test(`compact archive layout fits at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/archives');

      const header = page.locator('.archive-header');
      await expect(header).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
      const headingBounds = await page.getByRole('heading', { level: 1 }).boundingBox();
      const countBounds = await page.getByRole('status').boundingBox();
      expect(headingBounds!.x + headingBounds!.width).toBeLessThan(countBounds!.x);

      const headerBounds = await header.boundingBox();
      const filtersBounds = await page.locator('.archive-filters').boundingBox();
      expect(filtersBounds!.y - headerBounds!.y - headerBounds!.height).toBeLessThan(40);
      const firstPostBounds = await page.locator('.archive-post-item').first().boundingBox();
      expect(firstPostBounds!.y).toBeLessThan(viewport.height * 0.65);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);

      for (const filter of await page.locator('.tag-filter').all()) {
        const bounds = await filter.boundingBox();
        expect(bounds!.height).toBeGreaterThanOrEqual(44);
        expect(bounds!.x).toBeGreaterThanOrEqual(0);
        expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(viewport.width);
      }
      for (const date of await page.locator('.archive-post-date').all()) {
        await expect(date).toHaveAttribute('datetime', /^\d{4}-\d{2}-\d{2}$/);
      }
    });
  }

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
