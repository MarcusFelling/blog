import { test, expect } from '@playwright/test';

const LATEST_POSTS = [
  '/blog/2026/automating-meeting-action-items-into-azure-devops-with-github-copilot-and-work-iq-mcp',
  '/blog/2026/building-an-ai-agent-squad-for-your-repo',
  '/blog/2026/three-day-hackathon-shipping-ai-agent-mvps',
  '/blog/2025/optimizing-github-actions-workflows-for-speed',
  '/blog/2025/vpn-toggle-vscode-extension',
  '/blog/2024/removing-sensitive-data-from-git-history-with-bfg-and-vs-code/',
  '/blog/2023/using-azure-test-plans-with-playwright/',
  '/blog/2023/measuring-website-performance-with-playwright-test-and-navigation-timing-api/',
  '/blog/2023/6-nifty-github-actions-features/',
  '/blog/2023/handling-azure-ad-authentication-with-playwright/',
];

for (const postUrl of LATEST_POSTS) {
  const shortName = postUrl.replace(/^\/\d{4}-\d{2}-\d{2}-/, '').replace(/\/$/, '');

  test(`images load successfully on ${shortName}`, async ({ page }) => {
    const failedImages: string[] = [];

    // Listen for failed image requests before navigation
    page.on('response', (response) => {
      const url = response.url();
      if (/\.(webp|png|jpg|jpeg|gif|svg)(\?|$)/i.test(url) && response.status() >= 400) {
        failedImages.push(`${response.status()} ${url}`);
      }
    });

    await page.goto(postUrl, { waitUntil: 'load' });

    // Get all images in the blog post content
    const images = page.locator('.blog-post img');
    const count = await images.count();

    // Every post in this set has at least one image
    expect(count, `Expected images in ${postUrl}`).toBeGreaterThan(0);

    // Verify each image loaded (naturalWidth > 0 means decoded successfully)
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth, `Image failed to load: ${src}`).toBeGreaterThan(0);
    }

    // No image requests should have returned errors
    expect(failedImages, 'Some images returned HTTP errors').toEqual([]);
  });

  test(`images use webp format on ${shortName}`, async ({ page }) => {
    await page.goto(postUrl, { waitUntil: 'load' });

    const images = page.locator('.blog-post img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const src = await images.nth(i).getAttribute('src');
      // Images from content/uploads should be webp
      if (src && src.includes('content/uploads')) {
        expect(src, `Image not in webp format: ${src}`).toMatch(/\.webp$/);
      }
    }
  });
}

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
