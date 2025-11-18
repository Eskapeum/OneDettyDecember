#!/bin/bash

# OneDettyDecember - Vercel Environment Variables Setup
# This script adds all necessary environment variables to Vercel

echo "🚀 Setting up Vercel environment variables..."

# Supabase Configuration
echo "📦 Adding Supabase configuration..."
vercel env add NEXT_PUBLIC_SUPABASE_URL production <<< "https://bxhxehnwlyqhtmuvjrjh.supabase.co"
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production <<< "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4aHhlaG53bHlxaHRtdXZqcmpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMDc1MjMsImV4cCI6MjA3ODY4MzUyM30.l9Cb0sEDjYdB3STpQKQK6kifTEhffpfpGOo--iBNag0"
vercel env add SUPABASE_SERVICE_ROLE_KEY production <<< "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4aHhlaG53bHlxaHRtdXZqcmpoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzEwNzUyMywiZXhwIjoyMDc4NjgzNTIzfQ.zfshLfMAVQ3rc1IMxsjAT90fSe5xCwj-kDL3TjlweEE"

# Database URLs (will need password from user)
echo "⚠️  DATABASE_URL and DIRECT_URL require database password"
echo "Please add these manually using:"
echo "  vercel env add DATABASE_URL production"
echo "  vercel env add DIRECT_URL production"

# NextAuth Configuration
echo "🔐 Adding NextAuth configuration..."
vercel env add NEXTAUTH_URL production <<< "https://onedettydecember-platform-g985oze8g-eskapeums-projects.vercel.app"
echo "⚠️  NEXTAUTH_SECRET requires a secret - generate with: openssl rand -base64 32"
echo "Please add manually using:"
echo "  vercel env add NEXTAUTH_SECRET production"

# Email Configuration
echo "📧 Email configuration (Resend)..."
vercel env add EMAIL_FROM production <<< "hello@onedettydecember.com"
echo "⚠️  RESEND_API_KEY requires API key from Resend"
echo "Please add manually using:"
echo "  vercel env add RESEND_API_KEY production"

# Feature Flags
echo "🚩 Adding feature flags..."
vercel env add NEXT_PUBLIC_ENABLE_AI_PLANNER production <<< "false"
vercel env add NEXT_PUBLIC_ENABLE_MARKETPLACE production <<< "false"
vercel env add NEXT_PUBLIC_ENABLE_CAR_RENTALS production <<< "false"

echo "✅ Basic environment variables added!"
echo ""
echo "⚠️  MANUAL SETUP REQUIRED:"
echo "1. DATABASE_URL - Supabase connection string with password"
echo "2. DIRECT_URL - Supabase direct connection with password"
echo "3. NEXTAUTH_SECRET - Generate with: openssl rand -base64 32"
echo "4. RESEND_API_KEY - Get from Resend dashboard"
echo "5. STRIPE_SECRET_KEY - Get from Stripe dashboard"
echo "6. PAYSTACK_SECRET_KEY - Get from Paystack dashboard"
echo "7. SENTRY_AUTH_TOKEN - Get from Sentry dashboard"
echo "8. NEXT_PUBLIC_POSTHOG_KEY - Get from PostHog dashboard"

