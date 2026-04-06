import { test, expect } from '@playwright/test';

test('should display 404 page with homepage and archives links', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist');
  expect(response?.status()).toBe(404);

  const notFound = page.locator('.not-found');
  await expect(notFound.getByText('Well, this is awkward.')).toBeVisible();
  await expect(notFound.getByText("at least the build didn't fail")).toBeVisible();

  const homepageLink = notFound.getByRole('link', { name: 'Homepage' });
  await expect(homepageLink).toBeVisible();
  await expect(homepageLink).toHaveAttribute('href', /\/$/);

  const archivesLink = notFound.getByRole('link', { name: 'Archives' });
  await expect(archivesLink).toBeVisible();
  await expect(archivesLink).toHaveAttribute('href', /\/archives/);
});

test('should not show prev/next post navigation on 404 page', async ({ page }) => {
  await page.goto('/this-page-does-not-exist');

  await expect(page.locator('.blog-pager')).toHaveCount(0);
});
