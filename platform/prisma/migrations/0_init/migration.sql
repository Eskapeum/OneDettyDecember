-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PackageStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'SOLD_OUT', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PackageType" AS ENUM ('EVENT', 'STAY', 'EXPERIENCE', 'CAR_RENTAL', 'MARKETPLACE_PRODUCT');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('STRIPE', 'PAYSTACK');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('TRAVELER', 'VENDOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DELETED');

-- CreateEnum
CREATE TYPE "VendorStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "VendorType" AS ENUM ('EVENT_PROMOTER', 'ACCOMMODATION_HOST', 'EXPERIENCE_HOST', 'CAR_RENTAL', 'MARKETPLACE_SELLER');

-- CreateTable
CREATE TABLE "account_lockouts" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "userId" TEXT NOT NULL,
    "attempts" INTEGER DEFAULT 0,
    "isLocked" BOOLEAN DEFAULT false,
    "expiresAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "account_lockouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "userId" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "status" "BookingStatus" DEFAULT 'PENDING',
    "quantity" INTEGER DEFAULT 1,
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "currency" TEXT DEFAULT 'USD',
    "bookingDate" TIMESTAMPTZ(6) NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packages" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "vendorId" TEXT NOT NULL,
    "type" "PackageType" NOT NULL,
    "status" "PackageStatus" DEFAULT 'DRAFT',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT DEFAULT 'USD',
    "location" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "capacity" INTEGER,
    "availableSlots" INTEGER,
    "startDate" TIMESTAMPTZ(6),
    "endDate" TIMESTAMPTZ(6),
    "metadata" JSONB,
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_disputes" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "paymentId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "description" TEXT,
    "evidence" JSONB DEFAULT '{}',
    "status" TEXT DEFAULT 'OPEN',
    "resolution" TEXT,
    "createdBy" TEXT NOT NULL,
    "assignedTo" TEXT,
    "resolvedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_disputes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "bookingId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT DEFAULT 'USD',
    "status" "PaymentStatus" DEFAULT 'PENDING',
    "provider" "PaymentProvider" NOT NULL,
    "providerPaymentId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rate_limit_log" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "identifier" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rate_limit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "userId" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_events" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "eventType" TEXT NOT NULL,
    "userId" TEXT,
    "metadata" JSONB DEFAULT '{}',
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "severity" TEXT DEFAULT 'MEDIUM',
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "security_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_logs" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "type" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "userId" TEXT,
    "data" JSONB DEFAULT '{}',
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "travelers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "timing" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "referral_source" TEXT,
    "utm_source" TEXT,
    "utm_medium" TEXT,
    "utm_campaign" TEXT,
    "user_agent" TEXT,
    "ip_address" TEXT,
    "status" TEXT DEFAULT 'active',
    "invited_at" TIMESTAMPTZ(6),
    "converted_at" TIMESTAMPTZ(6),
    "email_verified" BOOLEAN DEFAULT false,
    "email_verified_at" TIMESTAMPTZ(6),
    "verification_token" TEXT,
    "verification_token_expires_at" TIMESTAMPTZ(6),
    "vibe" TEXT[],
    "city" TEXT[],

    CONSTRAINT "travelers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "avatar" TEXT,
    "country" TEXT,
    "city" TEXT,
    "dateOfBirth" TIMESTAMPTZ(6),
    "preferences" JSONB,
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "role" "UserRole" DEFAULT 'TRAVELER',
    "status" "UserStatus" DEFAULT 'ACTIVE',
    "emailVerified" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendors" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "business_name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "scale" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "referral_source" TEXT,
    "utm_source" TEXT,
    "utm_medium" TEXT,
    "utm_campaign" TEXT,
    "user_agent" TEXT,
    "ip_address" TEXT,
    "status" TEXT DEFAULT 'pending',
    "approved_at" TIMESTAMPTZ(6),
    "activated_at" TIMESTAMPTZ(6),
    "verified" BOOLEAN DEFAULT false,
    "verified_at" TIMESTAMPTZ(6),
    "verification_notes" TEXT,
    "priority_tier" TEXT DEFAULT 'standard',
    "email_verified" BOOLEAN DEFAULT false,
    "email_verified_at" TIMESTAMPTZ(6),
    "verification_token" TEXT,
    "verification_token_expires_at" TIMESTAMPTZ(6),
    "phone_number" TEXT,
    "whatsapp_number" TEXT,
    "website" TEXT,
    "business_description" TEXT,
    "services_offered" TEXT[],
    "instagram_handle" TEXT,
    "facebook_url" TEXT,
    "twitter_handle" TEXT,
    "tiktok_handle" TEXT,
    "business_address" TEXT,
    "country" TEXT DEFAULT 'Nigeria',
    "operating_hours" TEXT,
    "languages_spoken" TEXT[],
    "payment_methods" TEXT[],
    "price_range" TEXT,
    "currency" TEXT DEFAULT 'NGN',
    "capacity" INTEGER,
    "amenities" TEXT[],
    "logo_url" TEXT,
    "cover_photo_url" TEXT,
    "gallery_photos" TEXT[],
    "video_url" TEXT,
    "registration_number" TEXT,
    "cancellation_policy" TEXT,
    "accessibility_features" TEXT[],

    CONSTRAINT "vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "waitlist_entries" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "source" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "waitlist_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wishlist_items" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "userId" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wishlist_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_lockouts_userId_key" ON "account_lockouts"("userId");

-- CreateIndex
CREATE INDEX "account_lockouts_userId_idx" ON "account_lockouts"("userId");

-- CreateIndex
CREATE INDEX "bookings_packageId_idx" ON "bookings"("packageId");

-- CreateIndex
CREATE INDEX "bookings_package_status_idx" ON "bookings"("packageId", "status");

-- CreateIndex
CREATE INDEX "bookings_status_idx" ON "bookings"("status");

-- CreateIndex
CREATE INDEX "bookings_userId_idx" ON "bookings"("userId");

-- CreateIndex
CREATE INDEX "bookings_user_status_idx" ON "bookings"("userId", "status");

-- CreateIndex
CREATE INDEX "packages_city_idx" ON "packages"("city");

-- CreateIndex
CREATE INDEX "packages_metadata_gin_idx" ON "packages" USING GIN ("metadata");

-- CreateIndex
CREATE INDEX "packages_startDate_idx" ON "packages"("startDate");

-- CreateIndex
CREATE INDEX "packages_status_idx" ON "packages"("status");

-- CreateIndex
CREATE INDEX "packages_type_idx" ON "packages"("type");

-- CreateIndex
CREATE INDEX "packages_type_status_city_idx" ON "packages"("type", "status", "city");

-- CreateIndex
CREATE INDEX "payment_disputes_createdBy_idx" ON "payment_disputes"("createdBy");

-- CreateIndex
CREATE INDEX "payment_disputes_paymentId_idx" ON "payment_disputes"("paymentId");

-- CreateIndex
CREATE INDEX "payment_disputes_status_idx" ON "payment_disputes"("status");

-- CreateIndex
CREATE UNIQUE INDEX "payments_bookingId_key" ON "payments"("bookingId");

-- CreateIndex
CREATE INDEX "payments_created_status_idx" ON "payments"("createdAt" DESC, "status");

-- CreateIndex
CREATE INDEX "payments_metadata_gin_idx" ON "payments" USING GIN ("metadata");

-- CreateIndex
CREATE INDEX "payments_providerPaymentId_idx" ON "payments"("providerPaymentId");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "payments_status_provider_idx" ON "payments"("status", "provider");

-- CreateIndex
CREATE INDEX "rate_limit_log_createdAt_idx" ON "rate_limit_log"("createdAt");

-- CreateIndex
CREATE INDEX "rate_limit_log_identifier_action_idx" ON "rate_limit_log"("identifier", "action");

-- CreateIndex
CREATE INDEX "rate_limit_log_ipAddress_idx" ON "rate_limit_log"("ipAddress");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_bookingId_key" ON "reviews"("bookingId");

-- CreateIndex
CREATE INDEX "reviews_packageId_idx" ON "reviews"("packageId");

-- CreateIndex
CREATE INDEX "reviews_rating_idx" ON "reviews"("rating");

-- CreateIndex
CREATE INDEX "reviews_userId_idx" ON "reviews"("userId");

-- CreateIndex
CREATE INDEX "security_events_createdAt_idx" ON "security_events"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "security_events_eventType_idx" ON "security_events"("eventType");

-- CreateIndex
CREATE INDEX "security_events_ipAddress_idx" ON "security_events"("ipAddress");

-- CreateIndex
CREATE INDEX "security_events_severity_idx" ON "security_events"("severity");

-- CreateIndex
CREATE INDEX "security_events_userId_idx" ON "security_events"("userId");

-- CreateIndex
CREATE INDEX "system_logs_createdAt_idx" ON "system_logs"("createdAt");

-- CreateIndex
CREATE INDEX "system_logs_entityId_idx" ON "system_logs"("entityId");

-- CreateIndex
CREATE INDEX "system_logs_entityType_idx" ON "system_logs"("entityType");

-- CreateIndex
CREATE INDEX "system_logs_type_idx" ON "system_logs"("type");

-- CreateIndex
CREATE INDEX "system_logs_userId_idx" ON "system_logs"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "travelers_email_key" ON "travelers"("email");

-- CreateIndex
CREATE INDEX "idx_travelers_created_at" ON "travelers"("created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_travelers_email" ON "travelers"("email");

-- CreateIndex
CREATE INDEX "idx_travelers_email_verified" ON "travelers"("email_verified");

-- CreateIndex
CREATE INDEX "idx_travelers_status" ON "travelers"("status");

-- CreateIndex
CREATE INDEX "idx_travelers_timing" ON "travelers"("timing");

-- CreateIndex
CREATE INDEX "idx_travelers_verification_token" ON "travelers"("verification_token");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_userId_key" ON "user_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE UNIQUE INDEX "vendors_email_key" ON "vendors"("email");

-- CreateIndex
CREATE INDEX "idx_vendors_city" ON "vendors"("city");

-- CreateIndex
CREATE INDEX "idx_vendors_country" ON "vendors"("country");

-- CreateIndex
CREATE INDEX "idx_vendors_created_at" ON "vendors"("created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_vendors_email" ON "vendors"("email");

-- CreateIndex
CREATE INDEX "idx_vendors_email_verified" ON "vendors"("email_verified");

-- CreateIndex
CREATE INDEX "idx_vendors_phone_number" ON "vendors"("phone_number");

-- CreateIndex
CREATE INDEX "idx_vendors_priority_tier" ON "vendors"("priority_tier");

-- CreateIndex
CREATE INDEX "idx_vendors_role" ON "vendors"("role");

-- CreateIndex
CREATE INDEX "idx_vendors_scale" ON "vendors"("scale");

-- CreateIndex
CREATE INDEX "idx_vendors_status" ON "vendors"("status");

-- CreateIndex
CREATE INDEX "idx_vendors_verification_token" ON "vendors"("verification_token");

-- CreateIndex
CREATE INDEX "idx_vendors_verified" ON "vendors"("verified");

-- CreateIndex
CREATE INDEX "vendors_amenities_gin_idx" ON "vendors" USING GIN ("amenities");

-- CreateIndex
CREATE INDEX "vendors_services_gin_idx" ON "vendors" USING GIN ("services_offered");

-- CreateIndex
CREATE UNIQUE INDEX "waitlist_entries_email_key" ON "waitlist_entries"("email");

-- CreateIndex
CREATE INDEX "waitlist_entries_createdAt_idx" ON "waitlist_entries"("createdAt");

-- CreateIndex
CREATE INDEX "waitlist_entries_email_idx" ON "waitlist_entries"("email");

-- CreateIndex
CREATE INDEX "wishlist_items_userId_idx" ON "wishlist_items"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "wishlist_items_userId_packageId_key" ON "wishlist_items"("userId", "packageId");

-- AddForeignKey
ALTER TABLE "account_lockouts" ADD CONSTRAINT "account_lockouts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "packages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payment_disputes" ADD CONSTRAINT "payment_disputes_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payment_disputes" ADD CONSTRAINT "payment_disputes_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "packages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "security_events" ADD CONSTRAINT "security_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

