# Product Requirements Document (PRD)
## OneDettyDecember Marketplace Platform

**Version:** 1.0  
**Date:** November 8, 2025  
**Prepared for:** OneDettyDecember
**Document Owner:** Business Development

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Product Vision & Objectives](#product-vision)
3. [Market Analysis](#market-analysis)
4. [User Personas](#user-personas)
5. [Product Architecture](#product-architecture)
6. [Core Features & Requirements](#core-features)
7. [Technical Specifications](#technical-specifications)
8. [Data Models](#data-models)
9. [User Flows](#user-flows)
10. [Revenue Model](#revenue-model)
11. [Success Metrics](#success-metrics)
12. [Development Roadmap](#development-roadmap)
13. [Risk Management](#risk-management)

---

## 1. Executive Summary {#executive-summary}

### Product Overview
OneDettyDecember is a two-sided marketplace connecting travelers with vetted travel agencies, event organizers, and hospitality providers for Nigeria-focused experiences, with emphasis on the "Detty December" festival season. The platform operates on a commission-based model similar to Airbnb Experiences, while generating additional revenue through merchandise, affiliate partnerships, and premium content.

### Business Model
- **Primary Revenue:** 15-20% commission on all bookings
- **Secondary Revenue:** Merchandise sales (20-30% margin)
- **Tertiary Revenue:** Sponsored listings, affiliate partnerships, premium vendor features
- **Content Revenue:** Sponsored blog posts, advertising

### Target Milestones
- **Month 3:** 25 vendors onboarded, 50 listings live
- **Month 6:** 100+ bookings processed, $150K GMV
- **Month 12:** 100+ vendors, $500K GMV, $75-100K platform revenue (15% commission)
- **Month 18:** Break-even, 300+ vendors, $1M+ GMV

---

## 2. Product Vision & Objectives {#product-vision}

### Vision Statement
*"To become the definitive discovery and booking platform for authentic Nigerian travel experiences, starting with Detty December and expanding to year-round cultural tourism."*

### Strategic Objectives

**Phase 1 (Months 1-6): Detty December Authority**
- Establish as the #1 search result for "Detty December packages"
- Onboard 25-50 quality vendors
- Process $150K in GMV
- Build trust through reviews and content

**Phase 2 (Months 7-12): Year-Round Expansion**
- Expand to year-round Nigerian experiences
- Add international destinations with Nigerian diaspora appeal
- Launch merchandise line
- Develop content authority (blog, guides, videos)

**Phase 3 (Months 13-18): Platform Maturity**
- Add advanced features (instant booking, mobile app, AI recommendations)
- Expand to West African markets
- Build vendor SaaS tools
- Launch loyalty program

### Success Criteria
1. **Authority:** Top 3 Google ranking for "Detty December" + variations
2. **Liquidity:** 80%+ of listings get booked at least once per season
3. **Trust:** 4.5+ star average rating across platform
4. **Growth:** 15% month-over-month GMV growth
5. **Retention:** 40%+ vendor renewal rate, 25%+ traveler return rate

---

## 3. Market Analysis {#market-analysis}

### Market Size & Opportunity

**Primary Market: Detty December (December)**
- Nigerian diaspora: ~17M globally (US: 400K+, UK: 250K+, Canada: 100K+)
- Average trip spend: $3,000-8,000
- Addressable market: 50K travelers annually
- TAM: $150M-400M

**Secondary Market: Year-Round Nigerian Tourism**
- Inbound tourism: 2.5M visitors annually
- Domestic tourism: Growing middle class (estimated $2B market)
- Cultural events: Lagos Fashion Week, Felabration, Carnival Calabar

**Tertiary Market: African Diaspora Tourism**
- Ghana "Year of Return" model expansion
- Kenya, South Africa, Egypt tourism

### Competitive Landscape

**Direct Competitors:**
- Individual travel agencies (fragmented, no marketplace)
- Facebook groups and WhatsApp listings (unvetted, poor UX)
- General travel platforms (Viator, GetYourGuide - limited Nigeria focus)

**Indirect Competitors:**
- Airbnb Experiences (minimal Nigeria presence)
- Direct hotel/event bookings
- Travel agents in diaspora communities

**Competitive Advantage:**
- **Niche Focus:** Only platform dedicated to Nigerian/Detty December experiences
- **Curation:** Vetted vendors, quality control
- **Community:** Built-in trust through reviews and content
- **Local Expertise:** Deep understanding of Nigerian hospitality ecosystem
- **Technology:** Modern stack enabling superior UX

---

## 4. User Personas {#user-personas}

### Primary Personas

#### **Persona 1: Diaspora Returnee (Traveler)**
**Name:** Chioma, 32  
**Location:** Houston, TX  
**Income:** $85K/year  
**Behavior:**
- Returns to Nigeria for December every 2-3 years
- Follows Nigerian influencers and blogs
- Values convenience and safety
- Willing to pay premium for curated experiences
- Books 2-4 months in advance

**Pain Points:**
- Overwhelmed by options, doesn't know who to trust
- Concerned about safety and reliability
- Wants authentic experiences, not tourist traps
- Previous bad experiences with unresponsive vendors

**Goals:**
- Find vetted, reliable tour operators
- Book entire trip in one place
- Get recommendations from others like her
- Feel connected to Nigerian culture

**Platform Needs:**
- Clear vendor reviews and ratings
- Detailed itineraries with photos/videos
- Secure payment with refund protection
- WhatsApp/SMS support
- Mobile-friendly booking

---

#### **Persona 2: Young Professional (Traveler)**
**Name:** Jamal, 27  
**Location:** London, UK  
**Income:** £60K/year  
**Behavior:**
- First or second time visiting Nigeria
- Influenced by Afrobeats music and culture
- Active on Instagram/TikTok
- Travels with friend group (4-6 people)
- Books 1-2 months in advance

**Pain Points:**
- Doesn't know where to start planning
- Worried about being scammed
- Wants "Instagrammable" experiences
- Limited knowledge of Nigerian geography/logistics

**Goals:**
- Discover trending experiences
- Book group packages
- Get itinerary inspiration
- Share experiences on social media

**Platform Needs:**
- Visual discovery (photos/videos)
- Group booking options
- Flexible cancellation
- Social proof (influencer endorsements)
- Event calendar integration

---

#### **Persona 3: Boutique Travel Agency (Vendor)**
**Name:** Tunde, 38  
**Business:** Lagos Luxury Tours (8 years in business)  
**Revenue:** $200K/year  
**Team Size:** 5 people  
**Behavior:**
- Currently markets through Instagram, referrals, and Facebook groups
- Manages bookings via WhatsApp and email (chaotic)
- Loses 30% of leads due to poor follow-up
- Wants to scale but limited by manual processes

**Pain Points:**
- No centralized booking system
- Spends too much time on customer service
- Difficult to reach new customers beyond referrals
- Payment processing is manual and risky
- Hard to manage inventory and availability

**Goals:**
- Increase bookings by 50%+
- Automate booking and payment processing
- Reach international audience
- Build brand credibility
- Reduce operational overhead

**Platform Needs:**
- Easy listing creation (templates)
- Calendar/availability management
- Automated booking confirmations
- Payment processing with escrow protection
- Customer communication tools
- Analytics dashboard

---

#### **Persona 4: Event Organizer (Vendor)**
**Name:** Kemi, 41  
**Business:** Detty Rave Events (3 years)  
**Revenue:** $500K/year (seasonal)  
**Team Size:** 15 contractors  
**Behavior:**
- Organizes large-scale events (concerts, parties, boat cruises)
- Sells tickets directly and through promoters
- 60% of revenue in December
- Strong Instagram presence (50K followers)

**Pain Points:**
- Ticket sales plateau with current audience
- High promoter commissions (20-30%)
- Fraudulent ticket resellers
- Wants to sell packages (event + hotel + transport) but no platform

**Goals:**
- Sell to international audience
- Create bundled experiences
- Reduce dependency on promoters
- Build direct customer relationships
- Extend season beyond December

**Platform Needs:**
- Event listing with ticketing
- Bundle creation (event + accommodations)
- Inventory management
- Fraud prevention
- Marketing tools
- Data on customer preferences

---

### Secondary Personas

**Persona 5: International Tourist** (Non-Nigerian, culture enthusiast)  
**Persona 6: Corporate Event Planner** (booking team retreats)  
**Persona 7: Hotel/Accommodation Provider** (vendor)  
**Persona 8: Transportation Company** (vendor)

---

## 5. Product Architecture {#product-architecture}

### Tech Stack Overview

```
┌─────────────────────────────────────────────────┐
│                  FRONTEND LAYER                  │
│  Next.js 14+ (App Router) + TypeScript + Tailwind│
│              Hosted on Vercel                    │
└─────────────────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────┐
│                  EDGE LAYER                      │
│  Cloudflare (CDN, DDoS Protection, WAF)         │
│  + Cloudflare Pages (static assets)              │
└─────────────────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────┐
│              BACKEND/DATABASE LAYER              │
│         Supabase (PostgreSQL + Auth)             │
│    + Supabase Storage + Edge Functions           │
└─────────────────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────┐
│             THIRD-PARTY SERVICES                 │
│  Paystack (Local) + Stripe (International)      │
│  Cloudinary/Uploadcare (Media)                   │
│  Resend/SendGrid (Email)                         │
│  Twilio (SMS/WhatsApp)                           │
│  Google Maps API                                 │
│  Algolia (Search - optional)                     │
└─────────────────────────────────────────────────┘
```

### System Architecture Rationale

**Next.js 14+ (App Router)**
- Server components for performance
- Built-in SEO optimization (critical for authority goal)
- API routes for backend logic
- Image optimization
- TypeScript for type safety

**Supabase**
- PostgreSQL: Robust relational database
- Row Level Security (RLS): Built-in multi-tenancy
- Realtime subscriptions: Live availability updates
- Storage: User-generated content (photos, documents)
- Edge Functions: Serverless backend logic
- Auth: Social logins, magic links, JWT

**Vercel**
- Automatic deployments from Git
- Edge network for global performance
- Preview deployments for testing
- Environment variables management
- Analytics

**Cloudflare**
- Global CDN (critical for international users)
- DDoS protection
- SSL/TLS
- Rate limiting
- Image optimization
- Web Application Firewall

### High-Level System Components

```
┌──────────────────────────────────────────────────┐
│              PUBLIC-FACING SITE                   │
├──────────────────────────────────────────────────┤
│ • Homepage & Landing Pages                       │
│ • Search & Discovery                             │
│ • Listing Detail Pages                           │
│ • Checkout Flow                                  │
│ • User Profiles & Reviews                        │
│ • Blog & Content Hub                             │
│ • Merchandise Store                              │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│              VENDOR DASHBOARD                     │
├──────────────────────────────────────────────────┤
│ • Listing Management                             │
│ • Calendar & Availability                        │
│ • Booking Management                             │
│ • Analytics & Reporting                          │
│ • Messaging/Customer Communication               │
│ • Payout Management                              │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│              ADMIN PORTAL                         │
├──────────────────────────────────────────────────┤
│ • Vendor Verification                            │
│ • Content Moderation                             │
│ • Dispute Resolution                             │
│ • Platform Analytics                             │
│ • CMS for Blog/Content                           │
│ • Commission Management                          │
└──────────────────────────────────────────────────┘
```

---

## 6. Core Features & Requirements {#core-features}

### 6.1 MVP Features (Phase 1 - Months 1-3)

#### **6.1.1 User Authentication & Profiles**

**Traveler Accounts**
- Email/password registration
- Social login (Google, Facebook, Apple)
- Magic link authentication
- Profile management:
  - Name, photo, bio
  - Travel preferences
  - Saved listings
  - Booking history
  - Reviews written
- Email verification required for booking
- Password reset flow

**Vendor Accounts**
- Email/password registration
- Two-factor authentication (required)
- Business profile:
  - Business name, logo, cover photo
  - Business description (500 words max)
  - Business type (travel agency, event organizer, hotel, etc.)
  - Location (city/state)
  - Contact information (phone, email, website, social media)
  - Business documents (CAC registration, licenses)
  - Banking information for payouts
- Verification status badge
- Public vendor profile page

**Admin Accounts**
- Role-based access control (Super Admin, Moderator, Support)
- Audit logs for all admin actions

---

#### **6.1.2 Listing Creation & Management (Vendor)**

**Listing Types**
1. **Tour/Experience** (multi-day or single-day)
2. **Event Ticket** (specific date/time)
3. **Package Deal** (bundled experiences)
4. **Accommodation** (hotel, villa, apartment)

**Required Fields**
- Title (max 100 characters)
- Description (min 200, max 2000 words)
- Category (Cultural, Adventure, Nightlife, Wellness, Food & Drink, etc.)
- Location (city, neighborhood, specific address)
- Duration (hours/days)
- Group size (min/max participants)
- Pricing:
  - Base price per person
  - Group discounts (optional)
  - Early bird pricing (optional)
  - Currency (NGN, USD, GBP, EUR)
- Availability:
  - Date ranges
  - Specific dates
  - Recurring schedule
  - Blackout dates
- Photos (min 5, max 20, min resolution 1920x1080)
- Video (optional, max 2 minutes)
- What's included/excluded
- Meeting point
- Cancellation policy (flexible, moderate, strict)
- Languages offered
- Age requirements
- Accessibility information
- Safety measures

**Optional Fields**
- Itinerary builder (day-by-day breakdown)
- FAQ section
- Special requirements
- What to bring
- Dietary options

**Listing Dashboard Features**
- Draft system (save incomplete listings)
- Preview mode
- Duplicate listing
- Archive/deactivate listing
- Performance analytics per listing
- Edit availability calendar
- Bulk availability updates

---

#### **6.1.3 Search & Discovery**

**Search Functionality**
- Full-text search across titles and descriptions
- Auto-complete suggestions
- Recent searches
- Popular searches

**Filter Options**
- Date range
- Price range
- Category/activity type
- Location
- Duration
- Group size
- Rating (4+ stars, 4.5+ stars)
- Language
- Instant booking available
- Free cancellation

**Sort Options**
- Relevance (default)
- Price: Low to High
- Price: High to Low
- Highest Rated
- Most Popular
- Newest

**Discovery Features**
- "Trending Experiences" section
- "Popular in December" section
- "Top-Rated Vendors" section
- "New Listings" section
- Category browsing
- Location-based browsing
- Curated collections (e.g., "Best Nightlife Experiences", "Family-Friendly Tours")

**Search Results Display**
- Grid view (default, 3 columns desktop, 2 mobile)
- List view option
- Map view with pins
- Infinite scroll pagination
- Save to wishlist (heart icon)
- Quick view modal (hover/click)

---

#### **6.1.4 Listing Detail Page**

**Page Structure**

**Hero Section**
- Image gallery (carousel with thumbnails)
- Video player (if available)
- Price display (prominent)
- "Book Now" CTA (sticky on mobile)
- Save to wishlist
- Share buttons

**Overview Section**
- Title
- Location (with map link)
- Rating + number of reviews
- Vendor name + verification badge
- Duration, group size, languages
- "Hosted by [Vendor]" with mini profile

**About This Experience**
- Full description
- What's included
- What's not included
- What to bring
- Meeting point details
- Itinerary (if multi-day)

**Availability & Booking**
- Calendar picker
- Time slots (if applicable)
- Guest counter
- Price breakdown
- Add-ons (optional extras)
- "Check Availability" or "Book Now" button

**Host Information**
- Vendor photo and bio
- Response time
- Response rate
- Member since
- Number of experiences hosted
- Link to vendor profile
- "Contact Host" button

**Reviews Section**
- Overall rating (stars)
- Rating breakdown (5-star, 4-star, etc.)
- Review highlights (auto-extracted)
- Recent reviews (5 most recent)
- "See all reviews" link
- Ability to filter reviews

**Location**
- Embedded Google Map
- Neighborhood description
- Nearby attractions

**Cancellation Policy**
- Clear policy display
- Refund calculator

**Safety & Trust**
- Safety measures
- COVID-19 protocols (if applicable)
- Insurance information
- Emergency contact

**FAQ**
- Accordion-style Q&A
- Vendor-defined FAQs
- Auto-generated FAQs based on common questions

---

#### **6.1.5 Booking Flow**

**Step 1: Select Date & Guests**
- Calendar picker
- Number of guests
- Add-ons selection
- Real-time availability check
- Price calculation with breakdown

**Step 2: Guest Information**
- Lead traveler details (auto-fill from profile)
- Additional guest details (if required)
- Special requests/notes
- Emergency contact

**Step 3: Payment**
- Payment method selection:
  - Credit/Debit card (Stripe)
  - Paystack (local cards)
  - Bank transfer (manual, for high-value bookings)
- Billing address
- Apply promo code
- Price summary:
  - Listing price
  - Service fee (15-20%)
  - Taxes (if applicable)
  - Total
- Payment security badges
- Terms & conditions checkbox

**Step 4: Confirmation**
- Booking confirmation number
- Email confirmation sent
- SMS notification (optional)
- Download booking voucher (PDF)
- Add to calendar
- What's next instructions
- Contact host button
- View booking in dashboard

**Technical Requirements**
- Stripe Connect for international payments
- Paystack for Nigerian payments
- Payment escrow (hold funds until experience completion)
- Automatic refunds based on cancellation policy
- Multi-currency support
- Dynamic currency conversion
- PCI compliance

---

#### **6.1.6 User Dashboard (Traveler)**

**My Bookings**
- Upcoming bookings (cards with key info)
- Past bookings
- Cancelled bookings
- Booking details:
  - Booking reference
  - QR code for check-in
  - Host contact information
  - Directions/meeting point
  - Countdown timer to experience
  - "Need Help" button
  - Cancel booking
  - Modify booking (if allowed)

**My Wishlist**
- Saved listings grid
- Remove from wishlist
- Share wishlist
- "Book" CTA on each item

**My Reviews**
- Reviews written
- Reviews pending
- Prompt to review after completed bookings

**Account Settings**
- Profile information
- Password change
- Email preferences
- Notification settings (email, SMS, push)
- Payment methods
- Delete account

**Messages**
- Inbox (conversations with vendors)
- Unread message indicator
- Real-time messaging

---

#### **6.1.7 Vendor Dashboard**

**Overview/Home**
- Key metrics cards:
  - Total earnings (MTD, YTD)
  - Pending bookings
  - Upcoming experiences
  - Average rating
  - Response rate
  - Views/clicks
- Quick actions (create listing, view calendar, check messages)
- Recent activity feed
- Alerts/notifications

**My Listings**
- All listings table/grid
- Status indicators (Published, Draft, Under Review, Inactive)
- Quick edit
- Duplicate
- Analytics per listing
- Create new listing button

**Calendar**
- Month/week/day view
- Color-coded bookings
- Availability editor
- Block dates
- Sync with external calendar (iCal)
- Booking details on click

**Bookings**
- Upcoming tab
- Past tab
- Cancelled tab
- Booking cards with:
  - Guest name and details
  - Date/time
  - Number of guests
  - Booking reference
  - Payment status
  - QR code scanner for check-in
  - Contact guest button
  - Mark as completed
  - Report issue

**Messages**
- Inbox
- Template responses (quick replies)
- Automated messages (booking confirmations, reminders)
- Response time tracker

**Reviews & Ratings**
- All reviews
- Average rating trend
- Response to reviews
- Review notifications

**Earnings & Payouts**
- Earnings overview (by date range)
- Payout history
- Next payout date
- Payout method management
- Download statements
- Tax documents

**Analytics**
- Views over time
- Conversion rate
- Revenue trend
- Top-performing listings
- Booking sources
- Guest demographics
- Export data (CSV)

**Settings**
- Business profile
- Notification preferences
- Payout settings
- Tax information
- Team members (if multi-user access)
- Subscription/plan (for premium features)

---

#### **6.1.8 Reviews & Ratings**

**Review System**
- 5-star rating system
- Written review (optional, max 500 words)
- Photo upload (up to 5 photos)
- Review prompts:
  - Accuracy of listing
  - Communication
  - Value for money
  - Overall experience

**Review Submission**
- Prompt sent 24 hours after experience completion
- 14-day window to submit
- Cannot submit without completing experience
- One review per booking

**Review Display**
- Vendor average rating (visible on listings and profile)
- Individual reviews on listing page
- Verified booking badge on reviews
- Helpful/Not helpful voting on reviews
- Report inappropriate review

**Vendor Response**
- Vendors can respond to reviews once
- Response displayed below review
- Response time tracked

**Review Moderation**
- Automated profanity filter
- Manual review flag system
- Admin review queue

---

#### **6.1.9 Messaging System**

**Features**
- Real-time messaging between travelers and vendors
- Message before booking (inquiry)
- Message after booking (coordination)
- Unread indicators
- Email notification for new messages
- Mobile push notifications
- Message templates for vendors
- Attachment support (images, PDFs)
- Message search

**Rules**
- No sharing of contact info until booking confirmed (to prevent circumvention)
- Automated prompts (e.g., "Did [Vendor] respond to your question?")
- Archive conversations
- Report inappropriate messages

---

#### **6.1.10 Admin Portal**

**Vendor Management**
- Vendor list (all, pending verification, verified, suspended)
- Vendor verification workflow:
  - Document review
  - Background check
  - Approve/reject with notes
- Vendor suspension/ban
- Commission rate override per vendor

**Listing Moderation**
- Listing queue (pending approval)
- Approve/reject listings
- Request changes
- Featured listings management
- Remove listings

**Booking Management**
- All bookings overview
- Refund processing
- Dispute resolution
- Booking modifications

**User Management**
- User list
- Ban/suspend users
- Password reset for users
- Impersonate user (for support)

**Review Moderation**
- Flagged reviews queue
- Remove inappropriate reviews
- Ban review spammers

**Content Management**
- Blog post CMS (create, edit, publish)
- Homepage content editor
- Email templates
- Legal pages (T&Cs, Privacy Policy)

**Analytics Dashboard**
- Platform-wide metrics
- GMV tracking
- Commission revenue
- User growth
- Vendor growth
- Top listings
- Top vendors
- Top travelers
- Geographic distribution

**Finance**
- Payout processing
- Commission tracking
- Refund management
- Financial reports

---

### 6.2 Phase 2 Features (Months 4-6)

#### **6.2.1 Merchandise Store**
- Product catalog (t-shirts, hats, accessories)
- Shopify/WooCommerce integration OR custom build
- Inventory management
- Order fulfillment
- Shipping integration

#### **6.2.2 Blog & Content Hub**
- SEO-optimized blog
- Travel guides
- Vendor spotlights
- Event coverage
- Newsletter integration
- Social sharing

#### **6.2.3 Instant Booking**
- One-click booking for eligible listings
- No vendor approval needed
- Faster checkout

#### **6.2.4 Mobile App (PWA)**
- Installable Progressive Web App
- Push notifications
- Offline viewing of booked experiences
- QR code scanning
- Mobile-optimized booking flow

#### **6.2.5 Loyalty Program**
- Points for bookings
- Referral bonuses
- Tier system (Bronze, Silver, Gold)
- Exclusive perks

---

### 6.3 Phase 3 Features (Months 7-12)

#### **6.3.1 Advanced Search**
- AI-powered recommendations
- "Trips similar to this"
- Personalized homepage based on behavior
- Save search alerts

#### **6.3.2 Vendor Tools**
- Multi-user access (team accounts)
- API access for integrations
- Advanced analytics
- Dynamic pricing suggestions
- Promotional tools (discounts, flash sales)

#### **6.3.3 Group Bookings**
- Special group booking flow
- Group chat for travelers
- Split payment
- Group leader management

#### **6.3.4 Insurance & Protection**
- Travel insurance integration
- Booking protection
- Vendor liability insurance

#### **6.3.5 Multi-language Support**
- English (default)
- French
- Portuguese
- Spanish

---

## 7. Technical Specifications {#technical-specifications}

### 7.1 Database Schema (Supabase PostgreSQL)

```sql
-- USERS TABLE (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  user_type VARCHAR(20) CHECK (user_type IN ('traveler', 'vendor', 'admin')),
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  avatar_url TEXT,
  bio TEXT,
  location VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- VENDOR PROFILES
CREATE TABLE vendor_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  business_name VARCHAR(200) NOT NULL,
  business_type VARCHAR(50),
  business_description TEXT,
  business_logo_url TEXT,
  business_cover_url TEXT,
  business_address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Nigeria',
  business_email VARCHAR(255),
  business_phone VARCHAR(20),
  website_url TEXT,
  social_instagram VARCHAR(100),
  social_facebook VARCHAR(100),
  social_twitter VARCHAR(100),
  cac_number VARCHAR(50),
  cac_document_url TEXT,
  license_document_url TEXT,
  bank_name VARCHAR(100),
  account_number VARCHAR(20),
  account_name VARCHAR(100),
  verification_status VARCHAR(20) CHECK (verification_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  verification_notes TEXT,
  verified_at TIMESTAMPTZ,
  response_rate DECIMAL(5,2) DEFAULT 0.00,
  response_time_hours INTEGER DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0.00,
  commission_rate DECIMAL(5,2) DEFAULT 15.00,
  is_featured BOOLEAN DEFAULT FALSE,
  is_suspended BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- LISTINGS
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  listing_type VARCHAR(20) CHECK (listing_type IN ('tour', 'event', 'package', 'accommodation')),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(250) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50),
  subcategory VARCHAR(50),
  location_city VARCHAR(100),
  location_state VARCHAR(100),
  location_country VARCHAR(100) DEFAULT 'Nigeria',
  location_address TEXT,
  location_lat DECIMAL(10,8),
  location_lng DECIMAL(11,8),
  duration_value INTEGER,
  duration_unit VARCHAR(10) CHECK (duration_unit IN ('hours', 'days')),
  group_size_min INTEGER DEFAULT 1,
  group_size_max INTEGER,
  price_base DECIMAL(10,2) NOT NULL,
  price_currency VARCHAR(3) DEFAULT 'NGN',
  price_per VARCHAR(10) CHECK (price_per IN ('person', 'group')) DEFAULT 'person',
  instant_booking BOOLEAN DEFAULT FALSE,
  languages TEXT[], -- Array of language codes
  age_min INTEGER,
  age_max INTEGER,
  accessibility_info TEXT,
  cancellation_policy VARCHAR(20) CHECK (cancellation_policy IN ('flexible', 'moderate', 'strict')) DEFAULT 'moderate',
  included_items TEXT[], -- Array of included items
  excluded_items TEXT[], -- Array of excluded items
  what_to_bring TEXT[], -- Array of items to bring
  meeting_point TEXT,
  safety_measures TEXT[],
  status VARCHAR(20) CHECK (status IN ('draft', 'pending_review', 'published', 'rejected', 'archived')) DEFAULT 'draft',
  rejection_reason TEXT,
  published_at TIMESTAMPTZ,
  views_count INTEGER DEFAULT 0,
  favorites_count INTEGER DEFAULT 0,
  bookings_count INTEGER DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0.00,
  is_featured BOOLEAN DEFAULT FALSE,
  featured_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- LISTING IMAGES
CREATE TABLE listing_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_order INTEGER DEFAULT 0,
  caption TEXT,
  is_cover BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- LISTING ITINERARY (for multi-day tours)
CREATE TABLE listing_itinerary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  title VARCHAR(200),
  description TEXT,
  activities TEXT[],
  meals_included TEXT[],
  accommodation_type VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- LISTING FAQS
CREATE TABLE listing_faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- LISTING AVAILABILITY
CREATE TABLE listing_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time_slot TIME, -- NULL for all-day experiences
  available_spots INTEGER NOT NULL,
  booked_spots INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  price_override DECIMAL(10,2), -- Optional price override for specific dates
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(listing_id, date, time_slot)
);

-- BOOKINGS
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_reference VARCHAR(20) UNIQUE NOT NULL,
  listing_id UUID REFERENCES listings(id),
  vendor_id UUID REFERENCES vendor_profiles(id),
  traveler_id UUID REFERENCES profiles(id),
  booking_date DATE NOT NULL,
  booking_time TIME,
  number_of_guests INTEGER NOT NULL,
  lead_traveler_name VARCHAR(100) NOT NULL,
  lead_traveler_email VARCHAR(255) NOT NULL,
  lead_traveler_phone VARCHAR(20),
  additional_guests JSONB, -- Array of guest objects
  special_requests TEXT,
  emergency_contact JSONB, -- Contact object
  status VARCHAR(20) CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'refunded')) DEFAULT 'pending',
  cancellation_reason TEXT,
  cancelled_at TIMESTAMPTZ,
  cancelled_by UUID REFERENCES profiles(id),
  completed_at TIMESTAMPTZ,
  -- Pricing
  base_price DECIMAL(10,2) NOT NULL,
  service_fee DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0.00,
  discount_amount DECIMAL(10,2) DEFAULT 0.00,
  total_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'NGN',
  -- Payment
  payment_status VARCHAR(20) CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
  payment_method VARCHAR(50),
  payment_provider VARCHAR(20) CHECK (payment_provider IN ('stripe', 'paystack')),
  payment_intent_id VARCHAR(255),
  payment_date TIMESTAMPTZ,
  refund_amount DECIMAL(10,2),
  refund_date TIMESTAMPTZ,
  -- Payout
  payout_status VARCHAR(20) CHECK (payout_status IN ('pending', 'processing', 'paid')) DEFAULT 'pending',
  payout_amount DECIMAL(10,2),
  payout_date TIMESTAMPTZ,
  platform_fee DECIMAL(10,2),
  vendor_earnings DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- REVIEWS
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE UNIQUE,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating_overall INTEGER CHECK (rating_overall BETWEEN 1 AND 5) NOT NULL,
  rating_accuracy INTEGER CHECK (rating_accuracy BETWEEN 1 AND 5),
  rating_communication INTEGER CHECK (rating_communication BETWEEN 1 AND 5),
  rating_value INTEGER CHECK (rating_value BETWEEN 1 AND 5),
  review_text TEXT,
  review_photos TEXT[], -- Array of image URLs
  vendor_response TEXT,
  vendor_response_date TIMESTAMPTZ,
  helpful_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_flagged BOOLEAN DEFAULT FALSE,
  flag_reason TEXT,
  status VARCHAR(20) CHECK (status IN ('pending', 'published', 'removed')) DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MESSAGES
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  traveler_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listings(id),
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(traveler_id, vendor_id, listing_id)
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id),
  sender_type VARCHAR(20) CHECK (sender_type IN ('traveler', 'vendor', 'system')),
  message_text TEXT NOT NULL,
  attachments TEXT[], -- Array of file URLs
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- WISHLISTS
CREATE TABLE wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- PROMO CODES
CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  discount_type VARCHAR(20) CHECK (discount_type IN ('percentage', 'fixed')) NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3), -- Required if discount_type is 'fixed'
  min_booking_amount DECIMAL(10,2),
  max_discount_amount DECIMAL(10,2),
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ NOT NULL,
  valid_until TIMESTAMPTZ NOT NULL,
  applicable_to VARCHAR(20) CHECK (applicable_to IN ('all', 'listings', 'vendors')),
  applicable_ids UUID[], -- Array of listing or vendor IDs
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BLOG POSTS
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES profiles(id),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(250) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  category VARCHAR(50),
  tags TEXT[],
  status VARCHAR(20) CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  views_count INTEGER DEFAULT 0,
  reading_time_minutes INTEGER,
  seo_title VARCHAR(200),
  seo_description TEXT,
  seo_keywords TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MERCHANDISE (Phase 2)
CREATE TABLE merchandise_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(250) UNIQUE NOT NULL,
  description TEXT,
  category VARCHAR(50),
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'NGN',
  sku VARCHAR(50) UNIQUE,
  inventory_count INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 10,
  images TEXT[], -- Array of image URLs
  sizes TEXT[], -- e.g., ['S', 'M', 'L', 'XL']
  colors TEXT[],
  is_available BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MERCHANDISE ORDERS (Phase 2)
CREATE TABLE merchandise_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(20) UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id),
  items JSONB NOT NULL, -- Array of order items
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_fee DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'NGN',
  shipping_address JSONB NOT NULL,
  payment_status VARCHAR(20) CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
  payment_method VARCHAR(50),
  fulfillment_status VARCHAR(20) CHECK (fulfillment_status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending',
  tracking_number VARCHAR(100),
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES for performance
CREATE INDEX idx_listings_vendor ON listings(vendor_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_category ON listings(category);
CREATE INDEX idx_listings_location ON listings(location_city, location_state);
CREATE INDEX idx_listings_published ON listings(published_at DESC);
CREATE INDEX idx_bookings_vendor ON bookings(vendor_id);
CREATE INDEX idx_bookings_traveler ON bookings(traveler_id);
CREATE INDEX idx_bookings_listing ON bookings(listing_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_reviews_listing ON reviews(listing_id);
CREATE INDEX idx_reviews_vendor ON reviews(vendor_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published ON blog_posts(published_at DESC);

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Example RLS policy (vendors can only see their own bookings)
CREATE POLICY "Vendors can view own bookings"
  ON bookings FOR SELECT
  USING (vendor_id IN (
    SELECT id FROM vendor_profiles WHERE user_id = auth.uid()
  ));
```

---

### 7.2 API Endpoints Architecture

#### **Public API (Next.js API Routes)**

```
GET    /api/listings                    # Search/browse listings
GET    /api/listings/[id]               # Get listing details
GET    /api/listings/[id]/availability  # Check availability
GET    /api/vendors/[id]                # Get vendor profile
GET    /api/vendors/[id]/listings       # Get vendor's listings
GET    /api/reviews/[listingId]         # Get listing reviews
GET    /api/blog                        # Get blog posts
GET    /api/blog/[slug]                 # Get blog post
```

#### **Authenticated API**

```
# Traveler endpoints
POST   /api/bookings                    # Create booking
GET    /api/bookings/[id]               # Get booking details
PUT    /api/bookings/[id]/cancel        # Cancel booking
POST   /api/reviews                     # Submit review
GET    /api/user/bookings               # Get user's bookings
GET    /api/user/wishlist               # Get wishlist
POST   /api/user/wishlist               # Add to wishlist
DELETE /api/user/wishlist/[id]          # Remove from wishlist
POST   /api/messages                    # Send message
GET    /api/messages/conversations      # Get conversations

# Vendor endpoints
POST   /api/vendor/listings             # Create listing
PUT    /api/vendor/listings/[id]        # Update listing
GET    /api/vendor/listings             # Get vendor's listings
POST   /api/vendor/listings/[id]/availability # Update availability
GET    /api/vendor/bookings             # Get vendor's bookings
PUT    /api/vendor/bookings/[id]        # Update booking status
GET    /api/vendor/analytics            # Get analytics
GET    /api/vendor/earnings             # Get earnings data
POST   /api/vendor/payout-request       # Request payout

# Admin endpoints
GET    /api/admin/vendors               # List vendors
PUT    /api/admin/vendors/[id]/verify   # Verify vendor
GET    /api/admin/listings/pending      # Pending listings
PUT    /api/admin/listings/[id]/approve # Approve listing
GET    /api/admin/bookings              # All bookings
GET    /api/admin/analytics             # Platform analytics
POST   /api/admin/payouts/process       # Process payouts
```

#### **Webhooks**

```
POST   /api/webhooks/stripe             # Stripe payment webhooks
POST   /api/webhooks/paystack           # Paystack payment webhooks
```

---

### 7.3 Supabase Edge Functions

```typescript
// functions/process-booking/index.ts
// Triggered after successful payment
// - Updates booking status
// - Reduces availability
// - Sends confirmation emails
// - Notifies vendor
// - Updates vendor stats

// functions/check-review-eligibility/index.ts
// Triggered after booking completion date
// - Sends review request email
// - Updates booking status

// functions/calculate-payouts/index.ts
// Runs daily
// - Calculates vendor earnings for completed bookings
// - Deducts platform commission
// - Updates payout status

// functions/send-booking-reminders/index.ts
// Runs daily
// - Sends reminder emails to travelers 48hrs and 24hrs before experience
// - Sends SMS reminders

// functions/auto-complete-bookings/index.ts
// Runs daily
// - Marks bookings as completed if experience date has passed
// - Triggers review requests
```

---

### 7.4 Payment Integration

#### **Stripe Connect (International Payments)**
```typescript
// Setup
- Create platform Stripe account
- Enable Stripe Connect
- Create Connected Accounts for each vendor
- Use "Separate charges and transfers" pattern
- Hold funds in escrow until experience completion

// Flow
1. Traveler pays → Platform receives full amount
2. Platform holds funds
3. After experience completion → Transfer to vendor (minus commission)
4. If cancelled → Refund to traveler based on policy
```

#### **Paystack (Nigerian Payments)**
```typescript
// Setup
- Paystack Subaccounts for each vendor
- Split payment configuration
- Platform takes commission upfront
- Vendor receives their portion

// Flow
1. Traveler pays via Paystack
2. Payment split automatically:
   - Platform commission (15-20%)
   - Vendor earnings (80-85%)
3. Funds settle to respective accounts
```

---

### 7.5 File Storage (Supabase Storage)

**Buckets:**
- `avatars` - User profile photos (public)
- `vendor-documents` - Business documents, licenses (private)
- `listing-images` - Listing photos (public)
- `listing-videos` - Listing videos (public)
- `review-photos` - Review photos (public)
- `merchandise-images` - Product photos (public)
- `blog-images` - Blog post images (public)

**Policies:**
- Image optimization: Auto-convert to WebP, resize
- Max file sizes: Images 5MB, Videos 50MB, Documents 10MB
- CDN caching through Cloudflare

---

### 7.6 Email Service (Resend/SendGrid)

**Transactional Emails:**
- Welcome email
- Email verification
- Password reset
- Booking confirmation (traveler)
- Booking notification (vendor)
- Booking reminder (48hrs, 24hrs before)
- Booking cancellation
- Review request
- Payout notification
- Message notification

**Marketing Emails:**
- Newsletter
- Promotional offers
- New listings alerts
- Seasonal campaigns

---

### 7.7 Search Implementation

**Phase 1: PostgreSQL Full-Text Search**
```sql
-- Add search vectors to listings table
ALTER TABLE listings ADD COLUMN search_vector tsvector;

-- Create trigger to auto-update search vector
CREATE OR REPLACE FUNCTION listings_search_trigger()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.category, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_listings_search
BEFORE INSERT OR UPDATE ON listings
FOR EACH ROW EXECUTE FUNCTION listings_search_trigger();

-- Create GIN index
CREATE INDEX idx_listings_search ON listings USING GIN(search_vector);
```

**Phase 2: Algolia (Optional upgrade)**
- Better search relevance
- Typo tolerance
- Instant results
- Faceted search

---

### 7.8 SEO Strategy

**Technical SEO:**
- Server-side rendering (Next.js)
- Dynamic sitemaps
- Structured data (JSON-LD):
  - Organization
  - BreadcrumbList
  - Product (for listings)
  - Review
  - Event
- Open Graph tags
- Twitter Cards
- Robots.txt
- Canonical URLs

**Content SEO:**
- Target keywords:
  - "Detty December packages"
  - "Nigeria travel tours"
  - "Lagos December events"
  - "Nigeria cultural tours"
  - "[City] things to do"
- Blog content calendar
- Long-form guides (2000+ words)
- Local SEO (Google Business Profile)

**Performance:**
- Core Web Vitals optimization
- Image lazy loading
- Code splitting
- CDN caching (Cloudflare)
- Target: <2s page load

---

## 8. Data Models {#data-models}

### Core Entities

```
User
├── Profile (traveler, vendor, admin)
├── Bookings (as traveler)
├── Wishlists
├── Reviews
└── Messages

Vendor Profile
├── Business Info
├── Verification Status
├── Listings
├── Bookings
├── Reviews
├── Earnings
└── Payout Info

Listing
├── Basic Info (title, description, category)
├── Location
├── Pricing
├── Availability
├── Images
├── Itinerary
├── FAQs
├── Reviews
└── Bookings

Booking
├── Listing Reference
├── Vendor Reference
├── Traveler Reference
├── Guest Details
├── Pricing Breakdown
├── Payment Info
├── Status
└── Review

Review
├── Booking Reference
├── Ratings (overall, accuracy, communication, value)
├── Review Text
├── Photos
└── Vendor Response
```

---

## 9. User Flows {#user-flows}

### 9.1 Traveler Journey: Discovery to Booking

```
1. Landing Page
   ↓
2. Search/Browse (with filters)
   ↓
3. View Search Results
   ↓
4. Click Listing
   ↓
5. View Listing Details
   ├→ Save to Wishlist (optional)
   ├→ Share (optional)
   └→ Continue to Booking
   ↓
6. Check Availability
   ↓
7. Select Date & Guests
   ↓
8. Sign In/Register (if not logged in)
   ↓
9. Enter Guest Details
   ↓
10. Payment
   ↓
11. Confirmation
   ↓
12. Receive Confirmation Email
   ↓
13. View in Dashboard
   ↓
14. Receive Reminder Emails
   ↓
15. Attend Experience
   ↓
16. Mark as Completed
   ↓
17. Receive Review Request
   ↓
18. Submit Review
```

### 9.2 Vendor Journey: Onboarding to Payout

```
1. Landing Page / Vendor CTA
   ↓
2. "Become a Host" Page
   ↓
3. Sign Up
   ↓
4. Complete Vendor Profile
   ↓
5. Upload Business Documents
   ↓
6. Submit for Verification
   ↓
7. Await Admin Approval (1-3 days)
   ↓
8. Verification Approved
   ↓
9. Create First Listing
   ↓
10. Add Photos, Details, Pricing
   ↓
11. Set Availability
   ↓
12. Submit Listing for Review
   ↓
13. Listing Approved
   ↓
14. Listing Goes Live
   ↓
15. Receive Booking
   ↓
16. Confirm Booking
   ↓
17. Communicate with Traveler
   ↓
18. Deliver Experience
   ↓
19. Mark as Completed
   ↓
20. Receive Review
   ↓
21. Respond to Review (optional)
   ↓
22. Earnings Accumulate
   ↓
23. Request Payout
   ↓
24. Receive Payment (Net of Commission)
```

### 9.3 Admin Journey: Vendor Verification

```
1. Admin Dashboard
   ↓
2. Pending Vendors Queue
   ↓
3. Click Vendor for Review
   ↓
4. Review Business Info
   ↓
5. Verify Documents (CAC, licenses)
   ↓
6. Check Business Legitimacy
   ├→ Search online presence
   ├→ Verify address
   └→ Call business (optional)
   ↓
7. Decision
   ├→ Approve
   │  ├→ Set commission rate
   │  ├→ Add verification badge
   │  └→ Send approval email
   │
   └→ Reject
      ├→ Enter rejection reason
      └→ Send rejection email with feedback
```

---

## 10. Revenue Model {#revenue-model}

### Revenue Streams

#### **Primary: Booking Commissions (80% of revenue)**
- **Model:** Take-rate on Gross Merchandise Value (GMV)
- **Commission Rate:** 15-20% of booking value
- **Split:**
  - Base rate: 15% (standard vendors)
  - Premium rate: 12% (high-volume vendors, 50+ bookings)
  - Featured placement: 20% (premium listing visibility)

**Projected Year 1 Commission Revenue:**
```
Scenario: Conservative
- Total GMV: $500,000
- Average commission: 15%
- Platform revenue: $75,000

Scenario: Moderate
- Total GMV: $750,000
- Average commission: 16%
- Platform revenue: $120,000

Scenario: Aggressive
- Total GMV: $1,000,000
- Average commission: 17%
- Platform revenue: $170,000
```

#### **Secondary: Merchandise (10-15% of revenue)**
- **Products:** Branded apparel, accessories, travel gear
- **Margin:** 25-35% after COGS
- **Target Year 1:** $25-30K revenue

#### **Tertiary: Premium Vendor Features (5-10% of revenue)**
- **Featured Listings:** $100-300/month per listing (prominent placement)
- **Priority Support:** $50/month (dedicated account manager, priority review)
- **Advanced Analytics:** $30/month (detailed insights, competitor data)
- **Profile Boost:** $150/month (higher search ranking)
- **Target Year 1:** $10-20K revenue

#### **Affiliate & Partnerships (<5% of revenue)**
- **Travel Insurance:** 10-15% commission on policies sold
- **Flight Bookings:** Partnership with airlines (2-3% commission)
- **Hotel Bookings:** Partner with booking platforms
- **Currency Exchange:** Partnership with forex providers
- **Target Year 1:** $5-10K revenue

#### **Sponsored Content & Advertising (<5% of revenue)**
- **Sponsored Blog Posts:** $500-1,000 per post
- **Banner Ads:** $200-500/month
- **Email Newsletter Sponsorship:** $300-500 per send
- **Vendor Spotlight:** $250 per feature
- **Target Year 1:** $5-10K revenue

---

### Pricing Strategy

#### **Service Fees (Passed to Travelers)**
- **Booking Fee:** 5-10% of listing price (to partially offset platform costs)
- **Processing Fee:** 2.9% + $0.30 (credit card fees)
- **Note:** Clearly displayed before checkout

#### **Example Booking Breakdown**
```
Listing Price: $1,000
Platform Service Fee (8%): $80
Processing Fee (2.9% + $0.30): $31.62
Total Paid by Traveler: $1,111.62

Platform Commission (15% of listing price): $150
Vendor Receives: $850
Platform Net (after processing): $98.38
```

---

### Cost Structure

#### **Fixed Costs (Monthly)**
- **Infrastructure:**
  - Supabase Pro: $25
  - Vercel Pro: $20
  - Cloudflare: $20-50
  - Domain & SSL: $10
  - **Subtotal:** ~$75/month

- **Tools & Services:**
  - Email (Resend): $20
  - SMS (Twilio): $50
  - Storage (Cloudinary): $0-50
  - Monitoring (Sentry): $26
  - Analytics (Mixpanel): $0-50
  - **Subtotal:** ~$150/month

- **Team (Year 1):**
  - Developer (contract/part-time): $3,000-5,000/month
  - Customer Support (contract): $1,000-2,000/month
  - Content Writer: $500-1,000/month
  - **Subtotal:** ~$5,000/month

- **Total Fixed Costs:** ~$5,225/month = $62,700/year

#### **Variable Costs**
- Payment Processing: 2.9% of GMV
- Marketing & Ads: 10-15% of revenue
- Payouts & Refunds: Transaction fees

---

### Break-Even Analysis

**Monthly Break-Even:**
```
Fixed Costs: $5,225
Target Margin: 12% (net of all costs)

Required GMV: $43,541/month
Platform Commission (15%): $6,531
Less Processing Fees (3%): -$1,306
Net Revenue: $5,225 ✓

Annual Break-Even GMV: ~$520,000
Platform Revenue: ~$78,000
```

**Path to Profitability:**
- Month 6: Break-even ($520K annual run-rate)
- Month 12: $75-100K profit ($1M+ GMV)
- Month 18: $200K+ profit ($2M+ GMV)

---

## 11. Success Metrics {#success-metrics}

### North Star Metric
**Gross Merchandise Value (GMV)** - Total value of all bookings processed

### Key Performance Indicators (KPIs)

#### **Marketplace Metrics**
| Metric | Target (Month 3) | Target (Month 6) | Target (Month 12) |
|--------|------------------|------------------|-------------------|
| Active Vendors | 25 | 50 | 100 |
| Live Listings | 50 | 150 | 300 |
| Total Bookings | 30 | 100 | 350 |
| GMV | $75K | $250K | $750K |
| Platform Revenue | $11K | $37.5K | $112.5K |
| Take Rate | 15% | 15% | 15% |

#### **Liquidity Metrics**
- **Listing Utilization:** % of listings with at least 1 booking
  - Target: 60% by Month 6, 75% by Month 12
- **Vendor Active Rate:** % of vendors with active listings
  - Target: 80% by Month 6, 85% by Month 12
- **Repeat Booking Rate:** % of travelers who book 2+ times
  - Target: 15% by Month 12

#### **Quality Metrics**
- **Average Rating:** 4.5+ stars
- **Response Rate:** 90%+ vendors respond within 24 hours
- **Cancellation Rate:** <5% of bookings cancelled by vendors
- **Dispute Rate:** <2% of bookings disputed

#### **Growth Metrics**
- **Monthly GMV Growth:** 15% MoM
- **Vendor Growth:** 10% MoM
- **Traveler Acquisition:** 20% MoM
- **Organic Traffic Growth:** 25% MoM

#### **Engagement Metrics**
- **Avg Session Duration:** 5+ minutes
- **Bounce Rate:** <50%
- **Pages per Session:** 4+
- **Listing CTR:** 10%+
- **Search-to-Book Conversion:** 3-5%

#### **SEO Metrics**
- **Target Rankings (Month 12):**
  - "Detty December" - Top 3
  - "Detty December packages" - #1
  - "Nigeria travel tours" - Top 10
  - "Lagos things to do" - Top 10
- **Organic Traffic:** 50% of total traffic by Month 12
- **Domain Authority:** 30+ by Month 12

#### **Financial Metrics**
- **Customer Acquisition Cost (CAC):** <$30
- **Lifetime Value (LTV):** >$200 (1.5 bookings avg)
- **LTV:CAC Ratio:** >3:1
- **Unit Economics:** Positive by Month 6
- **Gross Margin:** 70%+ (after processing fees)
- **Net Margin:** 15%+ by Month 12

---

### Measurement Tools

**Analytics Stack:**
- **Google Analytics 4:** Website traffic, user behavior
- **Mixpanel:** Event tracking, funnels, cohorts
- **Supabase Analytics:** Database queries, API performance
- **Stripe/Paystack Dashboards:** Payment metrics
- **Custom Admin Dashboard:** Real-time platform metrics

**Dashboards:**
1. **Executive Dashboard:** GMV, revenue, growth rates
2. **Marketplace Health:** Liquidity, quality metrics
3. **Growth Dashboard:** Traffic, conversions, channels
4. **Vendor Dashboard:** Vendor-specific metrics
5. **Financial Dashboard:** Revenue, costs, profitability

---

## 12. Development Roadmap {#development-roadmap}

### Phase 1: MVP (Months 1-3)

**Month 1: Foundation**
- [ ] Project setup (Next.js, Supabase, Tailwind)
- [ ] Database schema implementation
- [ ] Authentication system
- [ ] Basic frontend components library
- [ ] Homepage & About page
- [ ] Vendor onboarding flow (80% complete)
- [ ] Basic listing creation (50% complete)

**Month 2: Core Features**
- [ ] Complete listing creation & management
- [ ] Listing detail pages
- [ ] Search & filter functionality
- [ ] Booking flow (end-to-end)
- [ ] Payment integration (Stripe + Paystack)
- [ ] Vendor dashboard (basic)
- [ ] Traveler dashboard (basic)
- [ ] Email notifications (transactional)

**Month 3: Launch Prep**
- [ ] Reviews & ratings system
- [ ] Messaging system
- [ ] Admin portal (vendor verification)
- [ ] Availability management
- [ ] Mobile responsiveness
- [ ] SEO optimization
- [ ] Content pages (How It Works, FAQ, T&Cs)
- [ ] Load testing
- [ ] Security audit
- [ ] **LAUNCH:** Soft launch to 10 beta vendors

**Deliverables by End of Phase 1:**
- Functional two-sided marketplace
- 25+ vendors onboarded
- 50+ listings live
- 30+ bookings processed
- $75K GMV

---

### Phase 2: Growth & Optimization (Months 4-6)

**Month 4: Enhance UX**
- [ ] Advanced search filters
- [ ] Wishlist functionality
- [ ] Social sharing
- [ ] Improved vendor analytics
- [ ] Performance optimization
- [ ] A/B testing framework
- [ ] Blog CMS
- [ ] Content marketing (10+ blog posts)

**Month 5: Revenue Expansion**
- [ ] Merchandise store launch
- [ ] Premium vendor features
- [ ] Affiliate partnerships setup
- [ ] Sponsored content system
- [ ] Email marketing automation
- [ ] Referral program
- [ ] Group booking flows

**Month 6: Scale & Polish**
- [ ] Mobile app (PWA)
- [ ] Push notifications
- [ ] Instant booking
- [ ] Advanced analytics dashboard
- [ ] Automated payout system
- [ ] Multi-language support (Phase 1: French)
- [ ] Video testimonials
- [ ] Trust & safety features

**Deliverables by End of Phase 2:**
- 50+ vendors
- 150+ listings
- 100+ bookings
- $250K GMV
- $37.5K platform revenue
- 4.5+ average rating
- Positive unit economics

---

### Phase 3: Expansion & Maturity (Months 7-12)

**Months 7-9: Product Maturity**
- [ ] AI-powered recommendations
- [ ] Dynamic pricing tools
- [ ] Vendor API access
- [ ] Advanced booking management
- [ ] Loyalty program
- [ ] Insurance integration
- [ ] Mobile app (native iOS/Android)
- [ ] Travel guides & resources
- [ ] Influencer partnership program

**Months 10-12: Market Expansion**
- [ ] Year-round experience categories
- [ ] Expand to other West African destinations
- [ ] Corporate booking portal
- [ ] Travel concierge service
- [ ] White-label solution for agencies
- [ ] B2B partnerships (hotels, airlines)
- [ ] Advanced vendor SaaS tools
- [ ] Community forums

**Deliverables by End of Phase 3:**
- 100+ vendors
- 300+ listings
- 350+ bookings
- $750K GMV
- $112.5K platform revenue
- Break-even achieved
- Market leader in "Detty December" category

---

### Development Team Structure

**Phase 1 (Months 1-3):**
- 1 Full-Stack Developer (contract/you)
- 1 UI/UX Designer (contract, part-time)
- 1 Content Writer (contract, part-time)

**Phase 2 (Months 4-6):**
- 1 Full-Stack Developer
- 1 Frontend Developer (contract, part-time)
- 1 UI/UX Designer (contract, part-time)
- 1 Customer Support Rep (contract, part-time)
- 1 Content Writer/Marketer (contract)

**Phase 3 (Months 7-12):**
- 2 Full-Stack Developers
- 1 Frontend Developer
- 1 Customer Success Manager
- 1 Marketing Manager
- 1 Content Writer
- 1 Community Manager

---

### Technical Debt & Refactoring Schedule
- **Month 4:** Code review & refactoring sprint
- **Month 7:** Performance optimization sprint
- **Month 10:** Security audit & updates
- **Ongoing:** Weekly code reviews, monthly dependency updates

---

## 13. Risk Management {#risk-management}

### Critical Risks & Mitigation

#### **1. Chicken-and-Egg Problem (Marketplace Liquidity)**
**Risk:** Need vendors to attract travelers, need travelers to attract vendors.

**Mitigation:**
- **Supply-First Approach:** Onboard 25+ vendors before major marketing push
- **Seed Listings:** Work with 5-10 anchor vendors to create high-quality, diverse listings
- **Manual Curation:** Personally vet and feature best listings
- **Subsidize Early Vendors:** Offer first 3 months at 10% commission (instead of 15%)
- **Guarantee Program:** Promise vendors minimum exposure or refund listing fees

#### **2. Seasonality (Detty December Focus)**
**Risk:** 80% of revenue concentrated in 1 month, cash flow issues rest of year.

**Mitigation:**
- **Year-Round Strategy:**
  - Expand to other Nigerian events (Fashion Week, Calabar Carnival)
  - Add corporate retreat offerings (Q1-Q3)
  - Launch "Experience Nigeria" campaign for diaspora visits year-round
- **Advance Bookings:** Encourage early bird bookings (Feb-Sep) with discounts
- **Recurring Revenue:** Subscription model for premium vendors
- **Merchandise:** Evergreen product line

#### **3. Trust & Safety**
**Risk:** Bad actors (scam vendors, fraudulent bookings, safety incidents).

**Mitigation:**
- **Vendor Verification:**
  - Mandatory business registration (CAC)
  - Background checks
  - Reference checks (2 minimum)
  - Trial period (first 5 bookings monitored closely)
- **Traveler Protection:**
  - Escrow payment system (funds released after experience)
  - 24/7 emergency support hotline
  - Travel insurance partnerships
  - Refund policy clearly stated
- **Review System:**
  - Verified bookings only can review
  - Fraud detection (flag fake reviews)
  - Quick response to disputes
- **Insurance:**
  - Platform liability insurance ($1M+)
  - Require vendors to carry insurance

#### **4. Payment Fraud & Disputes**
**Risk:** Chargebacks, payment fraud, dispute resolution.

**Mitigation:**
- **Stripe Radar:** Fraud detection for international cards
- **Paystack Fraud:** Built-in fraud prevention
- **3D Secure:** Require for high-value transactions
- **Clear Policies:** Cancellation/refund policies prominently displayed
- **Documentation:** Photo/video proof of experience delivery
- **Arbitration:** Internal dispute resolution team
- **Reserve Fund:** 10% of revenue for chargeback/refund buffer

#### **5. Vendor Disintermediation**
**Risk:** Vendors contact travelers directly to avoid commission.

**Mitigation:**
- **Value Proposition:** Make platform valuable beyond just leads
  - Automated booking management
  - Payment processing
  - Marketing & SEO
  - Analytics
  - Credibility & trust signals
- **Escrow Protection:** Vendors get paid through platform (builds dependency)
- **Contract Terms:** Non-circumvention clause in vendor agreement
- **Phone Number Obfuscation:** Hide contact details until booking confirmed
- **Build Loyalty:** Excellent vendor support, community building

#### **6. Competition**
**Risk:** Larger players (Airbnb, GetYourGuide) enter Nigerian market.

**Mitigation:**
- **Niche Focus:** Deep expertise in Nigerian travel
- **Local Relationships:** Strong vendor network
- **Community:** Build movement, not just marketplace
- **Speed:** Move fast, capture market share early
- **Quality:** Out-execute on curation and experience
- **Brand:** Become synonymous with "Detty December"

#### **7. Regulatory & Legal**
**Risk:** Changes in regulations, tax compliance, data privacy.

**Mitigation:**
- **Legal Counsel:** Consult Nigerian business lawyer
- **Compliance:**
  - GDPR compliance (for international users)
  - Nigeria Data Protection Regulation (NDPR)
  - Consumer protection laws
  - Terms of Service & Privacy Policy (reviewed by lawyer)
- **Tax Compliance:**
  - Proper business registration
  - VAT collection (if applicable)
  - Withholding tax on vendor payouts
- **Insurance:** Adequate coverage
- **Monitoring:** Stay updated on regulatory changes

#### **8. Technical Failures**
**Risk:** System downtime during peak booking season (November-December).

**Mitigation:**
- **Infrastructure:**
  - Use reliable providers (Vercel, Supabase, Cloudflare)
  - 99.9% uptime SLA targets
  - Auto-scaling
- **Monitoring:**
  - Sentry for error tracking
  - Uptime monitoring (UptimeRobot)
  - Performance monitoring (Vercel Analytics)
- **Backup:**
  - Daily database backups (Supabase)
  - Disaster recovery plan
- **Load Testing:**
  - Simulate peak load (1000+ concurrent users)
  - Optimize bottlenecks
- **DevOps:**
  - CI/CD pipeline
  - Staging environment
  - Rollback capability

#### **9. Cash Flow Management**
**Risk:** Delayed vendor payouts due to cash flow issues.

**Mitigation:**
- **Escrow System:** Funds held in escrow, not mixed with operating capital
- **Payout Schedule:** Clear 7-day post-experience payout terms
- **Working Capital:** Maintain 3-month runway
- **Factoring:** Consider invoice factoring if needed
- **Credit Line:** Establish business line of credit

#### **10. Content/Brand Reputation**
**Risk:** Negative reviews, PR crises, social media backlash.

**Mitigation:**
- **Quality Control:** Strict vendor vetting
- **Monitoring:** Social listening tools
- **Response Protocol:** Quick response to negative feedback
- **Transparency:** Own mistakes, communicate fixes
- **PR Plan:** Crisis communication playbook
- **Community Management:** Active engagement, build goodwill

---

### Risk Priority Matrix

| Risk | Likelihood | Impact | Priority | Status |
|------|------------|--------|----------|--------|
| Liquidity (chicken-egg) | High | Critical | **P0** | Mitigated |
| Seasonality | High | High | **P0** | In Progress |
| Trust & Safety | Medium | Critical | **P0** | Mitigated |
| Payment Fraud | Medium | High | **P1** | Mitigated |
| Disintermediation | Medium | Medium | **P1** | Monitored |
| Competition | Low | High | **P2** | Monitored |
| Regulatory | Low | High | **P2** | Monitored |
| Technical Failures | Low | Critical | **P1** | Mitigated |
| Cash Flow | Medium | High | **P1** | In Progress |
| Brand Reputation | Low | Medium | **P2** | Monitored |

---

## Appendices

### A. Competitive Analysis

| Competitor | Strengths | Weaknesses | Our Advantage |
|------------|-----------|------------|---------------|
| **Direct Competitors** ||||
| Travel Agencies (fragmented) | Established relationships, local knowledge | No online presence, poor UX, manual processes | Modern platform, better UX, wider selection |
| Facebook Groups | Free, large audience reach | Unvetted, scams, no payment protection | Trust, curation, payment security, professional |
| **Indirect Competitors** ||||
| Airbnb Experiences | Global brand, trust, smooth UX | Limited Nigeria focus, generic | Niche expertise, better local curation |
| Viator/GetYourGuide | Wide inventory, international recognition | Minimal Nigeria presence, less local feel | Dedicated to Nigeria, culturally relevant |
| TripAdvisor | Reviews, discovery | Booking happens offsite, cluttered UX | End-to-end booking, cleaner experience |

### B. Marketing Strategy (Year 1)

**Q1: Foundation (Jan-Mar)**
- Launch SEO-optimized blog (50+ posts)
- Google Ads (branded keywords)
- Instagram & TikTok organic content
- Partner with 10 micro-influencers

**Q2: Growth (Apr-Jun)**
- Meta ads (lookalike audiences)
- YouTube content series
- Podcast sponsorships (diaspora-focused shows)
- PR outreach (travel media)

**Q3: Pre-Season Ramp (Jul-Sep)**
- Increase ad spend 3x
- Launch email nurture campaign
- Host webinars ("Planning Your Detty December")
- Early bird promotions

**Q4: Peak Season (Oct-Dec)**
- Maximum ad spend
- Retargeting campaigns
- Partnerships with event organizers
- Real-time social media coverage

**Channels & Budget Allocation (Year 1: $50K):**
- Paid Ads (Google, Meta): 40% ($20K)
- Influencer Marketing: 25% ($12.5K)
- Content Creation: 15% ($7.5K)
- PR & Partnerships: 10% ($5K)
- Email Marketing: 5% ($2.5K)
- Events & Sponsorships: 5% ($2.5K)

### C. Legal & Compliance Checklist

- [ ] Business registration (CAC - Nigeria)
- [ ] Terms of Service (reviewed by lawyer)
- [ ] Privacy Policy (GDPR + NDPR compliant)
- [ ] Vendor Agreement template
- [ ] Traveler Agreement (terms of booking)
- [ ] Refund & Cancellation Policy
- [ ] Platform liability insurance
- [ ] Data protection registration
- [ ] Tax registration (VAT, WHT)
- [ ] Payment processor agreements (Stripe, Paystack)
- [ ] Cookie consent banner
- [ ] DMCA takedown policy
- [ ] Accessibility statement

### D. Customer Support Plan

**Phase 1: Manual Support**
- Email: support@onedettydecember.com
- WhatsApp: +234-XXX-XXX-XXXX
- Response SLA: 24 hours
- Hours: 9am-6pm WAT (Mon-Fri)

**Phase 2: Scaled Support**
- Live chat (Intercom/Crisp)
- Knowledge base/FAQ
- 24/7 emergency hotline
- Multilingual support

**Common Support Queries:**
- Booking modifications
- Refund requests
- Vendor verification status
- Payment issues
- Account access
- How to list (vendors)

---

## Next Steps & Recommendations

### Immediate Actions (Week 1)

1. **Validate Concept:**
   - Interview 20 potential travelers (diaspora focus)
   - Interview 10 travel agencies/vendors
   - Validate commission rates and pain points

2. **Set Up Infrastructure:**
   - Register domain
   - Set up Supabase project
   - Initialize Next.js repository
   - Configure Vercel & Cloudflare

3. **Legal Foundation:**
   - Consult lawyer on business structure
   - Draft initial T&Cs and Privacy Policy
   - Register business (if not already)

4. **Brand & Design:**
   - Finalize logo & brand identity
   - Create design system/style guide
   - Design key page mockups (homepage, listing page, checkout)

5. **Pre-Launch Marketing:**
   - Build simple landing page with email capture
   - Start social media accounts
   - Begin content creation (blog drafts)

---

### Decision Points

**Key decisions needed:**

1. **Commission Rate:** 15%, 17%, or 20%? (Recommend: 15% to start, scale to 17%)
2. **Launch Date:** Soft launch vs. full launch timeline
3. **Geographic Focus:** Lagos-only to start, or all Nigeria? (Recommend: Lagos + Abuja)
4. **Vendor Onboarding:** Open application vs. invite-only? (Recommend: Invite-only for first 25)
5. **Merchandise:** Launch with platform or Phase 2? (Recommend: Phase 2)
6. **Mobile App:** PWA only or native apps? (Recommend: PWA Phase 2, native Phase 3)
7. **Content Strategy:** In-house writer vs. agency? (Recommend: Freelance to start)

---

## Summary

This PRD outlines a comprehensive plan to build OneDettyDecember as a **two-sided marketplace** connecting travelers with Nigerian experience providers. The platform leverages modern technology (Next.js, Supabase, Cloudflare) to create a seamless booking experience while generating revenue through commissions (15-20%), merchandise, and premium features.

**Path to $500K ARR:**
- **Year 1 Target:** $750K GMV = $112.5K platform revenue (15% commission)
- **With Merchandise + Premium Features:** $125-150K total revenue
- **Break-even:** Month 6 (~$520K annual GMV run-rate)
- **Profitability:** Month 12+

**Critical Success Factors:**
1. **Solve the liquidity problem:** Onboard quality vendors before major marketing
2. **Build trust:** Rigorous verification, reviews, escrow payments
3. **Dominate SEO:** Become #1 for "Detty December" and related keywords
4. **Year-round expansion:** Don't rely solely on December
5. **Exceptional UX:** Better than any existing solution

**Next milestone:** Ship MVP in 90 days with 25 vendors and 50 listings.

---

This is your execution blueprint. Let's build! 🚀
