import { test, expect } from '@playwright/test';

test.describe('Archives Page', () => {
  test('should load archives page successfully', async ({ page }) => {
    // Navigate to the archives page
    await page.goto('/archives');

    // Verify the page title
    await expect(page).toHaveTitle(/Archives/);

    // Verify the title exists
    const title = page.getByRole('heading', { name: 'Archives' });
    await expect(title).toBeVisible();
  });

  test('should display tags section with links', async ({ page }) => {
    await page.goto('/archives');

    // Look for the Tags heading instead of the tag-cloud class
    const tagsHeading = page.locator('h2:text-is("Tags")');
    await expect(tagsHeading).toBeVisible();
    
    // Find all tag links under the Tags heading
    const tagLinks = page.locator('h2:text-is("Tags") + div a');
    
    // Check that we have multiple tag links
    const count = await tagLinks.count();
    expect(count).toBeGreaterThan(5); // We should have at least a few tags
    
    // Check that common tags exist
    const expectedTags = [
      'Azure DevOps',
      'CI/CD',
      'Playwright'
    ];
    
    for (const tag of expectedTags) {
      const tagLink = page.locator(`h2:text-is("Tags") + div a:has-text("${tag}")`);
      await expect(tagLink).toBeVisible();
    }
  });

  test('should navigate to sections when clicking tag links', async ({ page }) => {
    await page.goto('/archives');

    // Click on a tag and verify it scrolls to the section
    await page.locator('h2:text-is("Tags") + div a:has-text("Playwright")').click();
    
    // Check if URL includes the fragment
    await expect(page).toHaveURL(/.*#playwright$/);
    
    // Verify the section heading is in viewport
    const playwrightHeading = page.locator('h2:text-is("Playwright")');
    await expect(playwrightHeading).toBeVisible();
  });

  test('should display posts under each section', async ({ page }) => {
    await page.goto('/archives');

    const sections = [
      'Azure DevOps / TFS',
      'CI/CD',
      'Git',
      'GitHub Actions',
      'Infra as Code',
      'Octopus Deploy',
      'Playwright',
      'VS Code Extensions',
      'Windows'
    ];

    // For each section, verify heading 
    for (const section of sections) {
      const sectionHeading = page.locator(`h2:text-is("${section}")`);
      await expect(sectionHeading).toBeVisible();
    }
  });
  test('should verify all archive links return status 200', async ({ page, request }) => {
    await page.goto('/archives');
    // Get all links on archives page
    const links = await page.$$eval('a', elements => elements.map(el => el.href));
    // Loop through each link and check if response is 200
    for (const link of links) {
      const response = await request.get(link);
      expect(response.status(), `Check failed for ${link}`).toBe(200);
    }
  });  
});
