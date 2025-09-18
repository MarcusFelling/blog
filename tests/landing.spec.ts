import { test, expect } from '@playwright/test';

test('should allow me to view landing page', async ({ page }) => {
  await page.goto('');

  await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();

  const footer = page.locator('footer');

  const rssLink = footer.getByRole('link', { name: /rss/i });
  await expect(rssLink).toBeVisible();
  await expect(rssLink).toHaveAttribute('href', /feed\.xml/);

  const ghLink = footer.getByRole('link', { name: 'GitHub', exact: true });
  await expect(ghLink).toBeVisible();
  await expect(ghLink).toHaveAttribute('href', /github\.com/);

  const lnLink = footer.getByRole('link', { name: 'LinkedIn', exact: true });
  await expect(lnLink).toBeVisible();
  await expect(lnLink).toHaveAttribute('href', /linkedin\.com/);

  await expect(page.getByRole('link', { name: 'Archive' }).first()).toBeVisible();
});