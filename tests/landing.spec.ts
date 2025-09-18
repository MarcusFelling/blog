import { test, expect } from '@playwright/test';

test('should allow me to view landing page', async ({ page }) => {
  await page.goto('');
  await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();

  const rssLink = page.getByRole('link', { name: /rss/i });
  await expect(rssLink).toBeVisible();
  await expect(rssLink).toHaveAttribute('href', /feed\.xml/);

  const ghLink = page.getByRole('link', { name: /github/i });
  await expect(ghLink).toBeVisible();
  await expect(ghLink).toHaveAttribute('href', /github\.com/);

  const lnLink = page.getByRole('link', { name: /linkedin/i });
  await expect(lnLink).toBeVisible();
  await expect(lnLink).toHaveAttribute('href', /linkedin\.com/);

  await expect(page.getByRole('link', { name: 'Archive' }).first()).toBeVisible();
});