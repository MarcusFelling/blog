import { test, expect } from '@playwright/test';

async function getLatestPosts(page: import('@playwright/test').Page, max = 10): Promise<string[]> {
  await page.goto('/', { waitUntil: 'load' });
  const links = page.locator('.post-card-link');
  const hrefs: string[] = [];
  const count = Math.min(await links.count(), max);
  for (let i = 0; i < count; i++) {
    const href = await links.nth(i).getAttribute('href');
    if (href) hrefs.push(href);
  }
  return hrefs;
}

test('images load successfully on latest posts', async ({ page }) => {
  const posts = await getLatestPosts(page);
  expect(posts.length, 'Expected to find posts on homepage').toBeGreaterThan(0);

  let totalImagesChecked = 0;

  for (const postUrl of posts) {
    const failedImages: string[] = [];

    const onResponse = (response: import('@playwright/test').Response) => {
      const url = response.url();
      if (/\.(webp|png|jpg|jpeg|gif|svg)(\?|$)/i.test(url) && response.status() >= 400) {
        failedImages.push(`${response.status()} ${url}`);
      }
    };
    page.on('response', onResponse);

    await page.goto(postUrl, { waitUntil: 'load' });

    const images = page.locator('.blog-post img');
    const count = await images.count();

    // Not every recent post has body images (some are text-only). Validate the
    // images that exist instead of assuming every post contains at least one.
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth, `Image failed to load: ${src}`).toBeGreaterThan(0);
    }
    totalImagesChecked += count;

    expect(failedImages, `Some images returned HTTP errors on ${postUrl}`).toEqual([]);
    page.off('response', onResponse);
  }

  // Keep the test meaningful: at least one recent post must expose images.
  expect(totalImagesChecked, 'Expected to validate images on at least one recent post').toBeGreaterThan(0);
});

test('images use webp format on latest posts', async ({ page }) => {
  const posts = await getLatestPosts(page);
  expect(posts.length, 'Expected to find posts on homepage').toBeGreaterThan(0);

  for (const postUrl of posts) {
    await page.goto(postUrl, { waitUntil: 'load' });

    const images = page.locator('.blog-post img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const src = await images.nth(i).getAttribute('src');
      if (src && src.includes('content/uploads')) {
        expect(src, `Image not in webp format: ${src}`).toMatch(/\.webp$/);
      }
    }
  }
});

test('homepage card images load successfully', async ({ page }) => {
  await page.goto('/', { waitUntil: 'load' });

  const cardImages = page.locator('.post-card-image');
  const count = await cardImages.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const img = cardImages.nth(i);
    await img.scrollIntoViewIfNeeded();
    const src = await img.getAttribute('src');
    // Wait for lazy-loaded image to decode
    await expect(async () => {
      const w = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(w).toBeGreaterThan(0);
    }).toPass({ timeout: 5000 });
  }
});

test('AI analyst post thumbnail has descriptive alternative text', async ({ page }) => {
  await page.goto('/blog/2026/ai-analyst-that-shows-its-work');

  const thumbnail = page.locator('.blog-post > .image-zoom-trigger img').first();
  await expect(thumbnail).toHaveAttribute(
    'alt',
    'Architecture diagram showing GitHub Copilot, Microsoft 365 Copilot Cowork, and Microsoft Scout sharing a canonical agent spec, connected to a combined Power BI remote MCP and Fabric IQ layer with governed semantic models, plus Work IQ, Web IQ, and Azure DevOps MCP.'
  );
});

test('AI analyst thumbnail zoom is accessible and limited to its post', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-image-zoom-trigger]')).toHaveCount(0);
  await expect(page.locator('script[src$="/assets/js/image-zoom.js"]')).toHaveCount(0);

  await page.goto('/blog/2026/ai-analyst-that-shows-its-work');

  const trigger = page.locator('[data-image-zoom-trigger]');
  const dialog = page.locator('[data-image-zoom-dialog]');
  const fullImage = page.locator('[data-image-zoom-full]');

  await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
  await trigger.click();
  await expect(dialog).toBeVisible();

  const initialWidth = await fullImage.evaluate((image: HTMLImageElement) => image.getBoundingClientRect().width);
  await page.locator('[data-image-zoom-in]').click();
  await expect(page.locator('[data-image-zoom-level]')).toHaveText('150%');
  const zoomedWidth = await fullImage.evaluate((image: HTMLImageElement) => image.getBoundingClientRect().width);
  expect(zoomedWidth).toBeGreaterThan(initialWidth);

  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test('AI analyst thumbnail zoom remains usable on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/blog/2026/ai-analyst-that-shows-its-work');

  const pageWidth = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(pageWidth.scroll).toBe(pageWidth.client);

  await page.locator('[data-image-zoom-trigger]').click();
  await expect(page.locator('[data-image-zoom-dialog]')).toBeVisible();
  await expect(page.locator('[data-image-zoom-level]')).toHaveText('150%');

  const layout = await page.locator('[data-image-zoom-dialog]').evaluate((dialog) => {
    const toolbar = dialog.querySelector('.image-zoom-toolbar') as HTMLElement;
    const viewport = dialog.querySelector('[data-image-zoom-viewport]') as HTMLElement;
    const controls = Array.from(dialog.querySelectorAll('.image-zoom-control')) as HTMLElement[];

    return {
      toolbarRight: toolbar.getBoundingClientRect().right,
      dialogRight: dialog.getBoundingClientRect().right,
      hasHorizontalPan: viewport.scrollWidth > viewport.clientWidth,
      controlSizes: controls.map((control) => ({
        width: control.getBoundingClientRect().width,
        height: control.getBoundingClientRect().height,
      })),
    };
  });

  expect(layout.toolbarRight).toBeLessThanOrEqual(layout.dialogRight);
  expect(layout.hasHorizontalPan).toBe(true);
  for (const size of layout.controlSizes) {
    expect(size.width).toBeGreaterThanOrEqual(44);
    expect(size.height).toBeGreaterThanOrEqual(44);
  }
});
