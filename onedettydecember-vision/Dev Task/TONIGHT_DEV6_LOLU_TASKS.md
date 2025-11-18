# Dev 6 (Lolu) - Testing & QA - Tonight's Tasks

**Role:** Testing & Quality Assurance Lead  
**Time:** 10:10 PM - 11:30 PM EST (1 hour 20 minutes)  
**Status:** 🆕 Starting Now

---

## 🎯 YOUR MISSION

Set up the **complete testing infrastructure** for OneDettyDecember platform so we can ensure quality from Day 1.

**Why this matters:**
- We're building 18 epics - quality is non-negotiable
- Sprint 0 Day 1 starts tomorrow - components need tests
- Production launch in 26 weeks - testing prevents disasters

---

## ✅ TONIGHT'S TASKS (1 hour 20 min)

### **TASK 1: Set Up Jest for Unit Testing** (30 min)

**What:** Configure Jest for React component and utility testing

**Steps:**
```bash
cd /Users/theeskapeum/Documents/augment-projects/OneDettyDecember/platform

# Install Jest and React Testing Library
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom

# Install additional testing utilities
npm install --save-dev @types/jest ts-node
```

**Create `jest.config.js`:**
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}

module.exports = createJestConfig(customJestConfig)
```

**Create `jest.setup.js`:**
```javascript
import '@testing-library/jest-dom'
```

**Add to `package.json` scripts:**
```json
"test": "jest",
"test:watch": "jest --watch",
"test:coverage": "jest --coverage"
```

**Deliverable:** ✅ Jest configured and ready

---

### **TASK 2: Set Up Playwright for E2E Testing** (30 min)

**What:** Configure Playwright for end-to-end browser testing

**Steps:**
```bash
cd /Users/theeskapeum/Documents/augment-projects/OneDettyDecember/platform

# Install Playwright
npm install --save-dev @playwright/test

# Initialize Playwright (select defaults)
npx playwright install
```

**Create `playwright.config.ts`:**
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3002',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 13'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3002',
    reuseExistingServer: !process.env.CI,
  },
})
```

**Create folder:**
```bash
mkdir -p e2e
```

**Add to `package.json` scripts:**
```json
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui"
```

**Deliverable:** ✅ Playwright configured

---

### **TASK 3: Create Example Tests** (20 min)

**What:** Write sample tests to validate setup and provide templates

**Create `src/lib/__tests__/example.test.ts`:**
```typescript
describe('Example Unit Test', () => {
  it('should pass basic test', () => {
    expect(1 + 1).toBe(2)
  })
})
```

**Create `e2e/homepage.spec.ts`:**
```typescript
import { test, expect } from '@playwright/test'

test('homepage loads successfully', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Next.js/)
})
```

**Run tests to verify:**
```bash
npm run test
npm run test:e2e
```

**Deliverable:** ✅ Example tests passing

---

## 📊 SUCCESS CRITERIA - TONIGHT

By 11:30 PM EST, you should have:

- [ ] Jest installed and configured
- [ ] React Testing Library set up
- [ ] Playwright installed and configured
- [ ] Test folders created (`src/**/__tests__`, `e2e/`)
- [ ] Example tests written and passing
- [ ] Scripts added to package.json
- [ ] Git commit: "Set up testing infrastructure (Jest + Playwright)"

---

## 🚀 TOMORROW (Sprint 0 Day 1)

**Your focus:**
1. Write tests for components Neriah builds
2. Set up accessibility testing (axe-core)
3. Configure test coverage reporting
4. Create testing documentation
5. E2E tests for critical user flows

---

## 📚 TESTING STANDARDS (Document Tomorrow)

**Unit Tests:**
- Every component gets a test file
- Test user interactions, not implementation
- Aim for 70%+ coverage

**E2E Tests:**
- Critical user flows (signup, booking, payment)
- Mobile and desktop viewports
- Accessibility checks

**Performance Tests:**
- Lighthouse CI integration
- Core Web Vitals monitoring

---

**Lolu:** Welcome to the team! Quality is your domain. Let's build a rock-solid platform! 🧪✅

