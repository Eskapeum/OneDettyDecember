import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate } from 'k6/metrics'

/**
 * Stress Test
 * Pushes the system beyond normal operating capacity
 * to identify breaking points and recovery behavior
 */

const errorRate = new Rate('errors')

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to normal load
    { duration: '5m', target: 100 }, // Stay at normal load
    { duration: '2m', target: 200 }, // Ramp to high load
    { duration: '5m', target: 200 }, // Stay at high load
    { duration: '2m', target: 300 }, // Push to stress load
    { duration: '5m', target: 300 }, // Stay at stress load
    { duration: '2m', target: 400 }, // Push to breaking point
    { duration: '5m', target: 400 }, // Stay at breaking point
    { duration: '5m', target: 0 }, // Ramp down and recover
  ],
  thresholds: {
    http_req_duration: ['p(99)<5000'], // 99% under 5s even under stress
    http_req_failed: ['rate<0.1'], // Up to 10% failure acceptable under stress
  },
}

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'

export default function () {
  const responses = []

  // Simulate various user journeys under stress
  const journey = Math.random()

  if (journey < 0.4) {
    // 40% - Browse packages
    responses.push(http.get(`${BASE_URL}/api/packages`))
    sleep(0.5)
    responses.push(http.get(`${BASE_URL}/api/packages?featured=true`))
  } else if (journey < 0.7) {
    // 30% - Search and view details
    responses.push(http.get(`${BASE_URL}/api/packages/search?q=beach`))
    sleep(0.5)
    const packageId = `pkg_${Math.floor(Math.random() * 100) + 1}`
    responses.push(http.get(`${BASE_URL}/api/packages/${packageId}`))
  } else {
    // 30% - Auth flow
    const loginPayload = JSON.stringify({
      email: 'stress-test@example.com',
      password: 'Test123!',
    })
    responses.push(
      http.post(`${BASE_URL}/api/auth/login`, loginPayload, {
        headers: { 'Content-Type': 'application/json' },
      })
    )
  }

  // Check all responses
  responses.forEach((res, index) => {
    const success = check(res, {
      [`request ${index + 1} completed`]: (r) => r.status < 500,
    })
    if (!success) errorRate.add(1)
  })

  sleep(1)
}

export function handleSummary(data) {
  const summary = {
    totalRequests: data.metrics.http_reqs.values.count,
    failureRate: data.metrics.http_req_failed.values.rate,
    errorRate: data.metrics.errors.values.rate,
    avgDuration: data.metrics.http_req_duration.values.avg,
    p95Duration: data.metrics.http_req_duration.values['p(95)'],
    p99Duration: data.metrics.http_req_duration.values['p(99)'],
    maxVUs: data.metrics.vus_max.values.max,
    iterations: data.metrics.iterations.values.count,
  }

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STRESS TEST RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

System Performance Under Stress:
  Total Requests: ${summary.totalRequests}
  Max Concurrent Users: ${summary.maxVUs}

Reliability:
  Failure Rate: ${(summary.failureRate * 100).toFixed(2)}%
  Error Rate: ${(summary.errorRate * 100).toFixed(2)}%

Response Times:
  Average: ${summary.avgDuration.toFixed(2)}ms
  P95: ${summary.p95Duration.toFixed(2)}ms
  P99: ${summary.p99Duration.toFixed(2)}ms

Breaking Point Analysis:
  ${summary.maxVUs >= 400 ? '✓ System handled 400+ concurrent users' : '⚠ System stressed below 400 users'}
  ${summary.failureRate < 0.05 ? '✓ Low failure rate under stress' : '⚠ High failure rate detected'}
  ${summary.p99Duration < 5000 ? '✓ Response times acceptable' : '⚠ Slow response times under load'}
`)

  return {
    'tests/load/results/stress-summary.json': JSON.stringify(data, null, 2),
  }
}
