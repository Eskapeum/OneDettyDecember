# OneDettyDecember - Product Development Roadmap

**All Epics & User Stories**
**Version:** 1.0
**Last Updated:** November 8, 2025
**Total Epics:** 17 (Excluding Admin Dashboard; Epics 14–17 are new v4 marketplace/commerce capabilities)

---

## 📋 TABLE OF CONTENTS

1. [Epic 1: User Registration & Authentication](#epic-1-user-registration--authentication)
2. [Epic 2: Package Discovery & Search](#epic-2-package-discovery--search)
3. [Epic 3: Package Details & Booking](#epic-3-package-details--booking)
4. [Epic 4: Payment Integration](#epic-4-payment-integration)
5. [Epic 5: Reviews & Ratings System](#epic-5-reviews--ratings-system)
6. [Epic 6: User Profile & Account Management](#epic-6-user-profile--account-management)
7. [Epic 7: Wishlist & Favorites](#epic-7-wishlist--favorites)
8. [Epic 8: Email Notifications & Communication](#epic-8-email-notifications--communication)
9. [Epic 9: Analytics & Tracking](#epic-9-analytics--tracking)
10. [Epic 10: SEO & Performance Optimization](#epic-10-seo--performance-optimization)
11. [Epic 11: Security & Compliance](#epic-11-security--compliance)
12. [Epic 12: Mobile Optimization](#epic-12-mobile-optimization)
13. [Epic 13: Content Management System](#epic-13-content-management-system)
14. [Epic 14: Car Rentals & Airport Transfers](#epic-14-car-rentals--airport-transfers)
15. [Epic 15: Hosted Experiences Marketplace](#epic-15-hosted-experiences-marketplace)
16. [Epic 16: Agentic AI Trip Planner & Host Copilot](#epic-16-agentic-ai-trip-planner--host-copilot)
17. [Epic 17: Marketplace Storefront](#epic-17-marketplace-storefront)
18. [Epic 18: Comprehensive Admin Dashboard](#epic-18-comprehensive-admin-dashboard)


---

## 🎯 EPIC SUMMARY

| Epic | Name | Priority | Story Points | Status |
|------|------|----------|--------------|--------|
| 1 | User Registration & Authentication | P0 | 34 | Not Started |
| 2 | Package Discovery & Search | P0 | 28 | Not Started |
| 3 | Package Details & Booking | P0 | 47 | Not Started |
| 4 | Payment Integration | P0 | 42 | Not Started |
| 5 | Reviews & Ratings System | P1 | 31 | Not Started |
| 6 | User Profile & Account Management | P1 | 26 | Not Started |
| 7 | Wishlist & Favorites | P2 | 16 | Not Started |
| 8 | Email Notifications & Communication | P0 | 21 | Not Started |
| 9 | Analytics & Tracking | P1 | 18 | Not Started |
| 10 | SEO & Performance Optimization | P0 | 21 | Not Started |
| 11 | Security & Compliance | P0 | 29 | Not Started |
| 12 | Mobile Optimization | P2 | 16 | Not Started |
| 13 | Content Management System | P2 | 26 | Not Started |
| **TOTAL (Core)** | | | **355 points** | **~30 weeks** |
| 18 | Comprehensive Admin Dashboard | P0 | 144 | Not Started |
| **TOTAL (Core + Admin)** | | | **499 points** | **~42 weeks** |
**Note (v4 capabilities):** Epics 14 (Car Rentals & Airport Transfers), 15 (Hosted Experiences Marketplace), 16 (Agentic AI Trip Planner & Host Copilot) and 17 (Marketplace Storefront) are defined later in this document for v4 of the product. They are not yet estimated and therefore are not included in the total story points above. Epic 18 (Comprehensive Admin Dashboard) is defined in `detty-december-admin-dashboard-epic.md`.



---

# EPIC 1: User Registration & Authentication

**Epic ID:** DDT-EPIC-01
**Priority:** P0 - Critical
**Estimated Points:** 34 points (3 weeks)
**Dependencies:** None

## Overview

Enable users to create accounts, authenticate securely, and manage their sessions across the platform. This is the foundation for all personalized features including bookings, wishlists, and profile management.

## Business Value

- **User Acquisition:** Seamless registration reduces friction and increases conversions
- **Data Collection:** Gather user information for personalized experiences
- **Security:** Protect user data and prevent unauthorized access
- **Retention:** Enable returning users to access their booking history

## User Stories

---

### **STORY 1.1: User Registration**

**As a** potential traveler
**I want to** create an account on the platform
**So that** I can save my preferences, view bookings, and access personalized recommendations

**Acceptance Criteria:**
- [ ] User can register with email and password
- [ ] User can register with Google OAuth
- [ ] User can register with Facebook OAuth
- [ ] Email verification required before full access
- [ ] Password must meet security requirements (8+ chars, 1 uppercase, 1 number, 1 special)
- [ ] User profile is automatically created upon registration
- [ ] Welcome email sent upon successful registration

**Technical Tasks:**

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-101: Implement User Registration API          │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 5 points | Assignee: Backend Dev

DESCRIPTION:
Create user registration endpoint with email verification
and secure password handling.

TASKS:
- [ ] Create User model in database (Supabase/PostgreSQL)
- [ ] Implement POST /api/auth/register endpoint
- [ ] Add password hashing (bcrypt)
- [ ] Generate email verification token
- [ ] Send verification email via SendGrid
- [ ] Add rate limiting (5 attempts per IP per hour)
- [ ] Write unit tests (80%+ coverage)
- [ ] Write API documentation

DATABASE SCHEMA:
users table:
- id (UUID, primary key)
- email (VARCHAR, unique, indexed)
- password_hash (VARCHAR)
- first_name (VARCHAR)
- last_name (VARCHAR)
- phone (VARCHAR, nullable)
- profile_photo_url (VARCHAR, nullable)
- email_verified (BOOLEAN, default: false)
- verification_token (VARCHAR, nullable)
- role (ENUM: user, admin, vendor)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

API REQUEST:
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890"
}

API RESPONSE:
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe"
  },
  "message": "Verification email sent to user@example.com"
}

DEPENDENCIES: None
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-102: Implement OAuth 2.0 (Google & Facebook)  │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 8 points | Assignee: Backend Dev

DESCRIPTION:
Implement OAuth 2.0 authentication for Google and Facebook
to provide seamless social login.

TASKS:
- [ ] Set up Google OAuth 2.0 credentials
- [ ] Set up Facebook OAuth credentials
- [ ] Implement OAuth callback handlers
- [ ] Handle OAuth token exchange
- [ ] Create or update user profile from OAuth data
- [ ] Handle OAuth errors and edge cases
- [ ] Add OAuth buttons to frontend
- [ ] Test OAuth flow end-to-end

API ENDPOINTS:
GET /api/auth/oauth/google/redirect
  - Redirect to Google OAuth consent screen

GET /api/auth/oauth/google/callback
  - Handle Google OAuth callback
  - Exchange code for access token
  - Fetch user profile
  - Create/update user in database
  - Return JWT tokens

GET /api/auth/oauth/facebook/redirect
  - Redirect to Facebook OAuth consent screen

GET /api/auth/oauth/facebook/callback
  - Handle Facebook OAuth callback
  - Similar flow to Google

DEPENDENCIES: DDT-101
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-103: Email Verification System                │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 5 points | Assignee: Backend Dev

DESCRIPTION:
Implement email verification system to ensure valid email
addresses and prevent spam accounts.

TASKS:
- [ ] Create verification token generator (crypto.randomBytes)
- [ ] Implement GET /api/auth/verify-email/:token endpoint
- [ ] Design verification email template (HTML)
- [ ] Add resend verification email functionality
- [ ] Add token expiration (24 hours)
- [ ] Update user email_verified status upon verification
- [ ] Add frontend verification success/error pages

API ENDPOINT:
GET /api/auth/verify-email/:token
  - Validate token
  - Check token expiration
  - Update user.email_verified = true
  - Delete verification token
  - Return success message

POST /api/auth/resend-verification
{
  "email": "user@example.com"
}
  - Generate new token
  - Send new verification email
  - Return success message

EMAIL TEMPLATE:
Subject: Verify your OneDettyDecember account
Body: HTML template with verification link
Link: https://onedettydecember.com/verify-email/{token}

DEPENDENCIES: DDT-101
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-104: Build Registration Form (Frontend)       │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 8 points | Assignee: Frontend Dev

DESCRIPTION:
Create user-friendly registration form with validation
and OAuth integration.

TASKS:
- [ ] Create RegisterPage component
- [ ] Build registration form with React Hook Form
- [ ] Add form validation (Zod schema)
  - Email format validation
  - Password strength validation
  - Required fields validation
- [ ] Add OAuth buttons (Google, Facebook)
- [ ] Implement form submission
- [ ] Handle API errors gracefully
- [ ] Show success message after registration
- [ ] Redirect to email verification page
- [ ] Add loading states
- [ ] Write component tests

FORM FIELDS:
- First Name (required)
- Last Name (required)
- Email (required, email validation)
- Phone (optional, phone format)
- Password (required, strength indicator)
- Confirm Password (required, must match)
- Terms & Conditions checkbox (required)

VALIDATION RULES:
- Password: Min 8 chars, 1 uppercase, 1 number, 1 special char
- Email: Valid email format
- Phone: Valid phone format (if provided)

TECH STACK: React, React Hook Form, Zod, Tailwind CSS
DEPENDENCIES: DDT-101, DDT-102
```

---

### **STORY 1.2: User Login & Session Management**

**As a** registered user
**I want to** log in securely to my account
**So that** I can access my bookings and personal information

**Acceptance Criteria:**
- [ ] User can log in with email and password
- [ ] User can log in with Google
- [ ] User can log in with Facebook
- [ ] Session persists across browser refreshes
- [ ] User can log out
- [ ] Failed login attempts are tracked and limited
- [ ] "Remember me" option available

**Technical Tasks:**

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-105: Implement Login API                      │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 5 points | Assignee: Backend Dev

DESCRIPTION:
Create secure login endpoint with JWT token generation
and refresh token mechanism.

TASKS:
- [ ] Implement POST /api/auth/login endpoint
- [ ] Verify password hash (bcrypt.compare)
- [ ] Generate JWT access token (15 min expiry)
- [ ] Generate JWT refresh token (7 day expiry)
- [ ] Store refresh token in httpOnly cookie
- [ ] Implement rate limiting (10 attempts per IP per hour)
- [ ] Log failed login attempts
- [ ] Write unit tests

JWT PAYLOAD:
{
  "user_id": "uuid",
  "email": "user@example.com",
  "role": "user",
  "exp": timestamp
}

API REQUEST:
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

API RESPONSE:
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "email_verified": true
  },
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..." // Also in httpOnly cookie
}

DEPENDENCIES: DDT-101
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-106: Implement Token Refresh Mechanism        │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 3 points | Assignee: Backend Dev

DESCRIPTION:
Implement token refresh endpoint to issue new access tokens
without requiring re-login.

TASKS:
- [ ] Implement POST /api/auth/refresh endpoint
- [ ] Validate refresh token from httpOnly cookie
- [ ] Issue new access token (15 min expiry)
- [ ] Implement token blacklist for logout
- [ ] Add middleware to check token expiry
- [ ] Handle expired refresh tokens (redirect to login)
- [ ] Write unit tests

TOKEN BLACKLIST:
Create revoked_tokens table:
- token_id (UUID)
- revoked_at (TIMESTAMP)
- expires_at (TIMESTAMP)

Clean up expired tokens via cron job (daily)

DEPENDENCIES: DDT-105
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-107: Implement Logout Functionality           │
└─────────────────────────────────────────────────────────┘

Priority: P1 | Estimate: 2 points | Assignee: Backend Dev

DESCRIPTION:
Implement secure logout that invalidates refresh tokens
and clears session data.

TASKS:
- [ ] Implement POST /api/auth/logout endpoint
- [ ] Invalidate refresh token (add to blacklist)
- [ ] Clear httpOnly cookie
- [ ] Add logout button to frontend
- [ ] Clear user state in frontend (Redux/Context)
- [ ] Write unit tests

API ENDPOINT:
POST /api/auth/logout
Headers: {
  Authorization: "Bearer {access_token}"
}

RESPONSE:
{
  "message": "Logged out successfully"
}

DEPENDENCIES: DDT-105
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-108: Build Login Form (Frontend)              │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 5 points | Assignee: Frontend Dev

DESCRIPTION:
Create login form with email/password and OAuth options.

TASKS:
- [ ] Create LoginPage component
- [ ] Build login form with React Hook Form
- [ ] Add form validation
- [ ] Add OAuth buttons (Google, Facebook)
- [ ] Implement form submission
- [ ] Handle API errors (invalid credentials, etc.)
- [ ] Redirect to dashboard after successful login
- [ ] Add "Forgot Password?" link
- [ ] Add "Remember Me" checkbox
- [ ] Add loading states
- [ ] Write component tests

FORM FIELDS:
- Email (required)
- Password (required)
- Remember Me (checkbox)

ERROR HANDLING:
- Invalid credentials: "Invalid email or password"
- Account not verified: "Please verify your email"
- Too many attempts: "Too many login attempts. Try again in X minutes"

TECH STACK: React, React Hook Form, Zod, Tailwind CSS
DEPENDENCIES: DDT-105
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-109: Implement Protected Routes               │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 3 points | Assignee: Frontend Dev

DESCRIPTION:
Create route protection mechanism to restrict access to
authenticated users only.

TASKS:
- [ ] Create ProtectedRoute component
- [ ] Check for valid access token
- [ ] Redirect to login if not authenticated
- [ ] Store intended destination for post-login redirect
- [ ] Implement automatic token refresh
- [ ] Handle token expiration gracefully
- [ ] Add loading state while checking auth
- [ ] Write component tests

PROTECTED ROUTES:
- /profile
- /bookings
- /wishlist
- /checkout

IMPLEMENTATION:
<ProtectedRoute>
  <ProfilePage />
</ProtectedRoute>

If not authenticated:
- Store current URL in sessionStorage
- Redirect to /login
- After login, redirect back to stored URL

DEPENDENCIES: DDT-105, DDT-106
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-110: Implement Forgot/Reset Password          │
└─────────────────────────────────────────────────────────┘

Priority: P1 | Estimate: 8 points | Assignee: Full-Stack Dev

DESCRIPTION:
Implement password reset flow with email verification.

BACKEND TASKS:
- [ ] Create password_reset_tokens table
- [ ] Implement POST /api/auth/forgot-password endpoint
  - Generate reset token
  - Send reset email
  - Token expires in 1 hour
- [ ] Implement POST /api/auth/reset-password endpoint
  - Validate reset token
  - Update password
  - Invalidate reset token
- [ ] Write unit tests

FRONTEND TASKS:
- [ ] Create ForgotPasswordPage
  - Email input form
  - Submit and show success message
- [ ] Create ResetPasswordPage
  - New password input
  - Confirm password input
  - Submit and redirect to login
- [ ] Add validation and error handling
- [ ] Write component tests

EMAIL TEMPLATE:
Subject: Reset your OneDettyDecember password
Body: HTML template with reset link
Link: https://onedettydecember.com/reset-password/{token}
Expires: 1 hour

DEPENDENCIES: DDT-105
```

---

# EPIC 2: Package Discovery & Search

**Epic ID:** DDT-EPIC-02
**Priority:** P0 - Critical
**Estimated Points:** 28 points (2.5 weeks)
**Dependencies:** None

## Overview

Enable users to discover and search for tour packages through browsing, filtering, and full-text search. This is critical for user experience and conversion.

## Business Value

- **Discovery:** Help users find packages that match their interests
- **Conversion:** Better discovery leads to higher booking rates
- **User Experience:** Reduce time to find desired package
- **SEO:** Searchable content improves organic traffic

## User Stories

---

### **STORY 2.1: Browse Packages**

**As a** potential traveler
**I want to** browse available tour packages
**So that** I can find experiences that interest me

**Acceptance Criteria:**
- [ ] Display all available packages on main page
- [ ] Show package image, title, price, duration, and rating
- [ ] Packages load quickly (<2 seconds)
- [ ] Mobile-responsive grid layout
- [ ] Smooth scrolling and lazy loading
- [ ] Filter by price range, duration, category

**Technical Tasks:**

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-201: Create Package Database Schema           │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 5 points | Assignee: Backend Dev

DESCRIPTION:
Design and implement comprehensive database schema for
tour packages with all related tables.

TASKS:
- [ ] Design packages table schema
- [ ] Design package_images table (multiple images per package)
- [ ] Design package_inclusions table
- [ ] Design package_itinerary table
- [ ] Add database migrations
- [ ] Seed database with initial packages (10-15 packages)
- [ ] Create database indexes for performance

SCHEMA:

packages table:
- id (UUID, primary key)
- title (VARCHAR, indexed)
- slug (VARCHAR, unique, indexed)
- description (TEXT)
- short_description (VARCHAR)
- price (DECIMAL)
- duration_days (INTEGER)
- category (VARCHAR, indexed)
  - detty-december
  - cultural-immersion
  - corporate-retreat
  - city-tours
  - adventure
- max_capacity (INTEGER)
- min_capacity (INTEGER)
- vendor_id (UUID, foreign key → vendors.id)
- status (ENUM: draft, published, archived)
- featured (BOOLEAN, default: false)
- view_count (INTEGER, default: 0)
- booking_count (INTEGER, default: 0)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

package_images table:
- id (UUID, primary key)
- package_id (UUID, foreign key → packages.id)
- image_url (VARCHAR)
- alt_text (VARCHAR)
- display_order (INTEGER)
- is_primary (BOOLEAN)
- created_at (TIMESTAMP)

package_inclusions table:
- id (UUID, primary key)
- package_id (UUID, foreign key → packages.id)
- title (VARCHAR)
- description (TEXT)
- included (BOOLEAN) -- true = included, false = excluded
- icon (VARCHAR, nullable)
- display_order (INTEGER)
- created_at (TIMESTAMP)

package_itinerary table:
- id (UUID, primary key)
- package_id (UUID, foreign key → packages.id)
- day_number (INTEGER)
- title (VARCHAR)
- description (TEXT)
- activities (JSONB) -- Array of activities
- created_at (TIMESTAMP)

INDEXES:
- packages: (slug), (status, category), (featured, status)
- package_images: (package_id, display_order)
- package_inclusions: (package_id, display_order)
- package_itinerary: (package_id, day_number)

DEPENDENCIES: None
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-202: Implement Package Listing API            │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 5 points | Assignee: Backend Dev

DESCRIPTION:
Create API endpoint for listing packages with pagination,
sorting, and filtering.

TASKS:
- [ ] Implement GET /api/packages endpoint
- [ ] Add pagination (20 per page, configurable)
- [ ] Add sorting options:
  - price_asc, price_desc
  - popularity (booking_count desc)
  - newest (created_at desc)
  - rating (average_rating desc)
- [ ] Add filtering:
  - price_range (min, max)
  - duration (min_days, max_days)
  - category
  - featured_only
- [ ] Optimize query performance (<100ms)
- [ ] Add response caching (Redis, 5 min TTL)
- [ ] Write API documentation
- [ ] Write unit tests

API REQUEST:
GET /api/packages?page=1&per_page=20&sort=popularity&category=detty-december&min_price=2000&max_price=7000

API RESPONSE:
{
  "packages": [
    {
      "id": "uuid",
      "title": "Detty VIP Experience",
      "slug": "detty-vip-experience",
      "short_description": "7 days of luxury...",
      "price": 6500,
      "duration_days": 7,
      "category": "detty-december",
      "primary_image": {
        "url": "https://cdn.../image.jpg",
        "alt": "Detty VIP"
      },
      "average_rating": 4.8,
      "review_count": 24,
      "booking_count": 156
    },
    // ... more packages
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total_count": 45,
    "total_pages": 3
  }
}

DEPENDENCIES: DDT-201
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-203: Build Package Cards Component            │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 5 points | Assignee: Frontend Dev

DESCRIPTION:
Create reusable package card component with image, details,
and interactive features.

TASKS:
- [ ] Create PackageCard React component
- [ ] Implement responsive grid layout (CSS Grid)
  - 1 column on mobile
  - 2 columns on tablet
  - 3 columns on desktop
- [ ] Add package image with lazy loading
- [ ] Display:
  - Package title
  - Short description (truncated)
  - Price (formatted: $6,500)
  - Duration (e.g., "7 days")
  - Rating stars + review count
  - Category badge
- [ ] Add hover effects:
  - Scale image slightly
  - Show "View Details" button
  - Elevate card shadow
- [ ] Implement "Add to Wishlist" button (heart icon)
- [ ] Add click handler to view details
- [ ] Add loading skeleton for loading state
- [ ] Write component tests

COMPONENT STRUCTURE:
<div className="package-card">
  <div className="image-container">
    <img src={primaryImage} alt={title} loading="lazy" />
    <button className="wishlist-btn">❤️</button>
  </div>
  <div className="content">
    <span className="category-badge">{category}</span>
    <h3>{title}</h3>
    <p className="description">{shortDescription}</p>
    <div className="rating">
      <Stars rating={avgRating} />
      <span>({reviewCount} reviews)</span>
    </div>
    <div className="footer">
      <span className="price">${price}</span>
      <span className="duration">{durationDays} days</span>
    </div>
  </div>
</div>

TECH: React, Next.js, TailwindCSS, Lucide Icons
DEPENDENCIES: DDT-202
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-204: Implement Infinite Scroll                │
└─────────────────────────────────────────────────────────┘

Priority: P1 | Estimate: 3 points | Assignee: Frontend Dev

DESCRIPTION:
Implement infinite scroll for package listing to improve
user experience.

TASKS:
- [ ] Implement Intersection Observer API
- [ ] Load more packages on scroll to bottom
- [ ] Add loading spinner while fetching
- [ ] Handle end of results (show "No more packages")
- [ ] Optimize scroll performance (debounce)
- [ ] Maintain scroll position on back navigation
- [ ] Test on mobile devices
- [ ] Write component tests

IMPLEMENTATION:
- Use IntersectionObserver to detect when user scrolls to bottom
- Trigger API call to fetch next page
- Append new packages to existing list
- Show loading spinner at bottom
- When no more results, show "You've seen all packages"

ALTERNATIVE: "Load More" button
- If infinite scroll causes issues
- Simpler implementation
- User has more control

DEPENDENCIES: DDT-203
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-205: Implement Filter & Sort UI               │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 8 points | Assignee: Frontend Dev

DESCRIPTION:
Create filter and sort controls for package discovery.

TASKS:
- [ ] Create FilterSidebar component (desktop)
- [ ] Create FilterSheet component (mobile bottom sheet)
- [ ] Implement filter options:

  PRICE RANGE:
  - Dual range slider
  - Min/Max price inputs
  - Show current range

  DURATION:
  - Checkbox: 1-3 days, 4-7 days, 8+ days

  CATEGORY:
  - Checkbox list of all categories

  RATING:
  - 5 stars, 4+ stars, 3+ stars

  FEATURED ONLY:
  - Toggle switch

- [ ] Implement sort dropdown:
  - Popularity
  - Price: Low to High
  - Price: High to Low
  - Newest
  - Highest Rated

- [ ] Update URL query params on filter/sort change
- [ ] Apply filters to API call
- [ ] Show active filter count badge
- [ ] Add "Clear All Filters" button
- [ ] Persist filters in URL
- [ ] Write component tests

UI PLACEMENT:
Desktop: Sidebar on left, packages on right
Mobile: Floating filter button, bottom sheet modal

DEPENDENCIES: DDT-202
```

---

### **STORY 2.2: Search Packages**

**As a** potential traveler
**I want to** search for specific packages or experiences
**So that** I can quickly find what I'm looking for

**Acceptance Criteria:**
- [ ] Search bar visible on all pages
- [ ] Search supports keywords, package names, activities
- [ ] Results appear as user types (autocomplete)
- [ ] Search results are relevant and ranked
- [ ] No results show helpful suggestions
- [ ] Search queries are logged for analytics

**Technical Tasks:**

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-206: Implement Full-Text Search               │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 8 points | Assignee: Backend Dev

DESCRIPTION:
Implement full-text search using PostgreSQL or Algolia
for fast, relevant search results.

TASKS:
OPTION 1: PostgreSQL Full-Text Search
- [ ] Add tsvector column to packages table
- [ ] Create GIN index on tsvector column
- [ ] Implement trigger to update tsvector on data change
- [ ] Create search query using ts_rank for ranking
- [ ] Implement GET /api/search endpoint

OPTION 2: Algolia (Recommended for better search)
- [ ] Set up Algolia account and index
- [ ] Configure searchable attributes:
  - title (high priority)
  - description (medium priority)
  - category (medium priority)
  - inclusions (low priority)
- [ ] Sync packages to Algolia on create/update
- [ ] Implement GET /api/search endpoint (calls Algolia)

- [ ] Implement autocomplete suggestions
- [ ] Add search analytics logging
- [ ] Optimize search performance (<200ms)
- [ ] Write unit tests

API REQUEST:
GET /api/search?q=vip+lagos&limit=10

API RESPONSE:
{
  "results": [
    {
      "id": "uuid",
      "title": "Detty VIP Experience",
      "slug": "detty-vip-experience",
      "short_description": "...",
      "price": 6500,
      "primary_image": {...},
      "relevance_score": 0.95,
      "matched_fields": ["title", "description"]
    },
    // ...
  ],
  "suggestions": [
    "VIP experiences in Lagos",
    "VIP nightlife tours",
    "Luxury Lagos packages"
  ],
  "total_results": 12,
  "query_time_ms": 45
}

DEPENDENCIES: DDT-201
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-207: Build Search Component (Frontend)        │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 5 points | Assignee: Frontend Dev

DESCRIPTION:
Create search bar component with autocomplete and
instant results.

TASKS:
- [ ] Create SearchBar component
- [ ] Implement debounced search input (300ms delay)
  - Prevents API call on every keystroke
  - Improves performance
- [ ] Display autocomplete dropdown
  - Show up to 5 suggestions
  - Highlight matching keywords
  - Show package images
  - Show price
- [ ] Handle empty states
  - "Start typing to search..."
  - "No results found. Try: [suggestions]"
- [ ] Add keyboard navigation
  - Arrow keys to navigate suggestions
  - Enter to select
  - Escape to close
- [ ] Mobile-responsive design
  - Full-width search on mobile
  - Bottom sheet for results
- [ ] Add search icon and loading spinner
- [ ] Track search analytics (Google Analytics)
- [ ] Write component tests

COMPONENT STRUCTURE:
<SearchBar>
  <input
    type="search"
    placeholder="Search packages, activities, locations..."
    onChange={debouncedSearch}
  />
  <SearchResults>
    {results.map(result => (
      <SearchResultItem
        key={result.id}
        {...result}
        onSelect={handleSelect}
      />
    ))}
  </SearchResults>
</SearchBar>

DEPENDENCIES: DDT-206
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-208: Implement Search Results Page            │
└─────────────────────────────────────────────────────────┘

Priority: P1 | Estimate: 5 points | Assignee: Frontend Dev

DESCRIPTION:
Create dedicated search results page with filtering
and sorting.

TASKS:
- [ ] Create SearchResultsPage component
- [ ] Display search query prominently
  - "Search results for: 'vip lagos'"
  - Show result count
- [ ] Use PackageCard component for results
- [ ] Show "No results" state with suggestions
  - "We couldn't find anything for 'xyz'"
  - "Try: [related searches]"
  - Show popular packages
- [ ] Add filter sidebar (reuse from DDT-205)
- [ ] Add sort dropdown
- [ ] Highlight search terms in results
- [ ] Track "no results" queries for improvement
- [ ] Write component tests

URL STRUCTURE:
/search?q=vip+lagos&category=detty-december&sort=popularity

DEPENDENCIES: DDT-206, DDT-207
```

---

# EPIC 3: Package Details & Booking

**Epic ID:** DDT-EPIC-03
**Priority:** P0 - Critical
**Estimated Points:** 47 points (4 weeks)
**Dependencies:** Epic 1, Epic 2

## Overview

Enable users to view comprehensive package information and complete the booking process. This is the core conversion funnel of the platform.

## Business Value

- **Conversion:** Detailed information helps users make booking decisions
- **Trust:** Transparency builds confidence in the offering
- **Revenue:** Direct path from interest to booking
- **Customer Satisfaction:** Clear expectations reduce complaints

## User Stories

---

### **STORY 3.1: View Package Details**

**As a** potential traveler
**I want to** view detailed information about a package
**So that** I can make an informed booking decision

**Acceptance Criteria:**
- [ ] Package details page loads quickly (<2 seconds)
- [ ] Display high-quality images (gallery/carousel)
- [ ] Show comprehensive description
- [ ] Display pricing breakdown
- [ ] Show what's included/excluded
- [ ] Display itinerary with day-by-day breakdown
- [ ] Show reviews and ratings
- [ ] Display availability calendar
- [ ] Show similar packages

**Technical Tasks:**

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-301: Implement Package Details API            │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 5 points | Assignee: Backend Dev

DESCRIPTION:
Create API endpoint to fetch complete package details
with all related data.

TASKS:
- [ ] Implement GET /api/packages/:slug endpoint
- [ ] Include package details
- [ ] Include all images (ordered by display_order)
- [ ] Include all inclusions/exclusions (ordered)
- [ ] Include complete itinerary (ordered by day)
- [ ] Include average rating and review count
- [ ] Include availability data (next 90 days)
- [ ] Include similar packages (same category, price range)
- [ ] Increment view count
- [ ] Add response caching (15 min TTL)
- [ ] Handle 404 for invalid slugs
- [ ] Write API documentation
- [ ] Write unit tests

API REQUEST:
GET /api/packages/detty-vip-experience

API RESPONSE:
{
  "package": {
    "id": "uuid",
    "title": "Detty VIP Experience",
    "slug": "detty-vip-experience",
    "description": "Full description...",
    "short_description": "Brief summary...",
    "price": 6500,
    "duration_days": 7,
    "category": "detty-december",
    "max_capacity": 50,
    "min_capacity": 2,
    "vendor": {
      "id": "uuid",
      "company_name": "Premium Tours Ltd",
      "rating": 4.7
    },
    "images": [
      {
        "id": "uuid",
        "url": "https://cdn.../image1.jpg",
        "alt": "Description",
        "is_primary": true,
        "display_order": 1
      },
      // ... more images
    ],
    "inclusions": [
      {
        "id": "uuid",
        "title": "Luxury Accommodation",
        "description": "5-star hotel...",
        "included": true,
        "icon": "hotel",
        "display_order": 1
      },
      // ... more inclusions
    ],
    "exclusions": [
      {
        "id": "uuid",
        "title": "International Flights",
        "description": "Flights to Lagos...",
        "included": false,
        "display_order": 1
      },
      // ... more exclusions
    ],
    "itinerary": [
      {
        "id": "uuid",
        "day_number": 1,
        "title": "Arrival & Welcome",
        "description": "Day 1 details...",
        "activities": [
          "Airport pickup",
          "Hotel check-in",
          "Welcome dinner"
        ]
      },
      // ... more days
    ],
    "average_rating": 4.8,
    "review_count": 24,
    "view_count": 1523,
    "booking_count": 156,
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-11-01T14:30:00Z"
  },
  "availability": {
    "next_available_date": "2025-12-15",
    "available_dates": [
      {
        "date": "2025-12-15",
        "available_slots": 25,
        "price": 6500
      },
      // ... more dates
    ]
  },
  "similar_packages": [
    {
      "id": "uuid",
      "title": "Detty First-Timer",
      "slug": "detty-first-timer",
      "price": 3500,
      "primary_image": {...}
    },
    // ... 3-4 similar packages
  ]
}

DEPENDENCIES: DDT-201
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-302: Build Package Details Page (Frontend)    │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 13 points | Assignee: Frontend Dev

DESCRIPTION:
Create comprehensive package details page with all
information and booking CTA.

TASKS:
- [ ] Create PackageDetailsPage component

LAYOUT STRUCTURE:
1. HEADER SECTION
   - Breadcrumbs (Home > Packages > [Package Name])
   - Package title (H1)
   - Rating & review count
   - Share buttons (WhatsApp, Facebook, Twitter, Copy Link)
   - Wishlist button (heart icon)

2. IMAGE GALLERY
   - Primary image (large, hero)
   - Thumbnail grid (4-6 images)
   - Click to open lightbox/carousel
   - Swipe support on mobile

3. QUICK INFO SIDEBAR (Sticky on scroll)
   - Price (large, prominent)
   - Duration (X days)
   - Group size (min-max capacity)
   - Category badge
   - "Book Now" button (CTA)
   - Trust badges (Secure payment, 24/7 support, etc.)

4. TABS CONTENT
   TAB: OVERVIEW
   - Full description (rich text)
   - Highlights (bullet points)
   - Meeting point/pickup details

   TAB: WHAT'S INCLUDED
   - Inclusions list (with icons)
   - Exclusions list (with icons)
   - Color coding (green checkmark, red X)

   TAB: ITINERARY
   - Accordion for each day
   - Day number, title, description
   - Activities list
   - Expandable/collapsible

   TAB: REVIEWS
   - Average rating (large)
   - Rating breakdown (5 stars: X%, 4 stars: Y%, etc.)
   - Review list (paginated)
   - "Write a Review" button (if user booked)

5. AVAILABILITY CALENDAR
   - Calendar view (next 3 months)
   - Available dates highlighted
   - Click date to select
   - Show available slots

6. SIMILAR PACKAGES
   - Horizontal scrolling cards
   - 3-4 similar packages
   - "View More" link

IMPLEMENTATION:
- [ ] Use Swiper.js for image gallery
- [ ] Implement tabs with React state
- [ ] Add sticky sidebar (position: sticky)
- [ ] Implement lightbox for images
- [ ] Add breadcrumbs navigation
- [ ] Implement share functionality
- [ ] Add structured data (JSON-LD) for SEO
- [ ] Mobile-responsive design
- [ ] Write component tests

TECH: Next.js, Swiper.js, React Tabs, yet-another-react-lightbox
DEPENDENCIES: DDT-301
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-303: Implement Availability Calendar          │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 8 points | Assignee: Full-Stack Dev

DESCRIPTION:
Create availability calendar showing available dates
and remaining slots.

BACKEND TASKS:
- [ ] Implement GET /api/packages/:id/availability endpoint
- [ ] Calculate available slots per date:
  available_slots = max_capacity - SUM(confirmed_bookings.num_travelers)
- [ ] Support date range query (3 months ahead)
- [ ] Include pricing per date (future: dynamic pricing)
- [ ] Cache availability (5 min TTL)

FRONTEND TASKS:
- [ ] Install and configure react-day-picker or similar
- [ ] Create AvailabilityCalendar component
- [ ] Display 3 months ahead
- [ ] Color code dates:
  - Available: Green
  - Limited (< 10 slots): Yellow
  - Fully booked: Red
  - Past dates: Gray (disabled)
- [ ] Show tooltip on hover (X slots available)
- [ ] Click date to select and proceed to booking
- [ ] Mobile-friendly (swipe between months)
- [ ] Write component tests

DEPENDENCIES: DDT-301
```

---

### **STORY 3.2: Make a Booking**

**As a** registered user
**I want to** book a tour package
**So that** I can secure my spot for the experience

**Acceptance Criteria:**
- [ ] User must be logged in to book
- [ ] Select travel dates from availability calendar
- [ ] Select number of travelers
- [ ] See real-time price calculation
- [ ] Add traveler details (names, DOB, passport)
- [ ] Add special requests/dietary requirements
- [ ] Review booking summary
- [ ] Terms and conditions acceptance required
- [ ] Booking confirmation email sent

**Technical Tasks:**

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-304: Create Booking Database Schema           │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 5 points | Assignee: Backend Dev

DESCRIPTION:
Design and implement database schema for bookings and
related data.

TASKS:
- [ ] Design bookings table schema
- [ ] Design booking_travelers table
- [ ] Design booking_status enum
- [ ] Add database migrations
- [ ] Create indexes for performance
- [ ] Set up foreign key constraints

SCHEMA:

bookings table:
- id (UUID, primary key)
- booking_reference (VARCHAR, unique, indexed)
  - Format: DDT-YYYYMMDD-XXXX (e.g., DDT-20251215-A3F9)
- user_id (UUID, foreign key → users.id, indexed)
- package_id (UUID, foreign key → packages.id, indexed)
- booking_date (DATE, default: current_date)
- travel_date (DATE, indexed)
- num_travelers (INTEGER)
- total_price (DECIMAL)
- status (ENUM, indexed)
  - pending: Initial state after booking created
  - confirmed: After payment successful
  - cancelled: User or admin cancelled
  - completed: After travel date passed
- payment_status (ENUM)
  - awaiting_payment: Initial state
  - paid: Payment successful
  - failed: Payment failed
  - refunded: Payment refunded
- special_requests (TEXT, nullable)
- internal_notes (TEXT, nullable) -- Admin only
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

booking_travelers table:
- id (UUID, primary key)
- booking_id (UUID, foreign key → bookings.id)
- first_name (VARCHAR)
- last_name (VARCHAR)
- date_of_birth (DATE)
- passport_number (VARCHAR, nullable)
- nationality (VARCHAR, nullable)
- dietary_requirements (TEXT, nullable)
- special_needs (TEXT, nullable)
- created_at (TIMESTAMP)

INDEXES:
- bookings: (booking_reference), (user_id, status),
            (package_id, travel_date), (status, travel_date)
- booking_travelers: (booking_id)

DEPENDENCIES: DDT-201, DDT-101
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-305: Implement Booking Creation API           │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 8 points | Assignee: Backend Dev

DESCRIPTION:
Create API endpoint for booking creation with validation
and availability checking.

TASKS:
- [ ] Implement POST /api/bookings endpoint
- [ ] Validate user is authenticated
- [ ] Validate travel date is in the future
- [ ] Check package exists and is published
- [ ] Check availability (available_slots >= num_travelers)
- [ ] Validate num_travelers is within min/max capacity
- [ ] Calculate total price:
  total_price = package.price * num_travelers
  (Future: Add dynamic pricing, discounts)
- [ ] Generate unique booking reference
  Format: DDT-YYYYMMDD-XXXX (random alphanumeric)
- [ ] Create booking record (status: pending)
- [ ] Create booking_travelers records
- [ ] Use database transaction (rollback on error)
- [ ] Send booking confirmation email
- [ ] Write unit tests

API REQUEST:
POST /api/bookings
Headers: { Authorization: "Bearer {token}" }
Body:
{
  "package_id": "uuid",
  "travel_date": "2025-12-20",
  "num_travelers": 2,
  "travelers": [
    {
      "first_name": "John",
      "last_name": "Doe",
      "date_of_birth": "1990-05-15",
      "passport_number": "A12345678",
      "nationality": "US",
      "dietary_requirements": "Vegetarian"
    },
    {
      "first_name": "Jane",
      "last_name": "Doe",
      "date_of_birth": "1992-08-22",
      "passport_number": "A87654321",
      "nationality": "US",
      "dietary_requirements": null
    }
  ],
  "special_requests": "Would like a room on a higher floor",
  "emergency_contact": {
    "name": "Bob Doe",
    "phone": "+1234567890",
    "relationship": "Brother"
  }
}

API RESPONSE:
{
  "booking": {
    "id": "uuid",
    "booking_reference": "DDT-20251108-A3F9",
    "status": "pending",
    "payment_status": "awaiting_payment",
    "total_price": 13000,
    "travel_date": "2025-12-20",
    "num_travelers": 2
  },
  "message": "Booking created successfully. Please proceed to payment."
}

ERROR RESPONSES:
- Package not available: 409 Conflict
- Invalid travel date: 400 Bad Request
- Insufficient capacity: 409 Conflict
- Validation errors: 400 Bad Request

DEPENDENCIES: DDT-304
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-306: Build Booking Flow (Frontend)            │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 13 points | Assignee: Frontend Dev

DESCRIPTION:
Create multi-step booking form with validation and
real-time price calculation.

TASKS:
- [ ] Create BookingPage component (multi-step form)

BOOKING FLOW:

STEP 1: Date & Travelers Selection
- [ ] Display availability calendar
- [ ] Select travel date
- [ ] Input number of travelers (1-10)
- [ ] Show real-time price calculation
  - Base price × travelers
  - Show "Total: $X,XXX"
- [ ] "Continue" button (disabled if date not selected)

STEP 2: Traveler Details
- [ ] Loop through number of travelers
- [ ] For each traveler:
  - First Name (required)
  - Last Name (required)
  - Date of Birth (required, date picker)
  - Passport Number (optional)
  - Nationality (optional, dropdown)
  - Dietary Requirements (optional, textarea)
  - Special Needs (optional, textarea)
- [ ] Autofill first traveler with logged-in user data
- [ ] Add emergency contact:
  - Name (required)
  - Phone (required)
  - Relationship (required)
- [ ] Form validation (Zod schema)
- [ ] "Back" and "Continue" buttons

STEP 3: Special Requests
- [ ] Textarea for special requests
- [ ] Examples/suggestions:
  - "Room preferences"
  - "Mobility considerations"
  - "Celebration (birthday, anniversary)"
- [ ] "Back" and "Continue" buttons

STEP 4: Review & Confirm
- [ ] Display booking summary:
  - Package name and image
  - Travel date
  - Number of travelers
  - Traveler names
  - Price breakdown:
    - Subtotal: $X,XXX
    - Taxes & fees: $XXX (if applicable)
    - Total: $X,XXX
- [ ] Terms & conditions checkbox
  - Link to full T&C page
  - "I agree to the terms and conditions" (required)
- [ ] Cancellation policy
  - Display policy prominently
  - "I understand the cancellation policy" (required)
- [ ] "Back" and "Confirm Booking" buttons

IMPLEMENTATION:
- [ ] Use React Hook Form for all forms
- [ ] Implement form validation (Zod)
- [ ] Add progress indicator (Step 1 of 4, 2 of 4, etc.)
- [ ] Save progress to sessionStorage (prevent data loss)
- [ ] Implement optimistic UI (show loading state)
- [ ] Handle API errors gracefully
- [ ] Redirect to payment page after booking creation
- [ ] Write component tests

PRICE CALCULATION:
- Update price in real-time as user changes travelers
- Show breakdown clearly
- Future: Apply discounts, group rates

TECH: React Hook Form, Zod, date-fns, react-day-picker
DEPENDENCIES: DDT-305, DDT-303
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-307: Implement Booking Confirmation Email     │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 5 points | Assignee: Backend Dev

DESCRIPTION:
Create and send booking confirmation email with all
booking details.

TASKS:
- [ ] Design HTML email template
- [ ] Include booking details:
  - Booking reference (large, prominent)
  - Package name and image
  - Travel date
  - Number of travelers
  - Total price
  - Traveler names
  - Special requests
- [ ] Include next steps:
  - "Complete payment within 24 hours"
  - Payment link (link to payment page)
- [ ] Include contact information
  - Customer support email
  - Customer support phone
- [ ] Include cancellation policy
- [ ] Implement email sending via SendGrid
- [ ] Test email delivery
- [ ] Handle email failures gracefully

EMAIL TEMPLATE:
Subject: Booking Confirmation - {package_name}

[Logo]
Booking Confirmation
Booking Reference: DDT-20251108-A3F9

[Package Image]

Package: Detty VIP Experience
Travel Date: December 20, 2025
Travelers: 2
Total: $13,000

TRAVELERS:
- John Doe
- Jane Doe

NEXT STEPS:
1. Complete payment within 24 hours
   [Complete Payment Button]

2. You'll receive a final confirmation after payment

Need help? Contact us:
Email: support@onedettydecember.com
Phone: +234 XXX XXX XXXX

DEPENDENCIES: DDT-305
```

---

# EPIC 4: Payment Integration

**Epic ID:** DDT-EPIC-04
**Priority:** P0 - Critical
**Estimated Points:** 42 points (3.5 weeks)
**Dependencies:** Epic 3

## Overview

Integrate secure payment processing to enable users to pay for bookings using multiple payment methods. This is critical for revenue generation.

## Business Value

- **Revenue:** Enable monetary transactions
- **Trust:** Secure payment builds customer confidence
- **Global Reach:** Support multiple payment methods and currencies
- **Compliance:** PCI DSS compliant payment processing

## User Stories

---

### **STORY 4.1: Process Payment**

**As a** user with a pending booking
**I want to** pay for my tour package securely
**So that** I can confirm my reservation

**Acceptance Criteria:**
- [ ] Support multiple payment methods (card, bank transfer)
- [ ] Secure payment processing (PCI compliant)
- [ ] Real-time payment status updates
- [ ] Payment confirmation email sent
- [ ] Booking status updated to "confirmed"
- [ ] Receipt/invoice generated
- [ ] Handle payment failures gracefully

**Technical Tasks:**

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-401: Integrate Stripe Payment Gateway         │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 13 points | Assignee: Backend Dev

DESCRIPTION:
Integrate Stripe for secure card payment processing with
webhook handling.

TASKS:
- [ ] Set up Stripe account and API keys
- [ ] Install Stripe SDK (@stripe/stripe-js, stripe npm package)
- [ ] Create payments table schema:

payments table:
- id (UUID, primary key)
- booking_id (UUID, foreign key → bookings.id, indexed)
- amount (DECIMAL)
- currency (VARCHAR, default: 'USD')
- payment_method (ENUM: card, bank_transfer)
- stripe_payment_intent_id (VARCHAR, unique, indexed)
- stripe_charge_id (VARCHAR, nullable)
- status (ENUM: pending, processing, succeeded, failed, refunded)
- error_message (TEXT, nullable)
- metadata (JSONB) -- Store additional payment info
- paid_at (TIMESTAMP, nullable)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

- [ ] Implement POST /api/payments/create-intent endpoint
  - Accept booking_id
  - Validate booking exists and is pending
  - Calculate amount (booking.total_price)
  - Create Stripe PaymentIntent
  - Store payment record (status: pending)
  - Return client_secret for frontend

- [ ] Implement POST /api/payments/confirm endpoint
  - Accept booking_id and payment_intent_id
  - Verify payment_intent status
  - Update payment record
  - Return status

- [ ] Set up Stripe webhook handler (/api/webhooks/stripe)
  - Verify webhook signature
  - Handle events:
    - payment_intent.succeeded
    - payment_intent.payment_failed
    - charge.refunded
  - Update payment status
  - Update booking status
  - Send confirmation emails
  - Log all events

- [ ] Implement refund functionality
  - POST /api/payments/:id/refund
  - Create Stripe refund
  - Update payment status
  - Update booking status
  - Send refund confirmation email

- [ ] Add comprehensive error handling
- [ ] Write unit tests
- [ ] Write webhook tests

STRIPE PAYMENT INTENT:
- Supports 3D Secure authentication
- Handles Strong Customer Authentication (SCA)
- Automatic payment method confirmation

WEBHOOK EVENTS TO HANDLE:
- payment_intent.succeeded → Update booking to confirmed
- payment_intent.failed → Notify user, keep booking pending
- charge.refunded → Update booking to cancelled

DEPENDENCIES: DDT-304, DDT-305
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-402: Build Payment Page (Frontend)            │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 8 points | Assignee: Frontend Dev

DESCRIPTION:
Create payment page with Stripe Elements for secure
card input.

TASKS:
- [ ] Create PaymentPage component
- [ ] Install @stripe/stripe-js and @stripe/react-stripe-js
- [ ] Initialize Stripe with publishable key
- [ ] Wrap payment form with Elements provider

LAYOUT:
1. LEFT SIDE: Booking Summary
   - Package name and image
   - Travel date
   - Number of travelers
   - Price breakdown:
     - Subtotal
     - Taxes & fees
     - Total (large, prominent)
   - Traveler names

2. RIGHT SIDE: Payment Form
   - Payment method selector
     - Credit/Debit Card (default, Stripe)
     - Bank Transfer (Paystack, if in Nigeria)

   CARD PAYMENT (Stripe Elements):
   - CardElement (handles card number, expiry, CVC)
   - Cardholder name input
   - Billing address (optional)
   - "Pay ${total}" button

   BANK TRANSFER:
   - Redirect to Paystack

- [ ] Implement payment submission:
  - Call create-intent API
  - Confirm payment with Stripe.js
  - Handle 3D Secure authentication
  - Show payment processing state
  - Handle success (redirect to confirmation)
  - Handle errors (show error message)

- [ ] Add security badges:
  - "Secure Payment" icon
  - "SSL Encrypted" badge
  - Accepted card logos (Visa, Mastercard, Amex)

- [ ] Implement payment loading states:
  - "Processing payment..."
  - Disable submit button
  - Show spinner

- [ ] Handle errors:
  - Card declined
  - Insufficient funds
  - Invalid card
  - Network errors
  - Display user-friendly error messages

- [ ] Add "Money-back guarantee" badge
- [ ] Mobile-responsive design
- [ ] Write component tests

STRIPE ELEMENTS CUSTOMIZATION:
- Match brand colors
- Custom fonts
- Input styling
- Error styling

TECH: React, Stripe.js, Stripe Elements
DEPENDENCIES: DDT-401
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-403: Integrate Paystack (Nigerian Payments)   │
└─────────────────────────────────────────────────────────┘

Priority: P1 | Estimate: 13 points | Assignee: Backend Dev

DESCRIPTION:
Integrate Paystack as alternative payment gateway for
Nigerian users paying in Naira.

TASKS:
- [ ] Set up Paystack account
- [ ] Install Paystack SDK
- [ ] Add paystack_reference to payments table

- [ ] Implement POST /api/payments/paystack/initialize
  - Accept booking_id
  - Calculate amount in NGN (USD * exchange_rate)
  - Initialize Paystack transaction
  - Store payment record
  - Return authorization_url for redirect

- [ ] Implement GET /api/payments/paystack/callback
  - Handle Paystack callback
  - Verify transaction
  - Update payment status
  - Redirect to confirmation page

- [ ] Set up Paystack webhook (/api/webhooks/paystack)
  - Verify webhook signature
  - Handle charge.success event
  - Update payment and booking status
  - Send confirmation email

- [ ] Add currency conversion logic:
  - Fetch USD to NGN rate (from API or fixed rate)
  - Store both USD and NGN amounts
  - Display appropriate currency to user

- [ ] Test with Paystack test cards
- [ ] Write unit tests

PAYSTACK FLOW:
1. User selects "Bank Transfer" payment method
2. Backend initializes Paystack transaction
3. User redirected to Paystack page
4. User completes payment
5. Paystack redirects back to callback URL
6. Webhook confirms payment
7. Booking confirmed

DEPENDENCIES: DDT-401
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-404: Implement Payment Confirmation           │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 5 points | Assignee: Full-Stack Dev

DESCRIPTION:
Create payment confirmation page and email notification.

BACKEND TASKS:
- [ ] Implement GET /api/bookings/:id/invoice endpoint
  - Generate invoice PDF
  - Include all booking and payment details
  - Return PDF file

- [ ] Send payment confirmation email
  - Booking confirmed
  - Payment receipt
  - Invoice attached
  - Booking details
  - Next steps (what to expect)

FRONTEND TASKS:
- [ ] Create PaymentSuccessPage component
  - "Payment Successful!" message
  - Booking reference (large)
  - Checkmark animation
  - Booking summary
  - "Download Invoice" button
  - "View Booking" button
  - "Book Another Trip" button

- [ ] Create PaymentFailedPage component
  - "Payment Failed" message
  - Error message
  - "Try Again" button
  - Alternative payment methods
  - Contact support link

- [ ] Write component tests

EMAIL TEMPLATE:
Subject: Payment Confirmed - {package_name}

[Logo]
Payment Successful!

Your booking is confirmed!
Booking Reference: DDT-20251108-A3F9

[Package Image]

Package: Detty VIP Experience
Travel Date: December 20, 2025
Amount Paid: $13,000

WHAT'S NEXT?
1. Check your email for your invoice (attached)
2. We'll send you trip details 7 days before departure
3. Contact us if you have any questions

[View Booking Button]

Need help? Contact us:
Email: support@onedettydecember.com

DEPENDENCIES: DDT-401
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-405: Implement Payment Retry Logic            │
└─────────────────────────────────────────────────────────┘

Priority: P1 | Estimate: 5 points | Assignee: Full-Stack Dev

DESCRIPTION:
Allow users to retry failed payments and implement
payment expiration.

BACKEND TASKS:
- [ ] Add payment_deadline to bookings table
  - Set to 24 hours after booking creation
  - Bookings expire if not paid by deadline

- [ ] Create cron job to expire unpaid bookings
  - Run every hour
  - Find bookings where:
    - status = 'pending'
    - payment_deadline < now()
  - Update status to 'expired'
  - Send expiration notification email

- [ ] Allow payment retry for expired bookings
  - Extend payment_deadline by 24 hours
  - Send reminder email

FRONTEND TASKS:
- [ ] Add countdown timer on payment page
  - "Complete payment within XX:XX:XX"
  - Red when < 1 hour remaining

- [ ] Create PaymentExpiredPage
  - "Your booking has expired"
  - "Request extension" button
  - "Book again" button

- [ ] Add retry payment button on booking details

DEPENDENCIES: DDT-401
```

---

# EPIC 5: Reviews & Ratings System

**Epic ID:** DDT-EPIC-05
**Priority:** P1 - High
**Estimated Points:** 31 points (2.5 weeks)
**Dependencies:** Epic 3, Epic 4

## Overview

Enable users to leave reviews and ratings for packages they've booked, building trust and social proof for the platform.

## Business Value

- **Social Proof:** Reviews build trust with potential customers
- **Quality Control:** Identify and address issues with packages
- **SEO:** User-generated content improves search rankings
- **Conversion:** 88% of consumers trust online reviews

## User Stories

---

### **STORY 5.1: Submit Review**

**As a** user who completed a tour
**I want to** leave a review and rating
**So that** I can share my experience with others

**Acceptance Criteria:**
- [ ] Only users who completed a tour can review
- [ ] Rate overall experience (1-5 stars)
- [ ] Rate specific aspects (guide, accommodation, value, etc.)
- [ ] Write detailed review (min 50 chars)
- [ ] Upload photos from the experience
- [ ] One review per booking
- [ ] Edit review within 7 days

**Technical Tasks:**

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-601: Create Reviews Database Schema           │
└─────────────────────────────────────────────────────────┘

Priority: P1 | Estimate: 5 points | Assignee: Backend Dev

DESCRIPTION:
Design database schema for reviews with support for
multiple rating categories and images.

TASKS:
- [ ] Design reviews table
- [ ] Design review_images table
- [ ] Design review_ratings table
- [ ] Add database migrations
- [ ] Create indexes
- [ ] Add unique constraint (user + booking)

SCHEMA:

reviews table:
- id (UUID, primary key)
- user_id (UUID, foreign key → users.id, indexed)
- package_id (UUID, foreign key → packages.id, indexed)
- booking_id (UUID, foreign key → bookings.id, unique)
- overall_rating (INTEGER, 1-5)
- review_text (TEXT)
- status (ENUM: pending, approved, rejected, flagged)
  - pending: Awaiting moderation (default)
  - approved: Published
  - rejected: Rejected by moderator
  - flagged: Flagged for review
- verified_purchase (BOOLEAN, default: true)
- helpful_count (INTEGER, default: 0) -- "Helpful" votes
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

review_ratings table:
- id (UUID, primary key)
- review_id (UUID, foreign key → reviews.id)
- category (ENUM)
  - guide
  - accommodation
  - food
  - transportation
  - value_for_money
  - activities
- rating (INTEGER, 1-5)
- created_at (TIMESTAMP)

review_images table:
- id (UUID, primary key)
- review_id (UUID, foreign key → reviews.id)
- image_url (VARCHAR)
- caption (VARCHAR, nullable)
- display_order (INTEGER)
- created_at (TIMESTAMP)

CONSTRAINTS:
- UNIQUE(user_id, booking_id) -- One review per booking
- CHECK(overall_rating >= 1 AND overall_rating <= 5)
- CHECK(rating >= 1 AND rating <= 5)

INDEXES:
- reviews: (package_id, status), (user_id), (booking_id)
- review_ratings: (review_id, category)
- review_images: (review_id, display_order)

DEPENDENCIES: DDT-304
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-602: Implement Reviews API                    │
└─────────────────────────────────────────────────────────┘

Priority: P1 | Estimate: 8 points | Assignee: Backend Dev

DESCRIPTION:
Create API endpoints for review submission, editing,
and retrieval.

TASKS:
- [ ] Implement POST /api/reviews endpoint
  - Validate user is authenticated
  - Validate user completed the tour (booking.status = completed)
  - Validate no existing review for this booking
  - Validate review_text length (min 50 chars, max 2000)
  - Validate overall_rating (1-5)
  - Validate category ratings (1-5)
  - Create review record (status: pending)
  - Create review_ratings records
  - Upload and store images (max 5)
  - Calculate and update package average_rating
  - Send notification to admin for moderation
  - Send thank you email to reviewer

- [ ] Implement PATCH /api/reviews/:id endpoint
  - Validate user owns review
  - Validate review created within 7 days
  - Allow editing text and ratings
  - Update timestamp

- [ ] Implement GET /api/packages/:id/reviews endpoint
  - List all approved reviews for package
  - Include user info (name, avatar)
  - Include review ratings
  - Include review images
  - Pagination (10 per page)
  - Sorting (newest, highest rated, lowest rated, most helpful)

- [ ] Implement POST /api/reviews/:id/helpful endpoint
  - Mark review as helpful
  - Increment helpful_count
  - Track users who marked helpful (prevent duplicates)

- [ ] Write unit tests

API REQUEST (Create):
POST /api/reviews
Headers: { Authorization: "Bearer {token}" }
Body:
{
  "booking_id": "uuid",
  "overall_rating": 5,
  "review_text": "Amazing experience! The tour guide was knowledgeable...",
  "ratings": {
    "guide": 5,
    "accommodation": 4,
    "food": 5,
    "transportation": 4,
    "value_for_money": 5,
    "activities": 5
  },
  "images": [
    "data:image/jpeg;base64,..." // Or upload separately
  ]
}

API RESPONSE:
{
  "review": {
    "id": "uuid",
    "overall_rating": 5,
    "status": "pending",
    "created_at": "2025-11-08T10:00:00Z"
  },
  "message": "Thank you for your review! It will be published after moderation."
}

DEPENDENCIES: DDT-601
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-603: Build Review Submission Form             │
└─────────────────────────────────────────────────────────┘

Priority: P1 | Estimate: 8 points | Assignee: Frontend Dev

DESCRIPTION:
Create review submission form with star ratings and
image upload.

TASKS:
- [ ] Create ReviewForm component
- [ ] Implement overall star rating input
  - Large, prominent 5-star selector
  - Hover effects
  - Click to select

- [ ] Implement category ratings:
  - Guide (5 stars)
  - Accommodation (5 stars)
  - Food (5 stars)
  - Transportation (5 stars)
  - Value for Money (5 stars)
  - Activities (5 stars)

- [ ] Add review text area:
  - Rich text editor (optional: bold, italic, lists)
  - Character counter (min 50, max 2000)
  - Placeholder with examples

- [ ] Implement image upload:
  - Drag and drop
  - Click to upload
  - Max 5 images
  - Image preview
  - Remove uploaded image
  - Compress images before upload

- [ ] Add form validation (Zod):
  - Overall rating required
  - Review text min 50 chars
  - All category ratings required

- [ ] Implement submission:
  - Show loading state
  - Handle success (show thank you message)
  - Handle errors

- [ ] Add "Review Guidelines":
  - Be honest and constructive
  - No offensive language
  - Focus on your experience

- [ ] Write component tests

UI MOCKUP:
[Overall Rating]
★★★★★

How would you rate:
Guide:           ★★★★★
Accommodation:   ★★★★☆
Food:            ★★★★★
...

[Text Area]
Share your experience... (min 50 characters)
Characters: 0 / 2000

[Image Upload]
Drag photos here or click to upload (max 5)
[Preview | Preview | Preview]

[Submit Review Button]

TECH: React Hook Form, Zod, react-dropzone, TipTap (rich text)
DEPENDENCIES: DDT-602
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-604: Display Reviews on Package Page          │
└─────────────────────────────────────────────────────────┘

Priority: P1 | Estimate: 5 points | Assignee: Frontend Dev

DESCRIPTION:
Display reviews on package details page with ratings
breakdown and filtering.

TASKS:
- [ ] Create ReviewsList component
- [ ] Display average rating (large, prominent)
  - 4.8 out of 5
  - Star visualization
  - Total review count

- [ ] Show rating breakdown:
  5 stars: [████████░░] 65% (23 reviews)
  4 stars: [████░░░░░░] 25% (9 reviews)
  3 stars: [██░░░░░░░░] 8% (3 reviews)
  2 stars: [░░░░░░░░░░] 2% (1 review)
  1 star:  [░░░░░░░░░░] 0% (0 reviews)

- [ ] Display individual reviews:
  - Reviewer name and avatar
  - Verified purchase badge
  - Overall rating (stars)
  - Review date (relative: "2 weeks ago")
  - Review text
  - Review images (gallery)
  - Category ratings (expandable)
  - "Helpful" button (X people found this helpful)

- [ ] Implement sorting:
  - Most recent
  - Highest rated
  - Lowest rated
  - Most helpful

- [ ] Implement pagination:
  - "Load More" button
  - Show 5 reviews initially

- [ ] Add "Write a Review" button:
  - Only show if user has completed booking
  - Prominent placement

- [ ] Empty state:
  - "No reviews yet. Be the first to review!"

- [ ] Write component tests

DEPENDENCIES: DDT-602
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-605: Calculate and Update Package Ratings     │
└─────────────────────────────────────────────────────────┘

Priority: P1 | Estimate: 3 points | Assignee: Backend Dev

DESCRIPTION:
Implement logic to calculate and update package average
ratings when reviews are added/updated.

TASKS:
- [ ] Add average_rating column to packages table
- [ ] Add review_count column to packages table

- [ ] Create function to calculate average rating:
  - Query all approved reviews for package
  - Calculate average of overall_rating
  - Round to 1 decimal place

- [ ] Update package rating when:
  - New review approved
  - Review status changed to approved
  - Review deleted
  - Review edited

- [ ] Create database trigger (or application logic):
  - After review INSERT/UPDATE/DELETE
  - Recalculate package average_rating
  - Update packages table

- [ ] Create cron job to recalculate all ratings daily
  - Ensures data consistency
  - Fixes any discrepancies

- [ ] Write unit tests

CALCULATION:
average_rating = ROUND(SUM(overall_rating) / COUNT(*), 1)
WHERE package_id = X AND status = 'approved'

DEPENDENCIES: DDT-601, DDT-602
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-606: Implement Review Moderation              │
└─────────────────────────────────────────────────────────┘

Priority: P1 | Estimate: 5 points | Assignee: Backend Dev

DESCRIPTION:
Implement review moderation system with profanity filter
and admin approval.

TASKS:
- [ ] Install profanity filter library (bad-words npm)
- [ ] Implement profanity check on review submission:
  - Check review_text for profanity
  - If found, auto-flag review (status: flagged)
  - Send notification to admin

- [ ] Create admin endpoints:
  - GET /api/admin/reviews/pending
  - PATCH /api/admin/reviews/:id/approve
  - PATCH /api/admin/reviews/:id/reject
  - PATCH /api/admin/reviews/:id/flag

- [ ] Send notifications:
  - To admin when new review submitted
  - To user when review approved
  - To user when review rejected (with reason)

- [ ] Add moderation notes:
  - Admin can add internal notes
  - Track who moderated review

- [ ] Write unit tests

AUTO-FLAG CONDITIONS:
- Contains profanity
- Rating extremely low (1 star) with short text
- Duplicate content detected
- Excessive capitalization

DEPENDENCIES: DDT-602
```

---

# EPIC 6: User Profile & Account Management

**Epic ID:** DDT-EPIC-06
**Priority:** P1 - High
**Estimated Points:** 26 points (2 weeks)
**Dependencies:** Epic 1, Epic 3

## Overview

Enable users to manage their profiles, view booking history, and update account settings.

## Business Value

- **Retention:** Easy profile management keeps users engaged
- **Data Quality:** Users keep their information up to date
- **Self-Service:** Reduce support burden
- **Personalization:** Better data enables better recommendations

## User Stories

---

### **STORY 6.1: Manage Profile**

**As a** registered user
**I want to** update my profile information
**So that** my account details are current

**Acceptance Criteria:**
- [ ] View current profile information
- [ ] Update name, email, phone
- [ ] Upload profile photo
- [ ] Update password
- [ ] Set communication preferences
- [ ] View booking history
- [ ] Download past invoices

**Technical Tasks:**

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-701: Implement Profile Management API         │
└─────────────────────────────────────────────────────────┘

Priority: P1 | Estimate: 5 points | Assignee: Backend Dev

DESCRIPTION:
Create API endpoints for user profile viewing and editing.

TASKS:
- [ ] Implement GET /api/users/profile endpoint
  - Return current user profile
  - Include statistics:
    - Total bookings
    - Total spent
    - Member since
    - Reviews written

- [ ] Implement PATCH /api/users/profile endpoint
  - Update first_name, last_name, phone
  - Validate phone format
  - Return updated profile

- [ ] Implement PATCH /api/users/email endpoint
  - Update email address
  - Send verification email to new address
  - Require email verification before change takes effect
  - Update email_verified to false

- [ ] Implement POST /api/users/change-password endpoint
  - Require current password
  - Validate new password strength
  - Hash and update password
  - Invalidate all refresh tokens (force re-login)
  - Send password change confirmation email

- [ ] Implement POST /api/users/upload-photo endpoint
  - Accept image file (FormData)
  - Validate image (type, size < 5MB)
  - Upload to S3/Cloudinary
  - Resize and optimize (200x200px)
  - Update profile_photo_url
  - Delete old photo

- [ ] Add rate limiting on profile updates
- [ ] Write unit tests

DEPENDENCIES: DDT-101
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-702: Build Profile Page (Frontend)            │
└─────────────────────────────────────────────────────────┘

Priority: P1 | Estimate: 8 points | Assignee: Frontend Dev

DESCRIPTION:
Create user profile page with tabs for different sections.

TASKS:
- [ ] Create ProfilePage component with tab navigation

TAB 1: PERSONAL INFO
- [ ] Display current profile information
- [ ] Editable fields:
  - Profile photo (upload/change)
  - First name
  - Last name
  - Email (with verification status)
  - Phone
- [ ] "Save Changes" button
- [ ] Success/error notifications

TAB 2: SECURITY
- [ ] Change password form:
  - Current password (required)
  - New password (with strength indicator)
  - Confirm new password
- [ ] "Update Password" button
- [ ] Success notification

TAB 3: PREFERENCES
- [ ] Communication preferences:
  - Email notifications (toggle)
  - SMS notifications (toggle)
  - Marketing emails (toggle)
- [ ] Language preference (dropdown)
- [ ] Currency preference (dropdown)
- [ ] "Save Preferences" button

TAB 4: BOOKINGS (see DDT-703)

TAB 5: REVIEWS
- [ ] List user's reviews
- [ ] Click to view package
- [ ] Edit review (if within 7 days)

- [ ] Implement form validation
- [ ] Add profile photo upload:
  - Drag and drop or click
  - Preview before upload
  - Crop tool (square crop)
- [ ] Add loading states
- [ ] Write component tests

TECH: React, React Hook Form, react-dropzone, react-easy-crop
DEPENDENCIES: DDT-701
```

---

### **STORY 6.2: Manage Bookings**

**As a** registered user
**I want to** view and manage my bookings
**So that** I can track my upcoming trips

**Acceptance Criteria:**
- [ ] View all bookings (upcoming, past, cancelled)
- [ ] Filter by status and date
- [ ] View booking details
- [ ] Download booking confirmation PDF
- [ ] Download invoice
- [ ] Request cancellation
- [ ] Contact support about booking

**Technical Tasks:**

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-703: Implement User Bookings API              │
└─────────────────────────────────────────────────────────┘

Priority: P1 | Estimate: 5 points | Assignee: Backend Dev

DESCRIPTION:
Create API endpoints for users to view and manage their
bookings.

TASKS:
- [ ] Implement GET /api/users/bookings endpoint
  - List all bookings for current user
  - Filter by status (upcoming, past, cancelled, all)
  - Filter by date range
  - Include package details
  - Include payment information
  - Sort by travel_date desc
  - Pagination (10 per page)

- [ ] Implement GET /api/users/bookings/:id endpoint
  - Full booking details
  - Package information
  - Traveler details
  - Payment history
  - Invoice link

- [ ] Implement POST /api/users/bookings/:id/cancel endpoint
  - Validate booking can be cancelled
  - Calculate refund amount based on cancellation policy:
    - >30 days: 100% refund
    - 15-30 days: 50% refund
    - <15 days: No refund
  - Update booking status to cancelled
  - Initiate refund
  - Send cancellation email

- [ ] Implement GET /api/users/bookings/:id/invoice endpoint
  - Generate invoice PDF
  - Include booking details
  - Include payment details
  - Return PDF file

- [ ] Write unit tests

API REQUEST:
GET /api/users/bookings?status=upcoming&page=1&per_page=10

API RESPONSE:
{
  "bookings": [
    {
      "id": "uuid",
      "booking_reference": "DDT-20251108-A3F9",
      "package": {
        "id": "uuid",
        "title": "Detty VIP Experience",
        "slug": "detty-vip-experience",
        "primary_image": {...}
      },
      "travel_date": "2025-12-20",
      "num_travelers": 2,
      "total_price": 13000,
      "status": "confirmed",
      "payment_status": "paid",
      "created_at": "2025-11-08T10:00:00Z"
    },
    // ...
  ],
  "pagination": {
    "page": 1,
    "per_page": 10,
    "total_count": 5,
    "total_pages": 1
  }
}

DEPENDENCIES: DDT-304, DDT-401
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-704: Build Bookings Management Page           │
└─────────────────────────────────────────────────────────┘

Priority: P1 | Estimate: 8 points | Assignee: Frontend Dev

DESCRIPTION:
Create booking management interface with list and detail
views.

TASKS:
- [ ] Create BookingsPage component
- [ ] Display bookings in cards or list:
  - Package image
  - Package title
  - Travel date
  - Booking reference
  - Status badge (upcoming, completed, cancelled)
  - Total price
  - "View Details" button

- [ ] Add filter tabs:
  - All Bookings
  - Upcoming
  - Past
  - Cancelled

- [ ] Add sort options:
  - Travel date (newest first)
  - Travel date (oldest first)
  - Booking date

- [ ] Create BookingDetails modal/page:
  - Full booking information
  - Package details
  - Traveler details
  - Payment information
  - Timeline/status history
  - Actions:
    - Download confirmation PDF
    - Download invoice
    - Cancel booking (if eligible)
    - Contact support

- [ ] Create CancelBookingModal:
  - Show cancellation policy
  - Calculate refund amount
  - Reason for cancellation (textarea)
  - Confirm cancellation
  - Show success message

- [ ] Empty states:
  - "No bookings yet"
  - "No upcoming trips"
  - CTA to browse packages

- [ ] Write component tests

STATUS BADGES:
- Upcoming: Blue
- Completed: Green
- Cancelled: Red
- Pending Payment: Yellow

DEPENDENCIES: DDT-703
```

---

# EPIC 7: Wishlist & Favorites

**Epic ID:** DDT-EPIC-07
**Priority:** P2 - Medium
**Estimated Points:** 16 points (1.5 weeks)
**Dependencies:** Epic 2

## Overview

Enable users to save packages to a wishlist for future reference and booking.

## Business Value

- **Conversion:** Users can save packages and return later to book
- **Engagement:** Wishlist keeps users engaged with the platform
- **Marketing:** Target users with wishlisted packages
- **Intent Signals:** High-intent users for remarketing

## User Stories

---

### **STORY 7.1: Save Packages to Wishlist**

**As a** user (logged in or guest)
**I want to** save packages to my wishlist
**So that** I can easily find them later

**Acceptance Criteria:**
- [ ] Add/remove packages from wishlist
- [ ] Wishlist persists across sessions (logged in users)
- [ ] Wishlist stored in localStorage (guests)
- [ ] View all wishlisted packages
- [ ] Receive notification if wishlisted package goes on sale
- [ ] Share wishlist via link

**Technical Tasks:**

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-801: Create Wishlist Database Schema          │
└─────────────────────────────────────────────────────────┘

Priority: P2 | Estimate: 3 points | Assignee: Backend Dev

DESCRIPTION:
Create database schema for user wishlists.

TASKS:
- [ ] Design wishlists table
- [ ] Add unique constraint
- [ ] Create database indexes
- [ ] Add migration

SCHEMA:

wishlists table:
- id (UUID, primary key)
- user_id (UUID, foreign key → users.id, indexed)
- package_id (UUID, foreign key → packages.id, indexed)
- created_at (TIMESTAMP)

CONSTRAINTS:
- UNIQUE(user_id, package_id) -- One entry per user per package

INDEXES:
- wishlists: (user_id), (user_id, package_id)

DEPENDENCIES: DDT-101, DDT-201
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-802: Implement Wishlist API                   │
└─────────────────────────────────────────────────────────┘

Priority: P2 | Estimate: 5 points | Assignee: Backend Dev

DESCRIPTION:
Create API endpoints for wishlist operations.

TASKS:
- [ ] Implement POST /api/wishlist endpoint (add)
  - Validate user authenticated
  - Validate package exists
  - Add to wishlist (ignore if duplicate)
  - Return success

- [ ] Implement DELETE /api/wishlist/:packageId endpoint (remove)
  - Validate user authenticated
  - Remove from wishlist
  - Return success

- [ ] Implement GET /api/wishlist endpoint (list)
  - Return all wishlisted packages
  - Include full package details
  - Sort by created_at desc

- [ ] Implement POST /api/wishlist/toggle endpoint
  - Add if not in wishlist
  - Remove if in wishlist
  - Return new state (added/removed)
  - Most useful for frontend

- [ ] Write unit tests

API REQUEST (Add):
POST /api/wishlist
Headers: { Authorization: "Bearer {token}" }
Body: { "package_id": "uuid" }

API RESPONSE:
{
  "message": "Package added to wishlist",
  "wishlist_count": 5
}

API REQUEST (Toggle):
POST /api/wishlist/toggle
Body: { "package_id": "uuid" }

API RESPONSE:
{
  "action": "added", // or "removed"
  "wishlist_count": 6
}

DEPENDENCIES: DDT-801
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-803: Build Wishlist Functionality (Frontend)  │
└─────────────────────────────────────────────────────────┘

Priority: P2 | Estimate: 8 points | Assignee: Frontend Dev

DESCRIPTION:
Implement wishlist features across the application with
localStorage fallback for guests.

TASKS:
- [ ] Add wishlist heart icon to package cards
  - Outline heart: Not in wishlist
  - Filled heart: In wishlist
  - Hover effect
  - Click to toggle

- [ ] Implement optimistic UI updates:
  - Update UI immediately on click
  - Revert if API call fails

- [ ] Store wishlist state:
  - Logged in: Use API (source of truth)
  - Guest: Use localStorage
  - Sync localStorage to API on login

- [ ] Create WishlistPage component:
  - Grid of wishlisted packages
  - Use PackageCard component
  - Remove from wishlist button
  - "Move to booking" CTA
  - Empty state: "No items in wishlist"
  - Share wishlist button

- [ ] Implement wishlist count badge:
  - Show count in header
  - Update on add/remove

- [ ] Guest experience:
  - Save to localStorage
  - Prompt to login: "Login to save your wishlist"
  - Migrate localStorage to database on login

- [ ] Implement "Share Wishlist" functionality:
  - Generate shareable link
  - Copy to clipboard
  - Share via WhatsApp, Email

- [ ] Write component tests

IMPLEMENTATION:
const [wishlist, setWishlist] = useState([])
const isInWishlist = wishlist.includes(packageId)

const toggleWishlist = async (packageId) => {
  // Optimistic update
  setWishlist(prev =>
    prev.includes(packageId)
      ? prev.filter(id => id !== packageId)
      : [...prev, packageId]
  )

  try {
    await api.post('/wishlist/toggle', { package_id: packageId })
  } catch (error) {
    // Revert on error
    setWishlist(prev => ...)
  }
}

DEPENDENCIES: DDT-802
```

---

# EPIC 8: Email Notifications & Communication

**Epic ID:** DDT-EPIC-08
**Priority:** P0 - Critical
**Estimated Points:** 21 points (2 weeks)
**Dependencies:** Epic 1, Epic 3, Epic 4

## Overview

Implement comprehensive email notification system to keep users informed about bookings, payments, and platform updates.

## Business Value

- **Engagement:** Keep users informed and engaged
- **Support:** Reduce support tickets through proactive communication
- **Conversion:** Abandoned cart emails, reminders
- **Trust:** Timely notifications build confidence

## User Stories

---

### **STORY 8.1: Transactional Emails**

**As a** user
**I want to** receive email notifications for important actions
**So that** I stay informed about my bookings

**Acceptance Criteria:**
- [ ] Welcome email on registration
- [ ] Email verification email
- [ ] Booking confirmation email
- [ ] Payment confirmation email
- [ ] Booking reminder (7 days before)
- [ ] Post-trip review request
- [ ] Cancellation confirmation

**Technical Tasks:**

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-901: Set Up Email Infrastructure              │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 8 points | Assignee: Backend Dev

DESCRIPTION:
Set up email infrastructure with SendGrid and create
reusable email service.

TASKS:
- [ ] Set up SendGrid account and API key
- [ ] Install SendGrid SDK (@sendgrid/mail)
- [ ] Create email service layer (src/services/email.js)
- [ ] Design HTML email templates:
  - welcome.html
  - verify-email.html
  - booking-confirmation.html
  - payment-confirmation.html
  - booking-reminder.html
  - review-request.html
  - cancellation.html

- [ ] Create EmailQueue table for async processing:
  Schema:
  - id (UUID)
  - template (VARCHAR)
  - recipient_email (VARCHAR)
  - subject (VARCHAR)
  - data (JSONB) -- Template variables
  - status (ENUM: pending, sent, failed)
  - error_message (TEXT, nullable)
  - sent_at (TIMESTAMP, nullable)
  - created_at (TIMESTAMP)

- [ ] Implement email sending worker using Bull/BullMQ:
  - Process email queue asynchronously
  - Retry failed emails (max 3 attempts)
  - Log all email events

- [ ] Add email logging to database:
  - Track opens (SendGrid webhook)
  - Track clicks (SendGrid webhook)
  - Track bounces and spam reports

- [ ] Implement unsubscribe functionality:
  - Add unsubscribe link to all emails
  - Update user preferences on unsubscribe

- [ ] Test email delivery (use SendGrid test mode)
- [ ] Write unit tests

EMAIL TEMPLATES:
Use Handlebars for templating
Include:
- Responsive HTML design
- Inline CSS (for email client compatibility)
- Plain text alternative
- Unsubscribe link
- Company branding (logo, colors)
- Social media links

DEPENDENCIES: None
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-902: Implement Email Notification Triggers    │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 5 points | Assignee: Backend Dev

DESCRIPTION:
Implement email triggers for all user actions.

TASKS:
- [ ] Send welcome email on registration
  - Trigger: User created
  - Template: welcome.html
  - Data: first_name, login_link

- [ ] Send verification email on signup
  - Trigger: User created
  - Template: verify-email.html
  - Data: verification_link, first_name

- [ ] Send booking confirmation on booking creation
  - Trigger: Booking created
  - Template: booking-confirmation.html
  - Data: booking details, payment_link

- [ ] Send payment confirmation on payment success
  - Trigger: Payment succeeded (webhook)
  - Template: payment-confirmation.html
  - Data: booking details, invoice_link

- [ ] Set up cron job for booking reminders:
  - Run daily at 9 AM
  - Find bookings where travel_date = 7 days from now
  - Send reminder email
  - Template: booking-reminder.html

- [ ] Set up cron job for review requests:
  - Run daily at 10 AM
  - Find bookings where:
    - status = completed
    - travel_date was 3 days ago
    - No review submitted
  - Send review request email
  - Template: review-request.html

- [ ] Send cancellation email on booking cancellation
  - Trigger: Booking cancelled
  - Template: cancellation.html
  - Data: booking details, refund_amount

- [ ] Add email preferences check:
  - Check user.email_notifications_enabled
  - Don't send if user opted out
  - Always send transactional emails (booking, payment)
  - Respect opt-out for marketing emails

- [ ] Write unit tests

DEPENDENCIES: DDT-901
```

---

### **STORY 8.2: Marketing Emails**

**As a** marketing manager
**I want to** send promotional emails to users
**So that** I can drive bookings and engagement

**Acceptance Criteria:**
- [ ] Segment users by preferences
- [ ] Create email campaigns
- [ ] Schedule email sends
- [ ] Track open and click rates
- [ ] A/B test subject lines
- [ ] Respect unsubscribe preferences

**Technical Tasks:**

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-903: Integrate Mailchimp/Customer.io          │
└─────────────────────────────────────────────────────────┘

Priority: P2 | Estimate: 8 points | Assignee: Backend Dev

DESCRIPTION:
Integrate email marketing platform for campaigns and
automation.

TASKS:
OPTION 1: Mailchimp
- [ ] Set up Mailchimp account
- [ ] Install Mailchimp API client
- [ ] Sync user data to Mailchimp
- [ ] Create audience segments:
  - All users
  - Booked users
  - Wishlist users
  - Past travelers
  - High-value customers (>$10K spent)
- [ ] Implement webhook handlers for Mailchimp events
- [ ] Track campaign performance

OPTION 2: Customer.io (Recommended for SaaS)
- [ ] Set up Customer.io account
- [ ] Install Customer.io SDK
- [ ] Track user events:
  - User registered
  - Package viewed
  - Package wishlisted
  - Booking created
  - Payment completed
- [ ] Create segments based on behavior
- [ ] Set up automated campaigns:
  - Abandoned cart (booking not completed)
  - Win-back (inactive for 90 days)
  - Cross-sell (book similar packages)
- [ ] Implement A/B testing

- [ ] Add user to appropriate list on registration
- [ ] Update user attributes on profile change
- [ ] Remove user on account deletion
- [ ] Track email campaign metrics
- [ ] Write unit tests

SEGMENTS:
- All Users
- Registered but not booked
- Booked once
- Repeat customers
- High-value customers
- Inactive users (>90 days)

AUTOMATED CAMPAIGNS:
- Welcome series (3 emails over 7 days)
- Abandoned booking (1 hour, 24 hours, 7 days)
- Win-back (after 90 days inactive)
- Post-trip follow-up
- Birthday/special occasion

DEPENDENCIES: DDT-901
```

---

# EPIC 9: Analytics & Tracking

**Epic ID:** DDT-EPIC-09
**Priority:** P1 - High
**Estimated Points:** 18 points (1.5 weeks)
**Dependencies:** None (can run parallel)

## Overview

Implement analytics tracking to understand user behavior and optimize conversion.

## Business Value

- **Insights:** Understand how users interact with platform
- **Optimization:** Data-driven decisions to improve conversion
- **Marketing ROI:** Track campaign performance
- **Product Development:** Identify features users love/hate

## User Stories

---

### **STORY 9.1: Track User Behavior**

**As a** product manager
**I want to** understand how users interact with the platform
**So that** I can optimize conversion rates

**Acceptance Criteria:**
- [ ] Track page views
- [ ] Track button clicks (CTA, booking, wishlist)
- [ ] Track search queries
- [ ] Track conversion funnel (view → booking → payment)
- [ ] Track user journey paths
- [ ] Generate analytics reports

**Technical Tasks:**

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1001: Implement Google Analytics 4            │
└─────────────────────────────────────────────────────────┘

Priority: P1 | Estimate: 5 points | Assignee: Frontend Dev

DESCRIPTION:
Implement Google Analytics 4 with custom events and
ecommerce tracking.

TASKS:
- [ ] Set up GA4 property
- [ ] Install GA4 tracking code (gtag.js or GTM)
- [ ] Configure data streams
- [ ] Set up custom events:

  DISCOVERY:
  - page_view (automatic)
  - search (q: query)
  - view_item (package_id, package_title, price)
  - view_item_list (category)

  ENGAGEMENT:
  - add_to_wishlist (package_id, package_title, price)
  - select_item (package_id, package_title)
  - share (method: whatsapp/facebook/email, content_type: package)

  CONVERSION FUNNEL:
  - begin_checkout (value, package_id)
  - add_payment_info (payment_method)
  - purchase (transaction_id, value, items[])

  OTHER:
  - sign_up (method: email/google/facebook)
  - login (method: email/google/facebook)
  - review_submitted (package_id, rating)

- [ ] Set up enhanced ecommerce tracking:
  - Items array structure
  - Transaction data
  - Revenue tracking

- [ ] Set up conversion goals:
  - Booking completed
  - Account created
  - Email verified

- [ ] Configure user properties:
  - user_id (hashed)
  - user_type (guest/registered)
  - customer_lifetime_value

- [ ] Implement scroll depth tracking
- [ ] Test in GA4 debug mode
- [ ] Verify data in GA4 dashboard
- [ ] Write documentation

EVENT IMPLEMENTATION:
import ReactGA from 'react-ga4'

// Page view
ReactGA.send({ hitType: 'pageview', page: window.location.pathname })

// Custom event
ReactGA.event({
  category: 'ecommerce',
  action: 'add_to_wishlist',
  label: packageTitle,
  value: price
})

// Purchase event
ReactGA.event('purchase', {
  transaction_id: bookingReference,
  value: totalPrice,
  currency: 'USD',
  items: [{
    item_id: packageId,
    item_name: packageTitle,
    price: price,
    quantity: numTravelers
  }]
})

DEPENDENCIES: None
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1002: Implement Mixpanel/Amplitude            │
└─────────────────────────────────────────────────────────┘

Priority: P2 | Estimate: 5 points | Assignee: Frontend Dev

DESCRIPTION:
Implement product analytics platform for deeper insights
and cohort analysis.

TASKS:
- [ ] Set up Mixpanel or Amplitude account
- [ ] Install SDK
- [ ] Track key events with properties:

  USER EVENTS:
  - User Signed Up (method, referrer)
  - User Logged In (method)
  - Profile Updated (fields_changed)

  PACKAGE EVENTS:
  - Package Viewed (package_id, category, price)
  - Package Shared (method)
  - Package Wishlisted (package_id)

  BOOKING EVENTS:
  - Booking Started (package_id, num_travelers)
  - Traveler Details Completed (num_travelers)
  - Payment Initiated (amount, payment_method)
  - Booking Completed (booking_id, amount)
  - Booking Cancelled (booking_id, reason)

  SEARCH EVENTS:
  - Search Performed (query, results_count)
  - Search Result Clicked (query, package_id, position)

- [ ] Identify users on login:
  mixpanel.identify(userId)

- [ ] Set user properties:
  - $email
  - $name
  - total_bookings
  - total_spent
  - member_since
  - last_booking_date

- [ ] Create custom dashboards:
  - Conversion funnel (view → booking → payment)
  - User retention cohorts
  - Feature usage

- [ ] Set up funnel analysis:
  - Package View → Add to Wishlist → Booking Started → Payment
  - Sign Up → Email Verify → First Booking

- [ ] Test event tracking
- [ ] Write documentation

DEPENDENCIES: None
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1003: Build Internal Analytics Dashboard      │
└─────────────────────────────────────────────────────────┘

Priority: P2 | Estimate: 13 points | Assignee: Backend + Frontend

DESCRIPTION:
Build internal analytics dashboard for business metrics.

BACKEND TASKS:
- [ ] Create analytics_events table:
  Schema:
  - id (UUID)
  - user_id (UUID, nullable)
  - event_name (VARCHAR, indexed)
  - event_properties (JSONB)
  - session_id (VARCHAR)
  - ip_address (INET)
  - user_agent (VARCHAR)
  - created_at (TIMESTAMP, indexed)

- [ ] Implement event tracking API:
  - POST /api/analytics/events
  - Validate and store events
  - Rate limit: 100 events/min per IP

- [ ] Create analytics aggregation queries:
  - Daily active users (DAU)
  - Weekly active users (WAU)
  - Monthly active users (MAU)
  - New users
  - Returning users
  - Top pages
  - Top packages
  - Conversion rate
  - Average order value
  - Revenue

- [ ] Implement analytics API endpoints:
  - GET /api/admin/analytics/overview
  - GET /api/admin/analytics/users
  - GET /api/admin/analytics/packages
  - GET /api/admin/analytics/revenue

- [ ] Write unit tests

FRONTEND TASKS:
- [ ] Create AnalyticsDashboard component (in admin)
- [ ] Display key metrics:
  - Total Users
  - Active Users (DAU, WAU, MAU)
  - Total Bookings
  - Conversion Rate
  - Revenue
  - Average Order Value

- [ ] Add charts:
  - Users over time (line chart)
  - Revenue over time (line chart)
  - Bookings by package (bar chart)
  - Traffic sources (pie chart)

- [ ] Add date range filter
- [ ] Export data to CSV
- [ ] Write component tests

DEPENDENCIES: All data tables
```

---

# EPIC 10: SEO & Performance Optimization

**Epic ID:** DDT-EPIC-10
**Priority:** P0 - Critical
**Estimated Points:** 21 points (2 weeks)
**Dependencies:** Epic 2, Epic 3

## Overview

Optimize the platform for search engines and performance to drive organic traffic and provide excellent user experience.

## Business Value

- **Organic Traffic:** SEO drives free, high-intent traffic
- **User Experience:** Fast sites have higher conversion
- **Credibility:** Good SEO signals trustworthiness
- **Cost Savings:** Reduce reliance on paid ads

## User Stories

---

### **STORY 10.1: Optimize for Search Engines**

**As a** marketer
**I want to** rank highly in search results
**So that** we attract organic traffic

**Acceptance Criteria:**
- [ ] All pages have unique meta titles and descriptions
- [ ] Implement structured data (JSON-LD)
- [ ] Generate XML sitemap
- [ ] Optimize images (WebP, lazy loading)
- [ ] Implement canonical URLs
- [ ] Add Open Graph tags
- [ ] Page load time <2 seconds

**Technical Tasks:**

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1101: Implement SEO Best Practices            │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 8 points | Assignee: Frontend Dev

DESCRIPTION:
Implement comprehensive SEO optimizations across the
platform.

TASKS:
- [ ] Install next-seo package (for Next.js)
- [ ] Create SEO component with dynamic meta tags:
  - Title (unique per page, 50-60 chars)
  - Description (unique per page, 150-160 chars)
  - Keywords (relevant keywords)
  - Canonical URL
  - Robots (index/noindex)

- [ ] Implement JSON-LD structured data:

  ORGANIZATION (Site-wide):
  {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "OneDettyDecember",
    "url": "https://onedettydecember.com",
    "logo": "https://onedettydecember.com/logo.png",
    "description": "...",
    "address": {...},
    "contactPoint": {...}
  }

  PRODUCT (Package pages):
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Detty VIP Experience",
    "description": "...",
    "image": [...],
    "offers": {
      "@type": "Offer",
      "price": "6500",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "24"
    }
  }

  REVIEW (Review pages):
  {
    "@type": "Review",
    "author": {...},
    "datePublished": "...",
    "reviewRating": {...},
    "reviewBody": "..."
  }

  BREADCRUMB:
  {
    "@type": "BreadcrumbList",
    "itemListElement": [...]
  }

- [ ] Add Open Graph tags (Facebook, LinkedIn):
  - og:title
  - og:description
  - og:image (1200x630px)
  - og:url
  - og:type (website, article)
  - og:site_name

- [ ] Add Twitter Card tags:
  - twitter:card (summary_large_image)
  - twitter:title
  - twitter:description
  - twitter:image

- [ ] Generate dynamic sitemap.xml:
  - Include all public pages
  - Include all package pages
  - Update frequency and priority
  - Submit to Google Search Console

- [ ] Generate robots.txt:
  - Allow all public pages
  - Disallow admin pages
  - Sitemap location

- [ ] Implement canonical URLs:
  - Prevent duplicate content
  - Handle URL parameters

- [ ] Add alt text to all images
  - Descriptive alt text for accessibility and SEO

- [ ] Implement breadcrumbs:
  - Home > Packages > [Category] > [Package]
  - Schema.org BreadcrumbList markup

- [ ] Test with Google Rich Results Test
- [ ] Submit to Google Search Console
- [ ] Write documentation

PAGE-SPECIFIC SEO:

Homepage:
Title: "OneDettyDecember | Experience Nigeria's Biggest Cultural Celebration"
Description: "Book curated Detty December tour packages. VIP experiences, accommodation, events & more. Secure your spot for Nigeria's most exciting season!"

Package Page:
Title: "[Package Name] | OneDettyDecember"
Description: "[Duration]-day package including [key highlights]. From $[price]. Book now!"

Category Page:
Title: "[Category] Tours | OneDettyDecember"
Description: "Explore our [category] packages. [Benefits]. View all [category] tours."

DEPENDENCIES: None
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1102: Optimize Images                         │
└─────────────────────────────────────────────────────────┘

Priority: P1 | Estimate: 5 points | Assignee: Frontend Dev

DESCRIPTION:
Implement comprehensive image optimization strategy.

TASKS:
- [ ] Implement Next.js Image component:
  - Automatic image optimization
  - Responsive images (srcset)
  - Lazy loading
  - Blur placeholder

- [ ] Convert images to WebP format:
  - Use Next.js automatic WebP conversion
  - Or convert during upload (backend)

- [ ] Implement lazy loading for all images:
  - Use loading="lazy" attribute
  - Or Intersection Observer for custom implementation

- [ ] Add responsive image sizes:
  - Mobile: 640w
  - Tablet: 1024w
  - Desktop: 1920w

- [ ] Optimize image compression:
  - Use imagemin or sharp
  - Target: <200KB per image
  - Quality: 80-85%

- [ ] Add alt text to all images:
  - Descriptive for SEO
  - Helpful for screen readers

- [ ] Implement blur placeholder:
  - Generate small placeholder during upload
  - Use while image loads

- [ ] Test image performance:
  - Lighthouse audit
  - WebPageTest
  - Target: LCP <2.5s

NEXT.JS IMAGE EXAMPLE:
import Image from 'next/image'

<Image
  src="/images/package.jpg"
  alt="Detty VIP Experience in Lagos"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>

DEPENDENCIES: None
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1103: Implement Performance Optimizations     │
└─────────────────────────────────────────────────────────┘

Priority: P1 | Estimate: 8 points | Assignee: Frontend Dev

DESCRIPTION:
Implement comprehensive performance optimizations to
achieve Core Web Vitals targets.

TASKS:
- [ ] Enable code splitting:
  - Dynamic imports for large components
  - Route-based code splitting
  - Component-level code splitting

- [ ] Implement dynamic imports:
  const Modal = dynamic(() => import('./Modal'))

- [ ] Add service worker for caching:
  - Cache static assets
  - Cache API responses (stale-while-revalidate)
  - Offline fallback page

- [ ] Implement prefetching:
  - Prefetch links on hover
  - Prefetch next page in pagination
  - <link rel="prefetch" href="..." />

- [ ] Minify CSS and JavaScript:
  - Enable minification in build
  - Remove unused CSS (PurgeCSS)

- [ ] Optimize font loading:
  - Use font-display: swap
  - Preload critical fonts
  - Use system fonts as fallback

- [ ] Reduce JavaScript bundle size:
  - Tree shaking
  - Remove console.logs in production
  - Use smaller libraries

- [ ] Implement critical CSS:
  - Inline critical above-the-fold CSS
  - Defer non-critical CSS

- [ ] Optimize third-party scripts:
  - Defer non-critical scripts
  - Use async where possible
  - Self-host analytics if needed

- [ ] Achieve Lighthouse score >90:
  - Performance: >90
  - Accessibility: >90
  - Best Practices: >90
  - SEO: >90

CORE WEB VITALS TARGETS:
- First Contentful Paint (FCP): <1.8s
- Largest Contentful Paint (LCP): <2.5s
- First Input Delay (FID): <100ms
- Cumulative Layout Shift (CLS): <0.1
- Time to Interactive (TTI): <3.8s

BUNDLE ANALYSIS:
- Use Next.js bundle analyzer
- Identify large dependencies
- Replace or remove heavy libraries
- Code split large components

DEPENDENCIES: None
```

---

# EPIC 11: Security & Compliance

**Epic ID:** DDT-EPIC-11
**Priority:** P0 - Critical
**Estimated Points:** 29 points (2.5 weeks)
**Dependencies:** All epics

## Overview

Implement comprehensive security measures and ensure compliance with data protection regulations.

## Business Value

- **Trust:** Security builds customer confidence
- **Legal Compliance:** Avoid fines and legal issues
- **Data Protection:** Protect user data from breaches
- **Business Continuity:** Prevent security incidents

## User Stories

---

### **STORY 11.1: Secure Platform**

**As a** security engineer
**I want to** protect user data and prevent attacks
**So that** users can trust our platform

**Acceptance Criteria:**
- [ ] HTTPS enforced on all pages
- [ ] SQL injection protection
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Rate limiting on all endpoints
- [ ] Secure password storage
- [ ] PCI DSS compliance for payments
- [ ] GDPR compliance

**Technical Tasks:**

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1201: Implement Security Best Practices       │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 13 points | Assignee: Backend Dev

DESCRIPTION:
Implement comprehensive security measures to protect
against common attacks.

TASKS:
- [ ] Enable HTTPS with SSL certificate:
  - Use Let's Encrypt (free)
  - Or cloud provider SSL
  - Force HTTPS redirect (HTTP → HTTPS)
  - HSTS header (Strict-Transport-Security)

- [ ] Implement helmet.js for security headers:
  - X-Frame-Options: DENY (prevent clickjacking)
  - X-Content-Type-Options: nosniff
  - X-XSS-Protection: 1; mode=block
  - Content-Security-Policy
  - Referrer-Policy: strict-origin-when-cross-origin
  - Permissions-Policy

- [ ] Configure CORS properly:
  - Allow only trusted origins
  - Restrict methods and headers
  - Don't use wildcard (*) in production

- [ ] Implement rate limiting:
  - Install express-rate-limit
  - Apply to all endpoints:
    - Public: 100 req/15min per IP
    - Auth: 5 req/15min per IP (login, register)
    - API: 1000 req/hour per user
  - Return 429 Too Many Requests

- [ ] Add input validation and sanitization:
  - Use validator.js
  - Sanitize all user inputs
  - Validate data types, formats, lengths
  - Whitelist approach (allow known good)

- [ ] Prevent SQL injection:
  - Use parameterized queries (never string concatenation)
  - Use ORM (Prisma, TypeORM)
  - Validate and sanitize inputs

- [ ] Prevent XSS:
  - Escape HTML in user-generated content
  - Use Content-Security-Policy header
  - Sanitize inputs (DOMPurify)
  - HttpOnly cookies

- [ ] Implement CSRF protection:
  - Use csurf middleware
  - Generate CSRF tokens
  - Validate tokens on state-changing requests
  - SameSite cookie attribute

- [ ] Secure session management:
  - Use secure, httpOnly cookies
  - Generate strong session IDs
  - Implement session timeout (30 min)
  - Regenerate session ID on login

- [ ] Add security logging and monitoring:
  - Log all authentication events
  - Log failed login attempts
  - Log suspicious activity
  - Set up alerts (Sentry, Datadog)

- [ ] Implement secrets management:
  - Use environment variables
  - Never commit secrets to git
  - Use secret management service (AWS Secrets Manager)
  - Rotate secrets regularly

- [ ] Set up error handling:
  - Don't expose stack traces in production
  - Generic error messages to users
  - Detailed logs for developers

- [ ] Write security tests:
  - Test for SQL injection
  - Test for XSS
  - Test rate limiting
  - Test authentication/authorization

- [ ] Perform security audit:
  - Use npm audit
  - Use Snyk or similar
  - Fix all high/critical vulnerabilities

SECURITY HEADERS:
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}))

DEPENDENCIES: None
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1202: Implement GDPR Compliance               │
└─────────────────────────────────────────────────────────┘

Priority: P1 | Estimate: 8 points | Assignee: Backend + Frontend

DESCRIPTION:
Implement GDPR compliance features for data protection.

BACKEND TASKS:
- [ ] Implement data export functionality:
  - GET /api/users/data-export
  - Export all user data in JSON format
  - Include: profile, bookings, reviews, wishlist
  - Provide download link

- [ ] Implement account deletion:
  - DELETE /api/users/account
  - Anonymize or delete user data
  - Cancel active bookings
  - Remove personal information
  - Keep financial records (legal requirement)

- [ ] Implement data retention policies:
  - Define retention periods per data type
  - Automatically delete old data
  - Cron job for cleanup

- [ ] Add consent tracking:
  - Track user consent for cookies
  - Track user consent for marketing
  - Store consent timestamp

- [ ] Create data processing agreement (DPA)
- [ ] Maintain data processing records
- [ ] Implement audit logging for data access

FRONTEND TASKS:
- [ ] Create Privacy Policy page:
  - What data we collect
  - How we use data
  - How we protect data
  - User rights (access, delete, export)
  - Contact information

- [ ] Create Terms of Service page:
  - User obligations
  - Platform rules
  - Limitation of liability
  - Dispute resolution

- [ ] Implement cookie consent banner:
  - Show on first visit
  - Essential cookies (required)
  - Analytics cookies (optional)
  - Marketing cookies (optional)
  - Save preferences
  - "Manage Cookies" link in footer

- [ ] Add data export feature:
  - "Export My Data" button in settings
  - Download JSON file

- [ ] Add account deletion feature:
  - "Delete My Account" button in settings
  - Confirmation modal with warnings
  - Require password confirmation

- [ ] Add "Manage Cookies" page:
  - Toggle each cookie category
  - Explain what each category does

- [ ] Write component tests

COOKIE CATEGORIES:
1. Essential (always enabled):
   - Authentication
   - Security
   - Session management

2. Analytics (optional):
   - Google Analytics
   - Mixpanel

3. Marketing (optional):
   - Facebook Pixel
   - Google Ads

DEPENDENCIES: DDT-101
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1203: Security Audit & Penetration Testing    │
└─────────────────────────────────────────────────────────┘

Priority: P1 | Estimate: 8 points | Assignee: Security Engineer

DESCRIPTION:
Conduct comprehensive security audit and penetration
testing.

TASKS:
- [ ] Conduct security audit:
  - Review code for security vulnerabilities
  - Review third-party dependencies
  - Review infrastructure security
  - Review access controls

- [ ] Perform penetration testing:
  - Test for OWASP Top 10 vulnerabilities:
    1. Broken Access Control
    2. Cryptographic Failures
    3. Injection
    4. Insecure Design
    5. Security Misconfiguration
    6. Vulnerable Components
    7. Auth/Session Failures
    8. Software/Data Integrity Failures
    9. Logging/Monitoring Failures
    10. Server-Side Request Forgery

- [ ] Test authentication and authorization:
  - Password strength requirements
  - Session management
  - JWT implementation
  - OAuth implementation
  - CSRF protection

- [ ] Test payment security:
  - PCI DSS compliance
  - Secure data transmission
  - No storage of card data
  - Stripe integration security

- [ ] Test API security:
  - Authentication required
  - Authorization checks
  - Rate limiting
  - Input validation

- [ ] Test data encryption:
  - Passwords hashed (bcrypt)
  - Sensitive data encrypted
  - HTTPS enforced
  - Secure cookies

- [ ] Document findings:
  - Severity rating (critical/high/medium/low)
  - Detailed description
  - Proof of concept
  - Remediation steps

- [ ] Implement fixes:
  - Prioritize by severity
  - Create tickets for each issue
  - Verify fixes

- [ ] Re-test after fixes:
  - Verify all issues resolved
  - No new issues introduced

TESTING TOOLS:
- OWASP ZAP
- Burp Suite
- Nmap
- SQLMap
- Nikto
- npm audit
- Snyk

DEPENDENCIES: All other security tickets
```

---

# EPIC 12: Mobile Optimization

**Epic ID:** DDT-EPIC-12
**Priority:** P2 - Medium
**Estimated Points:** 16 points (1.5 weeks)
**Dependencies:** Epic 2, Epic 3

## Overview

Optimize the platform for mobile devices with Progressive Web App capabilities.

## Business Value

- **Mobile Traffic:** 60%+ of travel bookings happen on mobile
- **User Experience:** Mobile-first design improves engagement
- **App-Like Experience:** PWA reduces friction
- **Offline Capability:** Access content without internet

## User Stories

---

### **STORY 12.1: Progressive Web App**

**As a** mobile user
**I want to** install the platform as an app
**So that** I have quick access and offline capabilities

**Acceptance Criteria:**
- [ ] PWA installable on mobile devices
- [ ] Offline support for key pages
- [ ] Fast loading on mobile networks
- [ ] Mobile-optimized UI
- [ ] Touch-friendly interactions
- [ ] Push notifications support

**Technical Tasks:**

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1301: Implement PWA                           │
└─────────────────────────────────────────────────────────┘

Priority: P2 | Estimate: 8 points | Assignee: Frontend Dev

DESCRIPTION:
Convert platform to Progressive Web App with offline
capabilities.

TASKS:
- [ ] Create manifest.json:
  {
    "name": "OneDettyDecember",
    "short_name": "DDT",
    "description": "Book your Detty December experience",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#3B82F6",
    "orientation": "portrait",
    "icons": [
      {
        "src": "/icons/icon-72x72.png",
        "sizes": "72x72",
        "type": "image/png"
      },
      {
        "src": "/icons/icon-192x192.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "any maskable"
      },
      {
        "src": "/icons/icon-512x512.png",
        "sizes": "512x512",
        "type": "image/png"
      }
    ]
  }

- [ ] Add PWA meta tags:
  <meta name="theme-color" content="#3B82F6">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="apple-mobile-web-app-title" content="DDT">
  <link rel="apple-touch-icon" href="/icons/icon-192x192.png">

- [ ] Create app icons (multiple sizes):
  - 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512
  - Maskable icons for Android
  - iOS splash screens

- [ ] Implement service worker:
  - Cache static assets (CSS, JS, fonts, images)
  - Cache API responses (packages, user data)
  - Implement cache strategies:
    - Cache-first: Static assets
    - Network-first: API calls
    - Stale-while-revalidate: Images
  - Implement offline fallback page

- [ ] Test PWA installation:
  - Android (Chrome, Samsung Internet)
  - iOS (Safari)
  - Desktop (Chrome, Edge)

- [ ] Test offline functionality:
  - View cached packages offline
  - Show offline indicator
  - Queue actions for when back online

- [ ] Optimize for mobile performance:
  - Reduce bundle size
  - Lazy load images
  - Minimize JavaScript

- [ ] Pass Lighthouse PWA audit (100 score)

SERVICE WORKER EXAMPLE:
// Cache static assets
const CACHE_NAME = 'ddt-v1'
const urlsToCache = [
  '/',
  '/styles/main.css',
  '/scripts/main.js',
  '/offline.html'
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  )
})

// Serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => caches.match('/offline.html'))
  )
})

DEPENDENCIES: None
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1302: Implement Push Notifications            │
└─────────────────────────────────────────────────────────┘

Priority: P2 | Estimate: 8 points | Assignee: Full-Stack Dev

DESCRIPTION:
Implement push notifications for important updates and
reminders.

BACKEND TASKS:
- [ ] Set up Firebase Cloud Messaging (FCM)
- [ ] Create push_tokens table:
  Schema:
  - id (UUID)
  - user_id (UUID)
  - token (VARCHAR, unique)
  - device_type (ENUM: android, ios, web)
  - created_at (TIMESTAMP)

- [ ] Implement POST /api/push/subscribe endpoint:
  - Save push token for user
  - Associate with device

- [ ] Implement POST /api/push/unsubscribe endpoint:
  - Remove push token

- [ ] Implement notification sending:
  - Booking confirmation
  - Payment confirmation
  - Booking reminder (7 days before)
  - Price drop on wishlisted package
  - Review request

- [ ] Handle notification clicks:
  - Deep link to relevant page
  - Track click-through rates

- [ ] Write unit tests

FRONTEND TASKS:
- [ ] Request notification permissions:
  - Show permission request after first booking
  - Or in settings

- [ ] Subscribe to push notifications:
  - Get FCM token
  - Send token to backend

- [ ] Handle incoming notifications:
  - Show notification
  - Handle click (navigate to page)

- [ ] Handle notification permissions:
  - Granted: Subscribe
  - Denied: Don't ask again
  - Default: Show prompt

- [ ] Add "Manage Notifications" in settings:
  - Toggle notifications on/off
  - Select notification types

- [ ] Test notifications:
  - Android
  - iOS (requires APNS)
  - Desktop

NOTIFICATION EXAMPLES:

Booking Reminder:
Title: "Your trip is in 7 days!"
Body: "Detty VIP Experience - Dec 20, 2025"
Icon: /icons/icon-192x192.png
Badge: /icons/badge-72x72.png
Actions: [
  { action: "view", title: "View Booking" },
  { action: "dismiss", title: "Dismiss" }
]

Price Drop:
Title: "Price Drop Alert! 🔥"
Body: "Detty VIP Experience is now $5,500 (was $6,500)"
Actions: [
  { action: "book", title: "Book Now" },
  { action: "dismiss", title: "Later" }
]

DEPENDENCIES: DDT-1301
```

---

# EPIC 13: Content Management System

**Epic ID:** DDT-EPIC-13
**Priority:** P2 - Medium
**Estimated Points:** 26 points (2 weeks)
**Dependencies:** Epic 1

## Overview

Implement CMS for managing blog content, FAQs, and static pages to support SEO and marketing efforts.

## Business Value

- **SEO:** Blog content drives organic traffic
- **Education:** Help users plan their trips
- **Authority:** Position as experts in Nigerian tourism
- **Engagement:** Keep users engaged with valuable content

## User Stories

---

### **STORY 13.1: Blog & Content Pages**

**As a** content manager
**I want to** create and publish blog posts
**So that** we can drive SEO traffic and engage users

**Acceptance Criteria:**
- [ ] Create blog posts with rich text editor
- [ ] Add images and media to posts
- [ ] Organize posts by categories and tags
- [ ] Schedule posts for future publication
- [ ] SEO optimization for blog posts
- [ ] Social sharing for blog posts

**Technical Tasks:**

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1301: Create Blog Database Schema             │
└─────────────────────────────────────────────────────────┘

Priority: P2 | Estimate: 5 points | Assignee: Backend Dev

DESCRIPTION:
Design database schema for blog posts and related content.

TASKS:
- [ ] Design blog_posts table
- [ ] Design blog_categories table
- [ ] Design blog_tags table
- [ ] Design blog_post_tags table (many-to-many)
- [ ] Add database migrations
- [ ] Create indexes

SCHEMA:

blog_posts table:
- id (UUID, primary key)
- title (VARCHAR, indexed)
- slug (VARCHAR, unique, indexed)
- excerpt (TEXT)
- content (TEXT) -- Rich text HTML
- featured_image_url (VARCHAR)
- author_id (UUID, foreign key → users.id)
- category_id (UUID, foreign key → blog_categories.id, indexed)
- status (ENUM: draft, published, scheduled)
- published_at (TIMESTAMP, nullable, indexed)
- view_count (INTEGER, default: 0)
- meta_title (VARCHAR)
- meta_description (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

blog_categories table:
- id (UUID, primary key)
- name (VARCHAR, unique)
- slug (VARCHAR, unique, indexed)
- description (TEXT)
- created_at (TIMESTAMP)

blog_tags table:
- id (UUID, primary key)
- name (VARCHAR, unique)
- slug (VARCHAR, unique, indexed)
- created_at (TIMESTAMP)

blog_post_tags table:
- id (UUID, primary key)
- post_id (UUID, foreign key → blog_posts.id)
- tag_id (UUID, foreign key → blog_tags.id)
- created_at (TIMESTAMP)

CONSTRAINTS:
- UNIQUE(post_id, tag_id)

INDEXES:
- blog_posts: (slug), (status, published_at), (category_id)
- blog_post_tags: (post_id), (tag_id)

DEPENDENCIES: DDT-101
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1302: Implement Blog API                      │
└─────────────────────────────────────────────────────────┘

Priority: P2 | Estimate: 8 points | Assignee: Backend Dev

DESCRIPTION:
Create API endpoints for blog CRUD operations.

TASKS:
- [ ] Implement GET /api/blog/posts endpoint:
  - List published posts
  - Filter by category, tag
  - Search by title/content
  - Pagination (10 per page)
  - Sort by published_at desc

- [ ] Implement GET /api/blog/posts/:slug endpoint:
  - Get single post by slug
  - Include author info
  - Include category
  - Include tags
  - Increment view count
  - Return 404 if not published

- [ ] Implement GET /api/blog/categories endpoint:
  - List all categories
  - Include post count

- [ ] Implement GET /api/blog/tags endpoint:
  - List all tags
  - Include post count

- [ ] Implement admin endpoints:
  - POST /api/admin/blog/posts (create)
  - PATCH /api/admin/blog/posts/:id (update)
  - DELETE /api/admin/blog/posts/:id (delete)
  - GET /api/admin/blog/posts (list all including drafts)

- [ ] Implement scheduled publishing:
  - Cron job runs every hour
  - Publish posts where:
    - status = 'scheduled'
    - published_at <= now()
  - Update status to 'published'

- [ ] Write unit tests

DEPENDENCIES: DDT-1301
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1303: Build Blog Frontend                     │
└─────────────────────────────────────────────────────────┘

Priority: P2 | Estimate: 13 points | Assignee: Frontend Dev

DESCRIPTION:
Create blog listing and detail pages.

TASKS:
- [ ] Create BlogPage component:
  - Grid of blog posts
  - Featured post (large card)
  - Recent posts (smaller cards)
  - Filter by category (tabs or sidebar)
  - Search box
  - Pagination

- [ ] Create BlogPostCard component:
  - Featured image
  - Title
  - Excerpt (truncated)
  - Author name and avatar
  - Published date (relative)
  - Category badge
  - Read time estimate
  - "Read More" link

- [ ] Create BlogPostPage component:
  - Full-width hero image
  - Title (H1)
  - Author, date, read time
  - Category and tags
  - Full content (rich text HTML)
  - Social share buttons
  - Related posts section
  - Comments section (optional)

- [ ] Create CategoryPage component:
  - List posts in category
  - Category description
  - Similar to BlogPage

- [ ] Create TagPage component:
  - List posts with tag
  - Similar to BlogPage

- [ ] Implement SEO:
  - Unique meta title/description per post
  - Open Graph tags
  - JSON-LD (Article schema)
  - Canonical URLs

- [ ] Add social sharing:
  - Facebook
  - Twitter
  - LinkedIn
  - WhatsApp
  - Copy link

- [ ] Calculate read time:
  - Words / 200 words per minute
  - Display "X min read"

- [ ] Write component tests

BLOG POST CARD:
[Featured Image]
[Category Badge]
[Title]
[Excerpt...]
By [Author] | [Date] | [X min read]
[Read More →]

DEPENDENCIES: DDT-1302
```

---
# EPIC 14: Car Rentals & Airport Transfers

**Epic ID:** DDT-EPIC-14
**Priority:** P1 - High
**Estimated Points:** TBD (v4)
**Dependencies:** Epic 3 (Package Details & Booking), Epic 4 (Payment Integration), Epic 6 (User Profile & Account Management)

## Overview

Launch a demand–supply marketplace vertical for **airport transfers and car rentals** in Detty December hubs (starting with Lagos, then Accra), similar to Hertz/Enterprise but powered by local providers and drivers. Travelers can reliably book pickups and vehicles; local operators can earn and manage bookings inside OneDettyDecember.

## Business Value

- **Increase GMV per traveler:** Capture mobility spend (airport transfers, day rentals, night runs) on top of events, stays and tours.
- **Reliability & safety:** Provide verified drivers/providers instead of ad‑hoc taxis and DMs.
- **Local income:** Enable local rental businesses and vetted individual drivers to monetize the Detty December season.
- **Bundle value:** Allow travelers to bundle transport with their stays/itineraries for a smoother end‑to‑end trip.

## Supply & Demand Flows (High-Level)

- **Demand side (travelers):**
  - Discover car rentals and transfers via search, filters (dates, pickup time, vehicle type, capacity, price) and via upsells on booking flows (e.g. "Add airport pickup").
  - Book using the existing checkout, pay in local/foreign currency, and track bookings in the trip dashboard.

- **Supply side (providers/drivers):**
  - Create and manage listings for vehicles and transfer services with photos, capacity, pricing, schedule windows, pickup/drop‑off rules.
  - Receive bookings, mark trips as completed, and receive payouts via the same vendor payout system.

## User Stories

---

### STORY 14.1: Traveler books airport transfer / car rental (FR-039)

**As a** traveler
**I want to** book an airport pickup and/or car rental as part of my Detty December stay
**So that** I dont have to worry about last‑minute transport when I land

**Acceptance Criteria:**
- [ ] Traveler can search for transfers and vehicles by **date, time window, pickup/drop‑off location, number of passengers and luggage**.
- [ ] Listing details clearly show **vehicle type, capacity, provider rating, inclusions (fuel/driver), pricing, and cancellation policy**.
- [ ] Traveler can **book transfer/rental as a standalone booking** or as an **add‑on** to an existing stay or event booking.
- [ ] Booking confirmation appears in **My Trips / Bookings** with date, time, contact details and map link.
- [ ] Traveler receives email/SMS confirmation using the existing notifications infrastructure.

### STORY 14.2: Provider/driver manages vehicle and transfer listings (FR-040)

**As a** local rental provider or driver
**I want to** list my vehicles and transfer services and manage bookings
**So that** I can earn from Detty December travelers through OneDettyDecember

**Acceptance Criteria:**
- [ ] Provider can create **one or more vehicle/transfer listings** with photos, vehicle specs, max passengers, pickup areas, pricing model (per trip / per day) and availability.
- [ ] Provider can view a **calendar or list view of upcoming bookings** filtered by day/week.
- [ ] Provider can **accept auto‑confirmed bookings** (by default) and mark transfers as **completed**.
- [ ] Completed bookings flow into the existing **payouts** pipeline (no separate payout system).
- [ ] Admin can **temporarily disable or permanently remove** providers or listings that violate policy.

---

# EPIC 15: Hosted Experiences Marketplace

**Epic ID:** DDT-EPIC-15
**Priority:** P1 - High
**Estimated Points:** TBD (v4)
**Dependencies:** Epic 2 (Package Discovery & Search), Epic 3 (Package Details & Booking), Epic 4 (Payment Integration), Epic 5 (Reviews & Ratings)

## Overview

Create an **Airbnb Experiences-style marketplace** for hosted experiences (nightlife crawls, food tours, cultural walks, beach days, etc.) led by locals and micro‑operators. Travelers can discover and book small‑group, time‑bound activities that make Detty December feel authentic and social.

## Business Value

- **Differentiate the platform:** Go beyond generic events to **host‑led experiences** tied to Detty December culture.
- **Unlock long tail supply:** Allow individuals, small groups and micro‑brands to host, not just big promoters/hotels.
- **Drive community & One Detty Tribe:** Experiences create **shared memories and squads** that plug directly into the community layer.
- **Higher ARPU & retention:** Guests who book experiences are more likely to **stay longer, spend more and return**.

## Supply & Demand Flows (High-Level)

- **Demand side (guests):**
  - Discover experiences by **city, date, price, theme, group size and vibe** (e.g. nightlife, food, culture, wellness).
  - See clear itineraries, host identity, group size, reviews and whats included before booking.

- **Supply side (hosts/vendors):**
  - Create structured experience listings with **slots**, capacity and calendar.
  - Manage guest rosters, messaging, cancellations and reviews.

## User Stories

---

### STORY 15.1: Traveler discovers and books hosted experiences (FR-041)

**As a** traveler/guest
**I want to** discover and book locally hosted experiences that match my vibe and schedule
**So that** I can enjoy authentic Detty December moments beyond just big events

**Acceptance Criteria:**
- [ ] Guests can **filter experiences** by **date, time of day, price range, theme (nightlife/food/culture/wellness), location and group size**.
- [ ] Experience detail page shows **itinerary, whats included/excluded, meeting point (with map), duration, host profile, languages and reviews**.
- [ ] Guests can select a **specific date and time slot**, see remaining spots, and book with the same checkout as other inventory.
- [ ] Booked experiences appear in **My Trips / Bookings**, with reminders sent before start time.

### STORY 15.2: Host creates and manages experience listings (FR-042)

**As a** local host/vendor
**I want to** create, schedule and manage experience listings
**So that** I can earn from small‑group activities during Detty December

**Acceptance Criteria:**
- [ ] Host can create an experience with **title, category, description, photos, meeting point, max group size, duration, price per guest and languages**.
- [ ] Host can define **recurring or one‑off slots** on specific dates/times and set per‑slot capacity.
- [ ] Host can view a **guest list** per experience/slot, with basic profile info and contact channel.
- [ ] Host can send **pre‑ and post‑experience messages** (e.g. meeting instructions, follow‑up) via platform messaging and/or email.
- [ ] Completed experiences feed into **reviews & ratings** and the same payout system as other marketplace bookings.


# EPIC 16: Agentic AI Trip Planner & Host Copilot

**Epic ID:** DDT-EPIC-16
**Priority:** P1 - High
**Estimated Points:** TBD (v4)
**Dependencies:** Epic 2 (Package Discovery & Search), Epic 3 (Package Details & Booking), Epic 4 (Payment Integration), Epic 6 (User Profile & Account Management)

## Overview

Deliver an **agentic AI assistant** that helps travelers plan Detty December trips end-to-end using real marketplace inventory, and a **host/vendor copilot** that makes listing creation and optimization much easier for supply partners.

## Business Value

- **Higher conversion & basket size:** AI-guided itineraries help travelers discover more relevant events, stays, tours, experiences and mobility options.
- **Lower supply onboarding friction:** Hosts/vendors/drivers can get from idea to live listing faster with AI guidance.
- **Better quality listings:** Copilot-driven suggestions improve copy, pricing and scheduling, raising marketplace quality.
- **Differentiation:** Positions OneDettyDecember as a smart, AI-first Detty December OS, not just a static directory.

## User Stories

---

### STORY 16.1: Traveler uses AI trip planner (FR-043)

**As a** traveler
**I want to** describe my Detty December goals in my own words and have an AI propose a plan
**So that** I can quickly get to a realistic itinerary without manually piecing everything together from scratch

**Acceptance Criteria:**
- [ ] Traveler can open an **AI trip planner** surface (e.g. chat/assistant) and describe trip goals (dates, cities, vibe, preferred spend level, must-do events).
- [ ] The assistant responds with a **structured draft itinerary** made up of real events, stays, hosted experiences/tours and mobility options from the platform, including links to listing detail pages.
- [ ] Traveler can refine via conversation (e.g. “less clubs, more food”, “I want to spend less overall”, “add one chill day”) and see the itinerary update accordingly.
- [ ] Traveler can **send selected items to cart or wishlist** in a small number of guided actions.
- [ ] The assistant clearly shows when an item is **no longer available** and proposes alternatives.

### STORY 16.2: Host/vendor uses AI listing copilot (FR-044)

**As a** vendor/host/driver
**I want to** be guided by an AI copilot when creating or improving listings
**So that** I can publish high-quality listings quickly without needing to be a copywriter or product expert

**Acceptance Criteria:**
- [ ] Host/vendor can opt into an **AI-assisted listing flow** where the copilot asks structured questions (what is this offering, when, where, for whom, pricing, inclusions, policies).
- [ ] Copilot generates a **draft listing** (title, description, highlights, suggested tags/categories, draft pricing ranges) which the host can review and edit before saving.
- [ ] Copilot can suggest **improvements** to existing listings (clearer title, better description, more relevant time slots, pricing hints) based on marketplace patterns.
- [ ] All AI outputs are **editable and non-destructive**; final control always remains with the host.
- [ ] Admin tooling surfaces basic **logs/metrics** (usage, rejection, reported issues) for monitoring quality and abuse.

---

---

# EPIC 17: Marketplace Storefront

**Epic ID:** DDT-EPIC-17
**Priority:** P1 - High
**Estimated Points:** TBD (v4)
**Dependencies:** Epic 2 (Package Discovery & Search), Epic 3 (Package Details & Booking), Epic 4 (Payment Integration), Epic 6 (User Profile & Account Management), Epic 5 (Reviews & Ratings)

## Overview

Launch a **physical goods marketplace and storefront layer** where marketplace vendors, brands and creators can sell Detty December-related products (Detty December-branded items, African art, fashion, accessories, beauty products, home goods, souvenirs and cultural goods) to travelers and locals, using the same account, payout and analytics foundations as the core marketplace.

## Business Value

- **New monetization layer:** Capture spend on Detty December merchandise and culture-first products in addition to bookings.
- **Brand depth:** Extend the OneDettyDecember brand into tangible items that keep the experience alive beyond the trip.
- **Support creators:** Provide a structured channel for African designers, artists and brands to reach diaspora demand.
- **Cross-sell & bundling:** Tie products into city/event collections and One Detty Tribe surfaces to lift basket size.

## Supply & Demand Flows (High-Level)

- **Demand side (shoppers):**
  - Discover marketplace products by **city, category (branded items/art/fashion/accessories/beauty/home goods/souvenirs), price range and featured collections** (e.g. "Lagos Nightlife Fits", "Accra Art & Prints").
  - View detailed product pages with **photos, description, variants (size/colour), price, availability, shipping/pickup options and vendor rating**.
  - Add products to a **cart** and check out using existing payment rails; view orders in their account.

- **Supply side (vendors/brands/creators):**
  - Create and manage a **storefront** with brand info, logo, banner and policies.
  - Create product listings with **title, category, description, photos, inventory, variants, pricing and shipping/pickup rules**.
  - View and fulfil orders, mark them as **shipped/ready for pickup**, and receive payouts via the shared vendor payout system.

## User Stories

---

### STORY 17.1: Traveler/visitor browses and buys marketplace products (FR-045)

**As a** traveler or local visitor
**I want to** browse and buy Detty December-branded items and African cultural goods in one place
**So that** I can get items that match my trip and vibe without hunting across random sites and DMs

**Acceptance Criteria:**
- [ ] Shopper can **discover products** via a marketplace home, filters (city, category, price range) and curated collections.
- [ ] Product detail page shows **images, description, available variants (size/colour), price, stock status and shipping/pickup options**.
- [ ] Shopper can add one or more products to a **cart**, see a clear **order summary (items, fees, estimated delivery/pickup)** and complete checkout with the existing payment integration.
- [ ] After purchase, shopper sees the order in **My Orders / Purchases** with status (e.g. pending, fulfilled) and basic support contact.
- [ ] Email/SMS confirmations are sent using the notifications infrastructure.

---

### STORY 17.2: Marketplace vendor/brand sets up storefront and products (FR-046)

**As a** marketplace vendor, brand or creator
**I want to** set up a storefront and manage my product catalog, inventory and orders
**So that** I can reliably sell Detty December-related products to travelers and locals

**Acceptance Criteria:**
- [ ] Vendor can create a **storefront** with name, logo, banner, description and basic policies (shipping, returns, contact).
- [ ] Vendor can create and edit **product listings** with title, category, description, photos, variants (size/colour), SKU and price, and set initial inventory quantities.
- [ ] Vendor can see a **list of orders** with product, quantity, buyer details (as permitted by privacy), and order status.
- [ ] Vendor can update order status (e.g. **pending → fulfilled/shipped → completed**) and this is visible to the shopper.
- [ ] Sales and payouts for merch appear in the same or a closely-integrated **earnings/payouts view** as other marketplace earnings.

---

### STORY 17.3: Products appear in curated Detty collections and community surfaces

**As a** merch vendor or brand
**I want to** have my products featured in curated collections and community surfaces
**So that** I can reach more of the right travelers and locals

**Acceptance Criteria:**
- [ ] Admins can group products into **curated collections** (e.g. "Lagos Nightlife Fits", "Accra Art & Prints") and pin them to landing/community surfaces.
- [ ] Relevant products can be surfaced alongside **events, stays or experiences** (e.g. "Complete the look" or "Bring this to the beach").
- [ ] Basic analytics exist at vendor level for **views, add-to-cart and sales** per product and collection.




## 🎯 SUMMARY

**Total Development Effort:** 355 story points (~30 weeks with 2-person team)

**Note (v4 verticals):** Epics 14 (Car Rentals & Airport Transfers), 15 (Hosted Experiences Marketplace), 16 (Agentic AI Trip Planner & Host Copilot) and 17 (Merch & Marketplace Storefront) are **v4+ expansion epics** planned after the initial 30-week core build. Their estimates and placement in the sprint plan are intentionally left TBD until core marketplace performance and team capacity are validated.


**Critical Path (P0 Epics):**
1. Epic 1: User Registration & Authentication (3 weeks)
2. Epic 2: Package Discovery & Search (2.5 weeks)
3. Epic 3: Package Details & Booking (4 weeks)
4. Epic 4: Payment Integration (3.5 weeks)
5. Epic 8: Email Notifications (2 weeks)
6. Epic 10: SEO & Performance (2 weeks)
7. Epic 11: Security & Compliance (2.5 weeks)

**Total Critical Path:** ~20 weeks (5 months)

**High Priority Epics (P1):**
- Epic 5: Reviews & Ratings (2.5 weeks)
- Epic 6: User Profile & Account (2 weeks)
- Epic 9: Analytics & Tracking (1.5 weeks)

**Medium Priority Epics (P2):**
- Epic 7: Wishlist & Favorites (1.5 weeks)
- Epic 12: Mobile Optimization (1.5 weeks)
- Epic 13: Content Management (2 weeks)

---

## 📋 RECOMMENDED SPRINT PLAN

### **Phase 1: Foundation (Weeks 1-8)**
- Sprint 1-2: Epic 1 (Authentication)
- Sprint 3-4: Epic 2 (Package Discovery)
- Sprint 5-8: Epic 3 (Booking Flow)

### **Phase 2: Payments & Core Features (Weeks 9-16)**
- Sprint 9-11: Epic 4 (Payment Integration)
- Sprint 12-13: Epic 5 (Reviews)
- Sprint 14-16: Epic 6 (User Profile)

### **Phase 3: Marketing & Optimization (Weeks 17-24)**
- Sprint 17-18: Epic 8 (Email Notifications)
- Sprint 19-20: Epic 10 (SEO & Performance)
- Sprint 21-22: Epic 11 (Security)
- Sprint 23-24: Epic 9 (Analytics)

### **Phase 4: Enhancement (Weeks 25-30)**
- Sprint 25: Epic 7 (Wishlist)
- Sprint 26-27: Epic 12 (Mobile/PWA)
- Sprint 28-30: Epic 13 (CMS)

---

**Document Owner:** Product Manager
**Last Updated:** November 8, 2025
**Version:** 1.0
**Status:** Ready for Development

---
