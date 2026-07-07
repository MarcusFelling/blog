// Polish-pass verification (Hockney) — targeted checks for McManus's 3-fix
// editorial-restyle polish, plus a QUANTIFIED measurement of the pre-existing
// mobile-drawer horizontal-scroll finding (documented as a follow-up; NOT fixed
// here — the standing decision forbids drawer assertions until it is stable).
//
// Standalone script (not a *.spec.ts). Run against the frozen build server:
//   node tests/redesign/verify-polish.mjs
//
// Covers:
//   1. Branded 2px accent :focus-visible ring on .search-trigger (hero ⌘K) and
//      .cmd-palette-hint (nav ⌘K badge) via REAL keyboard Tab (not .focus()).
//   2. Long unwrapped prose URLs wrap at 320px (no .blog-post a overflow) on the
//      two autolink posts + computed overflow-wrap === 'anywhere'.
//   3. Homepage entrance still animates via CSS + zero console/page errors
//      (guards the dead-JS removal from _includes/footer-scripts.html).
//   4. FOLLOW-UP MEASUREMENT: off-canvas .mobile-drawer (position:fixed,
//      translateX(110%)) horizontal scroll on post pages vs the clean homepage,
//      at 320px + 390px, counted across every built post.
import { chromium } from '@playwright/test';
import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:4000';
const ACCENT = 'rgb(249, 115, 22)'; // #f97316
const SITE_DIR = '_site_redesign2';

// Two posts whose prose contains a bare <autolink> URL rendered as its own link
// text (the exact "long unwrapped URL in prose" overflow driver).
const LONG_URL_POSTS = [
  '/blog/2017/simple-explanation-private-pipeline-billing-vsts/',
  '/blog/2017/octopus-deploy-running-deployment-steps-parallel/',
];

const lines = [];
const log = (s) => { lines.push(s); };

// Enumerate every built post URL (/blog/YYYY/slug/) from the frozen site dir.
function builtPostUrls() {
  const urls = [];
  const blogDir = join(SITE_DIR, 'blog');
  if (!existsSync(blogDir)) return urls;
  for (const year of readdirSync(blogDir, { withFileTypes: true })) {
    if (!year.isDirectory() || !/^\d{4}$/.test(year.name)) continue;
    for (const slug of readdirSync(join(blogDir, year.name), { withFileTypes: true })) {
      if (!slug.isDirectory()) continue;
      if (existsSync(join(blogDir, year.name, slug.name, 'index.html'))) {
        urls.push(`/blog/${year.name}/${slug.name}/`);
      }
    }
  }
  return urls;
}

// Probe horizontal scroll two independent ways + inspect the drawer box.
// flowOverflow (scrollWidth-clientWidth) misses a position:fixed off-canvas box;
// canScrollRight (McManus's method) actually drives the scroller and catches it.
const SCROLL_PROBE = () => {
  const de = document.documentElement;
  const se = document.scrollingElement || de;
  const flowOverflow = de.scrollWidth - de.clientWidth;
  const before = se.scrollLeft;
  se.scrollLeft = 99999;
  const canScrollRight = Math.round(se.scrollLeft);
  se.scrollLeft = before;

  let drawer = null;
  let transformedAncestor = null;
  const d = document.querySelector('.mobile-drawer');
  if (d) {
    const r = d.getBoundingClientRect();
    const cs = getComputedStyle(d);
    drawer = {
      left: Math.round(r.left),
      right: Math.round(r.right),
      width: Math.round(r.width),
      position: cs.position,
      transform: cs.transform,
    };
    let n = d.parentElement;
    while (n && n !== document.documentElement) {
      const s = getComputedStyle(n);
      if ((s.transform && s.transform !== 'none') ||
          (s.filter && s.filter !== 'none') ||
          (s.perspective && s.perspective !== 'none') ||
          s.willChange === 'transform') {
        transformedAncestor = {
          sel: n.tagName.toLowerCase() + (n.className ? '.' + n.className.toString().trim().split(/\s+/)[0] : ''),
          transform: s.transform,
          filter: s.filter,
          willChange: s.willChange,
        };
        break;
      }
      n = n.parentElement;
    }
  }
  return { flowOverflow, canScrollRight, drawer, transformedAncestor };
};

// Attribution probe: measure horizontal scroll WITH the drawer, then again with
// the drawer (+ backdrop) hidden, so the drawer's true contribution is isolated
// from content-driven overflow (long prose tokens / wide images). Also reports
// the widest non-drawer offender element so the real cause is named per post.
const ATTRIB_PROBE = () => {
  const de = document.documentElement;
  const se = document.scrollingElement || de;
  const cw = de.clientWidth;
  const measure = () => { const b = se.scrollLeft; se.scrollLeft = 99999; const v = Math.round(se.scrollLeft); se.scrollLeft = b; return v; };

  const withDrawer = measure();

  const d = document.querySelector('.mobile-drawer');
  const backdrop = document.querySelector('.mobile-drawer-backdrop');
  let drawer = null, transformedAncestor = null;
  if (d) {
    const r = d.getBoundingClientRect();
    const cs = getComputedStyle(d);
    drawer = { left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width), position: cs.position, transform: cs.transform };
    let n = d.parentElement;
    while (n && n !== de) {
      const s = getComputedStyle(n);
      if ((s.transform && s.transform !== 'none') || (s.filter && s.filter !== 'none') || (s.perspective && s.perspective !== 'none') || s.willChange === 'transform') {
        transformedAncestor = { sel: n.tagName.toLowerCase() + (n.className ? '.' + n.className.toString().trim().split(/\s+/)[0] : ''), transform: s.transform };
        break;
      }
      n = n.parentElement;
    }
  }

  // Isolate the drawer's contribution: hide drawer + backdrop, re-measure.
  const prevD = d ? d.style.display : null;
  const prevB = backdrop ? backdrop.style.display : null;
  if (d) d.style.display = 'none';
  if (backdrop) backdrop.style.display = 'none';
  const withoutDrawer = measure();
  if (d) d.style.display = prevD;
  if (backdrop) backdrop.style.display = prevB;
  const drawerContribution = Math.max(0, withDrawer - withoutDrawer);

  // Widest non-drawer offender (right edge past the viewport), excluding the
  // fixed off-canvas layers (drawer, backdrop, command palette).
  let offender = null;
  const skip = (el) => el.closest('.mobile-drawer') || el.closest('.mobile-drawer-backdrop') || el.closest('#cmd-palette');
  for (const el of document.body.querySelectorAll('*')) {
    if (skip(el)) continue;
    const right = el.getBoundingClientRect().right;
    if (right > cw + 1 && (!offender || right > offender.right)) {
      offender = {
        sel: el.tagName.toLowerCase() + (el.className && el.className.toString ? '.' + el.className.toString().trim().split(/\s+/)[0] : ''),
        right: Math.round(right),
        text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30),
      };
    }
  }

  return { withDrawer, withoutDrawer, drawerContribution, drawer, transformedAncestor, offender };
};

const browser = await chromium.launch();
try {
  // ── 1. Focus ring: keyboard-Tab to each ⌘K control, assert :focus-visible ───
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/`, { waitUntil: 'load' });
    log('FIX 1 — branded 2px accent :focus-visible ring (real keyboard Tab):');
    for (const sel of ['.cmd-palette-hint', '.search-trigger']) {
      let reached = false;
      for (let i = 0; i < 30 && !reached; i++) {
        await page.keyboard.press('Tab');
        reached = await page.evaluate((s) => !!document.activeElement?.matches(s), sel);
      }
      if (!reached) { log(`  ${sel.padEnd(20)} NOT keyboard-reachable in 30 Tabs -> FAIL`); continue; }
      const r = await page.evaluate((s) => {
        const el = document.querySelector(s);
        const cs = getComputedStyle(el);
        return { fv: el.matches(':focus-visible'), w: cs.outlineWidth, style: cs.outlineStyle, color: cs.outlineColor };
      }, sel);
      const good = r.fv && parseFloat(r.w) >= 2 && r.style !== 'none' && r.color === ACCENT;
      log(`  ${sel.padEnd(20)} :focus-visible=${r.fv} outline=${r.w} ${r.style} ${r.color} -> ${good ? 'PASS' : 'FAIL'}`);
    }
    await ctx.close();
  }

  // ── 2. Long prose URLs wrap at 320px (no .blog-post a overflow) ─────────────
  {
    const ctx = await browser.newContext({ viewport: { width: 320, height: 800 } });
    const page = await ctx.newPage();
    log('FIX 2 — long prose links wrap at 320px (.blog-post a overflow-wrap):');
    for (const post of LONG_URL_POSTS) {
      await page.goto(`${BASE}${post}`, { waitUntil: 'load' });
      const res = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('.blog-post a'));
        const cw = document.documentElement.clientWidth;
        let worstText = '', worstLen = 0, offenders = 0, maxRight = 0;
        let wrapProp = links.length ? getComputedStyle(links[0]).overflowWrap : 'n/a';
        for (const a of links) {
          const t = (a.textContent || '').trim();
          if (t.length > worstLen) { worstLen = t.length; worstText = t; }
          const right = a.getBoundingClientRect().right;
          if (right > maxRight) maxRight = right;
          if (right > cw + 1) offenders++;
        }
        return { count: links.length, wrapProp, offenders, maxRight: Math.round(maxRight), cw, worstLen };
      });
      const good = res.offenders === 0 && res.wrapProp === 'anywhere';
      log(`  ${post}`);
      log(`     ${res.count} links, overflow-wrap=${res.wrapProp}, longest link text=${res.worstLen} chars,`);
      log(`     max right edge=${res.maxRight}px vs clientWidth=${res.cw}px, offenders=${res.offenders} -> ${good ? 'PASS' : 'FAIL'}`);
    }
    await ctx.close();
  }

  // ── 3. Entrance still animates + no console/page errors (footer-scripts) ────
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(`${BASE}/`, { waitUntil: 'load' });
    await page.waitForTimeout(600); // let entrance + any late scripts run
    const anim = await page.evaluate(() => {
      const el = document.querySelector('.fade-in-up');
      return el ? getComputedStyle(el).animationName : null;
    });
    log('FIX 3 — dead footer JS removed (entrance via CSS + clean console):');
    log(`  .fade-in-up animation-name=${anim} -> ${anim && anim !== 'none' ? 'PASS (CSS entrance present)' : 'FAIL'}`);
    log(`  console/page errors on homepage load = ${errors.length} -> ${errors.length === 0 ? 'PASS (clean)' : 'FAIL'}`);
    for (const e of errors) log(`     ${e}`);
    await ctx.close();
  }

  // ── 4. FOLLOW-UP: quantify post-page horizontal scroll + ATTRIBUTE the cause ─
  //    (drawer vs prose token vs image) — do NOT fix; drawer assertions are
  //    forbidden by the standing decision until the drawer is stable in CI.
  {
    log('FOLLOW-UP (not fixed) — post-page horizontal scroll, cause-attributed:');
    const posts = builtPostUrls();

    // Detailed home-vs-post contrast at 320 + 390 (drawer geometry + isolation).
    for (const width of [320, 390]) {
      const ctx = await browser.newContext({ viewport: { width, height: 800 } });
      const page = await ctx.newPage();
      await page.goto(`${BASE}/`, { waitUntil: 'load' });
      const home = await page.evaluate(SCROLL_PROBE);
      await page.goto(`${BASE}/blog/2017/gitflow-visual-studio-team-services/`, { waitUntil: 'load' });
      const post = await page.evaluate(ATTRIB_PROBE);
      log(`  @${width}px HOME  canScrollRight=${home.canScrollRight}px  drawer.right=${home.drawer?.right}`);
      log(`  @${width}px POST(gitflow)  canScrollRight=${post.withDrawer}px  drawerContribution=${post.drawerContribution}px` +
          `  drawer=[${post.drawer?.left},${post.drawer?.right}] pos=${post.drawer?.position}`);
      log(`  @${width}px POST(gitflow)  transformedAncestorAboveDrawer=${post.transformedAncestor ? post.transformedAncestor.sel : 'none'}` +
          `  widest non-drawer offender: ${post.offender ? post.offender.sel + ' right=' + post.offender.right + 'px "' + post.offender.text + '"' : 'none'}`);
      await ctx.close();
    }

    // Full crawl @320px: attribute each affected post to drawer vs content.
    {
      const ctx = await browser.newContext({ viewport: { width: 320, height: 800 } });
      const page = await ctx.newPage();
      let drawerPosts = 0, contentPosts = 0, clean = 0;
      let drawerMin = Infinity, drawerMax = 0;
      const contentOffenders = [];
      for (const url of posts) {
        await page.goto(`${BASE}${url}`, { waitUntil: 'load' });
        const a = await page.evaluate(ATTRIB_PROBE);
        const contentScroll = a.withDrawer - a.drawerContribution; // scroll left once drawer is removed
        if (a.drawerContribution > 1) {
          drawerPosts++;
          drawerMin = Math.min(drawerMin, a.drawerContribution);
          drawerMax = Math.max(drawerMax, a.drawerContribution);
        }
        if (contentScroll > 1) {
          contentPosts++;
          if (contentOffenders.length < 5 && a.offender) {
            contentOffenders.push(`${url.replace('/blog/', '')} ${a.offender.sel} +${contentScroll}px`);
          }
        }
        if (a.withDrawer <= 1) clean++;
      }
      log(`  crawl @320px across ${posts.length} posts:`);
      log(`     drawer contributes horizontal scroll on ${drawerPosts} posts` +
          (drawerPosts ? ` (${drawerMin === Infinity ? 0 : drawerMin}–${drawerMax}px)` : '') + ` -> drawer is${drawerPosts ? '' : ' NOT'} a scroll driver`);
      log(`     content (long prose token / wide image) drives scroll on ${contentPosts} posts, ${clean} fully clean`);
      for (const o of contentOffenders) log(`        e.g. ${o}`);
      await ctx.close();
    }
  }
} finally {
  await browser.close();
}

console.log('Polish-pass verification (tests/redesign/verify-polish.mjs):');
for (const l of lines) console.log('  ' + l);
