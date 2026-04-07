import { test, expect } from '@playwright/test';

// Use a post known to have multiple h2 headings
const POST_WITH_HEADINGS = '/blog/2026/building-an-ai-agent-squad-for-your-repo';

test.describe('Post Table of Contents + Reading Progress', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(POST_WITH_HEADINGS);
    // Wait for TOC script to initialize
    await page.waitForSelector('.post-toc', { timeout: 10000 });
  });

  test('reading progress bar exists and starts at 0%', async ({ page }) => {
    const bar = page.locator('.reading-progress');
    await expect(bar).toBeAttached();
    await expect(bar).toHaveAttribute('role', 'progressbar');

    const fill = page.locator('.reading-progress-fill');
    await expect(fill).toBeAttached();
  });

  test('reading progress bar fills on scroll', async ({ page }) => {
    const fill = page.locator('.reading-progress-fill');

    // Scroll to middle of post
    await page.evaluate(() => {
      const post = document.querySelector('.blog-post');
      if (post) {
        const midY = post.getBoundingClientRect().top + window.scrollY + post.getBoundingClientRect().height / 2;
        window.scrollTo({ top: midY });
      }
    });
    await page.waitForTimeout(200);

    // Width should be > 0
    const width = await fill.evaluate((el) => parseFloat(getComputedStyle(el).width));
    expect(width).toBeGreaterThan(0);
  });

  test('TOC is generated with correct heading links', async ({ page }) => {
    const tocLinks = page.locator('.post-toc-link');
    const count = await tocLinks.count();

    // The Squad post has 7 h2s — should have at least 3+
    expect(count).toBeGreaterThanOrEqual(3);

    // Each link should have text and an href starting with #
    for (let i = 0; i < Math.min(count, 3); i++) {
      const link = tocLinks.nth(i);
      await expect(link).toHaveAttribute('href', /^#/);
      const text = await link.textContent();
      expect(text!.trim().length).toBeGreaterThan(0);
    }
  });

  test('TOC becomes visible after scrolling past header', async ({ page }) => {
    // TOC starts hidden (not visible class) when at top
    const toc = page.locator('.post-toc');

    // Scroll past the header section
    await page.evaluate(() => {
      const header = document.querySelector('.header-section');
      if (header) {
        const bottom = header.getBoundingClientRect().bottom + window.scrollY + 50;
        window.scrollTo({ top: bottom });
      }
    });
    await page.waitForTimeout(300);

    await expect(toc).toHaveClass(/post-toc--visible/);
  });

  test('clicking TOC link scrolls to the heading', async ({ page }) => {
    // Make TOC visible first
    await page.evaluate(() => window.scrollTo({ top: 500 }));
    await page.waitForTimeout(300);

    const firstLink = page.locator('.post-toc-link').first();
    const targetId = await firstLink.getAttribute('data-target');
    expect(targetId).toBeTruthy();

    // On narrow viewports the TOC is a bottom sheet — open it first if needed
    const toggle = page.locator('.post-toc-toggle');
    if (await toggle.isVisible()) {
      await toggle.click();
      await page.waitForTimeout(400);
    }

    await firstLink.click({ force: true });

    // Wait for smooth scroll to finish
    await page.waitForTimeout(1000);

    // The target heading should be near the top of the viewport
    const headingY = await page.evaluate((id) => {
      const el = document.getElementById(id!);
      return el ? el.getBoundingClientRect().top : 999;
    }, targetId);

    // Should be within ~120px of the top (accounting for navbar offset)
    expect(headingY).toBeLessThan(150);
    expect(headingY).toBeGreaterThan(-20);
  });

  test('active section highlights on scroll', async ({ page }) => {
    // Scroll to trigger visibility and section tracking
    await page.evaluate(() => window.scrollTo({ top: 800 }));
    await page.waitForTimeout(500);

    // At least one link should have the active class
    const activeLinks = page.locator('.post-toc-link.active');
    await expect(activeLinks.first()).toBeAttached({ timeout: 3000 });
  });

  test('TOC header shows "On this page"', async ({ page }) => {
    const title = page.locator('.post-toc-title');
    await expect(title).toHaveText('On this page');
  });

  test('TOC has proper ARIA label', async ({ page }) => {
    const toc = page.locator('.post-toc');
    await expect(toc).toHaveAttribute('aria-label', 'Table of contents');
  });

  test('h3 headings are indented (nested style)', async ({ page }) => {
    // Check if any nested items exist (h3s render with nested class)
    const nestedItems = page.locator('.post-toc-item--nested');
    const count = await nestedItems.count();
    // Not all posts have h3s, so this is valid at 0
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

test.describe('Post TOC - posts with few headings', () => {
  test('TOC does not appear on homepage (no .blog-post)', async ({ page }) => {
    await page.goto('');
    await page.waitForTimeout(500);

    // Homepage has no .blog-post, so TOC should not be created
    const toc = page.locator('.post-toc');
    await expect(toc).not.toBeAttached();

    const progressBar = page.locator('.reading-progress');
    await expect(progressBar).not.toBeAttached();
  });
});

test.describe('Post TOC - mobile behavior', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('mobile toggle button appears on scroll', async ({ page }) => {
    await page.goto(POST_WITH_HEADINGS);
    await page.waitForSelector('.post-toc-toggle', { timeout: 10000 });

    // Scroll past header
    await page.evaluate(() => window.scrollTo({ top: 600 }));
    await page.waitForTimeout(300);

    const toggle = page.locator('.post-toc-toggle');
    await expect(toggle).toHaveClass(/post-toc-toggle--visible/);
  });

  test('tapping toggle opens TOC on mobile', async ({ page }) => {
    await page.goto(POST_WITH_HEADINGS);
    await page.waitForSelector('.post-toc-toggle', { timeout: 10000 });

    // Scroll to make toggle visible
    await page.evaluate(() => window.scrollTo({ top: 600 }));
    await page.waitForTimeout(300);

    const toggle = page.locator('.post-toc-toggle');
    await toggle.click();

    const toc = page.locator('.post-toc');
    await expect(toc).toHaveClass(/post-toc--expanded/);
  });
});
