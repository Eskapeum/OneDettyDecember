import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate } from 'k6/metrics'

// Custom metrics
const errorRate = new Rate('errors')
const bookingSuccessRate = new Rate('booking_success')

// Test configuration
export const options = {
  stages: [
    { duration: '2m', target: 30 }, // Ramp up to 30 users
    { duration: '5m', target: 30 }, // Stay at 30 users
    { duration: '2m', target: 60 }, // Ramp up to 60 users
    { duration: '3m', target: 60 }, // Stay at 60 users
    { duration: '2m', target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000', 'p(99)<2000'], // Booking operations can be slower
    http_req_failed: ['rate<0.02'],
    errors: ['rate<0.05'],
    booking_success: ['rate>0.9'], // 90%+ booking success rate
  },
}

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'

// Test data
const testUsers = [
  { email: 'test1@example.com', password: 'Test123!' },
  { email: 'test2@example.com', password: 'Test123!' },
  { email: 'test3@example.com', password: 'Test123!' },
]

export default function () {
  const headers = {
    'Content-Type': 'application/json',
  }

  // Step 1: Login to get auth token
  const user = testUsers[Math.floor(Math.random() * testUsers.length)]
  const loginPayload = JSON.stringify({
    email: user.email,
    password: user.password,
  })

  const loginRes = http.post(`${BASE_URL}/api/auth/login`, loginPayload, { headers })

  let authToken = null
  const loginSuccess = check(loginRes, {
    'login status is 200': (r) => r.status === 200,
    'login returns token': (r) => {
      try {
        const body = JSON.parse(r.body)
        if (body.token) {
          authToken = body.token
          return true
        }
        return false
      } catch {
        return false
      }
    },
  })

  if (!loginSuccess || !authToken) {
    errorRate.add(1)
    return // Skip rest of iteration if login failed
  }

  sleep(1)

  // Step 2: Get user's bookings
  const authHeaders = {
    ...headers,
    Authorization: `Bearer ${authToken}`,
  }

  const bookingsRes = http.get(`${BASE_URL}/api/bookings`, { headers: authHeaders })

  check(bookingsRes, {
    'get bookings status is 200': (r) => r.status === 200,
    'get bookings returns array': (r) => {
      try {
        const body = JSON.parse(r.body)
        return Array.isArray(body.bookings)
      } catch {
        return false
      }
    },
  }) || errorRate.add(1)

  sleep(1)

  // Step 3: Create a new booking
  const bookingPayload = JSON.stringify({
    packageId: `pkg_${Math.floor(Math.random() * 50) + 1}`,
    startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    guests: Math.floor(Math.random() * 4) + 1,
    specialRequests: 'Load test booking',
  })

  const createBookingRes = http.post(`${BASE_URL}/api/bookings`, bookingPayload, {
    headers: authHeaders,
  })

  let bookingId = null
  const bookingCreated = check(createBookingRes, {
    'create booking status is 201': (r) => r.status === 201,
    'create booking returns booking ID': (r) => {
      try {
        const body = JSON.parse(r.body)
        if (body.booking?.id) {
          bookingId = body.booking.id
          bookingSuccessRate.add(1)
          return true
        }
        bookingSuccessRate.add(0)
        return false
      } catch {
        bookingSuccessRate.add(0)
        return false
      }
    },
    'create booking response time < 1000ms': (r) => r.timings.duration < 1000,
  })

  if (!bookingCreated) {
    errorRate.add(1)
  }

  sleep(2)

  // Step 4: Get booking details (if created successfully)
  if (bookingId) {
    const bookingDetailRes = http.get(`${BASE_URL}/api/bookings/${bookingId}`, {
      headers: authHeaders,
    })

    check(bookingDetailRes, {
      'get booking detail status is 200': (r) => r.status === 200,
      'get booking detail returns correct ID': (r) => {
        try {
          const body = JSON.parse(r.body)
          return body.booking?.id === bookingId
        } catch {
          return false
        }
      },
    }) || errorRate.add(1)

    sleep(1)

    // Step 5: Update booking (change guest count)
    const updatePayload = JSON.stringify({
      guests: Math.floor(Math.random() * 4) + 1,
      specialRequests: 'Updated during load test',
    })

    const updateRes = http.patch(`${BASE_URL}/api/bookings/${bookingId}`, updatePayload, {
      headers: authHeaders,
    })

    check(updateRes, {
      'update booking status is 200': (r) => r.status === 200,
    }) || errorRate.add(1)

    sleep(1)

    // Step 6: Cancel booking (cleanup)
    const cancelRes = http.delete(`${BASE_URL}/api/bookings/${bookingId}`, {
      headers: authHeaders,
    })

    check(cancelRes, {
      'cancel booking status is 200': (r) => r.status === 200,
    }) || errorRate.add(1)
  }

  sleep(2)
}

export function handleSummary(data) {
  return {
    'tests/load/results/bookings-summary.json': JSON.stringify(data, null, 2),
    stdout: textSummary(data),
  }
}

function textSummary(data) {
  return `
✓ Bookings Load Test Results
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HTTP Metrics:
  ✓ Total Requests: ${data.metrics.http_reqs.values.count}
  ✓ Failed Requests: ${data.metrics.http_req_failed.values.rate.toFixed(2)}%
  ✓ Avg Duration: ${data.metrics.http_req_duration.values.avg.toFixed(2)}ms
  ✓ P95 Duration: ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms
  ✓ P99 Duration: ${data.metrics.http_req_duration.values['p(99)'].toFixed(2)}ms

Booking Metrics:
  ✓ Booking Success Rate: ${(data.metrics.booking_success.values.rate * 100).toFixed(2)}%
  ✓ Error Rate: ${(data.metrics.errors.values.rate * 100).toFixed(2)}%

Performance:
  ✓ Requests/sec: ${(data.metrics.http_reqs.values.count / data.state.testRunDurationMs * 1000).toFixed(2)}

Virtual Users:
  ✓ Max Concurrent: ${data.metrics.vus_max.values.max}
  ✓ Total Iterations: ${data.metrics.iterations.values.count}
`
}
