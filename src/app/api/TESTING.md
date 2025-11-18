# API Testing Guide
**Sprint 0 - Day 1**
**Author:** Nesiah (Dev 3 - Backend)
**Date:** November 18, 2025

## Overview
This document provides testing instructions for the 3 API routes built during Sprint 0 Day 1.

---

## Prerequisites

1. **Ensure database is running:**
   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Run migrations (if not already run)
   npx prisma migrate dev
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Base URL:**
   ```
   http://localhost:3000/api
   ```

---

## 1. Waitlist API

### POST /api/waitlist
Add email to waitlist.

**Request:**
```bash
curl -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "source": "landing_page"
  }'
```

**Expected Response (201):**
```json
{
  "message": "Successfully joined the waitlist!",
  "entry": {
    "id": "clx...",
    "email": "test@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "source": "landing_page",
    "createdAt": "2025-11-18T..."
  },
  "position": 1
}
```

**Test duplicate email (409):**
```bash
# Run the same request again - should return conflict error
curl -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Expected Error Response:**
```json
{
  "error": {
    "code": "CONFLICT",
    "message": "Email already registered on waitlist"
  }
}
```

### GET /api/waitlist/count
Get total waitlist signups.

**Request:**
```bash
curl http://localhost:3000/api/waitlist/count
```

**Expected Response (200):**
```json
{
  "count": 1
}
```

---

## 2. User Profile API

### GET /api/users/profile
Get current user's profile.

**Request:**
```bash
curl http://localhost:3000/api/users/profile \
  -H "x-user-id: test-user-123"
```

**Expected Response (200):**
```json
{
  "user": {
    "id": "test-user-123",
    "email": "test@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "TRAVELER",
    "profile": {
      "id": "clx...",
      "bio": null,
      "avatar": null,
      "city": null,
      "country": null
    },
    "vendor": null
  }
}
```

**Test without auth header (401):**
```bash
curl http://localhost:3000/api/users/profile
```

**Expected Error Response:**
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

### PATCH /api/users/profile
Update current user's profile.

**Request:**
```bash
curl -X PATCH http://localhost:3000/api/users/profile \
  -H "Content-Type: application/json" \
  -H "x-user-id: test-user-123" \
  -d '{
    "bio": "Travel enthusiast exploring Detty December!",
    "city": "Lagos",
    "country": "Nigeria",
    "preferences": {
      "theme": "events",
      "notifications": true
    }
  }'
```

**Expected Response (200):**
```json
{
  "message": "Profile updated successfully",
  "profile": {
    "id": "clx...",
    "bio": "Travel enthusiast exploring Detty December!",
    "avatar": null,
    "city": "Lagos",
    "country": "Nigeria",
    "preferences": {
      "theme": "events",
      "notifications": true
    },
    "updatedAt": "2025-11-18T..."
  }
}
```

---

## 3. Packages Listing API

### GET /api/packages
List packages with filters and pagination.

**Basic Request:**
```bash
curl "http://localhost:3000/api/packages"
```

**Expected Response (200):**
```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

**With Filters:**
```bash
curl "http://localhost:3000/api/packages?type=EVENT&city=Lagos&minPrice=50&maxPrice=500&page=1&limit=10&sort=price_asc"
```

**Test Search:**
```bash
curl "http://localhost:3000/api/packages?search=concert&city=Lagos"
```

**Test Date Range:**
```bash
curl "http://localhost:3000/api/packages?startDate=2025-12-01T00:00:00Z&endDate=2025-12-31T23:59:59Z"
```

**All Query Parameters:**
```
?type=EVENT                         # Filter by type
&city=Lagos                         # Filter by city
&status=PUBLISHED                   # Filter by status
&minPrice=50                        # Minimum price
&maxPrice=500                       # Maximum price
&startDate=2025-12-01T00:00:00Z    # Start date (ISO 8601)
&endDate=2025-12-31T23:59:59Z      # End date (ISO 8601)
&search=concert                     # Search term
&page=1                             # Page number
&limit=20                           # Items per page
&sort=price_asc                     # Sort order
```

**Sort Options:**
- `price_asc` - Price low to high
- `price_desc` - Price high to low
- `date_asc` - Earliest events first
- `date_desc` - Latest events first
- `created_asc` - Oldest listings first
- `created_desc` - Newest listings first (default)

---

## Validation Testing

### Test Invalid Email (Waitlist)
```bash
curl -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email"
  }'
```

**Expected Response (400):**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": ["Invalid email address"]
    }
  }
}
```

### Test Invalid URL (Profile Avatar)
```bash
curl -X PATCH http://localhost:3000/api/users/profile \
  -H "Content-Type: application/json" \
  -H "x-user-id: test-user-123" \
  -d '{
    "avatar": "not-a-url"
  }'
```

**Expected Response (400):**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "avatar": ["Invalid avatar URL"]
    }
  }
}
```

### Test Invalid Package Type
```bash
curl "http://localhost:3000/api/packages?type=INVALID_TYPE"
```

**Expected Response (400):**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "type": ["Invalid enum value..."]
    }
  }
}
```

---

## Testing with Postman

Import these requests into Postman:

1. **Create Collection:** "OneDettyDecember API"
2. **Add Environment Variables:**
   - `base_url`: `http://localhost:3000/api`
   - `test_user_id`: `test-user-123`

3. **Create Requests:**

   **Waitlist - Add Email**
   - Method: POST
   - URL: `{{base_url}}/waitlist`
   - Body (JSON):
     ```json
     {
       "email": "test{{$timestamp}}@example.com",
       "firstName": "Test",
       "lastName": "User"
     }
     ```

   **Waitlist - Get Count**
   - Method: GET
   - URL: `{{base_url}}/waitlist/count`

   **Profile - Get**
   - Method: GET
   - URL: `{{base_url}}/users/profile`
   - Headers: `x-user-id: {{test_user_id}}`

   **Profile - Update**
   - Method: PATCH
   - URL: `{{base_url}}/users/profile`
   - Headers: `x-user-id: {{test_user_id}}`
   - Body (JSON):
     ```json
     {
       "bio": "Test bio",
       "city": "Lagos"
     }
     ```

   **Packages - List**
   - Method: GET
   - URL: `{{base_url}}/packages?city=Lagos&limit=10`

---

## Next Steps

1. **Database Seeding:** Create seed data for testing packages
2. **Integration Tests:** Write automated tests with Vitest
3. **Auth Integration:** Replace stub auth with Supabase Auth (after Neziah completes)
4. **Rate Limiting:** Add rate limiting middleware
5. **Caching:** Implement Redis caching for package listings

---

## Known Limitations (Sprint 0 Day 1)

- ✅ Basic validation implemented
- ✅ Error handling in place
- ⚠️ Auth is stubbed (requires `x-user-id` header) - waiting for Neziah
- ⚠️ No rate limiting yet
- ⚠️ No caching yet
- ⚠️ No database seeding yet (empty package listings)

---

**Status:** ✅ 3 API Routes Functional
**Next:** Integration with Supabase Auth & Database Seeding
