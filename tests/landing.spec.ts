import { test, expect } from '@playwright/test';

test('should allow me to view landing page', async ({ page }) => {
  await page.goto('');
  await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
  const rssLink = page.getByRole('link', { name: 'RSS', exact: true });
  await expect(rssLink).toBeVisible();
  await expect(rssLink).toHaveAttribute('href', /feed\.xml/);
  const ghLink = page.getByRole('link', { name: 'GitHub', exact: true });
  await expect(ghLink).toBeVisible();
  await expect(ghLink).toHaveAttribute('href', /github\.com/);
  const ghBox = await ghLink.boundingBox();
  if (ghBox) {
    const ghCenter = { x: ghBox.x + ghBox.width / 2, y: ghBox.y + ghBox.height / 2 };
    const ghAtPoint = await page.evaluate(({ x, y }) => {
      const el = document.elementFromPoint(x, y);
      if (!el) return null;
      const anchor = el.closest('a');
      return anchor ? (anchor.getAttribute('aria-label') || anchor.textContent) : null;
    }, ghCenter);
    expect(ghAtPoint).toContain('GitHub');
  }
  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    ghLink.click(),
  ]);
  await expect(popup).toHaveURL(/github\.com/);
  const lnLink = page.getByRole('link', { name: 'LinkedIn', exact: true });
  await expect(lnLink).toBeVisible();
  await expect(lnLink).toHaveAttribute('href', /linkedin\.com/);
  const lnBox = await lnLink.boundingBox();
  if (lnBox) {
    const lnCenter = { x: lnBox.x + lnBox.width / 2, y: lnBox.y + lnBox.height / 2 };
    const lnAtPoint = await page.evaluate(({ x, y }) => {
      const el = document.elementFromPoint(x, y);
      if (!el) return null;
      const anchor = el.closest('a');
      return anchor ? (anchor.getAttribute('aria-label') || anchor.textContent) : null;
    }, lnCenter);
    expect(lnAtPoint).toContain('LinkedIn');
  }
  const [lnPopup] = await Promise.all([
    page.waitForEvent('popup'),
    lnLink.click(),
  ]);
  await expect(lnPopup).toHaveURL(/linkedin\.com/);
  await expect(page.getByRole('link', { name: 'Archive' }).first()).toBeVisible();
});