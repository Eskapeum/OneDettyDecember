# OneDettyDecember Landing Page & Waitlist PRD (v1)

## 1. Purpose & Scope

Before full product build, OneDettyDecember will launch a **single marketing/landing page** that:
- Explains the value of the platform in **one clear scroll**.
- Captures **waitlist sign-ups** from both **travelers** and **vendors/hosts**.
- Lets people **start telling us what they plan to list or what kind of trip they want**, so we can shape supply, demand and product roadmap.

This PRD defines the landing page and waitlist flows only. Core marketplace, booking and community features remain defined in `OneDettyDecember-PRD-v4-final.md`.


## 2. Target Users

### 2.1 Travelers (Demand Side)

Global and African diaspora travelers (plus their friends) who are:
- Planning a Detty December trip to **Lagos, Accra or similar hubs**.
- Overwhelmed by **fragmented info and DM-based booking**.
- Looking for a **curated, safe, culturally-rooted way** to plan the season.

### 2.2 Vendors, Hosts & Partners (Supply Side)

- Event/party/festival organizers.
- Short-let hosts, small hotels, guesthouses.
- Experience hosts and tour operators.
- Car rental companies, individual drivers, airport transfer operators.
- Merch / art / fashion brands and cultural product creators.
- Brands/partners activating during Detty December.

They want **distribution to diaspora + locals**, better than managing bookings in DMs and spreadsheets.

**Key Vendor Pain Points & Motivations:**
- **Trust & Payment Issues:** 30-40% of DM bookings result in no-shows or payment disputes
- **Fragmented Management:** Average vendor manages 5+ channels (WhatsApp, IG, Email, calls)
- **Limited Reach:** Can't effectively reach international diaspora customers without costly marketing
- **No Analytics:** Zero visibility into conversion rates, customer preferences, or market trends
- **Competitive Advantage:** Early adopters get "Verified Vendor" badge and priority placement


## 3. Objectives & Success Metrics

### 3.1 Objectives

1. **Collect qualified waitlist sign-ups** segmented by traveler vs supply.
2. **Capture structured signals** about:
   - Where travelers want to go, when, and what vibe they want.
   - What vendors/hosts want to list, where and at what scale.
3. Establish a **world-class, culturally grounded brand presence** that feels like a
   "breath of the Motherland" but is as clean as top global travel/event platforms.

### 3.2 Success Metrics (v1)

- **Target: 5,000 total waitlist sign-ups** by launch (70% travelers, 30% vendors)
  - Stretch goal: 10,000 sign-ups
  - Minimum viable: 2,000 sign-ups
- **60% completion rate** for structured info fields
- **Conversion targets:**
  - Landing → Form start: 15%
  - Form start → Completion: 40%
  - Overall landing → Waitlist: 6%
- Distribution targets:
  - **Lagos:** 40-50% of signups
  - **Accra:** 20-30% of signups
  - **Other cities:** 20-40% (to identify expansion markets)


## 4. Platform Economics & Competitive Differentiation

### 4.1 Revenue Model (Post-Launch)
- **Commission Structure:** 12-15% on bookings (lower than Airbnb's 20%+)
- **Subscription Tiers for Vendors:**
  - Free: Basic listing, pay per booking
  - Premium ($49/month): Priority placement, analytics dashboard, bulk upload
  - Enterprise (Custom): API access, dedicated support, co-marketing
- **Value-Added Services:**
  - Insurance partnerships (2-3% add-on)
  - Payment protection (1% fee)
  - Promoted listings (auction-based)

### 4.2 Lock-in Mechanisms
- **Traveler Trust System:** Reviews tied to verified bookings only
- **Vendor Verification:** Multi-step verification creates switching cost
- **Loyalty Program:** "Detty Points" for repeat bookings (both sides)
- **Network Effects:** Group booking tools - coordinate with friends in-app
- **Data Advantage:** Predictive pricing and demand forecasting for vendors

### 4.3 Competitive Advantages vs Existing Channels
- **vs WhatsApp/IG DMs:**
  - Escrow payments reduce disputes
  - Structured catalog vs scattered posts
  - Automated availability management
- **vs Generic Platforms (Airbnb, Viator):**
  - Cultural authenticity and curation
  - Detty December-specific features (party packages, group coordination)
  - Local payment methods (Mobile money, bank transfer)
- **vs No Platform:**
  - 70% reduction in booking management time
  - 3x reach to international customers
  - Real-time pricing optimization

## 5. Core Value Proposition (Landing Messaging)

- **Headline (working):**
  - "Detty December, all in one place."
- **Subheadline (working):**
  - "Curated events, stays, hosted experiences, rides, store front for cultural works including merch and more across Lagos, Accra and beyond — built for the global African and her friends."
- **Traveler promise:**
  - "Skip the DM chaos. Plan your Detty December with real listings and a community that gets it."
- **Host/vendor promise:**
  - "Turn your event, stay, experience or cultural brand into a Detty December classic. Reach diaspora and locals in one place."


## 5. High-Level User Journeys

### 5.1 Traveler Journey (Landing → Waitlist)

1. Arrives on landing page (from social, search, referral or direct link).
2. Immediately understands **what OneDettyDecember is** (Detty December marketplace).
3. Clicks **"Plan my Detty December" / "Join traveler waitlist"**.
4. Completes a **short, mobile-first form** with:
   - Email.
   - Primary destination city for Detty December (Lagos, Accra, Other + free text).
   - Trip year (e.g. 2025, 2026).
   - Preferred trip "vibe" (multi-select tags, e.g. Nightlife, Food, Culture, Chill, Luxury).
5. Sees a **thank-you state** explaining what happens next and how/when they'll be contacted.

### 5.2 Vendor/Host Journey (Landing → Waitlist)

1. Arrives on landing page or scrolls to **host/vendor section**.
2. Sees **"List with OneDettyDecember"** proposition and economics at a glance.
3. Clicks **"Join host/vendor waitlist" / "I want to list"**.
4. Completes a short form with:
   - Email.
   - Role (Event organizer, Short-let host, Hotel/guesthouse, Experience host, Tour operator, Car rental/driver, Brand/partner, Other).
   - Primary city.
   - What they want to list (short free-text, optional link/IG handle).
   - Scale (Individual / Small team / Larger org).
5. Sees a **thank-you state** and optional prompt to share the page with their network.


## 6. Functional Requirements (Landing & Waitlist)

### 6.1 Page Structure

- **FR-LP-001:** Landing page must be **single, scrollable page** with clear sections:
  - Hero (headline, subheadline, primary CTAs for travelers and hosts).
  - Quick persona split ("Im planning a trip" vs "I want to list something").
  - "How it works" steps for travelers and hosts.
  - Waitlist forms (tabs or toggle for travelers vs hosts/vendors).
  - Supply-side benefits ("Why list with OneDettyDecember").
  - Preview of verticals (Events, Stays, Experiences, Car rentals & transfers).
  - FAQ and footer (links, social, contact).

- **FR-LP-002:** Header must include:
  - Logo.
  - Nav links (How it works, For Travelers, For Vendors & Hosts, FAQ).
  - Persistent CTAs: "Get Early Access" and "List with OneDettyDecember" that scroll to the appropriate form.

### 6.2 Traveler Waitlist Form (Progressive Disclosure)

- **FR-LP-010:** Traveler form uses **2-step progressive disclosure**:
  - **Step 1 (Immediate):** Email only with single CTA "Get Early Access"
  - **Step 2 (After email):** Personalization fields appear inline:
    - Primary city (required; options: Lagos, Accra, Abuja, Kigali, Nairobi, Johannesburg, Other + free-text)
    - Trip timing (required; "December 2025", "December 2026", "Not sure yet")
    - Optional: Trip vibe (single-select with emojis: 🎉 Party Central, 🍽️ Foodie Paradise, 🎨 Culture Deep Dive, 🏖️ Beach & Chill, ✨ Luxury Experience, 🤝 Everything)

- **FR-LP-011:** Form interaction patterns:
  - **Desktop:** All fields can appear at once after email entry
  - **Mobile:** One field at a time with smooth transitions
  - Auto-advance after selection (with ability to go back)
  - Progress indicator showing "1 of 3" steps

- **FR-LP-012:** On successful submission, show **personalized confirmation**:
  - "You're on the list for Detty December [City] [Year]!"
  - Social sharing buttons with pre-filled text
  - Optional: "Tell us more" link for detailed preferences survey

### 6.3 Vendor/Host Waitlist Form (Progressive)

- **FR-LP-020:** Host/vendor progressive form:
  - **Step 1:** Email + Business name (or personal name)
  - **Step 2:** Core business info:
    - Role (required; icons + labels: 🎉 Events, 🏠 Stays, 🎭 Experiences, 🚗 Transport, 🛍️ Merch/Art, 🤝 Brand Partner)
    - Primary city (same as traveler options)
  - **Step 3:** Scale & Details:
    - Business scale with clear definitions:
      - **Individual:** "Just me" (< $10K/month revenue)
      - **Small Business:** "2-10 people" ($10-100K/month)
      - **Growing Business:** "11-50 people" ($100K-1M/month)
      - **Enterprise:** "50+ people" (> $1M/month)
    - Optional: Brief description or Instagram handle

- **FR-LP-021:** Vendor form optimizations:
  - Show value props between steps ("Join 500+ vendors already signed up")
  - Display potential earnings calculator based on role/city selection
  - "Skip details for now" option after email (captures lead even if incomplete)

- **FR-LP-022:** Enhanced vendor confirmation:
  - **"Founding Vendor" badge** visualization
  - Estimated launch timeline for their city
  - Instant download: "Vendor Success Guide PDF"
  - Calendar link to book optional onboarding call

### 6.4 Data Capture & Management

- **FR-LP-030:** All waitlist submissions must be stored in a structured data store (e.g. Supabase table or equivalent) with:
  - Timestamp (created_at, updated_at)
  - User type (Traveler or Host/Vendor)
  - Form fields as defined above
  - Source/UTM tracking (source, medium, campaign, content, term)
  - IP address and geo-location (for fraud detection)
  - Form completion time (for bot detection)
  - Email verification status

- **FR-LP-031:** Admin dashboard requirements:
  - Real-time metrics dashboard (Retool or custom)
  - Advanced filtering (user type, city, role, date range, verification status)
  - Bulk actions (email campaigns, status updates, exports)
  - Duplicate detection and merge tools
  - Export to CSV with field selection
  - Webhook integrations for CRM/email tools

### 6.5 Technical Implementation & Security

- **FR-LP-040:** Email validation strategy:
  - **Level 1 (Instant):** RFC 5322 format validation
  - **Level 2 (Async):** DNS/MX record verification
  - **Level 3 (Post-submit):** Email deliverability check via Resend API
  - Auto-flag suspicious patterns (temporary emails, typo-squatting)

- **FR-LP-041:** Duplicate & fraud prevention:
  - Check email against existing records (both traveler and vendor tables)
  - Allow same email for both traveler AND vendor (legitimate use case)
  - Block rapid successive submissions from same IP (rate limiting: 3 per hour)
  - CAPTCHA triggered after 2 attempts or suspicious behavior
  - Fingerprinting to detect bot submissions

- **FR-LP-042:** Security requirements:
  - Rate limiting: Max 10 submissions per IP per hour
  - CORS properly configured for API endpoints
  - Input sanitization for all free-text fields
  - GDPR-compliant data handling with consent checkboxes
  - Regular automated backups of waitlist data
  - PII encryption at rest

### 6.6 Content & Cultural Experience

- **FR-LP-050:** Language and tone requirements:
  - Primary language: **English** with Nigerian Pidgin phrases for authenticity
  - Key phrases in local languages (Yoruba, Igbo, Twi) with translations
  - Voice: Energetic, warm, celebratory - "Your cousin who knows everyone"
  - Avoid: Corporate jargon, "budget" terminology, generic travel clichés

- **FR-LP-051:** Cultural and emotional elements:
  - **Hero section:** Auto-playing background video montage of Detty December moments (dancing, food, fashion, gatherings)
  - **Sound design:** Optional ambient Afrobeats playing softly (with mute control)
  - **Testimonial carousel:** Video stories from 2024 attendees showing transformation ("I came alone, left with family")
  - **Visual language:**
    - Warm color palette inspired by Lagos sunsets and Accra nights
    - Pattern overlays using Ankara/Kente motifs (subtle, not overwhelming)
    - Photography showing real people, real moments (not stock photos)

- **FR-LP-052:** Emotional journey mapping in copy:
  - **Awareness:** "Remember that feeling when the plane touches down?"
  - **Interest:** "Where JAPA stress becomes JAGUDA joy"
  - **Desire:** "Your people. Your music. Your December to remember."
  - **Action:** "Claim your spot in the movement"


## 7. Non-Functional Requirements (Landing & Waitlist)

### 7.1 Performance Requirements
- **NFR-LP-001:** Core Web Vitals targets:
  - Largest Contentful Paint (LCP): < 2.5s on 3G
  - First Input Delay (FID): < 100ms
  - Cumulative Layout Shift (CLS): < 0.1
  - Time to Interactive (TTI): < 3.5s on 3G

- **NFR-LP-002:** Optimization strategies:
  - Images: WebP with fallbacks, lazy loading, responsive srcset
  - Video: MP4 for hero, < 2MB, with poster frame
  - Fonts: Variable fonts, font-display: swap, subset for used characters
  - CDN: Multi-region (Lagos, Accra, London, NYC minimum)

### 7.2 Reliability & Scalability
- **NFR-LP-003:** Infrastructure requirements:
  - **Uptime SLA:** 99.5% during campaign (Dec 1 - Jan 15)
  - **Traffic capacity:** Handle 10,000 concurrent users
  - **Form submissions:** Process 100 submissions/minute peak
  - **Auto-scaling:** Based on CPU and memory thresholds
  - **Failover:** Multi-region with automatic DNS failover

### 7.3 Mobile & Accessibility
- **NFR-LP-004:** Mobile-first requirements:
  - Touch targets: Minimum 44x44px
  - Form inputs: 16px minimum to prevent zoom
  - Viewport: Responsive 320px to 414px primary breakpoint
  - Network: Graceful degradation on 2G/3G
  - Offline: Service worker for basic offline message

### 7.4 Privacy & Compliance
- **NFR-LP-005:** Data protection:
  - GDPR compliance with clear consent mechanisms
  - NDPR (Nigeria Data Protection Regulation) compliance
  - Cookie consent banner with granular controls
  - Data retention: 24 months for waitlist
  - Right to deletion within 72 hours of request

### 7.5 Analytics & Monitoring
- **NFR-LP-006:** Tracking requirements:
  - Analytics: GA4 + Mixpanel for granular events
  - Heatmaps: Hotjar or Clarity for UX insights
  - Error tracking: Sentry for JavaScript errors
  - Uptime monitoring: UptimeRobot + custom health checks
  - A/B testing: Built-in capability for headline/CTA tests


## 8. Out of Scope (v1)

- Full account registration, login and profile creation flows.
- In-page live chat or AI assistant on the landing page (may be added later).
- Actual booking, payment or listing management flows (these remain in core PRD).


## 9. Future Expansion Considerations

### 9.1 Geographic Expansion Pipeline
Based on waitlist data, consider phased expansion:
- **Phase 1 (Launch):** Lagos, Accra
- **Phase 2 (Month 3):** Abuja, Nairobi, Kigali
- **Phase 3 (Month 6):** Johannesburg, Dakar, Kampala
- **Phase 4 (Year 2):** Caribbean (Trinidad Carnival), London (Notting Hill), NYC (Afropunk)

### 9.2 Seasonal Event Expansion
- **Detty December:** Primary focus (November - January)
- **Easter/Spring:** Calabar Carnival, Ghana Independence
- **Summer:** Afronation, Essence Festival, Caribbean Carnivals
- **Fall:** Felabration, Lake of Stars, Sauti za Busara

### 9.3 Platform Evolution Signals
Track waitlist data for future features:
- Group booking interest (>3 people traveling together)
- Package deal preferences (flight + stay + events)
- Payment method preferences (crypto, BNPL, mobile money)
- Community features demand (travel buddies, reviews, forums)

## 10. Dependencies

- Brand guidelines, color palette, typography and logo (already defined)
- Basic infrastructure for hosting (Next.js + Vercel) and data store (Supabase)
- Email service configuration (Resend) for transactional and marketing emails
- CDN setup for multi-region content delivery
- Analytics and monitoring tools setup
- Legal review for privacy policy and terms of service

