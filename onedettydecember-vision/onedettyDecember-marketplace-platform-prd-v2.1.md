# Product Requirements Document (PRD)
## OneDettyDecember - Global Marketplace Platform

**The #1 Platform for Everything Detty December, Globally**

---

**Version:** 2.1 (Updated with OneDettyDecember Branding)  
**Date:** November 10, 2025  
**Prepared for:** OneDettyDecember Limited  
**Document Owner:** Product & Business Development  
**Classification:** Confidential

---

## Executive Summary

### Product Overview

**OneDettyDecember** is building the world's first and largest **comprehensive marketplace platform** for West Africa's $2.5 billion "Detty December" cultural phenomenon.

**What is Detty December?**  
Detty December is West Africa's unofficial cultural celebration spanning the entire month of December, when the African diaspora returns home for concerts, parties, beach clubs, cultural festivals, and family reunions across Nigeria, Ghana, and beyond.

**The Problem:**  
Currently, planning a Detty December experience requires:
- Searching 10+ different websites for flights, hotels, events, tours
- Uncertainty about event legitimacy and quality
- No centralized reviews or ratings
- Payment security concerns
- Information fragmented across social media, WhatsApp groups
- No trusted marketplace bringing it all together

**The Solution:** 
**OneDettyDecember™** - One platform for flights, accommodation, events, tours, experiences, and everything Detty December.

### Market Opportunity

- **Total Addressable Market (TAM):** $2.5 billion annually
- **Target Users:** 5+ million African diaspora travelers
- **Geographic Focus:** Nigeria & Ghana (Year 1), expand to Senegal, Cote d'Ivoire, Kenya (Year 2-3)
- **Peak Season:** Q4 (October-December) = 70% of annual revenue
- **Growth Rate:** 25-30% YoY as diaspora tourism increases

### Business Model

**Two-sided marketplace:**
- **Demand Side:** Travelers booking experiences
- **Supply Side:** Vendors listing services (hotels, event organizers, tour operators, restaurants)

**Revenue Streams:**
1. **Commission on bookings:** 10-15% per transaction
2. **Premium vendor listings:** Featured placement, analytics
3. **Advertising:** Sponsored content, banner ads
4. **Partnerships:** Affiliate commissions (flights, insurance)

### Competitive Advantage

1. **First Mover:** Only platform focused exclusively on Detty December
2. **Comprehensive:** All services in one place vs. fragmented competition
3. **Trust & Safety:** Verified vendors, escrow payments, reviews
4. **Cultural Authenticity:** Built by Africans, for Africans
5. **Community-Driven:** User-generated content, social features

---

## 1. Product Vision & Mission

### Vision Statement
"To become the world's leading marketplace for African cultural celebrations, starting with Detty December."

### Mission Statement
"We make Detty December accessible, affordable, and unforgettable by connecting travelers with verified vendors and curated experiences across West Africa."

### Core Values
1. **Celebration** - We bring people together for joy
2. **Trust** - We verify vendors and protect transactions
3. **Authenticity** - We celebrate African culture genuinely
4. **Community** - We build connections, not just transactions
5. **Excellence** - We deliver exceptional experiences

---

## 2. Target Audience & User Personas

### Primary Persona: "Diaspora Daniel"

**Demographics:**
- Age: 28-42
- Location: US, UK, Canada
- Income: $60k-150k USD/year
- Occupation: Professional (tech, finance, healthcare, education)

**Psychographics:**
- Proud of African heritage
- Values authentic cultural experiences
- Active on social media (Instagram, TikTok, Twitter)
- Wants to connect with roots while traveling
- Price-conscious but willing to pay for quality

**Pain Points:**
- "I don't know which events are legitimate"
- "I'm worried about getting scammed"
- "It takes forever to plan everything across multiple websites"
- "I want to know what other diasporans recommend"

**Goals:**
- Experience the best Detty December has to offer
- Find verified, safe vendors
- Get good value for money
- Share experiences on social media

---

### Secondary Persona: "Local Lola"

**Demographics:**
- Age: 22-35
- Location: Lagos, Accra, Port Harcourt
- Income: ₦200k-800k/month
- Occupation: Young professional

**Psychographics:**
- Social, loves parties and events
- Wants to explore local experiences
- Budget-conscious but likes good experiences
- Influenced by social media trends

**Pain Points:**
- "I want to discover new events I haven't heard of"
- "I need to know if an event is worth the price"
- "I want to buy tickets securely without cash"

**Goals:**
- Discover trending events
- Book securely with card
- Find last-minute deals

---

### Tertiary Persona: "Vendor Victor"

**Demographics:**
- Age: 28-50
- Location: Lagos, Accra
- Business: Event organizer, hotel owner, tour operator, restaurant

**Pain Points:**
- "I struggle to reach diaspora customers"
- "I spend too much on Instagram ads with poor ROI"
- "Payment collection is a nightmare"
- "No-shows and cancellations hurt my business"

**Goals:**
- Reach more customers
- Get paid securely and on time
- Build reputation through reviews
- Reduce marketing costs

---

## 3. Product Architecture

### Platform Type
**Progressive Web App (PWA) + Mobile Apps**

**Rationale:**
- **Web-first:** Lower development cost, faster iteration
- **PWA:** Install on mobile like native app, works offline
- **Native apps (later):** iOS/Android for app store presence in Year 2

### Tech Stack

**Frontend:**
- **Framework:** Next.js 14 (React + TypeScript)
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **UI Components:** shadcn/ui
- **Maps:** Google Maps API
- **Payments UI:** Stripe Elements / Paystack SDK

**Backend:**
- **Platform:** Supabase (PostgreSQL + Auth + Storage + Realtime)
- **API:** Next.js API routes + Supabase Edge Functions
- **File Storage:** Supabase Storage (images, documents)
- **Search:** Supabase full-text search

**Infrastructure:**
- **Hosting:** Vercel (frontend + API)
- **CDN:** Cloudflare (images, static assets)
- **DNS:** Cloudflare
- **Email:** SendGrid / Mailgun
- **SMS:** Twilio / Termii (Nigeria)

**Payments:**
- **Nigeria:** Paystack (primary), Flutterwave (backup)
- **International:** Stripe
- **Crypto (Phase 2):** Coinbase Commerce

**Third-Party Integrations:**
- **Flights:** Amadeus API / Kiwi.com API
- **Hotels:** Booking.com API (affiliate)
- **Maps & Places:** Google Places API
- **Analytics:** PostHog / Mixpanel
- **Customer Support:** Intercom / Crisp Chat

---

## 4. Core Features & Requirements

### 4.1 User-Facing Features (Traveler Side)

#### A. Browse & Search
**FR-001:** Users can browse experiences by category
- Flights & Transportation
- Accommodation (hotels, villas, Airbnbs)
- Events & Parties (concerts, boat cruises, beach clubs)
- Tours & Experiences (city tours, cultural experiences, food tours)
- Dining & Nightlife

**FR-002:** Users can search by:
- Location (Lagos, Accra, Port Harcourt, etc.)
- Date range
- Price range
- Category
- Keywords

**FR-003:** Advanced filters:
- Rating (4+ stars)
- Verified vendors only
- Price tiers (Budget, Mid-range, Luxury)
- Capacity (for events)
- Amenities (for hotels)

#### B. Discovery & Recommendations
**FR-004:** Personalized homepage feed based on:
- Previous bookings
- Saved items
- Similar users' preferences

**FR-005:** Curated collections:
- "Top 10 Detty December Parties 2025"
- "Best Beach Clubs in Lagos"
- "Family-Friendly Activities"
- "VIP Experiences"

**FR-006:** Trending section showing:
- Most booked experiences this week
- Recently added experiences
- Experiences friends have booked (if connected)

#### C. Listing Pages
**FR-007:** Every listing includes:
- High-quality photos/videos
- Detailed description
- Price (clear, no hidden fees)
- Location (map)
- Availability calendar
- Vendor profile
- Reviews & ratings
- Cancellation policy
- Inclusions/exclusions
- FAQs

**FR-008:** Social proof:
- "127 people booked this today"
- "Top-rated by diaspora travelers"
- "Verified by OneDettyDecember"

#### D. Booking & Checkout
**FR-009:** Simple checkout flow:
1. Select date/quantity
2. Add guest information
3. Review booking details
4. Enter payment information
5. Confirm booking

**FR-010:** Booking confirmation:
- Instant email confirmation
- SMS confirmation (for Nigeria users)
- Tickets/vouchers in email + app
- Add to calendar option

**FR-011:** Payment options:
- Debit/credit card (Paystack/Stripe)
- Bank transfer
- USSD (Nigeria)
- Crypto (Phase 2)

**FR-012:** Multi-currency support:
- NGN (Nigerian Naira)
- GHS (Ghana Cedis)
- USD, GBP, EUR, CAD

**FR-013:** Escrow payment system:
- Funds held until event occurs / check-in completed
- Automatic release to vendor after service delivered
- Refunds processed if vendor cancels

#### E. User Dashboard
**FR-014:** My Bookings section:
- Upcoming trips
- Past bookings
- Cancelled bookings
- Booking details (tickets, vouchers, receipts)

**FR-015:** Saved Items (Wishlist):
- Save experiences for later
- Share wishlist with friends
- Price drop alerts

**FR-016:** User Profile:
- Personal information
- Passport/travel document uploads (optional, for tours)
- Payment methods
- Notification preferences

**FR-017:** Reviews & Ratings:
- Leave reviews for experiences
- Upload photos to reviews
- Vote helpful on other reviews

#### F. Social Features
**FR-018:** Connect with friends (optional):
- See what friends are booking
- Split payments with friends
- Group bookings

**FR-019:** User-generated content:
- Upload photos/videos from experiences
- Tag vendors
- Earn badges (e.g., "Detty December Veteran")

---

### 4.2 Vendor-Facing Features (Supply Side)

#### A. Vendor Onboarding
**FR-020:** Vendor signup flow:
1. Business information (name, type, location, registration #)
2. Verify identity (BVN, CAC certificate, ID)
3. Bank account (for payouts)
4. Create first listing

**FR-021:** Verification process:
- OneDettyDecember team reviews application (24-48 hours)
- Background check for event organizers
- "Verified Vendor" badge upon approval

#### B. Listing Management
**FR-022:** Vendors can create listings for:
- Events (one-time or recurring)
- Accommodation (hotels, villas)
- Tours (daily, private, group)
- Restaurants/clubs (reservations, VIP tables)

**FR-023:** Listing creation includes:
- Photos/videos (min 5 photos)
- Description (min 100 words)
- Pricing structure
- Availability/calendar
- Capacity limits
- Cancellation policy
- Terms & conditions

**FR-024:** Bulk operations:
- Duplicate listings
- Bulk price updates
- Bulk availability updates

#### C. Booking Management
**FR-025:** Vendor dashboard shows:
- Today's bookings
- Upcoming bookings (7 days, 30 days)
- Revenue analytics
- Pending actions (respond to reviews, confirm bookings)

**FR-026:** Booking actions:
- Accept/decline booking requests (if manual approval enabled)
- View customer contact info
- Check-in customers (QR code scan)
- Mark booking as complete
- Issue refunds

#### D. Payments & Payouts
**FR-027:** Payout system:
- Weekly payouts (default)
- Daily payouts (for Premium vendors, 2% fee)
- Bank transfer direct to vendor account
- Payout dashboard (pending, completed)

**FR-028:** Transaction history:
- All bookings with commission breakdown
- Tax documentation (for invoicing)
- Downloadable reports (CSV/PDF)

#### E. Marketing Tools
**FR-029:** Promotional features:
- Discount codes (% off or fixed amount)
- Early bird pricing
- Flash sales
- Bundle deals (e.g., "Book hotel + concert")

**FR-030:** Featured listings (paid):
- Homepage placement
- Category page top slot
- Search result boost
- Pricing: ₦50,000-200,000/month depending on placement

#### F. Analytics & Insights
**FR-031:** Performance metrics:
- Views, clicks, conversions
- Revenue trends
- Booking sources (direct, search, referral)
- Customer demographics
- Review ratings over time

**FR-032:** Competitor insights:
- Average prices in category
- Top-performing listings
- Booking trends by date

---

### 4.3 Admin Panel Features

#### A. User Management
**FR-033:** Admin can:
- View all users
- Suspend/ban users for policy violations
- Reset passwords
- View user activity logs

#### B. Vendor Management
**FR-034:** Admin can:
- Approve/reject vendor applications
- Verify listings
- Suspend vendors for violations
- Issue warnings
- Contact vendors

#### C. Content Moderation
**FR-035:** Review queue:
- New listings pending approval
- Flagged content (reviews, photos)
- Disputes/complaints

**FR-036:** Manual moderation actions:
- Approve/reject listings
- Edit listings (typos, policy compliance)
- Remove inappropriate photos/reviews

#### D. Platform Analytics
**FR-037:** Dashboard showing:
- Total GMV (Gross Merchandise Value)
- Total bookings
- Active users (DAU, MAU)
- Active vendors
- Revenue (commission collected)
- Conversion rates (visit → search → booking)

#### E. Financial Management
**FR-038:** Finance tools:
- Vendor payout management
- Refund processing
- Revenue reconciliation
- Tax reporting

---

## 5. Technical Requirements

### 5.1 Performance Requirements

**NFR-001:** Page load time < 3 seconds (3G connection)  
**NFR-002:** API response time < 500ms (p95)  
**NFR-003:** Support 10,000 concurrent users  
**NFR-004:** 99.9% uptime during peak season (Nov-Dec)  
**NFR-005:** Mobile-first responsive design (works on 360px width)

### 5.2 Security Requirements

**NFR-006:** PCI DSS compliance for payment processing  
**NFR-007:** Data encryption at rest and in transit (TLS 1.3)  
**NFR-008:** Two-factor authentication for vendor accounts  
**NFR-009:** Rate limiting on all APIs (prevent abuse)  
**NFR-010:** GDPR compliance for EU users  
**NFR-011:** Regular security audits (quarterly)

### 5.3 Scalability Requirements

**NFR-012:** Horizontal scaling (add servers as traffic grows)  
**NFR-013:** Database read replicas for high-traffic queries  
**NFR-014:** CDN for static assets (images, CSS, JS)  
**NFR-015:** Caching layer (Redis) for frequent queries  
**NFR-016:** Queue system for background jobs (Supabase Edge Functions)

---

## 6. Development Roadmap

### Phase 1: MVP (Months 1-4)

**Goal:** Launch with core booking functionality for events and accommodation

**Features:**
- ✅ User registration & login
- ✅ Browse events and hotels
- ✅ Search & filters
- ✅ Booking & payment (Paystack)
- ✅ Vendor onboarding
- ✅ Basic vendor dashboard
- ✅ Admin panel (moderation)
- ✅ Email notifications

**Success Metrics:**
- 500+ registered users
- 50+ active vendors
- 100+ listings
- ₦5M GMV in first month

**Launch Date:** April 2026 (6 months before Detty December season)

---

### Phase 2: Growth & Optimization (Months 5-8)

**Goal:** Add tours, improve UX, launch mobile apps

**Features:**
- Tours & experiences booking
- User reviews & ratings
- Wishlist/saved items
- Social features (friends, sharing)
- Native mobile apps (iOS, Android)
- Improved search (AI-powered recommendations)
- Vendor analytics dashboard
- Promotional tools (discounts, flash sales)

**Success Metrics:**
- 5,000+ users
- 200+ vendors
- 500+ listings
- ₦50M GMV cumulative

---

### Phase 3: Scale & Expand (Months 9-12)

**Goal:** Expand to Ghana, add advanced features

**Features:**
- Ghana market launch (Accra, Kumasi)
- Flight booking integration (Amadeus API)
- Concierge service (premium planning)
- Vendor tiers (Basic, Premium, Enterprise)
- Advanced analytics for vendors
- Referral program
- Affiliate marketing
- API for third-party integrations

**Success Metrics:**
- 25,000+ users
- 500+ vendors
- 2,000+ listings
- ₦200M GMV cumulative
- Break-even on operations

---

### Phase 4: Ecosystem Expansion (Year 2)

**Goal:** Become #1 Detty December platform globally

**Features:**
- Expand to Senegal, Cote d'Ivoire, Kenya
- White-label solution for corporate clients
- Detty December Pass (subscription for premium perks)
- Merchandise shop
- Content platform (travel guides, blog, videos)
- Community features (forums, groups)
- B2B offerings (travel agencies, corporations)

**Success Metrics:**
- 100,000+ users
- 2,000+ vendors across 5 countries
- ₦1 billion GMV
- Profitability

---

## 7. Go-to-Market Strategy

### Marketing Channels

#### 1. Digital Marketing (50% of budget)
- **SEO:** Rank #1 for "Detty December," "Lagos parties," "Accra events"
- **Paid Ads:** Google, Facebook, Instagram, TikTok
- **Content Marketing:** Blog posts, YouTube videos, TikTok content
- **Email Marketing:** Weekly newsletters, personalized recommendations

#### 2. Influencer Marketing (25% of budget)
- Partner with African diaspora influencers
- Nano influencers (10k-50k followers) = high engagement
- Macro influencers (100k-1M) = reach
- Ambassador program (5-10 key influencers)

#### 3. Partnerships (15% of budget)
- Travel agencies in US, UK, Canada
- Nigerian/Ghanaian diaspora associations
- Airlines (affiliate deals)
- Tourism boards (Nigeria Tourism Development Corporation, Ghana Tourism Authority)

#### 4. PR & Media (10% of budget)
- Press releases to tech and travel media
- Features in diaspora publications (OkayAfrica, Pulse, BellaNaija)
- Podcast interviews

### Launch Strategy

**Pre-Launch (3 months before):**
- Build email list (landing page, lead magnets)
- Influencer seeding (gift experiences to influencers)
- Early vendor signups
- Beta testing with 100 users

**Launch (Detty December season):**
- PR blitz (announce availability)
- Paid ads ramp-up
- Influencer activation
- Referral program launch (refer a friend, get ₦5,000 credit)

**Post-Launch:**
- Retargeting campaigns
- User-generated content campaigns (#MyDettyDecember)
- Case studies and testimonials
- Iterate based on feedback

---

## 8. Business Model & Revenue

### Revenue Streams

**1. Transaction Commission (80% of revenue)**
- **Events:** 10-15% commission
- **Accommodation:** 12-18% commission
- **Tours:** 15-20% commission
- **Restaurants:** 10% commission on reservations

**2. Vendor Subscriptions (10% of revenue)**
- **Basic:** Free (10% higher commission)
- **Premium:** ₦25,000/month (lower commission, featured placement)
- **Enterprise:** ₦100,000/month (dedicated account manager, priority support)

**3. Advertising (5% of revenue)**
- Banner ads on homepage
- Sponsored listings
- Email newsletter sponsorships

**4. Affiliate Revenue (3% of revenue)**
- Flight bookings (5% commission from Amadeus/Kiwi.com)
- Travel insurance (15% commission)

**5. Other (2% of revenue)**
- Data/insights sold to vendors
- API access fees (for white-label)

### Pricing Strategy

**Commission Structure (Flexible):**
- Lower commission for high-volume vendors
- Higher commission for premium placement
- Early adopter discount (first 100 vendors pay 50% commission for first year)

---

## 9. Success Metrics & KPIs

### User Acquisition Metrics
- **Total Registered Users**
- **Active Users** (DAU, MAU)
- **User Acquisition Cost (CAC)**
- **Viral Coefficient** (referrals per user)

### Engagement Metrics
- **Search-to-Booking Conversion Rate** (target: 3-5%)
- **Repeat Booking Rate** (target: 30%+ within 12 months)
- **Average Session Duration** (target: 5+ minutes)
- **Pages per Session** (target: 4+)

### Business Metrics
- **Gross Merchandise Value (GMV)**
- **Total Bookings**
- **Average Order Value (AOV)**
- **Take Rate** (commission % of GMV)
- **Revenue** (total commission earned)
- **Gross Margin** (after payment processing fees)

### Vendor Metrics
- **Active Vendors**
- **Listings per Vendor** (target: 3+)
- **Vendor Satisfaction Score** (NPS)
- **Vendor Churn Rate** (target: <10%/year)

### Financial Metrics
- **Monthly Recurring Revenue (MRR)** - from subscriptions
- **Customer Lifetime Value (CLV)**
- **CAC/CLV Ratio** (target: <0.3)
- **Burn Rate**
- **Runway**
- **Path to Profitability**

---

## 10. Risk Management

### Key Risks & Mitigation

**Risk 1: Low Initial Liquidity (chicken-egg problem)**
- **Mitigation:** Onboard vendors first (3 months before user launch), guarantee minimum bookings, subsidize early listings

**Risk 2: Payment Fraud / Chargebacks**
- **Mitigation:** Escrow system, vendor verification, fraud detection (Stripe Radar), insurance

**Risk 3: Vendor Quality Issues / Bad Experiences**
- **Mitigation:** Verification process, review system, vendor scorecard, suspend low-rated vendors

**Risk 4: Seasonality (70% revenue in Q4)**
- **Mitigation:** Expand to year-round experiences, launch in other markets, B2B offerings

**Risk 5: Competition (Existing Players Copy Model)**
- **Mitigation:** First-mover advantage, exclusive vendor partnerships, brand loyalty, superior UX

**Risk 6: Regulatory Issues (Payment Licensing)**
- **Mitigation:** Use licensed payment processors (Paystack/Stripe), comply with CBN regulations, legal counsel

---

## 11. Team & Organization

### Required Roles (Phase 1)

**Product & Engineering:**
1. **CTO / Lead Engineer** - Full-stack (Next.js, Supabase, Vercel)
2. **Frontend Engineer** - UI/UX implementation
3. **Product Designer** - UX/UI design, user research

**Operations:**
4. **Operations Manager** - Vendor onboarding, support, moderation
5. **Community Manager** - Social media, influencer relations

**Marketing:**
6. **Growth Marketer** - Paid ads, SEO, analytics
7. **Content Creator** - Blog, social media content

**Founder (You):**
- CEO - Strategy, fundraising, partnerships, vision

### Hiring Plan
- **Month 1-2:** CTO, Product Designer
- **Month 3-4:** Frontend Engineer, Operations Manager
- **Month 5-6:** Growth Marketer, Content Creator, Community Manager

---

## 12. Funding & Budget

### Seed Round Target: $500k-$1M

**Use of Funds:**
- **Product Development:** 40% ($200k-400k)
- **Marketing & User Acquisition:** 35% ($175k-350k)
- **Operations & Team:** 20% ($100k-200k)
- **Legal & Compliance:** 5% ($25k-50k)

### 18-Month Budget Projection

| Category | Monthly | Year 1 Total |
|----------|---------|--------------|
| **Engineering** | $20k | $240k |
| **Marketing** | $30k | $360k |
| **Operations** | $10k | $120k |
| **Infrastructure** | $3k | $36k |
| **Legal/Admin** | $2k | $24k |
| **TOTAL** | **$65k** | **$780k** |

**Revenue Target (Year 1):** ₦200M GMV = ₦20M commission = ~$25k USD/month = $300k/year

**Break-even:** Month 18-24

---

## Conclusion

**OneDettyDecember** is positioned to become the **#1 marketplace for Detty December experiences globally**. With a clear product vision, robust technical architecture, and focused go-to-market strategy, we will capture significant market share in this underserved, rapidly growing segment.

**The opportunity is NOW** - Detty December is trending, diaspora travel is booming, and no one has built the comprehensive platform travelers need.

---

**Let's build the future of African cultural travel. 🎉**

---

## Appendices

### Appendix A: Competitive Analysis

| Competitor | Strengths | Weaknesses | How We Win |
|------------|-----------|------------|------------|
| **Eventbrite** | Global brand, established | Generic, not Africa-focused | Cultural authenticity, Detty December focus |
| **Booking.com** | Hotels globally | No events, tours, nightlife | Comprehensive platform |
| **Airbnb Experiences** | Strong brand, trust | Expensive, limited local presence | Lower fees, more variety |
| **Instagram/WhatsApp** | Direct vendor access | No trust, security, convenience | Trust, ease of use, discovery |
| **Local Event Sites** | Local knowledge | Fragmented, poor UX | Consolidated, superior UX |

### Appendix B: Technology Stack Details

[Details on hosting, database schema, API architecture, security protocols]

### Appendix C: Vendor Onboarding Process

[Step-by-step workflow for vendor registration and verification]

### Appendix D: Sample User Flows

[Wireframes and user journey maps for key flows]

---

**Document Version:** 2.1 (OneDettyDecember Branding Update)  
**Last Updated:** November 10, 2025  
**Status:** Ready for Development & Fundraising

© 2025 OneDettyDecember Limited. All rights reserved.
