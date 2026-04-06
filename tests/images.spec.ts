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

  for (const postUrl of posts) {
    const failedImages: string[] = [];

    page.on('response', (response) => {
      const url = response.url();
      if (/\.(webp|png|jpg|jpeg|gif|svg)(\?|$)/i.test(url) && response.status() >= 400) {
        failedImages.push(`${response.status()} ${url}`);
      }
    });

    await page.goto(postUrl, { waitUntil: 'load' });

    const images = page.locator('.blog-post img');
    const count = await images.count();

    expect(count, `Expected images in ${postUrl}`).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth, `Image failed to load: ${src}`).toBeGreaterThan(0);
    }

    expect(failedImages, `Some images returned HTTP errors on ${postUrl}`).toEqual([]);
  }
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
