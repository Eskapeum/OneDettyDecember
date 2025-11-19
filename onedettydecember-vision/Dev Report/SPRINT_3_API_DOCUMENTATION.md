# Sprint 3: Booking Flow API Documentation

**Developer:** Nesiah (Backend Lead)
**Date:** November 18, 2025
**Sprint:** 3 of 13
**Status:** ✅ Implementation Complete

---

## 🎯 Overview

Sprint 3 implements the complete booking experience for OneDettyDecember, including package detail viewing, booking creation, booking management, and real-time availability checking.

**New Endpoints:**
1. `GET /api/packages/[id]` - Package detail page
2. `POST /api/bookings` - Create new booking
3. `GET /api/bookings` - User booking history
4. `GET /api/bookings/[id]` - Single booking details
5. `PATCH /api/bookings/[id]` - Update booking (cancel, modify)
6. `POST /api/packages/[id]/availability` - Check availability

---

## 📡 API Endpoints

### 1. Package Detail API

#### **GET /api/packages/[id]**

Get detailed package information with vendor details, reviews, and related packages.

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | ✅ Yes | Package ID (CUID) |

**Example Request:**

```bash
curl "http://localhost:3000/api/packages/clx123abc..."
```

**Response (200 OK):**

```json
{
  "package": {
    "id": "clx123...",
    "type": "EVENT",
    "status": "PUBLISHED",
    "title": "New Year's Eve Beach Party",
    "description": "Epic beach party with DJ, drinks, and fireworks...",
    "price": 150.00,
    "currency": "USD",
    "location": "Elegushi Beach, Lekki",
    "city": "Lagos",
    "images": [
      "https://images.example.com/party1.jpg",
      "https://images.example.com/party2.jpg"
    ],
    "capacity": 500,
    "availableSlots": 350,
    "availabilityPercentage": 70,
    "startDate": "2025-12-31T20:00:00Z",
    "endDate": "2026-01-01T04:00:00Z",
    "metadata": {
      "amenities": ["DJ", "Open Bar", "Fireworks"],
      "dresscode": "Smart Casual"
    },
    "createdAt": "2025-11-15T10:00:00Z",
    "updatedAt": "2025-11-18T14:30:00Z",
    "vendor": {
      "id": "clx456...",
      "businessName": "Lagos Events Co",
      "businessType": "EVENT_PROMOTER",
      "description": "Premium event planning...",
      "logo": "https://...",
      "verifiedAt": "2025-10-01T00:00:00Z",
      "createdAt": "2025-09-15T00:00:00Z",
      "user": {
        "firstName": "John",
        "lastName": "Doe"
      }
    },
    "stats": {
      "avgRating": 4.8,
      "reviewCount": 145,
      "totalBookings": 450,
      "confirmedBookings": 380,
      "ratingDistribution": {
        "5": 120,
        "4": 20,
        "3": 3,
        "2": 1,
        "1": 1
      }
    }
  },
  "reviews": [
    {
      "id": "clx789...",
      "rating": 5,
      "comment": "Amazing party! Great vibes and organization.",
      "createdAt": "2025-01-05T10:00:00Z",
      "user": {
        "id": "clxabc...",
        "name": "Jane Smith",
        "avatar": "https://..."
      }
    }
  ],
  "relatedPackages": [
    {
      "id": "clxdef...",
      "type": "EVENT",
      "title": "Rooftop New Year Party",
      "price": 200.00,
      "currency": "USD",
      "location": "VI, Lagos",
      "city": "Lagos",
      "images": ["https://..."],
      "startDate": "2025-12-31T21:00:00Z",
      "endDate": "2026-01-01T05:00:00Z",
      "vendor": {
        "businessName": "Sky High Events",
        "verifiedAt": "2025-08-01T00:00:00Z"
      },
      "avgRating": 4.6,
      "reviewCount": 89
    }
  ]
}
```

**Error Responses:**

```json
// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Package not found"
  }
}
```

---

### 2. Booking Creation API

#### **POST /api/bookings**

Create a new booking for a package.

**Authentication:** Required

**Request Body:**

```json
{
  "packageId": "clx123...",
  "bookingDate": "2025-12-31T20:00:00Z",
  "quantity": 2,
  "specialRequests": "Vegetarian meal options please"
}
```

**Request Schema:**

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `packageId` | string | ✅ Yes | Valid CUID |
| `bookingDate` | ISO 8601 | ✅ Yes | Future date, within package availability |
| `quantity` | number | ✅ Yes | 1-50 |
| `specialRequests` | string | ❌ No | Max 1000 characters |
| `metadata` | object | ❌ No | Additional data |

**Example Request:**

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=..." \
  -d '{
    "packageId": "clx123...",
    "bookingDate": "2025-12-31T20:00:00Z",
    "quantity": 2,
    "specialRequests": "Vegetarian meal options"
  }'
```

**Response (201 Created):**

```json
{
  "message": "Booking created successfully",
  "booking": {
    "id": "clxbooking123...",
    "userId": "clxuser456...",
    "packageId": "clx123...",
    "status": "PENDING",
    "quantity": 2,
    "totalPrice": 300.00,
    "currency": "USD",
    "bookingDate": "2025-12-31T20:00:00Z",
    "metadata": {
      "specialRequests": "Vegetarian meal options",
      "bookedAt": "2025-11-18T15:00:00Z"
    },
    "createdAt": "2025-11-18T15:00:00Z",
    "updatedAt": "2025-11-18T15:00:00Z",
    "package": {
      "id": "clx123...",
      "type": "EVENT",
      "title": "New Year's Eve Beach Party",
      "price": 150.00,
      "currency": "USD",
      "location": "Elegushi Beach, Lekki",
      "city": "Lagos",
      "images": ["https://..."],
      "startDate": "2025-12-31T20:00:00Z",
      "endDate": "2026-01-01T04:00:00Z",
      "vendor": {
        "businessName": "Lagos Events Co",
        "logo": "https://..."
      }
    }
  }
}
```

**Validation Rules:**
- ✅ Package must exist and be PUBLISHED
- ✅ Booking date must be in the future
- ✅ Booking date must be within package date range (if applicable)
- ✅ Sufficient slots must be available
- ✅ Users cannot book their own vendor's packages
- ✅ Available slots decremented automatically

**Error Responses:**

```json
// 404 - Package not found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Package not found"
  }
}

// 400 - Validation error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Booking date must be in the future"
  }
}

// 409 - Sold out
{
  "error": {
    "code": "CONFLICT",
    "message": "Only 5 slot(s) available. Requested: 10"
  }
}

// 401 - Unauthorized
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

---

### 3. Booking History API

#### **GET /api/bookings**

Get user's booking history with filters and pagination.

**Authentication:** Required

**Query Parameters:**

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `status` | enum | ❌ No | Filter by status | `"CONFIRMED"` |
| `packageType` | enum | ❌ No | Filter by package type | `"EVENT"` |
| `startDate` | ISO 8601 | ❌ No | Filter bookings from date | `"2025-12-01T00:00:00Z"` |
| `endDate` | ISO 8601 | ❌ No | Filter bookings until date | `"2026-01-31T23:59:59Z"` |
| `page` | number | ❌ No | Page number (default: 1) | `"2"` |
| `limit` | number | ❌ No | Items per page (default: 20) | `"10"` |
| `sort` | enum | ❌ No | Sort order | `"date_desc"` |

**Status Enum:** `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`, `REFUNDED`

**Sort Options:** `date_asc`, `date_desc`, `created_asc`, `created_desc`, `price_asc`, `price_desc`

**Example Request:**

```bash
curl "http://localhost:3000/api/bookings?status=CONFIRMED&sort=date_desc&limit=10" \
  -H "Cookie: sb-access-token=..."
```

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "clxbooking123...",
      "userId": "clxuser456...",
      "packageId": "clx123...",
      "status": "CONFIRMED",
      "quantity": 2,
      "totalPrice": 300.00,
      "currency": "USD",
      "bookingDate": "2025-12-31T20:00:00Z",
      "metadata": {
        "specialRequests": "Vegetarian meal options"
      },
      "createdAt": "2025-11-18T15:00:00Z",
      "updatedAt": "2025-11-20T10:00:00Z",
      "package": {
        "id": "clx123...",
        "type": "EVENT",
        "title": "New Year's Eve Beach Party",
        "price": 150.00,
        "currency": "USD",
        "location": "Elegushi Beach, Lekki",
        "city": "Lagos",
        "images": ["https://..."],
        "startDate": "2025-12-31T20:00:00Z",
        "endDate": "2026-01-01T04:00:00Z",
        "status": "PUBLISHED",
        "vendor": {
          "businessName": "Lagos Events Co",
          "logo": "https://...",
          "verifiedAt": "2025-10-01T00:00:00Z"
        }
      },
      "payment": {
        "id": "clxpayment789...",
        "status": "COMPLETED",
        "amount": 300.00,
        "paymentMethod": "card"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

---

### 4. Single Booking Detail API

#### **GET /api/bookings/[id]**

Get detailed information for a specific booking.

**Authentication:** Required

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | ✅ Yes | Booking ID (CUID) |

**Example Request:**

```bash
curl "http://localhost:3000/api/bookings/clxbooking123..." \
  -H "Cookie: sb-access-token=..."
```

**Response (200 OK):**

```json
{
  "booking": {
    "id": "clxbooking123...",
    "userId": "clxuser456...",
    "packageId": "clx123...",
    "status": "CONFIRMED",
    "quantity": 2,
    "totalPrice": 300.00,
    "currency": "USD",
    "bookingDate": "2025-12-31T20:00:00Z",
    "metadata": {
      "specialRequests": "Vegetarian meal options",
      "bookedAt": "2025-11-18T15:00:00Z",
      "confirmedAt": "2025-11-20T10:00:00Z"
    },
    "createdAt": "2025-11-18T15:00:00Z",
    "updatedAt": "2025-11-20T10:00:00Z",
    "package": {
      "id": "clx123...",
      "type": "EVENT",
      "title": "New Year's Eve Beach Party",
      "description": "Epic beach party...",
      "price": 150.00,
      "currency": "USD",
      "location": "Elegushi Beach, Lekki",
      "city": "Lagos",
      "images": ["https://..."],
      "capacity": 500,
      "availableSlots": 348,
      "startDate": "2025-12-31T20:00:00Z",
      "endDate": "2026-01-01T04:00:00Z",
      "status": "PUBLISHED",
      "vendor": {
        "id": "clxvendor789...",
        "businessName": "Lagos Events Co",
        "businessType": "EVENT_PROMOTER",
        "description": "Premium event planning...",
        "logo": "https://...",
        "verifiedAt": "2025-10-01T00:00:00Z",
        "user": {
          "email": "contact@lagosevents.com",
          "phoneNumber": "+234..."
        }
      }
    },
    "payment": {
      "id": "clxpayment789...",
      "status": "COMPLETED",
      "amount": 300.00,
      "currency": "USD",
      "paymentMethod": "card",
      "transactionId": "txn_abc123...",
      "createdAt": "2025-11-20T10:05:00Z"
    },
    "review": null
  }
}
```

**Permission Rules:**
- ✅ Booking owner can view
- ✅ Package vendor can view
- ✅ Admins can view
- ❌ Other users cannot view

---

### 5. Booking Update API

#### **PATCH /api/bookings/[id]**

Update booking status or special requests.

**Authentication:** Required

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | ✅ Yes | Booking ID (CUID) |

**Request Body:**

```json
{
  "status": "CANCELLED",
  "specialRequests": "Updated dietary requirements"
}
```

**Request Schema:**

| Field | Type | Required | Allowed Values |
|-------|------|----------|----------------|
| `status` | enum | ❌ No | `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`, `REFUNDED` |
| `specialRequests` | string | ❌ No | Max 1000 characters |
| `metadata` | object | ❌ No | Additional data |

**Example Request:**

```bash
curl -X PATCH http://localhost:3000/api/bookings/clxbooking123... \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=..." \
  -d '{
    "status": "CANCELLED"
  }'
```

**Response (200 OK):**

```json
{
  "message": "Booking updated successfully",
  "booking": {
    "id": "clxbooking123...",
    "userId": "clxuser456...",
    "packageId": "clx123...",
    "status": "CANCELLED",
    "quantity": 2,
    "totalPrice": 300.00,
    "currency": "USD",
    "bookingDate": "2025-12-31T20:00:00Z",
    "metadata": {
      "specialRequests": "Vegetarian meal options",
      "updatedAt": "2025-11-22T09:00:00Z",
      "cancelledAt": "2025-11-22T09:00:00Z"
    },
    "createdAt": "2025-11-18T15:00:00Z",
    "updatedAt": "2025-11-22T09:00:00Z",
    "package": {
      "id": "clx123...",
      "type": "EVENT",
      "title": "New Year's Eve Beach Party",
      "price": 150.00,
      "location": "Elegushi Beach, Lekki",
      "city": "Lagos",
      "images": ["https://..."],
      "vendor": {
        "businessName": "Lagos Events Co"
      }
    }
  }
}
```

**Status Transition Rules:**

| User Type | Allowed Transitions |
|-----------|---------------------|
| **Customer** | Can only cancel `PENDING` or `CONFIRMED` bookings |
| **Vendor** | Can `CONFIRM`, `COMPLETE`, or `CANCEL` bookings |
| **Admin** | Can change to any status |

**Automatic Actions:**
- ✅ Cancelling booking restores available slots
- ✅ Package status changed from `SOLD_OUT` to `PUBLISHED` if slots available
- ⏳ Email notification sent (Neziah's task)

**Error Responses:**

```json
// 403 - Forbidden
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Users can only cancel their bookings"
  }
}

// 400 - Invalid transition
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Cannot update completed or refunded bookings"
  }
}
```

---

### 6. Availability Check API

#### **POST /api/packages/[id]/availability**

Check real-time availability for a package on a specific date.

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | ✅ Yes | Package ID (CUID) |

**Request Body:**

```json
{
  "date": "2025-12-31T20:00:00Z",
  "quantity": 5
}
```

**Request Schema:**

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `date` | ISO 8601 | ✅ Yes | Must be future date |
| `quantity` | number | ✅ Yes | 1-50 |

**Example Request:**

```bash
curl -X POST http://localhost:3000/api/packages/clx123.../availability \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-12-31T20:00:00Z",
    "quantity": 5
  }'
```

**Response (200 OK) - Available:**

```json
{
  "available": true,
  "reason": null,
  "package": {
    "id": "clx123...",
    "title": "New Year's Eve Beach Party",
    "type": "EVENT",
    "capacity": 500,
    "availableSlots": 350,
    "bookedSlots": 150,
    "requestedQuantity": 5
  }
}
```

**Response (200 OK) - Not Available:**

```json
{
  "available": false,
  "reason": "Only 2 slot(s) available",
  "package": {
    "id": "clx123...",
    "title": "New Year's Eve Beach Party",
    "type": "EVENT",
    "capacity": 500,
    "availableSlots": 2,
    "bookedSlots": 498,
    "requestedQuantity": 5
  }
}
```

**Response (200 OK) - Date Outside Range:**

```json
{
  "available": false,
  "reason": "Requested date is outside package availability window",
  "package": {
    "id": "clx123...",
    "title": "New Year's Eve Beach Party",
    "availableDates": {
      "start": "2025-12-31T00:00:00Z",
      "end": "2026-01-01T23:59:59Z"
    }
  }
}
```

**Availability Logic:**

1. **Events/Experiences (with capacity):**
   - Check `availableSlots >= requestedQuantity`
   - Real-time slot count

2. **Stays/Car Rentals/Products (no capacity):**
   - Check for existing bookings on same date
   - Prevent double booking

3. **Common Checks:**
   - Package must be `PUBLISHED`
   - Date must be in future
   - Date must be within package date range

---

## 📋 Booking Status Lifecycle

```
PENDING
  ↓
  ├─→ CONFIRMED (by vendor/payment)
  │     ↓
  │     ├─→ COMPLETED (after event date)
  │     │
  │     └─→ CANCELLED (by user/vendor)
  │           ↓
  │           └─→ REFUNDED (if payment processed)
  │
  └─→ CANCELLED (by user before confirmation)
```

**Status Definitions:**
- `PENDING` - Booking created, awaiting confirmation/payment
- `CONFIRMED` - Booking confirmed by vendor or payment completed
- `CANCELLED` - Booking cancelled by user or vendor
- `COMPLETED` - Event/service completed successfully
- `REFUNDED` - Cancelled booking with payment refunded

---

## 🔐 Authentication & Authorization

All booking endpoints require authentication except package detail view.

**Permission Matrix:**

| Endpoint | Customer | Vendor | Admin |
|----------|----------|--------|-------|
| View package details | ✅ | ✅ | ✅ |
| Create booking | ✅ | ✅* | ✅ |
| View own bookings | ✅ | ✅ | ✅ |
| View all bookings | ❌ | ✅** | ✅ |
| Cancel own booking | ✅ | ❌ | ✅ |
| Confirm booking | ❌ | ✅ | ✅ |
| Complete booking | ❌ | ✅ | ✅ |
| Update any booking | ❌ | ❌ | ✅ |

\* Cannot book own packages
\** Can only view bookings for their packages

---

## ⚡ Performance & Optimization

### Database Indexes

Existing indexes from previous sprints plus booking-specific queries optimized by default Prisma relations.

### Transaction Safety

All booking operations use database transactions to ensure:
- ✅ Atomic slot decrements
- ✅ Consistent availability updates
- ✅ No race conditions
- ✅ Automatic rollback on errors

### Real-time Availability

Availability checks query current database state, not cached values, ensuring accuracy.

---

## 🧪 Testing

See `SPRINT_3_BOOKING_API_TESTING.md` for comprehensive testing guide with 40+ test cases.

---

## 📊 Error Handling

All endpoints use standardized error responses:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { /* Optional additional context */ }
  }
}
```

**Common Error Codes:**
- `400` - `VALIDATION_ERROR` - Invalid request data
- `401` - `UNAUTHORIZED` - Authentication required
- `403` - `FORBIDDEN` - Insufficient permissions
- `404` - `NOT_FOUND` - Resource not found
- `409` - `CONFLICT` - Resource conflict (sold out, double booking)
- `500` - `SERVER_ERROR` - Internal server error

---

## 🎯 Success Criteria

✅ **All Sprint 3 goals achieved:**
- Users can view detailed package information
- Users can create bookings with validation
- Real-time availability checking works
- Users can view and manage their bookings
- Vendors can confirm/cancel bookings
- Automatic slot management
- Transaction-safe booking creation

---

**Status:** ✅ **SPRINT 3 BACKEND COMPLETE**
**Developer:** Nesiah (Backend Lead)
**Story Points:** 9/9 completed (100%)
**Ready for:** Frontend integration (Neriah), Email system (Neziah), Testing (Lolu)

---

## 🔗 Related Documentation

- [Sprint 3 Testing Guide](./SPRINT_3_BOOKING_API_TESTING.md)
- [Sprint 2 API Documentation](./SPRINT_2_API_DOCUMENTATION.md)
- [Sprint 1 Auth Documentation](./SPRINT_1_AUTH_API_TESTING.md)
- [API README](./src/app/api/README.md)
- [Database Schema](./prisma/schema.prisma)
