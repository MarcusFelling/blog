import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('');
});

test('scroll-to-top button appears when scrolling down and works', async ({ page }) => {
  // Initial state - button should be hidden
  const scrollTopButton = page.locator('#scroll-to-top');
  await expect(scrollTopButton).toBeVisible();
  
  // Button should have opacity: 0 when not visible class
  const initialOpacity = await scrollTopButton.evaluate(el => 
    window.getComputedStyle(el).opacity);
  expect(Number(initialOpacity)).toBe(0);
  
  // Scroll down to make the button appear
  await page.evaluate(() => window.scrollTo(0, 500));
  
  // Wait for the button to become visible (get the 'visible' class)
  await expect(scrollTopButton).toHaveClass(/visible/);
  
  // Click the button
  await scrollTopButton.click();
  
  // Check if page scrolled back to top
  await page.waitForFunction(() => window.pageYOffset < 50);
  
  const finalScroll = await page.evaluate(() => window.pageYOffset);
  expect(finalScroll).toBeLessThan(50);
});
