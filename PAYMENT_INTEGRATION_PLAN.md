# Payment Integration Architecture

## 🎯 Overview
OneDettyDecember will support dual payment processing with Stripe (primary) and Paystack (secondary) to serve global and African markets respectively.

## 🏗️ Architecture

### Payment Flow
1. **User selects package** → Package details page
2. **Clicks "Book Now"** → Payment selection modal
3. **Chooses payment method** → Stripe (Global) or Paystack (Africa)
4. **Enters payment details** → Secure payment form
5. **Payment processed** → Confirmation & booking created
6. **Email confirmation** → Receipt & booking details

### Database Schema (Prisma)
```prisma
model Payment {
  id                String   @id @default(cuid())
  bookingId         String   @unique
  booking           Booking  @relation(fields: [bookingId], references: [id])
  
  amount            Float
  currency          String   @default("USD")
  status            PaymentStatus
  provider          PaymentProvider
  
  // Provider-specific IDs
  stripePaymentIntentId  String?
  paystackReference      String?
  
  // Metadata
  providerResponse  Json?
  failureReason     String?
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

enum PaymentStatus {
  PENDING
  PROCESSING
  SUCCEEDED
  FAILED
  CANCELLED
  REFUNDED
}

enum PaymentProvider {
  STRIPE
  PAYSTACK
}
```

## 🔌 API Endpoints

### Create Payment Intent
```typescript
// POST /api/payments/create-intent
{
  bookingId: string,
  provider: 'stripe' | 'paystack',
  amount: number,
  currency: string
}
```

### Webhook Handlers
```typescript
// POST /api/payments/webhook/stripe
// POST /api/payments/webhook/paystack
```

## 🌍 Provider Selection Logic

### Automatic Detection
```typescript
const getRecommendedProvider = (userLocation: string, currency: string) => {
  const africanCountries = ['NG', 'GH', 'KE', 'ZA', 'EG'];
  
  if (africanCountries.includes(userLocation) || currency === 'NGN') {
    return 'paystack';
  }
  
  return 'stripe';
};
```
