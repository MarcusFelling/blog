import { test, expect } from '@playwright/test';

test('should allow me to view landing page', async ({ page }) => {
  await page.goto('');

  await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();

  const nav = page.getByRole('navigation', { name: 'Main navigation' });
  const footer = page.locator('footer');
  const socialChipHosts = nav.locator('.nav-social .social-chips');
  const socialChips = nav.locator('.nav-social .social-chip');

  expect(await socialChipHosts.count()).toBeGreaterThan(0);

  const configuredSocialChips = await socialChips.evaluateAll((links) =>
    links.map((link) => ({
      label: link.getAttribute('aria-label') ?? link.getAttribute('title') ?? '',
      href: link.getAttribute('href') ?? '',
    }))
  );

  for (const chip of configuredSocialChips) {
    expect(chip.label).toBeTruthy();

    if (/github/i.test(chip.label)) {
      expect(chip.href).toMatch(/github\.com/);
    } else if (/linkedin/i.test(chip.label)) {
      expect(chip.href).toMatch(/linkedin\.com/);
    } else if (/rss/i.test(chip.label)) {
      expect(chip.href).toMatch(/feed\.xml|rss|feed/i);
    }

    await expect(footer.getByRole('link', { name: new RegExp(chip.label, 'i') })).toHaveCount(0);
  }

  await expect(footer.locator('.social-chip')).toHaveCount(0);

  await expect(page.getByRole('link', { name: 'Archive' }).first()).toBeVisible();
});

test('should display modern hero section on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('');

  // Verify hero heading is visible
  const heroHeading = page.getByRole('heading', { name: /Sharing what I learn about DevOps & automation/i });
  await expect(heroHeading).toBeVisible();

  // Verify Pulse section is visible on desktop
  const pulseSection = page.locator('text=Pulse').first();
  await expect(pulseSection).toBeVisible();

  // Verify KPIs (Posts and Years Blogging)
  const postsKpi = page.locator('text=Posts').first();
  const yearsBloggingKpi = page.locator('text=Years Blogging');
  await expect(postsKpi).toBeVisible();
  await expect(yearsBloggingKpi).toBeVisible();
});

test('should hide Pulse section on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 540, height: 720 });
  await page.goto('');

  // Verify Pulse section is NOT visible on mobile
  const pulseSection = page.locator('.hero-panel');
  await expect(pulseSection).not.toBeVisible();
});

test('should display post cards with proper structure', async ({ page }) => {
  await page.goto('');

  // Wait for post cards to load
  const postCards = page.locator('.post-card.modern-card');
  await expect(postCards.first()).toBeVisible();

  // Verify we have multiple cards
  const cardCount = await postCards.count();
  expect(cardCount).toBeGreaterThan(0);

  // Verify card has proper content
  const cardTitle = postCards.first().locator('.post-card-title');
  await expect(cardTitle).toBeVisible();

  // Verify Browse Archive button is visible
  const browseButton = page.getByRole('link', { name: /Browse Full Archive/i });
  await expect(browseButton).toBeVisible();
});