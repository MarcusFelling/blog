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

test('should display the asymmetric editorial hero on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('');

  // Fraunces headline (copy unchanged from the previous design)
  const heroHeading = page.getByRole('heading', { name: /Learning technology out loud/i });
  await expect(heroHeading).toBeVisible();

  // The command-palette trigger is the hero's quiet inline field
  const searchTrigger = page.locator('.search-trigger');
  await expect(searchTrigger).toBeVisible();
  await expect(searchTrigger).toContainText('Search posts');
  await expect(page.locator('.search-trigger-kbd')).toBeVisible();
});

test('should render the newest post as the full-width featured lead card', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('');

  const cards = page.locator('.post-cards-container .post-card.modern-card');
  await expect(cards.first()).toBeVisible();

  // The first card carries the featured modifier and shows its title
  await expect(cards.first()).toHaveClass(/post-card--featured/);
  await expect(cards.first().locator('.post-card-title')).toBeVisible();

  // Exactly one featured lead — the rest are the tighter index grid
  await expect(page.locator('.post-card--featured')).toHaveCount(1);
});

test('should render a plain Popular list of links (no counters, no emoji)', async ({ page }) => {
  await page.goto('');

  const popular = page.locator('.popular-posts');
  await expect(popular).toBeVisible();

  // Eyebrow label — uppercased via CSS, so assert the source text case-insensitively
  await expect(popular.locator('.popular-posts-eyebrow')).toHaveText(/^popular$/i);

  // Plain text links sourced from _data/top_pages.yml (markup renders up to 5)
  const links = popular.locator('.popular-post-link');
  const count = await links.count();
  expect(count).toBeGreaterThan(0);
  expect(count).toBeLessThanOrEqual(5);

  const items = await links.evaluateAll((els) =>
    els.map((el) => ({
      href: el.getAttribute('href') ?? '',
      text: (el.textContent ?? '').trim(),
    }))
  );
  for (const item of items) {
    expect(item.text.length).toBeGreaterThan(0);
    // Each link resolves to a site path, not a dead/relative fragment
    expect(item.href).toMatch(/^(\/|https?:\/\/)/);
  }

  // The old Pulse "view counter" chrome must be gone
  await expect(page.locator('.pulse-heading, .top-pages-box, .top-page-link')).toHaveCount(0);
});

test('should not render the removed hero panel, KPI, or read-more chrome', async ({ page }) => {
  await page.goto('');
  await expect(page.locator('.hero-panel')).toHaveCount(0);
  await expect(page.locator('.hero-kpis')).toHaveCount(0);
  await expect(page.locator('.read-more-chip')).toHaveCount(0);
});

test('should keep the Popular list visible on mobile (adapt, not amputate)', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('');

  // Unlike the old Pulse panel (which was display:none on mobile), the Popular
  // list stacks below the hero and stays visible (Fenster §2.2).
  await expect(page.locator('.popular-posts')).toBeVisible();
  await expect(page.locator('.popular-post-link').first()).toBeVisible();
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

test('hero + featured titles render Fraunces; body renders Inter', async ({ page }) => {
  await page.goto('');

  const fontOf = (selector: string) =>
    page.locator(selector).first().evaluate((el) => getComputedStyle(el).fontFamily);

  // Display face (Fraunces / --font-display) is scoped to the title voice…
  expect(await fontOf('.hero-intro h1')).toMatch(/fraunces/i);
  expect(await fontOf('.post-card--featured .post-card-title')).toMatch(/fraunces/i);

  // …and the body/UI voice stays Inter (locks the M1 body-font fix).
  expect(await fontOf('.hero-intro p')).toMatch(/inter/i);
});

test('the ⌘K controls expose a 2px accent focus ring on keyboard focus', async ({ page }) => {
  // Fenster a11y §5 — only real keyboard focus (Tab) engages :focus-visible, so
  // this Tab-searches to each control rather than calling a programmatic
  // .focus() (which would not match :focus-visible in Chromium). Also asserts
  // both ⌘K controls stay keyboard-reachable. Desktop width: .cmd-palette-hint
  // lives in the desktop nav.
  await page.setViewportSize({ width: 1280, height: 800 });
  const ACCENT = 'rgb(249, 115, 22)'; // the single accent, #f97316

  for (const selector of ['.cmd-palette-hint', '.search-trigger']) {
    await page.goto('');

    let reached = false;
    for (let i = 0; i < 30 && !reached; i++) {
      await page.keyboard.press('Tab');
      reached = await page.evaluate((s) => !!document.activeElement?.matches(s), selector);
    }
    // Keyboard reachability is itself part of the a11y contract.
    expect(reached, `${selector} should be reachable via Tab`).toBe(true);

    const ring = await page.locator(selector).evaluate((el) => {
      const cs = getComputedStyle(el);
      return {
        focusVisible: el.matches(':focus-visible'),
        width: cs.outlineWidth,
        style: cs.outlineStyle,
        color: cs.outlineColor,
      };
    });
    expect(ring.focusVisible).toBe(true);
    expect(parseFloat(ring.width)).toBeGreaterThanOrEqual(2);
    expect(ring.style).not.toBe('none');
    expect(ring.color).toBe(ACCENT);
  }
});