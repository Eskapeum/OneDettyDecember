# EPIC 18: COMPREHENSIVE ADMIN DASHBOARD

**Epic ID:** DDT-EPIC-18
**Epic Name:** Admin Dashboard & Management Console
**Priority:** P0 - Critical
**Estimated Points:** 144 points (12 weeks)
**Status:** Not Started
**Owner:** Product Manager

---

## 📋 EPIC OVERVIEW

### **Business Context**

The Admin Dashboard is the mission control center for OneDettyDecember. It empowers the operations team to manage the entire marketplace efficiently, make data-driven decisions, and provide exceptional customer service. Without a robust admin dashboard, the platform cannot scale beyond manual operations.

### **Problem Statement**

Currently, platform administrators have no centralized way to:
- Monitor real-time booking activity and revenue
- Manage vendor partnerships and commissions
- Handle customer support queries efficiently
- Track key performance metrics (KPIs)
- Generate financial and operational reports
- Moderate reviews and content
- Configure platform settings

This manual, fragmented approach limits operational efficiency, increases response times, and makes it impossible to scale the business.

### **Solution**

Build a comprehensive, modern admin dashboard that provides:
1. **Real-time Analytics:** Live view of bookings, revenue, and user activity
2. **Booking Management:** Complete control over all bookings lifecycle
3. **Vendor Management:** Onboard, manage, and pay vendors
4. **User Management:** Manage customers, permissions, and support tickets
5. **Content Management:** Moderate reviews, manage packages, upload media
6. **Financial Management:** Track revenue, commissions, payouts, refunds
7. **System Configuration:** Platform settings, integrations, and security

### **Success Metrics**

**Operational Efficiency:**
- Reduce booking processing time by 75% (from 10 min to 2.5 min)
- Handle 100+ bookings per day with same team size
- Resolve support tickets in <2 hours (vs. current 8 hours)

**Business Intelligence:**
- Real-time visibility into all KPIs (revenue, bookings, conversion)
- Generate financial reports in <5 minutes (vs. current 2 hours)
- Identify top-performing packages and vendors instantly

**User Experience:**
- Admin dashboard load time <2 seconds
- Mobile-responsive for on-the-go management
- 95%+ admin user satisfaction score

---

## 🎯 USER PERSONAS

### **Primary Users**

**1. Platform Administrator (Sarah)**
- **Role:** Operations Manager
- **Goals:** Oversee all platform operations, ensure smooth bookings, resolve escalations
- **Pain Points:** No centralized view, manual data compilation, slow response times
- **Technical Skill:** Medium - comfortable with business software

**2. Finance Manager (Emeka)**
- **Role:** CFO/Finance Lead
- **Goals:** Track revenue, manage vendor payouts, ensure accurate accounting
- **Pain Points:** Manual reconciliation, delayed reporting, commission errors
- **Technical Skill:** High - Excel power user

**3. Customer Support Agent (Chioma)**
- **Role:** Support Specialist
- **Goals:** Resolve customer issues quickly, process refunds, update bookings
- **Pain Points:** Lack of booking details, no communication tools, manual processes
- **Technical Skill:** Low-Medium - needs intuitive interface

**4. Marketing Manager (David)**
- **Role:** Growth Lead
- **Goals:** Track campaign performance, analyze user behavior, optimize conversion
- **Pain Points:** No marketing analytics, can't A/B test, manual tracking
- **Technical Skill:** Medium-High - familiar with analytics tools

**5. Super Admin (CEO/CTO)**
- **Role:** Executive Leadership
- **Goals:** Strategic oversight, high-level metrics, system configuration
- **Pain Points:** No executive dashboard, can't configure platform settings
- **Technical Skill:** High - technical background

---

## 🏗️ ARCHITECTURE OVERVIEW

### **Tech Stack**
- **Frontend:** React 18 + TypeScript + Tailwind CSS
- **Admin UI Library:** React Admin / Tremor / Ant Design
- **Charts/Visualization:** Recharts / ApexCharts
- **State Management:** React Query + Zustand
- **Tables:** TanStack Table (React Table v8)
- **Date Handling:** date-fns
- **Forms:** React Hook Form + Zod validation

### **Dashboard Structure**

```
┌─────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD                       │
└─────────────────────────────────────────────────────────┘
│
├── 1. OVERVIEW DASHBOARD (Home)
│   ├── Key Metrics Cards (Revenue, Bookings, Users, etc.)
│   ├── Charts (Revenue trends, Booking pipeline)
│   ├── Recent Activity Feed
│   └── Quick Actions
│
├── 2. BOOKINGS MANAGEMENT
│   ├── Bookings List (with advanced filters)
│   ├── Booking Details View
│   ├── Booking Calendar View
│   ├── Booking Status Management
│   └── Bulk Operations
│
├── 3. PACKAGES MANAGEMENT
│   ├── Packages List
│   ├── Create/Edit Package
│   ├── Package Analytics
│   └── Package Categories
│
├── 4. VENDORS MANAGEMENT
│   ├── Vendors List
│   ├── Vendor Profile & KPIs
│   ├── Vendor Onboarding Workflow
│   ├── Commission Management
│   └── Vendor Payouts
│
├── 5. USERS MANAGEMENT
│   ├── Users List (Customers)
│   ├── User Details & Activity
│   ├── User Segmentation
│   └── User Communication
│
├── 6. REVIEWS & RATINGS
│   ├── Reviews List (pending moderation)
│   ├── Review Details
│   ├── Approve/Reject Reviews
│   └── Review Analytics
│
├── 7. FINANCIAL MANAGEMENT
│   ├── Revenue Dashboard
│   ├── Transactions Log
│   ├── Payouts Management
│   ├── Refunds Processing
│   └── Financial Reports
│
├── 8. ANALYTICS & REPORTS
│   ├── Business Intelligence Dashboard
│   ├── Custom Reports Builder
│   ├── Export Data (CSV/Excel/PDF)
│   └── Scheduled Reports
│
├── 9. CONTENT MANAGEMENT
│   ├── Media Library
│   ├── Blog Posts
│   ├── FAQs Management
│   └── Email Templates
│
├── 10. SYSTEM SETTINGS
│   ├── Platform Configuration
│   ├── Payment Settings
│   ├── Email/SMS Settings
│   ├── Admin Users & Roles
│   └── Security Settings
│
└── 11. SUPPORT & COMMUNICATION
    ├── Support Tickets
    ├── Live Chat (integration)
    ├── Email Broadcast
    └── Notifications Center
```

---

## 📊 USER STORIES & DEVELOPER TICKETS

---

## **STORY 14.1: Overview Dashboard - Real-Time Metrics**

**As a** Platform Administrator  
**I want to** view real-time key metrics on the dashboard  
**So that** I can quickly assess platform health and performance

**Acceptance Criteria:**
- [ ] Display 6 key metric cards: Total Revenue, Active Bookings, Total Users, Conversion Rate, Average Order Value, Monthly Growth
- [ ] Each metric shows current value and % change from previous period
- [ ] Metrics update in real-time (or every 30 seconds)
- [ ] Color coding: Green for positive trends, Red for negative
- [ ] Click on metric to see detailed breakdown
- [ ] Support multiple time ranges: Today, This Week, This Month, This Year, Custom
- [ ] Mobile-responsive layout

### **Technical Tasks**

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1401: Build Dashboard Metrics API             │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 8 points | Assignee: Backend Dev

DESCRIPTION:
Create API endpoints to fetch real-time dashboard metrics with 
period-over-period comparisons and trend data.

TASKS:
- [ ] Implement GET /api/admin/dashboard/metrics endpoint
- [ ] Calculate key metrics from database:
  - Total Revenue (sum of all successful payments)
  - Active Bookings (status: confirmed)
  - Total Users (unique registered users)
  - Conversion Rate (bookings / unique visitors)
  - Average Order Value (total revenue / bookings)
  - Monthly Growth (current month vs previous month %)
- [ ] Add time range filter (today, week, month, year, custom)
- [ ] Calculate period-over-period changes (% increase/decrease)
- [ ] Implement Redis caching (TTL: 30 seconds)
- [ ] Optimize queries with database indexes
- [ ] Add error handling and logging
- [ ] Write unit tests (80%+ coverage)
- [ ] Document API endpoint

QUERY OPTIMIZATION:
-- Use materialized view for faster metrics calculation
CREATE MATERIALIZED VIEW daily_metrics AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as bookings_count,
  SUM(total_price) as revenue,
  COUNT(DISTINCT user_id) as unique_users
FROM bookings
WHERE status = 'confirmed'
GROUP BY DATE(created_at);

-- Refresh materialized view hourly via cron job

RESPONSE FORMAT:
{
  "metrics": [
    {
      "key": "total_revenue",
      "label": "Total Revenue",
      "value": 125000,
      "formatted": "$125,000",
      "change": 15.5,
      "trend": "up",
      "icon": "dollar-sign"
    },
    {
      "key": "active_bookings",
      "label": "Active Bookings",
      "value": 342,
      "formatted": "342",
      "change": -5.2,
      "trend": "down",
      "icon": "calendar"
    },
    // ... other metrics
  ],
  "period": {
    "start": "2025-11-01T00:00:00Z",
    "end": "2025-11-08T23:59:59Z"
  }
}

DEPENDENCIES: DDT-303 (Booking Schema)
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1402: Build Metrics Cards Component           │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 5 points | Assignee: Frontend Dev

DESCRIPTION:
Create reusable MetricCard components that display KPIs with 
trend indicators and click-to-drill-down functionality.

TASKS:
- [ ] Create MetricCard React component
- [ ] Display metric value with proper formatting
  - Currency: $125,000
  - Numbers: 1,234
  - Percentages: 15.5%
- [ ] Show trend indicator (↑ ↓) with color coding
  - Green: positive trend
  - Red: negative trend
  - Gray: no change
- [ ] Add period-over-period comparison text
  - "+15.5% from last month"
  - "-5.2% from last week"
- [ ] Implement loading skeleton
- [ ] Add error state handling
- [ ] Make cards clickable to drill down
- [ ] Responsive grid layout (1 col mobile, 2-3 col desktop)
- [ ] Add icons using Lucide React
- [ ] Write component tests
- [ ] Add Storybook stories

COMPONENT API:
<MetricCard
  label="Total Revenue"
  value={125000}
  format="currency"
  change={15.5}
  trend="up"
  icon="dollar-sign"
  onClick={() => navigate('/admin/revenue')}
  loading={false}
  error={null}
/>

TECH: React, TypeScript, Tailwind CSS, Lucide Icons
DEPENDENCIES: DDT-1401
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1403: Implement Time Range Selector           │
└─────────────────────────────────────────────────────────┘

Priority: P1 | Estimate: 3 points | Assignee: Frontend Dev

DESCRIPTION:
Build a time range selector component that allows admins to 
filter dashboard metrics by different time periods.

TASKS:
- [ ] Create TimeRangeSelector component
- [ ] Support preset ranges:
  - Today
  - Last 7 days
  - Last 30 days
  - This month
  - Last month
  - This year
  - Custom (date range picker)
- [ ] Implement date range picker using react-day-picker
- [ ] Update URL query params on selection
- [ ] Persist selection in localStorage
- [ ] Add "Compare to previous period" checkbox
- [ ] Refetch metrics on time range change
- [ ] Add keyboard shortcuts (t=today, w=week, m=month)
- [ ] Write component tests

DEPENDENCIES: DDT-1401
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1404: Real-Time Metrics Updates (WebSocket)   │
└─────────────────────────────────────────────────────────┘

Priority: P2 | Estimate: 8 points | Assignee: Full-Stack Dev

DESCRIPTION:
Implement WebSocket connection for real-time dashboard metric 
updates without page refresh.

TASKS:
- [ ] Set up Socket.IO server
- [ ] Create WebSocket endpoint /admin/metrics
- [ ] Emit metric updates every 30 seconds
- [ ] Handle connection/disconnection gracefully
- [ ] Implement reconnection logic
- [ ] Add connection status indicator in UI
- [ ] Throttle updates to prevent UI thrashing
- [ ] Fallback to polling if WebSocket unavailable
- [ ] Write integration tests

OPTIONAL: Can be deferred to Phase 2
DEPENDENCIES: DDT-1401
```

---

## **STORY 14.2: Revenue & Bookings Charts**

**As a** Platform Administrator  
**I want to** visualize revenue and booking trends over time  
**So that** I can identify patterns and make data-driven decisions

**Acceptance Criteria:**
- [ ] Display revenue chart (line chart) showing daily/weekly/monthly revenue
- [ ] Display bookings chart (bar chart) showing booking volume
- [ ] Support multiple chart views: Line, Bar, Area
- [ ] Interactive charts with tooltips showing exact values
- [ ] Toggle between revenue and bookings metrics
- [ ] Export chart data as CSV
- [ ] Charts are responsive and render correctly on mobile

### **Technical Tasks**

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1405: Build Charts Data API                   │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 5 points | Assignee: Backend Dev

DESCRIPTION:
Create API endpoints to fetch time-series data for revenue 
and bookings charts.

TASKS:
- [ ] Implement GET /api/admin/analytics/revenue endpoint
- [ ] Implement GET /api/admin/analytics/bookings endpoint
- [ ] Support grouping by: day, week, month, year
- [ ] Calculate aggregates (sum, count, average)
- [ ] Include period-over-period comparison data
- [ ] Optimize with database indexes on created_at
- [ ] Implement caching (5 min TTL)
- [ ] Write API documentation
- [ ] Write unit tests

RESPONSE FORMAT:
{
  "data": [
    { "date": "2025-11-01", "value": 12500, "count": 25 },
    { "date": "2025-11-02", "value": 15800, "count": 32 },
    // ...
  ],
  "comparison": {
    "previous_period": [
      { "date": "2025-10-01", "value": 10200, "count": 21 },
      // ...
    ]
  },
  "summary": {
    "total": 125000,
    "average": 4464.29,
    "change": 22.5
  }
}

DEPENDENCIES: DDT-1401
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1406: Build Revenue & Bookings Charts         │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 8 points | Assignee: Frontend Dev

DESCRIPTION:
Create interactive charts using Recharts to visualize revenue 
and booking trends.

TASKS:
- [ ] Install and configure Recharts
- [ ] Create RevenueChart component
  - Line chart with revenue over time
  - Area chart variant
  - Dual-axis for revenue + bookings count
- [ ] Create BookingsChart component
  - Bar chart with booking volume
  - Grouped bar chart (confirmed vs pending)
- [ ] Add interactive tooltips
- [ ] Add chart legends
- [ ] Implement chart type selector (line/bar/area)
- [ ] Add "Compare to previous period" overlay
- [ ] Export chart as image (PNG)
- [ ] Export data as CSV
- [ ] Responsive design (stack charts on mobile)
- [ ] Add loading skeletons
- [ ] Write component tests

CHART CONFIG:
- Colors: Primary blue for revenue, Green for bookings
- Grid: Show horizontal gridlines
- Tooltip: Show date, value, % change
- Animation: Smooth transitions on data update

TECH: Recharts, date-fns, file-saver
DEPENDENCIES: DDT-1405
```

---

## **STORY 14.3: Recent Activity Feed**

**As a** Platform Administrator  
**I want to** see recent platform activity in real-time  
**So that** I can stay informed and respond quickly to important events

**Acceptance Criteria:**
- [ ] Display last 20 activities in chronological order
- [ ] Show activity type (new booking, payment received, review submitted, etc.)
- [ ] Include timestamp (relative: "2 minutes ago")
- [ ] User avatars and names
- [ ] Click on activity to view details
- [ ] Auto-refresh every minute
- [ ] Filter by activity type
- [ ] "View All" link to full activity log

### **Technical Tasks**

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1407: Build Activity Feed API                 │
└─────────────────────────────────────────────────────────┘

Priority: P1 | Estimate: 5 points | Assignee: Backend Dev

DESCRIPTION:
Create API endpoint to fetch recent platform activities from 
multiple sources (bookings, payments, reviews, users).

TASKS:
- [ ] Create activities table in database
  Schema: id, type, user_id, resource_id, resource_type,
          description, metadata (JSONB), created_at
- [ ] Implement activity logger middleware
- [ ] Log activities for:
  - New booking created
  - Booking confirmed/cancelled
  - Payment received/failed
  - Review submitted/approved
  - New user registered
  - Package created/updated
  - Vendor onboarded
- [ ] Implement GET /api/admin/activities endpoint
- [ ] Support pagination (limit: 20 per page)
- [ ] Support filtering by type, user, date range
- [ ] Include user and resource details in response
- [ ] Add database indexes on created_at, type
- [ ] Write unit tests

DEPENDENCIES: None
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1408: Build Activity Feed Component           │
└─────────────────────────────────────────────────────────┘

Priority: P1 | Estimate: 5 points | Assignee: Frontend Dev

DESCRIPTION:
Create an activity feed component that displays recent platform 
activities with auto-refresh.

TASKS:
- [ ] Create ActivityFeed component
- [ ] Create ActivityItem component
  - User avatar
  - Activity description
  - Relative timestamp ("2 minutes ago")
  - Icon based on activity type
- [ ] Implement auto-refresh (every 60 seconds)
- [ ] Add type filter dropdown
- [ ] Implement "Load More" button
- [ ] Click on activity to navigate to detail page
- [ ] Add empty state ("No recent activity")
- [ ] Add loading skeleton
- [ ] Write component tests

ACTIVITY TYPES & ICONS:
- booking_created: Calendar icon
- payment_received: Dollar icon
- review_submitted: Star icon
- user_registered: User icon
- package_created: Package icon

DEPENDENCIES: DDT-1407
```

---

## **STORY 14.4: Bookings Management - List View**

**As a** Platform Administrator  
**I want to** view and manage all bookings in a table  
**So that** I can track and update booking statuses

**Acceptance Criteria:**
- [ ] Display all bookings in a sortable, filterable table
- [ ] Show booking reference, user, package, date, status, amount
- [ ] Filter by status, date range, package, user
- [ ] Search by booking reference, user name, email
- [ ] Sort by any column
- [ ] Pagination (50 bookings per page)
- [ ] Bulk actions: Export CSV, Send email, Update status
- [ ] Click row to view booking details
- [ ] Status badges with color coding

### **Technical Tasks**

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1409: Build Bookings List API                 │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 5 points | Assignee: Backend Dev

DESCRIPTION:
Enhance existing bookings API with admin-specific features 
for listing, filtering, and searching.

TASKS:
- [ ] Enhance GET /api/admin/bookings endpoint
- [ ] Support advanced filtering:
  - Status: pending, confirmed, cancelled, completed
  - Date range: booking_date, travel_date
  - Package: package_id or package name
  - User: user_id, name, email
  - Payment status: paid, pending, failed, refunded
- [ ] Support full-text search on:
  - Booking reference
  - User name
  - User email
  - Package name
- [ ] Support sorting on all columns
- [ ] Paginate results (50 per page, configurable)
- [ ] Include related data (user, package, travelers, payment)
- [ ] Add total count for pagination
- [ ] Optimize query performance (<200ms)
- [ ] Write API documentation
- [ ] Write unit tests

RESPONSE FORMAT:
{
  "bookings": [
    {
      "id": "uuid",
      "booking_reference": "DDT-20251108-A3F9",
      "user": {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "package": {
        "id": "uuid",
        "title": "Detty VIP Experience"
      },
      "travel_date": "2025-12-20",
      "num_travelers": 2,
      "total_price": 6500,
      "status": "confirmed",
      "payment_status": "paid",
      "created_at": "2025-11-08T10:30:00Z"
    },
    // ...
  ],
  "pagination": {
    "page": 1,
    "per_page": 50,
    "total_count": 342,
    "total_pages": 7
  }
}

DEPENDENCIES: DDT-303 (Booking Schema)
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1410: Build Bookings Table Component          │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 13 points | Assignee: Frontend Dev

DESCRIPTION:
Create a comprehensive bookings table using TanStack Table 
with advanced filtering, sorting, and bulk actions.

TASKS:
- [ ] Install and configure TanStack Table v8
- [ ] Create BookingsTable component
- [ ] Define table columns:
  - Checkbox (for bulk selection)
  - Booking Reference (with copy button)
  - User (name + email)
  - Package (name)
  - Travel Date
  - Travelers (count)
  - Amount (formatted currency)
  - Status (badge)
  - Actions (view, edit, cancel)
- [ ] Implement column sorting (client + server)
- [ ] Implement column filtering
  - Date range picker for dates
  - Dropdown for status
  - Search input for reference/user
- [ ] Implement pagination controls
- [ ] Add bulk selection checkbox
- [ ] Implement bulk actions dropdown:
  - Export selected to CSV
  - Send email to customers
  - Bulk status update
- [ ] Click row to open booking details modal
- [ ] Add column visibility toggle
- [ ] Add export all to CSV button
- [ ] Mobile-responsive (horizontal scroll)
- [ ] Add loading skeleton
- [ ] Write component tests

STATUS BADGE COLORS:
- pending: Yellow
- confirmed: Green
- cancelled: Red
- completed: Blue

TECH: TanStack Table, date-fns, react-day-picker
DEPENDENCIES: DDT-1409
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1411: Implement Bulk Actions                  │
└─────────────────────────────────────────────────────────┘

Priority: P1 | Estimate: 8 points | Assignee: Full-Stack Dev

DESCRIPTION:
Implement bulk actions for selected bookings including export, 
email, and status updates.

BACKEND TASKS:
- [ ] Implement POST /api/admin/bookings/bulk-export endpoint
  - Accept array of booking IDs
  - Generate CSV with all booking details
  - Return download URL
- [ ] Implement POST /api/admin/bookings/bulk-email endpoint
  - Accept booking IDs + email template
  - Queue emails for sending
  - Return job ID for status tracking
- [ ] Implement PATCH /api/admin/bookings/bulk-status endpoint
  - Accept booking IDs + new status
  - Validate status transitions
  - Update bookings
  - Send status change emails
- [ ] Write unit tests

FRONTEND TASKS:
- [ ] Create BulkActionsMenu component
- [ ] Implement export functionality
  - Show selected count
  - Confirm action
  - Download CSV file
- [ ] Implement bulk email functionality
  - Select email template
  - Preview email
  - Confirm send
  - Show progress
- [ ] Implement bulk status update
  - Select new status
  - Confirm action
  - Show success/error messages
- [ ] Add optimistic UI updates
- [ ] Write component tests

DEPENDENCIES: DDT-1409, DDT-1410
```

---

## **STORY 14.5: Booking Details View**

**As a** Platform Administrator  
**I want to** view complete booking details and perform actions  
**So that** I can manage individual bookings effectively

**Acceptance Criteria:**
- [ ] Display all booking information in organized sections
- [ ] Show customer details with contact information
- [ ] Display traveler details for all travelers
- [ ] Show package information with pricing breakdown
- [ ] Display payment information and transaction history
- [ ] Show booking timeline/history
- [ ] Action buttons: Update status, Process refund, Send email, Download invoice
- [ ] Edit traveler details
- [ ] Add internal notes (visible only to admin)

### **Technical Tasks**

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1412: Enhance Booking Details API             │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 3 points | Assignee: Backend Dev

DESCRIPTION:
Enhance existing booking details endpoint with admin-specific 
features and complete related data.

TASKS:
- [ ] Enhance GET /api/admin/bookings/:id endpoint
- [ ] Include all related data:
  - User details (name, email, phone, profile)
  - Package details (full details, images)
  - All travelers with complete info
  - Payment transactions (all attempts, refunds)
  - Booking notes/history
  - Communication log (emails sent)
- [ ] Add admin-only fields (internal notes, flags)
- [ ] Implement permission check (admin only)
- [ ] Write unit tests

DEPENDENCIES: DDT-303
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1413: Build Booking Details Modal             │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 13 points | Assignee: Frontend Dev

DESCRIPTION:
Create a comprehensive booking details view with all information 
and management actions in a modal or side panel.

TASKS:
- [ ] Create BookingDetailsModal component
- [ ] Design tabbed interface with sections:
  
  TAB 1: OVERVIEW
  - Booking reference and status
  - Customer information
  - Package details
  - Travel date and duration
  - Pricing breakdown
  - Quick actions (update status, cancel, refund)
  
  TAB 2: TRAVELERS
  - List of all travelers
  - Traveler details (name, DOB, passport)
  - Dietary requirements
  - Edit traveler information
  
  TAB 3: PAYMENT
  - Payment status
  - Transaction history
  - Payment method details
  - Refund history
  - Process refund button
  
  TAB 4: COMMUNICATION
  - Email history sent to customer
  - Send new email
  - SMS history (if applicable)
  - Internal notes (admin only)
  
  TAB 5: TIMELINE
  - Booking creation
  - Status changes
  - Payment events
  - Modification history

- [ ] Implement action buttons:
  - Update Status (with confirmation)
  - Cancel Booking (with refund calculation)
  - Process Refund
  - Send Email
  - Download Invoice
  - Print Booking
- [ ] Add internal notes section
  - Rich text editor
  - Save notes
  - View notes history
- [ ] Implement optimistic updates
- [ ] Add loading states
- [ ] Handle errors gracefully
- [ ] Write component tests

TECH: React, Radix UI (Tabs, Dialog), TipTap (rich text editor)
DEPENDENCIES: DDT-1412
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1414: Implement Booking Status Management     │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 5 points | Assignee: Full-Stack Dev

DESCRIPTION:
Implement functionality to update booking status with validation 
and automatic notifications.

BACKEND TASKS:
- [ ] Create status transition validation logic
  Valid transitions:
  - pending → confirmed
  - pending → cancelled
  - confirmed → cancelled (with refund)
  - confirmed → completed (auto after travel date)
- [ ] Implement PATCH /api/admin/bookings/:id/status endpoint
- [ ] Send status change email to customer
- [ ] Log status change in timeline
- [ ] Handle refund trigger on cancellation
- [ ] Write unit tests

FRONTEND TASKS:
- [ ] Create StatusUpdateModal component
- [ ] Show current status
- [ ] Dropdown with allowed next statuses
- [ ] Reason/notes textarea (required for cancellation)
- [ ] Refund amount calculation (if applicable)
- [ ] Confirmation dialog
- [ ] Update UI optimistically
- [ ] Show success/error toast
- [ ] Write component tests

DEPENDENCIES: DDT-1412
```

---

## **STORY 14.6: Booking Calendar View**

**As a** Platform Administrator  
**I want to** view bookings in a calendar format  
**So that** I can visualize booking density and availability

**Acceptance Criteria:**
- [ ] Display bookings on a calendar (month/week/day view)
- [ ] Color-code bookings by status
- [ ] Click on date to see all bookings for that day
- [ ] Click on booking to view details
- [ ] Navigate between months/weeks
- [ ] Filter by package or vendor
- [ ] Show booking count on each date

### **Technical Tasks**

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1415: Build Calendar View API                 │
└─────────────────────────────────────────────────────────┘

Priority: P1 | Estimate: 5 points | Assignee: Backend Dev

DESCRIPTION:
Create API endpoint to fetch bookings grouped by travel date 
for calendar visualization.

TASKS:
- [ ] Implement GET /api/admin/bookings/calendar endpoint
- [ ] Support month, week, day range queries
- [ ] Group bookings by travel_date
- [ ] Include booking count per date
- [ ] Include status breakdown per date
- [ ] Support package/vendor filtering
- [ ] Optimize query for calendar view
- [ ] Write unit tests

RESPONSE FORMAT:
{
  "dates": [
    {
      "date": "2025-12-20",
      "bookings_count": 15,
      "status_breakdown": {
        "confirmed": 12,
        "pending": 3
      },
      "bookings": [
        {
          "id": "uuid",
          "booking_reference": "DDT-20251108-A3F9",
          "package_title": "Detty VIP",
          "num_travelers": 2,
          "status": "confirmed"
        },
        // ...
      ]
    },
    // ...
  ]
}

DEPENDENCIES: DDT-303
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1416: Build Booking Calendar Component        │
└─────────────────────────────────────────────────────────┘

Priority: P1 | Estimate: 13 points | Assignee: Frontend Dev

DESCRIPTION:
Create an interactive calendar view for visualizing bookings 
using FullCalendar or a custom implementation.

TASKS:
- [ ] Install react-big-calendar or FullCalendar
- [ ] Create BookingCalendar component
- [ ] Implement month view
  - Show booking count on each date
  - Color intensity based on booking volume
  - Click date to view day details
- [ ] Implement week view
  - Show individual bookings as blocks
  - Color-code by status
- [ ] Implement day view
  - List all bookings for the day
  - Time-based if packages have time slots
- [ ] Add view switcher (month/week/day)
- [ ] Add navigation (prev/next month/week)
- [ ] Add package/vendor filter
- [ ] Click booking to open details modal
- [ ] Add legend for color coding
- [ ] Mobile-responsive
- [ ] Write component tests

COLOR SCHEME:
- Confirmed: Green
- Pending: Yellow
- Cancelled: Red
- Completed: Blue

TECH: FullCalendar or react-big-calendar
DEPENDENCIES: DDT-1415
```

---

## **STORY 14.7: Packages Management**

**As a** Platform Administrator  
**I want to** create, edit, and manage tour packages  
**So that** I can offer diverse experiences to customers

**Acceptance Criteria:**
- [ ] View all packages in a list/grid
- [ ] Create new package with all details
- [ ] Edit existing package
- [ ] Archive/deactivate packages
- [ ] Duplicate package
- [ ] View package analytics (views, bookings, revenue)
- [ ] Manage package images
- [ ] Set pricing and availability

### **Technical Tasks**

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1417: Build Packages Management API           │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 8 points | Assignee: Backend Dev

DESCRIPTION:
Create comprehensive API endpoints for package CRUD operations 
with admin-specific features.

TASKS:
- [ ] Implement GET /api/admin/packages endpoint (list all)
- [ ] Implement POST /api/admin/packages endpoint (create)
- [ ] Implement GET /api/admin/packages/:id endpoint (details)
- [ ] Implement PATCH /api/admin/packages/:id endpoint (update)
- [ ] Implement DELETE /api/admin/packages/:id endpoint (soft delete)
- [ ] Implement POST /api/admin/packages/:id/duplicate endpoint
- [ ] Implement GET /api/admin/packages/:id/analytics endpoint
- [ ] Include draft/published status
- [ ] Support bulk operations (publish, archive)
- [ ] Add validation for all fields
- [ ] Write unit tests

PACKAGE ANALYTICS:
- Total views (all time + last 30 days)
- Total bookings
- Total revenue
- Conversion rate (bookings / views)
- Average rating
- Wishlist count

DEPENDENCIES: DDT-201
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1418: Build Package Form (Create/Edit)        │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 21 points | Assignee: Frontend Dev

DESCRIPTION:
Create comprehensive package creation/editing form with all 
fields, image upload, and itinerary builder.

TASKS:
- [ ] Create PackageForm component (multi-step)
  
  STEP 1: BASIC INFO
  - Title
  - Slug (auto-generated, editable)
  - Short description
  - Full description (rich text editor)
  - Category (dropdown)
  - Duration (days)
  - Status (draft/published)
  
  STEP 2: PRICING & CAPACITY
  - Base price
  - Min/Max capacity
  - Group discounts
  - Early bird pricing
  - Seasonal pricing
  
  STEP 3: INCLUSIONS & EXCLUSIONS
  - Add/remove inclusions
  - Add/remove exclusions
  - Drag to reorder
  
  STEP 4: ITINERARY
  - Day-by-day itinerary builder
  - Add/edit/remove days
  - Rich text editor for each day
  - Add activities per day
  
  STEP 5: MEDIA
  - Upload multiple images
  - Set primary image
  - Reorder images
  - Image optimization
  - Video URL (optional)
  
  STEP 6: VENDOR & SETTINGS
  - Select vendor
  - Availability settings
  - Cancellation policy
  - Meeting point
  - Tags/keywords

- [ ] Implement form validation (Zod schema)
- [ ] Add auto-save draft functionality
- [ ] Implement image upload with preview
- [ ] Add preview mode
- [ ] Implement save and publish
- [ ] Add loading states
- [ ] Handle errors
- [ ] Write component tests

TECH: React Hook Form, Zod, TipTap (rich text), react-dropzone
DEPENDENCIES: DDT-1417
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1419: Build Package Analytics View            │
└─────────────────────────────────────────────────────────┘

Priority: P1 | Estimate: 8 points | Assignee: Frontend Dev

DESCRIPTION:
Create analytics dashboard for individual packages showing 
performance metrics and trends.

TASKS:
- [ ] Create PackageAnalytics component
- [ ] Display key metrics:
  - Total views
  - Total bookings
  - Total revenue
  - Conversion rate
  - Average rating
  - Wishlist count
- [ ] Views over time chart
- [ ] Bookings over time chart
- [ ] Revenue breakdown
- [ ] Geographic distribution of bookings
- [ ] Review sentiment analysis
- [ ] Comparison with other packages
- [ ] Export data to CSV
- [ ] Write component tests

DEPENDENCIES: DDT-1417
```

---

## **STORY 14.8: Vendors Management**

**As a** Platform Administrator  
**I want to** manage vendor partnerships  
**So that** I can scale the marketplace with quality suppliers

**Acceptance Criteria:**
- [ ] View all vendors with key metrics
- [ ] Onboard new vendors (approve/reject)
- [ ] View vendor profile and performance
- [ ] Manage vendor commissions
- [ ] Process vendor payouts
- [ ] Communicate with vendors
- [ ] Deactivate vendor accounts

### **Technical Tasks**

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1420: Build Vendors Management API            │
└─────────────────────────────────────────────────────────┘

Priority: P1 | Estimate: 13 points | Assignee: Backend Dev

DESCRIPTION:
Create comprehensive vendor management system with onboarding, 
performance tracking, and payout management.

TASKS:
- [ ] Create vendors table (see DB schema in DDT-1101)
- [ ] Implement GET /api/admin/vendors endpoint (list)
- [ ] Implement POST /api/admin/vendors endpoint (create/invite)
- [ ] Implement GET /api/admin/vendors/:id endpoint (details)
- [ ] Implement PATCH /api/admin/vendors/:id endpoint (update)
- [ ] Implement GET /api/admin/vendors/:id/performance endpoint
- [ ] Implement GET /api/admin/vendors/:id/payouts endpoint
- [ ] Implement POST /api/admin/vendors/:id/payout endpoint
- [ ] Send vendor invitation email
- [ ] Calculate vendor metrics:
  - Total packages
  - Total bookings
  - Total revenue
  - Average rating
  - Commission earned
  - Pending payout amount
- [ ] Write unit tests

VENDOR STATUS:
- pending: Application pending review
- active: Active vendor
- suspended: Temporarily suspended
- inactive: Deactivated

DEPENDENCIES: None
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1421: Build Vendors List & Details            │
└─────────────────────────────────────────────────────────┘

Priority: P1 | Estimate: 13 points | Assignee: Frontend Dev

DESCRIPTION:
Create vendor management interface with list, details, and 
onboarding workflow.

TASKS:
- [ ] Create VendorsList component (table)
  - Vendor name
  - Contact person
  - Email
  - Total packages
  - Total bookings
  - Revenue generated
  - Status
  - Actions (view, edit, payout)
- [ ] Create VendorDetails component
  - Company information
  - Contact details
  - Bank account details
  - Performance metrics
  - Package list
  - Booking history
  - Payout history
  - Reviews/ratings
- [ ] Create VendorOnboardingForm
  - Vendor application review
  - Approve/reject with notes
  - Set commission rate
  - Activate account
- [ ] Create VendorPayoutModal
  - Calculate payout amount
  - Select payout period
  - Review transactions
  - Process payout
  - Generate payout receipt
- [ ] Write component tests

DEPENDENCIES: DDT-1420
```

---

## **STORY 14.9: Financial Management & Reports**

**As a** Finance Manager  
**I want to** track all financial transactions and generate reports  
**So that** I can ensure accurate accounting and reconciliation

**Acceptance Criteria:**
- [ ] View revenue dashboard with key financial metrics
- [ ] View all transactions (payments, refunds, payouts)
- [ ] Generate financial reports (daily, weekly, monthly)
- [ ] Export reports to CSV/PDF
- [ ] Reconcile transactions
- [ ] View pending payouts to vendors
- [ ] Process refunds

### **Technical Tasks**

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1422: Build Financial Management API          │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 13 points | Assignee: Backend Dev

DESCRIPTION:
Create comprehensive financial management system with reporting 
and reconciliation features.

TASKS:
- [ ] Implement GET /api/admin/finance/dashboard endpoint
  Metrics:
  - Total revenue (all time, MTD, YTD)
  - Gross revenue vs Net revenue (after commissions)
  - Pending payouts
  - Refunds processed
  - Revenue by package
  - Revenue by vendor
  
- [ ] Implement GET /api/admin/finance/transactions endpoint
  - All payment transactions
  - Filter by type (payment, refund, payout)
  - Filter by status, date range
  - Include related booking/vendor info
  
- [ ] Implement GET /api/admin/finance/reports endpoint
  - Generate financial reports
  - Support multiple report types:
    - Revenue report
    - Vendor commission report
    - Refunds report
    - Tax report
  - Support date ranges
  - Return CSV or PDF
  
- [ ] Implement POST /api/admin/finance/refunds endpoint
  - Process refund
  - Calculate refund amount
  - Update booking status
  - Send refund confirmation
  
- [ ] Implement reconciliation helper endpoints
- [ ] Write unit tests

DEPENDENCIES: DDT-304, DDT-401
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1423: Build Financial Dashboard               │
└─────────────────────────────────────────────────────────┘

Priority: P0 | Estimate: 13 points | Assignee: Frontend Dev

DESCRIPTION:
Create financial dashboard with revenue metrics, charts, and 
transaction management.

TASKS:
- [ ] Create FinanceDashboard component
  - Revenue metrics cards
  - Revenue over time chart
  - Revenue by package (pie chart)
  - Revenue by vendor (bar chart)
  - Pending payouts summary
  
- [ ] Create TransactionsList component
  - All transactions table
  - Columns: Date, Type, Reference, Amount, Status
  - Filters: Type, Status, Date range
  - Search: Reference, Customer name
  - Export to CSV
  
- [ ] Create RefundModal component
  - Select booking
  - Calculate refund amount
  - Reason for refund
  - Process refund
  - Show confirmation
  
- [ ] Create ReportsGenerator component
  - Select report type
  - Select date range
  - Preview report
  - Export as CSV/PDF
  - Schedule recurring reports
  
- [ ] Write component tests

DEPENDENCIES: DDT-1422
```

---

## **STORY 14.10: Reviews & Content Moderation**

**As a** Platform Administrator  
**I want to** moderate user-generated content  
**So that** I can maintain quality and prevent inappropriate content

**Acceptance Criteria:**
- [ ] View pending reviews waiting for approval
- [ ] View approved/rejected reviews
- [ ] Approve or reject reviews with reasons
- [ ] Flag inappropriate reviews
- [ ] Edit review text (with audit log)
- [ ] Respond to reviews on behalf of vendor
- [ ] View review analytics

### **Technical Tasks**

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1424: Build Review Moderation API             │
└─────────────────────────────────────────────────────────┘

Priority: P1 | Estimate: 8 points | Assignee: Backend Dev

DESCRIPTION:
Create review moderation system with approval workflow and 
content filtering.

TASKS:
- [ ] Enhance reviews table with moderation fields
  - status: pending, approved, rejected, flagged
  - moderation_notes
  - moderated_by (admin user)
  - moderated_at
  
- [ ] Implement GET /api/admin/reviews endpoint
  - List all reviews
  - Filter by status
  - Filter by rating
  - Search by reviewer, package
  
- [ ] Implement PATCH /api/admin/reviews/:id/moderate endpoint
  - Approve review
  - Reject review (with reason)
  - Flag review
  - Edit review text
  - Log all moderation actions
  
- [ ] Implement profanity filter
  - Check review text for profanity
  - Auto-flag suspicious reviews
  
- [ ] Send email notifications:
  - To reviewer when approved/rejected
  - To vendor when new review
  
- [ ] Write unit tests

DEPENDENCIES: DDT-601
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1425: Build Review Moderation Interface       │
└─────────────────────────────────────────────────────────┘

Priority: P1 | Estimate: 8 points | Assignee: Frontend Dev

DESCRIPTION:
Create review moderation interface with approval/rejection 
workflow and bulk operations.

TASKS:
- [ ] Create ReviewModerationList component
  - Display reviews in table
  - Columns: Date, Reviewer, Package, Rating, Status
  - Filter by status, rating
  - Search functionality
  - Bulk select
  
- [ ] Create ReviewModerationCard component
  - Show review details
  - Show reviewer info
  - Show package info
  - Show review text and images
  - Action buttons: Approve, Reject, Flag, Edit
  
- [ ] Create ReviewModerationModal
  - View full review
  - Edit review text
  - Add moderation notes
  - Approve/Reject/Flag actions
  - Send notification to reviewer
  
- [ ] Implement bulk moderation
  - Approve multiple reviews
  - Reject multiple reviews
  
- [ ] Add profanity highlighting
  - Highlight potentially inappropriate words
  - Show AI-generated sentiment score
  
- [ ] Write component tests

DEPENDENCIES: DDT-1424
```

---

## **STORY 14.11: Users Management**

**As a** Platform Administrator  
**I want to** manage user accounts and permissions  
**So that** I can provide support and maintain security

**Acceptance Criteria:**
- [ ] View all registered users
- [ ] Search users by name, email
- [ ] View user profile and activity
- [ ] View user's booking history
- [ ] Suspend/unsuspend user accounts
- [ ] Reset user passwords
- [ ] Manage admin users and roles
- [ ] View user analytics

### **Technical Tasks**

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1426: Build User Management API               │
└─────────────────────────────────────────────────────────┘

Priority: P1 | Estimate: 8 points | Assignee: Backend Dev

DESCRIPTION:
Create user management system with account administration 
and role-based access control.

TASKS:
- [ ] Enhance users table with admin fields
  - status: active, suspended, deactivated
  - suspended_reason
  - suspended_until
  
- [ ] Implement GET /api/admin/users endpoint
  - List all users
  - Filter by status, role
  - Search by name, email
  - Include user metrics
  
- [ ] Implement GET /api/admin/users/:id endpoint
  - User details
  - User activity (bookings, reviews, logins)
  - User statistics
  
- [ ] Implement PATCH /api/admin/users/:id endpoint
  - Update user info
  - Suspend/unsuspend account
  - Change role
  
- [ ] Implement POST /api/admin/users/:id/reset-password endpoint
  - Generate password reset link
  - Send email to user
  
- [ ] Implement role-based access control (RBAC)
  Roles:
  - super_admin: Full access
  - admin: Most access
  - support: Limited access (bookings, users)
  - finance: Financial access only
  
- [ ] Write unit tests

DEPENDENCIES: DDT-101
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1427: Build User Management Interface         │
└─────────────────────────────────────────────────────────┘

Priority: P1 | Estimate: 13 points | Assignee: Frontend Dev

DESCRIPTION:
Create user management interface with search, filtering, and 
account administration features.

TASKS:
- [ ] Create UsersList component
  - Users table
  - Columns: Name, Email, Join Date, Bookings, Status
  - Search by name/email
  - Filter by status
  - Click to view details
  
- [ ] Create UserDetails component
  - User profile information
  - User statistics:
    - Total bookings
    - Total spent
    - Average rating given
    - Last login
  - Booking history
  - Review history
  - Activity timeline
  - Action buttons:
    - Edit profile
    - Suspend account
    - Reset password
    - View as user (impersonation)
  
- [ ] Create SuspendUserModal
  - Reason for suspension
  - Duration (permanent or temporary)
  - Send notification
  
- [ ] Create AdminUsersManager
  - List admin users
  - Add new admin
  - Edit admin roles
  - Manage permissions
  
- [ ] Write component tests

DEPENDENCIES: DDT-1426
```

---

## **STORY 14.12: System Settings & Configuration**

**As a** Super Admin  
**I want to** configure platform settings  
**So that** I can customize the platform behavior

**Acceptance Criteria:**
- [ ] Configure platform general settings
- [ ] Configure payment provider settings
- [ ] Configure email/SMS settings
- [ ] Manage integrations (Google Analytics, etc.)
- [ ] Configure security settings
- [ ] View system logs
- [ ] Manage API keys

### **Technical Tasks**

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1428: Build System Settings API               │
└─────────────────────────────────────────────────────────┘

Priority: P1 | Estimate: 13 points | Assignee: Backend Dev

DESCRIPTION:
Create system configuration management with settings storage 
and validation.

TASKS:
- [ ] Create settings table
  Schema: id, category, key, value (JSONB), 
          description, created_at, updated_at
  
- [ ] Implement GET /api/admin/settings endpoint
  - Retrieve all settings by category
  - Categories:
    - general (site name, logo, timezone, currency)
    - payment (Stripe/Paystack keys, commission rate)
    - email (SendGrid, email templates)
    - sms (Twilio settings)
    - integrations (GA, Facebook Pixel, etc.)
    - security (2FA, password policy)
  
- [ ] Implement PATCH /api/admin/settings endpoint
  - Update settings
  - Validate settings before save
  - Encrypt sensitive values (API keys)
  
- [ ] Implement GET /api/admin/logs endpoint
  - System logs
  - Error logs
  - Audit logs
  - Filter by type, date
  
- [ ] Add settings cache layer
- [ ] Write unit tests

DEPENDENCIES: None
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1429: Build Settings Interface                │
└─────────────────────────────────────────────────────────┘

Priority: P1 | Estimate: 13 points | Assignee: Frontend Dev

DESCRIPTION:
Create settings management interface with form validation 
and secure credential handling.

TASKS:
- [ ] Create SettingsPage with tabs:
  
  GENERAL SETTINGS
  - Platform name
  - Logo upload
  - Favicon upload
  - Timezone selector
  - Default currency
  - Contact email
  - Support phone
  
  PAYMENT SETTINGS
  - Stripe API keys
  - Paystack API keys
  - Default payment provider
  - Commission rate (%)
  - Enable/disable payment methods
  
  EMAIL SETTINGS
  - SendGrid API key
  - From email address
  - From name
  - Email templates editor
  - Test email functionality
  
  SMS SETTINGS
  - Twilio credentials
  - SMS sender ID
  - Enable/disable SMS
  
  INTEGRATIONS
  - Google Analytics ID
  - Facebook Pixel ID
  - Google Tag Manager
  - Enable/disable integrations
  
  SECURITY SETTINGS
  - Enforce 2FA for admins
  - Password complexity rules
  - Session timeout
  - IP whitelist for admin access
  - API rate limits
  
  SYSTEM LOGS
  - View logs table
  - Filter logs
  - Export logs
  - Clear old logs

- [ ] Add form validation
- [ ] Mask sensitive fields (API keys)
- [ ] Add "Test Connection" buttons
- [ ] Add confirmation for critical changes
- [ ] Write component tests

DEPENDENCIES: DDT-1428
```

---

## **STORY 14.13: Analytics & Custom Reports**

**As a** Platform Administrator  
**I want to** generate custom reports and export data  
**So that** I can analyze business performance

**Acceptance Criteria:**
- [ ] Create custom reports with drag-and-drop builder
- [ ] Select metrics and dimensions
- [ ] Apply filters and date ranges
- [ ] Visualize data with charts
- [ ] Export reports to CSV, Excel, PDF
- [ ] Save report templates
- [ ] Schedule automated reports via email

### **Technical Tasks**

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1430: Build Custom Reports API                │
└─────────────────────────────────────────────────────────┘

Priority: P2 | Estimate: 21 points | Assignee: Backend Dev

DESCRIPTION:
Create flexible reporting system with custom queries and 
data export.

TASKS:
- [ ] Design report configuration schema
- [ ] Implement POST /api/admin/reports/generate endpoint
  - Accept report configuration:
    - Metrics (revenue, bookings, users, etc.)
    - Dimensions (date, package, vendor, etc.)
    - Filters
    - Date range
    - Grouping
  - Execute dynamic SQL queries
  - Return aggregated data
  
- [ ] Implement GET /api/admin/reports/export endpoint
  - Support CSV export
  - Support Excel export
  - Support PDF export
  
- [ ] Implement saved reports
  - Save report templates
  - Load saved reports
  
- [ ] Implement scheduled reports
  - Schedule report generation
  - Email report to recipients
  - Use cron job or scheduler
  
- [ ] Add query validation and security
- [ ] Optimize query performance
- [ ] Write unit tests

DEPENDENCIES: All data tables
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1431: Build Report Builder Interface          │
└─────────────────────────────────────────────────────────┘

Priority: P2 | Estimate: 21 points | Assignee: Frontend Dev

DESCRIPTION:
Create intuitive report builder with drag-and-drop interface 
for custom analytics.

TASKS:
- [ ] Create ReportBuilder component
  - Drag-and-drop interface
  - Select metrics (multi-select)
  - Select dimensions (multi-select)
  - Add filters
  - Select date range
  - Choose visualization (table, line, bar, pie)
  
- [ ] Create ReportPreview component
  - Display report results
  - Show data table
  - Show chart
  - Toggle between views
  
- [ ] Create ExportMenu
  - Export as CSV
  - Export as Excel
  - Export as PDF
  - Copy to clipboard
  
- [ ] Create SavedReports component
  - List saved reports
  - Load saved report
  - Delete saved report
  
- [ ] Create ScheduledReports component
  - Schedule report
  - Select frequency (daily, weekly, monthly)
  - Select recipients
  - Enable/disable schedule
  
- [ ] Write component tests

TECH: react-beautiful-dnd (drag-and-drop), xlsx (Excel export)
DEPENDENCIES: DDT-1430
```

---

## **STORY 14.14: Support Ticket System**

**As a** Support Agent  
**I want to** manage customer support tickets  
**So that** I can resolve issues efficiently

**Acceptance Criteria:**
- [ ] View all support tickets
- [ ] Create new ticket on behalf of customer
- [ ] Assign tickets to agents
- [ ] Update ticket status
- [ ] Add notes and responses
- [ ] View ticket history
- [ ] Set priority levels
- [ ] Track response times and SLAs

### **Technical Tasks**

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1432: Build Support Ticket System API         │
└─────────────────────────────────────────────────────────┘

Priority: P1 | Estimate: 13 points | Assignee: Backend Dev

DESCRIPTION:
Create support ticket management system with assignment 
and SLA tracking.

TASKS:
- [ ] Create support_tickets table
  Schema: id, user_id, booking_id, subject, description,
          priority, status, assigned_to, created_at, updated_at
  
- [ ] Create ticket_messages table
  Schema: id, ticket_id, user_id, message, is_internal,
          created_at
  
- [ ] Implement GET /api/admin/support/tickets endpoint
  - List all tickets
  - Filter by status, priority, assigned agent
  - Search by ticket number, subject
  
- [ ] Implement POST /api/admin/support/tickets endpoint
  - Create ticket
  
- [ ] Implement GET /api/admin/support/tickets/:id endpoint
  - Ticket details
  - All messages
  - Related booking
  
- [ ] Implement POST /api/admin/support/tickets/:id/messages endpoint
  - Add message/note
  
- [ ] Implement PATCH /api/admin/support/tickets/:id endpoint
  - Update status
  - Assign agent
  - Update priority
  
- [ ] Calculate SLA metrics
  - First response time
  - Resolution time
  
- [ ] Send email notifications
  - New ticket to assigned agent
  - Ticket updates to customer
  
- [ ] Write unit tests

TICKET STATUS: open, in_progress, waiting_customer, 
               waiting_vendor, resolved, closed
PRIORITY: low, medium, high, urgent

DEPENDENCIES: DDT-101, DDT-303
```

```
┌─────────────────────────────────────────────────────────┐
│ TICKET DDT-1433: Build Support Ticket Interface          │
└─────────────────────────────────────────────────────────┘

Priority: P1 | Estimate: 13 points | Assignee: Frontend Dev

DESCRIPTION:
Create support ticket management interface with inbox-style 
layout and conversation view.

TASKS:
- [ ] Create TicketsList component
  - Inbox-style layout
  - Ticket rows with: ID, Subject, Customer, Status, Priority
  - Filter by status, priority
  - Assign to me / Unassigned
  
- [ ] Create TicketDetails component
  - Two-panel layout (ticket list + detail)
  - Show ticket information
  - Show customer information
  - Show related booking
  - Conversation thread
  - Reply box (internal note or customer reply)
  
- [ ] Create TicketSidebar
  - Status dropdown
  - Priority dropdown
  - Assign agent dropdown
  - SLA timer
  - Related bookings
  - Customer history
  
- [ ] Create CreateTicketModal
  - Subject
  - Description
  - Customer selector
  - Related booking selector
  - Priority
  - Assign to
  
- [ ] Add real-time updates (new tickets, messages)
- [ ] Add keyboard shortcuts
- [ ] Write component tests

DEPENDENCIES: DDT-1432
```

---

## 🎨 UI/UX DESIGN GUIDELINES

### **Design System**

**Color Palette:**
```
Primary: #3B82F6 (Blue)
Success: #10B981 (Green)
Warning: #F59E0B (Yellow)
Danger: #EF4444 (Red)
Neutral: #6B7280 (Gray)

Backgrounds:
- Light: #F9FAFB
- Dark: #1F2937
```

**Typography:**
```
Font Family: Inter, -apple-system, system-ui
Headings: 600-700 weight
Body: 400 weight
Small: 0.875rem
Base: 1rem
Large: 1.125rem
```

**Spacing:**
```
Base: 4px
Use multiples of 4: 8px, 12px, 16px, 24px, 32px, 48px
```

### **Component Patterns**

**Metric Cards:**
- Large number (value)
- Label below
- Trend indicator (↑ ↓) with color
- Small text showing change %

**Data Tables:**
- Fixed header
- Sortable columns
- Row hover effect
- Pagination at bottom
- Bulk selection checkbox
- Actions column

**Charts:**
- Consistent color scheme
- Grid lines for readability
- Tooltips on hover
- Legend placement
- Responsive sizing

**Modals:**
- Centered on screen
- Overlay background
- Close button (X) top-right
- Action buttons bottom-right
- Max-width: 600px for forms

**Status Badges:**
```
pending: Yellow background, dark text
confirmed: Green background, white text
cancelled: Red background, white text
completed: Blue background, white text
```

---

## 📱 MOBILE RESPONSIVENESS

All dashboard components must be mobile-responsive:

**Breakpoints:**
```
Mobile: < 640px
Tablet: 640px - 1024px
Desktop: > 1024px
```

**Mobile Adaptations:**
- Stack metric cards vertically
- Horizontal scroll for tables
- Hamburger menu for navigation
- Bottom navigation for key actions
- Simplified charts
- Full-screen modals

---

## 🔒 SECURITY CONSIDERATIONS

**Authentication:**
- JWT-based authentication
- Role-based access control (RBAC)
- 2FA for admin users (optional but recommended)
- Session timeout after 30 minutes of inactivity

**Authorization:**
- Middleware to check admin role on all endpoints
- Granular permissions based on role
- Audit logging for sensitive operations

**Data Security:**
- Encrypt API keys in database
- Mask sensitive fields in UI
- HTTPS only
- CORS configuration
- Rate limiting on all endpoints

**Audit Logging:**
Log all admin actions:
- User created/modified
- Booking status changed
- Payment refunded
- Settings updated
- Review moderated

---

## 📈 PERFORMANCE TARGETS

**Page Load:**
- Initial load: < 2 seconds
- Navigation: < 500ms
- Data fetch: < 1 second

**Optimization Strategies:**
- Code splitting
- Lazy loading of routes
- Virtual scrolling for large tables
- Debounced search inputs
- Cached API responses
- Optimistic UI updates
- Pagination for all lists

---

## 🧪 TESTING REQUIREMENTS

**Unit Tests:**
- 80%+ code coverage
- Test all business logic
- Test form validation
- Test data transformations

**Integration Tests:**
- Test API endpoints
- Test authentication flows
- Test permission checks

**E2E Tests:**
- Test critical user flows:
  - Login
  - Create booking
  - Process refund
  - Approve review
  - Generate report

**Accessibility:**
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- Proper ARIA labels
- Color contrast ratios

---

## 📚 DOCUMENTATION REQUIREMENTS

**API Documentation:**
- OpenAPI/Swagger spec
- All endpoints documented
- Request/response examples
- Error codes explained

**Component Documentation:**
- Storybook for all components
- Props documentation
- Usage examples
- Accessibility notes

**Admin User Guide:**
- Step-by-step guides
- Screenshots
- Video tutorials
- FAQ section

---

## 🚀 DEPLOYMENT & ROLLOUT

### **Phase 1: MVP (Weeks 1-4)**
**Priority:** P0 stories only
- Overview Dashboard (14.1, 14.2, 14.3)
- Bookings Management (14.4, 14.5)
- Basic Settings (14.12)

### **Phase 2: Core Features (Weeks 5-8)**
**Priority:** P0 + P1
- Booking Calendar (14.6)
- Packages Management (14.7)
- Vendors Management (14.8)
- Financial Management (14.9)
- Users Management (14.11)

### **Phase 3: Advanced Features (Weeks 9-12)**
**Priority:** P1 + P2
- Reviews Moderation (14.10)
- Analytics & Reports (14.13)
- Support Tickets (14.14)
- System Settings (14.12 complete)

### **Phase 4: Optimization (Ongoing)**
- Real-time updates (WebSocket)
- Advanced analytics
- Custom integrations
- AI-powered insights

---

## 📊 SUCCESS METRICS & KPIs

Track these metrics to measure dashboard effectiveness:

**Operational Efficiency:**
- Average time to process booking: < 2 minutes
- Support ticket response time: < 1 hour
- Financial report generation time: < 30 seconds
- Daily active admin users: Track growth

**System Performance:**
- Dashboard load time: < 2 seconds
- API response time: < 500ms (p95)
- Uptime: > 99.9%
- Error rate: < 0.1%

**User Satisfaction:**
- Admin user NPS score: > 50
- Feature usage rate: > 70% of features used
- Time saved vs manual processes: > 80%

---

## 🎓 TRAINING & SUPPORT

**Admin Onboarding:**
- 1-hour training session
- Video tutorials for each module
- Written documentation
- Sandbox environment for practice

**Ongoing Support:**
- In-app help tooltips
- Contextual documentation
- Support chat for admins
- Monthly office hours

---

## 🔄 DEPENDENCIES & BLOCKERS

**External Dependencies:**
- Stripe/Paystack API integration (DDT-401)
- Email service setup (DDT-901)
- Analytics tracking setup (DDT-1001)

**Internal Dependencies:**
- User authentication system (DDT-101)
- Booking system (DDT-303)
- Payment system (DDT-401)
- Review system (DDT-601)

**Potential Blockers:**
- Complex permission system implementation
- Real-time updates complexity
- Large data set performance
- Multi-timezone support

---

## 📝 ACCEPTANCE CHECKLIST

Before marking this epic as complete:

**Functionality:**
- [ ] All user stories implemented
- [ ] All acceptance criteria met
- [ ] All technical tasks completed
- [ ] All bugs fixed

**Quality:**
- [ ] Unit tests passing (80%+ coverage)
- [ ] Integration tests passing
- [ ] E2E tests passing
- [ ] Performance targets met
- [ ] Security audit completed
- [ ] Accessibility audit completed

**Documentation:**
- [ ] API documentation complete
- [ ] Component documentation complete
- [ ] Admin user guide complete
- [ ] Video tutorials recorded

**Deployment:**
- [ ] Staging environment tested
- [ ] Production deployment plan ready
- [ ] Rollback plan documented
- [ ] Monitoring alerts configured

**Training:**
- [ ] Admin team trained
- [ ] Support team trained
- [ ] Documentation distributed

---

## 🎯 FINAL NOTES

This comprehensive admin dashboard will be the backbone of OneDettyDecember operations. It transforms a manual, error-prone process into a streamlined, data-driven management system.

**Key Success Factors:**
1. **User-Centric Design:** Built for actual admin workflows
2. **Performance:** Fast, responsive, reliable
3. **Scalability:** Can handle 10x growth
4. **Security:** Enterprise-grade protection
5. **Insights:** Data-driven decision making

**Next Steps:**
1. Review and approve this epic
2. Break down into sprints
3. Assign tickets to developers
4. Set up development environment
5. Begin Sprint 1

---

**Epic Owner:** Product Manager  
**Last Updated:** November 8, 2025  
**Status:** Ready for Development  

---

**Total Estimated Effort:** 144 story points (~12 weeks with 2-person team)

---
