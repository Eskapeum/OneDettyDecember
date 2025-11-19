# Sprint 4: Payment Component Specifications

**Developer:** Dev 7 (TOBI) - Design System & UI/UX Lead
**Sprint:** 4 of 13
**Focus:** Payment UI Components (Card Input, Icons, Modals)
**Date:** November 18, 2025

---

## 🎯 Component Overview

This document specifies the three critical payment UI components for Sprint 4:
1. **CardInput** - Secure card entry with validation
2. **PaymentIcons** - Payment method logos and visual indicators
3. **PaymentModal** - Payment flow modals and overlays

All components are PCI-compliant, mobile-first, accessible, and integrate with both Stripe and Paystack.

---

## 💳 CardInput Component

### Purpose
Provide a secure, user-friendly card entry experience that works with both Stripe Elements and Paystack's payment form, with real-time validation and formatting.

### Component Architecture

```
CardInput
├── CardNumberInput (with auto-formatting)
├── ExpiryInput (MM/YY validation)
├── CVVInput (secure, masked)
├── CardholderNameInput (optional)
├── CardBrandDetector (Visa, Mastercard, etc.)
├── ValidationMessages (real-time errors)
└── SaveCardCheckbox (optional)
```

### Desktop Layout (Wireframe)

```
┌──────────────────────────────────────────────────┐
│  Payment Details                                 │
├──────────────────────────────────────────────────┤
│                                                  │
│  Card Number                                     │
│  ┌─────────────────────────────────────────┐    │
│  │ 4242 4242 4242 4242              [VISA] │    │ ← Auto-detect card type
│  └─────────────────────────────────────────┘    │
│                                                  │
│  ┌──────────────────┐  ┌─────────────────┐     │
│  │ Expiry           │  │ CVV             │     │
│  │ MM / YY          │  │ •••             │     │ ← Masked CVV
│  └──────────────────┘  └─────────────────┘     │
│                                                  │
│  Cardholder Name (Optional)                     │
│  ┌─────────────────────────────────────────┐    │
│  │ John Doe                                │    │
│  └─────────────────────────────────────────┘    │
│                                                  │
│  ☐ Save card for future purchases               │
│                                                  │
│  🔒 Your payment information is encrypted       │
│      and secure                                 │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Mobile Layout (Wireframe)

```
┌─────────────────────────┐
│  Payment Details        │
├─────────────────────────┤
│                         │
│  Card Number            │
│  ┌────────────────────┐ │
│  │ 4242 4242 4242    │ │
│  │            [VISA] │ │ ← 48px height
│  └────────────────────┘ │
│                         │
│  Expiry     CVV         │
│  ┌────────┐ ┌────────┐ │
│  │ 12/25  │ │  •••   │ │ ← Side by side
│  └────────┘ └────────┘ │
│                         │
│  Name on Card           │
│  ┌────────────────────┐ │
│  │ John Doe           │ │
│  └────────────────────┘ │
│                         │
│  ☐ Save card           │
│                         │
│  🔒 Secure payment      │
│                         │
└─────────────────────────┘
```

### Component Props

```typescript
interface CardInputProps {
  // Integration
  provider: 'stripe' | 'paystack'
  stripeElements?: StripeElements // If using Stripe
  paystackPublicKey?: string // If using Paystack

  // Values (controlled)
  cardNumber?: string
  expiry?: string
  cvv?: string
  cardholderName?: string
  saveCard?: boolean

  // Callbacks
  onChange?: (data: CardData) => void
  onValidationChange?: (isValid: boolean) => void
  onCardBrandChange?: (brand: CardBrand) => void
  onError?: (error: CardError) => void

  // UI Options
  showCardholderName?: boolean
  showSaveCard?: boolean
  showSecurityBadge?: boolean
  splitExpiryAndCVV?: boolean // Side by side vs stacked
  autoFocus?: boolean

  // Validation
  validateOnChange?: boolean // Default: true
  validateOnBlur?: boolean // Default: true
  requiredFields?: ('number' | 'expiry' | 'cvv' | 'name')[]

  // Styling
  vertical?: Vertical
  className?: string
  inputClassName?: string
  errorClassName?: string

  // Accessibility
  cardNumberLabel?: string
  expiryLabel?: string
  cvvLabel?: string
  nameLabel?: string
}

interface CardData {
  cardNumber: string
  expiry: string // MM/YY
  cvv: string
  cardholderName?: string
  saveCard: boolean
  cardBrand?: CardBrand
  isValid: boolean
}

type CardBrand =
  | 'visa'
  | 'mastercard'
  | 'amex'
  | 'discover'
  | 'diners'
  | 'jcb'
  | 'unionpay'
  | 'verve' // Nigerian
  | 'unknown'

interface CardError {
  field: 'number' | 'expiry' | 'cvv' | 'name'
  message: string
  code: string
}
```

### Card Number Formatting & Validation

```typescript
// Auto-formatting as user types
Input: "4242424242424242"
Display: "4242 4242 4242 4242"

Input: "378282246310005" (Amex)
Display: "3782 822463 10005" (Amex format)

// Real-time validation
┌─────────────────────────────────────┐
│ 4242 4242 4242 424              [✓] │ ← Valid, green checkmark
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 1234 5678 9012 3456              [✕] │ ← Invalid, red X
│ Invalid card number                  │ ← Error message
└─────────────────────────────────────┘

// Card brand detection
Visa:       4xxx xxxx xxxx xxxx
Mastercard: 5xxx xxxx xxxx xxxx
Amex:       3xxx xxxxxx xxxxx
Verve:      5061 xxxx xxxx xxxx (Nigerian)
```

### Expiry Validation

```typescript
// Auto-formatting
Input: "1225"
Display: "12 / 25"

// Validation states
✓ Valid:   12/25 (future date)
✕ Expired: 11/23 (past date)
✕ Invalid: 13/25 (invalid month)
✕ Invalid: 00/25 (invalid month)

// Error messages
"Card has expired"
"Invalid expiry month (1-12)"
"Invalid expiry year"
```

### CVV Handling

```typescript
// Masked input
Display: •••

// Length by card type
Visa/MC:    3 digits
Amex:       4 digits (CID)

// No storing
// CVV should NEVER be stored or logged (PCI requirement)
// Component should clear CVV on unmount

// Validation
✓ Valid:   123 (for Visa/MC)
✓ Valid:   1234 (for Amex)
✕ Invalid: 12 (too short)
✕ Invalid: 12345 (too long)
```

### States & Interactions

**1. Default State (Empty)**
```
┌─────────────────────────────┐
│ Card Number                 │
│ ┌─────────────────────────┐ │
│ │ 0000 0000 0000 0000     │ │ ← Placeholder
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

**2. Typing (Active)**
```
┌─────────────────────────────┐
│ Card Number                 │
│ ┌─────────────────────────┐ │
│ │ 4242 4242 4242 ▊        │ │ ← Cursor
│ └─────────────────────────┘ │
└─────────────────────────────┘
Animation: Smooth cursor blink, 2px border highlight
```

**3. Valid (Success)**
```
┌─────────────────────────────┐
│ Card Number              ✓  │ ← Green checkmark
│ ┌─────────────────────────┐ │
│ │ 4242 4242 4242 4242 [V] │ │ ← Visa logo
│ └─────────────────────────┘ │
└─────────────────────────────┘
Animation: Checkmark fades in (200ms)
Border: Green
```

**4. Invalid (Error)**
```
┌─────────────────────────────┐
│ Card Number              ✕  │ ← Red X
│ ┌─────────────────────────┐ │
│ │ 1234 5678 9012 3456     │ │
│ └─────────────────────────┘ │
│ ⚠ Invalid card number       │ ← Error message
└─────────────────────────────┘
Animation: Shake (400ms), error fades in
Border: Red
```

**5. Focus State**
```
┌─────────────────────────────┐
│ ┌─────────────────────────┐ │
│ │ 4242 4242 ▊             │ │ ← 2px border
│ └─────────────────────────┘ │
└─────────────────────────────┘
Border color: Vertical color
Box shadow: Ring effect
```

**6. Disabled State**
```
┌─────────────────────────────┐
│ ┌─────────────────────────┐ │
│ │ 4242 4242 4242 4242     │ │ ← Opacity 0.5
│ └─────────────────────────┘ │
└─────────────────────────────┘
Cursor: not-allowed
Background: Grayed out
```

### Card Brand Icons

```
Position: Right side of card number input

Size: 24×16px (standard credit card aspect ratio)

Cards Supported:
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│ VISA │ │  MC  │ │ AMEX │ │ DISC │
└──────┘ └──────┘ └──────┘ └──────┘

┌──────┐ ┌──────┐ ┌──────┐
│ VERVE│ │ JCB  │ │ UNION│
└──────┘ └──────┘ └──────┘

Display:
- Show detected brand in full color
- Show other brands in grayscale/faded
- Animate brand when detected (scale + fade)
```

### Security Features

**PCI Compliance:**
```typescript
// 1. Never log card data
console.log(cardNumber) // ❌ NEVER DO THIS

// 2. Clear sensitive data on unmount
useEffect(() => {
  return () => {
    // Clear CVV and card number from state
    setCardNumber('')
    setCvv('')
  }
}, [])

// 3. Use Stripe/Paystack Elements when possible
// These handle tokenization securely

// 4. No autocomplete for CVV
<input
  type="text"
  inputMode="numeric"
  autoComplete="off" // Important!
  name="cvv"
/>

// 5. Mask CVV immediately
const maskCVV = (value: string) => '•'.repeat(value.length)
```

**Security Badge:**
```
┌─────────────────────────────────┐
│ 🔒 Your payment information is  │
│    encrypted and secure         │
│    PCI DSS Compliant            │
└─────────────────────────────────┘

Position: Below inputs
Color: Neutral gray
Font: Small (12px)
```

### Accessibility

**ARIA Labels:**
```tsx
<div role="group" aria-labelledby="payment-details-title">
  <h3 id="payment-details-title">Payment Details</h3>

  <label htmlFor="card-number">
    Card Number
    <span aria-label="required" className="text-red-500">*</span>
  </label>
  <input
    id="card-number"
    type="text"
    inputMode="numeric"
    autoComplete="cc-number"
    aria-required="true"
    aria-invalid={!isValid}
    aria-describedby={hasError ? 'card-number-error' : undefined}
    maxLength={19} // 16 digits + 3 spaces
  />
  {hasError && (
    <div
      id="card-number-error"
      role="alert"
      aria-live="polite"
    >
      {errorMessage}
    </div>
  )}

  <label htmlFor="card-expiry">
    Expiry Date
    <span className="sr-only">(Format: MM/YY)</span>
  </label>
  <input
    id="card-expiry"
    type="text"
    inputMode="numeric"
    autoComplete="cc-exp"
    placeholder="MM / YY"
    aria-required="true"
    maxLength={7} // MM / YY
  />

  <label htmlFor="card-cvv">
    Security Code (CVV)
    <button
      type="button"
      aria-label="What is CVV?"
      onClick={showCVVHelp}
    >
      ⓘ
    </button>
  </label>
  <input
    id="card-cvv"
    type="text"
    inputMode="numeric"
    autoComplete="off" // PCI requirement
    aria-required="true"
    aria-describedby="cvv-help"
    maxLength={4}
  />
  <div id="cvv-help" className="sr-only">
    The 3 or 4 digit security code on the back of your card
  </div>
</div>
```

**Keyboard Navigation:**
- `Tab`: Navigate between fields
- `Enter`: Submit (if all valid)
- Auto-advance: Move to next field when current is complete
- `Backspace`: Move to previous field if current is empty

**Screen Reader Announcements:**
```tsx
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {cardBrand && `${cardBrand} card detected`}
  {isValid && 'All card details are valid'}
  {error && `Error: ${error.message}`}
</div>
```

---

## 🎨 PaymentIcons Component

### Purpose
Display payment method logos, card brand icons, and payment status indicators consistently across the app.

### Component Architecture

```
PaymentIcons
├── CardBrandIcon (Visa, MC, etc.)
├── PaymentMethodIcon (Stripe, Paystack, ApplePay, etc.)
├── PaymentStatusIcon (pending, success, failed)
└── SecurityBadge (SSL, PCI icons)
```

### Icon Sets

**1. Card Brands**
```
Icons (24×16px standard card ratio):

┌────────┐  Visa
│  VISA  │  Color: #1A1F71 (blue/gold)
└────────┘

┌────────┐  Mastercard
│   MC   │  Color: #EB001B + #F79E1B (red/orange circles)
└────────┘

┌────────┐  American Express
│  AMEX  │  Color: #006FCF (blue)
└────────┘

┌────────┐  Discover
│  DISC  │  Color: #FF6000 (orange)
└────────┘

┌────────┐  Verve (Nigerian)
│  VERVE │  Color: #EE312A (red)
└────────┘

┌────────┐  Unknown/Generic
│  CARD  │  Color: Neutral gray
└────────┘
```

**2. Payment Methods**
```
Icons (32×32px):

┌─────┐  Stripe
│  S  │  Color: #635BFF (purple)
└─────┘

┌─────┐  Paystack
│  PS │  Color: #00C3F7 (cyan)
└─────┘

┌─────┐  Apple Pay
│  🍎 │  Black rounded rectangle
└─────┘

┌─────┐  Google Pay
│  G  │  Multicolor G
└─────┘

┌─────┐  Bank Transfer
│  🏦 │  Bank building icon
└─────┘

┌─────┐  Mobile Money
│  📱 │  Phone with money icon
└─────┘

┌─────┐  USSD
│  *# │  Dial pad icon
└─────┘
```

**3. Status Icons**
```
Icons (20×20px):

┌───┐  Pending
│ ⏱ │  Color: Amber
└───┘

┌───┐  Processing
│ ⟳ │  Color: Blue (spinning)
└───┘

┌───┐  Success
│ ✓ │  Color: Green
└───┘

┌───┐  Failed
│ ✕ │  Color: Red
└───┘

┌───┐  Refunded
│ ↶ │  Color: Orange
└───┘
```

**4. Security Badges**
```
Badges (variable size):

┌──────────┐
│  🔒 SSL  │  Secure connection
└──────────┘

┌──────────────┐
│ PCI DSS      │  Payment card compliance
│ COMPLIANT    │
└──────────────┘

┌──────────────┐
│ 256-bit      │  Encryption badge
│ ENCRYPTION   │
└──────────────┘
```

### Component Props

```typescript
interface PaymentIconsProps {
  // Icon type
  type: 'card-brand' | 'payment-method' | 'status' | 'security'

  // Specific icon
  name: string
  // Card brands: 'visa' | 'mastercard' | 'amex' | 'discover' | 'verve'
  // Payment methods: 'stripe' | 'paystack' | 'apple-pay' | 'google-pay' | 'bank-transfer' | 'mobile-money' | 'ussd'
  // Status: 'pending' | 'processing' | 'success' | 'failed' | 'refunded'
  // Security: 'ssl' | 'pci' | 'encryption'

  // Size
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  // xs: 16px, sm: 20px, md: 24px, lg: 32px, xl: 40px

  // Display
  showLabel?: boolean
  label?: string
  grayscale?: boolean // For inactive/unselected
  animated?: boolean // For processing spinner

  // Styling
  className?: string

  // Accessibility
  ariaLabel?: string
}
```

### Usage Patterns

**Payment Method Selector:**
```
┌─────────────────────────────────────────┐
│  Select Payment Method                  │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────┐  ┌──────────┐            │
│  │   💳     │  │   🍎     │            │
│  │  Card    │  │ Apple Pay│            │ ← Radio selection
│  └──────────┘  └──────────┘            │
│                                         │
│  ┌──────────┐  ┌──────────┐            │
│  │   🏦     │  │   📱     │            │
│  │  Bank    │  │  Mobile  │            │
│  └──────────┘  └──────────┘            │
│                                         │
└─────────────────────────────────────────┘

Selected state:
┌──────────┐
│   💳     │ ← Bold border, vertical color
│  Card    │ ← Highlighted
└──────────┘
```

**Accepted Cards Display:**
```
We accept:
┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐
│VISA│ │ MC │ │AMEX│ │DISC│ │VERV│
└────┘ └────┘ └────┘ └────┘ └────┘
```

**Payment Status:**
```
┌─────────────────────────────┐
│  ✓ Payment Successful       │ ← Green background
│  ₦450,000 charged to Visa   │
│  ending in 4242             │
└─────────────────────────────┘

┌─────────────────────────────┐
│  ✕ Payment Failed           │ ← Red background
│  Please try again           │
└─────────────────────────────┘
```

---

## 🎭 PaymentModal Component

### Purpose
Provide modal overlays for payment flows, confirmations, and status updates with mobile-optimized interactions.

### Component Architecture

```
PaymentModal
├── PaymentProcessingModal (loading state)
├── PaymentSuccessModal (confirmation)
├── PaymentFailedModal (error + retry)
├── PaymentMethodModal (method selection)
├── SecurityConfirmModal (3D Secure, OTP)
└── RefundModal (refund confirmation)
```

### Modal Types

**1. Payment Processing Modal**
```
Desktop:
┌──────────────────────────────────┐
│                                  │
│          ⟳                       │ ← Spinner (animated)
│                                  │
│   Processing Payment...          │
│                                  │
│   Please do not close this       │
│   window or press back           │
│                                  │
│   This may take a few seconds    │
│                                  │
└──────────────────────────────────┘

Mobile (Full screen):
┌─────────────────────────┐
│                         │
│                         │
│         ⟳               │ ← Large spinner
│                         │
│  Processing Payment     │
│                         │
│  Please wait...         │
│                         │
│  Do not close or        │
│  press back             │
│                         │
│                         │
└─────────────────────────┘
```

**2. Payment Success Modal**
```
Desktop:
┌──────────────────────────────────┐
│              ✓                   │ ← Large checkmark (green)
│                                  │
│   Payment Successful!            │
│                                  │
│   ₦450,000.00                    │
│   Visa ending in 4242            │
│                                  │
│   Booking confirmed              │
│   Reference: #ODD123456          │
│                                  │
│   [View Booking]  [Download PDF] │
└──────────────────────────────────┘

Mobile:
┌─────────────────────────┐
│         ✓               │ ← Animated checkmark
│                         │
│  Payment Successful!    │
│                         │
│  ₦450,000.00            │
│  Visa •••• 4242         │
│                         │
│  Booking #ODD123456     │
│                         │
│  ───────────────────    │
│                         │
│  [View Booking]         │
│  [Download Receipt]     │
│                         │
└─────────────────────────┘
```

**3. Payment Failed Modal**
```
Desktop:
┌──────────────────────────────────┐
│              ✕                   │ ← Large X (red)
│                                  │
│   Payment Failed                 │
│                                  │
│   Your card was declined         │
│                                  │
│   Error code: card_declined      │
│   Please check your card         │
│   details and try again          │
│                                  │
│   [Try Different Card] [Retry]   │
│   [Contact Support]              │
└──────────────────────────────────┘

Mobile:
┌─────────────────────────┐
│         ✕               │
│                         │
│  Payment Failed         │
│                         │
│  Card was declined      │
│                         │
│  Error: card_declined   │
│                         │
│  Please check your      │
│  card details           │
│                         │
│  ───────────────────    │
│                         │
│  [Try Again]            │
│  [Use Different Card]   │
│  [Get Help]             │
│                         │
└─────────────────────────┘
```

**4. 3D Secure / OTP Modal**
```
Mobile (Full screen):
┌─────────────────────────┐
│  ◀ Back                 │
│                         │
│  Security Verification  │
│                         │
│  Enter the OTP sent to  │
│  your phone ending in   │
│  ****7890               │
│                         │
│  ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐  │ ← OTP inputs
│  │ │ │ │ │ │ │ │ │ │  │
│  └─┘ └─┘ └─┘ └─┘ └─┘  │
│                         │
│  Resend code in 0:45    │ ← Countdown timer
│                         │
│  [Verify]               │
│                         │
└─────────────────────────┘
```

**5. Payment Method Selection Modal (Mobile)**
```
Bottom Sheet:
┌─────────────────────────┐
│  ━━━━                   │ ← Drag handle
│  Select Payment         │
│  ─────────────────────  │
│                         │
│  💳 Card Payment        │ ← 48px height each
│  Visa, Mastercard, Amex │
│  ─────────────────────  │
│                         │
│  🍎 Apple Pay           │
│  Fast & secure          │
│  ─────────────────────  │
│                         │
│  🏦 Bank Transfer       │
│  Direct from your bank  │
│  ─────────────────────  │
│                         │
│  📱 Mobile Money        │
│  MTN, Airtel, Glo       │
│                         │
└─────────────────────────┘
```

### Component Props

```typescript
interface PaymentModalProps {
  // Modal type
  type:
    | 'processing'
    | 'success'
    | 'failed'
    | 'method-select'
    | 'security'
    | 'refund'

  // Control
  open: boolean
  onClose?: () => void

  // Payment data
  amount?: number
  currency?: string
  paymentMethod?: string // "Visa •••• 4242"
  reference?: string
  errorCode?: string
  errorMessage?: string

  // Success data
  bookingId?: string
  confirmationNumber?: string
  receiptUrl?: string

  // Method selection
  availableMethods?: PaymentMethod[]
  onMethodSelect?: (method: string) => void

  // Security (3D Secure / OTP)
  otpLength?: number
  onOTPSubmit?: (otp: string) => void
  onResendOTP?: () => void
  resendCountdown?: number

  // Actions
  onRetry?: () => void
  onViewBooking?: () => void
  onDownloadReceipt?: () => void
  onContactSupport?: () => void

  // UI
  showCloseButton?: boolean
  preventClose?: boolean // For processing
  fullScreen?: boolean // Mobile
  vertical?: Vertical

  // Animation
  animateEntrance?: boolean
  animateSuccess?: boolean // Confetti, checkmark animation
}

interface PaymentMethod {
  id: string
  name: string
  icon: string
  description: string
  enabled: boolean
  processing?: boolean
}
```

### Modal Animations

```css
/* Entrance */
.modal-enter {
  opacity: 0;
  transform: scale(0.95) translateY(20px);
}

.modal-enter-active {
  opacity: 1;
  transform: scale(1) translateY(0);
  transition: all 300ms ease-out;
}

/* Success Checkmark */
@keyframes successCheckmark {
  0% {
    transform: scale(0) rotate(-45deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(0deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.success-checkmark {
  animation: successCheckmark 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Processing Spinner */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.processing-spinner {
  animation: spin 1s linear infinite;
}

/* Failed Shake */
@keyframes errorShake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
  20%, 40%, 60%, 80% { transform: translateX(10px); }
}

.failed-icon {
  animation: errorShake 600ms ease-in-out;
}
```

### Accessibility

**Focus Management:**
```typescript
// Trap focus in modal
useEffect(() => {
  if (open) {
    const modal = modalRef.current
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // Focus first element
    firstElement?.focus()

    // Trap tab
    const handleTab = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    modal.addEventListener('keydown', handleTab)
    return () => modal.removeEventListener('keydown', handleTab)
  }
}, [open])
```

**ARIA Attributes:**
```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Payment Processing</h2>
  <p id="modal-description">Please wait while we process your payment</p>

  {/* Live region for status updates */}
  <div
    role="status"
    aria-live="polite"
    aria-atomic="true"
    className="sr-only"
  >
    {statusMessage}
  </div>
</div>
```

**Keyboard Controls:**
- `Escape`: Close modal (unless prevented)
- `Tab`: Navigate focusable elements (trapped in modal)
- `Enter`: Activate primary action
- `Space`: Select/toggle options

---

## 🎨 Design System Integration

### Using Design Tokens

```tsx
import { colors, spacing, borderRadius, shadows } from '@/lib/design-tokens'
import { getVerticalColor } from '@/lib/vertical-theme'
import { getButtonClasses, getBadgeClasses } from '@/lib/component-variants'
import { touchFriendly } from '@/lib/responsive-utilities'

// Card input styling
const inputClasses = classNames(
  touchFriendly.inputHeight, // 48px height
  'border-2 rounded-lg px-4',
  'transition-all duration-200',
  'focus:ring-4 focus:ring-opacity-20',
  isValid && 'border-green-500',
  hasError && 'border-red-500',
  !isValid && !hasError && 'border-neutral-300'
)

// Payment method button
const methodButtonClasses = getButtonClasses({
  size: 'lg',
  variant: isSelected ? 'solid' : 'outline',
  vertical,
  fullWidth: true
})
```

### Vertical Theming

```tsx
// Payment flows themed by package vertical
<PaymentModal
  type="success"
  vertical="events" // Afrobeat Red theme
  {...props}
/>

<CardInput
  vertical="stays" // Coastal Emerald theme
  {...props}
/>
```

---

## 📱 Mobile Optimization

### Touch Targets
- Input fields: 48px height minimum
- Buttons: 44×44px minimum
- Payment method tiles: 56px height minimum
- OTP input boxes: 48×48px

### Mobile-Specific Patterns

**Input Mode:**
```tsx
// Numeric keyboard for card entry
<input
  type="text"
  inputMode="numeric" // Shows number pad on mobile
  pattern="[0-9]*" // iOS Safari
/>
```

**Auto-advance:**
```typescript
// Move to next field when complete
const handleCardNumberChange = (value: string) => {
  setCardNumber(value)
  if (value.replace(/\s/g, '').length === 16) {
    expiryInputRef.current?.focus()
  }
}
```

---

## ⚡ Performance

### Lazy Loading
```tsx
// Load payment modals only when needed
const PaymentModal = lazy(() => import('./PaymentModal'))

<Suspense fallback={<PaymentModalSkeleton />}>
  {showPaymentModal && <PaymentModal {...props} />}
</Suspense>
```

### Debouncing
```tsx
// Debounce card validation
const debouncedValidate = useMemo(
  () => debounce((cardNumber: string) => {
    validateCardNumber(cardNumber)
  }, 300),
  []
)
```

---

## 🧪 Testing Checklist

### CardInput
- [ ] Card number formatting works (Visa, MC, Amex)
- [ ] Card brand detection works
- [ ] Expiry validation (MM/YY)
- [ ] CVV masking works
- [ ] Real-time validation
- [ ] Error messages display
- [ ] Auto-advance to next field
- [ ] Keyboard navigation works
- [ ] Screen reader announces errors
- [ ] Touch targets adequate (48px)
- [ ] Dark mode works
- [ ] PCI compliance (no logging, autocomplete off for CVV)

### PaymentIcons
- [ ] All card brands render
- [ ] All payment methods render
- [ ] Status icons display correctly
- [ ] Grayscale mode works
- [ ] Animations work (spinner)
- [ ] Icons scale properly
- [ ] Labels display when enabled
- [ ] Accessible (aria-label)

### PaymentModal
- [ ] Processing modal shows
- [ ] Success modal animates
- [ ] Failed modal shows errors
- [ ] Method selection works
- [ ] 3D Secure/OTP flow works
- [ ] Focus trap works
- [ ] Keyboard navigation works
- [ ] Cannot close during processing
- [ ] Mobile full-screen works
- [ ] Screen reader announces status
- [ ] Touch targets adequate

---

**Status:** 💳 **PAYMENT COMPONENTS SPECIFIED**

These specifications provide the foundation for implementing secure, accessible payment UI components in Sprint 4.

**Next:** Create mobile payment UX patterns and implementation guide!

**Design System & UI/UX - Dev 7 (TOBI)** 💳🎨✨
