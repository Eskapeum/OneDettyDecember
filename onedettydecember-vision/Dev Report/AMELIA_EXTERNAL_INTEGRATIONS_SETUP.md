# AMELIA - EXTERNAL INTEGRATIONS SETUP GUIDE

**Developer:** Amelia (Lead Dev)  
**Date:** November 18, 2025  
**Task:** External Services Integration  
**Time:** 11:15 AM - 12:00 PM EST  
**Status:** 📋 **SETUP GUIDE CREATED**

---

## 📋 INTEGRATIONS OVERVIEW

**Total Services:** 5  
**Purpose:** Payment processing, email, monitoring, analytics

---

## 1️⃣ STRIPE (INTERNATIONAL PAYMENTS)

### **Purpose:**
- Process international credit/debit card payments
- Handle subscriptions and recurring billing
- Manage refunds and disputes

### **Setup Steps:**

#### **A. Create Stripe Account**
1. Go to https://stripe.com
2. Sign up with: hello@onedettydecember.com
3. Complete business verification
4. Activate account

#### **B. Get API Keys**
1. Navigate to: Developers → API Keys
2. Copy **Publishable Key** (starts with `pk_test_`)
3. Copy **Secret Key** (starts with `sk_test_`)

#### **C. Set Up Webhooks**
1. Navigate to: Developers → Webhooks
2. Add endpoint: `https://onedettydecember-platform-g985oze8g-eskapeums-projects.vercel.app/api/webhooks/stripe`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy **Webhook Secret** (starts with `whsec_`)

#### **D. Add to Vercel**
```bash
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
vercel env add STRIPE_SECRET_KEY production
vercel env add STRIPE_WEBHOOK_SECRET production
```

#### **E. Test Mode**
- Use test mode initially
- Switch to live mode before launch
- Test cards: https://stripe.com/docs/testing

---

## 2️⃣ PAYSTACK (NIGERIA/GHANA PAYMENTS)

### **Purpose:**
- Process local payments in Nigeria (NGN)
- Process local payments in Ghana (GHS)
- Support mobile money, bank transfers, cards

### **Setup Steps:**

#### **A. Create Paystack Account**
1. Go to https://paystack.com
2. Sign up with: hello@onedettydecember.com
3. Complete business verification (Nigeria or Ghana)
4. Activate account

#### **B. Get API Keys**
1. Navigate to: Settings → API Keys & Webhooks
2. Copy **Public Key** (starts with `pk_test_`)
3. Copy **Secret Key** (starts with `sk_test_`)

#### **C. Set Up Webhooks**
1. Navigate to: Settings → API Keys & Webhooks
2. Add webhook URL: `https://onedettydecember-platform-g985oze8g-eskapeums-projects.vercel.app/api/webhooks/paystack`
3. Select events:
   - `charge.success`
   - `charge.failed`
   - `transfer.success`
   - `transfer.failed`

#### **D. Add to Vercel**
```bash
vercel env add NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY production
vercel env add PAYSTACK_SECRET_KEY production
```

#### **E. Test Mode**
- Use test mode initially
- Test cards: https://paystack.com/docs/payments/test-payments

---

## 3️⃣ RESEND (EMAIL SERVICE)

### **Purpose:**
- Send transactional emails (confirmations, receipts)
- Send marketing emails (newsletters, promotions)
- Track email delivery and opens

### **Setup Steps:**

#### **A. Create Resend Account**
1. Go to https://resend.com
2. Sign up with: hello@onedettydecember.com
3. Verify email address

#### **B. Add Domain**
1. Navigate to: Domains → Add Domain
2. Add domain: `onedettydecember.com`
3. Add DNS records (provided by Resend):
   - SPF record
   - DKIM record
   - DMARC record
4. Verify domain

#### **C. Get API Key**
1. Navigate to: API Keys
2. Create new API key
3. Name: "OneDettyDecember Production"
4. Copy API key (starts with `re_`)

#### **D. Add to Vercel**
```bash
vercel env add RESEND_API_KEY production
# EMAIL_FROM already added
```

#### **E. Test Email**
```bash
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "hello@onedettydecember.com",
    "to": "test@example.com",
    "subject": "Test Email",
    "html": "<p>Test email from OneDettyDecember</p>"
  }'
```

---

## 4️⃣ SENTRY (ERROR MONITORING)

### **Purpose:**
- Track JavaScript errors in production
- Monitor API errors and exceptions
- Get real-time error alerts

### **Setup Steps:**

#### **A. Create Sentry Account**
1. Go to https://sentry.io
2. Sign up with: hello@onedettydecember.com
3. Create organization: "OneDettyDecember"

#### **B. Create Project**
1. Click: Create Project
2. Platform: Next.js
3. Project name: "onedettydecember-platform"
4. Alert frequency: On every new issue

#### **C. Get DSN**
1. Navigate to: Settings → Projects → onedettydecember-platform
2. Navigate to: Client Keys (DSN)
3. Copy **DSN** (starts with `https://`)

#### **D. Get Auth Token**
1. Navigate to: Settings → Account → API → Auth Tokens
2. Create new token
3. Scopes: `project:read`, `project:write`, `project:releases`
4. Copy auth token

#### **E. Add to Vercel**
```bash
vercel env add NEXT_PUBLIC_SENTRY_DSN production
vercel env add SENTRY_AUTH_TOKEN production
```

#### **F. Install Sentry**
```bash
cd platform
npx @sentry/wizard@latest -i nextjs
```

---

## 5️⃣ POSTHOG (ANALYTICS)

### **Purpose:**
- Track user behavior and events
- Analyze conversion funnels
- A/B testing and feature flags

### **Setup Steps:**

#### **A. Create PostHog Account**
1. Go to https://posthog.com
2. Sign up with: hello@onedettydecember.com
3. Create organization: "OneDettyDecember"

#### **B. Create Project**
1. Click: Create Project
2. Project name: "OneDettyDecember Platform"
3. Select: Web (JavaScript)

#### **C. Get Project API Key**
1. Navigate to: Project Settings
2. Copy **Project API Key** (starts with `phc_`)
3. Copy **Host URL** (usually `https://app.posthog.com`)

#### **D. Add to Vercel**
```bash
vercel env add NEXT_PUBLIC_POSTHOG_KEY production
vercel env add NEXT_PUBLIC_POSTHOG_HOST production
```

#### **E. Install PostHog**
```bash
cd platform
npm install posthog-js
```

---

## 📊 INTEGRATION CHECKLIST

| Service | Account Created | API Keys Retrieved | Vercel Configured | Tested |
|---------|----------------|-------------------|-------------------|--------|
| Stripe | ⏸️ Pending | ⏸️ Pending | ⏸️ Pending | ⏸️ Pending |
| Paystack | ⏸️ Pending | ⏸️ Pending | ⏸️ Pending | ⏸️ Pending |
| Resend | ⏸️ Pending | ⏸️ Pending | ⏸️ Pending | ⏸️ Pending |
| Sentry | ⏸️ Pending | ⏸️ Pending | ⏸️ Pending | ⏸️ Pending |
| PostHog | ⏸️ Pending | ⏸️ Pending | ⏸️ Pending | ⏸️ Pending |

---

## 🔐 SECURITY NOTES

### **API Key Storage:**
- ✅ Store in Vercel environment variables (encrypted)
- ✅ Never commit to Git
- ✅ Use different keys for test/production
- ✅ Rotate keys regularly

### **Webhook Security:**
- ✅ Verify webhook signatures
- ✅ Use HTTPS only
- ✅ Implement rate limiting
- ✅ Log all webhook events

---

## 📝 NEXT STEPS

1. **Create Service Accounts** (30 min)
   - Stripe account
   - Paystack account
   - Resend account
   - Sentry account
   - PostHog account

2. **Retrieve API Keys** (20 min)
   - Get all API keys from dashboards
   - Document keys securely

3. **Configure Vercel** (15 min)
   - Add all environment variables
   - Verify encryption

4. **Test Integrations** (30 min)
   - Test Stripe payment
   - Test Paystack payment
   - Send test email
   - Trigger test error
   - Track test event

5. **Set Up Webhooks** (20 min)
   - Configure Stripe webhooks
   - Configure Paystack webhooks
   - Test webhook delivery

---

**Report Filed:** November 18, 2025 - 11:45 AM EST  
**Filed By:** Amelia (Lead Dev)  
**Status:** 📋 **SETUP GUIDE COMPLETE - READY FOR ACCOUNT CREATION**

