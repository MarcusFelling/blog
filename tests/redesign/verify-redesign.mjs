// Post-redesign verification (Hockney) — the things McManus's ~853px integrated
// browser could not confirm live, plus the a11y spot-checks from the brief.
// Standalone script (not a *.spec.ts). Run against the frozen _site_redesign server:
//   node tests/redesign/verify-redesign.mjs
// Reports: >1024 3-col index grid, 2px accent focus rings, reduced-motion kills
// entrance motion, no horizontal scroll at 320px, footer has 0 social-chips,
// and WCAG contrast on the new muted text.
import { chromium } from '@playwright/test';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:4000';
const POST = '/blog/2017/getting-started-msbuild/';
const ACCENT = 'rgb(249, 115, 22)'; // #f97316

const lines = [];
const log = (s) => { lines.push(s); };

const browser = await chromium.launch();

// Contrast helpers injected into the page.
const CONTRAST_FNS = `
function parseRGB(s){const m=s&&s.match(/rgba?\\(([^)]+)\\)/);if(!m)return null;const p=m[1].split(',').map(x=>parseFloat(x));return{r:p[0],g:p[1],b:p[2],a:p[3]===undefined?1:p[3]};}
function lum({r,g,b}){const f=c=>{c/=255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4);};return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b);}
function ratio(fg,bg){const L1=lum(fg),L2=lum(bg),a=Math.max(L1,L2),b=Math.min(L1,L2);return (a+0.05)/(b+0.05);}
function effBg(el){let n=el;while(n&&n.nodeType===1){const p=parseRGB(getComputedStyle(n).backgroundColor);if(p&&p.a!==0)return p;n=n.parentElement;}return {r:13,g:17,b:23};}
`;

try {
  // ── 1. >1024 index grid = 3 columns (viewport 1280) ─────────────────────────
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/`, { waitUntil: 'load' });
    const cols = await page.evaluate(() => {
      const el = document.querySelector('.post-cards-container.modern-grid');
      if (!el) return null;
      return getComputedStyle(el).gridTemplateColumns.split(' ').filter(Boolean).length;
    });
    log(`[grid @1280]   index columns = ${cols}  -> ${cols === 3 ? 'PASS (3-up)' : 'FAIL (expected 3)'}`);
    await ctx.close();
  }

  // ── 2. Focus rings: keyboard-Tab sweep (guarantees :focus-visible) ───────────
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/`, { waitUntil: 'load' });
    const rings = [];
    for (let i = 0; i < 14; i++) {
      await page.keyboard.press('Tab');
      const info = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const cs = getComputedStyle(el);
        return {
          tag: el.tagName.toLowerCase(),
          cls: (el.className && el.className.toString ? el.className.toString() : '').split(' ')[0].slice(0, 26),
          w: cs.outlineWidth,
          style: cs.outlineStyle,
          color: cs.outlineColor,
        };
      });
      if (info && !rings.some((r) => r.tag === info.tag && r.cls === info.cls)) rings.push(info);
    }
    let ok = 0, bad = 0;
    for (const r of rings) {
      const px = parseFloat(r.w);
      const good = px >= 2 && r.style !== 'none' && r.color === ACCENT;
      if (good) ok++; else bad++;
      log(`[focus ring]   ${r.tag}.${r.cls || '(none)'}  ${r.w} ${r.style} ${r.color}  -> ${good ? 'accent 2px' : 'CHECK'}`);
    }
    log(`[focus ring]   summary: ${ok} accent-2px / ${bad} to-check across ${rings.length} focusable elements`);
    await ctx.close();
  }

  // ── 3. prefers-reduced-motion kills entrance motion ─────────────────────────
  {
    // no-preference: entrance animation should be DEFINED (motion exists but gated)
    const ctxN = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const pageN = await ctxN.newPage();
    await pageN.emulateMedia({ reducedMotion: 'no-preference' });
    await pageN.goto(`${BASE}/`, { waitUntil: 'load' });
    const noPref = await pageN.evaluate(() => {
      const el = document.querySelector('.fade-in-up');
      const cs = el ? getComputedStyle(el) : null;
      return { animName: cs ? cs.animationName : null };
    });
    await ctxN.close();

    // reduce: entrance disabled (animation none) + content already visible + no infinite loops
    const ctxR = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const pageR = await ctxR.newPage();
    await pageR.emulateMedia({ reducedMotion: 'reduce' });
    await pageR.goto(`${BASE}/`, { waitUntil: 'load' });
    const reduce = await pageR.evaluate(() => {
      const el = document.querySelector('.fade-in-up');
      const cs = el ? getComputedStyle(el) : null;
      let infinite = 0;
      document.querySelectorAll('*').forEach((n) => {
        const a = getComputedStyle(n);
        if (a.animationName !== 'none' && a.animationIterationCount === 'infinite') infinite++;
      });
      return { animName: cs ? cs.animationName : null, opacity: cs ? cs.opacity : null, infinite };
    });
    await ctxR.close();

    const motionGated = noPref.animName && noPref.animName !== 'none';
    const killed = reduce.animName === 'none';
    const visible = parseFloat(reduce.opacity) === 1;
    log(`[reduced-mo]   no-preference .fade-in-up animation = ${noPref.animName}  -> ${motionGated ? 'motion present' : 'no motion defined'}`);
    log(`[reduced-mo]   reduce: animation=${reduce.animName} opacity=${reduce.opacity} infinite-loops=${reduce.infinite}  -> ${killed && visible && reduce.infinite === 0 ? 'PASS (entrance killed, content visible, no loops)' : 'CHECK'}`);
  }

  // ── 4. No horizontal scroll at 320px (home + post) ──────────────────────────
  {
    const ctx = await browser.newContext({ viewport: { width: 320, height: 800 } });
    const page = await ctx.newPage();
    for (const [label, url] of [['home', `${BASE}/`], ['post', `${BASE}${POST}`]]) {
      await page.goto(url, { waitUntil: 'load' });
      const m = await page.evaluate(() => ({
        sw: document.documentElement.scrollWidth,
        cw: document.documentElement.clientWidth,
      }));
      const overflow = m.sw - m.cw;
      log(`[320px ${label.padEnd(4)}] scrollWidth=${m.sw} clientWidth=${m.cw} overflow=${overflow}px  -> ${overflow <= 1 ? 'PASS (no h-scroll)' : 'FAIL (overflow)'}`);
    }
    await ctx.close();
  }

  // ── 5. Footer exposes zero social-chips ─────────────────────────────────────
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/`, { waitUntil: 'load' });
    const chips = await page.locator('footer .social-chip').count();
    log(`[footer]       footer .social-chip count = ${chips}  -> ${chips === 0 ? 'PASS (minimal footer)' : 'FAIL'}`);
    await ctx.close();
  }

  // ── 6. Contrast on the new muted text (WCAG AA = 4.5:1 normal) ───────────────
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();

    await page.goto(`${BASE}/`, { waitUntil: 'load' });
    const homeSels = ['.popular-posts-eyebrow', '.popular-post-link', '.post-card-date', '.post-card-excerpt', '.post-card-meta'];
    const homeRes = await page.evaluate(({ sels, fns }) => {
      // eslint-disable-next-line no-eval
      eval(fns);
      return sels.map((sel) => {
        const el = document.querySelector(sel);
        if (!el) return { sel, missing: true };
        const fg = parseRGB(getComputedStyle(el).color);
        const bg = effBg(el);
        return { sel, r: Math.round(ratio(fg, bg) * 100) / 100 };
      });
    }, { sels: homeSels, fns: CONTRAST_FNS });

    await page.goto(`${BASE}${POST}`, { waitUntil: 'load' });
    const postSels = ['.reading-time', '.post-meta', '.blog-post'];
    const postRes = await page.evaluate(({ sels, fns }) => {
      // eslint-disable-next-line no-eval
      eval(fns);
      return sels.map((sel) => {
        const el = document.querySelector(sel);
        if (!el) return { sel, missing: true };
        const fg = parseRGB(getComputedStyle(el).color);
        const bg = effBg(el);
        return { sel, r: Math.round(ratio(fg, bg) * 100) / 100 };
      });
    }, { sels: postSels, fns: CONTRAST_FNS });

    for (const x of [...homeRes, ...postRes]) {
      if (x.missing) { log(`[contrast]     ${x.sel.padEnd(24)} (not present)`); continue; }
      const verdict = x.r >= 4.5 ? 'PASS AA' : x.r >= 3 ? 'WARN (large-text only)' : 'FAIL';
      log(`[contrast]     ${x.sel.padEnd(24)} ${x.r}:1  -> ${verdict}`);
    }
    await ctx.close();
  }
} finally {
  await browser.close();
}

console.log('Redesign verification (tests/redesign/):');
for (const l of lines) console.log('  ' + l);
