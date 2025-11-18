# CDN & Image Optimization Guide

> Comprehensive guide for CDN configuration and image optimization in OneDettyDecember

## 📋 Table of Contents

- [Overview](#overview)
- [CDN Configuration](#cdn-configuration)
- [Image Optimization](#image-optimization)
- [Caching Strategy](#caching-strategy)
- [Performance Metrics](#performance-metrics)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

Our CDN and image optimization strategy focuses on:
- **Fast content delivery** via Vercel's global edge network
- **Automatic image optimization** with WebP/AVIF formats
- **Aggressive caching** with stale-while-revalidate
- **Responsive images** for all device sizes
- **Lazy loading** for below-the-fold content

### Performance Goals
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- Time to Interactive (TTI): < 3.5s

---

## 🌐 CDN Configuration

### Vercel Edge Network

OneDettyDecember is deployed on **Vercel**, which provides:
- ✅ 100+ edge locations globally
- ✅ Automatic SSL/TLS certificates
- ✅ HTTP/2 and HTTP/3 support
- ✅ Built-in DDoS protection
- ✅ Edge caching with custom rules

### Cache Control Headers

Our caching strategy uses multiple cache layers:

#### 1. Static Assets (1 year)
```
Cache-Control: public, max-age=31536000, immutable
```
- **Applies to:** `/_next/static/*`, fonts (woff, woff2)
- **Reasoning:** These files never change (content-hashed)
- **Benefits:** Maximum caching, minimal origin requests

#### 2. Optimized Images (1 month)
```
Cache-Control: public, max-age=2592000, s-maxage=2592000, stale-while-revalidate=86400
```
- **Applies to:** `/_next/image`, image files
- **Reasoning:** Images change infrequently
- **Benefits:** Long caching with background revalidation

#### 3. Package API (5 minutes)
```
Cache-Control: public, max-age=300, s-maxage=300, stale-while-revalidate=60
```
- **Applies to:** `/api/packages`
- **Reasoning:** Package data updates periodically
- **Benefits:** Fresh data with instant stale responses

#### 4. Search API (2 minutes)
```
Cache-Control: public, max-age=120, s-maxage=120, stale-while-revalidate=30
```
- **Applies to:** `/api/search`
- **Reasoning:** Search results should be relatively fresh
- **Benefits:** Fast search with cached common queries

#### 5. Pages (5 minutes)
```
Cache-Control: public, max-age=300, s-maxage=300, stale-while-revalidate=60
```
- **Applies to:** `/`, `/packages/*`
- **Reasoning:** Pages update when content changes
- **Benefits:** Fast page loads with background updates

### Understanding Cache Directives

| Directive | Description |
|-----------|-------------|
| `public` | Can be cached by CDN and browsers |
| `private` | Only cached by browsers, not CDN |
| `max-age=N` | Browser cache duration (seconds) |
| `s-maxage=N` | CDN cache duration (seconds) |
| `stale-while-revalidate=N` | Serve stale content while fetching fresh (seconds) |
| `immutable` | Content never changes, skip revalidation |
| `no-store` | Never cache |
| `must-revalidate` | Always check with origin before serving |

### Vercel Configuration (`vercel.json`)

```json
{
  "regions": ["iad1"],
  "functions": {
    "api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

**Key Settings:**
- `regions`: Primary region (US East - IAD1)
- `memory`: 1GB per function
- `maxDuration`: 10s timeout for API routes

---

## 🖼️ Image Optimization

### Next.js Image Component

Always use the Next.js `<Image>` component for automatic optimization:

```tsx
import Image from 'next/image'
import { ImagePresets, getShimmerPlaceholder } from '@/lib/image-optimization'

// Package card example
<Image
  src="/images/package-1.jpg"
  alt="Beach Paradise Package"
  {...ImagePresets.packageCard}
  placeholder="blur"
  blurDataURL={getShimmerPlaceholder(400, 300)}
/>
```

### Image Formats

Next.js automatically serves modern formats:

1. **AVIF** (best compression, ~30% smaller than WebP)
   - Served to browsers that support it
   - Safari 16+, Chrome 85+, Firefox 93+

2. **WebP** (fallback, ~25% smaller than JPEG)
   - Served to browsers without AVIF support
   - Safari 14+, Chrome 23+, Firefox 65+

3. **JPEG/PNG** (final fallback)
   - Original format for older browsers

### Image Presets

Use predefined presets for consistency:

```typescript
import { ImagePresets } from '@/lib/image-optimization'

// Package card (400x300)
<Image {...ImagePresets.packageCard} src={src} alt={alt} />

// Package hero (1200x600)
<Image {...ImagePresets.packageHero} src={src} alt={alt} />

// Thumbnail (150x150)
<Image {...ImagePresets.thumbnail} src={src} alt={alt} />

// Avatar (80x80)
<Image {...ImagePresets.avatar} src={src} alt={alt} />

// Full hero (1920x1080)
<Image {...ImagePresets.hero} src={src} alt={alt} />

// Gallery (800x600)
<Image {...ImagePresets.gallery} src={src} alt={alt} />
```

### Responsive Images

Images automatically generate multiple sizes:

```tsx
<Image
  src="/package.jpg"
  alt="Package"
  width={800}
  height={600}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
/>
```

**Device Sizes (configured in `next.config.ts`):**
- 640px (mobile)
- 750px (mobile landscape)
- 828px (tablet portrait)
- 1080px (tablet landscape)
- 1200px (small desktop)
- 1920px (desktop)
- 2048px (large desktop)
- 3840px (4K displays)

### Lazy Loading

Images below the fold are automatically lazy-loaded:

```tsx
// Above the fold - load immediately
<Image src={heroImage} alt="Hero" priority />

// Below the fold - lazy load
<Image src={packageImage} alt="Package" loading="lazy" />
```

### Blur Placeholders

Use blur placeholders to prevent layout shift:

```tsx
import { getShimmerPlaceholder } from '@/lib/image-optimization'

<Image
  src={packageImage}
  alt="Package"
  width={400}
  height={300}
  placeholder="blur"
  blurDataURL={getShimmerPlaceholder(400, 300)}
/>
```

### External Images

For Supabase Storage or Unsplash:

```tsx
// next.config.ts already configured for:
// - **.supabase.co
// - images.unsplash.com

<Image
  src="https://images.unsplash.com/photo-123"
  alt="Package"
  width={800}
  height={600}
  loader={imageLoader}
/>
```

---

## 💾 Caching Strategy

### Multi-Layer Caching

```
┌─────────────────────────────────────────────┐
│ Browser Cache (max-age)                     │
│ - Static: 1 year                            │
│ - Images: 1 week                            │
│ - Pages: 5 minutes                          │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ CDN Cache (s-maxage)                        │
│ - Static: 1 year                            │
│ - Images: 1 month                           │
│ - API: 2-5 minutes                          │
│ - Pages: 5 minutes                          │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ Application Cache (in-memory)               │
│ - Database queries: 5 minutes               │
│ - API responses: 2 minutes                  │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ Database (Supabase)                         │
└─────────────────────────────────────────────┘
```

### Stale-While-Revalidate

This directive provides the best user experience:

```
User Request → CDN has stale cache → Serve stale instantly
                                    ↓
                            Fetch fresh in background
                                    ↓
                            Update cache for next request
```

**Benefits:**
- Instant response (no waiting)
- Fresh content (background update)
- Reduced origin load

**Example:**
```
Cache-Control: public, max-age=300, s-maxage=300, stale-while-revalidate=60
```
- Cache for 5 minutes
- If 5-6 minutes old: serve stale, update in background
- If > 6 minutes old: wait for fresh response

### Cache Invalidation

#### Automatic Invalidation
- Static assets: Never (immutable, content-hashed)
- Images: After 30 days (minimumCacheTTL)
- API responses: After TTL expires

#### Manual Invalidation
```typescript
import { cacheManager } from '@/lib/cache'

// Invalidate by tag
cacheManager.invalidateByTag('packages')

// Invalidate specific key
cacheManager.delete('packages:featured')

// Clear all cache
cacheManager.clear()
```

#### On-Demand Revalidation
```typescript
// In API route
import { revalidatePath } from 'next/cache'

export async function POST(request: Request) {
  // Update data...

  // Revalidate the path
  revalidatePath('/packages')

  return Response.json({ revalidated: true })
}
```

---

## 📊 Performance Metrics

### Measuring CDN Performance

#### 1. Vercel Analytics
```bash
# Add to your app
npm install @vercel/analytics
```

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

#### 2. Check Cache Headers
```bash
# Test cache headers
curl -I https://onedettydecember.com/packages

# Expected response:
# Cache-Control: public, max-age=300, s-maxage=300, stale-while-revalidate=60
# X-Vercel-Cache: HIT (or MISS, STALE)
```

#### 3. Lighthouse CI

Run Lighthouse tests to measure performance:
```bash
npm run load:smoke
```

**Target Scores:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 95+

### Key Performance Indicators

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Time to First Byte (TTFB) | < 600ms | TBD | ⏳ |
| First Contentful Paint | < 1.5s | TBD | ⏳ |
| Largest Contentful Paint | < 2.5s | TBD | ⏳ |
| Total Blocking Time | < 300ms | TBD | ⏳ |
| Cumulative Layout Shift | < 0.1 | TBD | ⏳ |
| Cache Hit Rate | > 80% | TBD | ⏳ |
| Image Load Time | < 1s | TBD | ⏳ |

---

## 💡 Best Practices

### DO ✅

1. **Always use Next.js Image component**
   ```tsx
   import Image from 'next/image'
   <Image src="/path" alt="Description" width={800} height={600} />
   ```

2. **Set explicit dimensions**
   ```tsx
   // Prevents layout shift
   <Image src="/path" alt="..." width={800} height={600} />
   ```

3. **Use priority for above-the-fold images**
   ```tsx
   <Image src="/hero.jpg" alt="Hero" priority />
   ```

4. **Provide meaningful alt text**
   ```tsx
   <Image src="/beach.jpg" alt="White sand beach with palm trees at sunset" />
   ```

5. **Use blur placeholders**
   ```tsx
   <Image
     src="/package.jpg"
     placeholder="blur"
     blurDataURL={shimmer}
   />
   ```

6. **Optimize original images before upload**
   - Use tools like Squoosh, ImageOptim, or sharp
   - Target: < 200KB per image
   - Resolution: 2x the display size max

### DON'T ❌

1. **Don't use regular `<img>` tags**
   ```tsx
   // ❌ Bad
   <img src="/package.jpg" alt="Package" />

   // ✅ Good
   <Image src="/package.jpg" alt="Package" width={800} height={600} />
   ```

2. **Don't load massive images**
   ```tsx
   // ❌ Bad - 5MB original
   <Image src="/huge-photo.jpg" width={400} height={300} />

   // ✅ Good - optimized to 200KB
   <Image src="/optimized-photo.jpg" width={400} height={300} />
   ```

3. **Don't skip alt text**
   ```tsx
   // ❌ Bad - fails accessibility
   <Image src="/package.jpg" alt="" />

   // ✅ Good
   <Image src="/package.jpg" alt="Beach resort package in Maldives" />
   ```

4. **Don't use priority for all images**
   ```tsx
   // ❌ Bad - defeats lazy loading
   <Image src="/image1.jpg" priority />
   <Image src="/image2.jpg" priority />
   <Image src="/image3.jpg" priority />

   // ✅ Good - only hero
   <Image src="/hero.jpg" priority />
   <Image src="/image1.jpg" loading="lazy" />
   <Image src="/image2.jpg" loading="lazy" />
   ```

5. **Don't hardcode image sizes in CSS**
   ```tsx
   // ❌ Bad - can cause layout shift
   <Image src="/img.jpg" className="w-full h-auto" />

   // ✅ Good - explicit dimensions
   <Image src="/img.jpg" width={800} height={600} className="w-full h-auto" />
   ```

### Performance Checklist

- [ ] All images use Next.js `<Image>` component
- [ ] Images have explicit width/height
- [ ] Above-the-fold images have `priority` prop
- [ ] Below-the-fold images lazy load
- [ ] All images have meaningful alt text
- [ ] Blur placeholders for package images
- [ ] Original images optimized (< 200KB)
- [ ] Using WebP/AVIF formats
- [ ] Responsive images with `sizes` prop
- [ ] Cache headers configured
- [ ] CDN headers verified
- [ ] Lighthouse score > 90

---

## 🐛 Troubleshooting

### Issue: Images not optimizing

**Symptoms:**
- Images loading as original format (JPEG/PNG)
- Large file sizes
- Slow load times

**Solutions:**
1. Check Next.js Image configuration:
   ```typescript
   // next.config.ts
   images: {
     formats: ['image/webp', 'image/avif'],
   }
   ```

2. Verify browser support:
   - AVIF: Safari 16+, Chrome 85+
   - WebP: Safari 14+, Chrome 23+

3. Check network tab in DevTools:
   - Look for `_next/image?url=...&w=...&q=...`
   - Verify `Content-Type: image/webp` or `image/avif`

### Issue: Poor cache hit rate

**Symptoms:**
- High origin requests
- Slow response times
- `X-Vercel-Cache: MISS` in headers

**Solutions:**
1. Check cache headers:
   ```bash
   curl -I https://onedettydecember.com/packages
   ```

2. Verify `Cache-Control` is set correctly

3. Check Vercel Analytics for cache hit rate

4. Ensure URLs are consistent (no dynamic query params)

### Issue: Layout shift (CLS)

**Symptoms:**
- Content jumping during page load
- Poor Lighthouse CLS score
- Janky user experience

**Solutions:**
1. Always set width/height:
   ```tsx
   <Image src="/img.jpg" width={800} height={600} />
   ```

2. Use blur placeholders:
   ```tsx
   <Image
     src="/img.jpg"
     placeholder="blur"
     blurDataURL={shimmer}
   />
   ```

3. Reserve space with aspect-ratio:
   ```css
   .image-container {
     aspect-ratio: 16 / 9;
   }
   ```

### Issue: Slow image load

**Symptoms:**
- Images take > 2s to load
- Poor LCP score
- Blank spaces during load

**Solutions:**
1. Reduce image file size (< 200KB)

2. Use priority for above-the-fold:
   ```tsx
   <Image src="/hero.jpg" priority />
   ```

3. Preload critical images:
   ```tsx
   import { preloadImage } from '@/lib/image-optimization'

   useEffect(() => {
     preloadImage('/hero.jpg')
   }, [])
   ```

4. Check CDN cache hit rate

### Issue: Images not loading from Supabase

**Symptoms:**
- 403 Forbidden errors
- Images not displaying
- CORS errors

**Solutions:**
1. Check Supabase Storage permissions:
   ```sql
   -- Allow public read access
   create policy "Public read access"
   on storage.objects for select
   using (bucket_id = 'packages');
   ```

2. Verify remote patterns in `next.config.ts`:
   ```typescript
   images: {
     remotePatterns: [
       {
         protocol: 'https',
         hostname: '**.supabase.co',
       },
     ],
   }
   ```

3. Check CORS configuration in Supabase

---

## 📈 Optimization Roadmap

### Phase 1: Foundation (Sprint 2) ✅
- [x] Configure Next.js Image optimization
- [x] Set up CDN cache headers
- [x] Implement responsive images
- [x] Add blur placeholders
- [x] Create image presets

### Phase 2: Enhancement (Sprint 3)
- [ ] Implement image lazy loading for galleries
- [ ] Add progressive image loading
- [ ] Optimize database images
- [ ] Set up image CDN (Cloudinary/Imgix)
- [ ] Create image upload pipeline with optimization

### Phase 3: Advanced (Sprint 4)
- [ ] Implement LQIP (Low Quality Image Placeholders)
- [ ] Add dominant color extraction
- [ ] Create image sitemap
- [ ] Implement art direction (different crops per device)
- [ ] Add WebP/AVIF fallbacks for older browsers

---

## 📝 Additional Resources

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Vercel CDN Caching](https://vercel.com/docs/edge-network/caching)
- [Web.dev Image Performance](https://web.dev/fast/#optimize-your-images)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

**Created:** Sprint 2
**Owner:** Daniel (DevOps)
**Last Updated:** November 18, 2025

🚀 **CDN optimized and ready!**
