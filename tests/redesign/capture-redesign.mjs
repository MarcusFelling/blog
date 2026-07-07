// Post-redesign visual capture (Hockney) — the "after" set for the editorial restyle.
// Standalone script — intentionally NOT a *.spec.ts so `npx playwright test`
// does not collect it. Run against the frozen _site_redesign server:
//   node tests/redesign/capture-redesign.mjs
// Filenames mirror tests/baseline/ 1:1 so the coordinator can pair before/after.
// Desktop is 1280x800 (per the redesign brief — also exercises the >1024 3-col grid).
import { chromium } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:4000';
const OUT = dirname(fileURLToPath(import.meta.url));
const POST_WITH_CODE = '/blog/2017/getting-started-msbuild/';

// Animations disabled + reduced motion => stable, deterministic captures.
const SHOT = { animations: 'disabled', caret: 'hide' };

const results = [];
async function capture(label, fn) {
  try {
    await fn();
    results.push(`OK   ${label}`);
  } catch (err) {
    results.push(`FAIL ${label} -> ${err.message.split('\n')[0]}`);
  }
}

const browser = await chromium.launch();

async function newPage(width, height, dsf = 1) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dsf });
  const page = await ctx.newPage();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  return { ctx, page };
}

try {
  // --- Homepage desktop (1280x800) + navbar + footer (one desktop context) ---
  {
    const { ctx, page } = await newPage(1280, 800);
    await page.goto(`${BASE}/`, { waitUntil: 'load' });
    await page.waitForTimeout(500);

    await capture('homepage-desktop.png', () =>
      page.screenshot({ path: join(OUT, 'homepage-desktop.png'), fullPage: true, ...SHOT }));

    await capture('navbar-desktop.png', async () => {
      const nav = page.locator('nav[aria-label="Main navigation"]').first();
      const target = (await nav.count()) ? nav : page.locator('.navbar-modern').first();
      await target.screenshot({ path: join(OUT, 'navbar-desktop.png'), ...SHOT });
    });

    await capture('footer-desktop.png', async () => {
      const footer = page.locator('footer').first();
      await footer.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      await footer.screenshot({ path: join(OUT, 'footer-desktop.png'), ...SHOT });
    });
    await ctx.close();
  }

  // --- Homepage mobile (~390px) ---
  {
    const { ctx, page } = await newPage(390, 844, 2);
    await page.goto(`${BASE}/`, { waitUntil: 'load' });
    await page.waitForTimeout(500);
    await capture('homepage-mobile.png', () =>
      page.screenshot({ path: join(OUT, 'homepage-mobile.png'), fullPage: true, ...SHOT }));
    await ctx.close();
  }

  // --- Representative post with code blocks (same post as the baseline) ---
  {
    const { ctx, page } = await newPage(1280, 800);
    await page.goto(`${BASE}${POST_WITH_CODE}`, { waitUntil: 'load' });
    await page.waitForSelector('.code-toolbar', { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(500);
    await capture('post-with-code-desktop.png', () =>
      page.screenshot({ path: join(OUT, 'post-with-code-desktop.png'), fullPage: true, ...SHOT }));
    await ctx.close();
  }
} finally {
  await browser.close();
}

console.log('Redesign capture results (tests/redesign/):');
for (const r of results) console.log('  ' + r);
