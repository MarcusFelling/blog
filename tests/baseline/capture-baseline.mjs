// Pre-redesign visual baseline capture (Hockney).
// Standalone script — intentionally NOT a *.spec.ts so `npx playwright test`
// does not collect it. Run against the frozen _site_baseline server:
//   node tests/baseline/capture-baseline.mjs
// Captures reference screenshots of the CURRENT design so the redesign can be
// visually diffed against a known-good starting point.
import { chromium } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:4000';
const OUT = dirname(fileURLToPath(import.meta.url));
const POST_WITH_CODE = '/blog/2017/getting-started-msbuild/';

// Animations disabled + reduced motion => stable, deterministic captures and
// avoids the animated sheen/pulse-glow layers destabilising fullPage renders.
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
  // --- Homepage desktop + navbar + footer (one desktop context) ---
  {
    const { ctx, page } = await newPage(1440, 900);
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

  // --- Homepage mobile ---
  {
    const { ctx, page } = await newPage(390, 844, 2);
    await page.goto(`${BASE}/`, { waitUntil: 'load' });
    await page.waitForTimeout(500);
    await capture('homepage-mobile.png', () =>
      page.screenshot({ path: join(OUT, 'homepage-mobile.png'), fullPage: true, ...SHOT }));
    await ctx.close();
  }

  // --- Representative post with code blocks ---
  {
    const { ctx, page } = await newPage(1440, 900);
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

console.log('Baseline capture results (tests/baseline/):');
for (const r of results) console.log('  ' + r);
