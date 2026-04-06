import { test, expect } from '@playwright/test';

test.describe('404 Page', () => {

  test('shows navigation links to homepage and archives', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');

    const homepageLink = page.getByRole('link', { name: 'Go to Homepage' });
    const archivesLink = page.getByRole('link', { name: 'Browse Archives' });

    await expect(homepageLink).toBeVisible();
    await expect(archivesLink).toBeVisible();

    await expect(homepageLink).toHaveAttribute('href', '/');
    await expect(archivesLink).toHaveAttribute('href', '/archives');
  });

  test('homepage link navigates to the landing page', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    await page.getByRole('link', { name: 'Go to Homepage' }).click();
    await expect(page).toHaveURL('/');
  });

  test('archives link navigates to the archives page', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    await page.getByRole('link', { name: 'Browse Archives' }).click();
    await expect(page).toHaveURL('/archives');
  });

});
