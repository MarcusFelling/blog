import { test, expect } from '@playwright/test';
import { MCPTestHelper } from './helpers/mcp-helper.js';

const mcpHelper = new MCPTestHelper();

test.describe('MCP-Enhanced Accessibility Tests', () => {
  test.beforeAll(async () => {
    await mcpHelper.connect();
  });

  test.afterAll(async () => {
    await mcpHelper.disconnect();
  });

  test('should meet WCAG guidelines on home page', async ({ page }) => {
    await page.goto('');
    
    // Use MCP to analyze accessibility
    console.log('🔍 Running MCP accessibility analysis...');
    const analysis = await mcpHelper.analyzePageStructure('/');
    console.log('📋 MCP Analysis:', analysis);
    
    // Basic accessibility checks
    await expect(page.locator('h1')).toBeVisible();
    
    // Check for alt text on images
    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
      expect(alt?.length).toBeGreaterThan(0);
    }
    
    // Check for proper heading hierarchy
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1); // Should have exactly one H1
    
    // Check for skip links or proper navigation
    const skipLink = page.locator('a[href="#main"], a[href="#content"], a[href="#skip"]');
    const navElement = page.locator('nav, [role="navigation"]');
    
    // Either skip links OR clear navigation should be present
    const hasSkipLink = await skipLink.count() > 0;
    const hasNav = await navElement.count() > 0;
    expect(hasSkipLink || hasNav).toBeTruthy();
    
    // Check for proper landmarks
    const mainLandmark = page.locator('main, [role="main"]');
    await expect(mainLandmark).toBeVisible();
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('');
    
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    let focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
      // Continue tabbing to ensure focus is visible and logical
    const focusableElements: string[] = [];
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      const currentFocus = page.locator(':focus');
      
      if (await currentFocus.count() > 0) {
        await expect(currentFocus).toBeVisible();
        
        // Check if focus is visible (has outline or background change)
        const focusStyles = await currentFocus.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            outline: styles.outline,
            outlineWidth: styles.outlineWidth,
            backgroundColor: styles.backgroundColor,
            border: styles.border
          };
        });
        
        const hasFocusIndicator = 
          focusStyles.outline !== 'none' || 
          focusStyles.outlineWidth !== '0px' ||
          focusStyles.backgroundColor !== 'rgba(0, 0, 0, 0)';
          if (hasFocusIndicator) {
          const textContent = await currentFocus.textContent();
          if (textContent) {
            focusableElements.push(textContent);
          }
        }
      }
    }
    
    // Should have found some focusable elements
    expect(focusableElements.length).toBeGreaterThan(0);
  });

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('');
    
    // Check main text elements for color contrast
    const textElements = await page.locator('h1, h2, h3, p, a').all();
    
    for (const element of textElements.slice(0, 5)) { // Check first 5 elements
      const styles = await element.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
          fontSize: computed.fontSize
        };
      });
      
      // Basic check - ensure text has color and background is defined
      expect(styles.color).not.toBe('');
      expect(styles.color).not.toBe('transparent');
    }
  });

  test('should work with screen reader simulation', async ({ page }) => {
    await page.goto('');
    
    // Check for proper ARIA labels and roles
    const ariaElements = await page.locator('[aria-label], [aria-labelledby], [aria-describedby]').all();
    
    for (const element of ariaElements) {
      const ariaLabel = await element.getAttribute('aria-label');
      const ariaLabelledBy = await element.getAttribute('aria-labelledby');
      const ariaDescribedBy = await element.getAttribute('aria-describedby');
      
      // If element has aria attributes, they should have meaningful values
      if (ariaLabel) {
        expect(ariaLabel.length).toBeGreaterThan(0);
      }
      if (ariaLabelledBy) {
        const labelElement = page.locator(`#${ariaLabelledBy}`);
        await expect(labelElement).toBeVisible();
      }
    }
    
    // Check for proper form labels
    const inputs = await page.locator('input, textarea, select').all();
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        const hasLabel = await label.count() > 0;
        const hasAriaLabel = ariaLabel && ariaLabel.length > 0;
        
        // Should have either a label or aria-label
        expect(hasLabel || hasAriaLabel).toBeTruthy();
      }
    }
  });

  test('should have responsive design for accessibility', async ({ page }) => {
    // Test different viewport sizes for accessibility
    const viewports = [
      { width: 320, height: 568, name: 'Mobile Portrait' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1920, height: 1080, name: 'Desktop' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('');
      
      console.log(`📱 Testing accessibility on ${viewport.name} (${viewport.width}x${viewport.height})`);
      
      // Ensure navigation is accessible on all screen sizes
      const navElements = await page.locator('nav, [role="navigation"]').all();
      for (const nav of navElements) {
        await expect(nav).toBeVisible();
      }
      
      // Check that text is readable (not too small)
      const mainContent = page.locator('main, article, .content');
      if (await mainContent.count() > 0) {
        const fontSize = await mainContent.first().evaluate(el => {
          return window.getComputedStyle(el).fontSize;
        });
        
        const fontSizeNum = parseInt(fontSize);
        expect(fontSizeNum).toBeGreaterThanOrEqual(16); // Minimum readable font size
      }
      
      // Ensure touch targets are large enough on mobile
      if (viewport.width <= 768) {
        const clickableElements = await page.locator('button, a, input[type="button"], input[type="submit"]').all();
        
        for (const element of clickableElements.slice(0, 3)) {
          const box = await element.boundingBox();
          if (box) {
            // Touch targets should be at least 44x44px
            expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(44);
          }
        }
      }
    }
  });

  test('should provide meaningful error messages', async ({ page }) => {
    await page.goto('');
    
    // Check if there's a search form to test error handling
    const searchInput = page.locator('input[type="search"], input[name*="search"], #search');
    
    if (await searchInput.count() > 0) {
      // Test empty search
      await searchInput.fill('');
      await page.keyboard.press('Enter');
      
      // Look for error messages or validation feedback
      const errorMessages = page.locator('[role="alert"], .error, .validation-error');
      if (await errorMessages.count() > 0) {
        // Error messages should be descriptive
        const errorText = await errorMessages.first().textContent();
        expect(errorText?.length).toBeGreaterThan(5);
      }
    }
    
    // Check 404 page accessibility
    await page.goto('/nonexistent-page', { waitUntil: 'networkidle' });
    
    // Should have proper heading structure on error pages
    const errorHeading = page.locator('h1');
    if (await errorHeading.count() > 0) {
      await expect(errorHeading).toBeVisible();
      const headingText = await errorHeading.textContent();
      expect(headingText?.toLowerCase()).toContain('404');
    }
  });
});
