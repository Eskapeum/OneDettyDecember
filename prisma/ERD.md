# OneDettyDecember Database ERD

> Entity Relationship Diagram and Database Architecture

## 📊 Database Overview

**Database Type:** PostgreSQL 15+
**ORM:** Prisma 6
**Hosting:** Supabase
**Schema:** Public

---

## 🏗️ Core Entities

### 1. Users & Authentication

```
┌──────────────────────────────────────┐
│             User                     │
├──────────────────────────────────────┤
│ id              String (cuid) PK     │
│ email           String UNIQUE        │
│ firstName       String               │
│ lastName        String               │
│ phoneNumber     String?              │
│ role            UserRole             │
│ status          UserStatus           │
│ emailVerified   Boolean              │
│ createdAt       DateTime             │
│ updatedAt       DateTime             │
└──────────────────────────────────────┘
         │
         │ 1:1
         ▼
┌──────────────────────────────────────┐
│          UserProfile                 │
├──────────────────────────────────────┤
│ id              String (cuid) PK     │
│ userId          String FK (User.id)  │
│ bio             String?              │
│ avatar          String?              │
│ country         String?              │
│ city            String?              │
│ dateOfBirth     DateTime?            │
│ preferences     Json?                │
│ createdAt       DateTime             │
│ updatedAt       DateTime             │
└──────────────────────────────────────┘
```

**Enums:**
- `UserRole`: TRAVELER | VENDOR | ADMIN
- `UserStatus`: ACTIVE | SUSPENDED | DELETED

---

### 2. Vendor Management

```
┌──────────────────────────────────────┐
│              Vendor                  │
├──────────────────────────────────────┤
│ id              String (cuid) PK     │
│ userId          String FK (User.id)  │
│ businessName    String               │
│ businessType    VendorType           │
│ status          VendorStatus         │
│ description     String?              │
│ logo            String?              │
│ verifiedAt      DateTime?            │
│ createdAt       DateTime             │
│ updatedAt       DateTime             │
└──────────────────────────────────────┘
```

**Enums:**
- `VendorType`: EVENT_PROMOTER | ACCOMMODATION_HOST | EXPERIENCE_HOST | CAR_RENTAL | MARKETPLACE_SELLER
- `VendorStatus`: PENDING | APPROVED | REJECTED | SUSPENDED

---

### 3. Packages (Marketplace Offerings)

```
┌──────────────────────────────────────┐
│             Package                  │
├──────────────────────────────────────┤
│ id              String (cuid) PK     │
│ vendorId        String FK (Vendor)   │
│ type            PackageType          │
│ status          PackageStatus        │
│ title           String               │
│ description     String               │
│ price           Decimal(10,2)        │
│ currency        String               │
│ location        String               │
│ city            String (Lagos/Accra) │
│ images          String[]             │
│ capacity        Int?                 │
│ availableSlots  Int?                 │
│ startDate       DateTime?            │
│ endDate         DateTime?            │
│ metadata        Json?                │
│ createdAt       DateTime             │
│ updatedAt       DateTime             │
└──────────────────────────────────────┘
```

**Enums:**
- `PackageType`: EVENT | STAY | EXPERIENCE | CAR_RENTAL | MARKETPLACE_PRODUCT
- `PackageStatus`: DRAFT | PUBLISHED | SOLD_OUT | CANCELLED

---

### 4. Bookings & Transactions

```
┌──────────────────────────────────────┐
│             Booking                  │
├──────────────────────────────────────┤
│ id              String (cuid) PK     │
│ userId          String FK (User)     │
│ packageId       String FK (Package)  │
│ status          BookingStatus        │
│ quantity        Int                  │
│ totalPrice      Decimal(10,2)        │
│ currency        String               │
│ bookingDate     DateTime             │
│ metadata        Json?                │
│ createdAt       DateTime             │
│ updatedAt       DateTime             │
└──────────────────────────────────────┘
         │
         │ 1:1
         ▼
┌──────────────────────────────────────┐
│             Payment                  │
├──────────────────────────────────────┤
│ id                  String PK        │
│ bookingId           String FK        │
│ amount              Decimal(10,2)    │
│ currency            String           │
│ status              PaymentStatus    │
│ provider            PaymentProvider  │
│ providerPaymentId   String?          │
│ metadata            Json?            │
│ createdAt           DateTime         │
│ updatedAt           DateTime         │
└──────────────────────────────────────┘
```

**Enums:**
- `BookingStatus`: PENDING | CONFIRMED | CANCELLED | COMPLETED | REFUNDED
- `PaymentStatus`: PENDING | PROCESSING | COMPLETED | FAILED | REFUNDED
- `PaymentProvider`: STRIPE | PAYSTACK

---

### 5. Reviews & Ratings

```
┌──────────────────────────────────────┐
│              Review                  │
├──────────────────────────────────────┤
│ id              String (cuid) PK     │
│ userId          String FK (User)     │
│ packageId       String FK (Package)  │
│ bookingId       String FK (Booking)  │
│ rating          Int (1-5)            │
│ comment         String?              │
│ images          String[]             │
│ createdAt       DateTime             │
│ updatedAt       DateTime             │
└──────────────────────────────────────┘
```

---

### 6. Wishlist & Waitlist

```
┌──────────────────────────────────────┐
│          WishlistItem                │
├──────────────────────────────────────┤
│ id              String (cuid) PK     │
│ userId          String FK (User)     │
│ packageId       String FK (Package)  │
│ createdAt       DateTime             │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│         WaitlistEntry                │
├──────────────────────────────────────┤
│ id              String (cuid) PK     │
│ email           String UNIQUE        │
│ firstName       String?              │
│ lastName        String?              │
│ source          String?              │
│ metadata        Json?                │
│ createdAt       DateTime             │
└──────────────────────────────────────┘
```

---

## 🔗 Relationships

### User-Centric Relationships
```
User (1) ──→ (1) UserProfile
User (1) ──→ (0..1) Vendor
User (1) ──→ (N) Booking
User (1) ──→ (N) Review
User (N) ──→ (M) Package via WishlistItem
```

### Vendor-Package Relationships
```
Vendor (1) ──→ (N) Package
```

### Package-Booking Relationships
```
Package (1) ──→ (N) Booking
Package (1) ──→ (N) Review
Package (N) ──→ (M) User via WishlistItem
```

### Booking-Payment-Review Chain
```
Booking (1) ──→ (1) Payment
Booking (1) ──→ (0..1) Review
```

---

## 📇 Indexes

### Performance Optimization

| Table | Index Fields | Purpose |
|-------|-------------|---------|
| User | `email` | Fast user lookup by email (login) |
| User | `role` | Filter by user type |
| Vendor | `status` | Filter approved/pending vendors |
| Vendor | `businessType` | Filter by vendor category |
| Package | `type` | Filter by package category |
| Package | `status` | Show only published packages |
| Package | `city` | Location-based filtering |
| Package | `startDate` | Date range queries |
| Booking | `userId` | Get user's bookings |
| Booking | `packageId` | Get package bookings |
| Booking | `status` | Filter active bookings |
| Payment | `status` | Payment status tracking |
| Payment | `providerPaymentId` | Webhook reconciliation |
| Review | `userId` | User's reviews |
| Review | `packageId` | Package reviews |
| Review | `rating` | Sort by rating |
| WishlistItem | `userId` | User's wishlist |
| WaitlistEntry | `email` | Email uniqueness |
| WaitlistEntry | `createdAt` | Signup analytics |

---

## 🔐 Data Integrity Rules

### Cascade Deletes
- User → UserProfile (CASCADE)
- User → Vendor (CASCADE)
- Vendor → Package (CASCADE)
- User → WishlistItem (CASCADE)
- Package → WishlistItem (CASCADE)

### Constraints
- `User.email` - UNIQUE, NOT NULL
- `UserProfile.userId` - UNIQUE (1:1 relationship)
- `Vendor.userId` - UNIQUE (1:1 relationship)
- `WishlistItem (userId, packageId)` - UNIQUE (no duplicate wishlists)
- `WaitlistEntry.email` - UNIQUE
- `Review.bookingId` - UNIQUE (one review per booking)
- `Payment.bookingId` - UNIQUE (one payment per booking)

---

## 🎯 Query Patterns

### Common Queries

#### 1. Get User with Profile
```prisma
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' },
  include: { profile: true, vendor: true }
})
```

#### 2. List Published Packages in Lagos
```prisma
const packages = await prisma.package.findMany({
  where: {
    status: 'PUBLISHED',
    city: 'Lagos',
    type: 'EVENT'
  },
  include: {
    vendor: {
      include: { user: true }
    },
    reviews: true
  },
  orderBy: { startDate: 'asc' }
})
```

#### 3. Get User Bookings with Payments
```prisma
const bookings = await prisma.booking.findMany({
  where: { userId: user.id },
  include: {
    package: true,
    payment: true,
    review: true
  },
  orderBy: { createdAt: 'desc' }
})
```

#### 4. Vendor Dashboard Stats
```prisma
const stats = await prisma.$transaction([
  prisma.package.count({ where: { vendorId: vendor.id } }),
  prisma.booking.count({
    where: {
      package: { vendorId: vendor.id },
      status: 'CONFIRMED'
    }
  }),
  prisma.booking.aggregate({
    where: {
      package: { vendorId: vendor.id },
      status: 'COMPLETED'
    },
    _sum: { totalPrice: true }
  })
])
```

---

## 🔄 Migration Strategy

### Initial Setup
1. Run Prisma migrations: `npx prisma migrate dev --name init`
2. Generate Prisma Client: `npx prisma generate`
3. Seed database (optional): `npx prisma db seed`

### Future Migrations
- Always use `npx prisma migrate dev --name [migration_name]`
- Test migrations in development before production
- Back up production database before major schema changes

---

## 📊 Analytics & Reporting

### Metrics to Track
- Total users by role
- Active vendors vs. pending
- Packages by type and city
- Booking conversion rate
- Revenue by vertical (events, stays, etc.)
- Average review ratings
- Waitlist growth rate

### Sample Analytics Query
```prisma
const analytics = {
  totalUsers: await prisma.user.count(),
  activeVendors: await prisma.vendor.count({
    where: { status: 'APPROVED' }
  }),
  totalBookings: await prisma.booking.count({
    where: { status: { in: ['CONFIRMED', 'COMPLETED'] } }
  }),
  revenue: await prisma.payment.aggregate({
    where: { status: 'COMPLETED' },
    _sum: { amount: true }
  }),
  avgRating: await prisma.review.aggregate({
    _avg: { rating: true }
  })
}
```

---

**Last Updated:** Sprint 0 - November 17, 2025
**Database Version:** 1.0.0
**Status:** ✅ Ready for Development
