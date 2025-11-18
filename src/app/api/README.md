# OneDettyDecember API Routes

> RESTful API documentation for the OneDettyDecember platform

## 🌐 API Overview

**Base URL:** `https://onedettydecember.com/api` (Production)
**Dev URL:** `http://localhost:3000/api`
**Framework:** Next.js 14 App Router API Routes
**Authentication:** Supabase Auth (JWT)
**Rate Limiting:** 100 requests/min per IP

---

## 🔐 Authentication

### Auth Routes

#### POST /api/auth/signup
Create a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+234xxxxxxxxxx" // optional
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "clxxx...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "TRAVELER"
  },
  "session": {
    "access_token": "eyJhbG...",
    "refresh_token": "xxx..."
  }
}
```

---

#### POST /api/auth/login
Authenticate existing user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "clxxx...",
    "email": "user@example.com",
    "firstName": "John",
    "role": "TRAVELER"
  },
  "session": {
    "access_token": "eyJhbG...",
    "refresh_token": "xxx..."
  }
}
```

---

#### POST /api/auth/logout
Logout current user.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:** `200 OK`
```json
{
  "message": "Logged out successfully"
}
```

---

#### GET /api/auth/session
Get current session info.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "clxxx...",
    "email": "user@example.com",
    "role": "TRAVELER",
    "profile": {
      "avatar": "https://...",
      "bio": "...",
      "city": "Lagos"
    }
  }
}
```

---

## 📦 Packages

### Package Routes

#### GET /api/packages
List packages with filters.

**Query Parameters:**
```
?type=EVENT                      # Filter by type
&city=Lagos                      # Filter by city
&minPrice=50                     # Price range
&maxPrice=500
&startDate=2025-12-01            # Date range
&endDate=2025-12-31
&search=concert                  # Search term
&page=1                          # Pagination
&limit=20
```

**Response:** `200 OK`
```json
{
  "packages": [
    {
      "id": "clxxx...",
      "title": "Afronation Concert",
      "type": "EVENT",
      "price": 150.00,
      "currency": "USD",
      "city": "Lagos",
      "location": "Eko Atlantic",
      "images": ["https://..."],
      "startDate": "2025-12-28T19:00:00Z",
      "vendor": {
        "businessName": "EventHub Nigeria",
        "logo": "https://..."
      },
      "avgRating": 4.8,
      "reviewCount": 245
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

#### GET /api/packages/[id]
Get single package details.

**Response:** `200 OK`
```json
{
  "id": "clxxx...",
  "title": "Afronation Concert",
  "description": "Experience the biggest Afrobeats festival...",
  "type": "EVENT",
  "status": "PUBLISHED",
  "price": 150.00,
  "currency": "USD",
  "city": "Lagos",
  "location": "Eko Atlantic",
  "images": ["https://...", "https://..."],
  "capacity": 5000,
  "availableSlots": 1250,
  "startDate": "2025-12-28T19:00:00Z",
  "endDate": "2025-12-29T02:00:00Z",
  "metadata": {
    "lineup": ["Burna Boy", "Wizkid", "Davido"],
    "amenities": ["VIP Lounge", "Food & Drinks", "Parking"]
  },
  "vendor": {
    "id": "clxxx...",
    "businessName": "EventHub Nigeria",
    "businessType": "EVENT_PROMOTER",
    "logo": "https://...",
    "verifiedAt": "2025-01-15T10:00:00Z"
  },
  "reviews": [
    {
      "id": "clxxx...",
      "rating": 5,
      "comment": "Amazing experience!",
      "user": {
        "firstName": "Jane",
        "avatar": "https://..."
      },
      "createdAt": "2025-01-20T15:30:00Z"
    }
  ]
}
```

---

#### POST /api/packages
Create a new package (Vendor only).

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request:**
```json
{
  "type": "EVENT",
  "title": "Lagos Jazz Festival",
  "description": "A night of smooth jazz...",
  "price": 75.00,
  "currency": "USD",
  "location": "Terra Kulture",
  "city": "Lagos",
  "capacity": 200,
  "startDate": "2025-12-15T19:00:00Z",
  "endDate": "2025-12-15T23:00:00Z",
  "images": ["https://...", "https://..."],
  "metadata": {
    "lineup": ["Kunle Ayo", "Adekunle Gold"],
    "dressCode": "Smart Casual"
  }
}
```

**Response:** `201 Created`
```json
{
  "package": {
    "id": "clxxx...",
    "title": "Lagos Jazz Festival",
    "status": "DRAFT",
    "createdAt": "2025-11-17T20:00:00Z"
  }
}
```

---

#### PATCH /api/packages/[id]
Update package (Vendor only - own packages).

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request:**
```json
{
  "price": 85.00,
  "status": "PUBLISHED",
  "availableSlots": 180
}
```

**Response:** `200 OK`

---

#### DELETE /api/packages/[id]
Delete package (Vendor only - own packages).

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:** `204 No Content`

---

## 🎫 Bookings

### Booking Routes

#### GET /api/bookings
Get user's bookings.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
```
?status=CONFIRMED
&page=1
&limit=10
```

**Response:** `200 OK`
```json
{
  "bookings": [
    {
      "id": "clxxx...",
      "status": "CONFIRMED",
      "quantity": 2,
      "totalPrice": 300.00,
      "currency": "USD",
      "bookingDate": "2025-12-28T19:00:00Z",
      "package": {
        "title": "Afronation Concert",
        "type": "EVENT",
        "images": ["https://..."]
      },
      "payment": {
        "status": "COMPLETED",
        "provider": "STRIPE"
      },
      "createdAt": "2025-11-17T10:00:00Z"
    }
  ]
}
```

---

#### POST /api/bookings
Create a new booking.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request:**
```json
{
  "packageId": "clxxx...",
  "quantity": 2,
  "bookingDate": "2025-12-28T19:00:00Z",
  "metadata": {
    "attendees": [
      { "name": "John Doe", "email": "john@example.com" },
      { "name": "Jane Doe", "email": "jane@example.com" }
    ]
  }
}
```

**Response:** `201 Created`
```json
{
  "booking": {
    "id": "clxxx...",
    "status": "PENDING",
    "totalPrice": 300.00,
    "currency": "USD"
  },
  "paymentIntent": {
    "clientSecret": "pi_xxx_secret_xxx",
    "amount": 300.00
  }
}
```

---

#### GET /api/bookings/[id]
Get single booking details.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:** `200 OK`

---

#### PATCH /api/bookings/[id]/cancel
Cancel a booking.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:** `200 OK`
```json
{
  "booking": {
    "id": "clxxx...",
    "status": "CANCELLED"
  },
  "refund": {
    "amount": 300.00,
    "status": "PENDING"
  }
}
```

---

## 💳 Payments

### Payment Routes

#### POST /api/payments/create-intent
Create payment intent (Stripe/Paystack).

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request:**
```json
{
  "bookingId": "clxxx...",
  "provider": "STRIPE", // or "PAYSTACK"
  "returnUrl": "https://onedettydecember.com/bookings/confirmation"
}
```

**Response:** `200 OK`
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "publishableKey": "pk_test_xxx"
}
```

---

#### POST /api/payments/webhook
Payment provider webhook (Stripe/Paystack).

**Note:** This is called by payment providers, not clients.

**Headers:**
```
Stripe-Signature: xxx  // For Stripe
X-Paystack-Signature: xxx  // For Paystack
```

**Response:** `200 OK`

---

#### GET /api/payments/[id]
Get payment status.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:** `200 OK`
```json
{
  "id": "clxxx...",
  "status": "COMPLETED",
  "amount": 300.00,
  "currency": "USD",
  "provider": "STRIPE",
  "providerPaymentId": "pi_xxx",
  "createdAt": "2025-11-17T10:05:00Z"
}
```

---

## 📧 Waitlist

### Waitlist Routes

#### POST /api/waitlist
Add email to waitlist.

**Request:**
```json
{
  "email": "newuser@example.com",
  "firstName": "Sarah",
  "lastName": "Johnson",
  "source": "landing_page"
}
```

**Response:** `201 Created`
```json
{
  "message": "Successfully joined the waitlist!",
  "entry": {
    "id": "clxxx...",
    "email": "newuser@example.com"
  }
}
```

---

#### GET /api/waitlist/count
Get total waitlist signups (public).

**Response:** `200 OK`
```json
{
  "count": 1250
}
```

---

## ⭐ Reviews

### Review Routes

#### POST /api/reviews
Create a review (after booking completed).

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request:**
```json
{
  "bookingId": "clxxx...",
  "packageId": "clxxx...",
  "rating": 5,
  "comment": "Absolutely amazing experience!",
  "images": ["https://...", "https://..."]
}
```

**Response:** `201 Created`

---

#### GET /api/packages/[id]/reviews
Get reviews for a package.

**Query Parameters:**
```
?page=1
&limit=10
&rating=5  // Filter by rating
```

**Response:** `200 OK`

---

## ❤️ Wishlist

### Wishlist Routes

#### GET /api/wishlist
Get user's wishlist.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:** `200 OK`
```json
{
  "items": [
    {
      "id": "clxxx...",
      "package": {
        "id": "clxxx...",
        "title": "Afronation Concert",
        "price": 150.00,
        "images": ["https://..."]
      },
      "createdAt": "2025-11-15T12:00:00Z"
    }
  ]
}
```

---

#### POST /api/wishlist
Add package to wishlist.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request:**
```json
{
  "packageId": "clxxx..."
}
```

**Response:** `201 Created`

---

#### DELETE /api/wishlist/[packageId]
Remove from wishlist.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:** `204 No Content`

---

## 🚨 Error Responses

### Standard Error Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "value": "invalid-email"
    }
  }
}
```

### Error Codes

| Status | Code | Description |
|--------|------|-------------|
| 400 | VALIDATION_ERROR | Invalid request data |
| 401 | UNAUTHORIZED | Missing or invalid token |
| 403 | FORBIDDEN | Insufficient permissions |
| 404 | NOT_FOUND | Resource not found |
| 409 | CONFLICT | Duplicate resource |
| 429 | RATE_LIMIT | Too many requests |
| 500 | INTERNAL_ERROR | Server error |

---

## 🔒 Authentication & Authorization

### Protected Routes
All routes except the following require authentication:
- `GET /api/packages`
- `GET /api/packages/[id]`
- `POST /api/waitlist`
- `GET /api/waitlist/count`
- `POST /api/auth/signup`
- `POST /api/auth/login`

### Role-Based Access
- **TRAVELER**: Can book, review, wishlist
- **VENDOR**: Can create/manage packages + all TRAVELER permissions
- **ADMIN**: Full access to all endpoints

---

## 📈 Rate Limiting

| Route Pattern | Rate Limit |
|--------------|------------|
| `/api/auth/*` | 10 req/min |
| `/api/payments/*` | 20 req/min |
| `/api/packages` (POST/PATCH/DELETE) | 30 req/min |
| All other routes | 100 req/min |

---

## 🧪 Testing

### Using cURL

```bash
# Signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","firstName":"Test","lastName":"User"}'

# Get packages
curl http://localhost:3000/api/packages?city=Lagos&type=EVENT

# Create booking (authenticated)
curl -X POST http://localhost:3000/api/bookings \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '{"packageId":"clxxx...","quantity":2}'
```

---

**API Version:** v1.0.0
**Last Updated:** Sprint 0 - November 17, 2025
**Status:** ✅ Specification Complete, Implementation Pending
