# OneDettyDecember UI/UX Design Guide & Developer Handbook

## 1. Design System Foundation

### 1.1 Brand Personality & Visual Language
**Core Attributes:**
- **Vibrant:** High energy, celebration, movement
- **Authentic:** Real moments, genuine connections
- **Premium:** World-class quality with cultural roots
- **Inclusive:** Diaspora and locals, all economic levels
- **Trustworthy:** Professional yet warm

### 1.2 Color Palette

#### Primary Colors
```css
/* Lagos Sunset Collection */
--primary-orange: #FF6B35;      /* Main CTA, energy */
--primary-gold: #F7931E;        /* Accents, premium feel */
--primary-purple: #7B2CBF;      /* Detty vibes, nightlife */

/* Trust & Ground */
--primary-black: #1A1A1A;       /* Text, authority */
--primary-white: #FFFFFF;       /* Space, clarity */
```

#### Secondary Colors
```css
/* Accra Nights */
--secondary-teal: #00B4A6;      /* Success states, verified badges */
--secondary-pink: #FF1F5A;      /* Alerts, hot deals */
--secondary-green: #2ECC71;     /* Available, confirmed */

/* Supporting Tones */
--grey-100: #F8F9FA;            /* Backgrounds */
--grey-300: #E0E0E0;            /* Borders */
--grey-500: #9E9E9E;            /* Muted text */
--grey-700: #616161;            /* Secondary text */
--grey-900: #212121;            /* Primary text */
```

#### Semantic Colors
```css
--success: #2ECC71;
--warning: #F7931E;
--error: #FF1F5A;
--info: #00B4A6;
```

### 1.3 Typography

#### Font Stack
```css
/* Headings - Modern African Feel */
@font-face {
  font-family: 'Bebas Neue';
  font-display: swap;
  /* Fallback to system */
}

/* Body Text - Readable & Warm */
@font-face {
  font-family: 'Inter';
  font-display: swap;
  font-weight: 300 900;  /* Variable font */
}

/* System Stack Fallback */
--font-heading: 'Bebas Neue', -apple-system, 'Segoe UI', sans-serif;
--font-body: 'Inter', -apple-system, 'Segoe UI', 'Roboto', sans-serif;
```

#### Type Scale (Mobile First)
```css
/* Mobile (320px - 768px) */
--text-xs: 0.75rem;     /* 12px - Legal, meta */
--text-sm: 0.875rem;    /* 14px - Captions */
--text-base: 1rem;      /* 16px - Body */
--text-lg: 1.125rem;    /* 18px - Large body */
--text-xl: 1.5rem;      /* 24px - H3 */
--text-2xl: 2rem;       /* 32px - H2 */
--text-3xl: 2.5rem;     /* 40px - H1 */
--text-4xl: 3rem;       /* 48px - Hero */

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  --text-xl: 1.875rem;   /* 30px */
  --text-2xl: 2.5rem;    /* 40px */
  --text-3xl: 3.5rem;    /* 56px */
  --text-4xl: 4.5rem;    /* 72px */
}
```

### 1.4 Spacing System
```css
/* 8px base unit */
--space-0: 0;
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-5: 1.5rem;     /* 24px */
--space-6: 2rem;       /* 32px */
--space-8: 3rem;       /* 48px */
--space-10: 4rem;      /* 64px */
--space-12: 6rem;      /* 96px */
--space-16: 8rem;      /* 128px */
```

## 2. Component Library

### 2.1 Buttons

#### Primary CTA Button
```jsx
// Component: PrimaryCTA
<button className="btn-primary">
  Get Early Access
</button>

/* Styles */
.btn-primary {
  background: linear-gradient(135deg, var(--primary-orange), var(--primary-gold));
  color: white;
  padding: 16px 32px;
  border-radius: 100px;
  font-weight: 600;
  font-size: 1.125rem;
  box-shadow: 0 4px 20px rgba(255, 107, 53, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 30px rgba(255, 107, 53, 0.4);
}

.btn-primary:active {
  transform: translateY(0);
}
```

#### Secondary Button
```jsx
// Component: SecondaryButton
<button className="btn-secondary">
  List with OneDetty
</button>

/* Styles */
.btn-secondary {
  background: transparent;
  border: 2px solid var(--primary-purple);
  color: var(--primary-purple);
  padding: 14px 28px;
  border-radius: 100px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: var(--primary-purple);
  color: white;
}
```

### 2.2 Form Components

#### Progressive Email Input
```jsx
// Component: EmailCapture
const EmailCapture = () => {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [showNext, setShowNext] = useState(false);

  return (
    <div className="email-capture">
      <div className="input-group">
        <input
          type="email"
          placeholder="Enter your email"
          className="email-input"
          onChange={validateEmail}
        />
        <button className="submit-arrow">→</button>
      </div>
      {showNext && <PersonalizationFields />}
    </div>
  );
};

/* Styles */
.email-capture {
  position: relative;
  max-width: 400px;
  margin: 0 auto;
}

.input-group {
  display: flex;
  background: white;
  border-radius: 100px;
  padding: 4px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.email-input {
  flex: 1;
  padding: 16px 24px;
  border: none;
  font-size: 1rem;
  background: transparent;
}

.submit-arrow {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-orange), var(--primary-gold));
  color: white;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.submit-arrow:hover {
  transform: scale(1.1);
}
```

#### City Selector with Emojis
```jsx
// Component: CitySelector
const cities = [
  { value: 'lagos', label: 'Lagos', emoji: '🌆' },
  { value: 'accra', label: 'Accra', emoji: '🏖️' },
  { value: 'abuja', label: 'Abuja', emoji: '🏛️' },
  { value: 'nairobi', label: 'Nairobi', emoji: '🦁' },
  { value: 'kigali', label: 'Kigali', emoji: '🌄' },
  { value: 'johannesburg', label: 'Johannesburg', emoji: '💎' }
];

/* Visual Style */
.city-card {
  padding: 20px;
  border: 2px solid transparent;
  border-radius: 16px;
  background: var(--grey-100);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.city-card:hover {
  border-color: var(--primary-orange);
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.city-card.selected {
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(247, 147, 30, 0.1));
  border-color: var(--primary-orange);
}

.city-emoji {
  font-size: 2rem;
  margin-bottom: 8px;
}
```

### 2.3 Cards & Containers

#### Vendor Value Prop Card
```jsx
// Component: VendorValueCard
<div className="value-card">
  <div className="value-icon">📈</div>
  <h3 className="value-title">3x More Customers</h3>
  <p className="value-desc">
    Reach international diaspora without expensive marketing
  </p>
</div>

/* Styles */
.value-card {
  padding: 32px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: transform 0.3s ease;
}

.value-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.value-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}
```

## 3. Layout Patterns

### 3.1 Responsive Breakpoints
```css
/* Mobile First Approach */
/* Base: 320px - 639px */

/* Tablet */
@media (min-width: 640px) { }

/* Desktop */
@media (min-width: 1024px) { }

/* Wide */
@media (min-width: 1280px) { }

/* Ultra Wide */
@media (min-width: 1536px) { }
```

### 3.2 Hero Section Layout
```html
<!-- Mobile First Structure -->
<section className="hero">
  <!-- Background Video (absolute) -->
  <video className="hero-bg" autoplay muted loop playsinline>
    <source src="/detty-december-vibes.mp4" type="video/mp4">
  </video>

  <!-- Overlay Pattern -->
  <div className="pattern-overlay"></div>

  <!-- Content Container -->
  <div className="hero-content">
    <h1 className="hero-title">
      Detty December,<br/>
      <span className="gradient-text">all in one place.</span>
    </h1>

    <p className="hero-subtitle">
      Skip the DM chaos. Plan your December with real listings
      and a community that gets it.
    </p>

    <!-- CTA Buttons -->
    <div className="hero-ctas">
      <button className="btn-primary">Plan My December</button>
      <button className="btn-secondary">I Want to List</button>
    </div>
  </div>

  <!-- Scroll Indicator -->
  <div className="scroll-indicator">
    <span className="scroll-text">Scroll to explore</span>
    <div className="scroll-arrow">↓</div>
  </div>
</section>
```

### 3.3 Mobile Navigation Pattern
```jsx
// Component: MobileNav
const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger */}
      <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Full Screen Menu */}
      <nav className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <ul>
          <li><a href="#how">How it Works</a></li>
          <li><a href="#travelers">For Travelers</a></li>
          <li><a href="#vendors">For Vendors</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>

        <div className="menu-ctas">
          <button className="btn-primary">Get Early Access</button>
          <button className="btn-secondary">List with Us</button>
        </div>
      </nav>
    </>
  );
};

/* Animation */
.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: var(--primary-black);
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-menu.open {
  transform: translateX(0);
}
```

## 4. Micro-Interactions & Animations

### 4.1 Form Field Animations
```css
/* Input Focus Effect */
.form-field {
  position: relative;
}

.form-field input:focus + .field-label {
  transform: translateY(-24px) scale(0.85);
  color: var(--primary-orange);
}

.form-field::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary-orange);
  transition: width 0.3s ease;
}

.form-field:focus-within::after {
  width: 100%;
}
```

### 4.2 Progress Indicator
```jsx
// Component: ProgressSteps
const ProgressSteps = ({ current, total }) => (
  <div className="progress-steps">
    {[...Array(total)].map((_, i) => (
      <div
        key={i}
        className={`step ${i <= current ? 'active' : ''} ${i === current ? 'current' : ''}`}
      />
    ))}
  </div>
);

/* Styles */
.progress-steps {
  display: flex;
  gap: 8px;
  margin: 24px 0;
}

.step {
  width: 40px;
  height: 4px;
  background: var(--grey-300);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.step.active {
  background: var(--primary-orange);
}

.step.current {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
}
```

### 4.3 Scroll-Triggered Animations
```javascript
// Intersection Observer for Fade In
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in-visible');
    }
  });
}, observerOptions);

// Apply to elements
document.querySelectorAll('.fade-in').forEach(el => {
  observer.observe(el);
});
```

```css
.fade-in {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-in-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger children */
.stagger-children > * {
  transition-delay: calc(var(--i) * 0.1s);
}
```

## 5. Mobile-Specific Patterns

### 5.1 Touch Gestures
```javascript
// Swipe to dismiss
let touchStart = 0;
let touchEnd = 0;

element.addEventListener('touchstart', (e) => {
  touchStart = e.changedTouches[0].screenX;
});

element.addEventListener('touchend', (e) => {
  touchEnd = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  if (touchEnd < touchStart - 50) {
    // Swiped left - next step
    nextStep();
  }
  if (touchEnd > touchStart + 50) {
    // Swiped right - previous step
    previousStep();
  }
}
```

### 5.2 Mobile Form Optimizations
```html
<!-- Prevent zoom on focus -->
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

<!-- Input attributes for better mobile experience -->
<input
  type="email"
  inputmode="email"
  autocomplete="email"
  autocapitalize="off"
  spellcheck="false"
/>

<!-- Numeric keyboard for year selection -->
<input
  type="tel"
  pattern="[0-9]*"
  inputmode="numeric"
  placeholder="2025"
/>
```

## 6. Cultural Design Elements

### 6.1 Pattern Overlays
```css
/* Subtle Ankara Pattern */
.pattern-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/patterns/ankara-subtle.svg');
  background-size: 200px;
  opacity: 0.05;
  mix-blend-mode: multiply;
}

/* Kente Border Accent */
.kente-border {
  border-image: url('/patterns/kente-stripe.svg') 30 repeat;
  border-width: 4px;
  border-style: solid;
}
```

### 6.2 Cultural Color Moments
```css
/* Lagos Sunset Gradient */
.lagos-sunset {
  background: linear-gradient(
    135deg,
    #FF6B35 0%,
    #F7931E 25%,
    #7B2CBF 75%,
    #1A1A1A 100%
  );
}

/* Accra Nights Glow */
.accra-glow {
  box-shadow:
    0 0 40px rgba(255, 107, 53, 0.3),
    0 0 80px rgba(123, 44, 191, 0.2);
}
```

## 7. Performance Optimizations

### 7.1 Critical CSS
```html
<!-- Inline critical CSS in <head> -->
<style>
  /* Above-the-fold styles only */
  .hero { /* ... */ }
  .btn-primary { /* ... */ }
  /* ~10KB max */
</style>

<!-- Load full CSS async -->
<link rel="preload" href="/css/main.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
```

### 7.2 Image Optimization
```jsx
// Next.js Image Component
import Image from 'next/image';

<Image
  src="/hero-lagos.jpg"
  alt="Lagos December vibes"
  width={1920}
  height={1080}
  priority
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>
```

### 7.3 Lazy Loading Strategy
```javascript
// Lazy load non-critical components
const VendorSection = lazy(() => import('./VendorSection'));
const FAQ = lazy(() => import('./FAQ'));

// Intersection Observer for lazy loading
const lazyLoadComponent = (component, threshold = 0.1) => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        // Load component
        import(component);
        observer.disconnect();
      }
    },
    { threshold }
  );

  return observer;
};
```

## 8. Accessibility Guidelines

### 8.1 ARIA Labels
```html
<!-- Form accessibility -->
<form role="form" aria-label="Join traveler waitlist">
  <label for="email" className="sr-only">Email address</label>
  <input
    id="email"
    type="email"
    aria-required="true"
    aria-invalid={!isValid}
    aria-describedby="email-error"
  />
  <span id="email-error" role="alert" aria-live="polite">
    {errorMessage}
  </span>
</form>

<!-- Button states -->
<button
  aria-label="Get early access to OneDettyDecember"
  aria-pressed={isSubmitted}
  aria-busy={isLoading}
>
  {isLoading ? 'Submitting...' : 'Get Early Access'}
</button>
```

### 8.2 Keyboard Navigation
```css
/* Focus visible styles */
:focus-visible {
  outline: 3px solid var(--primary-orange);
  outline-offset: 2px;
}

/* Skip to content link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--primary-orange);
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

## 9. Developer Handoff Checklist

### 9.1 File Structure
```
/components
  /ui
    - Button.tsx
    - Input.tsx
    - Card.tsx
    - Modal.tsx
  /forms
    - EmailCapture.tsx
    - CitySelector.tsx
    - ProgressiveForm.tsx
  /sections
    - Hero.tsx
    - HowItWorks.tsx
    - VendorBenefits.tsx
    - FAQ.tsx
  /layouts
    - Header.tsx
    - Footer.tsx
    - MobileNav.tsx

/styles
  /base
    - variables.css
    - reset.css
    - typography.css
  /components
    - buttons.css
    - forms.css
    - cards.css
  /utilities
    - spacing.css
    - animations.css
    - responsive.css

/public
  /images
  /videos
  /patterns
  /fonts
```

### 9.2 Component Props Interface
```typescript
// Example: Button Component
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

// Example: Form Field
interface FormFieldProps {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select';
  required?: boolean;
  placeholder?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  options?: Array<{
    value: string;
    label: string;
    emoji?: string;
  }>;
}
```

### 9.3 State Management
```typescript
// Form state example
interface WaitlistState {
  step: number;
  userType: 'traveler' | 'vendor' | null;
  formData: {
    email: string;
    city: string;
    year: string;
    vibe?: string;
    businessName?: string;
    role?: string;
    scale?: string;
  };
  validation: {
    [key: string]: string | null;
  };
  isSubmitting: boolean;
  isComplete: boolean;
}

// Actions
type WaitlistAction =
  | { type: 'SET_USER_TYPE'; payload: 'traveler' | 'vendor' }
  | { type: 'UPDATE_FIELD'; field: string; value: string }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SUBMIT' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_ERROR'; error: string };
```

## 10. Testing Guidelines

### 10.1 Visual Regression Tests
```javascript
// Using Playwright for visual testing
test('hero section renders correctly on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await expect(page.locator('.hero')).toHaveScreenshot('hero-mobile.png');
});

test('form progression works', async ({ page }) => {
  await page.goto('/');
  await page.fill('#email', 'test@example.com');
  await page.click('.submit-arrow');
  await expect(page.locator('.city-selector')).toBeVisible();
});
```

### 10.2 Performance Metrics
```javascript
// Core Web Vitals monitoring
const metrics = {
  LCP: 2500,  // Largest Contentful Paint < 2.5s
  FID: 100,   // First Input Delay < 100ms
  CLS: 0.1,   // Cumulative Layout Shift < 0.1
  TTI: 3500,  // Time to Interactive < 3.5s
};

// Lighthouse CI configuration
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'first-input-delay': ['error', { maxNumericValue: 100 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
      },
    },
  },
};
```

## 11. Implementation Timeline

### Phase 1: Foundation (Week 1)
- [ ] Set up Next.js project with TypeScript
- [ ] Configure Tailwind CSS with custom design tokens
- [ ] Implement base components (Button, Input, Card)
- [ ] Set up Supabase for data storage
- [ ] Configure analytics (GA4, Mixpanel)

### Phase 2: Core Features (Week 2)
- [ ] Build Hero section with video background
- [ ] Implement progressive disclosure forms
- [ ] Create traveler and vendor flows
- [ ] Add form validation and error handling
- [ ] Set up email service (Resend)

### Phase 3: Polish & Optimize (Week 3)
- [ ] Add micro-interactions and animations
- [ ] Implement lazy loading and code splitting
- [ ] Optimize images and videos
- [ ] Add A/B testing framework
- [ ] Conduct accessibility audit

### Phase 4: Testing & Launch (Week 4)
- [ ] Cross-browser testing
- [ ] Mobile device testing (real devices)
- [ ] Performance optimization
- [ ] Security audit
- [ ] Deploy to production

---

## Appendix A: Cultural References

### Nigerian Pidgin Phrases to Include
- "No wahala" - No problem
- "Jollof is ready" - Something good is coming
- "We dey together" - We're in this together
- "E don happen" - It's happening
- "Oya, let's go!" - Come on, let's go!

### Visual Cultural Elements
- Lagos Third Mainland Bridge silhouette
- Accra Independence Arch outline
- Palm trees and beach scenes
- Ankara and Kente patterns (subtle)
- Afrobeats wave patterns

### Celebration Moments to Capture
- Airport arrivals with "Welcome home" banners
- Beach parties at sunset
- Street food experiences
- Fashion shows and concerts
- Family reunions and friendships

---

*This guide is a living document. Update as the design evolves based on user feedback and testing results.*