import { test, expect } from '@playwright/test';

// Use a post known to have multiple XML code blocks
const POST_WITH_CODE = '/blog/2017/getting-started-msbuild/';

test.describe('Copy Code Blocks', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(POST_WITH_CODE);
  });

  test('code blocks have a toolbar with dots, language label, and copy button', async ({ page }) => {
    const toolbar = page.locator('.code-toolbar').first();
    await expect(toolbar).toBeVisible();

    // Terminal dots are present
    const dots = toolbar.locator('.code-toolbar-dots');
    await expect(dots).toBeVisible();
    await expect(dots).toContainText('●');

    // Language label is present
    const langLabel = toolbar.locator('.code-lang-label');
    await expect(langLabel).toBeVisible();
    await expect(langLabel).toHaveText('XML');

    // Copy button is present
    const copyBtn = toolbar.locator('.copy-code-btn');
    await expect(copyBtn).toBeVisible();
    await expect(copyBtn).toHaveAttribute('aria-label', 'Copy code to clipboard');
  });

  test('every highlighted code block gets a toolbar', async ({ page }) => {
    const highlightBlocks = page.locator('div.highlighter-rouge');
    const toolbars = page.locator('.code-toolbar');

    const blockCount = await highlightBlocks.count();
    const toolbarCount = await toolbars.count();

    expect(blockCount).toBeGreaterThan(0);
    expect(toolbarCount).toBe(blockCount);
  });

  test('copy button shows checkmark feedback on click', async ({ page }) => {
    // Grant clipboard permission
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

    const copyBtn = page.locator('.copy-code-btn').first();
    await expect(copyBtn).toBeVisible();

    // Click the copy button
    await copyBtn.click();

    // Button should show copied state
    await expect(copyBtn).toHaveClass(/copied/);
    await expect(copyBtn).toHaveAttribute('aria-label', 'Copied!');

    // Check icon should be visible, copy icon hidden
    const checkIcon = copyBtn.locator('.check-icon');
    await expect(checkIcon).toBeVisible();

    // After 2 seconds, should revert
    await expect(copyBtn).not.toHaveClass(/copied/, { timeout: 3000 });
    await expect(copyBtn).toHaveAttribute('aria-label', 'Copy code to clipboard');
  });

  test('copy button copies actual code text to clipboard', async ({ page }) => {
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

    const firstCodeBlock = page.locator('div.highlighter-rouge').first();
    const codeText = await firstCodeBlock.locator('pre code').textContent();

    const copyBtn = firstCodeBlock.locator('.copy-code-btn');
    await copyBtn.click();

    // Read clipboard and verify it matches the code block content
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    // Normalize line endings and whitespace for comparison
    const normalize = (s: string) => s.replace(/\r\n/g, '\n').trim();
    expect(normalize(clipboardText)).toBe(normalize(codeText ?? ''));
  });

  test('copy button is keyboard accessible', async ({ page }) => {
    const copyBtn = page.locator('.copy-code-btn').first();

    // Tab to the copy button and verify it can receive focus
    await copyBtn.focus();
    await expect(copyBtn).toBeFocused();

    // Should have proper aria-label
    await expect(copyBtn).toHaveAttribute('aria-label', 'Copy code to clipboard');
  });

  test('highlight blocks have has-toolbar class (hides CSS ::before)', async ({ page }) => {
    const highlightDiv = page.locator('div.highlight.has-toolbar').first();
    await expect(highlightDiv).toBeVisible();
  });
});
