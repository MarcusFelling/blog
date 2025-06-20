import type { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';
import { MCPTestHelper } from '../helpers/mcp-helper.js';

class MCPReporter implements Reporter {
  private mcpHelper: MCPTestHelper;
  private failedTests: Array<{ test: TestCase; result: TestResult }> = [];
  private startTime: number = 0;
  private testResults: Map<string, TestResult> = new Map();

  constructor() {
    this.mcpHelper = new MCPTestHelper();
  }

  async onBegin(config: FullConfig, suite: Suite) {
    this.startTime = Date.now();
    const testCount = suite.allTests().length;
    console.log(`🚀 Starting Playwright test run with ${testCount} tests`);
    console.log(`🤖 MCP-enhanced analysis enabled`);
    
    try {
      await this.mcpHelper.connect();
    } catch (error) {
      console.warn('⚠️  MCP connection failed, continuing with basic reporting');
    }
  }

  async onTestBegin(test: TestCase) {
    console.log(`▶️  Running: ${test.title}`);
  }

  async onTestEnd(test: TestCase, result: TestResult) {
    this.testResults.set(test.title, result);
    
    const duration = result.duration;
    const status = result.status;
    const emoji = this.getStatusEmoji(status);
    
    console.log(`${emoji} ${test.title} (${duration}ms)`);
    
    if (status === 'failed') {
      this.failedTests.push({ test, result });
      console.log(`   💥 Error: ${result.error?.message || 'Unknown error'}`);
    }
  }

  async onEnd(result: FullResult) {
    const duration = Date.now() - this.startTime;
    const totalTests = this.testResults.size;
    const passedTests = Array.from(this.testResults.values()).filter(r => r.status === 'passed').length;
    const failedTests = this.failedTests.length;
    const skippedTests = Array.from(this.testResults.values()).filter(r => r.status === 'skipped').length;

    console.log('\n📊 Test Summary:');
    console.log(`   Total: ${totalTests}`);
    console.log(`   ✅ Passed: ${passedTests}`);
    console.log(`   ❌ Failed: ${failedTests}`);
    console.log(`   ⏭️  Skipped: ${skippedTests}`);
    console.log(`   ⏱️  Duration: ${duration}ms`);

    if (this.failedTests.length > 0) {
      console.log('\n🔍 MCP-Enhanced Failure Analysis:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      for (const { test, result } of this.failedTests) {
        try {
          console.log(`\n📍 Analyzing failure: "${test.title}"`);
          const analysis = await this.analyzeFailure(test, result);
          console.log(analysis);
          console.log('─'.repeat(50));
        } catch (error) {
          console.warn(`   ⚠️  Could not analyze failure for ${test.title}:`, error);
        }
      }
    }

    // Provide overall test health insights
    if (totalTests > 0) {
      console.log('\n🏥 Test Suite Health Report:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      const passRate = (passedTests / totalTests) * 100;
      const healthEmoji = passRate >= 90 ? '🟢' : passRate >= 70 ? '🟡' : '🔴';
      console.log(`   ${healthEmoji} Pass Rate: ${passRate.toFixed(1)}%`);
      
      if (passRate < 100) {
        await this.provideSuiteRecommendations();
      }
    }

    await this.mcpHelper.disconnect();
  }

  private async analyzeFailure(test: TestCase, result: TestResult): Promise<string> {
    const errorMessage = result.error?.message || 'Unknown error';
    const stackTrace = result.error?.stack || '';
    
    try {
      const analysis = await this.mcpHelper.analyzeTestFailure(
        test.title,
        errorMessage,
        stackTrace
      );
      
      return `   🔬 Analysis: ${analysis}`;
    } catch (error) {
      return `   ⚠️  Analysis unavailable: ${error}`;
    }
  }

  private async provideSuiteRecommendations(): Promise<void> {
    console.log('\n💡 Test Suite Recommendations:');
    
    const slowTests = Array.from(this.testResults.entries())
      .filter(([_, result]) => result.duration > 30000) // Tests taking > 30s
      .map(([title, result]) => ({ title, duration: result.duration }));
    
    if (slowTests.length > 0) {
      console.log('   🐌 Slow tests detected:');
      slowTests.forEach(({ title, duration }) => {
        console.log(`      - "${title}" (${duration}ms)`);
      });
      console.log('   💡 Consider optimizing selectors or adding wait conditions');
    }

    const flakyTests = this.detectFlakyTests();
    if (flakyTests.length > 0) {
      console.log('   🌊 Potentially flaky tests:');
      flakyTests.forEach(title => {
        console.log(`      - "${title}"`);
      });
      console.log('   💡 Consider adding more robust wait conditions');
    }

    // Suggest test coverage improvements
    console.log('   📈 Coverage suggestions:');
    console.log('      - Add accessibility tests with @axe-core/playwright');
    console.log('      - Include mobile responsiveness tests');
    console.log('      - Add performance testing for Core Web Vitals');
    console.log('      - Consider visual regression testing');
  }

  private detectFlakyTests(): string[] {
    // Simple heuristic: tests that failed with timeout errors might be flaky
    return this.failedTests
      .filter(({ result }) => 
        result.error?.message?.includes('timeout') || 
        result.error?.message?.includes('Timeout')
      )
      .map(({ test }) => test.title);
  }

  private getStatusEmoji(status: string): string {
    switch (status) {
      case 'passed': return '✅';
      case 'failed': return '❌';
      case 'skipped': return '⏭️';
      case 'timedOut': return '⏰';
      default: return '❓';
    }
  }
}

export default MCPReporter;
