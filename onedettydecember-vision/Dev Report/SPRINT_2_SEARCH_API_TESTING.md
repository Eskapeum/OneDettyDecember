# Sprint 2: Search & Discovery API Testing Guide

**Developer:** Nesiah (Backend Lead)
**Date:** November 18, 2025
**Sprint:** 2 of 13
**Status:** ✅ Implementation Complete

---

## 🎯 Overview

This guide covers testing for all Sprint 2 search and discovery features.

**Endpoints to Test:**
1. `GET /api/search` - Full-text search
2. `GET /api/search/autocomplete` - Search suggestions
3. `GET /api/packages/featured` - Featured packages
4. `GET /api/categories` - Category listing
5. `GET /api/packages` (Enhanced) - Advanced filtering

---

## Prerequisites

1. **Environment Variables (.env.local):**
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
   # Apply search indexes
   psql $DATABASE_URL < SPRINT_2_SEARCH_INDEXES.sql
   ```

3. **Start Server:**
   ```bash
   npm run dev
   ```

4. **Test Data:**
   Ensure database has sample packages for realistic testing. Create test packages with:
   - Different types (EVENT, STAY, EXPERIENCE, etc.)
   - Various cities (Lagos, Accra)
   - Different price ranges
   - Reviews and ratings
   - Some bookings

---

## 1. Full-Text Search

### **GET /api/search**

#### Test Case 1: Basic Search

```bash
curl "http://localhost:3000/api/search?q=beach+party"
```

**Expected Response (200):**
```json
{
  "data": [
    {
      "id": "clx...",
      "type": "EVENT",
      "title": "Beach Party Extravaganza",
      "description": "Epic beach party...",
      "relevanceScore": 95,
      "avgRating": 4.7,
      "reviewCount": 45,
      "vendor": {
        "businessName": "Lagos Events Co",
        "verifiedAt": "2025-11-01T00:00:00Z"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  },
  "query": "beach party",
  "filters": { /* ... */ }
}
```

#### Test Case 2: Search with Filters

```bash
curl "http://localhost:3000/api/search?q=party&type=EVENT&city=Lagos&minPrice=50&maxPrice=200"
```

**Expected Response (200):**
- Only EVENT type packages
- Only Lagos city
- Price between $50-$200
- Sorted by relevance score

#### Test Case 3: Search with Date Range

```bash
curl "http://localhost:3000/api/search?q=new+year&startDate=2025-12-30T00:00:00Z&endDate=2026-01-02T00:00:00Z"
```

**Expected Response (200):**
- Only packages with events between Dec 30, 2025 - Jan 2, 2026

#### Test Case 4: Pagination

```bash
curl "http://localhost:3000/api/search?q=event&page=2&limit=10"
```

**Expected Response (200):**
- Page 2 results
- 10 items per page
- Correct pagination metadata

#### Test Case 5: Empty Query

```bash
curl "http://localhost:3000/api/search?q="
```

**Expected Response (400):**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "q": ["Search query is required"]
    }
  }
}
```

#### Test Case 6: No Results

```bash
curl "http://localhost:3000/api/search?q=nonexistent+xyz+abc+123"
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
  },
  "query": "nonexistent xyz abc 123"
}
```

---

## 2. Autocomplete

### **GET /api/search/autocomplete**

#### Test Case 1: Basic Autocomplete

```bash
curl "http://localhost:3000/api/search/autocomplete?q=bea"
```

**Expected Response (200):**
```json
{
  "query": "bea",
  "suggestions": [
    {
      "text": "Beach Party Extravaganza",
      "type": "package",
      "packageType": "EVENT",
      "image": "https://...",
      "price": 150.00,
      "currency": "USD",
      "packageId": "clx..."
    },
    {
      "text": "Elegushi Beach",
      "type": "location"
    },
    {
      "text": "Beautiful Sunset Villa",
      "type": "package",
      "packageType": "STAY"
    }
  ],
  "count": 3
}
```

#### Test Case 2: Limited Suggestions

```bash
curl "http://localhost:3000/api/search/autocomplete?q=party&limit=5"
```

**Expected Response (200):**
- Maximum 5 suggestions
- Mix of packages, locations, and cities

#### Test Case 3: Single Character

```bash
curl "http://localhost:3000/api/search/autocomplete?q=l"
```

**Expected Response (200):**
- Suggestions starting with or containing "l"
- Cities like "Lagos", "Labadi"

#### Test Case 4: Empty Query

```bash
curl "http://localhost:3000/api/search/autocomplete?q="
```

**Expected Response (400):**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "q": ["Query is required"]
    }
  }
}
```

---

## 3. Featured Packages

### **GET /api/packages/featured**

#### Test Case 1: All Featured Packages

```bash
curl "http://localhost:3000/api/packages/featured"
```

**Expected Response (200):**
```json
{
  "packages": [
    {
      "id": "clx...",
      "type": "EVENT",
      "title": "New Year's Eve Mega Party",
      "featuredScore": 88,
      "avgRating": 4.9,
      "reviewCount": 120,
      "bookingCount": 450,
      "vendor": {
        "verifiedAt": "2025-10-01T00:00:00Z"
      }
    }
  ],
  "count": 10,
  "filters": {
    "type": null,
    "city": null
  }
}
```

**Verification:**
- Results sorted by `featuredScore` (descending)
- Only PUBLISHED packages with availability
- Verified vendors ranked higher

#### Test Case 2: Featured by Type

```bash
curl "http://localhost:3000/api/packages/featured?type=EVENT&limit=5"
```

**Expected Response (200):**
- Only EVENT packages
- Maximum 5 results
- Top-rated events

#### Test Case 3: Featured by City

```bash
curl "http://localhost:3000/api/packages/featured?city=Accra&limit=8"
```

**Expected Response (200):**
- Only Accra packages
- Maximum 8 results

#### Test Case 4: Combined Filters

```bash
curl "http://localhost:3000/api/packages/featured?type=STAY&city=Lagos&limit=3"
```

**Expected Response (200):**
- Only STAY packages in Lagos
- Top 3 results by featured score

---

## 4. Categories

### **GET /api/categories**

#### Test Case 1: Basic Categories

```bash
curl "http://localhost:3000/api/categories"
```

**Expected Response (200):**
```json
{
  "categories": [
    {
      "type": "EVENT",
      "name": "Events",
      "description": "New Year parties, concerts, festivals...",
      "icon": "calendar",
      "color": "#FF6B6B"
    },
    {
      "type": "STAY",
      "name": "Stays",
      "description": "Hotels, apartments, villas...",
      "icon": "home",
      "color": "#4ECDC4"
    }
    // ... 3 more categories
  ],
  "count": 5,
  "popular": null
}
```

**Verification:**
- Exactly 5 categories returned
- Each has type, name, description, icon, color

#### Test Case 2: Categories with Counts

```bash
curl "http://localhost:3000/api/categories?includeCount=true"
```

**Expected Response (200):**
```json
{
  "categories": [
    {
      "type": "EVENT",
      "name": "Events",
      "description": "...",
      "icon": "calendar",
      "color": "#FF6B6B",
      "count": 245,
      "cityBreakdown": {
        "Lagos": 180,
        "Accra": 65
      }
    }
  ],
  "count": 5,
  "popular": [
    { /* Top 3 categories by count */ }
  ]
}
```

**Verification:**
- Each category has `count` field
- Each has `cityBreakdown` with Lagos and Accra counts
- `popular` array has top 3 categories

---

## 5. Enhanced Package Listing

### **GET /api/packages** (Enhanced)

#### Test Case 1: Available Only Filter

```bash
curl "http://localhost:3000/api/packages?availableOnly=true&limit=20"
```

**Expected Response (200):**
- All packages have `availableSlots > 0` OR `startDate >= today`
- No sold-out or past packages

#### Test Case 2: Verified Vendors Only

```bash
curl "http://localhost:3000/api/packages?verifiedOnly=true&limit=20"
```

**Expected Response (200):**
- All packages from vendors with `verifiedAt` timestamp
- `vendor.verifiedAt` is not null

#### Test Case 3: Sort by Rating

```bash
curl "http://localhost:3000/api/packages?sort=rating&limit=10"
```

**Expected Response (200):**
- Packages sorted by `avgRating` (descending)
- Higher rated packages first
- Ties broken by `reviewCount`

#### Test Case 4: Sort by Popularity

```bash
curl "http://localhost:3000/api/packages?sort=popularity&limit=10"
```

**Expected Response (200):**
- Packages sorted by booking count
- Most booked packages first
- Ties broken by rating

#### Test Case 5: Combined Filters

```bash
curl "http://localhost:3000/api/packages?type=EVENT&city=Lagos&availableOnly=true&verifiedOnly=true&sort=popularity&minPrice=100&maxPrice=500&limit=15"
```

**Expected Response (200):**
- Only EVENT packages
- Only Lagos
- Only available
- Only verified vendors
- Price $100-$500
- Sorted by popularity
- Maximum 15 results

---

## 🧪 Integration Test Flow

**Complete Search Journey:**

```bash
# 1. Browse categories
curl "http://localhost:3000/api/categories?includeCount=true"

# 2. View featured packages
curl "http://localhost:3000/api/packages/featured?limit=6"

# 3. Start typing search query (autocomplete)
curl "http://localhost:3000/api/search/autocomplete?q=par"
curl "http://localhost:3000/api/search/autocomplete?q=party"

# 4. Execute full search with filters
curl "http://localhost:3000/api/search?q=party&type=EVENT&city=Lagos&minPrice=50&maxPrice=200"

# 5. Browse category packages
curl "http://localhost:3000/api/packages?type=EVENT&city=Lagos&availableOnly=true&sort=popularity"

# 6. Refine search with date filter
curl "http://localhost:3000/api/search?q=party&type=EVENT&startDate=2025-12-30T00:00:00Z&endDate=2026-01-02T00:00:00Z"
```

---

## ⚡ Performance Testing

### Search Performance Benchmarks

```bash
# Measure search query time
time curl "http://localhost:3000/api/search?q=party&type=EVENT"

# Expected: < 200ms (with indexes)

# Measure autocomplete time
time curl "http://localhost:3000/api/search/autocomplete?q=bea"

# Expected: < 100ms

# Measure featured packages time
time curl "http://localhost:3000/api/packages/featured?limit=10"

# Expected: < 300ms
```

### Load Testing (with Apache Bench)

```bash
# Test search endpoint under load
ab -n 1000 -c 10 "http://localhost:3000/api/search?q=party"

# Expected:
# - 95th percentile < 500ms
# - No errors
# - Throughput > 50 req/sec
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Slow search queries
**Solution:**
```bash
# Ensure search indexes are applied
psql $DATABASE_URL < SPRINT_2_SEARCH_INDEXES.sql

# Verify indexes exist
psql $DATABASE_URL -c "\d packages"
```

### Issue 2: Empty autocomplete results
**Solution:** Check that packages exist in database with PUBLISHED status

### Issue 3: Featured packages always same
**Solution:** Add more test data with varied ratings, bookings, and dates

### Issue 4: Relevance scores all same
**Solution:** Ensure test data has varied titles, descriptions that match/don't match query

---

## 📊 Test Coverage Checklist

- [x] Basic text search
- [x] Search with all filter combinations
- [x] Search pagination
- [x] Search with no results
- [x] Search validation errors
- [x] Autocomplete basic functionality
- [x] Autocomplete with limits
- [x] Autocomplete edge cases
- [x] Featured packages (all filters)
- [x] Featured scoring algorithm
- [x] Categories without counts
- [x] Categories with counts
- [x] Enhanced package filters (available, verified)
- [x] Enhanced sorting (rating, popularity)
- [x] Combined filter scenarios
- [x] Performance benchmarks
- [x] Error handling
- [x] Edge cases

---

## 🎯 Testing with Postman

**Import Collection Steps:**

1. Create collection: "OneDettyDecember - Sprint 2 Search"

2. Add environment variables:
   - `base_url`: `http://localhost:3000`
   - `search_query`: `party`
   - `type`: `EVENT`
   - `city`: `Lagos`

3. Create requests:

   **Search:**
   - GET `{{base_url}}/api/search?q={{search_query}}`

   **Autocomplete:**
   - GET `{{base_url}}/api/search/autocomplete?q={{search_query}}`

   **Featured:**
   - GET `{{base_url}}/api/packages/featured?type={{type}}`

   **Categories:**
   - GET `{{base_url}}/api/categories?includeCount=true`

   **Enhanced Packages:**
   - GET `{{base_url}}/api/packages?type={{type}}&sort=popularity`

4. Add tests to each request:
   ```javascript
   // Status code check
   pm.test("Status is 200", () => {
     pm.response.to.have.status(200);
   });

   // Response time check
   pm.test("Response time < 500ms", () => {
     pm.expect(pm.response.responseTime).to.be.below(500);
   });

   // Data structure check
   pm.test("Has data array", () => {
     const json = pm.response.json();
     pm.expect(json).to.have.property('data');
   });
   ```

---

## ✅ Acceptance Criteria

**Sprint 2 Search Features:**

- ✅ Full-text search works across title, description, location
- ✅ Search results ranked by relevance
- ✅ Autocomplete provides suggestions as user types
- ✅ Featured packages use scoring algorithm
- ✅ Categories list all package types with counts
- ✅ Enhanced filtering (available, verified, rating, popularity)
- ✅ All endpoints paginated correctly
- ✅ Search performance < 2s (typically < 200ms)
- ✅ Error handling consistent across endpoints
- ✅ Validation prevents invalid queries

---

## 📝 Next Steps (Sprint 2 Continuation)

- [ ] Frontend integration (Neriah - Search UI components)
- [ ] Automated tests (Lolu - E2E search tests)
- [ ] SEO implementation (Neziah - Meta tags, sitemap)
- [ ] Performance monitoring (Amelia - Caching strategy)
- [ ] CDN optimization (Daniel - Image optimization)
- [ ] Load testing (Daniel - 1000+ concurrent users)

---

**Status:** ✅ **ALL SEARCH ENDPOINTS FUNCTIONAL**
**Testing:** Ready for QA
**Integration:** Ready for Neriah's frontend
**Performance:** Optimized with database indexes

---

**Prepared By:** Nesiah (Backend Lead)
**Date:** November 18, 2025
**Sprint:** 2 of 13
**Story Points:** 8/8 completed (100%)
