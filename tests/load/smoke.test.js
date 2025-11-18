import http from 'k6/http'
import { check, sleep } from 'k6'

/**
 * Smoke Test
 * Quick sanity check with minimal load to verify system is working
 * Run this before heavy load tests
 */

export const options = {
  vus: 1, // 1 virtual user
  duration: '1m', // Run for 1 minute
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.01'], // Error rate should be below 1%
  },
}

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'

export default function () {
  // Test homepage
  const homepageRes = http.get(BASE_URL)
  check(homepageRes, {
    'homepage status is 200': (r) => r.status === 200,
    'homepage loads in < 500ms': (r) => r.timings.duration < 500,
  })

  sleep(1)

  // Test packages API
  const packagesRes = http.get(`${BASE_URL}/api/packages`)
  check(packagesRes, {
    'packages API status is 200': (r) => r.status === 200,
    'packages API returns JSON': (r) => r.headers['Content-Type']?.includes('application/json'),
  })

  sleep(1)

  // Test health check endpoint (if exists)
  const healthRes = http.get(`${BASE_URL}/api/health`)
  check(healthRes, {
    'health check responds': (r) => r.status === 200 || r.status === 404,
  })

  sleep(2)
}

export function handleSummary(data) {
  const passed = data.metrics.checks.values.passes === data.metrics.checks.values.count

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${passed ? '✓ SMOKE TEST PASSED' : '✗ SMOKE TEST FAILED'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Checks: ${data.metrics.checks.values.passes}/${data.metrics.checks.values.count} passed
Duration: ${(data.state.testRunDurationMs / 1000).toFixed(2)}s
Requests: ${data.metrics.http_reqs.values.count}
Failed: ${data.metrics.http_req_failed.values.rate.toFixed(2)}%

${passed ? 'System is ready for load testing 🚀' : 'Fix issues before proceeding ⚠️'}
`)

  return {
    'tests/load/results/smoke-summary.json': JSON.stringify(data, null, 2),
  }
}
