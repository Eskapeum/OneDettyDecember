#!/usr/bin/env node

/**
 * Payment Load Testing Script
 * Tests payment system under high concurrent load
 */

const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')

class PaymentLoadTester {
  constructor() {
    this.reportDir = path.join(__dirname, '../../reports/load')
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    this.reportFile = path.join(this.reportDir, `payment-load-${this.timestamp}.json`)
    this.results = {
      timestamp: new Date().toISOString(),
      testConfig: {},
      metrics: {},
      errors: [],
      summary: {},
    }
  }

  async runLoadTest(config = {}) {
    const {
      concurrentUsers = 50,
      testDuration = 300000, // 5 minutes
      rampUpTime = 60000, // 1 minute
      paymentProvider = 'stripe', // stripe or paystack
    } = config

    this.results.testConfig = { concurrentUsers, testDuration, rampUpTime, paymentProvider }

    console.log(`🚀 Starting payment load test...`)
    console.log(`👥 Concurrent users: ${concurrentUsers}`)
    console.log(`⏱️ Test duration: ${testDuration / 1000}s`)
    console.log(`📈 Ramp-up time: ${rampUpTime / 1000}s`)
    console.log(`💳 Payment provider: ${paymentProvider}`)

    // Ensure reports directory exists
    if (!fs.existsSync(this.reportDir)) {
      fs.mkdirSync(this.reportDir, { recursive: true })
    }

    const startTime = Date.now()
    const browsers = []
    const userSessions = []

    try {
      // Launch browsers for concurrent users
      console.log('🌐 Launching browsers...')
      for (let i = 0; i < Math.min(concurrentUsers, 10); i++) {
        const browser = await chromium.launch({ headless: true })
        browsers.push(browser)
      }

      // Create user sessions with ramp-up
      console.log('👤 Creating user sessions...')
      const rampUpInterval = rampUpTime / concurrentUsers
      
      for (let i = 0; i < concurrentUsers; i++) {
        setTimeout(async () => {
          const browser = browsers[i % browsers.length]
          const session = await this.createUserSession(browser, i, paymentProvider)
          userSessions.push(session)
        }, i * rampUpInterval)
      }

      // Wait for test duration
      await new Promise(resolve => setTimeout(resolve, testDuration))

      // Collect results
      console.log('📊 Collecting results...')
      await this.collectResults(userSessions)

      // Generate report
      this.generateReport()

    } catch (error) {
      console.error('❌ Load test failed:', error.message)
      this.results.errors.push({
        type: 'test_failure',
        message: error.message,
        timestamp: new Date().toISOString(),
      })
    } finally {
      // Cleanup
      console.log('🧹 Cleaning up...')
      for (const browser of browsers) {
        await browser.close()
      }
    }

    const totalTime = Date.now() - startTime
    console.log(`✅ Load test completed in ${totalTime / 1000}s`)
    console.log(`📁 Report saved: ${this.reportFile}`)

    return this.results
  }

  async createUserSession(browser, userId, paymentProvider) {
    const session = {
      id: userId,
      startTime: Date.now(),
      transactions: [],
      errors: [],
      metrics: {
        pageLoadTime: 0,
        paymentInitTime: 0,
        paymentCompleteTime: 0,
        totalTime: 0,
      },
    }

    try {
      const context = await browser.newContext()
      const page = await context.newPage()

      // Mock payment APIs for load testing
      await this.setupPaymentMocks(page, paymentProvider)

      // Navigate to booking page
      const pageLoadStart = Date.now()
      await page.goto('/booking/test-booking/payment')
      session.metrics.pageLoadTime = Date.now() - pageLoadStart

      // Simulate payment flow
      await this.simulatePaymentFlow(page, session, paymentProvider)

      await context.close()

    } catch (error) {
      session.errors.push({
        type: 'session_error',
        message: error.message,
        timestamp: new Date().toISOString(),
      })
    }

    session.metrics.totalTime = Date.now() - session.startTime
    return session
  }

  async setupPaymentMocks(page, provider) {
    if (provider === 'stripe') {
      await page.addInitScript(() => {
        window.Stripe = () => ({
          elements: () => ({
            create: () => ({
              mount: () => {},
              on: () => {},
            }),
          }),
          confirmCardPayment: () => Promise.resolve({
            paymentIntent: { status: 'succeeded' },
          }),
        })
      })

      await page.route('/api/payments/stripe/**', async (route) => {
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500))
        
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            paymentIntent: { id: `pi_load_test_${Date.now()}`, status: 'succeeded' },
          }),
        })
      })
    } else if (provider === 'paystack') {
      await page.addInitScript(() => {
        window.PaystackPop = {
          setup: (options) => ({
            openIframe: () => {
              setTimeout(() => {
                options.onSuccess({ reference: `paystack_load_test_${Date.now()}` })
              }, Math.random() * 2000 + 1000)
            },
          }),
        }
      })

      await page.route('/api/payments/paystack/**', async (route) => {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500))
        
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: { reference: `paystack_load_test_${Date.now()}`, status: 'success' },
          }),
        })
      })
    }
  }

  async simulatePaymentFlow(page, session, provider) {
    try {
      // Select payment method
      const paymentInitStart = Date.now()
      await page.getByTestId(`payment-method-${provider}`).click()
      session.metrics.paymentInitTime = Date.now() - paymentInitStart

      // Fill payment form
      if (provider === 'stripe') {
        await page.getByTestId('stripe-card-element').click()
        await page.getByLabel(/cardholder name/i).fill(`Load Test User ${session.id}`)
      } else if (provider === 'paystack') {
        await page.getByLabel(/email/i).fill(`loadtest${session.id}@example.com`)
      }

      // Submit payment
      const paymentCompleteStart = Date.now()
      await page.getByRole('button', { name: /pay/i }).click()

      // Wait for completion
      await page.waitForSelector('[data-testid="payment-success"], [data-testid="payment-error"]', {
        timeout: 30000,
      })

      session.metrics.paymentCompleteTime = Date.now() - paymentCompleteStart

      // Record transaction
      const isSuccess = await page.getByTestId('payment-success').isVisible().catch(() => false)
      session.transactions.push({
        timestamp: new Date().toISOString(),
        success: isSuccess,
        provider,
        duration: session.metrics.paymentCompleteTime,
      })

    } catch (error) {
      session.errors.push({
        type: 'payment_error',
        message: error.message,
        timestamp: new Date().toISOString(),
      })
    }
  }

  async collectResults(sessions) {
    const completedSessions = sessions.filter(s => s)
    const totalTransactions = completedSessions.reduce((sum, s) => sum + s.transactions.length, 0)
    const successfulTransactions = completedSessions.reduce(
      (sum, s) => sum + s.transactions.filter(t => t.success).length, 0
    )
    const totalErrors = completedSessions.reduce((sum, s) => sum + s.errors.length, 0)

    // Calculate response times
    const responseTimes = completedSessions
      .flatMap(s => s.transactions)
      .map(t => t.duration)
      .sort((a, b) => a - b)

    const avgResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
    const p50ResponseTime = responseTimes[Math.floor(responseTimes.length * 0.5)]
    const p95ResponseTime = responseTimes[Math.floor(responseTimes.length * 0.95)]
    const p99ResponseTime = responseTimes[Math.floor(responseTimes.length * 0.99)]

    // Calculate throughput
    const testDurationSeconds = this.results.testConfig.testDuration / 1000
    const throughput = totalTransactions / testDurationSeconds

    this.results.metrics = {
      totalSessions: completedSessions.length,
      totalTransactions,
      successfulTransactions,
      failedTransactions: totalTransactions - successfulTransactions,
      successRate: (successfulTransactions / totalTransactions) * 100,
      totalErrors,
      errorRate: (totalErrors / totalTransactions) * 100,
      throughput: throughput,
      responseTimes: {
        average: avgResponseTime,
        p50: p50ResponseTime,
        p95: p95ResponseTime,
        p99: p99ResponseTime,
        min: responseTimes[0],
        max: responseTimes[responseTimes.length - 1],
      },
    }

    this.results.summary = {
      status: this.results.metrics.successRate > 95 ? 'PASS' : 'FAIL',
      performance: this.results.metrics.responseTimes.p95 < 5000 ? 'GOOD' : 'POOR',
      throughput: this.results.metrics.throughput > 10 ? 'GOOD' : 'POOR',
    }

    // Collect error details
    this.results.errors = completedSessions
      .flatMap(s => s.errors)
      .reduce((acc, error) => {
        const existing = acc.find(e => e.message === error.message)
        if (existing) {
          existing.count++
        } else {
          acc.push({ ...error, count: 1 })
        }
        return acc
      }, [])
  }

  generateReport() {
    // Save JSON report
    fs.writeFileSync(this.reportFile, JSON.stringify(this.results, null, 2))

    // Generate HTML report
    const htmlReport = this.generateHTMLReport()
    const htmlFile = this.reportFile.replace('.json', '.html')
    fs.writeFileSync(htmlFile, htmlReport)

    // Console summary
    console.log('\n📊 LOAD TEST RESULTS:')
    console.log(`✅ Success Rate: ${this.results.metrics.successRate.toFixed(2)}%`)
    console.log(`⚡ Throughput: ${this.results.metrics.throughput.toFixed(2)} transactions/sec`)
    console.log(`⏱️ Avg Response Time: ${this.results.metrics.responseTimes.average.toFixed(0)}ms`)
    console.log(`📈 P95 Response Time: ${this.results.metrics.responseTimes.p95.toFixed(0)}ms`)
    console.log(`❌ Error Rate: ${this.results.metrics.errorRate.toFixed(2)}%`)
    console.log(`🎯 Overall Status: ${this.results.summary.status}`)
  }

  generateHTMLReport() {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Payment Load Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .metric { display: inline-block; margin: 10px; padding: 15px; border-radius: 5px; }
        .good { background: #d4edda; color: #155724; }
        .warning { background: #fff3cd; color: #856404; }
        .error { background: #f8d7da; color: #721c24; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #f2f2f2; }
    </style>
</head>
<body>
    <h1>Payment Load Test Report</h1>
    <p>Generated: ${this.results.timestamp}</p>
    
    <h2>Test Configuration</h2>
    <ul>
        <li>Concurrent Users: ${this.results.testConfig.concurrentUsers}</li>
        <li>Test Duration: ${this.results.testConfig.testDuration / 1000}s</li>
        <li>Payment Provider: ${this.results.testConfig.paymentProvider}</li>
    </ul>
    
    <h2>Key Metrics</h2>
    <div class="metric ${this.results.metrics.successRate > 95 ? 'good' : 'error'}">
        Success Rate: ${this.results.metrics.successRate.toFixed(2)}%
    </div>
    <div class="metric ${this.results.metrics.throughput > 10 ? 'good' : 'warning'}">
        Throughput: ${this.results.metrics.throughput.toFixed(2)} TPS
    </div>
    <div class="metric ${this.results.metrics.responseTimes.p95 < 5000 ? 'good' : 'warning'}">
        P95 Response: ${this.results.metrics.responseTimes.p95.toFixed(0)}ms
    </div>
    
    <h2>Response Time Distribution</h2>
    <table>
        <tr><th>Metric</th><th>Value (ms)</th></tr>
        <tr><td>Average</td><td>${this.results.metrics.responseTimes.average.toFixed(0)}</td></tr>
        <tr><td>P50 (Median)</td><td>${this.results.metrics.responseTimes.p50.toFixed(0)}</td></tr>
        <tr><td>P95</td><td>${this.results.metrics.responseTimes.p95.toFixed(0)}</td></tr>
        <tr><td>P99</td><td>${this.results.metrics.responseTimes.p99.toFixed(0)}</td></tr>
        <tr><td>Min</td><td>${this.results.metrics.responseTimes.min.toFixed(0)}</td></tr>
        <tr><td>Max</td><td>${this.results.metrics.responseTimes.max.toFixed(0)}</td></tr>
    </table>
    
    <h2>Transaction Summary</h2>
    <table>
        <tr><th>Metric</th><th>Count</th></tr>
        <tr><td>Total Transactions</td><td>${this.results.metrics.totalTransactions}</td></tr>
        <tr><td>Successful</td><td>${this.results.metrics.successfulTransactions}</td></tr>
        <tr><td>Failed</td><td>${this.results.metrics.failedTransactions}</td></tr>
        <tr><td>Total Errors</td><td>${this.results.metrics.totalErrors}</td></tr>
    </table>
    
    ${this.results.errors.length > 0 ? `
    <h2>Error Summary</h2>
    <table>
        <tr><th>Error</th><th>Count</th></tr>
        ${this.results.errors.map(error => `
            <tr><td>${error.message}</td><td>${error.count}</td></tr>
        `).join('')}
    </table>
    ` : ''}
</body>
</html>`
  }
}

// CLI execution
if (require.main === module) {
  const config = {
    concurrentUsers: parseInt(process.env.CONCURRENT_USERS) || 50,
    testDuration: parseInt(process.env.TEST_DURATION) || 300000,
    paymentProvider: process.env.PAYMENT_PROVIDER || 'stripe',
  }

  const tester = new PaymentLoadTester()
  tester.runLoadTest(config)
    .then(results => {
      console.log(`\n🎉 Load test complete!`)
      console.log(`📊 Results: ${results.summary.status}`)
      process.exit(results.summary.status === 'PASS' ? 0 : 1)
    })
    .catch(error => {
      console.error('❌ Load test failed:', error.message)
      process.exit(1)
    })
}

module.exports = PaymentLoadTester
