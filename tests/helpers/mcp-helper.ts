import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import * as fs from 'fs';
import * as path from 'path';

export class MCPTestHelper {
  private client: Client | null = null;
  private isConnected = false;

  constructor() {
    // Initialize MCP client - you can configure this to use different MCP servers
    try {
      const transport = new StdioClientTransport({
        command: 'npx',
        args: ['@anthropic-ai/mcp-server-filesystem', '--root', process.cwd()]
      });
      
      this.client = new Client({
        name: 'playwright-test-helper',
        version: '1.0.0'
      }, {
        capabilities: {
          roots: {
            listChanged: true
          },
          sampling: {}
        }
      });
    } catch (error) {
      console.warn('MCP client initialization failed, falling back to basic mode:', error);
    }
  }

  async connect(): Promise<void> {
    if (!this.client || this.isConnected) return;
    
    try {
      await this.client.connect();
      this.isConnected = true;
      console.log('✅ MCP client connected');
    } catch (error) {
      console.warn('MCP connection failed, continuing without MCP features:', error);
    }
  }

  async analyzePageStructure(url: string): Promise<string> {
    if (!this.isConnected || !this.client) {
      return this.getFallbackAnalysis(url);
    }
    
    const prompt = `Analyze the page structure for ${url} and suggest comprehensive test scenarios including:
    - Accessibility testing (WCAG compliance)
    - Performance testing (Core Web Vitals)
    - Mobile responsiveness
    - SEO verification
    - Content validation
    - User interaction flows
    - Security considerations
    
    For a Jekyll blog site, focus on:
    - Blog post navigation
    - Search functionality
    - Archive/category pages
    - RSS feeds
    - Social sharing
    - Comment systems`;

    try {
      const response = await this.client.request({
        method: 'sampling/createMessage',
        params: {
          messages: [{ role: 'user', content: { type: 'text', text: prompt } }],
          maxTokens: 1000
        }
      });
      
      return response.content?.text || this.getFallbackAnalysis(url);
    } catch (error) {
      console.warn('MCP analysis failed:', error);
      return this.getFallbackAnalysis(url);
    }
  }

  async generateTestFromBlogPost(postPath: string): Promise<string> {
    if (!this.isConnected || !this.client) {
      return this.generateFallbackTest(postPath);
    }
    
    try {
      // Read the blog post content
      const absolutePath = path.resolve(postPath);
      const postContent = fs.readFileSync(absolutePath, 'utf-8');
      
      const prompt = `Based on this Jekyll blog post content, generate comprehensive Playwright tests that verify:
      
      1. Page Loading & Structure:
         - Post title is visible and correct
         - Publication date is displayed
         - Content loads properly
         - Navigation elements are present
      
      2. Content Validation:
         - All headings are properly structured (H1, H2, etc.)
         - Code snippets are syntax highlighted
         - Images load with proper alt text
         - Internal/external links work correctly
      
      3. User Experience:
         - Page is responsive on mobile/desktop
         - Reading time estimate (if present)
         - Social sharing buttons work
         - Related posts section
      
      4. SEO & Metadata:
         - Meta description exists
         - Open Graph tags
         - Structured data markup
      
      Blog post content:
      ${postContent.substring(0, 2000)}...
      
      Generate TypeScript code using Playwright test framework.`;

      const response = await this.client.request({
        method: 'sampling/createMessage',
        params: {
          messages: [{ role: 'user', content: { type: 'text', text: prompt } }],
          maxTokens: 2000
        }
      });

      return response.content?.text || this.generateFallbackTest(postPath);
    } catch (error) {
      console.warn('Test generation failed:', error);
      return this.generateFallbackTest(postPath);
    }
  }

  async analyzeTestFailure(testName: string, errorMessage: string, stackTrace: string): Promise<string> {
    if (!this.isConnected || !this.client) {
      return this.getFallbackFailureAnalysis(testName, errorMessage);
    }

    const prompt = `Analyze this Playwright test failure and provide actionable insights:
    
    Test: ${testName}
    Error: ${errorMessage}
    Stack Trace: ${stackTrace}
    
    Context: This is a Jekyll blog testing suite running locally on port 4000.
    
    Please provide:
    1. Root cause analysis
    2. Specific fix recommendations
    3. Prevention strategies for similar issues
    4. Test improvement suggestions
    5. Consider timing issues, selector problems, or Jekyll-specific concerns`;

    try {
      const response = await this.client.request({
        method: 'sampling/createMessage',
        params: {
          messages: [{ role: 'user', content: { type: 'text', text: prompt } }],
          maxTokens: 1000
        }
      });

      return response.content?.text || this.getFallbackFailureAnalysis(testName, errorMessage);
    } catch (error) {
      console.warn('Failure analysis failed:', error);
      return this.getFallbackFailureAnalysis(testName, errorMessage);
    }
  }

  async suggestTestImprovements(testFilePath: string): Promise<string> {
    if (!this.isConnected || !this.client) {
      return this.getFallbackTestSuggestions();
    }

    try {
      const testContent = fs.readFileSync(testFilePath, 'utf-8');
      
      const prompt = `Review this Playwright test file and suggest improvements:
      
      ${testContent}
      
      Provide suggestions for:
      1. Better test organization and structure
      2. More robust selectors
      3. Additional test scenarios
      4. Performance optimizations
      5. Accessibility testing enhancements
      6. Error handling improvements
      7. Test data management`;

      const response = await this.client.request({
        method: 'sampling/createMessage',
        params: {
          messages: [{ role: 'user', content: { type: 'text', text: prompt } }],
          maxTokens: 1500
        }
      });

      return response.content?.text || this.getFallbackTestSuggestions();
    } catch (error) {
      console.warn('Test improvement analysis failed:', error);
      return this.getFallbackTestSuggestions();
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected && this.client) {
      try {
        await this.client.close();
        this.isConnected = false;
        console.log('🔌 MCP client disconnected');
      } catch (error) {
        console.warn('Error disconnecting MCP client:', error);
      }
    }
  }

  // Fallback methods when MCP is not available
  private getFallbackAnalysis(url: string): string {
    return `Basic analysis for ${url}:
    - Test page loading and basic navigation
    - Verify core content elements are visible
    - Check responsive design
    - Validate accessibility basics
    - Test search functionality
    - Verify RSS feed links`;
  }

  private generateFallbackTest(postPath: string): string {
    const postName = path.basename(postPath, '.md');
    return `// Generated test for ${postName}
test('should load blog post: ${postName}', async ({ page }) => {
  await page.goto('/path/to/post');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('article')).toBeVisible();
  await expect(page.locator('.post-date, .date, time')).toBeVisible();
});`;
  }

  private getFallbackFailureAnalysis(testName: string, errorMessage: string): string {
    return `Test failure analysis for "${testName}":
    Error: ${errorMessage}
    
    Common solutions:
    - Check if selectors match current page structure
    - Verify page loading timing
    - Ensure Jekyll server is running
    - Check for responsive design issues`;
  }

  private getFallbackTestSuggestions(): string {
    return `General test improvement suggestions:
    - Use more specific data-testid attributes
    - Add accessibility testing with @axe-core/playwright
    - Implement page object models for reusability
    - Add visual regression testing
    - Include performance testing`;
  }
}
