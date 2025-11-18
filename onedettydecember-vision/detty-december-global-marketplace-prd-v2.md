# Product Requirements Document (PRD)
## OneDettyDecember - Global Marketplace Platform

**The #1 Platform for Everything Detty December, Globally**

---

**Version:** 2.0 (Global Marketplace Edition)  
**Date:** November 9, 2025  
**Prepared for:** OneDettyDecember
**Document Owner:** Product & Business Development
**Classification:** Confidential

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Nov 8, 2025 | Business Dev | Initial PRD - Nigeria focused |
| 2.0 | Nov 9, 2025 | Product Team | **Global marketplace expansion - Everything Detty December** |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision & Mission](#2-product-vision--mission)
3. [Market Opportunity](#3-market-opportunity)
4. [Strategic Positioning](#4-strategic-positioning)
5. [User Personas](#5-user-personas)
6. [Product Architecture](#6-product-architecture)
7. [Core Features & Requirements](#7-core-features--requirements)
8. [Technical Specifications](#8-technical-specifications)
9. [Data Models](#9-data-models)
10. [Integration Requirements](#10-integration-requirements)
11. [User Flows](#11-user-flows)
12. [Revenue Model](#12-revenue-model)
13. [Success Metrics & KPIs](#13-success-metrics--kpis)
14. [Development Roadmap](#14-development-roadmap)
15. [Go-to-Market Strategy](#15-go-to-market-strategy)
16. [Risk Management](#16-risk-management)
17. [Appendices](#17-appendices)

---

## 1. Executive Summary

### 1.1 Product Overview

**OneDettyDecember** is building the world's first and largest **comprehensive marketplace platform** for West Africa's $2.5 billion "Detty December" cultural phenomenon. We are the **one-stop destination** where 2 million+ travelers discover, plan, and book every element of their Detty December experience.

### 1.2 What We Are Building

A **vertical marketplace ecosystem** that consolidates the entire Detty December experience into a single platform:

**Core Marketplace Categories:**
1. ✈️ **Flights** - Compare and book international & domestic flights
2. 🏨 **Accommodation** - Hotels, villas, short-term rentals, hostels
3. 🎉 **Events & Tickets** - Concerts, festivals, beach parties, yacht parties, exclusive events
4. 🍽️ **Dining & Nightlife** - Restaurant reservations, club tables, bar experiences
5. 🚗 **Transportation** - Airport transfers, car rentals, chauffeur services, group transport
6. 🗺️ **Tours & Experiences** - City tours, cultural experiences, adventure activities
7. 🛍️ **Shopping & Services** - Hair/beauty salons, tailors, shopping guides, personal shoppers
8. 🏖️ **Beach & Pool Experiences** - Beach clubs, pool parties, day passes
9. 👕 **Merchandise Store** - Branded apparel, accessories, souvenirs
10. 📱 **Content & Community** - Travel guides, blogs, forums, trip planning tools

### 1.3 Strategic Objectives

**Vision Statement:**
*"To become the authoritative global platform where everyone plans and books their Detty December experience - owning the category from discovery to booking to experience."*

**Mission Statement:**
*"Make Detty December accessible, affordable, and unforgettable for the global African diaspora and culture enthusiasts worldwide."*

**3-Year Goals:**
- **Year 1:** Launch in Nigeria & Ghana | 15,000 bookings | $7.5M GMV
- **Year 2:** Expand to 5 West African markets | 35,000 bookings | $18M GMV  
- **Year 3:** Pan-African presence | 65,000 bookings | $35M GMV

### 1.4 Competitive Advantage

We are **NOT** competing with:
- Booking.com / Expedia (generic travel booking)
- Eventbrite (just event tickets)
- Airbnb (just accommodation)
- TripAdvisor (just reviews)

We are building **Detty December's Super-App** - a purpose-built vertical marketplace that owns the entire category.

**Moats:**
1. **Network Effects** - More vendors = more customers = more vendors
2. **Brand Authority** - First mover in "Detty December" category ownership
3. **Data Moat** - Proprietary insights on what travelers actually want
4. **Cultural Curation** - Authentic, localized experiences vs. generic travel sites
5. **Community** - Building the global Detty December community

### 1.5 Key Success Metrics (Year 1)

| Metric | Target |
|--------|--------|
| **Gross Merchandise Value (GMV)** | $7.5M |
| **Total Bookings** | 15,000 |
| **Active Vendors** | 500+ |
| **Platform Revenue** | $1.5M+ |
| **Registered Users** | 100,000+ |
| **Email Subscribers** | 50,000+ |
| **Organic Traffic** | 250K monthly visits |
| **Mobile App Downloads** | 25,000+ |
| **Average Order Value** | $500 |
| **Customer Acquisition Cost** | <$45 |

---

## 2. Product Vision & Mission

### 2.1 The Problem We're Solving

**For Travelers (Demand Side):**

**Current Experience = Total Chaos:**
- 📱 Using 12-15 different platforms to plan ONE trip
- 💸 Paying 30-40% premium due to fragmented booking
- 😰 Missing out on best events because information is scattered
- ⚠️ Getting scammed with no trusted platform
- 🕐 Spending 20-30 hours planning instead of 2 hours
- 📞 Managing bookings through WhatsApp with no confirmation system

**Pain Points:**
1. **Fragmented Discovery** - Instagram, Twitter, WhatsApp groups, word-of-mouth
2. **Price Opacity** - No way to compare prices, rampant price gouging
3. **Trust Deficit** - Scammers, unverified operators, no protection
4. **FOMO Anxiety** - Fear of missing the "right" experiences
5. **Last-Minute Chaos** - Everything books out in final 3 weeks
6. **No Accountability** - Vendors disappear after payment
7. **Information Overload** - Too much noise, not enough curation
8. **Payment Complexity** - Multiple currencies, sketchy payment methods

**For Vendors (Supply Side):**

**Current Experience = Manual, Inefficient, Limited Reach:**
- 📢 Struggle to reach customers beyond immediate network
- 💰 Unpredictable revenue - 80% of bookings in final 2 weeks
- 📊 Managing bookings via spreadsheets and WhatsApp
- 🤝 No credibility signals for new customers
- 🌍 Can't reach international diaspora audience
- 💳 Payment collection is manual and risky
- 📉 Limited visibility for smaller operators
- 🔄 High customer acquisition costs

### 2.2 Our Solution

**OneDettyDecember = The Complete Ecosystem**

Think of us as:
- **The Amazon** of Detty December (marketplace + logistics)
- **The Airbnb** of West African experiences (trusted platform)
- **The Spotify** of cultural discovery (curated content)
- **The Stripe** of event payments (seamless transactions)

**Value Proposition for Travelers:**
- ✅ **Book Everything in One Place** - Flights, hotels, events, tours, dining, transport
- ✅ **Guaranteed Best Prices** - Price matching + transparent pricing
- ✅ **Verified & Trusted** - Every vendor vetted, every booking insured
- ✅ **Zero FOMO** - Complete event calendar, early access to exclusive events
- ✅ **Seamless Experience** - Book in 3 clicks, manage everything from one dashboard
- ✅ **24/7 Concierge** - Real human support before, during, after trip
- ✅ **Community & Content** - Connect with other travelers, access insider guides

**Value Proposition for Vendors:**
- ✅ **Global Reach** - Access to 2M+ diaspora travelers
- ✅ **Marketing Channel** - Featured placement, SEO visibility
- ✅ **Instant Credibility** - Platform verification badge
- ✅ **Payment Security** - Secure escrow, guaranteed payouts
- ✅ **Analytics & Insights** - Understand your customers
- ✅ **Automated Operations** - Calendar management, booking automation
- ✅ **Year-Round Revenue** - Platform promotes year-round bookings

### 2.3 Product Philosophy

**Core Principles:**

1. **Travelers First, Always**
   - Every feature decision prioritizes traveler experience
   - If it's confusing, we don't ship it
   - Customer support is not a cost center, it's a competitive advantage

2. **Curation Over Inventory**
   - We don't list everything - we list the BEST of everything
   - Quality > Quantity
   - Every listing meets minimum standards

3. **Technology as Enabler, Not Barrier**
   - Platform should feel magical, not technical
   - Mobile-first, but desktop-optimized
   - Works offline where possible (PWA)

4. **Community, Not Just Transactions**
   - We're building a movement, not just a booking engine
   - Content, community features, and engagement matter
   - Annual events, meetups, creator partnerships

5. **Vendor Success = Platform Success**
   - We grow when vendors grow
   - Transparent commission structure
   - Tools to help vendors succeed

6. **Data-Informed, Not Data-Driven**
   - Use data to validate hypotheses
   - But trust human judgment and intuition
   - Cultural nuance can't be A/B tested

---

## 3. Market Opportunity

### 3.1 Market Size & Growth

**Total Addressable Market (TAM):**
- **Global African diaspora travel:** $63B annually
- **West African cultural tourism:** $8.2B annually  
- **December-specific travel:** $2.5B annually

**Serviceable Addressable Market (SAM):**
- **Detty December Nigeria + Ghana:** $1.8B (2025)
- **Projected growth:** 18% CAGR through 2030
- **2030 market size:** $4.1B

**Serviceable Obtainable Market (SOM) - Year 3:**
- **Target market share:** 15% of Detty December market
- **GMV Target:** $35M (Year 3)
- **Platform Revenue:** $7M (20% take rate)

### 3.2 Market Dynamics

**Key Market Trends:**

1. **Diaspora Growth**
   - 15M+ Africans in diaspora (growing 5% annually)
   - $48B in remittances to Africa (2024)
   - Increasing "heritage tourism" trend

2. **Digital Adoption**
   - 70% smartphone penetration in Nigeria/Ghana
   - 85% of travelers book trips online
   - Mobile-first mindset

3. **Social Media Influence**
   - 92% discover experiences via Instagram/TikTok
   - Influencer-driven travel decisions
   - FOMO as primary booking driver

4. **Experience Economy**
   - Shift from things to experiences
   - Willingness to pay premium for unique experiences
   - Average spend per person: $3,500-5,000

5. **Afrobeats Global Explosion**
   - Burna Boy, Wizkid, Davido, Tems, Asake = global superstars
   - Concerts sell out Madison Square Garden
   - Western celebrities attending Detty December

### 3.3 Customer Segments

**Primary Segments:**

**1. Diaspora Professionals (35% of market)**
- Age: 25-45
- Income: $60K-150K USD
- Location: US, UK, Canada
- Budget: $4,000-7,000 per trip
- Motivation: Reconnect with roots, network, party

**2. Diaspora Youth (30% of market)**
- Age: 18-30
- Income: $30K-60K USD  
- Location: US, UK, Europe
- Budget: $2,000-4,000 per trip
- Motivation: Culture, music, social media content

**3. Local Affluent (20% of market)**
- Age: 25-40
- Income: Middle-upper class
- Location: Lagos, Accra, Abuja, Port Harcourt
- Budget: $1,500-3,500 per trip
- Motivation: Exclusive events, networking

**4. International Tourists (10% of market)**
- Age: 25-50
- Income: Varies
- Location: Global (Non-African)
- Budget: $3,000-6,000 per trip
- Motivation: Cultural tourism, adventure

**5. Corporate Groups (5% of market)**
- Companies organizing team retreats
- Budget: $50K-200K per group
- Motivation: Team building, networking

### 3.4 Competitive Landscape

**Direct Competitors:**
- None (we are category creators)

**Indirect Competitors:**

| Platform | What They Do | Why We Win |
|----------|--------------|------------|
| **Booking.com / Expedia** | Generic hotel booking | No cultural curation, no events, no community |
| **Airbnb Experiences** | Random experiences | Not Detty December-specific, poor West Africa inventory |
| **Eventbrite** | Event ticketing only | Doesn't solve full trip planning, no trust/verification |
| **Instagram / WhatsApp** | Discovery & communication | No booking, no protection, no infrastructure |
| **Local Tour Operators** | Small-scale tours | Limited reach, manual processes, no tech |
| **TripAdvisor** | Reviews, some booking | Generic, not Detty December focused |

**Our Competitive Advantages:**

1. **Category Ownership** - We define "Detty December" in travelers' minds
2. **Network Effects** - More vendors = more customers = more vendors (flywheel)
3. **Vertical Integration** - We own the entire customer journey
4. **Cultural Authority** - Deep understanding of the culture, not just bookings
5. **Technology** - Modern stack, seamless UX vs. competitors' clunky systems
6. **First Mover Advantage** - No one else is building this specific platform

### 3.5 Market Validation

**Evidence of Demand:**

1. **Search Volume:**
   - "Detty December" - 135K searches/month (Oct-Dec)
   - "Lagos Detty December" - 22K searches/month
   - "Accra December events" - 18K searches/month

2. **Social Media:**
   - #DettyDecember - 487M+ TikTok views
   - Instagram posts - 340K+ posts
   - Twitter/X - Trending topic annually

3. **Event Sell-Outs:**
   - Major concerts sell out in hours
   - Premium hotels book out 3 months in advance
   - Villa rentals 200-400% price premiums

4. **Investor Interest:**
   - Seed round: $500K-1M target
   - Series A potential: $3-5M (18 months)
   - Comparable exits: TravelStart ($40M), Wakanow (ongoing)

---

## 4. Strategic Positioning

### 4.1 Brand Positioning

**Brand Promise:**
*"Experience Detty December the Right Way - All in One Place"*

**Brand Personality:**
- **Energetic** - We capture the vibe of Detty December
- **Trustworthy** - We're the safe choice in a chaotic market
- **Culturally Authentic** - By the culture, for the culture
- **Premium but Accessible** - Quality without exclusivity
- **Community-Driven** - We're building a movement

**Brand Voice:**
- Conversational and warm (not corporate)
- Confident but not arrogant
- Knowledgeable but not condescending
- Fun but professional when needed
- Inclusive and welcoming

### 4.2 SEO & Content Authority Strategy

**Objective:** Own every search related to Detty December

**Keyword Hierarchy:**

**Tier 1 (Money Keywords):**
- "Detty December packages"
- "Lagos December hotels"
- "Accra New Year events"
- "Nigeria December tour packages"
- "Ghana December travel"

**Tier 2 (Discovery Keywords):**
- "What is Detty December"
- "Best Detty December parties"
- "Lagos December travel guide"
- "Accra December things to do"

**Tier 3 (Long-tail):**
- "Burna Boy concert tickets Lagos December"
- "Affordable Detty December packages from UK"
- "Beach parties Accra New Year"
- "Villa rental Lagos December"

**Content Strategy:**
- 200+ blog posts covering every aspect of Detty December
- Video content (YouTube, TikTok, Instagram Reels)
- User-generated content (reviews, trip reports, photos)
- Interactive tools (budget calculator, itinerary planner)
- Downloadable guides (PDF travel guides)

**Backlink Strategy:**
- Partnerships with travel bloggers
- Features in major publications (Travel + Leisure, Condé Nast, etc.)
- Influencer collaborations
- Press releases for major events/partnerships

### 4.3 Go-to-Market Positioning

**Phase 1: Category Education (Months 1-6)**
- "What is Detty December?" content
- Social media storytelling
- Influencer partnerships
- PR campaign

**Phase 2: Solution Positioning (Months 7-12)**
- "How to plan Detty December" content
- Platform benefits messaging
- Case studies and testimonials
- Comparison content vs. alternatives

**Phase 3: Category Domination (Year 2+)**
- "Detty December = OneDettyDecember" brand awareness
- Premium features and exclusive access
- Year-round expansion messaging
- International expansion announcements

---

## 5. User Personas

### 5.1 Primary Traveler Personas

#### Persona 1: "Diaspora Ada" - The Professional Returnee

**Demographics:**
- **Age:** 32
- **Location:** Houston, Texas
- **Occupation:** Marketing Manager at tech company
- **Income:** $95,000/year
- **Relationship Status:** Single, dating
- **Education:** Bachelor's degree

**Background:**
- Born in Nigeria, moved to US at age 10
- Returns to Nigeria every 2-3 years
- Active on Instagram (15K followers)
- Loves Afrobeats, fashion, culture
- Has family in Lagos and Enugu

**Goals & Motivations:**
- Experience authentic Nigerian culture
- Reconnect with roots and family
- Network with other young professionals
- Create Instagram-worthy content
- Attend premium events (concerts, parties)
- Feel safe and taken care of

**Pain Points:**
- Limited vacation time (10 days)
- Doesn't trust random vendors
- Overwhelmed by options
- Worried about safety
- Price uncertainty
- FOMO about missing key events

**Booking Behavior:**
- Books 3-4 months in advance
- Prefers all-inclusive packages
- Willing to pay premium for quality
- Influenced by social media and friends
- Reads reviews extensively

**Platform Usage:**
- Mobile-first (90% of browsing on phone)
- Books on desktop for big purchases
- Active 9 PM - 12 AM (after work)
- Shops around but decides quickly

**Budget:** $4,500-6,000 for 10-day trip

**Quote:** *"I want to experience real Lagos without the stress of planning everything myself. I need someone I can trust."*

---

#### Persona 2: "Jollof James" - The Culture Vulture

**Demographics:**
- **Age:** 26
- **Location:** London, UK
- **Occupation:** Junior Software Developer
- **Income:** £45,000/year
- **Relationship Status:** Single
- **Education:** Bachelor's in Computer Science

**Background:**
- British-born to Ghanaian parents
- First time visiting Ghana/Nigeria
- Active on TikTok (50K followers)
- Creates travel and culture content
- Plans to vlog entire trip

**Goals & Motivations:**
- Experience West African culture firsthand
- Create viral content for TikTok/YouTube
- Meet other creators and influencers
- Attend as many events as possible
- Prove he's "connected to the culture"
- Have stories to tell back home

**Pain Points:**
- Limited budget
- Doesn't know anyone on ground
- Worried about being seen as "tourist"
- Needs content-worthy experiences
- Wants authentic, not "touristic" experiences
- Concerned about safety

**Booking Behavior:**
- Books 1-2 months in advance
- Looks for deals and group discounts
- Heavily influenced by influencers
- Values experiences over luxury accommodation
- Books incrementally (flight first, then hotels, then events)

**Platform Usage:**
- Mobile-only (iPhone)
- Active all day (procrastinates at work)
- Comparison shops extensively
- Watches YouTube reviews

**Budget:** $2,500-3,500 for 8-day trip

**Quote:** *"I need to go to the right events and get the right footage. Can't be out there looking like a tourist."*

---

#### Persona 3: "Lagos Linda" - The Local Party Queen

**Demographics:**
- **Age:** 29
- **Location:** Lagos, Nigeria (Lekki)
- **Occupation:** Senior Accountant
- **Income:** ₦8M/year (~$5,500/year)
- **Relationship Status:** In a relationship
- **Education:** MBA

**Background:**
- Lives in Lagos full-time
- Well-connected socially
- Goes out 2-3x per week
- Attends most major events
- Has disposable income

**Goals & Motivations:**
- Access to exclusive/VIP events
- See and be seen
- Network with "the right people"
- Stay ahead of trends
- Avoid "regular" crowds
- Create premium experiences with partner

**Pain Points:**
- Events sell out quickly
- Fake tickets / scams
- No centralized calendar
- Prices fluctuate wildly
- Poor customer service from vendors
- Difficulty getting VIP access

**Booking Behavior:**
- Books throughout the year (not just December)
- Buys tickets as soon as announced
- Prefers VIP/premium options
- Uses multiple vendors
- Influenced by Lagos "big boys/girls"

**Platform Usage:**
- Mobile and desktop
- Active evenings and weekends
- Follows Lagos influencers
- WhatsApp groups for info

**Budget:** ₦2M-5M ($1,300-3,200) on December events

**Quote:** *"I just need one place to see everything happening and book VIP. I'm tired of chasing event organizers on WhatsApp."*

---

#### Persona 4: "Wanderlust Wendy" - The International Tourist

**Demographics:**
- **Age:** 35
- **Location:** Toronto, Canada
- **Occupation:** Teacher
- **Income:** $70,000 CAD/year
- **Relationship Status:** Married, no kids
- **Education:** Master's degree

**Background:**
- Not of African descent
- Loves travel and new cultures
- Visits 3-4 new countries per year
- Active on travel forums and Pinterest
- Reads travel blogs religiously

**Goals & Motivations:**
- Experience authentic West African culture
- Attend unique festival/events
- Safety and comfort
- Learn about history and culture
- Take beautiful photos
- Have unique stories for friends

**Pain Points:**
- Doesn't understand local context
- Worried about safety
- Needs hand-holding and guidance
- Language barriers
- Cultural missteps
- Finding "authentic" experiences

**Booking Behavior:**
- Books 6+ months in advance
- Extensive research (reads 20+ reviews)
- Prefers guided experiences
- Willing to pay for peace of mind
- Values transparency

**Platform Usage:**
- Desktop for booking, mobile for research
- Active evenings (8-10 PM)
- Uses comparison sites
- Google searches extensively

**Budget:** $4,000-5,500 CAD for 12-day trip

**Quote:** *"I want to experience real West African culture but I also want to feel safe and know I'm not being taken advantage of."*

---

#### Persona 5: "Corporate Chioma" - The Team Retreat Organizer

**Demographics:**
- **Age:** 38
- **Location:** Lagos, Nigeria (Victoria Island)
- **Occupation:** HR Director at fintech company
- **Income:** ₦18M/year (~$12,500/year)
- **Relationship Status:** Married with 2 kids
- **Education:** MBA

**Background:**
- Organizes company events and retreats
- 50-person team
- Budget of $150K for annual retreat
- Has used multiple vendors previously
- Frustrated with coordination

**Goals & Motivations:**
- Seamless team experience
- Impress leadership with smooth execution
- Build team morale and culture
- Get good value for budget
- Minimal coordination on her part
- Measurable ROI (team engagement)

**Pain Points:**
- Managing multiple vendors
- Last-minute cancellations
- Budget overruns
- Poor vendor communication
- Inconsistent quality
- No single point of contact

**Booking Behavior:**
- Books 6-9 months in advance
- Requires quotes and contracts
- Prefers packages with everything included
- Needs invoicing and receipts
- Values reliability over price

**Platform Usage:**
- Desktop-first (at work)
- Email communication
- Requires account manager
- Prefers phone calls for complex bookings

**Budget:** $50K-200K per retreat

**Quote:** *"I need one vendor I can trust to handle everything. I don't have time to coordinate 10 different people for one event."*

---

### 5.2 Vendor Personas

#### Vendor Persona 1: "Established Emeka" - The Tour Operator

**Demographics:**
- **Age:** 42
- **Location:** Lagos, Nigeria
- **Business:** Tour & travel company (8 years)
- **Annual Revenue:** ₦45M (~$30K)
- **Team Size:** 5 full-time staff

**Background:**
- Started tour company in 2017
- Runs 20-30 tours per year
- Most customers via referrals
- Frustrated with marketing costs
- Wants to scale but lacks infrastructure

**Goals:**
- Reach diaspora market
- Fill tour capacity consistently
- Reduce marketing costs
- Build brand credibility
- Streamline operations

**Pain Points:**
- High customer acquisition cost
- Manual booking process
- Payment collection challenges
- Limited online presence
- Seasonal revenue fluctuations

**Platform Needs:**
- Listing and calendar management
- Secure payment processing
- Customer communication tools
- Analytics and reporting
- Marketing support

**Commission Tolerance:** 15-18%

**Quote:** *"I have great tours, I just need more people to know about them. And I need to stop managing bookings in Excel."*

---

#### Vendor Persona 2: "Event Evelyn" - The Party Promoter

**Demographics:**
- **Age:** 31
- **Location:** Accra, Ghana
- **Business:** Event planning/promotion (5 years)
- **Annual Revenue:** $100K
- **Team Size:** 3 part-time staff

**Background:**
- Organizes 40+ events per year
- Uses Instagram and WhatsApp for sales
- December is 60% of annual revenue
- Frustrated with fake tickets and no-shows
- Wants better ticketing infrastructure

**Goals:**
- Sell out events faster
- Reduce fake ticket issues
- Reach international audience
- Build email list
- Create year-round demand

**Pain Points:**
- Ticket fraud
- Payment processing
- Last-minute cancellations
- Marketing costs (Facebook/Instagram ads)
- No customer data for retargeting

**Platform Needs:**
- Digital ticketing system
- Email marketing tools
- QR code check-in
- Real-time sales dashboard
- Early bird pricing automation

**Commission Tolerance:** 10-15%

**Quote:** *"I spend too much money on ads and still deal with fraud. I need a platform that brings me the right customers."*

---

#### Vendor Persona 3: "Hospitality Hassan" - The Boutique Hotel Owner

**Demographics:**
- **Age:** 48
- **Location:** Lagos, Nigeria (Ikoyi)
- **Business:** 15-room boutique hotel (3 years)
- **Annual Revenue:** ₦180M (~$120K)
- **Team Size:** 12 full-time staff

**Background:**
- Former banker who invested in hospitality
- Property books out in December (3 months advance)
- Uses Booking.com but high commissions (18-20%)
- Wants direct bookings
- Strong repeat customer base

**Goals:**
- Increase direct bookings
- Reduce reliance on OTAs
- Fill off-season capacity
- Build brand
- Create packages (room + experiences)

**Pain Points:**
- OTA commission costs
- Difficult to differentiate
- Limited marketing budget
- Can't create bundled offerings
- Revenue concentrated in Dec-Jan

**Platform Needs:**
- Room inventory management
- Dynamic pricing tools
- Package bundling
- Customer reviews
- Direct payment processing

**Commission Tolerance:** 12-15% (less than Booking.com)

**Quote:** *"Booking.com takes 18%. If you can bring me the same customers for less, I'm in."*

---

### 5.3 Admin/Internal Personas

#### Admin Persona: "Operations Ola" - Platform Manager

**Role:** Platform Operations Manager

**Responsibilities:**
- Vendor vetting and onboarding
- Quality control
- Dispute resolution
- Customer support oversight
- Performance monitoring

**Daily Tasks:**
- Review new vendor applications
- Monitor booking quality
- Handle escalated customer issues
- Analyze platform metrics
- Coordinate with vendors

**Tools Needed:**
- Admin dashboard with all platform data
- Vendor communication tools
- Dispute management system
- Analytics and reporting
- Content moderation tools

**Success Metrics:**
- Vendor approval time <24 hours
- Customer satisfaction >4.5/5
- Dispute resolution time <48 hours
- Platform quality score >90%

---

## 6. Product Architecture

### 6.1 System Architecture

**High-Level Architecture:**

```
┌─────────────────────────────────────────────────────────┐
│                    USER LAYER                            │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐ │
│  │   Web App    │  │  Mobile PWA  │  │  Native Apps  │ │
│  │  (Next.js)   │  │   (Next.js)  │  │ (React Native)│ │
│  └──────────────┘  └──────────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    CDN LAYER                             │
│                  (Cloudflare)                            │
│  • Global CDN  • DDoS Protection  • WAF  • SSL/TLS      │
│  • Rate Limiting  • Image Optimization  • Caching       │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  APPLICATION LAYER                       │
│                   (Vercel + Next.js 14+)                │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │            API Routes (Next.js)                  │  │
│  │  • Authentication  • Bookings  • Payments        │  │
│  │  • Search  • Reviews  • Messaging                │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Server Components (React)                │  │
│  │  • SSR Pages  • Data Fetching  • SEO             │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   BACKEND LAYER                          │
│                    (Supabase)                           │
│                                                          │
│  ┌────────────────┐  ┌──────────────┐  ┌─────────────┐│
│  │   PostgreSQL   │  │  Edge Funcs  │  │   Storage   ││
│  │    Database    │  │  (Deno)      │  │   (S3)      ││
│  └────────────────┘  └──────────────┘  └─────────────┘│
│                                                          │
│  ┌────────────────┐  ┌──────────────┐  ┌─────────────┐│
│  │      Auth      │  │   Realtime   │  │     RLS     ││
│  │   (JWT/OAuth)  │  │  (WebSockets)│  │  Security   ││
│  └────────────────┘  └──────────────┘  └─────────────┘│
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              EXTERNAL INTEGRATIONS                       │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Payments: Stripe, Paystack, Flutterwave         │  │
│  │  Email: Resend, SendGrid                         │  │
│  │  SMS: Twilio, Termii                             │  │
│  │  Maps: Google Maps API, Mapbox                   │  │
│  │  Analytics: PostHog, Google Analytics            │  │
│  │  Search: Algolia (optional)                      │  │
│  │  Flights: Amadeus, Kiwi.com API                  │  │
│  │  Hotels: Booking.com API (if partnership)        │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 6.2 Technology Stack

**Frontend:**
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **UI Library:** React 18+
- **Styling:** Tailwind CSS + Shadcn/ui components
- **State Management:** Zustand (lightweight) + React Query (server state)
- **Forms:** React Hook Form + Zod validation
- **Maps:** Google Maps API / Mapbox
- **Calendar:** React Big Calendar / FullCalendar
- **Charts:** Recharts
- **Icons:** Lucide Icons

**Backend:**
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (supports email, social logins, magic links)
- **File Storage:** Supabase Storage
- **Real-time:** Supabase Realtime (WebSocket subscriptions)
- **Serverless Functions:** Supabase Edge Functions (Deno runtime)
- **API:** Next.js API Routes + Supabase REST API
- **Caching:** Vercel Edge Cache + Redis (for complex caching)

**Infrastructure:**
- **Hosting:** Vercel (frontend) + Supabase (backend)
- **CDN:** Cloudflare
- **Domain/DNS:** Cloudflare
- **SSL:** Cloudflare Universal SSL
- **DDoS Protection:** Cloudflare
- **Rate Limiting:** Cloudflare Workers / Vercel Edge Middleware

**Payments:**
- **Primary:** Stripe (international cards, Apple Pay, Google Pay)
- **Local (Nigeria):** Paystack
- **Local (Ghana):** Flutterwave
- **Crypto (optional):** Coinbase Commerce

**Communication:**
- **Transactional Email:** Resend (modern, great DX)
- **Marketing Email:** MailerLite or Loops
- **SMS:** Twilio (international) + Termii (Nigeria)
- **Push Notifications:** Firebase Cloud Messaging (FCM)

**Analytics & Monitoring:**
- **Product Analytics:** PostHog (open-source, privacy-friendly)
- **Web Analytics:** Google Analytics 4
- **Error Tracking:** Sentry
- **Performance Monitoring:** Vercel Analytics
- **Uptime Monitoring:** Better Uptime

**DevOps:**
- **Version Control:** GitHub
- **CI/CD:** GitHub Actions + Vercel
- **Preview Environments:** Vercel (automatic)
- **Secrets Management:** Vercel Environment Variables
- **Database Migrations:** Supabase CLI

**SEO & Content:**
- **CMS:** Contentful (headless) or Strapi (self-hosted)
- **SEO:** Next.js built-in SEO + next-sitemap
- **Search:** Algolia (optional, for fast search)

**Development Tools:**
- **Package Manager:** pnpm
- **Code Quality:** ESLint + Prettier
- **Type Safety:** TypeScript strict mode
- **Testing:** Vitest (unit) + Playwright (e2e)
- **API Testing:** Postman / Insomnia

### 6.3 Architecture Rationale

**Why Next.js 14+?**
- ✅ Server Components for performance and SEO
- ✅ App Router for better routing and layouts
- ✅ Built-in image optimization
- ✅ API routes for backend logic
- ✅ Excellent TypeScript support
- ✅ Server-side rendering for SEO
- ✅ Edge runtime support

**Why Supabase?**
- ✅ PostgreSQL: Battle-tested, ACID-compliant database
- ✅ Row Level Security: Built-in authorization
- ✅ Realtime: WebSocket subscriptions out of the box
- ✅ Storage: S3-compatible object storage
- ✅ Edge Functions: Serverless compute
- ✅ Auth: Complete auth system
- ✅ Open Source: Not locked into proprietary system
- ✅ Great DX: Intuitive dashboard, excellent docs

**Why Vercel?**
- ✅ Built specifically for Next.js
- ✅ Global edge network
- ✅ Automatic HTTPS
- ✅ Preview deployments
- ✅ Zero config deployments
- ✅ Built-in analytics
- ✅ Excellent developer experience

**Why Cloudflare?**
- ✅ Global CDN for speed
- ✅ DDoS protection (critical for high-traffic events)
- ✅ Rate limiting
- ✅ Image optimization
- ✅ Web Application Firewall
- ✅ Free tier is generous
- ✅ 99.99% uptime SLA

### 6.4 High-Level System Components

**Public-Facing Platform:**
```
┌─────────────────────────────────────────────────────┐
│              PUBLIC WEBSITE                          │
├─────────────────────────────────────────────────────┤
│  Homepage & Landing Pages                           │
│  ├─ Hero section with search                        │
│  ├─ Featured categories (flights, hotels, events)   │
│  ├─ Social proof (reviews, bookings, vendors)       │
│  ├─ Popular destinations                            │
│  └─ CTA: Browse, Search, Sign Up                    │
│                                                      │
│  Category Pages                                     │
│  ├─ Flights (search, compare, book)                 │
│  ├─ Hotels (filter, compare, book)                  │
│  ├─ Events (browse, filter, buy tickets)            │
│  ├─ Tours & Experiences (browse, book)              │
│  ├─ Dining & Nightlife                              │
│  ├─ Transportation                                  │
│  └─ Merchandise Store                               │
│                                                      │
│  Listing Detail Pages                               │
│  ├─ Gallery (photos, videos)                        │
│  ├─ Description & highlights                        │
│  ├─ Reviews & ratings                               │
│  ├─ Availability calendar                           │
│  ├─ Pricing & booking widget                        │
│  ├─ Vendor info & verification                      │
│  ├─ Similar listings                                │
│  └─ FAQ                                             │
│                                                      │
│  Search & Discovery                                 │
│  ├─ Advanced filters                                │
│  ├─ Map view                                        │
│  ├─ Sorting options                                 │
│  ├─ Saved searches                                  │
│  └─ Search history                                  │
│                                                      │
│  Booking & Checkout                                 │
│  ├─ Multi-step checkout                             │
│  ├─ Guest information                               │
│  ├─ Payment options                                 │
│  ├─ Add-ons & extras                                │
│  ├─ Promo codes                                     │
│  ├─ Terms & cancellation policy                     │
│  └─ Confirmation page                               │
│                                                      │
│  User Dashboard                                     │
│  ├─ Upcoming trips                                  │
│  ├─ Past bookings                                   │
│  ├─ Saved listings                                  │
│  ├─ Messages                                        │
│  ├─ Reviews                                         │
│  ├─ Payment methods                                 │
│  └─ Account settings                                │
│                                                      │
│  Content & Community                                │
│  ├─ Blog (travel guides, tips, stories)             │
│  ├─ Events calendar                                 │
│  ├─ Travel guides (city guides, itineraries)        │
│  ├─ Community forum                                 │
│  ├─ User-generated content                          │
│  └─ Newsletter signup                               │
└─────────────────────────────────────────────────────┘
```

**Vendor Dashboard:**
```
┌─────────────────────────────────────────────────────┐
│            VENDOR DASHBOARD                          │
├─────────────────────────────────────────────────────┤
│  Dashboard Overview                                  │
│  ├─ Key metrics (bookings, revenue, views)          │
│  ├─ Recent bookings                                 │
│  ├─ Pending actions                                 │
│  ├─ Messages                                        │
│  └─ Calendar highlights                             │
│                                                      │
│  Listing Management                                  │
│  ├─ Create new listing                              │
│  ├─ Edit existing listings                          │
│  ├─ Photo/video uploads                             │
│  ├─ Pricing management                              │
│  ├─ Availability calendar                           │
│  ├─ Add-ons & extras                                │
│  ├─ Policies & rules                                │
│  └─ Duplicate listings                              │
│                                                      │
│  Bookings & Calendar                                 │
│  ├─ All bookings (filter, sort, search)             │
│  ├─ Calendar view                                   │
│  ├─ Booking details                                 │
│  ├─ Accept/decline requests                         │
│  ├─ Modify bookings                                 │
│  ├─ Cancel bookings                                 │
│  └─ Check-in management (for events/tours)          │
│                                                      │
│  Customer Communication                              │
│  ├─ Inbox (messages from customers)                 │
│  ├─ Automated messages setup                        │
│  ├─ Booking confirmations                           │
│  ├─ Reminders                                       │
│  └─ Post-booking messages                           │
│                                                      │
│  Analytics & Reporting                               │
│  ├─ Revenue dashboard                               │
│  ├─ Booking trends                                  │
│  ├─ Customer demographics                           │
│  ├─ Listing performance                             │
│  ├─ Reviews & ratings analysis                      │
│  ├─ Traffic sources                                 │
│  └─ Export reports (CSV, PDF)                       │
│                                                      │
│  Financial Management                                │
│  ├─ Payouts (scheduled, history)                    │
│  ├─ Transaction history                             │
│  ├─ Commission breakdown                            │
│  ├─ Invoices & receipts                             │
│  ├─ Payout methods                                  │
│  └─ Tax documents                                   │
│                                                      │
│  Reviews & Ratings                                   │
│  ├─ All reviews                                     │
│  ├─ Respond to reviews                              │
│  ├─ Review analytics                                │
│  └─ Flag inappropriate reviews                      │
│                                                      │
│  Account & Settings                                  │
│  ├─ Business profile                                │
│  ├─ Verification documents                          │
│  ├─ Team management                                 │
│  ├─ Notification preferences                        │
│  └─ Security settings                               │
└─────────────────────────────────────────────────────┘
```

**Admin Portal:**
```
┌─────────────────────────────────────────────────────┐
│              ADMIN PORTAL                            │
├─────────────────────────────────────────────────────┤
│  Platform Dashboard                                  │
│  ├─ Key metrics (GMV, bookings, users, vendors)     │
│  ├─ Real-time activity feed                         │
│  ├─ Alerts & notifications                          │
│  ├─ Growth trends                                   │
│  └─ System health                                   │
│                                                      │
│  User Management                                     │
│  ├─ All users (search, filter)                      │
│  ├─ User details                                    │
│  ├─ Suspend/ban users                               │
│  ├─ Reset passwords                                 │
│  ├─ User activity logs                              │
│  └─ Merge duplicate accounts                        │
│                                                      │
│  Vendor Management                                   │
│  ├─ Vendor applications (pending, approved)         │
│  ├─ Vendor verification                             │
│  ├─ Vendor performance monitoring                   │
│  ├─ Suspend/ban vendors                             │
│  ├─ Vendor support tickets                          │
│  └─ Vendor communication                            │
│                                                      │
│  Listing Management                                  │
│  ├─ All listings (filter, search)                   │
│  ├─ Approve/reject listings                         │
│  ├─ Content moderation                              │
│  ├─ Featured listings management                    │
│  ├─ Category management                             │
│  └─ Remove listings                                 │
│                                                      │
│  Booking Management                                  │
│  ├─ All bookings                                    │
│  ├─ Booking details                                 │
│  ├─ Modify/cancel bookings                          │
│  ├─ Refund processing                               │
│  └─ Fraud detection                                 │
│                                                      │
│  Dispute Resolution                                  │
│  ├─ Open disputes                                   │
│  ├─ Dispute details & evidence                      │
│  ├─ Mediation tools                                 │
│  ├─ Resolution actions                              │
│  └─ Dispute history                                 │
│                                                      │
│  Content Management                                  │
│  ├─ Blog posts (create, edit, publish)              │
│  ├─ Pages (terms, privacy, about)                   │
│  ├─ Featured content                                │
│  ├─ Media library                                   │
│  └─ SEO settings                                    │
│                                                      │
│  Marketing Tools                                     │
│  ├─ Promo codes management                          │
│  ├─ Email campaigns                                 │
│  ├─ Push notifications                              │
│  ├─ Banner management                               │
│  └─ Affiliate tracking                              │
│                                                      │
│  Analytics & Reporting                               │
│  ├─ Platform metrics                                │
│  ├─ Financial reports                               │
│  ├─ User acquisition                                │
│  ├─ Retention & churn                               │
│  ├─ Vendor performance                              │
│  └─ Custom reports                                  │
│                                                      │
│  Financial Management                                │
│  ├─ Transaction logs                                │
│  ├─ Commission management                           │
│  ├─ Vendor payouts                                  │
│  ├─ Refund processing                               │
│  ├─ Financial reconciliation                        │
│  └─ Tax reporting                                   │
│                                                      │
│  Platform Settings                                   │
│  ├─ Site settings                                   │
│  ├─ Commission rates                                │
│  ├─ Payment gateway settings                        │
│  ├─ Email templates                                 │
│  ├─ Feature flags                                   │
│  ├─ API keys                                        │
│  └─ Team & roles management                         │
└─────────────────────────────────────────────────────┘
```

---

## 7. Core Features & Requirements

### 7.1 Feature Overview by Phase

**Phase 1: MVP (Months 0-3)**
- [ ] User registration & authentication
- [ ] Vendor onboarding & verification
- [ ] Listing creation (Events, Tours, Hotels)
- [ ] Search & discovery
- [ ] Booking & checkout
- [ ] Payment processing (Stripe + Paystack)
- [ ] Basic vendor dashboard
- [ ] Basic admin panel
- [ ] Email notifications
- [ ] Reviews & ratings

**Phase 2: Growth (Months 4-12)**
- [ ] Flights integration
- [ ] Advanced search & filters
- [ ] Calendar & availability management
- [ ] Vendor analytics dashboard
- [ ] Mobile PWA
- [ ] Content management system (Blog)
- [ ] Referral program
- [ ] Promo codes & discounts
- [ ] Customer support chat
- [ ] Advanced payment options (Flutterwave, crypto)
- [ ] Multi-language support (English, Yoruba, Igbo, Pidgin)

**Phase 3: Scale (Year 2+)**
- [ ] Native mobile apps (iOS, Android)
- [ ] AI-powered recommendations
- [ ] Dynamic pricing
- [ ] Group bookings
- [ ] Corporate accounts
- [ ] API for third-party integrations
- [ ] Merchandise platform
- [ ] Subscription plans (for vendors)
- [ ] White-label solutions
- [ ] International expansion features

### 7.2 Detailed Feature Requirements

---

#### 7.2.1 User Authentication & Registration

**User Stories:**
- As a traveler, I want to sign up quickly so I can start booking experiences
- As a traveler, I want to log in with Google/Facebook so I don't have to remember another password
- As a vendor, I want to verify my business so customers trust me

**Requirements:**

**FR-AUTH-001: User Registration**
- Users can register via:
  - Email + password
  - Google OAuth
  - Facebook OAuth
  - Apple Sign In (for iOS users)
  - Magic link (passwordless)
- Email verification required before first booking
- Phone number optional but encouraged (for SMS notifications)
- Accept Terms of Service & Privacy Policy
- Newsletter opt-in (optional)

**FR-AUTH-002: Login**
- Email + password
- Social login (persist across sessions)
- Remember me option
- Forgot password flow
- Account recovery via email

**FR-AUTH-003: Multi-Factor Authentication (Optional)**
- 2FA via SMS
- 2FA via authenticator app
- Backup codes

**FR-AUTH-004: Account Types**
- **Traveler Account** (default)
- **Vendor Account** (requires application)
- **Admin Account** (internal only)

**Non-Functional Requirements:**
- Auth response time: <500ms
- Password encryption: bcrypt with cost factor 12
- JWT token expiry: 7 days
- Session management: Supabase Auth
- Rate limiting: 5 failed login attempts = 15-min lockout

**Acceptance Criteria:**
- ✅ User can register in <30 seconds
- ✅ Social login works on first attempt
- ✅ Email verification sent within 10 seconds
- ✅ Password reset email received within 1 minute

---

#### 7.2.2 User Profiles

**User Stories:**
- As a traveler, I want to save my preferences so future bookings are faster
- As a traveler, I want to see my booking history
- As a vendor, I want to customize my public profile

**Requirements:**

**FR-PROFILE-001: Traveler Profile**
- Profile photo (upload, crop, resize)
- Full name
- Email (verified)
- Phone number (optional)
- Date of birth (for age-restricted events)
- Location (country, city)
- Passport information (optional, for flight bookings)
- Payment methods (saved cards)
- Communication preferences
- Wishlist / Saved listings
- Booking history
- Reviews written

**FR-PROFILE-002: Vendor Profile**
- Business name
- Logo (upload)
- Cover photo
- Business description (max 500 words)
- Business type (tour operator, hotel, event organizer, etc.)
- Registration number (e.g., CAC in Nigeria)
- Address (physical location)
- Contact information (phone, email, website)
- Social media links
- Verification badge (after admin approval)
- Response time (auto-calculated)
- Acceptance rate (auto-calculated)
- Average rating (auto-calculated)

**Non-Functional Requirements:**
- Profile updates save automatically (debounced after 2s)
- Image uploads: Max 10MB, formats: JPG, PNG, WebP
- Images auto-optimized to WebP

**Acceptance Criteria:**
- ✅ Profile completion takes <5 minutes
- ✅ Images compressed without visible quality loss
- ✅ Changes saved within 2 seconds

---

#### 7.2.3 Vendor Onboarding & Verification

**User Stories:**
- As a vendor, I want to get approved quickly so I can start listing my services
- As an admin, I want to verify vendors efficiently so we maintain quality

**Requirements:**

**FR-VENDOR-001: Vendor Application**
- Application form with:
  - Business details (name, type, description)
  - Contact information
  - Registration documents (upload PDFs)
  - Business address
  - Bank account details (for payouts)
  - ID verification (owner)
  - Previous experience / portfolio
  - References (optional)

**FR-VENDOR-002: Verification Process**
- Admin reviews application
- Document verification checklist:
  - [ ] Business registration verified
  - [ ] ID verified
  - [ ] Bank details verified
  - [ ] Background check (optional, for high-risk categories)
- Approve / Reject / Request more info
- Approval triggers welcome email with onboarding guide

**FR-VENDOR-003: Vendor Tiers**
- **Basic Vendor** - Standard listing features
- **Premium Vendor** ($99/month) - Featured placement, advanced analytics
- **Enterprise Vendor** (custom) - API access, white-label options

**Non-Functional Requirements:**
- Application review SLA: <24 hours
- Auto-reject if documents incomplete after 7 days
- Notification sent at application submission, review start, approval/rejection

**Acceptance Criteria:**
- ✅ Vendors can complete application in <15 minutes
- ✅ 80% of applications reviewed within 24 hours
- ✅ Clear rejection reasons provided

---

#### 7.2.4 Listing Creation & Management

**User Stories:**
- As a vendor, I want to create attractive listings that convert
- As a traveler, I want detailed, accurate listing information

**Requirements:**

**FR-LISTING-001: Listing Types**
- **Event Ticket** (concert, festival, party, conference)
- **Tour / Experience** (city tour, adventure, cultural experience)
- **Accommodation** (hotel room, villa, apartment, hostel)
- **Flight** (one-way, round-trip, multi-city)
- **Dining Reservation** (restaurant table, private chef)
- **Transportation** (airport transfer, car rental, chauffeur)
- **Service** (hair/beauty, personal shopper, photographer)
- **Package** (bundled offer combining multiple listing types)

**FR-LISTING-002: Core Listing Fields (All Types)**
- Title (max 100 chars)
- Description (rich text, max 2000 words)
- Category & sub-category
- Location (address, coordinates, map)
- Photos (min 3, max 20, drag-to-reorder)
- Video (optional, YouTube/Vimeo embed or upload)
- Pricing
- Availability (calendar or schedule)
- Capacity / quantity
- Cancellation policy
- Terms & conditions
- Add-ons / extras (optional)
- Tags / keywords
- Status (draft, published, paused, archived)

**FR-LISTING-003: Event-Specific Fields**
- Event date & time
- Venue name & address
- Lineup / performers
- Ticket types (General, VIP, VVIP)
- Age restrictions
- Dress code
- What's included (drinks, food, etc.)

**FR-LISTING-004: Tour-Specific Fields**
- Duration (hours/days)
- Group size (min/max)
- Difficulty level
- What's included
- What to bring
- Meeting point
- Tour schedule/itinerary
- Languages offered

**FR-LISTING-005: Accommodation-Specific Fields**
- Property type (hotel, villa, apartment, etc.)
- Number of bedrooms/bathrooms
- Amenities (WiFi, pool, AC, etc.)
- Check-in/check-out times
- House rules
- Minimum stay
- Room types (if hotel)

**FR-LISTING-006: Flight-Specific Fields**
- Departure/arrival cities
- Departure/arrival times
- Airline
- Flight number
- Cabin class (economy, business, first)
- Baggage allowance
- Layovers

**FR-LISTING-007: Listing Actions**
- Save as draft
- Publish
- Pause (temporarily hide)
- Archive (permanently hide)
- Duplicate (create similar listing)
- Delete (soft delete, requires confirmation)

**Non-Functional Requirements:**
- Listing creation should take <10 minutes
- Images: Max 10MB each, auto-resize to 1920px width
- Rich text editor for descriptions
- Auto-save every 30 seconds
- Mobile-responsive listing form

**Acceptance Criteria:**
- ✅ Vendors can create a complete listing in <10 min
- ✅ Listings look great on mobile and desktop
- ✅ Auto-save prevents data loss
- ✅ Images load quickly (<2s)

---

#### 7.2.5 Search & Discovery

**User Stories:**
- As a traveler, I want to find exactly what I'm looking for quickly
- As a traveler, I want to discover new experiences I didn't know about

**Requirements:**

**FR-SEARCH-001: Search Bar**
- Global search bar (always visible in header)
- Search by:
  - Keywords (listing title, description)
  - Location (city, neighborhood, venue)
  - Category
  - Date range
- Autocomplete suggestions (trending, popular)
- Recent searches (saved locally)

**FR-SEARCH-002: Filters**
- **Category** (Events, Tours, Hotels, Flights, etc.)
- **Price Range** (slider or min/max input)
- **Date/Date Range**
- **Location** (city, neighborhood)
- **Rating** (4+ stars, 4.5+ stars)
- **Capacity/Group Size**
- **Amenities** (for hotels: WiFi, pool, gym, etc.)
- **Event Type** (for events: concert, party, festival, etc.)
- **Tour Duration** (for tours: <2 hours, 2-4 hours, full day, multi-day)
- **Cancellation Policy** (flexible, moderate, strict)
- **Verified Vendors Only** (toggle)

**FR-SEARCH-003: Sorting Options**
- Recommended (algorithmic, default)
- Price (low to high, high to low)
- Rating (high to low)
- Newest
- Most popular (by bookings)
- Distance (nearest first)

**FR-SEARCH-004: Map View**
- Toggle between list and map view
- Markers for each listing
- Cluster markers when zoomed out
- Click marker to preview listing
- Hover marker to highlight in list

**FR-SEARCH-005: Saved Searches**
- Save search with filters
- Get notified when new listings match criteria
- Manage saved searches in profile

**Non-Functional Requirements:**
- Search response time: <500ms
- Support 1000+ concurrent searches
- Index updated in real-time (new listings appear within 1 min)
- Fuzzy search (handle typos)
- Mobile-optimized filters (drawer/modal)

**Acceptance Criteria:**
- ✅ Search returns relevant results in <500ms
- ✅ Filters narrow results effectively
- ✅ Map view loads smoothly
- ✅ Saved searches work reliably

---

#### 7.2.6 Listing Detail Page

**User Stories:**
- As a traveler, I want all information I need to make a booking decision
- As a vendor, I want my listing to be compelling and trustworthy

**Requirements:**

**FR-LISTING-DETAIL-001: Core Sections**
1. **Header**
   - Listing title
   - Rating & review count
   - Location
   - Share button
   - Save button (heart icon)
   - Verified badge (if vendor is verified)

2. **Photo Gallery**
   - Main photo (hero image)
   - Thumbnail strip (click to view)
   - Lightbox view with arrow navigation
   - Show all photos button

3. **Overview**
   - Short description (first 200 chars)
   - Key highlights (bullet points)
   - What's included
   - Important info (age restrictions, dress code, etc.)

4. **Pricing Card** (sticky on desktop)
   - Price (per person, per night, etc.)
   - Date picker (if date-specific)
   - Guest count selector
   - Add-ons (optional extras)
   - Total price calculation
   - "Book Now" CTA button
   - "Message Vendor" button

5. **Full Description**
   - Rich text with formatting
   - Expandable if >500 words

6. **Location**
   - Address
   - Embedded map
   - Directions link
   - Nearby landmarks

7. **Availability**
   - Calendar (for tours, rentals)
   - Schedule (for recurring events)
   - Real-time availability updates

8. **Cancellation Policy**
   - Clear breakdown of refund terms
   - Cancellation deadline
   - Link to full policy

9. **Reviews & Ratings**
   - Overall rating (stars + number)
   - Rating breakdown (5 stars, 4 stars, etc.)
   - Filter reviews (most helpful, recent, high/low rating)
   - Read more button (show 5, load more)
   - Sort options

10. **Vendor Info**
    - Vendor name (linked to profile)
    - Verification badge
    - Member since
    - Response time
    - Response rate
    - Total bookings
    - "Contact Vendor" button

11. **Similar Listings**
    - "You might also like" carousel
    - 6-8 similar listings

12. **FAQ** (if provided by vendor)

**Non-Functional Requirements:**
- Page load time: <2s
- Images: WebP format, lazy loading
- Mobile-responsive
- Schema.org markup for SEO
- Open Graph tags for social sharing

**Acceptance Criteria:**
- ✅ Page loads in <2 seconds
- ✅ All critical info visible without scrolling (on desktop)
- ✅ Images look sharp on retina displays
- ✅ Booking widget is intuitive

---

#### 7.2.7 Booking & Checkout Flow

**User Stories:**
- As a traveler, I want to book quickly and securely
- As a traveler, I want clear confirmation of my booking

**Requirements:**

**FR-CHECKOUT-001: Booking Flow (Multi-Step)**

**Step 1: Select Date & Guests**
- Date picker
- Guest count (adults, children if applicable)
- Add-ons selection
- Real-time price update
- "Continue to Checkout" button

**Step 2: Guest Details**
- Lead traveler information
  - Full name
  - Email
  - Phone
  - Special requests (optional)
- Additional travelers (if group booking)
  - Name
  - Age (if required)

**Step 3: Payment**
- Payment method selection
  - Credit/Debit card (Stripe)
  - Nigerian cards (Paystack)
  - Ghanaian cards (Flutterwave)
  - Bank transfer (manual verification)
  - Crypto (optional, Coinbase Commerce)
- Billing address
- Promo code input
- Order summary (itemized)
- Terms acceptance checkbox
- "Complete Booking" button

**Step 4: Confirmation**
- Booking confirmation message
- Booking reference number
- Vendor contact info
- What happens next
- "View Booking" button
- "Download Receipt" button

**FR-CHECKOUT-002: Cart (Optional, Phase 2)**
- Add multiple listings to cart
- Book everything at once
- Saved for later

**FR-CHECKOUT-003: Instant Booking vs. Request to Book**
- **Instant Booking:** Pay now, confirmed immediately
- **Request to Book:** Send request, vendor approves, then pay

**FR-CHECKOUT-004: Payment Processing**
- Stripe for international cards
- Paystack for Nigerian Naira payments
- Flutterwave for Ghanaian Cedi payments
- 3D Secure authentication
- PCI DSS compliant
- Escrow system (hold funds until 48 hours after experience)

**FR-CHECKOUT-005: Confirmation Emails**
- Immediate confirmation email (traveler)
- Booking notification email (vendor)
- Receipt PDF attached
- Calendar invite (.ics file)

**Non-Functional Requirements:**
- Checkout completion rate: >75%
- Payment processing time: <10s
- Mobile-optimized checkout
- Auto-fill payment details (if saved)
- SSL/TLS encryption
- No stored payment details (tokenized by Stripe/Paystack)

**Acceptance Criteria:**
- ✅ Users can complete booking in <2 minutes
- ✅ Payment processes successfully on first attempt (>95%)
- ✅ Confirmation email arrives within 30 seconds
- ✅ Booking appears in user dashboard immediately

---

#### 7.2.8 Booking Management

**User Stories:**
- As a traveler, I want to view, modify, or cancel my bookings
- As a vendor, I want to manage bookings efficiently

**Requirements:**

**FR-BOOKING-MGMT-001: Traveler Booking Dashboard**
- View all bookings (upcoming, past, cancelled)
- Booking details page
  - Booking reference
  - Listing info
  - Date & time
  - Guest count
  - Total price
  - Vendor contact
  - Booking status
- Actions:
  - View details
  - Contact vendor
  - Modify booking (if allowed)
  - Cancel booking
  - Download receipt
  - Leave review (post-experience)

**FR-BOOKING-MGMT-002: Booking Statuses**
- **Pending** - Request sent, awaiting vendor approval
- **Confirmed** - Booking confirmed, payment successful
- **Completed** - Experience has occurred
- **Cancelled** - Cancelled by traveler or vendor
- **Refunded** - Payment refunded
- **Disputed** - Dispute opened

**FR-BOOKING-MGMT-003: Modification & Cancellation**
- Travelers can cancel bookings based on cancellation policy:
  - **Flexible:** Full refund up to 24 hours before
  - **Moderate:** 50% refund up to 7 days before
  - **Strict:** No refund
- Vendors can cancel (with penalty if within 7 days)
- Cancellation triggers:
  - Refund processing (if applicable)
  - Email notification
  - Calendar update

**FR-BOOKING-MGMT-004: Vendor Booking Dashboard**
- View all bookings (today, this week, all upcoming, past)
- Booking calendar view
- Accept/decline booking requests
- Mark as completed
- Contact traveler
- Issue refunds
- Export bookings (CSV)

**Non-Functional Requirements:**
- Real-time booking updates
- Email notifications for all status changes
- SMS notifications (optional, for high-value bookings)

**Acceptance Criteria:**
- ✅ Travelers see bookings immediately after checkout
- ✅ Vendors receive booking notification within 1 minute
- ✅ Cancellations process refunds within 5-7 business days

---

#### 7.2.9 Reviews & Ratings

**User Stories:**
- As a traveler, I want to leave honest reviews to help others
- As a vendor, I want to respond to reviews and improve my rating

**Requirements:**

**FR-REVIEWS-001: Review Submission**
- Only travelers who completed a booking can review
- Review form:
  - Overall rating (1-5 stars)
  - Category ratings (optional):
    - Accuracy (listing description)
    - Communication (vendor responsiveness)
    - Value for money
    - Quality
  - Written review (min 20 chars, max 1000 chars)
  - Photo upload (optional, max 5 photos)
- Submit anonymously (optional)
- Review published after moderation (auto-approved if no flagged content)

**FR-REVIEWS-002: Review Display**
- Reviews shown on listing page
- Average rating prominently displayed
- Review count
- Rating breakdown (bar chart showing distribution)
- Filters: Most helpful, Recent, High rating, Low rating
- Helpful votes (upvote/downvote)

**FR-REVIEWS-003: Vendor Response**
- Vendors can respond to any review (once)
- Response shown below review
- Response editable within 24 hours

**FR-REVIEWS-004: Review Moderation**
- Auto-flag reviews containing:
  - Profanity
  - Personal information (phone, email)
  - Spam
- Admin reviews flagged content
- Remove fake/malicious reviews

**Non-Functional Requirements:**
- Reviews indexed for search (Google)
- Schema.org review markup
- Reviews cannot be deleted (only hidden by admin)
- Vendors cannot delete negative reviews

**Acceptance Criteria:**
- ✅ Reviews publish within 24 hours
- ✅ Vendor responses show within 1 hour
- ✅ Fake reviews detected and removed

---

#### 7.2.10 Payments & Payouts

**User Stories:**
- As a traveler, I want secure payment options
- As a vendor, I want reliable, timely payouts

**Requirements:**

**FR-PAYMENT-001: Payment Methods (Travelers)**
- **Credit/Debit Cards** (Visa, Mastercard, Amex) via Stripe
- **Nigerian Cards** via Paystack
- **Ghanaian Cards** via Flutterwave
- **Bank Transfer** (manual confirmation)
- **Crypto** (Bitcoin, USDC) via Coinbase Commerce (optional)
- **Mobile Money** (MTN, Vodafone) - Phase 2

**FR-PAYMENT-002: Escrow System**
- Funds held in escrow until 48 hours after experience
- If no dispute filed, release payment to vendor
- If dispute filed, hold funds pending resolution

**FR-PAYMENT-003: Refund Processing**
- Refunds processed within 5-7 business days
- Refund to original payment method
- Email confirmation sent

**FR-PAYMENT-004: Commission Structure**
- Platform commission: 15-20% (varies by category)
- Deducted from vendor payout
- Transparent breakdown in vendor dashboard

**FR-PAYMENT-005: Vendor Payouts**
- Payout frequency: Weekly (every Monday)
- Minimum payout: $100
- Payout methods:
  - Bank transfer (ACH, SWIFT)
  - Payoneer
  - Crypto (Bitcoin, USDC)
- Payout dashboard:
  - Available balance
  - Pending balance
  - Payout history
  - Transaction details

**Non-Functional Requirements:**
- PCI DSS Level 1 compliant
- 3D Secure authentication
- Fraud detection (Stripe Radar)
- Multi-currency support (USD, NGN, GHS, GBP, EUR)
- Real-time currency conversion

**Acceptance Criteria:**
- ✅ 99.5%+ payment success rate
- ✅ Vendors receive payouts on time, every week
- ✅ Zero payment data breaches

---

#### 7.2.11 Notifications & Communication

**User Stories:**
- As a user, I want timely notifications about my bookings
- As a vendor, I want to communicate with customers easily

**Requirements:**

**FR-NOTIF-001: Notification Types**
- **Email**
  - Booking confirmations
  - Booking updates (approved, cancelled)
  - Payment receipts
  - Review requests
  - Marketing (optional, opt-in)
  - Reminders (upcoming trip)
- **SMS** (opt-in, for high-priority only)
  - Booking confirmed
  - Booking cancelled
  - Vendor message
- **Push Notifications** (mobile app, Phase 2)
  - New message from vendor
  - Booking approved
  - Review prompt
- **In-App Notifications** (bell icon)
  - Messages
  - Booking updates
  - Promotions

**FR-NOTIF-002: Notification Preferences**
- Users can customize notification settings:
  - Email: On/Off for each type
  - SMS: On/Off
  - Push: On/Off
  - Marketing: Opt-in/out

**FR-NOTIF-003: Messaging System**
- Direct messaging between traveler and vendor
- Message thread per booking
- Rich text support
- Photo attachments
- Read receipts
- Email notifications for new messages
- "Report Message" option

**Non-Functional Requirements:**
- Email deliverability rate: >95%
- SMS delivery time: <30 seconds
- Messages delivered in real-time (WebSocket)

**Acceptance Criteria:**
- ✅ Users receive email confirmations within 30 seconds
- ✅ SMS notifications arrive reliably
- ✅ Messages load instantly

---

#### 7.2.12 Admin Panel

(See Section 6.4 for detailed admin features)

**Summary:**
- Dashboard with key metrics
- User & vendor management
- Listing approval & moderation
- Booking management
- Dispute resolution
- Content management (blog, pages)
- Analytics & reporting
- Financial management

---

#### 7.2.13 Content Management & SEO

**User Stories:**
- As a traveler, I want helpful content to plan my trip
- As a platform, we want to rank #1 for "Detty December" keywords

**Requirements:**

**FR-CONTENT-001: Blog**
- Content categories:
  - Travel guides (city-specific)
  - Event highlights
  - Vendor spotlights
  - Tips & advice
  - Travel stories
- Rich text editor (headings, lists, images, videos)
- SEO fields (meta title, description, URL slug)
- Featured image
- Author attribution
- Publish date
- Tags & categories
- Related posts
- Social sharing buttons
- Comments (optional, Phase 2)

**FR-CONTENT-002: City/Destination Pages**
- Dedicated landing page for each city (Lagos, Accra, Abuja, etc.)
- Sections:
  - Hero image + CTA
  - About the city
  - Top experiences
  - Top hotels
  - Top events
  - Travel tips
  - FAQ
  - Browse listings (category links)
- SEO optimized (H1, H2, meta tags)
- Schema.org markup

**FR-CONTENT-003: Landing Pages**
- Category landing pages (Events, Tours, Hotels, etc.)
- Event-specific pages (e.g., AfroFuture Festival, Burna Boy concert)
- SEO-optimized
- Conversion-focused (clear CTAs)

**FR-CONTENT-004: SEO**
- Meta tags (title, description) for all pages
- Open Graph tags (social sharing)
- Canonical URLs
- XML sitemap (auto-generated)
- Robots.txt
- Schema.org structured data:
  - Organization
  - Event
  - LocalBusiness
  - Product
  - Review
- Image alt tags
- Internal linking
- Breadcrumbs

**Non-Functional Requirements:**
- Blog posts indexed by Google within 24 hours
- Page load speed: <2s (Core Web Vitals)
- Mobile-first indexing
- HTTPS only

**Acceptance Criteria:**
- ✅ Platform ranks #1 for "Detty December" within 6 months
- ✅ Blog drives 30%+ of organic traffic
- ✅ Landing pages convert at >5%

---

#### 7.2.14 Merchandise Store (Phase 2)

**User Stories:**
- As a fan, I want branded merchandise to rep Detty December
- As a platform, we want additional revenue streams

**Requirements:**

**FR-MERCH-001: Product Catalog**
- Product types:
  - T-shirts
  - Hoodies
  - Hats/Caps
  - Tote bags
  - Phone cases
  - Stickers
  - Posters
- Product page:
  - Photos (multiple angles)
  - Description
  - Price
  - Size chart
  - Color/size variants
  - Add to cart
- Inventory management

**FR-MERCH-002: E-commerce Features**
- Shopping cart
- Checkout flow (similar to booking checkout)
- Order tracking
- Shipping integration (local & international)
- Returns & exchanges policy

**Non-Functional Requirements:**
- Print-on-demand integration (Printful, CustomCat)
- Fulfillment time: 7-14 days
- Shipping tracking

**Acceptance Criteria:**
- ✅ Merchandise contributes 5-10% of platform revenue
- ✅ Order fulfillment is automated

---

### 7.3 Feature Prioritization Matrix

| Feature | Impact (1-5) | Effort (1-5) | Priority | Phase |
|---------|-------------|-------------|----------|-------|
| User Authentication | 5 | 2 | HIGH | MVP |
| Listing Creation | 5 | 3 | HIGH | MVP |
| Search & Discovery | 5 | 4 | HIGH | MVP |
| Booking & Checkout | 5 | 4 | HIGH | MVP |
| Payment Processing | 5 | 3 | HIGH | MVP |
| Reviews & Ratings | 4 | 2 | HIGH | MVP |
| Vendor Dashboard | 5 | 3 | HIGH | MVP |
| Admin Panel | 4 | 3 | MEDIUM | MVP |
| Email Notifications | 4 | 2 | MEDIUM | MVP |
| Blog/Content | 4 | 2 | MEDIUM | Growth |
| Flights Integration | 5 | 5 | HIGH | Growth |
| Mobile PWA | 4 | 3 | MEDIUM | Growth |
| Messaging System | 3 | 3 | LOW | Growth |
| Merchandise Store | 2 | 4 | LOW | Scale |
| Mobile Apps (Native) | 3 | 5 | LOW | Scale |

---

## 8. Data Models

### 8.1 Database Schema

**Technology:** PostgreSQL (via Supabase)

**Key Tables:**

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  full_name VARCHAR(255),
  avatar_url TEXT,
  account_type VARCHAR(20) DEFAULT 'traveler', -- 'traveler', 'vendor', 'admin'
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User Profiles (extends users)
CREATE TABLE user_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  date_of_birth DATE,
  country VARCHAR(100),
  city VARCHAR(100),
  bio TEXT,
  preferences JSONB, -- Store user preferences as JSON
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Vendors Table
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  business_name VARCHAR(255) NOT NULL,
  business_type VARCHAR(100), -- 'tour_operator', 'hotel', 'event_organizer', etc.
  description TEXT,
  logo_url TEXT,
  cover_photo_url TEXT,
  registration_number VARCHAR(100),
  verification_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  verification_date TIMESTAMP,
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  website VARCHAR(255),
  social_links JSONB,
  payout_method JSONB, -- Bank details, Payoneer, etc.
  tier VARCHAR(20) DEFAULT 'basic', -- 'basic', 'premium', 'enterprise'
  response_time INTEGER, -- Average response time in minutes
  response_rate DECIMAL(3,2), -- e.g., 0.95 for 95%
  total_bookings INTEGER DEFAULT 0,
  average_rating DECIMAL(2,1) DEFAULT 0.0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Listings Table
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  listing_type VARCHAR(50) NOT NULL, -- 'event', 'tour', 'hotel', 'flight', 'dining', 'transport', 'service', 'package'
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  category VARCHAR(100),
  subcategory VARCHAR(100),
  price DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  location_address TEXT,
  location_city VARCHAR(100),
  location_country VARCHAR(100),
  location_coordinates POINT, -- PostGIS for geospatial queries
  capacity INTEGER,
  duration INTEGER, -- in minutes
  images JSONB, -- Array of image URLs
  video_url TEXT,
  amenities JSONB, -- For hotels, venues, etc.
  cancellation_policy VARCHAR(20), -- 'flexible', 'moderate', 'strict'
  terms_and_conditions TEXT,
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'published', 'paused', 'archived'
  featured BOOLEAN DEFAULT FALSE,
  booking_type VARCHAR(20) DEFAULT 'instant', -- 'instant', 'request'
  view_count INTEGER DEFAULT 0,
  average_rating DECIMAL(2,1) DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Additional fields specific to listing types (stored as JSONB for flexibility)
  listing_specific_data JSONB
);

-- Examples of listing_specific_data:
-- For events: { "event_date": "2025-12-20", "venue": "Eko Hotel", "lineup": [...] }
-- For tours: { "meeting_point": "...", "difficulty": "easy", "group_size_max": 15 }
-- For hotels: { "check_in": "14:00", "check_out": "12:00", "room_types": [...] }

-- Availability Table (for tours, hotels, rentals)
CREATE TABLE availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  available BOOLEAN DEFAULT TRUE,
  capacity INTEGER,
  booked INTEGER DEFAULT 0,
  price_override DECIMAL(10,2), -- Override base price for specific dates
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(listing_id, date)
);

-- Bookings Table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_reference VARCHAR(20) UNIQUE NOT NULL,
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
  traveler_id UUID REFERENCES users(id) ON DELETE SET NULL,
  booking_date TIMESTAMP NOT NULL,
  guest_count INTEGER DEFAULT 1,
  guest_details JSONB, -- Array of guest info
  total_price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  commission DECIMAL(10,2), -- Platform commission
  vendor_payout DECIMAL(10,2), -- Amount vendor receives
  payment_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
  booking_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled', 'disputed'
  confirmation_date TIMESTAMP,
  cancellation_date TIMESTAMP,
  cancellation_reason TEXT,
  refund_amount DECIMAL(10,2),
  refund_date TIMESTAMP,
  special_requests TEXT,
  add_ons JSONB, -- Optional add-ons
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Payments Table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  payment_method VARCHAR(50), -- 'stripe', 'paystack', 'flutterwave', 'bank_transfer', 'crypto'
  payment_gateway_id VARCHAR(255), -- Stripe/Paystack transaction ID
  payment_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'success', 'failed'
  payment_date TIMESTAMP,
  refund_amount DECIMAL(10,2),
  refund_date TIMESTAMP,
  metadata JSONB, -- Store gateway-specific data
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reviews Table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  traveler_id UUID REFERENCES users(id) ON DELETE SET NULL,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  overall_rating INTEGER CHECK (overall_rating BETWEEN 1 AND 5),
  category_ratings JSONB, -- {\"accuracy\": 5, \"communication\": 4, \"value\": 5, \"quality\": 4}
  review_text TEXT,
  photos JSONB, -- Array of photo URLs
  is_anonymous BOOLEAN DEFAULT FALSE,
  is_verified_booking BOOLEAN DEFAULT TRUE,
  helpful_votes INTEGER DEFAULT 0,
  vendor_response TEXT,
  vendor_response_date TIMESTAMP,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'flagged', 'removed'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Messages Table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
  recipient_id UUID REFERENCES users(id) ON DELETE SET NULL,
  message_text TEXT NOT NULL,
  attachments JSONB, -- Photo/file URLs
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Promo Codes Table
CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(20), -- 'percentage', 'fixed'
  discount_value DECIMAL(10,2),
  min_purchase DECIMAL(10,2),
  max_discount DECIMAL(10,2),
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  valid_from TIMESTAMP,
  valid_until TIMESTAMP,
  applicable_categories JSONB, -- Array of categories
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'expired', 'disabled'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Blog Posts Table
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  category VARCHAR(100),
  tags JSONB, -- Array of tags
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'published', 'archived'
  published_at TIMESTAMP,
  view_count INTEGER DEFAULT 0,
  seo_meta_title VARCHAR(255),
  seo_meta_description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Disputes Table
CREATE TABLE disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  filed_by UUID REFERENCES users(id) ON DELETE SET NULL, -- Traveler or Vendor
  dispute_reason TEXT NOT NULL,
  evidence JSONB, -- Photos, documents, etc.
  status VARCHAR(20) DEFAULT 'open', -- 'open', 'in_progress', 'resolved', 'closed'
  resolution TEXT,
  resolved_by UUID REFERENCES users(id) ON DELETE SET NULL, -- Admin
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Notifications Table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  notification_type VARCHAR(50), -- 'booking_confirmed', 'message_received', 'review_received', etc.
  title VARCHAR(255),
  message TEXT,
  link TEXT, -- Link to relevant page
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Saved Listings (Wishlist)
CREATE TABLE saved_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- Vendor Payouts Table
CREATE TABLE vendor_payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  payout_method VARCHAR(50), -- 'bank_transfer', 'payoneer', 'crypto'
  payout_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  payout_date TIMESTAMP,
  transaction_id VARCHAR(255),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 8.2 Row Level Security (RLS) Policies

Supabase's RLS ensures data security at the database level. Example policies:

**Users can only see/edit their own data:**
```sql
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);
```

**Vendors can only manage their own listings:**
```sql
CREATE POLICY "Vendors can manage own listings"
  ON listings FOR ALL
  USING (vendor_id IN (
    SELECT id FROM vendors WHERE user_id = auth.uid()
  ));
```

**Public can view published listings:**
```sql
CREATE POLICY "Anyone can view published listings"
  ON listings FOR SELECT
  USING (status = 'published');
```

### 8.3 Indexes

Performance-critical indexes:

```sql
-- Listings
CREATE INDEX idx_listings_vendor_id ON listings(vendor_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_location_city ON listings(location_city);
CREATE INDEX idx_listings_created_at ON listings(created_at DESC);
CREATE INDEX idx_listings_featured ON listings(featured) WHERE featured = TRUE;
CREATE INDEX idx_listings_coordinates ON listings USING GIST(location_coordinates); -- For geospatial queries

-- Bookings
CREATE INDEX idx_bookings_traveler_id ON bookings(traveler_id);
CREATE INDEX idx_bookings_vendor_id ON bookings(vendor_id);
CREATE INDEX idx_bookings_listing_id ON bookings(listing_id);
CREATE INDEX idx_bookings_status ON bookings(booking_status);
CREATE INDEX idx_bookings_date ON bookings(booking_date);

-- Reviews
CREATE INDEX idx_reviews_listing_id ON reviews(listing_id);
CREATE INDEX idx_reviews_vendor_id ON reviews(vendor_id);

-- Full-text search
CREATE INDEX idx_listings_search ON listings USING GIN(to_tsvector('english', title || ' ' || description));
```

---

## 9. Integration Requirements

### 9.1 Payment Gateways

**Stripe (International)**
- **Use Case:** Accept international credit/debit cards, Apple Pay, Google Pay
- **Integration:** Stripe Checkout, Stripe Elements
- **Features:** 3D Secure, subscription billing, webhooks
- **Testing:** Stripe Test Mode
- **Go-Live:** Stripe account verification, business documents

**Paystack (Nigeria)**
- **Use Case:** Accept Nigerian Naira payments, local bank cards
- **Integration:** Paystack Inline JS, Paystack API
- **Features:** Bank transfers, mobile money (future)
- **Testing:** Paystack Test Mode
- **Go-Live:** Business registration with Paystack

**Flutterwave (Ghana)**
- **Use Case:** Accept Ghanaian Cedi payments, Mobile Money (MTN, Vodafone)
- **Integration:** Flutterwave Inline, Flutterwave API
- **Features:** Mobile money, bank transfers
- **Testing:** Flutterwave Test Mode
- **Go-Live:** Business registration with Flutterwave

### 9.2 Flight Booking APIs

**Amadeus Self-Service API**
- **Use Case:** Flight search, booking, pricing
- **Integration:** REST API
- **Pricing:** Pay-as-you-go
- **Features:** Real-time availability, multi-city, flexible dates

**Kiwi.com Tequila API**
- **Use Case:** Budget flight search, virtual interlining
- **Integration:** REST API
- **Pricing:** Transaction fees
- **Features:** Multi-city itineraries, flexible dates

**Alternative:** Partner with existing travel agencies (lower effort, higher commission)

### 9.3 Hotel Booking APIs (Phase 2)

**Booking.com Affiliate API**
- **Use Case:** Hotel inventory, bookings
- **Commission:** 25-40%
- **Integration:** REST API

**Expedia Rapid API**
- **Use Case:** Hotel inventory
- **Commission:** 15-25%
- **Integration:** REST API

**Alternative:** Direct partnerships with hotels (better margins)

### 9.4 Communication Services

**Resend (Email)**
- **Use Case:** Transactional emails (confirmations, receipts)
- **Pricing:** Free tier generous
- **Integration:** REST API, SMTP
- **Features:** Templates, analytics

**Twilio (SMS - International)**
- **Use Case:** SMS notifications
- **Pricing:** Pay-per-message
- **Integration:** REST API, SDK

**Termii (SMS - Nigeria)**
- **Use Case:** SMS notifications (Nigeria)
- **Pricing:** Pay-per-message
- **Integration:** REST API

### 9.5 Maps & Location

**Google Maps API**
- **Use Case:** Listing locations, map view, directions
- **Pricing:** $0.007 per map load (with free tier)
- **Integration:** JavaScript SDK

**Mapbox (Alternative)**
- **Use Case:** Custom maps, cheaper at scale
- **Pricing:** Free tier, then pay-per-load
- **Integration:** JavaScript SDK

### 9.6 Analytics & Monitoring

**PostHog (Product Analytics)**
- **Use Case:** User behavior tracking, feature flags, A/B testing
- **Pricing:** Free tier (1M events/month)
- **Integration:** JavaScript SDK

**Google Analytics 4**
- **Use Case:** Web analytics, traffic sources
- **Pricing:** Free
- **Integration:** gtag.js

**Sentry (Error Tracking)**
- **Use Case:** Frontend/backend error monitoring
- **Pricing:** Free tier generous
- **Integration:** JavaScript SDK, Next.js integration

### 9.7 Search (Optional - Phase 2)

**Algolia**
- **Use Case:** Fast, typo-tolerant search
- **Pricing:** Free tier (10K requests/month)
- **Integration:** JavaScript SDK, InstantSearch UI
- **Use When:** PostgreSQL full-text search is insufficient

---

## 10. User Flows

### 10.1 Traveler Booking Flow

```
1. Homepage
   └─> Search bar (enter destination, dates, category)
   
2. Search Results Page
   ├─> Apply filters (price, rating, category, etc.)
   ├─> View map
   └─> Click on listing

3. Listing Detail Page
   ├─> View photos, read description
   ├─> Check reviews
   ├─> Select date/guests
   ├─> Add extras
   └─> Click "Book Now"

4. Checkout Page
   ├─> Step 1: Confirm date/guests
   ├─> Step 2: Enter guest details
   ├─> Step 3: Payment
   │   ├─> Select payment method
   │   ├─> Enter card details
   │   └─> Apply promo code (optional)
   └─> Step 4: Confirmation
       ├─> Booking reference
       ├─> Download receipt
       └─> Email confirmation sent

5. User Dashboard
   ├─> View booking
   ├─> Message vendor
   ├─> Cancel (if allowed)
   └─> (After trip) Leave review
```

### 10.2 Vendor Onboarding Flow

```
1. Vendor Application
   ├─> Sign up as vendor
   ├─> Fill in business details
   ├─> Upload verification documents
   ├─> Submit bank/payout details
   └─> Submit application

2. Admin Review (Backend)
   ├─> Verify documents
   ├─> Background check
   └─> Approve/Reject

3. Vendor Approval
   ├─> Email notification
   └─> Onboarding guide

4. Create First Listing
   ├─> Select listing type
   ├─> Fill in details (title, description, pricing)
   ├─> Upload photos
   ├─> Set availability
   ├─> Publish listing

5. Vendor Dashboard
   ├─> Manage listings
   ├─> View bookings
   ├─> Respond to messages
   ├─> View analytics
   └─> Manage payouts
```

### 10.3 Admin Moderation Flow

```
1. Vendor Application Received
   ├─> Admin notified
   └─> Open application in admin panel

2. Review Application
   ├─> Check business documents
   ├─> Verify registration
   ├─> Check ID
   ├─> Run background check (if applicable)
   └─> Decision:
       ├─> Approve → Send welcome email
       ├─> Reject → Send rejection email with reason
       └─> Request More Info → Email vendor

3. Listing Moderation
   ├─> New listing submitted
   ├─> Admin reviews:
   │   ├─> Photos appropriate?
   │   ├─> Description accurate?
   │   ├─> Pricing reasonable?
   │   └─> No prohibited content?
   └─> Approve/Reject

4. Review Moderation
   ├─> Review flagged (profanity, spam, etc.)
   ├─> Admin reviews
   └─> Keep/Remove

5. Dispute Resolution
   ├─> Dispute filed
   ├─> Admin reviews evidence from both sides
   ├─> Mediate / Make decision
   └─> Close dispute (refund if applicable)
```

---

## 11. Revenue Model

### 11.1 Revenue Streams

**1. Commission on Bookings (Primary Revenue)**
- Events: 12-15%
- Tours: 15-18%
- Hotels: 15-20%
- Flights: 3-5% (low margin, volume play)
- Dining: 10-15%
- Transportation: 15-20%
- Packages: 18-22%

**2. Vendor Subscription Tiers**
- **Basic Vendor** (Free)
  - Standard listing features
  - 15-20% commission
- **Premium Vendor** ($99/month)
  - Featured placement
  - Advanced analytics
  - Lower commission (12-17%)
  - Priority support
- **Enterprise Vendor** (Custom pricing)
  - API access
  - White-label options
  - Dedicated account manager
  - Custom commission structure

**3. Promoted Listings (Advertising)**
- Vendors pay to feature listings at top of search results
- $50-200 per listing per week (depending on category, season)
- Expected: 20-30% of vendors use promoted listings

**4. Merchandise Sales**
- T-shirts, hoodies, hats, accessories
- Estimated margin: 30-40%
- Target: 5-10% of total revenue by Year 2

**5. Content & Sponsorships (Phase 2)**
- Sponsored blog posts
- Brand partnerships (e.g., airlines, hotels)
- Estimated: $5K-20K per sponsorship

**6. Premium Features for Travelers (Future)**
- "Detty December Plus" subscription
  - Ad-free experience
  - Exclusive deals
  - Priority customer support
  - Early access to events
- Price: $9.99/month or $79/year
- Target: 2-5% of active users

### 11.2 Financial Projections

**Assumptions:**
- Average booking value: $450
- Platform commission: 18% average
- Commission per booking: $81

**Year 1 Projections:**

| Quarter | Bookings | GMV | Commission Revenue | Other Revenue | Total Revenue | Costs | Profit |
|---------|----------|-----|-------------------|---------------|---------------|-------|--------|
| Q1 | 500 | $225K | $40K | $5K | $45K | $120K | -$75K |
| Q2 | 1,500 | $675K | $122K | $8K | $130K | $130K | $0 |
| Q3 | 2,500 | $1.125M | $203K | $12K | $215K | $140K | +$75K |
| Q4 (Detty December) | 10,500 | $5.5M | $935K | $25K | $960K | $160K | +$800K |
| **TOTAL** | **15,000** | **$7.5M** | **$1.3M** | **$50K** | **$1.35M** | **$550K** | **+$800K** |

**Year 2 Projections:**

| Metric | Year 2 |
|--------|--------|
| **Total Bookings** | 35,000 |
| **GMV** | $18M |
| **Commission Revenue** | $3.2M |
| **Subscription Revenue** | $120K |
| **Merchandise Revenue** | $180K |
| **Advertising Revenue** | $100K |
| **Total Revenue** | $3.6M |
| **Operating Costs** | $1.8M |
| **Profit** | $1.8M |

**Year 3 Projections:**

| Metric | Year 3 |
|--------|--------|
| **Total Bookings** | 65,000 |
| **GMV** | $35M |
| **Commission Revenue** | $6.3M |
| **Subscription Revenue** | $250K |
| **Merchandise Revenue** | $350K |
| **Advertising Revenue** | $200K |
| **Total Revenue** | $7.1M |
| **Operating Costs** | $3.5M |
| **Profit** | $3.6M |

### 11.3 Unit Economics

**Customer Acquisition Cost (CAC):**
- **Year 1:** $60 per customer (high due to brand building)
- **Year 2:** $45 per customer (improving as brand grows)
- **Year 3:** $35 per customer (organic + referrals)

**Customer Lifetime Value (LTV):**
- Average customer makes 1.5 bookings per year
- Retention rate: 40% (Year 1), 60% (Year 2), 75% (Year 3)
- Average lifespan: 3 years
- LTV = 1.5 bookings/year × $81 commission × 3 years = **$365**

**LTV:CAC Ratio:**
- Year 1: $365 / $60 = **6.1:1** ✅ (Healthy: >3:1)
- Year 2: $365 / $45 = **8.1:1** ✅
- Year 3: $365 / $35 = **10.4:1** ✅

**Payback Period:**
- Time to recover CAC through commissions
- Year 1: 60 days (0.74 bookings)
- Year 2: 40 days
- Year 3: 30 days

---

## 12. Success Metrics & KPIs

### 12.1 North Star Metric

**Gross Merchandise Value (GMV)**
- Total value of all bookings made through the platform
- Target: $7.5M (Year 1) | $18M (Year 2) | $35M (Year 3)

### 12.2 Primary KPIs

**Growth Metrics:**
- Total Bookings (monthly, quarterly, yearly)
- New vs. Repeat Customers
- Customer Acquisition Cost (CAC)
- Customer Lifetime Value (LTV)
- LTV:CAC Ratio

**Engagement Metrics:**
- Monthly Active Users (MAU)
- Daily Active Users (DAU) (Phase 2)
- Average Session Duration
- Bounce Rate
- Pages per Session
- Search-to-Booking Conversion Rate

**Financial Metrics:**
- GMV
- Revenue (commission + subscriptions + merchandise)
- Average Order Value (AOV)
- Take Rate (% of GMV)
- Profit Margin

**Vendor Metrics:**
- Total Active Vendors
- Vendor Churn Rate
- Listings per Vendor (avg)
- Vendor Satisfaction Score (CSAT)
- Vendor Payout Time (days)

**Platform Health Metrics:**
- Platform Availability (uptime %)
- Average Page Load Time
- Payment Success Rate
- Refund Rate
- Dispute Rate
- Customer Support Response Time

**Marketing Metrics:**
- Organic Traffic (SEO)
- Paid Traffic (Ads)
- Email Open Rate
- Email Click Rate
- Social Media Followers
- Referral Program Participation

### 12.3 Success Criteria by Phase

**MVP (Month 3):**
- ✅ 500 bookings
- ✅ 50 active vendors
- ✅ $250K GMV
- ✅ Platform uptime >99%
- ✅ Payment success rate >95%

**Growth (Month 12):**
- ✅ 15,000 bookings
- ✅ 500 active vendors
- ✅ $7.5M GMV
- ✅ 100K registered users
- ✅ LTV:CAC ratio >5:1
- ✅ Rank #1 for "Detty December" on Google

**Scale (Year 2):**
- ✅ 35,000 bookings
- ✅ 1,000 active vendors
- ✅ $18M GMV
- ✅ Expand to 5 West African markets
- ✅ 50% of revenue from non-December months

---

## 13. Development Roadmap

### 13.1 Phase 1: MVP (Months 0-3)

**Goal:** Ship a functional marketplace with core booking features

**Week 1-2: Foundation**
- [ ] Project setup (Next.js, Supabase, Vercel, Cloudflare)
- [ ] Design system & component library
- [ ] Database schema design & implementation
- [ ] Authentication flow (email, Google, Facebook)

**Week 3-4: Core Features**
- [ ] User registration & profiles
- [ ] Vendor onboarding flow
- [ ] Listing creation (Events, Tours, Hotels)
- [ ] Basic admin panel

**Week 5-6: Discovery & Booking**
- [ ] Search & filters
- [ ] Listing detail pages
- [ ] Booking flow (multi-step checkout)
- [ ] Payment integration (Stripe + Paystack)

**Week 7-8: Communication & Reviews**
- [ ] Email notifications (Resend)
- [ ] Reviews & ratings
- [ ] Messaging system (basic)

**Week 9-10: Vendor & Admin Dashboards**
- [ ] Vendor dashboard (bookings, analytics)
- [ ] Admin panel (vendor approval, moderation)

**Week 11-12: Testing, Launch Prep**
- [ ] QA testing (manual + automated)
- [ ] Security audit
- [ ] Performance optimization
- [ ] SEO setup (meta tags, sitemap)
- [ ] Onboard 25 vendors
- [ ] Soft launch

**MVP Launch:** End of Month 3

---

### 13.2 Phase 2: Growth (Months 4-12)

**Goal:** Scale to 15,000 bookings and establish market leadership

**Month 4-5: Optimization**
- [ ] Flight booking integration (Amadeus or partnership)
- [ ] Advanced search & filters
- [ ] Calendar & availability management
- [ ] Mobile PWA

**Month 6-7: Content & SEO**
- [ ] Blog/CMS implementation
- [ ] 50 blog posts published
- [ ] City landing pages (Lagos, Accra, Abuja)
- [ ] SEO optimization campaign

**Month 8-9: Marketing & Growth**
- [ ] Referral program
- [ ] Promo codes & discounts
- [ ] Influencer partnerships
- [ ] Paid ads (Google, Facebook, Instagram)

**Month 10-11: Features & UX**
- [ ] Customer support chat (Intercom or Crisp)
- [ ] Advanced analytics for vendors
- [ ] Multi-language support (Yoruba, Pidgin, Twi)
- [ ] Flutterwave integration (Ghana payments)

**Month 12: Detty December Push**
- [ ] Aggressive marketing campaign
- [ ] Featured vendors & promoted listings
- [ ] Email campaigns
- [ ] Social media blitz

**Phase 2 Target:** 15,000 bookings | $7.5M GMV | Break-even

---

### 13.3 Phase 3: Scale (Year 2+)

**Goal:** Pan-African expansion and feature maturity

**Q1 Year 2:**
- [ ] Native mobile apps (iOS, Android)
- [ ] AI-powered recommendations
- [ ] Dynamic pricing for vendors
- [ ] Group bookings

**Q2 Year 2:**
- [ ] Expand to Senegal, Kenya, South Africa
- [ ] Corporate accounts & team bookings
- [ ] Merchandise platform launch
- [ ] API for third-party integrations

**Q3 Year 2:**
- [ ] White-label solutions for partners
- [ ] Advanced fraud detection
- [ ] Multi-currency support (10+ currencies)
- [ ] Blockchain payments (optional)

**Q4 Year 2:**
- [ ] Year-round event expansion
- [ ] Subscription plans (Detty December Plus)
- [ ] Loyalty program
- [ ] International expansion (UK, US diaspora events)

**Phase 3 Target:** 35,000 bookings | $18M GMV | Profitability

---

## 14. Go-to-Market Strategy

### 14.1 Pre-Launch (Months 1-2)

**Objectives:**
- Build email list (10,000 subscribers)
- Generate buzz on social media
- Secure initial vendor partnerships

**Tactics:**
1. **Landing Page**
   - "Coming Soon" landing page with email capture
   - Countdown timer to launch
   - Early bird discount (20% off first booking)
   
2. **Social Media Teaser Campaign**
   - Instagram & TikTok: Behind-the-scenes content
   - Twitter/X: Daily Detty December facts
   - Goal: 10K followers before launch

3. **Influencer Seeding**
   - Reach out to 50 micro-influencers (10K-100K followers)
   - Offer free bookings in exchange for promotion
   - Goal: 10 influencer partnerships

4. **PR Campaign**
   - Press release to Nigerian & Ghanaian tech blogs
   - Pitch to TechCrunch, Techpoint Africa, Disrupt Africa
   - Goal: 3-5 media features

5. **Vendor Recruitment**
   - Direct outreach to top event organizers, hotels, tour operators
   - Offer first 25 vendors zero commission for 3 months
   - Goal: 50 vendors signed up

---

### 14.2 Launch (Month 3)

**Objectives:**
- 500 bookings in first month
- $250K GMV
- 100+ vendors

**Tactics:**
1. **Launch Event**
   - Virtual launch party with live DJ
   - Giveaways (free bookings, merchandise)
   - Influencer takeovers

2. **Email Campaign**
   - Announce launch to 10K subscribers
   - Exclusive 20% discount for early adopters

3. **Paid Ads**
   - Google Ads: "Detty December" keywords
   - Facebook/Instagram: Target diaspora (US, UK, Canada)
   - Budget: $10K

4. **Content Blitz**
   - Publish 10 blog posts (SEO-optimized)
   - Guest posts on travel blogs
   - YouTube videos (city guides)

5. **Referral Program**
   - "Refer a friend, get $20 credit"
   - Shareable links

---

### 14.3 Growth (Months 4-12)

**Objectives:**
- Scale to 15,000 bookings
- Establish brand as #1 for Detty December
- Expand vendor base to 500

**Tactics:**

**Q1 (Months 4-6):**
1. **SEO Domination**
   - Publish 50 blog posts
   - Backlink strategy (guest posts, partnerships)
   - Goal: Rank #1 for "Detty December"

2. **Content Marketing**
   - Weekly YouTube videos
   - Daily TikTok/Instagram Reels
   - User-generated content campaign (#MyDettyDecember)

3. **Partnerships**
   - Airlines (promo codes for flights)
   - Hotels (exclusive deals)
   - Event organizers (featured events)

**Q2 (Months 7-9):**
1. **Influencer Campaigns**
   - Pay 20 influencers for dedicated posts
   - Budget: $20K

2. **Email Marketing**
   - Build list to 50K subscribers
   - Weekly newsletters (tips, deals, new listings)

3. **Retargeting Ads**
   - Pixel-based retargeting (Facebook, Google)
   - Dynamic product ads

**Q3-Q4 (Months 10-12 - Detty December Season):**
1. **Massive Ad Spend**
   - Google Ads: $50K
   - Facebook/Instagram: $50K
   - TikTok: $20K

2. **PR Blitz**
   - Major media push (CNN, BBC, Al Jazeera)
   - "Detty December has a platform now" angle

3. **On-Ground Activations**
   - Pop-up booths at Lagos & Accra airports
   - Street teams with QR codes
   - Event sponsorships

4. **Partnerships with Major Events**
   - Official ticketing partner for 10+ major events
   - Exclusive access, early bird tickets

---

### 14.4 Customer Acquisition Channels

**Primary Channels:**

1. **Organic Search (SEO)**
   - Target: 40% of traffic by Month 12
   - Blog content, landing pages, city guides
   - Long-tail keywords

2. **Paid Search (Google Ads)**
   - Target: 25% of traffic
   - Branded keywords ("OneDettyDecember")
   - Category keywords ("Lagos events December")
   - Competitor keywords

3. **Social Media (Organic + Paid)**
   - Instagram: 30K followers (Year 1)
   - TikTok: 50K followers (Year 1)
   - Facebook: 20K followers
   - Twitter/X: 15K followers
   - Daily content, engagement, community building

4. **Influencer Marketing**
   - 50 micro-influencers (Year 1)
   - 10 macro-influencers (Year 1)
   - Affiliate commissions (10% per booking)

5. **Email Marketing**
   - 50K subscribers (Year 1)
   - Weekly newsletters
   - Segmented campaigns (diaspora vs. local)

6. **Referral Program**
   - 20% of bookings via referrals (by Month 12)

7. **Partnerships**
   - Airlines, hotels, travel agencies
   - Cross-promotions

---

## 15. Risk Management

### 15.1 Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Platform downtime during peak season** | HIGH | MEDIUM | - Use Vercel (99.99% uptime SLA) <br>- Cloudflare DDoS protection <br>- Load testing before December <br>- Auto-scaling configured |
| **Payment gateway failure** | HIGH | LOW | - Integrate multiple payment gateways <br>- Fallback options <br>- Monitor transaction success rates |
| **Data breach / security incident** | HIGH | LOW | - Row Level Security (RLS) in Supabase <br>- Regular security audits <br>- SSL/TLS encryption <br>- PCI DSS compliance |
| **Slow page load times** | MEDIUM | MEDIUM | - Image optimization (WebP, lazy loading) <br>- CDN (Cloudflare) <br>- Server-side rendering (Next.js) <br>- Performance monitoring (Vercel Analytics) |
| **Database scalability issues** | MEDIUM | LOW | - PostgreSQL scales well <br>- Optimize queries & indexes <br>- Read replicas if needed |

### 15.2 Business Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Low vendor adoption** | HIGH | MEDIUM | - Offer zero commission for first 3 months <br>- White-glove onboarding <br>- Prove value with early sales |
| **Customer acquisition costs too high** | HIGH | MEDIUM | - Focus on SEO (free traffic) <br>- Referral program <br>- Content marketing <br>- Influencer partnerships (affiliate model) |
| **Seasonality (80% revenue in December)** | HIGH | HIGH | - Expand to year-round events (Q1-Q3) <br>- Pre-sell December packages in January <br>- Diversify into corporate retreats |
| **Competition from established players** | MEDIUM | LOW | - Move fast, own the category <br>- Cultural authenticity (they can't replicate) <br>- Network effects (vendors + customers) |
| **Fraud / fake listings** | MEDIUM | MEDIUM | - Strict vendor verification <br>- Escrow payments <br>- User reviews & ratings <br>- Fraud detection (Stripe Radar) |
| **Currency fluctuations (NGN, GHS)** | MEDIUM | MEDIUM | - Price in USD <br>- Dynamic currency conversion <br>- Hedge FX risk with upfront deposits |
| **Vendor churn** | MEDIUM | LOW | - Provide value (sales, analytics, tools) <br>- Lower commission rates for loyal vendors <br>- Transparent communication |

### 15.3 Market Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Detty December trend fades** | HIGH | LOW | - Build brand equity beyond just December <br>- Year-round expansion <br>- Diversify into West African cultural tourism |
| **Economic downturn (Nigeria/Ghana)** | MEDIUM | MEDIUM | - Target diaspora (paid in USD/GBP/EUR) <br>- Offer budget-friendly options <br>- Payment plans |
| **Travel restrictions / pandemics** | MEDIUM | LOW | - Virtual experiences (backup) <br>- Refund policies <br>- Insurance partnerships |
| **Negative PR / viral incident** | MEDIUM | LOW | - Crisis management plan <br>- 24/7 customer support <br>- Transparent communication <br>- Insurance for disputes |

### 15.4 Operational Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Customer support overwhelm** | MEDIUM | HIGH | - Hire support team (3-5 people by Month 6) <br>- Chatbot for FAQs <br>- Knowledge base <br>- Vendor self-service tools |
| **Vendor disputes / complaints** | MEDIUM | MEDIUM | - Clear terms & conditions <br>- Escrow system <br>- Mediation process <br>- Insurance |
| **Key team member departure** | MEDIUM | LOW | - Document processes <br>- Cross-training <br>- Retain with equity |
| **Cash flow issues (late payouts)** | MEDIUM | MEDIUM | - Weekly payouts to vendors <br>- Maintain cash reserves <br>- Line of credit if needed |

### 15.5 Contingency Plans

**Scenario 1: Platform Goes Down During Detty December**
- Immediate: Switch to Cloudflare "Under Maintenance" page with status updates
- Backup: Manual booking via Google Form (less ideal, but functional)
- Communication: Email/SMS to all users with updates
- Post-mortem: Root cause analysis, implement fixes

**Scenario 2: Payment Gateway Failure**
- Immediate: Switch to backup gateway (Paystack → Stripe or vice versa)
- Manual: Accept bank transfers (manually confirm payments)
- Communication: Notify users via email/SMS

**Scenario 3: Major Vendor Cancels Last Minute**
- Immediate: Contact traveler, offer alternatives
- Compensation: Full refund + 20% credit toward future booking
- Vendor: Penalty (banned from platform, withheld payouts)

**Scenario 4: Low Vendor Adoption**
- Pivot: Partner with existing tour operators as aggregator (curate their offerings)
- Incentives: Increase onboarding bonuses, offer free premium tier for 6 months
- Outreach: Hire business development team to recruit vendors

---

## 16. Appendices

### 16.1 Glossary

- **GMV (Gross Merchandise Value):** Total value of transactions on the platform
- **Take Rate:** Platform commission as a percentage of GMV
- **CAC (Customer Acquisition Cost):** Cost to acquire one new customer
- **LTV (Lifetime Value):** Projected revenue from a customer over their lifetime
- **AOV (Average Order Value):** Average transaction value
- **RLS (Row Level Security):** Database-level security in Supabase
- **PWA (Progressive Web App):** Web app that works like a native app

### 16.2 Competitor Analysis

| Competitor | Strengths | Weaknesses | Our Advantage |
|------------|-----------|------------|---------------|
| **Booking.com** | Massive inventory, global brand | Generic, no cultural curation, no events | Detty December-specific, curated |
| **Airbnb Experiences** | Strong brand, trust | Limited West Africa inventory, not Detty December focused | Category ownership |
| **Eventbrite** | Event ticketing infrastructure | Just ticketing, no full trip planning | Full trip planning (flights, hotels, events) |
| **Instagram / WhatsApp** | Where people discover | No booking infrastructure, no trust/protection | Trusted booking platform |
| **Local Tour Operators** | On-ground expertise | Limited reach, manual processes | Technology + global reach |

### 16.3 Market Research Sources

- Nigerian Tourism Development Corporation (NTDC)
- Ghana Tourism Authority
- World Bank - Remittances Data
- Google Trends - Search volume data
- Instagram/TikTok - Hashtag analytics
- TravelPulse Africa
- Skift Research
- Phocuswright

### 16.4 Tech Stack Alternatives (If Needed)

**Database Alternatives:**
- **Firebase Firestore:** NoSQL, good for real-time, but less powerful queries
- **MongoDB Atlas:** NoSQL, flexible schema
- **PlanetScale:** MySQL-compatible, serverless

**Hosting Alternatives:**
- **Railway:** Simpler than Vercel, good for full-stack
- **Fly.io:** Global edge deployment
- **AWS Amplify:** Full AWS integration

**Payment Alternatives:**
- **Paystack:** Primary for Nigeria
- **Flutterwave:** Primary for Ghana & other African countries
- **Remita:** Nigeria-specific

---

## 17. Summary & Next Steps

### 17.1 Executive Summary

**OneDettyDecember** is positioned to become the **#1 global marketplace** for everything Detty December - from flights and hotels to events, tours, dining, and experiences. We're building a vertical SaaS marketplace that consolidates a fragmented $2.5 billion market into a single, trusted platform.

**Why We'll Win:**
1. **First-Mover Advantage:** No one else is building this
2. **Network Effects:** More vendors → more customers → more vendors
3. **Cultural Authority:** By the culture, for the culture
4. **Technology:** Modern, scalable, seamless UX
5. **Category Ownership:** We define "Detty December" in travelers' minds

**Path to Success:**
- **Year 1:** 15,000 bookings | $7.5M GMV | $1.35M revenue | Break-even
- **Year 2:** 35,000 bookings | $18M GMV | $3.6M revenue | Profitable
- **Year 3:** 65,000 bookings | $35M GMV | $7.1M revenue | Scale

**Next Milestone:** Ship MVP in 90 days with 50 vendors and 500 bookings.

---

### 17.2 Immediate Next Steps (This Week)

**For Product Team:**
- [ ] Finalize tech stack and architecture decisions
- [ ] Set up project infrastructure (GitHub, Vercel, Supabase)
- [ ] Create design system and component library
- [ ] Begin database schema implementation

**For Business Development:**
- [ ] Recruit first 25 vendors (zero commission offer)
- [ ] Secure partnerships with 3-5 major event organizers
- [ ] Reach out to potential investors (if needed)

**For Marketing:**
- [ ] Launch "Coming Soon" landing page with email capture
- [ ] Start social media accounts (Instagram, TikTok, Twitter)
- [ ] Create content calendar (blog posts, social media)
- [ ] Reach out to 20 influencers

**For Leadership:**
- [ ] Finalize hiring plan (developers, designers, support)
- [ ] Set up legal entity (LLC, terms of service, privacy policy)
- [ ] Open business bank accounts
- [ ] Register payment gateway accounts (Stripe, Paystack)

---

### 17.3 Key Decisions Needed

1. **Commission Rates:** Finalize commission structure by category
2. **Launch Date:** Soft launch vs. full launch timeline (recommend: Soft launch in 3 months, full launch in 6 months)
3. **Initial Geographic Focus:** Lagos-only or Lagos + Accra + Abuja?
4. **Vendor Onboarding:** Invite-only or open applications? (recommend: Invite-only for first 50)
5. **Mobile Strategy:** PWA in Phase 1 or native apps? (recommend: PWA Phase 1, native Phase 2)
6. **Content Strategy:** In-house writer or agency? (recommend: Freelance writers to start)
7. **Merchandise:** Launch with platform or Phase 2? (recommend: Phase 2)

---

## Conclusion

This PRD provides a comprehensive blueprint for building **OneDettyDecember** into the **world's #1 marketplace for everything Detty December**. By consolidating a fragmented market, leveraging modern technology, and building a trusted brand, we are positioned to capture a significant share of a $2.5 billion (and growing) market.

**Our mission is clear:** Make Detty December accessible, affordable, and unforgettable for millions of travelers worldwide - all in one platform.

---

**Let's build! 🚀**

---

**Document Version:** 2.0 (Global Marketplace Edition)  
**Last Updated:** November 9, 2025  
**Status:** Ready for Development

---

**Questions? Feedback? Next Steps?**

This PRD is a living document. As we build, learn, and iterate, we'll update it to reflect our evolving strategy and learnings.