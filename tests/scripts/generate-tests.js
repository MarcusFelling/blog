const fs = require('fs');
const path = require('path');

async function generateBlogPostTests() {
  console.log('🚀 Generating tests for blog posts using MCP...');
  
  const postsDir = path.join(process.cwd(), '_posts');
  const testsDir = path.join(process.cwd(), 'tests', 'generated');
  
  // Ensure tests directory exists
  if (!fs.existsSync(testsDir)) {
    fs.mkdirSync(testsDir, { recursive: true });
  }
  
  // Get all blog post files
  const postFiles = fs.readdirSync(postsDir)
    .filter(file => file.endsWith('.md'))
    .slice(0, 5); // Limit to first 5 for demo
  
  console.log(`Found ${postFiles.length} blog posts to generate tests for`);
  
  // Generate test file content
  let testContent = `import { test, expect } from '@playwright/test';
import { MCPTestHelper } from '../helpers/mcp-helper.js';

const mcpHelper = new MCPTestHelper();

test.describe('Generated Blog Post Tests', () => {
  test.beforeAll(async () => {
    await mcpHelper.connect();
  });

  test.afterAll(async () => {
    await mcpHelper.disconnect();
  });

`;

  for (const postFile of postFiles) {
    const postName = postFile.replace('.md', '');
    const postDate = postName.substring(0, 10); // Extract YYYY-MM-DD
    const postSlug = postName.substring(11); // Everything after the date
    const postUrl = `/${postDate.replace(/-/g, '/')}/${postSlug}/`;
    
    console.log(`📝 Generating test for: ${postName}`);
    
    testContent += `  test('should load blog post: ${postSlug}', async ({ page }) => {
    console.log('🔍 Testing blog post: ${postSlug}');
    
    await page.goto('${postUrl}');
    
    // Basic page structure
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('article, .post, .content')).toBeVisible();
    
    // Post metadata
    await expect(page.locator('.post-date, .date, time, [datetime]')).toBeVisible();
    
    // Content validation
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(0);
    
    // Check for proper heading hierarchy
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
    
    // Verify no broken images
    const images = await page.locator('img').all();
    for (const img of images) {
      const src = await img.getAttribute('src');
      expect(src).toBeTruthy();
      
      // Check if image loads (basic check)
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
    
    // Check internal links work
    const internalLinks = await page.locator('a[href^="/"], a[href^="./"], a[href^="../"]').all();
    for (const link of internalLinks.slice(0, 3)) { // Test first 3 links
      const href = await link.getAttribute('href');
      if (href && !href.includes('#')) { // Skip anchor links
        const response = await page.request.get(href);
        expect(response.status()).toBeLessThan(400);
      }
    }
    
    // Check for code blocks if present
    const codeBlocks = await page.locator('pre, code').all();
    if (codeBlocks.length > 0) {
      for (const block of codeBlocks.slice(0, 2)) {
        await expect(block).toBeVisible();
        const content = await block.textContent();
        expect(content?.length).toBeGreaterThan(0);
      }
    }
    
    // SEO basics
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    expect(title.length).toBeLessThan(70); // SEO best practice
    
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    if (metaDescription) {
      expect(metaDescription.length).toBeGreaterThan(50);
      expect(metaDescription.length).toBeLessThan(160); // SEO best practice
    }
  });

`;
  }

  // Add a comprehensive test for all posts
  testContent += `  test('should have consistent structure across all posts', async ({ page }) => {
    console.log('🔍 Testing consistent blog post structure');
    
    const testPosts = [${postFiles.slice(0, 3).map(file => {
      const postName = file.replace('.md', '');
      const postDate = postName.substring(0, 10);
      const postSlug = postName.substring(11);
      return `'/${postDate.replace(/-/g, '/')}/${postSlug}/'`;
    }).join(', ')}];
    
    for (const postUrl of testPosts) {
      await page.goto(postUrl);
      
      // Consistent navigation
      await expect(page.locator('nav, .navigation, header')).toBeVisible();
      
      // Consistent footer
      await expect(page.locator('footer')).toBeVisible();
      
      // Consistent post structure
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('article, .post, .content')).toBeVisible();
      
      // Back to home/archive link
      const homeLink = page.locator('a[href="/"], a[href="/archive"], a[href="/blog"]');
      const hasHomeLink = await homeLink.count() > 0;
      expect(hasHomeLink).toBeTruthy();
    }
  });

  test('should be mobile responsive', async ({ page }) => {
    console.log('📱 Testing mobile responsiveness');
    
    const testPost = '${postFiles[0] ? (() => {
      const postName = postFiles[0].replace('.md', '');
      const postDate = postName.substring(0, 10);
      const postSlug = postName.substring(11);
      return `/${postDate.replace(/-/g, '/')}/${postSlug}/`;
    })() : '/'}';
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(testPost);
    
    // Content should be visible and readable
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('article, .post, .content')).toBeVisible();
    
    // Check that content doesn't overflow
    const bodyOverflow = await page.evaluate(() => {
      const body = document.body;
      return {
        scrollWidth: body.scrollWidth,
        clientWidth: body.clientWidth
      };
    });
    
    // Allow for small differences due to scrollbars
    expect(bodyOverflow.scrollWidth - bodyOverflow.clientWidth).toBeLessThan(20);
    
    // Navigation should work on mobile
    const nav = page.locator('nav, .navigation, .menu');
    if (await nav.count() > 0) {
      await expect(nav).toBeVisible();
    }
  });
});
`;

  // Write the generated test file
  const outputFile = path.join(testsDir, 'blog-posts.spec.ts');
  fs.writeFileSync(outputFile, testContent);
  
  console.log(`✅ Generated test file: ${outputFile}`);
  console.log(`📊 Generated ${postFiles.length} individual post tests`);
  console.log('🎯 Tests include: structure validation, SEO checks, mobile responsiveness, and link verification');
  
  return outputFile;
}

// Run if called directly
if (require.main === module) {
  generateBlogPostTests().catch(console.error);
}

module.exports = { generateBlogPostTests };
