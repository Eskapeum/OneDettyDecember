# 🚀 SPRINT 5 PLAN - REVIEWS & PROFILES

**Sprint:** 5 of 13  
**Dates:** January 27 - February 7, 2026 (2 weeks)  
**Goal:** User profiles and review system  
**Story Points:** 48 points  
**Team:** 7 developers  
**Epics:** Epic 5 (Reviews) + Epic 6 (Profiles - partial)

---

## 🎯 SPRINT GOALS

### **Primary Goals:**
1. Review submission system
2. Rating system (1-5 stars)
3. Review moderation
4. User profile pages
5. Booking history
6. Account settings
7. Profile editing

### **Success Criteria:**
- Users can submit reviews after bookings
- Reviews display on package pages
- Ratings calculate correctly
- Moderators can approve/reject reviews
- Users have complete profiles
- Booking history is accessible
- Account settings work

---

## 👥 TEAM ASSIGNMENTS

### **NERIAH (Frontend Lead) - 12 points** 🎯 **LEAD**

**Responsibilities:**
- Review UI (6 points)
- Profile UI (6 points)

**Tasks:**
1. Build review submission form
2. Create star rating component
3. Build review display component
4. Create review moderation UI
5. Build user profile page
6. Create profile edit form
7. Build booking history UI
8. Create account settings page

**Files to Create:**
- `platform/src/components/reviews/ReviewForm.tsx`
- `platform/src/components/reviews/StarRating.tsx`
- `platform/src/components/reviews/ReviewList.tsx`
- `platform/src/components/reviews/ReviewCard.tsx`
- `platform/src/app/profile/[userId]/page.tsx`
- `platform/src/app/profile/edit/page.tsx`
- `platform/src/app/bookings/history/page.tsx`
- `platform/src/app/settings/page.tsx`

---

### **NESIAH (Backend Lead) - 10 points**

**Responsibilities:**
- Review APIs (6 points)
- Profile APIs (4 points)

**Tasks:**
1. Create review submission API
2. Build review moderation API
3. Create review listing API
4. Build rating calculation
5. Create profile API
6. Build profile update API
7. Create booking history API
8. Build account settings API

**Files to Create:**
- `platform/src/app/api/reviews/route.ts`
- `platform/src/app/api/reviews/[id]/route.ts`
- `platform/src/app/api/reviews/moderate/route.ts`
- `platform/src/app/api/users/[id]/profile/route.ts`
- `platform/src/app/api/users/[id]/bookings/route.ts`
- `platform/src/app/api/users/settings/route.ts`

---

### **AMELIA (Lead Dev) - 8 points**

**Responsibilities:**
- Review service (4 points)
- Profile service (4 points)

**Tasks:**
1. Create review service
2. Build rating aggregation
3. Implement review validation
4. Create profile service
5. Build profile validation
6. Add image upload handling
7. Create notification triggers

**Files to Create:**
- `platform/lib/services/review.service.ts`
- `platform/lib/services/profile.service.ts`
- `platform/lib/validation/review.validation.ts`
- `platform/lib/validation/profile.validation.ts`
- `platform/lib/services/image-upload.service.ts`

---

### **NEZIAH (Full-Stack) - 7 points**

**Responsibilities:**
- Review moderation (4 points)
- Email notifications (3 points)

**Tasks:**
1. Build moderation dashboard
2. Create moderation workflow
3. Add spam detection
4. Build review email templates
5. Create notification system
6. Add review reminders

**Files to Create:**
- `platform/src/app/admin/reviews/page.tsx`
- `platform/lib/services/moderation.service.ts`
- `platform/lib/email/templates/review-request.tsx`
- `platform/lib/email/templates/review-approved.tsx`
- `platform/lib/services/notification.service.ts`

---

### **DANIEL (DevOps) - 4 points**

**Responsibilities:**
- Image storage (2 points)
- Performance (2 points)

**Tasks:**
1. Set up image storage (S3/Cloudinary)
2. Configure image optimization
3. Add CDN for images
4. Optimize review queries
5. Add database indexes

**Files to Create:**
- `platform/lib/storage/image-storage.ts`
- `platform/prisma/migrations/3_review_indexes/migration.sql`
- `platform/scripts/image-optimization.js`

---

### **LOLU (QA/Testing) - 4 points**

**Responsibilities:**
- Review testing (2 points)
- Profile testing (2 points)

**Tasks:**
1. Test review submission
2. Test rating calculation
3. Test moderation flow
4. Test profile editing
5. Test image uploads
6. Test booking history

**Files to Create:**
- `platform/e2e/reviews/submission.spec.ts`
- `platform/e2e/reviews/moderation.spec.ts`
- `platform/e2e/profile/edit.spec.ts`
- `platform/e2e/profile/history.spec.ts`

---

### **TOBI (Frontend) - 3 points**

**Responsibilities:**
- Review components (3 points)

**Tasks:**
1. Build image upload component
2. Create avatar component
3. Build rating display
4. Create review filters

**Files to Create:**
- `platform/src/components/common/ImageUpload.tsx`
- `platform/src/components/common/Avatar.tsx`
- `platform/src/components/reviews/RatingDisplay.tsx`
- `platform/src/components/reviews/ReviewFilters.tsx`

---

## 📊 EPIC BREAKDOWN

### **Story 5.1: Review Submission (15 points)**
- Review form
- Star rating
- Image upload
- Review validation
- Review API

### **Story 5.2: Review Display (10 points)**
- Review list
- Rating aggregation
- Review filters
- Review sorting

### **Story 5.3: Review Moderation (8 points)**
- Moderation dashboard
- Approval workflow
- Spam detection
- Moderation API

### **Story 5.4: User Profiles (10 points)**
- Profile page
- Profile editing
- Avatar upload
- Profile API

### **Story 5.5: Booking History (5 points)**
- History page
- Booking filters
- History API

---

## 🎯 TECHNICAL REQUIREMENTS

### **Review System:**
- 1-5 star ratings
- Text reviews (max 1000 chars)
- Image uploads (max 5 images)
- Review moderation
- Spam detection

### **Profile System:**
- User information
- Avatar upload
- Booking history
- Account settings
- Privacy controls

### **Performance:**
- Review submission: <500ms
- Profile load: <1s
- Image upload: <3s
- Rating calculation: <100ms

---

## 📝 DEPENDENCIES

**Requires from Sprint 4:**
- ✅ Payment system
- ✅ Booking completion

**Provides for Sprint 6:**
- ✅ Review system
- ✅ User profiles
- ✅ Rating system

---

## 🔑 KEY DELIVERABLES

1. ✅ Review submission
2. ✅ Star ratings
3. ✅ Review moderation
4. ✅ User profiles
5. ✅ Booking history
6. ✅ Account settings
7. ✅ Image uploads

---

**Created By:** Amelia (Lead Dev)  
**Date:** November 18, 2025  
**Status:** 📋 **READY FOR SPRINT 5**

