# DEV TEAM - TONIGHT'S TASKS (November 17, 2025, 9:00 PM EST)
**Goal:** Get foundation ready for Sprint 0 tomorrow
**Time:** Next 2-3 hours

---

## ✅ AMELIA (Lead Dev) - CRITICAL PATH

### Task 1: Initialize Next.js Project (NOW - 30 min)

```bash
cd /Users/theeskapeum/Documents/augment-projects/OneDettyDecember

# Initialize Next.js 14 with TypeScript and Tailwind
npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"

# Answer prompts:
# ✔ Would you like to use TypeScript? Yes
# ✔ Would you like to use ESLint? Yes  
# ✔ Would you like to use Tailwind CSS? Yes
# ✔ Would you like to use `src/` directory? Yes
# ✔ Would you like to use App Router? Yes
# ✔ Would you like to customize the default import alias? Yes (@/*)
```

### Task 2: Install Dependencies (30 min)

```bash
# Supabase
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs

# Prisma ORM
npm install prisma @prisma/client
npm install -D prisma

# UI & Styling
npm install clsx tailwind-merge class-variance-authority lucide-react

# Forms & Validation
npm install react-hook-form zod @hookform/resolvers

# State Management
npm install zustand

# Date handling
npm install date-fns

# Dev dependencies
npm install -D @types/node @types/react @types/react-dom
```

### Task 3: Create Folder Structure (15 min)

```bash
# Create all necessary directories
mkdir -p src/components/ui
mkdir -p src/components/layout
mkdir -p src/components/navigation
mkdir -p src/components/feedback
mkdir -p src/components/data-display
mkdir -p src/lib
mkdir -p src/hooks
mkdir -p src/types
mkdir -p src/app/api/auth
mkdir -p src/app/api/bookings
mkdir -p src/app/api/packages
mkdir -p src/app/api/payments
mkdir -p src/app/api/waitlist
mkdir -p prisma
mkdir -p public/images
```

### Task 4: Set Up Environment Variables (10 min)

```bash
# Copy .env.example to .env.local
cp .env.example .env.local

# Edit .env.local with your actual values
# (You'll need to create Supabase project first)
```

### Task 5: Initialize Prisma (15 min)

```bash
# Initialize Prisma (schema already created)
npx prisma init

# The schema.prisma file is already in place
# Just need to set up the database connection
```

### Task 6: Git Setup (10 min)

```bash
# Initialize git (if not already done)
git init

# Create .gitignore (should be auto-created by Next.js)
# Add to .gitignore if not present:
echo ".env.local" >> .gitignore
echo "node_modules" >> .gitignore
echo ".next" >> .gitignore

# Initial commit
git add .
git commit -m "Initial project setup: Next.js 14, Prisma, Supabase"
```

**AMELIA'S CHECKLIST:**
- [ ] Next.js project initialized
- [ ] All dependencies installed
- [ ] Folder structure created
- [ ] .env.example created
- [ ] .env.local created (with placeholder values)
- [ ] Prisma initialized
- [ ] Git repository initialized
- [ ] Initial commit made
- [ ] Confirmed `npm run dev` works

---

## ✅ NERIAH (Dev 2 - Frontend) - AFTER AMELIA

### Task 1: Wait for Amelia's Setup (Monitor)

Wait until Amelia completes Tasks 1-3, then pull latest code:

```bash
git pull origin main
npm install
```

### Task 2: Install Storybook (30 min)

```bash
# Install Storybook
npx storybook@latest init

# Install addons
npm install -D @storybook/addon-a11y @storybook/addon-themes

# Test Storybook
npm run storybook
# Should open at http://localhost:6006
```

### Task 3: Create Component Documentation (30 min)

Create file: `src/components/ui/README.md`

```markdown
# OneDettyDecember Component Library

## Design System
- Based on Flowbite + Tailwind CSS v3
- Vertical color theming support
- Responsive by default
- Accessibility (WCAG AA+)

## Foundation Components (Sprint 0)
1. **Button** - Primary, secondary, ghost, outline variants
2. **Input** - Text, email, password with validation
3. **Select** - Dropdown with search capability
4. **Checkbox** - Single and group selections
5. **Radio** - Radio button groups
6. **Toggle** - Switch component
7. **Textarea** - Multi-line text input

## Vertical Themes
All components support 6 marketplace verticals:
- **Stays**: Coastal Emerald (#2A9D8F)
- **Events**: Afrobeat Red (#E63946)
- **Experiences**: Festival Orange (#FB8500)
- **Cars**: Atlantic Blue (#003566)
- **Marketplace**: Highlife Purple (#7209B7)
- **Community**: Danfo Yellow (#FFD60A)

## Usage
```tsx
import { Button } from '@/components/ui/button'

<Button variant="primary" vertical="events">
  Book Event
</Button>
```
```

**NERIAH'S CHECKLIST:**
- [ ] Pulled latest code from Amelia
- [ ] Dependencies installed
- [ ] Storybook installed and running
- [ ] Component README created
- [ ] Git commit: "Add Storybook and component documentation"

---

## ✅ NESIAH (Dev 3 - Backend) - PARALLEL WITH NERIAH

### Task 1: Review Database Schema (30 min)

```bash
# Pull latest code
git pull origin main
npm install

# Review the Prisma schema
cat prisma/schema.prisma
```

**Review these models:**
- User & UserProfile
- Vendor
- Package (Events, Stays, Experiences, Cars, Marketplace)
- Booking
- Payment
- Review
- WishlistItem
- WaitlistEntry

### Task 2: Create Database ERD Documentation (30 min)

Create file: `prisma/ERD.md`

```markdown
# OneDettyDecember Database ERD

## Core Entities

### Users
- Travelers (book packages)
- Vendors (create packages)
- Admins (manage platform)

### Packages
- Events (concerts, parties)
- Stays (hotels, Airbnbs)
- Experiences (tours, activities)
- Car Rentals (vehicles, transfers)
- Marketplace Products (merch, items)

### Transactions
- Bookings (user → package)
- Payments (Stripe/Paystack)
- Reviews (post-booking)

## Relationships
- User 1:1 UserProfile
- User 1:1 Vendor (optional)
- Vendor 1:N Packages
- User 1:N Bookings
- Package 1:N Bookings
- Booking 1:1 Payment
- Booking 1:1 Review (optional)
- User N:M Packages (via Wishlist)

## Indexes
- User: email, role
- Package: type, status, city, startDate
- Booking: userId, packageId, status
- Payment: status, providerPaymentId
```

### Task 3: Plan API Routes (30 min)

Create file: `src/app/api/README.md`

```markdown
# OneDettyDecember API Routes

## Authentication
- POST /api/auth/signup
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/session

## Packages
- GET /api/packages (list with filters)
- GET /api/packages/[id] (single package)
- POST /api/packages (create - vendor only)
- PATCH /api/packages/[id] (update - vendor only)
- DELETE /api/packages/[id] (delete - vendor only)

## Bookings
- GET /api/bookings (user's bookings)
- POST /api/bookings (create booking)
- GET /api/bookings/[id] (single booking)
- PATCH /api/bookings/[id]/cancel (cancel booking)

## Payments
- POST /api/payments/create-intent (Stripe/Paystack)
- POST /api/payments/webhook (payment confirmation)
- GET /api/payments/[id] (payment status)

## Waitlist
- POST /api/waitlist (add email)
- GET /api/waitlist/count (total signups)

## Reviews
- POST /api/reviews (create review)
- GET /api/packages/[id]/reviews (package reviews)

## Wishlist
- GET /api/wishlist (user's wishlist)
- POST /api/wishlist (add to wishlist)
- DELETE /api/wishlist/[packageId] (remove from wishlist)
```

**NESIAH'S CHECKLIST:**
- [ ] Pulled latest code
- [ ] Reviewed Prisma schema
- [ ] Created ERD documentation
- [ ] Created API routes plan
- [ ] Git commit: "Add database ERD and API routes documentation"

---

## ✅ NEZIAH (Dev 4 - Payment/Auth) - RESEARCH PHASE

### Task 1: Supabase Project Setup (45 min)

1. Go to https://supabase.com
2. Create new project: "onedettydecember"
3. Choose region: US East (closest to Troy, MI)
4. Set strong database password
5. Wait for project to provision (~2 min)

6. Get credentials:
   - Project URL: `https://[project-id].supabase.co`
   - Anon key: From Settings → API
   - Service role key: From Settings → API

7. Update `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL="https://[your-project-id].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
DATABASE_URL="postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres"
```

### Task 2: Payment Provider Research (45 min)

**Stripe Setup:**
1. Go to https://stripe.com
2. Create account (or login)
3. Get test API keys from Dashboard → Developers → API keys
4. Add to `.env.local`:
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
```

**Paystack Setup:**
1. Go to https://paystack.com
2. Create account
3. Get test API keys from Settings → API Keys & Webhooks
4. Add to `.env.local`:
```bash
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_test_..."
PAYSTACK_SECRET_KEY="sk_test_..."
```

**NEZIAH'S CHECKLIST:**
- [ ] Supabase project created
- [ ] Supabase credentials added to .env.local
- [ ] Stripe account created
- [ ] Stripe test keys added to .env.local
- [ ] Paystack account created
- [ ] Paystack test keys added to .env.local
- [ ] Git commit: "Add Supabase and payment provider configuration"

---

## ✅ DANIEL (Dev 5 - Testing/DevOps) - INFRASTRUCTURE

### Task 1: GitHub Repository Setup (30 min)

```bash
# Create GitHub repo (if not exists)
# Go to https://github.com/new
# Name: OneDettyDecember
# Private repository
# Don't initialize with README (we already have code)

# Add remote
git remote add origin https://github.com/[your-username]/OneDettyDecember.git

# Push code
git branch -M main
git push -u origin main
```

### Task 2: GitHub Actions Setup (30 min)

Create file: `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Run TypeScript check
        run: npx tsc --noEmit

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
```

### Task 3: ESLint & Prettier Setup (30 min)

```bash
# Install Prettier
npm install -D prettier eslint-config-prettier

# Create .prettierrc
echo '{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}' > .prettierrc

# Create .prettierignore
echo 'node_modules
.next
out
build
dist
.env*
' > .prettierignore
```

**DANIEL'S CHECKLIST:**
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] GitHub Actions CI workflow created
- [ ] Prettier installed and configured
- [ ] Git commit: "Add CI/CD pipeline and code formatting"

---

## END OF TONIGHT - TEAM SYNC

**Before ending (11:00 PM EST):**

1. **All devs:** Push your commits to GitHub
2. **Amelia:** Verify `npm run dev` works
3. **Neriah:** Verify `npm run storybook` works
4. **Neziah:** Verify Supabase connection works
5. **Daniel:** Verify GitHub Actions runs successfully

**Quick Team Check:**
```bash
# Everyone run these commands:
git pull origin main
npm install
npm run dev
# Should see: "Ready on http://localhost:3000"
```

---

## TOMORROW MORNING (November 18, 9:00 AM EST)

**Standup Agenda:**
1. Review tonight's progress
2. Confirm all environments working
3. Start Sprint 0 Day 1 tasks
4. Run estimation workshop (2 hours)

---

**STATUS: READY TO BUILD**
**TIME: ~2-3 hours of work tonight**
**GOAL: Foundation ready for Sprint 0 tomorrow**

