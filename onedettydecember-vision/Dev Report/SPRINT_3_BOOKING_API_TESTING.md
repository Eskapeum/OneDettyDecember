# Sprint 3: Booking Flow API Testing Guide

**Developer:** Nesiah (Backend Lead)
**Date:** November 18, 2025
**Sprint:** 3 of 13
**Status:** ✅ Implementation Complete

---

## 🎯 Overview

This guide covers testing for all Sprint 3 booking and package detail features.

**Endpoints to Test:**
1. `GET /api/packages/[id]` - Package details
2. `POST /api/bookings` - Create booking
3. `GET /api/bookings` - Booking history
4. `GET /api/bookings/[id]` - Booking details
5. `PATCH /api/bookings/[id]` - Update booking
6. `POST /api/packages/[id]/availability` - Check availability

---

## Prerequisites

1. **Environment Setup:**
   ```bash
   DATABASE_URL="postgresql://..."
   NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbG..."
   SUPABASE_SERVICE_ROLE_KEY="eyJhbG..."
   ```

2. **Database Setup:**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

3. **Test Data Required:**
   - Published packages with various types
   - User accounts (traveler, vendor)
   - Some existing bookings

4. **Authentication:**
   ```bash
   # Login first to get session tokens
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "user@example.com",
       "password": "SecurePass123"
     }'

   # Extract access_token and refresh_token for subsequent requests
   ```

---

## 1. Package Detail Tests

### **GET /api/packages/[id]**

#### Test Case 1: View Published Package

```bash
curl "http://localhost:3000/api/packages/clx123..."
```

**Expected (200):**
- Complete package details
- Vendor information
- Review statistics
- Related packages (up to 4)
- Rating distribution

**Verify:**
- All required fields present
- Images array not empty
- Vendor verified status
- Average rating calculated correctly

#### Test Case 2: Non-Existent Package

```bash
curl "http://localhost:3000/api/packages/invalid_id"
```

**Expected (404):**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Package not found"
  }
}
```

#### Test Case 3: Draft Package (Should Not Be Visible)

```bash
curl "http://localhost:3000/api/packages/draft_package_id"
```

**Expected (404):**
- Draft packages should return 404 to public users

---

## 2. Booking Creation Tests

### **POST /api/bookings**

#### Test Case 1: Successful Booking

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=...; sb-refresh-token=..." \
  -d '{
    "packageId": "clx123...",
    "bookingDate": "2025-12-31T20:00:00Z",
    "quantity": 2,
    "specialRequests": "Vegetarian meal"
  }'
```

**Expected (201):**
```json
{
  "message": "Booking created successfully",
  "booking": {
    "id": "clxbooking...",
    "status": "PENDING",
    "quantity": 2,
    "totalPrice": 300.00,
    "package": { /* package details */ }
  }
}
```

**Verify:**
- Booking created in database
- Available slots decremented
- Total price calculated correctly (price × quantity)

#### Test Case 2: Booking Without Authentication

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "packageId": "clx123...",
    "bookingDate": "2025-12-31T20:00:00Z",
    "quantity": 2
  }'
```

**Expected (401):**
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

#### Test Case 3: Booking Past Date

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=..." \
  -d '{
    "packageId": "clx123...",
    "bookingDate": "2023-12-31T20:00:00Z",
    "quantity": 2
  }'
```

**Expected (400):**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Booking date must be in the future"
  }
}
```

#### Test Case 4: Insufficient Slots

```bash
# Package has 2 slots available, requesting 5
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=..." \
  -d '{
    "packageId": "clx_almost_sold_out...",
    "bookingDate": "2025-12-31T20:00:00Z",
    "quantity": 5
  }'
```

**Expected (409):**
```json
{
  "error": {
    "code": "CONFLICT",
    "message": "Only 2 slot(s) available. Requested: 5"
  }
}
```

#### Test Case 5: Booking Own Vendor Package

```bash
# Login as vendor and try to book own package
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=vendor_token..." \
  -d '{
    "packageId": "vendor_own_package_id...",
    "bookingDate": "2025-12-31T20:00:00Z",
    "quantity": 1
  }'
```

**Expected (400):**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "You cannot book your own packages"
  }
}
```

#### Test Case 6: Invalid Quantity

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=..." \
  -d '{
    "packageId": "clx123...",
    "bookingDate": "2025-12-31T20:00:00Z",
    "quantity": 0
  }'
```

**Expected (400):**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "quantity": ["Quantity must be at least 1"]
    }
  }
}
```

---

## 3. Booking History Tests

### **GET /api/bookings**

#### Test Case 1: Get All Bookings

```bash
curl "http://localhost:3000/api/bookings" \
  -H "Cookie: sb-access-token=..."
```

**Expected (200):**
```json
{
  "data": [ /* array of bookings */ ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

#### Test Case 2: Filter by Status

```bash
curl "http://localhost:3000/api/bookings?status=CONFIRMED" \
  -H "Cookie: sb-access-token=..."
```

**Expected (200):**
- Only CONFIRMED bookings returned

#### Test Case 3: Filter by Package Type

```bash
curl "http://localhost:3000/api/bookings?packageType=EVENT" \
  -H "Cookie: sb-access-token=..."
```

**Expected (200):**
- Only EVENT package bookings returned

#### Test Case 4: Filter by Date Range

```bash
curl "http://localhost:3000/api/bookings?startDate=2025-12-01T00:00:00Z&endDate=2026-01-31T23:59:59Z" \
  -H "Cookie: sb-access-token=..."
```

**Expected (200):**
- Only bookings within date range

#### Test Case 5: Sort by Date Descending

```bash
curl "http://localhost:3000/api/bookings?sort=date_desc" \
  -H "Cookie: sb-access-token=..."
```

**Expected (200):**
- Bookings sorted by booking date (newest first)

#### Test Case 6: Pagination

```bash
curl "http://localhost:3000/api/bookings?page=2&limit=10" \
  -H "Cookie: sb-access-token=..."
```

**Expected (200):**
- Page 2 of results
- 10 items per page

---

## 4. Single Booking Detail Tests

### **GET /api/bookings/[id]**

#### Test Case 1: View Own Booking

```bash
curl "http://localhost:3000/api/bookings/clxbooking123..." \
  -H "Cookie: sb-access-token=..."
```

**Expected (200):**
- Complete booking details
- Package information
- Payment information (if exists)
- Review information (if exists)
- Vendor contact details

#### Test Case 2: View Other User's Booking

```bash
curl "http://localhost:3000/api/bookings/other_user_booking..." \
  -H "Cookie: sb-access-token=..."
```

**Expected (403):**
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to view this booking"
  }
}
```

#### Test Case 3: Vendor View Customer Booking

```bash
# Login as vendor
curl "http://localhost:3000/api/bookings/customer_booking_for_vendor_package..." \
  -H "Cookie: sb-access-token=vendor_token..."
```

**Expected (200):**
- Vendor can view bookings for their packages

---

## 5. Booking Update Tests

### **PATCH /api/bookings/[id]**

#### Test Case 1: User Cancel Pending Booking

```bash
curl -X PATCH http://localhost:3000/api/bookings/clxbooking... \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=..." \
  -d '{
    "status": "CANCELLED"
  }'
```

**Expected (200):**
```json
{
  "message": "Booking updated successfully",
  "booking": {
    "id": "clxbooking...",
    "status": "CANCELLED",
    /* ... */
  }
}
```

**Verify:**
- Available slots restored
- Package status changed from SOLD_OUT if applicable

#### Test Case 2: User Try to Confirm Own Booking

```bash
curl -X PATCH http://localhost:3000/api/bookings/clxbooking... \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=..." \
  -d '{
    "status": "CONFIRMED"
  }'
```

**Expected (403):**
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Users can only cancel their bookings"
  }
}
```

#### Test Case 3: Vendor Confirm Booking

```bash
curl -X PATCH http://localhost:3000/api/bookings/clxbooking... \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=vendor_token..." \
  -d '{
    "status": "CONFIRMED"
  }'
```

**Expected (200):**
- Vendor successfully confirms booking

#### Test Case 4: Update Completed Booking

```bash
curl -X PATCH http://localhost:3000/api/bookings/completed_booking... \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=..." \
  -d '{
    "status": "CANCELLED"
  }'
```

**Expected (400):**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Cannot update completed or refunded bookings"
  }
}
```

#### Test Case 5: Update Special Requests

```bash
curl -X PATCH http://localhost:3000/api/bookings/clxbooking... \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=..." \
  -d '{
    "specialRequests": "Updated: Need wheelchair access"
  }'
```

**Expected (200):**
- Special requests updated
- Status unchanged

---

## 6. Availability Check Tests

### **POST /api/packages/[id]/availability**

#### Test Case 1: Check Available Package

```bash
curl -X POST http://localhost:3000/api/packages/clx123.../availability \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-12-31T20:00:00Z",
    "quantity": 5
  }'
```

**Expected (200):**
```json
{
  "available": true,
  "reason": null,
  "package": {
    "id": "clx123...",
    "title": "...",
    "type": "EVENT",
    "capacity": 500,
    "availableSlots": 350,
    "bookedSlots": 150,
    "requestedQuantity": 5
  }
}
```

#### Test Case 2: Check Sold Out Package

```bash
curl -X POST http://localhost:3000/api/packages/almost_sold_out.../availability \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-12-31T20:00:00Z",
    "quantity": 10
  }'
```

**Expected (200):**
```json
{
  "available": false,
  "reason": "Only 2 slot(s) available",
  "package": {
    "availableSlots": 2,
    "requestedQuantity": 10
  }
}
```

#### Test Case 3: Check Past Date

```bash
curl -X POST http://localhost:3000/api/packages/clx123.../availability \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2023-12-31T20:00:00Z",
    "quantity": 2
  }'
```

**Expected (200):**
```json
{
  "available": false,
  "reason": "Requested date is in the past"
}
```

#### Test Case 4: Check Date Outside Range

```bash
curl -X POST http://localhost:3000/api/packages/clx123.../availability \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2026-06-01T20:00:00Z",
    "quantity": 2
  }'
```

**Expected (200):**
```json
{
  "available": false,
  "reason": "Requested date is outside package availability window",
  "package": {
    "availableDates": {
      "start": "2025-12-31T00:00:00Z",
      "end": "2026-01-01T23:59:59Z"
    }
  }
}
```

---

## 🧪 Integration Test Flow

**Complete Booking Journey:**

```bash
# 1. Browse packages
curl "http://localhost:3000/api/packages?type=EVENT&city=Lagos"

# 2. View package details
PACKAGE_ID="clx123..."
curl "http://localhost:3000/api/packages/$PACKAGE_ID"

# 3. Check availability
curl -X POST "http://localhost:3000/api/packages/$PACKAGE_ID/availability" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-12-31T20:00:00Z",
    "quantity": 2
  }'

# 4. Login
LOGIN_RESPONSE=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }')

# Extract tokens (manually or with jq)
ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.session.accessToken')

# 5. Create booking
BOOKING_RESPONSE=$(curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=$ACCESS_TOKEN; sb-refresh-token=$REFRESH_TOKEN" \
  -d '{
    "packageId": "'$PACKAGE_ID'",
    "bookingDate": "2025-12-31T20:00:00Z",
    "quantity": 2,
    "specialRequests": "Vegetarian meal"
  }')

BOOKING_ID=$(echo $BOOKING_RESPONSE | jq -r '.booking.id')

# 6. View booking details
curl "http://localhost:3000/api/bookings/$BOOKING_ID" \
  -H "Cookie: sb-access-token=$ACCESS_TOKEN"

# 7. View all bookings
curl "http://localhost:3000/api/bookings" \
  -H "Cookie: sb-access-token=$ACCESS_TOKEN"

# 8. Cancel booking
curl -X PATCH "http://localhost:3000/api/bookings/$BOOKING_ID" \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=$ACCESS_TOKEN" \
  -d '{
    "status": "CANCELLED"
  }'

# 9. Verify slots restored
curl "http://localhost:3000/api/packages/$PACKAGE_ID"
```

---

## ⚡ Performance Testing

### Response Time Benchmarks

```bash
# Package detail
time curl "http://localhost:3000/api/packages/clx123..."
# Expected: < 300ms

# Booking creation
time curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=..." \
  -d '{ /* booking data */ }'
# Expected: < 500ms (includes transaction)

# Availability check
time curl -X POST "http://localhost:3000/api/packages/clx123.../availability" \
  -H "Content-Type: application/json" \
  -d '{ /* availability data */ }'
# Expected: < 200ms

# Booking history
time curl "http://localhost:3000/api/bookings?limit=20" \
  -H "Cookie: sb-access-token=..."
# Expected: < 300ms
```

---

## ✅ Test Coverage Checklist

**Package Details:**
- [x] View published package
- [x] Non-existent package
- [x] Draft package visibility
- [x] Related packages shown
- [x] Review statistics calculated

**Booking Creation:**
- [x] Successful booking
- [x] Unauthenticated user
- [x] Past date validation
- [x] Insufficient slots
- [x] Own vendor package prevention
- [x] Invalid quantity
- [x] Sold out package
- [x] Date outside range
- [x] Slot decrement
- [x] Price calculation

**Booking History:**
- [x] List all bookings
- [x] Filter by status
- [x] Filter by package type
- [x] Filter by date range
- [x] Sorting options
- [x] Pagination

**Booking Details:**
- [x] View own booking
- [x] Permission check
- [x] Vendor view customer booking
- [x] Admin view any booking

**Booking Updates:**
- [x] User cancel booking
- [x] User permission limits
- [x] Vendor confirm booking
- [x] Vendor complete booking
- [x] Completed booking protection
- [x] Slot restoration on cancel
- [x] Special request updates

**Availability:**
- [x] Available package check
- [x] Sold out detection
- [x] Past date validation
- [x] Date range validation
- [x] Double booking prevention (stays/cars)
- [x] Capacity-based availability (events)

---

## 🐛 Common Issues & Solutions

### Issue 1: Booking creation fails silently
**Solution:** Check transaction logs, ensure database supports transactions

### Issue 2: Slots not decrementing
**Solution:** Verify transaction commits successfully, check for database errors

### Issue 3: Availability shows wrong slots
**Solution:** Clear any caching, ensure real-time database queries

### Issue 4: Cannot cancel booking
**Solution:** Check booking status, ensure status transition rules are correct

---

## 📊 Acceptance Criteria

**Sprint 3 Booking Features:**

- ✅ Package detail page shows complete information
- ✅ Bookings can be created with validation
- ✅ Available slots decremented automatically
- ✅ Real-time availability checking works
- ✅ Users can view their booking history
- ✅ Users can cancel their bookings
- ✅ Vendors can confirm/cancel bookings
- ✅ Slot restoration on cancellation
- ✅ Transaction-safe booking operations
- ✅ Permission controls enforced
- ✅ All error cases handled gracefully

---

**Status:** ✅ **ALL BOOKING ENDPOINTS FUNCTIONAL**
**Testing:** Ready for QA (Lolu)
**Integration:** Ready for frontend (Neriah)
**Email System:** Ready for Neziah integration

---

**Prepared By:** Nesiah (Backend Lead)
**Date:** November 18, 2025
**Sprint:** 3 of 13
**Story Points:** 9/9 completed (100%)
