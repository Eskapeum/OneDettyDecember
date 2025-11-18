# Load Testing Guide - OneDettyDecember

> Comprehensive guide for performance and load testing using k6

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Available Tests](#available-tests)
- [Running Tests](#running-tests)
- [Understanding Results](#understanding-results)
- [Performance Thresholds](#performance-thresholds)
- [CI/CD Integration](#cicd-integration)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

Our load testing suite uses **k6** (by Grafana Labs) to validate system performance under various load conditions. We test:

- **Authentication flows** (login, registration, password reset)
- **Package browsing** (search, filtering, pagination)
- **Booking operations** (create, update, cancel)
- **System limits** (stress testing, breaking points)

### Why k6?

- ✅ Written in Go (high performance, low resource usage)
- ✅ JavaScript-based test scripts (easy to write and maintain)
- ✅ Built-in metrics and thresholds
- ✅ CI/CD friendly
- ✅ Free and open source

---

## ⚙️ Prerequisites

### Required Software

1. **k6** - Load testing tool
2. **Node.js 18+** - For npm scripts
3. **Docker** (optional) - For isolated testing

### System Requirements

- **CPU:** 2+ cores recommended
- **RAM:** 4GB+ available
- **Network:** Stable connection to target environment

---

## 📦 Installation

### Install k6

#### macOS (Homebrew)
```bash
brew install k6
```

#### Linux (Debian/Ubuntu)
```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

#### Windows (Chocolatey)
```bash
choco install k6
```

#### Docker
```bash
docker pull grafana/k6:latest
```

### Install TypeScript Types (Optional)
```bash
npm install -D @types/k6
```

### Verify Installation
```bash
k6 version
# Expected output: k6 v0.48.0 (or later)
```

---

## 🧪 Available Tests

### 1. Smoke Test (`smoke.test.js`)
**Purpose:** Quick sanity check with minimal load
**Duration:** 1 minute
**Virtual Users:** 1
**Use Case:** Verify system is working before heavy tests

```bash
npm run load:smoke
```

**What it tests:**
- Homepage loads correctly
- API endpoints respond
- Basic functionality works

### 2. Authentication Test (`auth.test.js`)
**Purpose:** Test authentication endpoints under load
**Duration:** 16 minutes
**Peak Load:** 100 concurrent users
**Use Case:** Validate auth system can handle traffic spikes

```bash
npm run load:auth
```

**What it tests:**
- User registration
- User login
- Password reset flow
- Token generation
- Rate limiting

**Stages:**
1. Ramp up: 0 → 50 users (2 min)
2. Sustain: 50 users (5 min)
3. Ramp up: 50 → 100 users (2 min)
4. Sustain: 100 users (5 min)
5. Ramp down: 100 → 0 users (2 min)

### 3. Packages Test (`packages.test.js`)
**Purpose:** Test package browsing and search
**Duration:** 9 minutes
**Peak Load:** 200 concurrent users
**Use Case:** Validate read-heavy operations

```bash
npm run load:packages
```

**What it tests:**
- Package list retrieval
- Featured packages
- Search functionality
- Package detail views
- Category filtering
- Price range filtering

**Stages:**
1. Ramp up: 0 → 100 users (1 min)
2. Sustain: 100 users (3 min)
3. Ramp up: 100 → 200 users (1 min)
4. Sustain: 200 users (3 min)
5. Ramp down: 200 → 0 users (1 min)

### 4. Bookings Test (`bookings.test.js`)
**Purpose:** Test booking creation and management
**Duration:** 14 minutes
**Peak Load:** 60 concurrent users
**Use Case:** Validate write-heavy operations

```bash
npm run load:bookings
```

**What it tests:**
- User authentication
- Booking creation
- Booking retrieval
- Booking updates
- Booking cancellation
- Full booking lifecycle

**Stages:**
1. Ramp up: 0 → 30 users (2 min)
2. Sustain: 30 users (5 min)
3. Ramp up: 30 → 60 users (2 min)
4. Sustain: 60 users (3 min)
5. Ramp down: 60 → 0 users (2 min)

### 5. Stress Test (`stress.test.js`)
**Purpose:** Push system beyond normal capacity
**Duration:** 31 minutes
**Peak Load:** 400+ concurrent users
**Use Case:** Identify breaking points

```bash
npm run load:stress
```

**What it tests:**
- System limits
- Error recovery
- Graceful degradation
- Resource exhaustion
- Breaking point identification

**Stages:**
1. Normal: 0 → 100 users (7 min)
2. High: 100 → 200 users (7 min)
3. Stress: 200 → 300 users (7 min)
4. Breaking: 300 → 400 users (7 min)
5. Recovery: 400 → 0 users (5 min)

---

## 🚀 Running Tests

### Basic Usage

#### Run Single Test
```bash
# Using npm scripts (recommended)
npm run load:smoke
npm run load:auth
npm run load:packages
npm run load:bookings
npm run load:stress

# Using k6 directly
k6 run tests/load/smoke.test.js
```

#### Run All Tests (Sequential)
```bash
npm run load:all
```

### Advanced Options

#### Custom Target URL
```bash
BASE_URL=https://staging.onedettydecember.com npm run load:auth
```

#### Increase Virtual Users
```bash
k6 run --vus 200 tests/load/packages.test.js
```

#### Custom Duration
```bash
k6 run --duration 30s tests/load/smoke.test.js
```

#### Output Results to File
```bash
k6 run --out json=results.json tests/load/auth.test.js
```

#### Run with Docker
```bash
docker run --rm -i grafana/k6:latest run - < tests/load/smoke.test.js
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `BASE_URL` | Target application URL | `http://localhost:3000` |
| `K6_VUS` | Number of virtual users | Test-specific |
| `K6_DURATION` | Test duration | Test-specific |

---

## 📊 Understanding Results

### Console Output

After each test, you'll see a summary like this:

```
✓ Auth Load Test Results
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HTTP Metrics:
  ✓ Requests: 1,234
  ✓ Failed: 0.02%
  ✓ Duration (p95): 342.56ms
  ✓ Duration (p99): 567.89ms

Custom Metrics:
  ✓ Error Rate: 1.23%

Virtual Users:
  ✓ Max: 100
  ✓ Iterations: 823
```

### Key Metrics Explained

#### http_req_duration
- **p(50)** - Median response time (50% of requests faster than this)
- **p(95)** - 95th percentile (95% of requests faster than this)
- **p(99)** - 99th percentile (only 1% slower than this)
- **avg** - Average response time

#### http_req_failed
- **rate** - Percentage of failed requests
- Target: < 1% for production

#### checks
- **passes** - Number of successful checks
- **fails** - Number of failed checks
- Target: 100% pass rate

#### vus (Virtual Users)
- **value** - Current active users
- **max** - Peak concurrent users

### Result Files

Tests save detailed results to `tests/load/results/`:

- `smoke-summary.json`
- `auth-summary.json`
- `packages-summary.json`
- `bookings-summary.json`
- `stress-summary.json`

These JSON files contain:
- Complete metrics breakdown
- Per-request statistics
- Trend data
- Threshold violations

---

## 🎯 Performance Thresholds

### Defined Thresholds

Each test has specific performance thresholds that must be met:

#### Smoke Test
```javascript
{
  http_req_duration: ['p(95)<500'],    // 95% under 500ms
  http_req_failed: ['rate<0.01']       // Less than 1% failures
}
```

#### Auth Test
```javascript
{
  http_req_duration: ['p(95)<500', 'p(99)<1000'],
  http_req_failed: ['rate<0.01'],
  errors: ['rate<0.05']                // Less than 5% errors
}
```

#### Packages Test
```javascript
{
  http_req_duration: ['p(95)<300', 'p(99)<800'],  // Faster for reads
  http_req_failed: ['rate<0.01'],
  errors: ['rate<0.03']
}
```

#### Bookings Test
```javascript
{
  http_req_duration: ['p(95)<1000', 'p(99)<2000'], // Slower for writes
  http_req_failed: ['rate<0.02'],
  booking_success: ['rate>0.9']         // 90%+ booking success
}
```

#### Stress Test
```javascript
{
  http_req_duration: ['p(99)<5000'],    // Relaxed under stress
  http_req_failed: ['rate<0.1']         // Up to 10% failure acceptable
}
```

### Threshold Violations

If thresholds are violated, k6 exits with a non-zero code, which will **fail CI/CD pipelines**.

Example failure:
```
✗ http_req_duration..............: avg=1234.56ms p(95)=2345.67ms ✗ p(99)=3456.78ms
     ✗ p(95)<500
```

---

## 🔄 CI/CD Integration

### GitHub Actions Workflow

Add load testing to your CI/CD pipeline:

```yaml
name: Load Testing

on:
  schedule:
    - cron: '0 2 * * *'  # Run nightly at 2 AM
  workflow_dispatch:      # Manual trigger

jobs:
  load-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Install k6
        run: |
          sudo gpg -k
          sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
          echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
          sudo apt-get update
          sudo apt-get install k6

      - name: Run smoke test
        run: npm run load:smoke
        env:
          BASE_URL: ${{ secrets.STAGING_URL }}

      - name: Run load tests
        if: success()
        run: npm run load:all
        env:
          BASE_URL: ${{ secrets.STAGING_URL }}

      - name: Upload results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: load-test-results
          path: tests/load/results/
          retention-days: 30
```

### When to Run Load Tests

**✅ Recommended:**
- Before production deployments
- After major feature releases
- On a scheduled basis (nightly/weekly)
- After infrastructure changes

**❌ Avoid:**
- On every commit (too expensive)
- Against production (use staging instead)
- Without smoke test first

---

## 💡 Best Practices

### Test Environment

1. **Use Staging:** Never run load tests against production
2. **Warm Up:** Run smoke test first to warm caches
3. **Isolated:** Use dedicated test environment (no shared resources)
4. **Realistic Data:** Seed database with production-like data

### Test Design

1. **Gradual Ramps:** Don't jump from 0 to 1000 users instantly
2. **Sustained Load:** Hold peak load for 3-5 minutes minimum
3. **Realistic Scenarios:** Mix different user journeys
4. **Think Time:** Add `sleep()` between requests (users don't spam)

### Interpreting Results

1. **Baseline First:** Run tests multiple times to establish baseline
2. **Look for Trends:** Compare results over time
3. **Check All Metrics:** Don't focus only on response times
4. **Investigate Failures:** Even 1% failure rate needs investigation

### Resource Monitoring

While running load tests, monitor:
- **CPU usage** (should stay below 80%)
- **Memory usage** (watch for leaks)
- **Database connections** (check for exhaustion)
- **Error logs** (Sentry/CloudWatch)
- **Network throughput**

### Performance Targets

| Metric | Target | Good | Poor |
|--------|--------|------|------|
| Response Time (p95) | < 500ms | < 300ms | > 1000ms |
| Response Time (p99) | < 1000ms | < 500ms | > 2000ms |
| Error Rate | < 1% | < 0.1% | > 5% |
| Throughput | > 100 req/s | > 200 req/s | < 50 req/s |

---

## 🐛 Troubleshooting

### Common Issues

#### Issue: "k6: command not found"
**Solution:** Install k6 following the [Installation](#installation) steps

#### Issue: Tests fail with connection errors
**Possible causes:**
- Application not running
- Wrong BASE_URL
- Firewall blocking requests

**Solution:**
```bash
# Check if app is running
curl http://localhost:3000

# Test with explicit URL
BASE_URL=http://localhost:3000 npm run load:smoke
```

#### Issue: High error rate (> 5%)
**Possible causes:**
- Database connection pool exhausted
- API rate limiting
- Memory leaks
- Insufficient resources

**Solution:**
1. Check application logs
2. Monitor resource usage
3. Increase database connections
4. Add caching
5. Optimize slow queries

#### Issue: Slow response times
**Possible causes:**
- Database queries not optimized
- No caching strategy
- N+1 query problems
- Large payloads

**Solution:**
1. Enable query logging
2. Add database indexes
3. Implement caching (see `src/lib/cache.ts`)
4. Use pagination
5. Optimize serialization

#### Issue: Memory leaks during stress test
**Symptoms:**
- Response times increase over time
- Eventually system crashes
- Memory usage grows continuously

**Solution:**
1. Check for event listener leaks
2. Review cache eviction policies
3. Use connection pooling
4. Profile memory usage
5. Add monitoring alerts

### Debug Mode

Run k6 with verbose output:

```bash
k6 run --verbose tests/load/auth.test.js
```

Enable HTTP debug logs:

```bash
k6 run --http-debug tests/load/auth.test.js
```

### Getting Help

- **k6 Documentation:** https://k6.io/docs/
- **k6 Community Forum:** https://community.k6.io/
- **GitHub Issues:** https://github.com/grafana/k6/issues

---

## 📈 Next Steps

After setting up load testing:

1. **Establish Baselines**
   - Run each test 3-5 times
   - Record average metrics
   - Document acceptable ranges

2. **Set Up Monitoring**
   - Add application metrics (Prometheus, Datadog)
   - Configure alerts for threshold violations
   - Create performance dashboards

3. **Integrate with CI/CD**
   - Add to PR checks (smoke test only)
   - Schedule nightly full runs
   - Block deployments on failures

4. **Continuous Improvement**
   - Review results weekly
   - Identify bottlenecks
   - Implement optimizations
   - Re-test and compare

---

## 📝 Additional Resources

- [k6 Documentation](https://k6.io/docs/)
- [Load Testing Best Practices](https://k6.io/docs/testing-guides/test-types/)
- [Performance Optimization Guide](./PERFORMANCE.md)
- [Monitoring Setup](./MONITORING.md)

---

**Created:** Sprint 1
**Owner:** Daniel (DevOps)
**Last Updated:** November 18, 2025

🚀 **Ready to load test!**
