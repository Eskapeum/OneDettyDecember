import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate } from 'k6/metrics'

// Custom metrics
const errorRate = new Rate('errors')

// Test configuration
export const options = {
  stages: [
    { duration: '2m', target: 50 }, // Ramp up to 50 users
    { duration: '5m', target: 50 }, // Stay at 50 users
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 0 }, // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'], // 95% < 500ms, 99% < 1s
    http_req_failed: ['rate<0.01'], // Error rate < 1%
    errors: ['rate<0.05'], // Custom error rate < 5%
  },
}

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'

export default function () {
  // Test registration endpoint
  const registrationPayload = JSON.stringify({
    email: `test-${Date.now()}@example.com`,
    password: 'TestPassword123!',
    name: 'Test User',
  })

  const registrationParams = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const registrationRes = http.post(
    `${BASE_URL}/api/auth/register`,
    registrationPayload,
    registrationParams
  )

  check(registrationRes, {
    'registration status is 201': (r) => r.status === 201,
    'registration response has user data': (r) => {
      try {
        const body = JSON.parse(r.body)
        return body.user !== undefined
      } catch {
        return false
      }
    },
  }) || errorRate.add(1)

  sleep(1)

  // Test login endpoint
  const loginPayload = JSON.stringify({
    email: 'demo@onedettydecember.com',
    password: 'DemoPassword123!',
  })

  const loginRes = http.post(`${BASE_URL}/api/auth/login`, loginPayload, registrationParams)

  const loginSuccess = check(loginRes, {
    'login status is 200': (r) => r.status === 200,
    'login returns token': (r) => {
      try {
        const body = JSON.parse(r.body)
        return body.token !== undefined
      } catch {
        return false
      }
    },
  })

  if (!loginSuccess) {
    errorRate.add(1)
  }

  sleep(1)

  // Test password reset request
  const resetPayload = JSON.stringify({
    email: 'demo@onedettydecember.com',
  })

  const resetRes = http.post(`${BASE_URL}/api/auth/reset-password`, resetPayload, registrationParams)

  check(resetRes, {
    'password reset status is 200': (r) => r.status === 200,
    'password reset confirms email sent': (r) => {
      try {
        const body = JSON.parse(r.body)
        return body.message !== undefined
      } catch {
        return false
      }
    },
  }) || errorRate.add(1)

  sleep(2)
}

export function handleSummary(data) {
  return {
    'tests/load/results/auth-summary.json': JSON.stringify(data, null, 2),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  }
}

function textSummary(data, options) {
  const indent = options?.indent || ''
  const enableColors = options?.enableColors || false

  let summary = `
${indent}✓ Auth Load Test Results
${indent}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${indent}HTTP Metrics:
${indent}  ✓ Requests: ${data.metrics.http_reqs.values.count}
${indent}  ✓ Failed: ${data.metrics.http_req_failed.values.rate.toFixed(2)}%
${indent}  ✓ Duration (p95): ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms
${indent}  ✓ Duration (p99): ${data.metrics.http_req_duration.values['p(99)'].toFixed(2)}ms

${indent}Custom Metrics:
${indent}  ✓ Error Rate: ${(data.metrics.errors.values.rate * 100).toFixed(2)}%

${indent}Virtual Users:
${indent}  ✓ Max: ${data.metrics.vus_max.values.max}
${indent}  ✓ Iterations: ${data.metrics.iterations.values.count}
`

  return summary
}
