import { test, expect } from '@playwright/test';

test('should allow me to view landing page', async ({ page }) => {
  await page.goto('');
  await expect(page.getByRole('link', { name: 'Marcus\' Blog | A blog about' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'RSS' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'GitHub', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'LinkedIn' })).toBeVisible();
  await expect(page.getByText('Marcus Felling •')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Archive' })).toBeVisible();
});