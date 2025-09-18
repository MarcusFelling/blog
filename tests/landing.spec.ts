import { test, expect } from '@playwright/test';

test('should allow me to view landing page', async ({ page }) => {
  await page.goto('');
  await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
  const rssLink = page.getByRole('link', { name: 'RSS', exact: true });
  await expect(rssLink).toBeVisible();
  await expect(rssLink).toHaveAttribute('href', /feed\.xml/);
  const ghLink = page.getByRole('link', { name: 'GitHub', exact: true });
  await expect(ghLink).toBeVisible();
  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    ghLink.click(),
  ]);
  await expect(popup).toHaveURL(/github\.com/);
  const lnLink = page.getByRole('link', { name: 'LinkedIn', exact: true });
  await expect(lnLink).toBeVisible();
  const [lnPopup] = await Promise.all([
    page.waitForEvent('popup'),
    lnLink.click(),
  ]);
  await expect(lnPopup).toHaveURL(/linkedin\.com/);
  await expect(page.getByRole('link', { name: 'Archive' }).first()).toBeVisible();
});