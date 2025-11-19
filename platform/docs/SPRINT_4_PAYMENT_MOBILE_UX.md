# Sprint 4: Mobile Payment Flow UX

**Developer:** Dev 7 (TOBI) - Design System & UI/UX Lead
**Sprint:** 4 of 13
**Focus:** Mobile-First Payment Experience
**Date:** November 18, 2025

---

## 💳 Mobile Payment Philosophy

Payment is the highest-friction point in the user journey. On mobile, where typing is harder and trust is lower, every interaction must be optimized for speed, security, and confidence.

### Mobile Payment Context
- **Primary Device:** Mobile phones (375px - 428px width)
- **User Intent:** High purchase intent, but high abandonment risk
- **Connection:** Variable (3G/4G affects payment processing)
- **Environment:** On-the-go, possibly distracted, security-conscious
- **Friction Points:** Form filling, trust, 3D Secure redirects, OTP entry

### Key Principles

**1. Minimize Typing:**
- Auto-format card numbers
- Auto-detect card type
- Auto-advance to next field
- Support digital wallets (Apple Pay, Google Pay)

**2. Build Trust:**
- Show security badges prominently
- Display payment provider logos
- Encrypt/mask sensitive data immediately
- Clear error messages

**3. Prevent Abandonment:**
- Save progress
- Clear status indicators
- Fast processing (<3s target)
- Easy error recovery

**4. Mobile-First Inputs:**
- Numeric keyboards for card entry
- Large touch targets (48px)
- Smart validation (real-time, not blocking)
- Autocomplete where appropriate

---

## 🎯 Payment Flow Overview

### User Journey

```
1. Review Booking
   ↓
2. Select Payment Method ← You are here
   ↓
3. Enter Payment Details
   ↓
4. Security Verification (3D Secure / OTP)
   ↓
5. Processing (3-5 seconds)
   ↓
6. Success / Failure
   ↓
7. Confirmation / Retry
```

### Flow Principles

**Progressive Trust Building:**
- Show security early and often
- Display accepted payment methods upfront
- Clear pricing breakdown
- Transparent fees

**Immediate Feedback:**
- Real-time card validation
- Live error messages
- Processing status updates
- Clear success/failure states

**Easy Recovery:**
- Save entered data on error
- Offer alternative payment methods
- Clear retry options
- Support contact easily accessible

---

## 📐 Payment Review Screen

### Mobile Wireframe

```
┌─────────────────────────┐
│ ◀ Back    Review Order  │ ← Sticky header
├─────────────────────────┤
│                         │
│  📦 Package Summary     │
│  Luxury Lagos Villa     │
│  Dec 17-20 · 3 nights   │
│  2 adults, 1 child      │
│                         │
│  ─────────────────────  │
│                         │
│  💰 Price Breakdown     │
│  3 nights × ₦450,000    │
│  ₦1,350,000             │
│                         │
│  Service fee            │
│  ₦27,000                │
│                         │
│  Tax (7.5%)             │
│  ₦103,275               │
│                         │
│  ─────────────────────  │
│  Total  ₦1,480,275      │ ← Bold, large
│  ─────────────────────  │
│                         │
│  🔒 Secure Payment      │
│  Your information is    │
│  encrypted and safe     │
│                         │
│  ───────────────────    │
│                         │
│  [Empty space for CTA]  │
│                         │
├─────────────────────────┤
│  Total: ₦1,480,275      │ ← Sticky footer
│  [Proceed to Payment]   │
└─────────────────────────┘
```

### Sticky Elements

**Header:**
```
┌─────────────────────────┐
│ ◀ Back    Review Order  │ ← Always visible
└─────────────────────────┘
```

**Footer (Payment CTA):**
```
┌─────────────────────────┐
│  Total: ₦1,480,275      │
│  [Proceed to Payment]   │ ← Sticky, vertical color
└─────────────────────────┘
```

---

## 💳 Payment Method Selection

### Entry Point

```
After tapping "Proceed to Payment":

Bottom Sheet Slides Up:
┌─────────────────────────┐
│  ━━━━                   │ ← Drag handle
│  Select Payment Method  │
│  ─────────────────────  │
│                         │
│  💳 Card Payment        │ ← 56px height each
│  Visa, Mastercard, Amex │
│  ─────────────────────  │
│                         │
│  🍎 Apple Pay           │
│  Fast & secure          │
│  ─────────────────────  │
│                         │
│  📱 Paystack            │
│  Bank, USSD, Mobile $   │
│  ─────────────────────  │
│                         │
│  🏦 Bank Transfer       │
│  Direct from your bank  │
│  ─────────────────────  │
│                         │
└─────────────────────────┘
```

### Method Tiles

```
Unselected:
┌─────────────────────────┐
│  💳 Card Payment        │ ← Border: neutral-300
│  Visa, Mastercard, Amex │
└─────────────────────────┘

Selected:
┌─────────────────────────┐
│  💳 Card Payment        │ ← Border: vertical-color, 3px
│  Visa, Mastercard, Amex │ ← Background: vertical-color-5%
│                      ✓  │ ← Checkmark
└─────────────────────────┘

Disabled:
┌─────────────────────────┐
│  🏦 Bank Transfer       │ ← Opacity: 0.5
│  Coming soon            │ ← Grayed out
└─────────────────────────┘
```

### Interaction

```
Tap animation:
1. Scale down (0.97) - 50ms
2. Scale up (1) - 100ms
3. Haptic feedback (light)
4. Transition to payment form (300ms slide)
```

---

## 🎴 Card Payment Entry

### Full-Screen Card Form

```
┌─────────────────────────┐
│  ◀ Back    Card Payment │ ← Sticky header
├─────────────────────────┤
│                         │
│  🔒 Secure Payment      │
│  Encrypted by Stripe    │
│                         │
│  ───────────────────    │
│                         │
│  Card Number            │
│  ┌────────────────────┐ │
│  │ 4242 4242 4242    │ │ ← 48px height
│  │            [VISA] │ │ ← Auto-detect brand
│  └────────────────────┘ │
│                         │
│  Expiry     CVV         │
│  ┌────────┐ ┌────────┐ │
│  │ 12/25  │ │  •••   │ │ ← Side by side
│  └────────┘ └────────┘ │
│                         │
│  Name on Card           │
│  ┌────────────────────┐ │
│  │ JOHN DOE           │ │
│  └────────────────────┘ │
│                         │
│  ☐ Save for future     │
│     purchases           │
│                         │
│  ───────────────────    │
│                         │
│  We accept:             │
│  [VISA] [MC] [AMEX]    │
│                         │
│  ───────────────────    │
│                         │
│  [Empty space]          │
│                         │
├─────────────────────────┤
│  Total: ₦1,480,275      │ ← Sticky footer
│  [Pay Securely]         │
└─────────────────────────┘
```

### Keyboard Optimization

```
Card Number Input:
┌─────────────────────────┐
│  │ 4242 4242 4242 ▊    │
└─────────────────────────┘
        ↓
Keyboard: Numeric only
┌─────────────────────────┐
│  1   2   3              │
│  4   5   6              │
│  7   8   9              │
│  .   0   ⌫              │
└─────────────────────────┘
iOS: inputMode="numeric"
Android: type="tel" or pattern="[0-9]*"

Auto-formatting:
User types: "4242424242424242"
Display shows: "4242 4242 4242 4242"

Auto-advance:
When 16 digits entered → Auto-focus Expiry field
```

### Card Number Entry Sequence

```
Step 1: Start typing
┌────────────────────────┐
│ 4▊                     │ ← First digit
└────────────────────────┘
Action: Detect card brand (Visa starts with 4)

Step 2: Continue typing
┌────────────────────────┐
│ 4242 4242 4242 ▊       │ ← Auto-formatted
│              [VISA]    │ ← Brand icon appears
└────────────────────────┘
Animation: Brand icon fades in (200ms)

Step 3: Complete
┌────────────────────────┐
│ 4242 4242 4242 4242 ✓  │ ← Validation checkmark
│              [VISA]    │
└────────────────────────┘
Action: Auto-focus to Expiry field
Haptic: Light vibration
```

### Validation Feedback

```
Invalid card number:
┌────────────────────────┐
│ 1234 5678 9012 3456 ✕  │ ← Red X
│ Invalid card number     │ ← Error message (red)
└────────────────────────┘
Animation: Shake (400ms)
Border: Red (2px)

Expired card:
┌────────────────────────┐
│ Expiry                  │
│ 11/23              ✕   │
│ Card has expired        │
└────────────────────────┘
```

---

## 🔐 3D Secure / OTP Flow

### Bank Authentication

```
Full-screen overlay:
┌─────────────────────────┐
│                         │
│  🏦 Bank Verification   │
│                         │
│  Your bank requires     │
│  additional security    │
│                         │
│  ⟳ Loading bank...      │
│                         │
│  This may take a few    │
│  seconds                │
│                         │
└─────────────────────────┘

Then:
┌─────────────────────────┐
│  ◀ Cancel               │
│                         │
│  [Bank's 3D Secure]     │ ← iFrame or redirect
│  [Embedded web view]    │
│                         │
│                         │
│                         │
│                         │
│                         │
│                         │
└─────────────────────────┘
```

### OTP Entry (Paystack)

```
┌─────────────────────────┐
│  ◀ Back                 │
│                         │
│  Security Verification  │
│                         │
│  Enter the OTP sent to  │
│  your phone ending in   │
│  ****7890               │
│                         │
│  ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐  │
│  │5│ │2│ │8│ │ │ │ │  │ ← 48×48px boxes
│  └─┘ └─┘ └─┘ └─┘ └─┘  │
│   ▲ Auto-focus          │
│                         │
│  Resend code in 0:45    │ ← Countdown
│  [Resend]               │
│                         │
│  [Verify]               │
│                         │
└─────────────────────────┘

OTP Input Features:
- Auto-focus first box
- Auto-advance to next on entry
- Auto-submit when complete
- Paste support (detect 5-6 digit paste)
- Numeric keyboard
- Large touch targets (48×48px)
```

### OTP Animations

```
Typing animation:
┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐
│5│ │ │ │ │ │ │ │ │  ← User types "5"
└─┘ └─┘ └─┘ └─┘ └─┘
 ↓
┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐
│5│ │2│ │ │ │ │ │ │  ← Auto-advance to next box
└─┘ └─┘ └─┘ └─┘ └─┘
     ▲ Cursor moves automatically

Complete:
┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐
│5│ │2│ │8│ │9│ │1│  ← All filled
└─┘ └─┘ └─┘ └─┘ └─┘
Action: Auto-submit (1s delay)
Animation: Green checkmarks appear

Invalid:
┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐
│5│ │2│ │8│ │9│ │1│  ← Shake animation
└─┘ └─┘ └─┘ └─┘ └─┘
        ↓
⚠ Invalid code. Please try again
Action: Clear inputs, refocus first box
```

---

## ⏳ Payment Processing

### Processing Screen

```
Full-screen (prevents back):
┌─────────────────────────┐
│                         │
│                         │
│         ⟳               │ ← Large spinner (60px)
│                         │
│  Processing Payment     │ ← Bold, centered
│                         │
│  Please do not close    │
│  or press back          │
│                         │
│  ₦1,480,275             │ ← Amount reminder
│  Visa •••• 4242         │
│                         │
│  This may take up to    │
│  30 seconds             │
│                         │
│  ────────               │ ← Progress bar
│  [         50%        ] │
│                         │
└─────────────────────────┘
```

### Processing States

```
State 1: Initiating (0-1s)
⟳ Initiating payment...

State 2: Contacting Bank (1-3s)
⟳ Contacting your bank...

State 3: Verifying (3-5s)
⟳ Verifying transaction...

State 4: Confirming (5-7s)
⟳ Confirming booking...

State 5: Success (7s)
✓ Payment successful!
```

### Progress Indicator

```
Linear progress bar:
┌─────────────────────────┐
│ ████████░░░░░░░░░░░░░  │ ← Animated fill
│          50%            │
└─────────────────────────┘

Animation: Smooth fill (not stepped)
Duration: Match expected payment time
Never show 100% until actually complete
```

---

## ✅ Payment Success

### Success Screen

```
Full-screen (auto-redirect after 3s):
┌─────────────────────────┐
│                         │
│         ✓               │ ← Large checkmark (80px)
│                         │ ← Green circle bg
│  Payment Successful!    │
│                         │
│  ₦1,480,275             │
│  Visa ending in 4242    │
│                         │
│  ─────────────────────  │
│                         │
│  Booking Confirmed      │
│  Reference: #ODD123456  │
│                         │
│  ─────────────────────  │
│                         │
│  Receipt sent to:       │
│  john@example.com       │
│                         │
│  ─────────────────────  │
│                         │
│  [View Booking]         │
│  [Download Receipt]     │
│                         │
│  Auto-redirecting in 3s │
│                         │
└─────────────────────────┘
```

### Success Animation

```
Sequence:
1. Spinner fades out (200ms)
2. Checkmark appears (scale 0→1.2→1, 600ms)
3. Background turns green (300ms)
4. Success text fades in (200ms)
5. Details slide up (300ms staggered)
6. Confetti burst (optional, 1s)

Checkmark animation:
@keyframes successCheckmark {
  0% {
    transform: scale(0) rotate(-45deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.3) rotate(5deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

Haptic: Medium vibration (success pattern)
```

---

## ❌ Payment Failure

### Failure Screen

```
Full-screen:
┌─────────────────────────┐
│                         │
│         ✕               │ ← Large X (80px, red)
│                         │
│  Payment Failed         │
│                         │
│  Your card was declined │
│                         │
│  ─────────────────────  │
│                         │
│  Error Details:         │
│  Code: card_declined    │
│                         │
│  Your bank declined     │
│  this transaction.      │
│  Please check your      │
│  card details or try    │
│  a different card.      │
│                         │
│  ─────────────────────  │
│                         │
│  [Try Again]            │ ← Vertical color
│  [Use Different Card]   │
│  [Contact Support]      │
│                         │
└─────────────────────────┘
```

### Failure Animation

```
Sequence:
1. Spinner fades out (200ms)
2. X appears (scale + shake, 600ms)
3. Background turns red (300ms)
4. Error text fades in (200ms)
5. Details slide up (300ms)

X shake animation:
@keyframes failureShake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
  20%, 40%, 60%, 80% { transform: translateX(10px); }
}

Haptic: Heavy vibration (error pattern)
```

### Error Recovery

```
Preserved data:
- Card number (partially): "•••• 4242"
- Expiry: Still filled
- Name: Still filled
- CVV: Cleared (security)

User returns to card form with:
- Pre-filled data (except CVV)
- Error message at top
- Focus on CVV field (likely error point)

Quick fixes suggested:
┌─────────────────────────┐
│  ⚠ Common issues:       │
│                         │
│  ☐ Check card number    │
│  ☐ Verify expiry date   │
│  ☐ Confirm CVV          │
│  ☐ Check available      │
│     funds               │
│  ☐ Contact your bank    │
│                         │
└─────────────────────────┘
```

---

## 🎨 Animation Specifications

### Micro-Syntax Reference

```
# Card Entry
cardType: 100ms ease-out [S1→1.2→1] + fade-in
validation: 200ms ease-out [✓ fade-in, border→green]
error: 400ms [shake + border→red + message fade-in]
autoAdvance: 300ms [focus-transition]

# Payment Method Selection
methodTile: 200ms [S1→0.97→1] + haptic(light)
methodSelect: 300ms ease-out [border→solid, bg→tint, ✓ fade-in]

# OTP Entry
otpDigit: 100ms [S1→1.1→1] + auto-advance
otpComplete: 300ms [all→green + ✓ + auto-submit]
otpError: 400ms [shake + clear + refocus]

# Processing
spinner: 1000ms ∞ linear [R360°]
progress: smooth [W0%→100%, match duration]
stateChange: 300ms [fade-out→fade-in]

# Success
checkmark: 600ms cubic-bezier(0.68,-0.55,0.265,1.55) [S0→1.2→1, R-45°→0°]
confetti: 1000ms [particles ↑ + fade-out]
autoRedirect: 3000ms countdown

# Failure
errorX: 600ms [shake + scale] + haptic(heavy)
background: 300ms [→red-tint]
```

### Implementation Examples

```css
/* Success Checkmark */
@keyframes successCheckmark {
  0% {
    transform: scale(0) rotate(-45deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.3) rotate(5deg);
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

/* Error Shake */
@keyframes errorShake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
  20%, 40%, 60%, 80% { transform: translateX(10px); }
}

.error-shake {
  animation: errorShake 600ms ease-in-out;
}

/* Card brand fade-in */
@keyframes brandFadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.card-brand-icon {
  animation: brandFadeIn 200ms ease-out;
}

/* OTP box pulse */
@keyframes otpPulse {
  0%, 100% { border-color: var(--vertical-color); }
  50% { border-color: transparent; }
}

.otp-box-active {
  animation: otpPulse 1000ms ease-in-out infinite;
}
```

---

## 🎯 Touch Target Guidelines

### Minimum Sizes (WCAG 2.1 Level AA)

**All Interactive Elements:**
- Input fields: 48px height
- Buttons: 44×44px minimum
- Payment method tiles: 56px height
- OTP boxes: 48×48px
- Card brand icons: 24px (tap area 44px)
- Close/back buttons: 44×44px

### Spacing

```
Good - Card form:
┌────────────────────────┐
│  Card Number           │ ← 48px height
├────────────────────────┤
    ↕ 16px gap
├────────────────────────┤
│  Expiry     CVV        │ ← 48px height each
└────────────────────────┘
```

---

## ♿ Accessibility Patterns

### Screen Reader Flow

```tsx
// Payment processing announcement
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {processingState === 'initiating' && 'Initiating payment'}
  {processingState === 'contacting' && 'Contacting your bank'}
  {processingState === 'verifying' && 'Verifying transaction'}
  {processingState === 'success' && 'Payment successful!'}
  {processingState === 'failed' && `Payment failed. ${errorMessage}`}
</div>

// Card validation announcement
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {cardBrand && `${cardBrand} card detected`}
  {isValid && 'Card number is valid'}
  {hasError && `Error: ${errorMessage}`}
</div>

// OTP entry announcement
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {otpDigitsEntered} of {otpLength} digits entered
  {otpComplete && 'Code complete, verifying'}
  {otpError && 'Invalid code, please try again'}
</div>
```

### Keyboard & Screen Reader

**Card Form:**
```
Tab order:
1. Card number input
2. Expiry input
3. CVV input
4. Name input
5. Save card checkbox
6. Pay button

Enter: Submit form (if valid)
Escape: Close modal/return
```

**OTP Entry:**
```
Auto-focus first box
Arrow keys: Navigate boxes
Number keys: Enter digits
Backspace: Delete + move to previous box
Paste: Detect and populate all boxes
```

---

## 🌐 Platform-Specific Optimizations

### iOS Safari

```css
/* Prevent zoom on input focus */
input {
  font-size: 16px; /* Minimum to prevent zoom */
}

/* Fix viewport height with keyboard */
.payment-form {
  height: calc(var(--vh, 1vh) * 100);
}

/* Momentum scrolling */
.payment-container {
  -webkit-overflow-scrolling: touch;
}

/* Safe areas */
.payment-footer {
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
}
```

```tsx
// Calculate actual viewport height
useEffect(() => {
  const setVH = () => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }
  setVH()
  window.addEventListener('resize', setVH)
  return () => window.removeEventListener('resize', setVH)
}, [])
```

### Android Chrome

```css
/* Prevent keyboard from pushing content */
.payment-form {
  min-height: 100vh;
  min-height: 100dvh; /* Dynamic viewport height */
}

/* Better touch feedback */
button:active {
  transform: scale(0.97);
}

/* Disable tap highlighting */
* {
  -webkit-tap-highlight-color: transparent;
}
```

---

## 🔐 Security Best Practices

### PCI Compliance

**Never Log Sensitive Data:**
```typescript
// ❌ NEVER DO THIS
console.log('Card:', cardNumber, cvv)
analytics.track('payment', { cardNumber })

// ✅ DO THIS
console.log('Payment initiated')
analytics.track('payment', { last4: cardNumber.slice(-4) })
```

**Clear Sensitive Data:**
```typescript
useEffect(() => {
  return () => {
    // Clear on unmount
    setCardNumber('')
    setCvv('')
    setOtp('')
  }
}, [])
```

**Disable Autocomplete for Sensitive Fields:**
```tsx
<input
  type="text"
  autoComplete="off" // CVV, OTP
  name="cvv"
/>

<input
  type="text"
  autoComplete="cc-number" // Card number - OK
  name="card-number"
/>
```

### Visual Security Indicators

```
Always visible:
┌─────────────────────────┐
│  🔒 Secure Payment      │ ← Lock icon
│  Encrypted by Stripe    │ ← Provider badge
│  PCI DSS Compliant      │ ← Compliance badge
└─────────────────────────┘

On hover/tap:
┌─────────────────────────┐
│  Your payment info is   │
│  encrypted using 256-   │
│  bit SSL encryption     │
└─────────────────────────┘
```

---

## 📊 Loading & Error States

### Card Entry Loading

```
While validating card:
┌────────────────────────┐
│ 4242 4242 4242 4242 ⟳ │ ← Spinner
└────────────────────────┘

After validation:
┌────────────────────────┐
│ 4242 4242 4242 4242 ✓  │ ← Checkmark
└────────────────────────┘
```

### Network Errors

```
┌─────────────────────────┐
│  ⚠ Connection Error     │
│                         │
│  Unable to connect to   │
│  payment server         │
│                         │
│  Please check your      │
│  internet connection    │
│  and try again          │
│                         │
│  [Retry]  [Cancel]      │
└─────────────────────────┘
```

### Timeout Handling

```
After 30s:
┌─────────────────────────┐
│  ⏱ Payment Timeout      │
│                         │
│  The payment took       │
│  longer than expected   │
│                         │
│  Your card has NOT      │
│  been charged           │
│                         │
│  [Try Again]            │
│  [Check Payment Status] │
└─────────────────────────┘
```

---

## 🧪 Testing Checklist

### Card Entry
- [ ] Numeric keyboard appears
- [ ] Card formatting works (4-4-4-4)
- [ ] Auto-brand detection works
- [ ] Auto-advance to next field
- [ ] Validation shows in real-time
- [ ] Error messages clear
- [ ] CVV is masked
- [ ] Touch targets 48px
- [ ] Works with paste
- [ ] Keyboard navigation works

### Payment Flow
- [ ] Method selection drawer works
- [ ] Swipe gestures work
- [ ] Processing screen blocks back
- [ ] Progress updates smoothly
- [ ] Success animation plays
- [ ] Failure shows clear errors
- [ ] OTP auto-advances
- [ ] 3D Secure loads in iframe
- [ ] Timeout handled gracefully
- [ ] Network errors caught

### Accessibility
- [ ] Screen reader announces states
- [ ] Keyboard navigation complete
- [ ] Focus management correct
- [ ] Error messages accessible
- [ ] Touch targets adequate
- [ ] Labels clear and descriptive

### Security
- [ ] CVV not logged
- [ ] Data cleared on unmount
- [ ] HTTPS enforced
- [ ] Autocomplete correct
- [ ] Security badges shown

---

## 💡 UX Best Practices

### Save User Progress

```typescript
// Auto-save card details (not CVV!)
useEffect(() => {
  if (cardNumber && expiry && cardholderName) {
    localStorage.setItem('paymentDraft', JSON.stringify({
      last4: cardNumber.slice(-4),
      expiry,
      name: cardholderName,
      timestamp: Date.now()
    }))
  }
}, [cardNumber, expiry, cardholderName])

// Restore on return (if recent)
useEffect(() => {
  const draft = localStorage.getItem('paymentDraft')
  if (draft) {
    const parsed = JSON.parse(draft)
    const age = Date.now() - parsed.timestamp
    if (age < 10 * 60 * 1000) { // 10 minutes
      // Show "Resume payment?" prompt
      setShowResumePrompt(true)
    }
  }
}, [])
```

### Progressive Error Prevention

```
Real-time, non-blocking:
- Show checkmarks as fields become valid
- Show gentle warnings (yellow) before errors (red)
- Suggest fixes inline

┌────────────────────────┐
│ 12/23              ⚠   │ ← Warning (amber)
│ Card expires soon       │
└────────────────────────┘

Instead of:
┌────────────────────────┐
│ 12/23              ✕   │ ← Blocking error
│ Card has expired        │
└────────────────────────┘
```

### Clear Payment CTAs

```
Progressive clarity:
1. No details: [Enter Payment Details]
2. Details entered: [Pay ₦1,480,275]
3. Processing: [Processing... ⟳]
4. Success: [Payment Complete ✓]
```

---

## 🎯 Success Metrics

### User Experience
- Payment completion rate: >80%
- Average time to pay: <60s
- Error rate: <10%
- 3D Secure completion: >90%
- Abandonment at payment: <15%

### Technical Performance
- Form rendering: <100ms
- Validation response: <50ms
- Payment processing: <5s (p95)
- Success redirect: <1s
- No jank (60 FPS)

### Accessibility
- Lighthouse score: 100
- Keyboard navigable: 100%
- Screen reader compatible: 100%
- Touch target compliance: 100%
- WCAG 2.1 AA: 100%

---

**Status:** 💳 **MOBILE PAYMENT UX PATTERNS DOCUMENTED**

These patterns ensure a secure, frictionless mobile payment experience that builds trust and drives conversions while maintaining the highest security standards.

**Next:** Create implementation guide with ready-to-use component code!

**Design System & UI/UX - Dev 7 (TOBI)** 💳📱✨
