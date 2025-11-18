# OneDettyDecember UI/UX Design Guide v2.0
## Simplified & Brand-Accurate Developer Handbook

**Design Philosophy:** World-class simplicity inspired by Airbnb, Stripe, and Apple, grounded in African cultural authenticity.

**Reference Sites Analyzed:**
- **Airbnb:** Card-based layouts, search UX, mobile-first responsive
- **Stripe:** Professional spacing, typography hierarchy, color restraint
- **Apple:** Generous white space, product focus, minimal navigation

---

## 1. Design Foundation (Brand Guidelines)

### 1.1 Color System

#### Primary Palette (From Brand Guide)
```css
/* Core Brand Colors */
--brand-orange: #FF6B35;     /* Primary CTA, key actions */
--deep-navy: #1A1A2E;        /* Headlines, dark backgrounds */
--golden-yellow: #FFC857;    /* Accents, highlights */

/* Neutrals (Primary Use) */
--white: #FFFFFF;            /* Main background */
--light-gray: #F5F5F7;       /* Section backgrounds */
--charcoal: #2C2C3A;         /* Body text */
--cool-gray: #7A7A8C;        /* Secondary text, labels */

/* Semantic Colors */
--mint-green: #06FFA5;       /* Success states */
--vibrant-coral: #E63946;    /* Errors, urgent */
--turquoise: #4ECDC4;        /* Info, verified badges */
```

#### Color Usage Rules (Simplified)
```css
/* Backgrounds */
- Main sections: var(--white)
- Alternate sections: var(--light-gray)
- Footer: var(--deep-navy)

/* Text */
- Headlines: var(--deep-navy)
- Body: var(--charcoal)
- Meta/labels: var(--cool-gray)

/* Interactive */
- Primary buttons: var(--brand-orange)
- Links: var(--deep-navy) → var(--brand-orange) on hover
- Form focus: var(--brand-orange)

/* Use ONLY ONE accent color per section */
```

### 1.2 Typography System

#### Font Family (From Brand Guide)
```css
/* Single font family: Inter */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');

:root {
  --font-family: 'Inter', -apple-system, 'Segoe UI', sans-serif;
}

/* Font Weights (Limit to 3-4) */
--font-regular: 400;    /* Body text */
--font-semibold: 600;   /* Buttons, emphasis */
--font-bold: 700;       /* Headings */
--font-black: 900;      /* Hero only */
```

#### Type Scale (Airbnb/Stripe-Inspired Sizes)
```css
/* Mobile-First (320px+) */
:root {
  --text-hero: 3.5rem;      /* 56px - Landing hero */
  --text-h1: 2.5rem;        /* 40px - Page titles */
  --text-h2: 2rem;          /* 32px - Section headers */
  --text-h3: 1.5rem;        /* 24px - Card titles */
  --text-body-lg: 1.125rem; /* 18px - Large body */
  --text-body: 1rem;        /* 16px - Standard body */
  --text-sm: 0.875rem;      /* 14px - Captions */
  --text-xs: 0.75rem;       /* 12px - Labels */
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  :root {
    --text-hero: 6rem;       /* 96px - Dramatic */
    --text-h1: 3.5rem;       /* 56px */
    --text-h2: 2.5rem;       /* 40px */
    --text-body-lg: 1.25rem; /* 20px */
  }
}
```

#### Line Heights (Generous Spacing)
```css
--line-height-tight: 1.1;    /* Hero headlines */
--line-height-heading: 1.3;  /* H1, H2, H3 */
--line-height-body: 1.7;     /* Body text (Stripe standard) */
--line-height-small: 1.5;    /* Small text */
```

#### Letter Spacing
```css
--ls-tight: -0.02em;    /* Large headlines */
--ls-normal: 0;         /* Body text */
--ls-wide: 0.05em;      /* Small caps, labels */
```

### 1.3 Spacing System (8px Base Grid)

#### Stripe/Apple Approach: Consistent Multiples
```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.5rem;    /* 24px */
  --space-6: 2rem;      /* 32px */
  --space-8: 3rem;      /* 48px */
  --space-10: 4rem;     /* 64px */
  --space-12: 5rem;     /* 80px */
  --space-16: 7.5rem;   /* 120px - Large section gaps */
}

/* Usage Guidelines */
- Element padding: var(--space-4) to var(--space-6)
- Section padding vertical: var(--space-12) to var(--space-16)
- Container horizontal padding: var(--space-5) mobile, var(--space-10) desktop
```

---

## 2. Progressive Enhancement Strategy (IMMERSIVE + PERFORMANT)

### 2.1 Design Philosophy: Layered Immersion

**Core Principle:** Deliver world-class performance to EVERYONE, while providing rich immersive experiences to users with capable devices and connections.

**Strategy:** Three-tier progressive enhancement
- **Tier 1 (Base):** Fast, accessible, works everywhere
- **Tier 2 (Enhanced):** Rich animations, video backgrounds
- **Tier 3 (Immersive):** Full cultural experience with audio/video

### 2.2 Connection Detection & Adaptive Loading

```javascript
/**
 * Detect user's connection quality and device capability
 * Returns: 'base', 'enhanced', or 'rich'
 */
function getExperienceTier() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const effectiveType = connection?.effectiveType;
  const isMobile = window.innerWidth < 1024;
  const saveData = connection?.saveData;

  // User has data saver on - always base
  if (saveData) return 'base';

  // Slow connection - base only
  if (effectiveType === 'slow-2g' || effectiveType === '2g') {
    return 'base';
  }

  // Mobile 3G - base only
  if (isMobile && effectiveType === '3g') {
    return 'base';
  }

  // Mobile 4G - enhanced
  if (isMobile && effectiveType === '4g') {
    return 'enhanced';
  }

  // Desktop 3G/4G - enhanced
  if (!isMobile && (effectiveType === '3g' || effectiveType === '4g')) {
    return 'enhanced';
  }

  // Desktop with great connection - rich
  return 'rich';
}

// Apply tier on page load
document.documentElement.setAttribute('data-experience-tier', getExperienceTier());
```

### 2.3 Tier 1: Base Experience (EVERYONE)

**Performance Target:** LCP < 2.5s on 3G

**Features:**
- Static hero image (WebP, optimized)
- Simple CSS animations (fade-in, slide-up)
- Functional forms
- Core navigation
- Pattern overlays (subtle, CSS-only)

**What Loads:**
```html
<!-- Critical path - inline CSS -->
<style>
  /* Base styles only ~8KB */
</style>

<!-- Hero section - Static image -->
<section class="hero">
  <picture>
    <source srcset="/hero-mobile.webp" media="(max-width: 768px)" type="image/webp">
    <source srcset="/hero-desktop.webp" media="(min-width: 769px)" type="image/webp">
    <img
      src="/hero-fallback.jpg"
      alt="Detty December Lagos"
      width="1920"
      height="1080"
      fetchpriority="high"
    >
  </picture>

  <div class="pattern-overlay-css"></div>

  <div class="hero-content">
    <!-- Content here -->
  </div>
</section>

<!-- Email capture - Critical -->
<div class="email-capture">
  <!-- Form here -->
</div>
```

**CSS Patterns (No JavaScript):**
```css
/* Subtle pattern overlay - CSS only */
.pattern-overlay-css {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(255, 107, 53, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 50%, rgba(255, 200, 87, 0.05) 0%, transparent 50%);
  pointer-events: none;
}
```

### 2.4 Tier 2: Enhanced Experience (4G Users)

**Performance Target:** Video loads AFTER LCP (< 3.5s TTI)

**Additional Features:**
- Hero video background (fades in)
- Richer scroll animations
- Animated pattern overlays (SVG)
- Testimonial images
- Interactive hovers

**Progressive Video Loading:**
```javascript
// Load video AFTER page interactive
if (getExperienceTier() === 'enhanced' || getExperienceTier() === 'rich') {
  // Wait for LCP, then load video
  window.addEventListener('load', () => {
    setTimeout(() => {
      loadHeroVideo();
    }, 1500); // After page settles
  });
}

function loadHeroVideo() {
  const video = document.querySelector('.hero-video');
  const image = document.querySelector('.hero-image');

  if (!video) return;

  // Preload video
  video.load();

  // When ready, fade in
  video.addEventListener('canplaythrough', () => {
    video.classList.add('loaded');
    video.play().catch(err => {
      console.log('Video autoplay blocked, falling back to image');
      video.remove();
    });

    // Fade out image
    setTimeout(() => {
      image.style.opacity = '0';
    }, 500);
  }, { once: true });

  // Error fallback
  video.addEventListener('error', () => {
    console.log('Video failed to load, keeping image');
    video.remove();
  });
}
```

**HTML Structure:**
```html
<section class="hero">
  <!-- Base: Always visible -->
  <img src="hero.webp" class="hero-image" />

  <!-- Enhanced: Loads progressively -->
  <video
    class="hero-video"
    data-load="enhanced"
    muted
    loop
    playsinline
    preload="none"
    poster="hero-poster.jpg"
  >
    <source src="/videos/detty-hero-optimized.mp4" type="video/mp4">
  </video>

  <!-- Content (always visible) -->
  <div class="hero-content">...</div>
</section>
```

**CSS for Video Transition:**
```css
.hero {
  position: relative;
  overflow: hidden;
}

.hero-image,
.hero-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-image {
  z-index: 1;
  transition: opacity 1s ease;
}

.hero-video {
  z-index: 2;
  opacity: 0;
  transition: opacity 1.5s ease;
}

.hero-video.loaded {
  opacity: 1;
}

/* If video fails, image stays visible */
```

### 2.5 Tier 3: Immersive Experience (Desktop 4G+)

**Performance Target:** Full experience < 5s

**Additional Features:**
- Background Afrobeats control (USER-INITIATED)
- Video testimonials (auto-play on scroll)
- Advanced animations
- Interactive cultural elements

**Afrobeats Integration (User Control):**
```html
<!-- Audio control - Only visible on rich tier -->
<div class="audio-control" data-tier="rich">
  <button id="audio-toggle" aria-label="Play background music">
    <svg class="icon-play"><!-- Play icon --></svg>
    <svg class="icon-pause" hidden><!-- Pause icon --></svg>
    <span>Feel the Vibe</span>
  </button>

  <audio id="background-audio" loop>
    <source src="/audio/afrobeats-ambient.mp3" type="audio/mpeg">
  </audio>
</div>
```

```javascript
// Audio control - ONLY loaded for rich tier
if (getExperienceTier() === 'rich') {
  const audioToggle = document.getElementById('audio-toggle');
  const audio = document.getElementById('background-audio');
  const iconPlay = document.querySelector('.icon-play');
  const iconPause = document.querySelector('.icon-pause');

  audioToggle.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      audio.volume = 0.3; // Start at 30%
      iconPlay.hidden = true;
      iconPause.hidden = false;

      // Track engagement
      analytics.track('Audio Engaged', { action: 'play' });
    } else {
      audio.pause();
      iconPlay.hidden = false;
      iconPause.hidden = true;
    }
  });

  // Show control with fade-in
  document.querySelector('.audio-control').classList.add('visible');
}
```

**CSS for Audio Control:**
```css
.audio-control {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 50;
  opacity: 0;
  transform: translateY(20px);
  transition: all 400ms ease;
}

.audio-control.visible {
  opacity: 1;
  transform: translateY(0);
}

.audio-control button {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 24px;
  background: var(--brand-orange);
  color: white;
  border: none;
  border-radius: 100px;
  font-weight: var(--font-semibold);
  box-shadow: 0 4px 20px rgba(255, 107, 53, 0.4);
  cursor: pointer;
  transition: all 200ms ease;
}

.audio-control button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(255, 107, 53, 0.5);
}
```

### 2.6 Video Testimonials (Lazy Load)

```html
<section class="testimonials" data-load="enhanced">
  <div class="container">
    <h2>Real Stories, Real Experiences</h2>

    <div class="testimonial-carousel">
      <div class="testimonial-card">
        <video
          class="testimonial-video"
          data-lazy-load
          poster="/testimonials/thumb-1.jpg"
          muted
          playsinline
        >
          <source data-src="/testimonials/story-1.mp4" type="video/mp4">
        </video>

        <blockquote>"I came alone, left with family"</blockquote>
        <cite>— Sarah, London</cite>
      </div>
    </div>
  </div>
</section>
```

```javascript
// Lazy load testimonial videos
const observerOptions = {
  threshold: 0.5,
  rootMargin: '100px'
};

const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const video = entry.target;
      const source = video.querySelector('source[data-src]');

      if (source) {
        source.src = source.dataset.src;
        video.load();

        video.addEventListener('canplay', () => {
          video.play().catch(err => {
            // Autoplay blocked, show play button
            showPlayButton(video);
          });
        }, { once: true });
      }

      videoObserver.unobserve(video);
    }
  });
}, observerOptions);

// Observe all testimonial videos
document.querySelectorAll('[data-lazy-load]').forEach(video => {
  videoObserver.observe(video);
});
```

### 2.7 Performance Budget by Tier

| Resource | Base | Enhanced | Rich |
|----------|------|----------|------|
| **HTML** | 50KB | 50KB | 50KB |
| **CSS** | 20KB | 25KB | 30KB |
| **JavaScript** | 50KB | 100KB | 150KB |
| **Images** | 500KB | 800KB | 1MB |
| **Video** | 0KB | 2MB | 4MB |
| **Audio** | 0KB | 0KB | 1MB |
| **Total** | ~620KB | ~3MB | ~6.2MB |
| **LCP** | < 2.5s | < 2.5s | < 2.5s |
| **Full Load** | < 3s | < 5s | < 7s |

**Video Optimization Requirements:**
```bash
# Hero video optimization
ffmpeg -i input.mp4 \
  -vcodec libx264 \
  -crf 28 \
  -preset slow \
  -vf "scale=1920:1080" \
  -movflags +faststart \
  -max_muxing_queue_size 9999 \
  hero-optimized.mp4

# Target: < 2MB for 15-30 second loop
```

### 2.8 Analytics Tracking by Tier

```javascript
// Track experience tier and performance
window.addEventListener('load', () => {
  const tier = getExperienceTier();
  const perfData = performance.getEntriesByType('navigation')[0];

  analytics.track('Page Load Complete', {
    experience_tier: tier,
    lcp: performanceMetrics.lcp,
    fid: performanceMetrics.fid,
    cls: performanceMetrics.cls,
    connection_type: navigator.connection?.effectiveType,
    device_type: window.innerWidth < 1024 ? 'mobile' : 'desktop',
    load_time: perfData.loadEventEnd - perfData.fetchStart,
    video_loaded: document.querySelector('.hero-video.loaded') ? true : false,
    audio_played: audioEngaged || false
  });
});

// Track tier-specific engagement
function trackTierEngagement(action, metadata = {}) {
  analytics.track('Tier Engagement', {
    tier: getExperienceTier(),
    action,
    ...metadata
  });
}

// Examples
if (videoElement.classList.contains('loaded')) {
  trackTierEngagement('video_displayed', { location: 'hero' });
}

audioToggle.addEventListener('click', () => {
  trackTierEngagement('audio_toggled', { state: audio.paused ? 'paused' : 'playing' });
});
```

### 2.9 Tier-Specific CSS

```css
/* Base tier - Simple animations only */
[data-experience-tier="base"] .fade-in {
  animation: simpleFade 600ms ease-out;
}

@keyframes simpleFade {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Enhanced tier - Richer animations */
[data-experience-tier="enhanced"] .fade-in,
[data-experience-tier="rich"] .fade-in {
  animation: fadeSlideUp 800ms cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Rich tier - Additional effects */
[data-experience-tier="rich"] .card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

/* Hide rich-only elements on lower tiers */
[data-tier="rich"] {
  display: none;
}

[data-experience-tier="rich"] [data-tier="rich"] {
  display: block;
}
```

### 2.10 Implementation Checklist

**Before Launch:**
- [ ] Test base experience on throttled 3G
- [ ] Verify LCP < 2.5s on all tiers
- [ ] Test video fallback when autoplay blocked
- [ ] Confirm audio is user-initiated only
- [ ] Validate tier detection across browsers
- [ ] Test progressive enhancement degradation
- [ ] Measure actual tier distribution in beta
- [ ] A/B test conversion by tier
- [ ] Monitor performance budget compliance
- [ ] Test with Save Data mode enabled

---

## 3. Layout System

### 2.1 Responsive Breakpoints
```css
/* Airbnb-Inspired Breakpoints */
--breakpoint-mobile: 320px;    /* Base */
--breakpoint-tablet: 744px;    /* Airbnb standard */
--breakpoint-desktop: 1024px;  /* Desktop start */
--breakpoint-wide: 1440px;     /* Wide screens */
```

### 2.2 Container System
```css
.container {
  width: 100%;
  max-width: 1200px;           /* Apple approach: not too wide */
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--space-5);  /* 24px mobile */
  padding-right: var(--space-5);
}

@media (min-width: 1024px) {
  .container {
    padding-left: var(--space-10);  /* 64px desktop */
    padding-right: var(--space-10);
  }
}
```

### 2.3 Grid System (12 Column)
```css
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-6);  /* 32px */
}

/* Responsive Columns */
.col-12 { grid-column: span 12; }        /* Full width mobile */
.col-md-6 {
  @media (min-width: 744px) {
    grid-column: span 6;                  /* Half width tablet */
  }
}
.col-lg-4 {
  @media (min-width: 1024px) {
    grid-column: span 4;                  /* Third width desktop */
  }
}
```

---

## 3. Component Library

### 3.1 Buttons

#### Primary CTA (Brand Orange)
```jsx
// Component Usage
<button className="btn-primary">Get Early Access</button>

/* Styles - Stripe-Inspired Simplicity */
.btn-primary {
  /* Base */
  background: var(--brand-orange);
  color: white;
  font-family: var(--font-family);
  font-weight: var(--font-semibold);
  font-size: var(--text-body);
  letter-spacing: 0.01em;

  /* Sizing (Large touch targets) */
  padding: 16px 32px;
  min-height: 56px;
  border-radius: 8px;              /* Modern, not pill */
  border: none;

  /* Effects (Subtle) */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.btn-primary:hover {
  background: #E85F2E;             /* 10% darker */
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

/* Loading State */
.btn-primary[data-loading="true"] {
  position: relative;
  color: transparent;
}

.btn-primary[data-loading="true"]::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid white;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spinner 600ms linear infinite;
}

@keyframes spinner {
  to { transform: translate(-50%, -50%) rotate(360deg); }
}
```

#### Text Links (Secondary Actions)
```css
/* Stripe Approach: No outlined buttons, use text links */
.btn-link {
  background: none;
  border: none;
  color: var(--deep-navy);
  font-weight: var(--font-semibold);
  font-size: var(--text-body);
  padding: 8px 0;
  transition: color 200ms ease;
  cursor: pointer;
}

.btn-link:hover {
  color: var(--brand-orange);
}

.btn-link::after {
  content: ' →';
  display: inline-block;
  transition: transform 200ms ease;
}

.btn-link:hover::after {
  transform: translateX(4px);
}
```

### 3.2 Form Components

#### Email Input (Stripe-Style Simplicity)
```html
<!-- Single-field capture -->
<div className="email-capture">
  <form className="email-form">
    <div className="input-wrapper">
      <input
        type="email"
        id="email"
        placeholder="Enter your email"
        className="email-input"
        required
      />
      <button type="submit" className="btn-submit">
        Get Early Access
      </button>
    </div>
    <p className="helper-text">Join 2,000+ early access members</p>
  </form>
</div>
```

```css
.email-capture {
  max-width: 480px;
  margin: 0 auto;
}

.input-wrapper {
  display: flex;
  gap: var(--space-2);
  background: white;
  padding: 4px;
  border-radius: 8px;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.08),
    0 4px 20px rgba(0, 0, 0, 0.08);
}

.email-input {
  flex: 1;
  padding: 16px 20px;
  font-size: var(--text-body);
  font-family: var(--font-family);
  border: none;
  background: transparent;
  outline: none;
}

.email-input::placeholder {
  color: var(--cool-gray);
}

.btn-submit {
  padding: 14px 28px;
  background: var(--brand-orange);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: var(--font-semibold);
  font-size: var(--text-body);
  white-space: nowrap;
  cursor: pointer;
  transition: all 200ms ease;
}

.btn-submit:hover {
  background: #E85F2E;
}

.helper-text {
  margin-top: var(--space-3);
  font-size: var(--text-sm);
  color: var(--cool-gray);
  text-align: center;
}
```

#### Form Field (Standard)
```html
<div className="form-field">
  <label htmlFor="city" className="field-label">Primary City</label>
  <select id="city" className="field-input">
    <option value="">Select city</option>
    <option value="lagos">Lagos</option>
    <option value="accra">Accra</option>
    <option value="abuja">Abuja</option>
  </select>
  <span className="field-error" role="alert">Please select a city</span>
</div>
```

```css
.form-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.field-label {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--charcoal);
  letter-spacing: var(--ls-wide);
  text-transform: uppercase;
}

.field-input {
  padding: 14px 16px;
  font-size: var(--text-body);
  font-family: var(--font-family);
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  background: white;
  transition: all 200ms ease;
}

.field-input:focus {
  outline: none;
  border-color: var(--brand-orange);
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.field-error {
  font-size: var(--text-sm);
  color: var(--vibrant-coral);
  display: none;
}

.form-field.has-error .field-error {
  display: block;
}

.form-field.has-error .field-input {
  border-color: var(--vibrant-coral);
}
```

### 3.3 Cards (Airbnb-Inspired)

#### Feature Card
```html
<div className="feature-card">
  <div className="card-icon">
    <svg><!-- Icon SVG --></svg>
  </div>
  <h3 className="card-title">One Platform</h3>
  <p className="card-description">
    Everything you need for Detty December in one simple,
    easy-to-use marketplace.
  </p>
</div>
```

```css
.feature-card {
  padding: var(--space-8);
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
}

.feature-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.card-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto var(--space-5);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 107, 53, 0.1);
  border-radius: 12px;
}

.card-icon svg {
  width: 32px;
  height: 32px;
  color: var(--brand-orange);
}

.card-title {
  font-size: var(--text-h3);
  font-weight: var(--font-bold);
  color: var(--deep-navy);
  margin-bottom: var(--space-3);
  line-height: var(--line-height-heading);
}

.card-description {
  font-size: var(--text-body-lg);
  color: var(--charcoal);
  line-height: var(--line-height-body);
}
```

#### Experience/Listing Card
```html
<div className="listing-card">
  <div className="card-image">
    <img src="event.jpg" alt="Event name" loading="lazy" />
    <span className="card-badge">Popular</span>
  </div>
  <div className="card-content">
    <h4 className="listing-title">New Year's Eve Beach Party</h4>
    <p className="listing-meta">Lagos • Dec 31, 2025</p>
    <p className="listing-price">From $50</p>
  </div>
</div>
```

```css
.listing-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  transition: all 300ms ease;
  cursor: pointer;
}

.listing-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-image {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 400ms ease;
}

.listing-card:hover .card-image img {
  transform: scale(1.05);
}

.card-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  background: var(--mint-green);
  color: var(--deep-navy);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: var(--ls-wide);
}

.card-content {
  padding: var(--space-4);
}

.listing-title {
  font-size: var(--text-body-lg);
  font-weight: var(--font-semibold);
  color: var(--deep-navy);
  margin-bottom: var(--space-2);
  line-height: var(--line-height-heading);
}

.listing-meta {
  font-size: var(--text-sm);
  color: var(--cool-gray);
  margin-bottom: var(--space-2);
}

.listing-price {
  font-size: var(--text-body-lg);
  font-weight: var(--font-bold);
  color: var(--charcoal);
}
```

---

## 4. Page Sections

### 4.1 Hero Section (Apple-Inspired)

```html
<section className="hero">
  <div className="hero-background">
    <img src="detty-hero.jpg" alt="" className="hero-image" />
    <div className="hero-overlay"></div>
  </div>

  <div className="hero-content container">
    <h1 className="hero-title">
      Detty December,<br/>
      all in one place.
    </h1>
    <p className="hero-subtitle">
      Skip the DM chaos. Plan your December with real listings
      and a community that gets it.
    </p>

    <!-- Email Capture -->
    <div className="hero-cta">
      <div className="email-capture">
        <!-- Email form here -->
      </div>
    </div>
  </div>

  <div className="scroll-indicator">
    <span>Scroll to explore</span>
    <svg className="scroll-arrow"><!-- Arrow icon --></svg>
  </div>
</section>
```

```css
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(26, 26, 46, 0.3) 0%,
    rgba(26, 26, 46, 0.6) 100%
  );
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: white;
  padding: var(--space-12) var(--space-5);
}

.hero-title {
  font-size: var(--text-hero);
  font-weight: var(--font-black);
  line-height: var(--line-height-tight);
  letter-spacing: var(--ls-tight);
  margin-bottom: var(--space-5);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: var(--text-body-lg);
  line-height: var(--line-height-body);
  max-width: 600px;
  margin: 0 auto var(--space-8);
  opacity: 0.95;
}

.hero-cta {
  max-width: 480px;
  margin: 0 auto;
}

.scroll-indicator {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  color: white;
  font-size: var(--text-sm);
  opacity: 0.8;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-8px); }
}

.scroll-arrow {
  width: 20px;
  height: 20px;
}
```

### 4.2 Section Template (Stripe-Inspired Spacing)

```html
<section className="section section--light">
  <div className="container">
    <div className="section-header">
      <h2 className="section-title">How It Works</h2>
      <p className="section-subtitle">
        Three simple steps to your unforgettable December
      </p>
    </div>

    <div className="section-content">
      <!-- Content grid here -->
    </div>
  </div>
</section>
```

```css
.section {
  padding: var(--space-16) 0;  /* 120px top/bottom */
}

.section--light {
  background: var(--light-gray);
}

.section--dark {
  background: var(--deep-navy);
  color: white;
}

.section-header {
  text-align: center;
  max-width: 800px;
  margin: 0 auto var(--space-12);
}

.section-title {
  font-size: var(--text-h1);
  font-weight: var(--font-bold);
  color: var(--deep-navy);
  line-height: var(--line-height-heading);
  margin-bottom: var(--space-4);
}

.section--dark .section-title {
  color: white;
}

.section-subtitle {
  font-size: var(--text-body-lg);
  color: var(--charcoal);
  line-height: var(--line-height-body);
}

.section--dark .section-subtitle {
  color: rgba(255, 255, 255, 0.8);
}

.section-content {
  /* Content-specific styling */
}
```

### 4.3 Navigation (Apple Minimalism)

```html
<header className="header">
  <div className="container">
    <nav className="nav">
      <a href="/" className="nav-logo">
        <img src="logo.svg" alt="OneDettyDecember" />
      </a>

      <ul className="nav-links">
        <li><a href="#how">How It Works</a></li>
        <li><a href="#travelers">For Travelers</a></li>
        <li><a href="#hosts">For Hosts</a></li>
        <li><a href="#faq">FAQ</a></li>
      </ul>

      <button className="btn-primary nav-cta">
        Get Early Access
      </button>

      <button className="nav-toggle" aria-label="Menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </nav>
  </div>
</header>
```

```css
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: transparent;
  transition: all 300ms ease;
}

.header.scrolled {
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  transition: height 300ms ease;
}

.header.scrolled .nav {
  height: 64px;
}

.nav-logo img {
  height: 40px;
  width: auto;
  transition: height 300ms ease;
}

.header.scrolled .nav-logo img {
  height: 32px;
}

.nav-links {
  display: none;
  list-style: none;
  gap: var(--space-8);
}

@media (min-width: 1024px) {
  .nav-links {
    display: flex;
  }
}

.nav-links a {
  color: white;
  font-size: var(--text-body);
  font-weight: var(--font-semibold);
  text-decoration: none;
  transition: color 200ms ease;
}

.header.scrolled .nav-links a {
  color: var(--deep-navy);
}

.nav-links a:hover {
  color: var(--brand-orange);
}

.nav-cta {
  display: none;
}

@media (min-width: 1024px) {
  .nav-cta {
    display: block;
  }
}

.nav-toggle {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
}

@media (min-width: 1024px) {
  .nav-toggle {
    display: none;
  }
}

.nav-toggle span {
  width: 24px;
  height: 2px;
  background: white;
  border-radius: 2px;
  transition: all 200ms ease;
}

.header.scrolled .nav-toggle span {
  background: var(--deep-navy);
}
```

---

## 5. Cultural Design Elements (Subtle Integration)

### 5.1 Pattern Overlays (10-20% Opacity - Per Brand Guide)

```css
.pattern-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/patterns/ankara-geometric.svg');
  background-size: 300px;
  background-repeat: repeat;
  opacity: 0.08;  /* Very subtle */
  mix-blend-mode: multiply;
  pointer-events: none;
}

/* Usage Example */
.section-with-pattern {
  position: relative;
}

.section-with-pattern::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('/patterns/kente-border.svg') repeat-x top;
  opacity: 0.12;
  height: 8px;
}
```

### 5.2 Cultural Accent (Minimal Use)

```html
<section className="value-prop">
  <div className="container">
    <div className="accent-border"></div>
    <h2>Your people. Your music. Your December to remember.</h2>
    <p className="pidgin-accent">"No wahala, we dey together"</p>
  </div>
</section>
```

```css
.accent-border {
  width: 80px;
  height: 4px;
  background: linear-gradient(
    90deg,
    var(--brand-orange) 0%,
    var(--golden-yellow) 50%,
    var(--turquoise) 100%
  );
  margin: 0 auto var(--space-6);
  border-radius: 2px;
}

.pidgin-accent {
  font-style: italic;
  color: var(--cool-gray);
  font-size: var(--text-body);
  margin-top: var(--space-4);
}
```

---

## 6. Animation & Micro-interactions

### 6.1 Scroll-Triggered Animations (Airbnb/Apple Style)

```css
/* Fade in from bottom */
.fade-in {
  opacity: 0;
  transform: translateY(30px);
  transition: all 800ms cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger children */
.stagger-parent > * {
  opacity: 0;
  transform: translateY(20px);
  transition: all 600ms cubic-bezier(0.4, 0, 0.2, 1);
}

.stagger-parent.visible > *:nth-child(1) { transition-delay: 0ms; }
.stagger-parent.visible > *:nth-child(2) { transition-delay: 100ms; }
.stagger-parent.visible > *:nth-child(3) { transition-delay: 200ms; }

.stagger-parent.visible > * {
  opacity: 1;
  transform: translateY(0);
}
```

```javascript
// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // Animate once
    }
  });
}, observerOptions);

// Apply to elements
document.querySelectorAll('.fade-in, .stagger-parent').forEach(el => {
  observer.observe(el);
});
```

### 6.2 Hover States (Subtle)

```css
/* Card hover - Airbnb style */
.card {
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

/* Button hover - Stripe style */
.button {
  transition: all 200ms ease;
}

.button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

---

## 7. Performance Optimization

### 7.1 Critical CSS (Inline in `<head>`)

```html
<!-- Inline only above-the-fold styles (~10KB max) -->
<style>
  /* Reset */
  * { margin: 0; padding: 0; box-sizing: border-box; }

  /* Typography */
  body {
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    line-height: 1.7;
    color: #2C2C3A;
  }

  /* Hero section */
  .hero { /* Critical hero styles */ }
  .btn-primary { /* Critical button styles */ }

  /* Load rest async */
</style>

<!-- Async load full CSS -->
<link rel="preload" href="/css/main.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="/css/main.css"></noscript>
```

### 7.2 Image Optimization

```jsx
// Next.js Image Component
import Image from 'next/image';

<Image
  src="/hero-lagos.jpg"
  alt="Detty December Lagos"
  width={1920}
  height={1080}
  priority  // Above-the-fold
  quality={80}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
  sizes="100vw"
/>

// Lazy loading for below-fold images
<Image
  src="/event-card.jpg"
  alt="Event"
  width={800}
  height={600}
  loading="lazy"
  quality={75}
/>
```

### 7.3 Font Optimization

```html
<!-- Preconnect to Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Load only needed weights -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet">

<!-- Or self-host for better performance -->
<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
```

---

## 8. Accessibility Standards

### 8.1 Keyboard Navigation

```css
/* Focus-visible (not focus) */
:focus-visible {
  outline: 3px solid var(--brand-orange);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Skip to main content */
.skip-link {
  position: absolute;
  top: -100px;
  left: 0;
  background: var(--brand-orange);
  color: white;
  padding: 12px 24px;
  text-decoration: none;
  z-index: 1000;
}

.skip-link:focus {
  top: 0;
}
```

### 8.2 ARIA Labels

```html
<!-- Form labels -->
<div className="form-field">
  <label for="email" className="sr-only">Email address</label>
  <input
    id="email"
    type="email"
    aria-label="Email address"
    aria-required="true"
    aria-invalid="false"
    aria-describedby="email-error"
  />
  <span id="email-error" role="alert" aria-live="polite">
    <!-- Error message -->
  </span>
</div>

<!-- Button states -->
<button
  aria-label="Get early access to OneDettyDecember"
  aria-pressed="false"
  aria-busy="false"
>
  Get Early Access
</button>

<!-- Screen reader only text -->
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## 9. Developer Handoff Package

### 9.1 Design Tokens (CSS Variables)

```css
/* tokens.css - Import this first */
:root {
  /* Colors */
  --brand-orange: #FF6B35;
  --deep-navy: #1A1A2E;
  --golden-yellow: #FFC857;
  --white: #FFFFFF;
  --light-gray: #F5F5F7;
  --charcoal: #2C2C3A;
  --cool-gray: #7A7A8C;
  --mint-green: #06FFA5;
  --vibrant-coral: #E63946;
  --turquoise: #4ECDC4;

  /* Typography */
  --font-family: 'Inter', -apple-system, 'Segoe UI', sans-serif;
  --font-regular: 400;
  --font-semibold: 600;
  --font-bold: 700;
  --font-black: 900;

  /* Type Scale */
  --text-hero: 3.5rem;
  --text-h1: 2.5rem;
  --text-h2: 2rem;
  --text-h3: 1.5rem;
  --text-body-lg: 1.125rem;
  --text-body: 1rem;
  --text-sm: 0.875rem;
  --text-xs: 0.75rem;

  /* Line Heights */
  --line-height-tight: 1.1;
  --line-height-heading: 1.3;
  --line-height-body: 1.7;
  --line-height-small: 1.5;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.5rem;
  --space-6: 2rem;
  --space-8: 3rem;
  --space-10: 4rem;
  --space-12: 5rem;
  --space-16: 7.5rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
  --shadow-xl: 0 12px 32px rgba(0, 0, 0, 0.16);

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;

  /* Transitions */
  --transition-fast: 200ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 400ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Desktop adjustments */
@media (min-width: 1024px) {
  :root {
    --text-hero: 6rem;
    --text-h1: 3.5rem;
    --text-h2: 2.5rem;
    --text-body-lg: 1.25rem;
  }
}
```

### 9.2 Component Checklist

**For Each Component, Ensure:**
- [ ] Mobile-first responsive (320px+)
- [ ] Keyboard accessible (tab navigation)
- [ ] ARIA labels where needed
- [ ] Focus states visible
- [ ] Hover states subtle (2-4px transform max)
- [ ] Loading states defined
- [ ] Error states styled
- [ ] Uses design tokens (CSS variables)
- [ ] Transitions 200-300ms max
- [ ] Works without JavaScript (progressive enhancement)

### 9.3 Testing Requirements

```javascript
// Performance Budget
const performanceBudget = {
  LCP: 2500,        // Largest Contentful Paint < 2.5s
  FID: 100,         // First Input Delay < 100ms
  CLS: 0.1,         // Cumulative Layout Shift < 0.1
  TTI: 3500,        // Time to Interactive < 3.5s
  FCP: 1800,        // First Contentful Paint < 1.8s
};

// Lighthouse CI config
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      numberOfRuns: 3,
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
      },
    },
  },
};
```

---

## 10. Reference Examples from Analyzed Sites

### Airbnb Patterns Used
✅ **Search box as hero element** - Email capture in hero
✅ **Card-based listings** - Experience/vendor cards
✅ **Horizontal scroll categories** - City selection on mobile
✅ **Generous card shadows** - Depth without heaviness
✅ **Aspect ratio preservation** - 4:3 image containers

### Stripe Patterns Used
✅ **Minimal color palette** - Orange + Navy + Neutrals only
✅ **8px spacing grid** - Consistent, predictable spacing
✅ **Large line-height** - 1.7 for body text
✅ **Subtle animations** - 200-300ms transitions
✅ **Professional forms** - Clean inputs with subtle shadows

### Apple Patterns Used
✅ **Generous white space** - 80-120px between sections
✅ **Large typography** - 96px hero headlines
✅ **Minimal navigation** - 4 items max
✅ **Product-focused sections** - Image/text alternation
✅ **Scroll-triggered reveals** - Fade in as you scroll
✅ **Sticky header shrink** - 80px → 64px on scroll

---

## 11. Implementation Timeline (4 Weeks)

### Week 1: Foundation
- [ ] Set up Next.js + TypeScript + Tailwind (or vanilla CSS)
- [ ] Implement design tokens (CSS variables)
- [ ] Create base components (Button, Input, Card)
- [ ] Configure Supabase database
- [ ] Set up analytics (GA4, Mixpanel)

### Week 2: Core Pages
- [ ] Build Hero section with email capture
- [ ] Implement navigation (header + mobile menu)
- [ ] Create section templates
- [ ] Build traveler flow
- [ ] Build vendor flow

### Week 3: Polish & Optimize
- [ ] Add scroll animations
- [ ] Implement lazy loading
- [ ] Optimize images (WebP, Next/Image)
- [ ] Add loading states
- [ ] Error handling
- [ ] Form validation

### Week 4: Test & Launch
- [ ] Cross-browser testing
- [ ] Mobile device testing (real devices)
- [ ] Accessibility audit (WAVE, axe)
- [ ] Performance optimization (Lighthouse)
- [ ] Security review
- [ ] Deploy to production

---

## 12. Key Differences from v1 Guide

### Removed (Too Complex/Not Brand-Aligned)
- ❌ Bebas Neue font (brand uses Inter only)
- ❌ Gradient backgrounds on buttons
- ❌ 100px pill-shaped buttons
- ❌ Multiple emoji selections in forms
- ❌ Auto-playing music
- ❌ Heavy confetti animations
- ❌ Using all secondary colors simultaneously

### Added (Simplified & Brand-Accurate)
- ✅ Actual brand guidelines colors (Deep Navy #1A1A2E, Brand Orange #FF6B35)
- ✅ Apple-level generous spacing (80-120px sections)
- ✅ Stripe-inspired form simplicity
- ✅ Airbnb card patterns
- ✅ Larger body text (18px vs 16px)
- ✅ Subtle cultural patterns (10-20% opacity)
- ✅ Single-field email capture (not multi-step initially)
- ✅ Professional button design (8px radius, not pills)

---

## Quick Reference Card for Developers

```
COLORS:        Orange #FF6B35 | Navy #1A1A2E | Gray #F5F5F7
FONT:          Inter (400, 600, 700, 900)
SIZES:         96px Hero | 48px H1 | 18px Body
SPACING:       80-120px sections | 8px grid
ANIMATIONS:    200-300ms | translateY max 4px
BREAKPOINTS:   744px tablet | 1024px desktop
CONTAINER:     1200px max-width | 64px gutters
BUTTONS:       56px height | 8px radius | Orange
FORMS:         Simple, single-field first
CARDS:         12px radius | Subtle shadow
```

---

*This guide prioritizes world-class simplicity while maintaining cultural authenticity. When in doubt, choose simplicity.*