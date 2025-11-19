#!/usr/bin/env node

/**
 * Payment Integration Test Suite
 * Comprehensive testing of all payment providers and flows
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

class PaymentIntegrationTester {
  constructor() {
    this.reportDir = path.join(__dirname, '../reports/payments')
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    this.results = {
      timestamp: new Date().toISOString(),
      tests: {},
      summary: {},
      errors: [],
    }
  }

  async runAllTests() {
    console.log('🧪 Starting Payment Integration Test Suite...')
    console.log('=' .repeat(60))

    // Ensure reports directory exists
    if (!fs.existsSync(this.reportDir)) {
      fs.mkdirSync(this.reportDir, { recursive: true })
    }

    try {
      // Run Stripe tests
      console.log('💳 Testing Stripe Integration...')
      await this.runTest('stripe', 'npm run test:payments:stripe')

      // Run Paystack tests
      console.log('💳 Testing Paystack Integration...')
      await this.runTest('paystack', 'npm run test:payments:paystack')

      // Run refund tests
      console.log('💰 Testing Refund System...')
      await this.runTest('refunds', 'npm run test:payments:refunds')

      // Run webhook tests
      console.log('🔗 Testing Webhook Integration...')
      await this.runTest('webhooks', 'npm run test:payments:webhooks')

      // Run edge case tests
      console.log('⚠️ Testing Edge Cases...')
      await this.runTest('edge-cases', 'npx playwright test e2e/payments/edge-cases.spec.ts')

      // Run load tests (shorter duration for integration)
      console.log('🚀 Running Load Tests...')
      process.env.CONCURRENT_USERS = '10'
      process.env.TEST_DURATION = '60000' // 1 minute
      await this.runTest('load', 'npm run test:payments:load')

      // Generate final report
      this.generateSummaryReport()

    } catch (error) {
      console.error('❌ Integration test suite failed:', error.message)
      this.results.errors.push({
        type: 'suite_failure',
        message: error.message,
        timestamp: new Date().toISOString(),
      })
    }

    console.log('\n' + '=' .repeat(60))
    console.log('🎯 Payment Integration Test Suite Complete!')
    console.log(`📊 Report: ${path.join(this.reportDir, `integration-${this.timestamp}.html`)}`)

    return this.results
  }

  async runTest(testName, command) {
    const startTime = Date.now()
    
    try {
      console.log(`  ▶️ Running ${testName} tests...`)
      
      const output = execSync(command, {
        cwd: path.join(__dirname, '..'),
        encoding: 'utf8',
        timeout: 300000, // 5 minutes timeout
      })

      const duration = Date.now() - startTime
      
      this.results.tests[testName] = {
        status: 'PASS',
        duration,
        output: output.substring(0, 1000), // Truncate long output
        timestamp: new Date().toISOString(),
      }

      console.log(`  ✅ ${testName} tests passed (${duration}ms)`)

    } catch (error) {
      const duration = Date.now() - startTime
      
      this.results.tests[testName] = {
        status: 'FAIL',
        duration,
        error: error.message,
        output: error.stdout?.substring(0, 1000) || '',
        timestamp: new Date().toISOString(),
      }

      console.log(`  ❌ ${testName} tests failed (${duration}ms)`)
      console.log(`     Error: ${error.message.split('\n')[0]}`)
    }
  }

  generateSummaryReport() {
    const testResults = Object.values(this.results.tests)
    const passedTests = testResults.filter(t => t.status === 'PASS').length
    const failedTests = testResults.filter(t => t.status === 'FAIL').length
    const totalDuration = testResults.reduce((sum, t) => sum + t.duration, 0)

    this.results.summary = {
      totalTests: testResults.length,
      passedTests,
      failedTests,
      successRate: (passedTests / testResults.length) * 100,
      totalDuration,
      status: failedTests === 0 ? 'PASS' : 'FAIL',
    }

    // Generate HTML report
    const htmlReport = this.generateHTMLReport()
    const htmlFile = path.join(this.reportDir, `integration-${this.timestamp}.html`)
    fs.writeFileSync(htmlFile, htmlReport)

    // Generate JSON report
    const jsonFile = path.join(this.reportDir, `integration-${this.timestamp}.json`)
    fs.writeFileSync(jsonFile, JSON.stringify(this.results, null, 2))

    // Console summary
    console.log('\n📊 INTEGRATION TEST SUMMARY:')
    console.log(`✅ Passed: ${passedTests}/${testResults.length} tests`)
    console.log(`❌ Failed: ${failedTests}/${testResults.length} tests`)
    console.log(`📈 Success Rate: ${this.results.summary.successRate.toFixed(1)}%`)
    console.log(`⏱️ Total Duration: ${(totalDuration / 1000).toFixed(1)}s`)
    console.log(`🎯 Overall Status: ${this.results.summary.status}`)
  }

  generateHTMLReport() {
    const testRows = Object.entries(this.results.tests).map(([name, result]) => `
      <tr class="${result.status.toLowerCase()}">
        <td>${name}</td>
        <td><span class="status ${result.status.toLowerCase()}">${result.status}</span></td>
        <td>${(result.duration / 1000).toFixed(2)}s</td>
        <td>${result.timestamp}</td>
        <td>${result.error ? result.error.substring(0, 100) + '...' : 'N/A'}</td>
      </tr>
    `).join('')

    return `
<!DOCTYPE html>
<html>
<head>
    <title>Payment Integration Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .metric { padding: 20px; border-radius: 8px; text-align: center; }
        .metric h3 { margin: 0 0 10px 0; font-size: 2em; }
        .metric p { margin: 0; color: #666; }
        .pass { background: #d4edda; color: #155724; }
        .fail { background: #f8d7da; color: #721c24; }
        .info { background: #d1ecf1; color: #0c5460; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #f8f9fa; font-weight: bold; }
        tr.pass { background: #f8fff9; }
        tr.fail { background: #fff8f8; }
        .status { padding: 4px 8px; border-radius: 4px; font-weight: bold; }
        .status.pass { background: #28a745; color: white; }
        .status.fail { background: #dc3545; color: white; }
        .footer { margin-top: 30px; text-align: center; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 Payment Integration Test Report</h1>
            <p>Generated: ${this.results.timestamp}</p>
        </div>
        
        <div class="summary">
            <div class="metric ${this.results.summary.status === 'PASS' ? 'pass' : 'fail'}">
                <h3>${this.results.summary.status}</h3>
                <p>Overall Status</p>
            </div>
            <div class="metric info">
                <h3>${this.results.summary.successRate.toFixed(1)}%</h3>
                <p>Success Rate</p>
            </div>
            <div class="metric info">
                <h3>${this.results.summary.passedTests}/${this.results.summary.totalTests}</h3>
                <p>Tests Passed</p>
            </div>
            <div class="metric info">
                <h3>${(this.results.summary.totalDuration / 1000).toFixed(1)}s</h3>
                <p>Total Duration</p>
            </div>
        </div>
        
        <h2>📋 Test Results</h2>
        <table>
            <thead>
                <tr>
                    <th>Test Suite</th>
                    <th>Status</th>
                    <th>Duration</th>
                    <th>Timestamp</th>
                    <th>Error</th>
                </tr>
            </thead>
            <tbody>
                ${testRows}
            </tbody>
        </table>
        
        <div class="footer">
            <p>OneDettyDecember Payment Integration Test Suite</p>
            <p>Generated by Lolu's Payment Testing Infrastructure</p>
        </div>
    </div>
</body>
</html>`
  }
}

// CLI execution
if (require.main === module) {
  const tester = new PaymentIntegrationTester()
  tester.runAllTests()
    .then(results => {
      console.log(`\n🎉 Integration test suite complete!`)
      console.log(`📊 Status: ${results.summary.status}`)
      process.exit(results.summary.status === 'PASS' ? 0 : 1)
    })
    .catch(error => {
      console.error('❌ Integration test suite failed:', error.message)
      process.exit(1)
    })
}

module.exports = PaymentIntegrationTester
