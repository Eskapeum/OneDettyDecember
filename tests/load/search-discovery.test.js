import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate, Trend } from 'k6/metrics'

/**
 * Sprint 2: Search & Discovery Load Test
 *
 * Tests homepage, search functionality, and package discovery features
 * Focus on read-heavy operations and filter performance
 */

// Custom metrics
const errorRate = new Rate('errors')
const searchDuration = new Trend('search_duration')
const filterDuration = new Trend('filter_duration')
const homepageDuration = new Trend('homepage_duration')

// Test configuration
export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to normal load
    { duration: '5m', target: 100 }, // Sustain normal load
    { duration: '2m', target: 200 }, // Ramp up to high load
    { duration: '5m', target: 200 }, // Sustain high load
    { duration: '2m', target: 300 }, // Push to peak
    { duration: '3m', target: 300 }, // Sustain peak
    { duration: '2m', target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<400', 'p(99)<800'], // Sprint 2 performance goals
    http_req_failed: ['rate<0.01'],
    errors: ['rate<0.02'],
    search_duration: ['p(95)<300'], // Search should be fast
    filter_duration: ['p(95)<250'], // Filters should be faster
    homepage_duration: ['p(95)<500'], // Homepage can be slower (more content)
  },
}

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'

// Search queries for realistic testing
const searchQueries = [
  'beach',
  'adventure',
  'luxury',
  'honeymoon',
  'safari',
  'cruise',
  'ski',
  'cultural',
  'family',
  'relaxation',
  'maldives',
  'dubai',
  'bali',
  'paris',
  'tokyo',
  'romantic',
  'budget',
  'premium',
  'group',
  'solo',
]

// Categories for filtering
const categories = [
  'beach',
  'adventure',
  'luxury',
  'cultural',
  'honeymoon',
  'family',
  'safari',
  'cruise',
]

// Price ranges for testing
const priceRanges = [
  { min: 0, max: 500 },
  { min: 500, max: 1000 },
  { min: 1000, max: 2000 },
  { min: 2000, max: 5000 },
  { min: 5000, max: 10000 },
]

// Locations for filtering
const locations = [
  'maldives',
  'dubai',
  'bali',
  'paris',
  'tokyo',
  'new-york',
  'london',
  'rome',
  'barcelona',
  'santorini',
]

export default function () {
  // Simulate different user journeys

  const journey = Math.random()

  if (journey < 0.3) {
    // 30% - Homepage visitors
    testHomepage()
  } else if (journey < 0.6) {
    // 30% - Search users
    testSearch()
  } else if (journey < 0.85) {
    // 25% - Filter users
    testFilters()
  } else {
    // 15% - Complete discovery journey
    testCompleteJourney()
  }

  sleep(Math.random() * 3 + 1) // 1-4 seconds between actions
}

function testHomepage() {
  const startTime = Date.now()

  // Test 1: Load homepage
  const homepageRes = http.get(BASE_URL)

  const duration = Date.now() - startTime
  homepageDuration.add(duration)

  const success = check(homepageRes, {
    'homepage status is 200': (r) => r.status === 200,
    'homepage loads in < 2s': (r) => r.timings.duration < 2000,
    'homepage has content': (r) => r.body.includes('Featured') || r.body.includes('Packages'),
  })

  if (!success) errorRate.add(1)

  sleep(2)

  // Test 2: Get featured packages
  const featuredRes = http.get(`${BASE_URL}/api/packages?featured=true`)

  check(featuredRes, {
    'featured packages status is 200': (r) => r.status === 200,
    'featured packages returns data': (r) => {
      try {
        const body = JSON.parse(r.body)
        return body.packages !== undefined && Array.isArray(body.packages)
      } catch {
        return false
      }
    },
    'featured packages response time < 500ms': (r) => r.timings.duration < 500,
  }) || errorRate.add(1)

  sleep(1)

  // Test 3: Get categories
  const categoriesRes = http.get(`${BASE_URL}/api/categories`)

  check(categoriesRes, {
    'categories status is 200': (r) => r.status === 200,
    'categories response time < 300ms': (r) => r.timings.duration < 300,
  }) || errorRate.add(1)
}

function testSearch() {
  const query = searchQueries[Math.floor(Math.random() * searchQueries.length)]
  const startTime = Date.now()

  // Test 1: Text search
  const searchRes = http.get(`${BASE_URL}/api/search?q=${encodeURIComponent(query)}`)

  const duration = Date.now() - startTime
  searchDuration.add(duration)

  const success = check(searchRes, {
    'search status is 200': (r) => r.status === 200,
    'search returns results': (r) => {
      try {
        const body = JSON.parse(r.body)
        return body.results !== undefined
      } catch {
        return false
      }
    },
    'search response time < 400ms': (r) => r.timings.duration < 400,
  })

  if (!success) errorRate.add(1)

  sleep(1)

  // Test 2: Search with autocomplete (simulate typing)
  const partialQuery = query.substring(0, 3)
  const autocompleteRes = http.get(
    `${BASE_URL}/api/search/autocomplete?q=${encodeURIComponent(partialQuery)}`
  )

  check(autocompleteRes, {
    'autocomplete status is 200': (r) => r.status === 200,
    'autocomplete is fast (< 200ms)': (r) => r.timings.duration < 200,
  }) || errorRate.add(1)

  sleep(2)

  // Test 3: Click on search result (get package details)
  const packageId = `pkg_${Math.floor(Math.random() * 100) + 1}`
  const packageRes = http.get(`${BASE_URL}/api/packages/${packageId}`)

  check(packageRes, {
    'package detail status is 200 or 404': (r) => r.status === 200 || r.status === 404,
  }) || errorRate.add(1)
}

function testFilters() {
  const startTime = Date.now()

  // Test 1: Category filter
  const category = categories[Math.floor(Math.random() * categories.length)]
  const categoryRes = http.get(`${BASE_URL}/api/packages?category=${category}`)

  const duration = Date.now() - startTime
  filterDuration.add(duration)

  check(categoryRes, {
    'category filter status is 200': (r) => r.status === 200,
    'category filter response time < 300ms': (r) => r.timings.duration < 300,
  }) || errorRate.add(1)

  sleep(1)

  // Test 2: Price range filter
  const range = priceRanges[Math.floor(Math.random() * priceRanges.length)]
  const priceRes = http.get(`${BASE_URL}/api/packages?minPrice=${range.min}&maxPrice=${range.max}`)

  check(priceRes, {
    'price filter status is 200': (r) => r.status === 200,
    'price filter response time < 250ms': (r) => r.timings.duration < 250,
  }) || errorRate.add(1)

  sleep(1)

  // Test 3: Location filter
  const location = locations[Math.floor(Math.random() * locations.length)]
  const locationRes = http.get(`${BASE_URL}/api/packages?location=${location}`)

  check(locationRes, {
    'location filter status is 200': (r) => r.status === 200,
  }) || errorRate.add(1)

  sleep(1)

  // Test 4: Combined filters
  const combinedRes = http.get(
    `${BASE_URL}/api/packages?category=${category}&minPrice=${range.min}&maxPrice=${range.max}&location=${location}`
  )

  check(combinedRes, {
    'combined filters status is 200': (r) => r.status === 200,
    'combined filters response time < 500ms': (r) => r.timings.duration < 500,
  }) || errorRate.add(1)

  sleep(1)

  // Test 5: Date range filter (for availability)
  const startDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const endDate = new Date(Date.now() + 37 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const dateRes = http.get(
    `${BASE_URL}/api/packages?startDate=${startDate}&endDate=${endDate}`
  )

  check(dateRes, {
    'date filter status is 200': (r) => r.status === 200,
  }) || errorRate.add(1)
}

function testCompleteJourney() {
  // Simulate a complete user journey: Homepage → Search → Filters → Details

  // Step 1: Visit homepage
  const homepageRes = http.get(BASE_URL)
  check(homepageRes, {
    'journey: homepage loads': (r) => r.status === 200,
  }) || errorRate.add(1)

  sleep(2)

  // Step 2: View featured packages
  const featuredRes = http.get(`${BASE_URL}/api/packages?featured=true`)
  check(featuredRes, {
    'journey: featured packages load': (r) => r.status === 200,
  }) || errorRate.add(1)

  sleep(3)

  // Step 3: Search for something
  const query = searchQueries[Math.floor(Math.random() * searchQueries.length)]
  const searchRes = http.get(`${BASE_URL}/api/search?q=${encodeURIComponent(query)}`)
  check(searchRes, {
    'journey: search works': (r) => r.status === 200,
  }) || errorRate.add(1)

  sleep(2)

  // Step 4: Apply category filter
  const category = categories[Math.floor(Math.random() * categories.length)]
  const filterRes = http.get(`${BASE_URL}/api/packages?category=${category}`)
  check(filterRes, {
    'journey: filter works': (r) => r.status === 200,
  }) || errorRate.add(1)

  sleep(2)

  // Step 5: View package details
  const packageId = `pkg_${Math.floor(Math.random() * 100) + 1}`
  const packageRes = http.get(`${BASE_URL}/api/packages/${packageId}`)
  check(packageRes, {
    'journey: package details load': (r) => r.status === 200 || r.status === 404,
  }) || errorRate.add(1)

  sleep(3)

  // Step 6: Check availability (if package found)
  if (packageRes.status === 200) {
    const startDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const availabilityRes = http.get(
      `${BASE_URL}/api/packages/${packageId}/availability?date=${startDate}`
    )
    check(availabilityRes, {
      'journey: availability check works': (r) => r.status === 200 || r.status === 404,
    })
  }
}

export function handleSummary(data) {
  const summary = {
    totalRequests: data.metrics.http_reqs.values.count,
    failureRate: data.metrics.http_req_failed.values.rate,
    errorRate: data.metrics.errors.values.rate,
    avgDuration: data.metrics.http_req_duration.values.avg,
    p95Duration: data.metrics.http_req_duration.values['p(95)'],
    p99Duration: data.metrics.http_req_duration.values['p(99)'],
    searchP95: data.metrics.search_duration?.values?.['p(95)'] || 0,
    filterP95: data.metrics.filter_duration?.values?.['p(95)'] || 0,
    homepageP95: data.metrics.homepage_duration?.values?.['p(95)'] || 0,
    maxVUs: data.metrics.vus_max.values.max,
    iterations: data.metrics.iterations.values.count,
  }

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sprint 2: Search & Discovery Load Test Results
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

System Performance:
  Total Requests: ${summary.totalRequests}
  Max Concurrent Users: ${summary.maxVUs}
  Total Iterations: ${summary.iterations}

Reliability:
  Failure Rate: ${(summary.failureRate * 100).toFixed(2)}%
  Error Rate: ${(summary.errorRate * 100).toFixed(2)}%

Response Times:
  Average: ${summary.avgDuration.toFixed(2)}ms
  P95: ${summary.p95Duration.toFixed(2)}ms
  P99: ${summary.p99Duration.toFixed(2)}ms

Feature-Specific Performance:
  Search P95: ${summary.searchP95.toFixed(2)}ms
  Filter P95: ${summary.filterP95.toFixed(2)}ms
  Homepage P95: ${summary.homepageP95.toFixed(2)}ms

Sprint 2 Goals Assessment:
  ${summary.p95Duration < 400 ? '✓' : '✗'} Page load time < 400ms (p95)
  ${summary.searchP95 < 300 ? '✓' : '✗'} Search response < 300ms (p95)
  ${summary.filterP95 < 250 ? '✓' : '✗'} Filter response < 250ms (p95)
  ${summary.failureRate < 0.01 ? '✓' : '✗'} Error rate < 1%
  ${summary.maxVUs >= 200 ? '✓' : '✗'} Handled 200+ concurrent users

${summary.p95Duration < 400 && summary.failureRate < 0.01 ? '🎉 Sprint 2 performance goals MET!' : '⚠️  Performance optimization needed'}
`)

  return {
    'tests/load/results/search-discovery-summary.json': JSON.stringify(data, null, 2),
  }
}
