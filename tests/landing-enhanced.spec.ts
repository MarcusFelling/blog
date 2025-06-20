import { test, expect } from '@playwright/test';
import { MCPTestHelper } from './helpers/mcp-helper.js';

const mcpHelper = new MCPTestHelper();

test.describe('Enhanced Landing Page Tests', () => {
  test.beforeAll(async () => {
    await mcpHelper.connect();
  });

  test.afterAll(async () => {
    await mcpHelper.disconnect();
  });

  test('should display landing page with all essential elements', async ({ page }) => {
    console.log('🏠 Testing landing page with MCP analysis');
    
    await page.goto('');
    
    // Get MCP analysis for the landing page
    const pageAnalysis = await mcpHelper.analyzePageStructure('/');
    console.log('🔍 MCP Page Analysis:', pageAnalysis);
    
    // Original test assertions
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'RSS' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'GitHub', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'LinkedIn' })).toBeVisible();
    await expect(page.getByText('Marcus Felling •')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Archive' })).toBeVisible();
    
    // Enhanced MCP-suggested tests
    
    // SEO and metadata validation
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    expect(title.length).toBeLessThan(70);
    console.log(`📄 Page title: "${title}"`);
    
    // Check for meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    if (metaDescription) {
      expect(metaDescription.length).toBeGreaterThan(50);
      expect(metaDescription.length).toBeLessThan(160);
      console.log(`📝 Meta description: "${metaDescription.substring(0, 50)}..."`);
    }
    
    // Performance indicators
    const startTime = Date.now();
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    console.log(`⚡ Page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
    
    // Check for Core Web Vitals elements
    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
      expect(alt?.length).toBeGreaterThan(0);
    }
    
    // Verify social links work
    const githubLink = page.getByRole('link', { name: 'GitHub', exact: true });
    const linkedinLink = page.getByRole('link', { name: 'LinkedIn' });
    
    const githubHref = await githubLink.getAttribute('href');
    const linkedinHref = await linkedinLink.getAttribute('href');
    
    expect(githubHref).toContain('github.com');
    expect(linkedinHref).toContain('linkedin.com');
    
    // Check external links open in new tab
    expect(await githubLink.getAttribute('target')).toBe('_blank');
    expect(await linkedinLink.getAttribute('target')).toBe('_blank');
    
    // Verify RSS feed link
    const rssLink = page.getByRole('link', { name: 'RSS' });
    const rssHref = await rssLink.getAttribute('href');
    expect(rssHref).toMatch(/\\.(xml|rss)$/);
    
    // Test RSS feed actually works
    const rssResponse = await page.request.get(rssHref || '');
    expect(rssResponse.status()).toBe(200);
    expect(await rssResponse.text()).toContain('<?xml');
  });

  test('should be responsive across devices', async ({ page }) => {
    console.log('📱 Testing responsive design');
    
    const viewports = [
      { width: 320, height: 568, name: 'iPhone SE' },
      { width: 375, height: 812, name: 'iPhone X' },
      { width: 768, height: 1024, name: 'iPad' },
      { width: 1024, height: 1366, name: 'iPad Pro' },
      { width: 1920, height: 1080, name: 'Desktop' }
    ];

    for (const viewport of viewports) {
      console.log(`📐 Testing ${viewport.name} (${viewport.width}x${viewport.height})`);
      
      await page.setViewportSize(viewport);
      await page.goto('');
      
      // Essential elements should be visible on all screen sizes
      await expect(page.getByText('Marcus Felling •')).toBeVisible();
      await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
      
      // Navigation should be accessible
      const navElements = await page.locator('nav, .navigation, header').all();
      expect(navElements.length).toBeGreaterThan(0);
      
      // Content should not overflow horizontally
      const bodyOverflow = await page.evaluate(() => {
        const body = document.body;
        return {
          scrollWidth: body.scrollWidth,
          clientWidth: body.clientWidth,
          hasHorizontalScroll: body.scrollWidth > body.clientWidth
        };
      });
      
      if (bodyOverflow.hasHorizontalScroll) {
        console.warn(`⚠️  Horizontal scroll detected on ${viewport.name}`);
        // Allow small differences for scrollbars
        expect(bodyOverflow.scrollWidth - bodyOverflow.clientWidth).toBeLessThan(20);
      }
    }
  });

  test('should have proper accessibility features', async ({ page }) => {
    console.log('♿ Testing accessibility features');
    
    await page.goto('');
    
    // Keyboard navigation
    await page.keyboard.press('Tab');
    const firstFocusable = page.locator(':focus');
    await expect(firstFocusable).toBeVisible();
      // Test several tab stops
    const focusableElements: Array<{tag: string, role: string | null, label: string | null, text: string | undefined}> = [];
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('Tab');
      const currentFocus = page.locator(':focus');
      
      if (await currentFocus.count() > 0) {
        const tagName = await currentFocus.evaluate(el => el.tagName.toLowerCase());
        const role = await currentFocus.getAttribute('role');
        const ariaLabel = await currentFocus.getAttribute('aria-label');
        const text = await currentFocus.textContent();
        
        focusableElements.push({
          tag: tagName,
          role: role,
          label: ariaLabel,
          text: text?.substring(0, 30)
        });
      }
    }
    
    console.log('🎯 Focusable elements:', focusableElements);
    expect(focusableElements.length).toBeGreaterThan(3);
    
    // Check for proper heading structure
    const h1Elements = await page.locator('h1').count();
    expect(h1Elements).toBe(1);
    
    // Check for landmarks
    const landmarks = await page.locator('main, nav, header, footer, [role="main"], [role="navigation"], [role="banner"], [role="contentinfo"]').count();
    expect(landmarks).toBeGreaterThan(0);
  });

  test('should perform well and load efficiently', async ({ page }) => {
    console.log('⚡ Testing performance metrics');
    
    // Start performance measurement
    const startTime = Date.now();
    
    await page.goto('', { waitUntil: 'networkidle' });
    
    const endTime = Date.now();
    const totalLoadTime = endTime - startTime;
    
    console.log(`📊 Total load time: ${totalLoadTime}ms`);
    expect(totalLoadTime).toBeLessThan(3000); // Should load within 3 seconds
    
    // Check for performance best practices
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime,
        firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime
      };
    });
    
    console.log('📈 Performance metrics:', performanceMetrics);
    
    // Basic performance expectations
    if (performanceMetrics.firstContentfulPaint) {
      expect(performanceMetrics.firstContentfulPaint).toBeLessThan(2000);
    }
    
    // Check image optimization
    const images = await page.locator('img').all();
    for (const img of images) {
      const src = await img.getAttribute('src');
      const naturalDimensions = await img.evaluate((el: HTMLImageElement) => ({
        naturalWidth: el.naturalWidth,
        naturalHeight: el.naturalHeight,
        displayWidth: el.offsetWidth,
        displayHeight: el.offsetHeight
      }));
      
      // Images shouldn't be drastically larger than their display size
      if (naturalDimensions.displayWidth > 0) {
        const widthRatio = naturalDimensions.naturalWidth / naturalDimensions.displayWidth;
        if (widthRatio > 2) {
          console.warn(`⚠️  Image may be oversized: ${src} (${naturalDimensions.naturalWidth}px served for ${naturalDimensions.displayWidth}px display)`);
        }
      }
    }
  });

  test('should handle navigation correctly', async ({ page }) => {
    console.log('🧭 Testing navigation functionality');
    
    await page.goto('');
    
    // Test archive link
    await page.getByRole('link', { name: 'Archive' }).click();
    await expect(page).toHaveURL(/.*archive.*/);
    await expect(page.locator('h1, h2')).toContainText(/archive/i);
    
    // Go back to home
    await page.getByRole('link', { name: 'Home' }).click();
    await expect(page).toHaveURL('http://127.0.0.1:4000/');
    
    // Test that external links have proper attributes
    const externalLinks = await page.locator('a[href^="http"]:not([href*="127.0.0.1"]):not([href*="localhost"])').all();
    
    for (const link of externalLinks) {
      const target = await link.getAttribute('target');
      const rel = await link.getAttribute('rel');
      
      expect(target).toBe('_blank');
      expect(rel).toContain('noopener');
    }
  });
});
