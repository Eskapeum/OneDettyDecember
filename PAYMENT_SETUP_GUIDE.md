# Payment Provider Setup Guide

## 🎯 Overview
This guide helps you set up Stripe and Paystack for OneDettyDecember payment processing.

## 🔧 Stripe Setup (Primary Payment Provider)

### Step 1: Create/Access Stripe Account
1. Go to https://stripe.com
2. Sign up for a new account OR log in to existing account
3. Complete business verification (can be done later for testing)

### Step 2: Get Test API Keys
1. Navigate to **Dashboard → Developers → API keys**
2. Ensure you're in **Test mode** (toggle in left sidebar)
3. Copy the following keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### Step 3: Update Environment Variables
Replace the placeholders in `landing-page/.env.local`:
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_[YOUR_ACTUAL_KEY]
STRIPE_SECRET_KEY=sk_test_[YOUR_ACTUAL_KEY]
```

## 💳 Paystack Setup (Secondary Payment Provider)

### Step 1: Create Paystack Account
1. Go to https://paystack.com
2. Sign up for a new account
3. Verify your email address

### Step 2: Get Test API Keys
1. Navigate to **Settings → API Keys & Webhooks**
2. Ensure you're in **Test mode**
3. Copy the following keys:
   - **Public key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### Step 3: Update Environment Variables
Replace the placeholders in `landing-page/.env.local`:
```bash
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_[YOUR_ACTUAL_KEY]
PAYSTACK_SECRET_KEY=sk_test_[YOUR_ACTUAL_KEY]
```

## 🧪 Testing

### Stripe Test Cards
- **Success**: 4242 4242 4242 4242
- **Declined**: 4000 0000 0000 0002

### Paystack Test Cards
- **Success**: 4084 0840 8408 4081
- **Insufficient Funds**: 4084 0840 8408 4093

## ✅ Checklist
- [ ] Stripe account created/accessed
- [ ] Stripe test keys obtained
- [ ] Paystack account created
- [ ] Paystack test keys obtained
- [ ] Environment variables updated
