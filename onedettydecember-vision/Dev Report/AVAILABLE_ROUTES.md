# 🗺️ OneDettyDecember Platform - Available Routes

**Server:** http://localhost:3002  
**Status:** ✅ Running  
**Last Updated:** November 18, 2025

---

## 🏠 PAGE ROUTES (Frontend)

### **Root**
- **`/`** - Home page (default Next.js template)
  - Status: ✅ Available
  - Returns: Next.js starter page

### **Waitlist**
- **`/waitlist`** - Waitlist signup page
  - Status: ✅ Available
  - Sprint: Sprint 0

### **Packages**
- **`/packages/[id]`** - Package detail page
  - Status: ✅ Available
  - Sprint: Sprint 2
  - Example: `/packages/pkg_123`

### **Bookings**
- **`/bookings/confirmation/[id]`** - Booking confirmation page
  - Status: ✅ Available
  - Sprint: Sprint 3
  - Example: `/bookings/confirmation/booking_123`

---

## 🔌 API ROUTES (Backend)

### **🔐 Authentication** (`/api/auth/*`)

| Route | Method | Status | Description |
|-------|--------|--------|-------------|
| `/api/auth/register` | POST | ✅ | User registration |
| `/api/auth/login` | POST | ✅ | User login |
| `/api/auth/verify` | GET | ✅ | Email verification |
| `/api/auth/session` | GET | ✅ | Get current session |
| `/api/auth/password-reset` | POST | ✅ | Password reset request |
| `/api/auth/oauth` | GET/POST | ✅ | OAuth authentication |

**Sprint:** Sprint 1  
**Authentication:** Supabase Auth (JWT)

---

### **📦 Packages** (`/api/packages/*`)

| Route | Method | Status | Description |
|-------|--------|--------|-------------|
| `/api/packages` | GET | ✅ | List packages with filters |
| `/api/packages/[id]` | GET | ✅ | Get package details |
| `/api/packages/[id]/availability` | GET | ✅ | Check package availability |

**Sprint:** Sprint 2 & 3  
**Caching:** Redis (10-min TTL)

**Query Parameters for `/api/packages`:**
```
?type=EVENT                    # Filter by type
&city=Lagos                    # Filter by city
&minPrice=50                   # Price range
&maxPrice=500
&startDate=2025-12-01          # Date range
&endDate=2025-12-31
&search=concert                # Search term
&page=1                        # Pagination
&limit=20
```

---

### **🔍 Search** (`/api/search/*`)

| Route | Method | Status | Description |
|-------|--------|--------|-------------|
| `/api/search` | GET | ✅ | Full-text search |
| `/api/search` | POST | ❌ | Not allowed (405) |
| `/api/search/filters` | GET | ✅ | Get available filters |
| `/api/search/suggestions` | GET | ✅ | Autocomplete suggestions |

**Sprint:** Sprint 2  
**Search Engine:** PostgreSQL Full-Text Search

**Query Parameters for `/api/search`:**
```
?q=party                       # Search query
&city=Lagos                    # City filter
&type=EVENT                    # Package type
&minPrice=0                    # Price range
&maxPrice=1000
&page=1                        # Pagination
&limit=20
```

---

### **📅 Availability** (`/api/availability/*`)

| Route | Method | Status | Description |
|-------|--------|--------|-------------|
| `/api/availability/check` | GET | ✅ | Check availability |
| `/api/availability/calendar` | GET | ✅ | Get calendar view |

**Sprint:** Sprint 3  
**Caching:** Redis (5-min TTL)

---

### **🎫 Bookings** (`/api/bookings/*`)

| Route | Method | Status | Description |
|-------|--------|--------|-------------|
| `/api/bookings` | GET | ✅ | List user bookings |
| `/api/bookings` | POST | ✅ | Create booking |
| `/api/bookings/[id]` | GET | ✅ | Get booking details |
| `/api/bookings/[id]` | PATCH | ✅ | Update booking |
| `/api/bookings/[id]` | DELETE | ✅ | Cancel booking |
| `/api/bookings/[id]/confirmation` | GET | ✅ | Get confirmation |
| `/api/bookings/[id]/confirmation` | POST | ✅ | Send confirmation email |

**Sprint:** Sprint 3  
**Authentication:** Required (JWT)  
**Features:** Email confirmation, PDF receipts

---

### **💳 Payments** (`/api/payments/*`)

| Route | Method | Status | Description |
|-------|--------|--------|-------------|
| `/api/payments/process` | POST | ⏳ | Process payment |

**Sprint:** Sprint 4 (Planned)  
**Providers:** Stripe, Paystack

---

### **📝 Waitlist** (`/api/waitlist`)

| Route | Method | Status | Description |
|-------|--------|--------|-------------|
| `/api/waitlist` | GET | ✅ | List waitlist entries |
| `/api/waitlist` | POST | ✅ | Add to waitlist |

**Sprint:** Sprint 0  
**Authentication:** Not required for POST

**Query Parameters for GET:**
```
?page=1                        # Pagination
&limit=10
```

---

## 🔒 AUTHENTICATION

### **Protected Routes**
All routes except the following require authentication:
- `GET /api/packages`
- `GET /api/packages/[id]`
- `POST /api/waitlist`
- `GET /api/waitlist/count`
- `POST /api/auth/register`
- `POST /api/auth/login`

### **Authentication Method**
- **Type:** JWT (JSON Web Token)
- **Provider:** Supabase Auth
- **Header:** `Authorization: Bearer <token>`

---

## 📊 RESPONSE FORMATS

### **Success Response**
```json
{
  "success": true,
  "data": { ... },
  "cached": false
}
```

### **Error Response**
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "status": 400
}
```

### **Pagination Response**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

## 🚀 TESTING ROUTES

### **Using cURL**

```bash
# Test home page
curl http://localhost:3002/

# Test waitlist API
curl http://localhost:3002/api/waitlist

# Test search
curl "http://localhost:3002/api/search?q=party&city=Lagos"

# Test package details
curl http://localhost:3002/api/packages/pkg_123

# Test authentication (register)
curl -X POST http://localhost:3002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","firstName":"Test","lastName":"User"}'
```

### **Using Browser**

- Home: http://localhost:3002/
- Waitlist: http://localhost:3002/waitlist
- Search API: http://localhost:3002/api/search?q=party
- Filters: http://localhost:3002/api/search/filters

---

## 📈 IMPLEMENTATION STATUS

| Sprint | Routes | Status |
|--------|--------|--------|
| Sprint 0 | Waitlist | ✅ Complete |
| Sprint 1 | Authentication | ✅ Complete |
| Sprint 2 | Search & Discovery | ✅ Complete |
| Sprint 3 | Booking Flow | ✅ Complete |
| Sprint 4 | Payments | ⏳ Planned |

---

## 🎯 NEXT STEPS

### **Sprint 4 - Payments (Planned)**
- `/api/payments/process` - Process payments
- `/api/payments/webhook` - Payment webhooks
- `/api/payments/refund` - Process refunds

### **Sprint 5 - Reviews (Planned)**
- `/api/reviews` - List/create reviews
- `/api/reviews/[id]` - Review details

### **Sprint 6 - Wishlist (Planned)**
- `/api/wishlist` - Manage wishlist
- `/api/wishlist/[id]` - Wishlist items

---

**Total Routes:** 30+ routes available  
**Status:** ✅ All Sprint 0-3 routes operational  
**Server:** http://localhost:3002  
**Ready:** For development and testing

