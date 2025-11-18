# OneDettyDecember - Sprint 0 Dev Assignments
**Sprint Duration:** Week 1 (November 18-24, 2025)
**Team Size:** 5 Developers
**Sprint Goal:** Project setup, estimation, and component library foundation

---

## TEAM ROSTER

| Developer | Role | Focus Area |
|-----------|------|------------|
| **Amelia** | Lead Dev | Architecture, Supabase, Core Setup |
| **Neriah** | Dev 2 | Frontend Components, UI/UX |
| **Nesiah** | Dev 3 | Backend APIs, Database Schema |
| **Neziah** | Dev 4 | Payment Integration, Auth |
| **Daniel** | Dev 5 | Testing, DevOps, CI/CD |

---

## SPRINT 0 OBJECTIVES

### 1. Project Infrastructure Setup
**Owner:** Amelia + Daniel
**Duration:** Days 1-2

### 2. v4 Epics Estimation Workshop
**Owner:** All Devs
**Duration:** Days 1-2

### 3. Component Library Foundation
**Owner:** Neriah + Nesiah
**Duration:** Days 3-5

### 4. Database Schema Design
**Owner:** Nesiah + Amelia
**Duration:** Days 3-5

### 5. CI/CD Pipeline
**Owner:** Daniel
**Duration:** Days 3-5

---

## DETAILED TASK ASSIGNMENTS

## AMELIA (Lead Dev)

### DAY 1-2: Project Setup & Architecture
**Priority:** P0

**Tasks:**
- [ ] Initialize Next.js 14 project with App Router
- [ ] Configure TypeScript with strict mode
- [ ] Set up Tailwind CSS v3 configuration
- [ ] Configure Supabase project (production + staging)
- [ ] Set up Prisma ORM with Supabase PostgreSQL
- [ ] Create project folder structure
- [ ] Set up environment variables (.env.local, .env.production)
- [ ] Configure Vercel deployment (staging + production)
- [ ] Document architecture decisions in `/docs/architecture.md`

**Deliverables:**
- Working Next.js app deployed to Vercel staging
- Supabase project configured with auth enabled
- Database connection established
- README with setup instructions

---

### DAY 3-5: Core Database Schema + Vertical Theming Integration
**Priority:** P0

**Tasks:**
- [ ] Review database schema with Nesiah
- [ ] Implement vertical color theming CSS variables in global styles
- [ ] Create VerticalThemeProvider React context
- [ ] Set up Prisma migrations workflow
- [ ] Create seed data for development
- [ ] Document database schema in `/docs/database-schema.md`
- [ ] Code review for all Sprint 0 PRs

**Deliverables:**
- Initial Prisma schema file
- Vertical theming system integrated
- Migration scripts
- Seed data script

---

## NERIAH (Dev 2 - Frontend Components)

### DAY 1-2: Estimation Workshop + Component Planning
**Priority:** P0

**Tasks:**
- [ ] Participate in v4 epics estimation (Epics 14-17)
- [ ] Review VERTICAL_COLOR_THEMING_SPEC.md
- [ ] Review OneDettyDecember-UIUX-Guide-v2-Simplified.md
- [ ] Create component library structure in `/components/ui`
- [ ] Set up Storybook for component documentation
- [ ] Document component design system in `/docs/component-library.md`

**Deliverables:**
- Estimation notes for Epics 14-17
- Component library folder structure
- Storybook configured

---

### DAY 3-5: Foundation Components (Batch 1)
**Priority:** P0

**Tasks:**
- [ ] Build Button component (primary, secondary, ghost, danger variants)
- [ ] Build Input component (text, email, password, number, date)
- [ ] Build Select/Dropdown component
- [ ] Build Checkbox component
- [ ] Build Radio component
- [ ] Build Toggle/Switch component
- [ ] Build Textarea component
- [ ] Add vertical theming support to all components
- [ ] Write Storybook stories for each component
- [ ] Write unit tests (Jest + React Testing Library)

**Deliverables:**
- 7 foundation form components
- Storybook stories
- Unit tests (>80% coverage)
- Component documentation

---

## NESIAH (Dev 3 - Backend APIs)

### DAY 1-2: Estimation Workshop + Database Design
**Priority:** P0

**Tasks:**
- [ ] Participate in v4 epics estimation (Epics 14-17)
- [ ] Review OneDettyDecember-PRD-v4-final.md
- [ ] Review OneDettyDecember-all-epics.md
- [ ] Design database schema for core entities:
  - Users (travelers, vendors, admins)
  - Packages (events, stays, experiences, cars, marketplace products)
  - Bookings
  - Payments
  - Reviews
- [ ] Create ERD (Entity Relationship Diagram)
- [ ] Document schema decisions

**Deliverables:**
- Estimation notes for Epics 14-17
- Database ERD
- Initial Prisma schema draft

---

### DAY 3-5: API Foundation + Layout Components
**Priority:** P0

**Tasks:**
- [ ] Collaborate with Amelia on Prisma schema finalization
- [ ] Create API route structure in `/app/api`
- [ ] Build authentication middleware
- [ ] Build error handling middleware
- [ ] Build rate limiting middleware
- [ ] Create API documentation template
- [ ] Build Card component (for Neriah's component library)
- [ ] Build Modal/Dialog component
- [ ] Build Tabs component

**Deliverables:**
- API route structure
- Middleware functions
- 3 layout components
- API documentation template

---

## NEZIAH (Dev 4 - Payment & Auth)

### DAY 1-2: Estimation Workshop + Auth Research
**Priority:** P0

**Tasks:**
- [ ] Participate in v4 epics estimation (Epics 14-17)
- [ ] Research Supabase Auth best practices
- [ ] Research Stripe + Paystack integration patterns
- [ ] Review Epic 1 (User Registration & Authentication)
- [ ] Review Epic 4 (Payment Integration)
- [ ] Document auth flow decisions
- [ ] Document payment flow decisions

**Deliverables:**
- Estimation notes for Epics 14-17
- Auth implementation plan
- Payment integration plan

---

### DAY 3-5: Auth Setup + Navigation Components
**Priority:** P0

**Tasks:**
- [ ] Configure Supabase Auth (email/password, Google, Facebook OAuth)
- [ ] Create auth helper functions
- [ ] Build login page UI
- [ ] Build signup page UI
- [ ] Build password reset flow
- [ ] Set up Stripe test account
- [ ] Set up Paystack test account
- [ ] Build Navbar component (for component library)
- [ ] Build Breadcrumbs component
- [ ] Build Pagination component

**Deliverables:**
- Supabase Auth configured
- Login/signup pages
- Stripe + Paystack test accounts
- 3 navigation components

---

## DANIEL (Dev 5 - Testing & DevOps)

### DAY 1-2: Estimation Workshop + DevOps Planning
**Priority:** P0

**Tasks:**
- [ ] Participate in v4 epics estimation (Epics 14-17)
- [ ] Set up GitHub repository structure
- [ ] Configure branch protection rules (main, staging, dev)
- [ ] Set up GitHub Actions workflows
- [ ] Configure ESLint + Prettier
- [ ] Set up Husky pre-commit hooks
- [ ] Document Git workflow in `/docs/git-workflow.md`
- [ ] Set up error tracking (Sentry)

**Deliverables:**
- Estimation notes for Epics 14-17
- GitHub Actions CI/CD pipeline
- Linting + formatting configured
- Git workflow documentation

---

### DAY 3-5: Testing Infrastructure + Feedback Components
**Priority:** P0

**Tasks:**
- [ ] Configure Jest + React Testing Library
- [ ] Set up Playwright for E2E testing
- [ ] Create test utilities and helpers
- [ ] Set up code coverage reporting
- [ ] Configure Vercel preview deployments
- [ ] Build Alert/Toast component (for component library)
- [ ] Build Badge component
- [ ] Build Progress bar component
- [ ] Build Skeleton loader component
- [ ] Build Spinner component

**Deliverables:**
- Testing infrastructure
- E2E test framework
- 5 feedback components
- Coverage reporting

---

## ESTIMATION WORKSHOP (ALL DEVS)

### Day 1: November 18, 2025 (2-hour session)

**Agenda:**
1. Review Epic 14: Car Rentals & Airport Transfers (30 min)
2. Review Epic 15: Hosted Experiences Marketplace (30 min)
3. Estimate user stories for Epics 14-15 (60 min)

**Output:**
- Story point estimates for Epic 14
- Story point estimates for Epic 15

---

### Day 2: November 19, 2025 (2-hour session)

**Agenda:**
1. Review Epic 16: Agentic AI Trip Planner & Host Copilot (30 min)
2. Review Epic 17: Marketplace Storefront (30 min)
3. Estimate user stories for Epics 16-17 (60 min)

**Output:**
- Story point estimates for Epic 16
- Story point estimates for Epic 17
- Complete sprint breakdown for all v4 epics

---

## SPRINT 0 SUCCESS METRICS

**Must-Have (P0):**
- [ ] Next.js app deployed to Vercel staging
- [ ] Supabase configured and connected
- [ ] Tailwind v3 configured
- [ ] All v4 epics estimated
- [ ] 15+ UI components built and tested
- [ ] CI/CD pipeline functional
- [ ] Auth flow working (login/signup)

**Nice-to-Have (P1):**
- [ ] Storybook deployed
- [ ] E2E tests for critical flows
- [ ] Database seeded with sample data
- [ ] Component library documentation complete

---

## DAILY STANDUP SCHEDULE

**Time:** 9:00 AM WAT (West Africa Time)
**Duration:** 15 minutes
**Format:** Async (Slack) or Sync (Google Meet)

**Questions:**
1. What did you complete yesterday?
2. What are you working on today?
3. Any blockers?

---

## END OF SPRINT 0 DELIVERABLES

**Due:** November 24, 2025 (End of Day)

1. Working Next.js app on Vercel staging
2. Component library (15+ components)
3. Database schema + migrations
4. Auth flow (login/signup/reset)
5. CI/CD pipeline
6. v4 Epics fully estimated
7. Sprint 1 plan ready

---

**Next Sprint:** Sprint 1 (November 25 - December 8, 2025)
**Focus:** Epic 1 (User Registration & Authentication) + Epic 2 (Package Discovery & Search)

