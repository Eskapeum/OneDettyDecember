import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate } from 'k6/metrics'

// Custom metrics
const errorRate = new Rate('errors')

// Test configuration
export const options = {
  stages: [
    { duration: '1m', target: 100 }, // Ramp up to 100 users
    { duration: '3m', target: 100 }, // Stay at 100 users
    { duration: '1m', target: 200 }, // Ramp up to 200 users
    { duration: '3m', target: 200 }, // Stay at 200 users
    { duration: '1m', target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<300', 'p(99)<800'], // Faster for read operations
    http_req_failed: ['rate<0.01'],
    errors: ['rate<0.03'],
  },
}

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'

// Search terms for realistic traffic
const searchTerms = [
  'beach',
  'adventure',
  'luxury',
  'family',
  'honeymoon',
  'safari',
  'cruise',
  'ski',
  'cultural',
  'relaxation',
]

export default function () {
  // Test 1: Get all packages (homepage)
  const packagesRes = http.get(`${BASE_URL}/api/packages`)

  check(packagesRes, {
    'packages list status is 200': (r) => r.status === 200,
    'packages list returns array': (r) => {
      try {
        const body = JSON.parse(r.body)
        return Array.isArray(body.packages)
      } catch {
        return false
      }
    },
    'packages list response time < 300ms': (r) => r.timings.duration < 300,
  }) || errorRate.add(1)

  sleep(1)

  // Test 2: Get featured packages
  const featuredRes = http.get(`${BASE_URL}/api/packages?featured=true`)

  check(featuredRes, {
    'featured packages status is 200': (r) => r.status === 200,
    'featured packages returns data': (r) => {
      try {
        const body = JSON.parse(r.body)
        return body.packages !== undefined
      } catch {
        return false
      }
    },
  }) || errorRate.add(1)

  sleep(1)

  // Test 3: Search packages
  const searchTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)]
  const searchRes = http.get(`${BASE_URL}/api/packages/search?q=${searchTerm}`)

  check(searchRes, {
    'search status is 200': (r) => r.status === 200,
    'search returns results': (r) => {
      try {
        const body = JSON.parse(r.body)
        return body.results !== undefined
      } catch {
        return false
      }
    },
  }) || errorRate.add(1)

  sleep(1)

  // Test 4: Get package by ID (simulate clicking on a package)
  const packageId = `pkg_${Math.floor(Math.random() * 100) + 1}`
  const packageRes = http.get(`${BASE_URL}/api/packages/${packageId}`)

  check(packageRes, {
    'package detail status is 200 or 404': (r) => r.status === 200 || r.status === 404,
    'package detail response time < 250ms': (r) => r.timings.duration < 250,
  }) || errorRate.add(1)

  sleep(2)

  // Test 5: Get packages by category
  const categories = ['beach', 'adventure', 'luxury', 'cultural']
  const category = categories[Math.floor(Math.random() * categories.length)]
  const categoryRes = http.get(`${BASE_URL}/api/packages?category=${category}`)

  check(categoryRes, {
    'category filter status is 200': (r) => r.status === 200,
    'category filter returns filtered results': (r) => {
      try {
        const body = JSON.parse(r.body)
        return body.packages !== undefined
      } catch {
        return false
      }
    },
  }) || errorRate.add(1)

  sleep(1)

  // Test 6: Get packages with price range
  const priceRanges = [
    { min: 0, max: 500 },
    { min: 500, max: 1000 },
    { min: 1000, max: 2000 },
    { min: 2000, max: 5000 },
  ]
  const range = priceRanges[Math.floor(Math.random() * priceRanges.length)]
  const priceRes = http.get(`${BASE_URL}/api/packages?minPrice=${range.min}&maxPrice=${range.max}`)

  check(priceRes, {
    'price filter status is 200': (r) => r.status === 200,
  }) || errorRate.add(1)

  sleep(1)
}

export function handleSummary(data) {
  return {
    'tests/load/results/packages-summary.json': JSON.stringify(data, null, 2),
    stdout: textSummary(data),
  }
}

function textSummary(data) {
  return `
✓ Packages Load Test Results
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HTTP Metrics:
  ✓ Total Requests: ${data.metrics.http_reqs.values.count}
  ✓ Failed Requests: ${data.metrics.http_req_failed.values.rate.toFixed(2)}%
  ✓ Avg Duration: ${data.metrics.http_req_duration.values.avg.toFixed(2)}ms
  ✓ P95 Duration: ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms
  ✓ P99 Duration: ${data.metrics.http_req_duration.values['p(99)'].toFixed(2)}ms

Performance:
  ✓ Requests/sec: ${(data.metrics.http_reqs.values.count / data.state.testRunDurationMs * 1000).toFixed(2)}
  ✓ Error Rate: ${(data.metrics.errors.values.rate * 100).toFixed(2)}%

Virtual Users:
  ✓ Max Concurrent: ${data.metrics.vus_max.values.max}
  ✓ Total Iterations: ${data.metrics.iterations.values.count}
`
}
