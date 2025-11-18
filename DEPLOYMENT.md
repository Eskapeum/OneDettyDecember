# OneDettyDecember Deployment Guide

> Complete guide for deploying OneDettyDecember to Vercel with CI/CD automation

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Vercel Setup](#vercel-setup)
3. [Environment Variables](#environment-variables)
4. [CI/CD Pipelines](#cicd-pipelines)
5. [Monitoring & Error Tracking](#monitoring--error-tracking)
6. [Deployment Process](#deployment-process)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Prerequisites

Before deploying, ensure you have:

- ✅ GitHub repository set up
- ✅ Vercel account created
- ✅ Supabase project configured
- ✅ Stripe test/production keys
- ✅ Paystack test/production keys
- ✅ Sentry project created (optional but recommended)

---

## 🚀 Vercel Setup

### Step 1: Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your GitHub repository: `OneDettyDecember`
4. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

5. Click **"Deploy"** (first deployment will fail - this is expected)

### Step 2: Configure Vercel CLI (Optional)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Link project to local directory
vercel link

# Pull environment variables (after setting them up)
vercel env pull .env.local
```

---

## 🔐 Environment Variables

### Required Variables

Add these in **Vercel Dashboard → Settings → Environment Variables**:

#### Database & Auth
```bash
DATABASE_URL="postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[project-id].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
```

#### Authentication
```bash
NEXTAUTH_URL="https://onedettydecember.com"
NEXTAUTH_SECRET="your-nextauth-secret-32-chars-min"
```

#### Payment Providers
```bash
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Paystack
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_live_..."
PAYSTACK_SECRET_KEY="sk_live_..."
```

#### Error Tracking (Optional)
```bash
NEXT_PUBLIC_SENTRY_DSN="https://...@sentry.io/..."
SENTRY_ORG="your-org-slug"
SENTRY_PROJECT="onedettydecember"
SENTRY_AUTH_TOKEN="your-auth-token"
```

#### Analytics (Optional)
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_POSTHOG_KEY="phc_..."
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"
```

#### Email (Optional)
```bash
RESEND_API_KEY="re_..."
EMAIL_FROM="hello@onedettydecember.com"
```

### Environment-Specific Variables

**Production:**
- Set for: `Production` environment
- Use production API keys and URLs

**Preview:**
- Set for: `Preview` environment
- Use test/staging API keys

**Development:**
- Set for: `Development` environment (optional)
- Use development API keys

### Important Notes

⚠️ **Never commit `.env.local` to Git**
⚠️ **Use different keys for Production vs Preview**
⚠️ **Rotate secrets regularly**

---

## 🔄 CI/CD Pipelines

We have 4 automated workflows:

### 1. **CI Pipeline** (`ci.yml`)
**Trigger:** Push/PR to `main` or `develop`

**Jobs:**
- Lint & Type Check (ESLint, TypeScript, Prettier)
- Build verification
- Test execution (when tests are added)

**Status:** Required for all PRs

### 2. **Deploy to Production** (`deploy-production.yml`)
**Trigger:** Push to `main` branch

**Process:**
1. Run CI checks
2. Build application with production env vars
3. Deploy to Vercel production
4. Comment deployment URL on commit
5. Notify success/failure

**URL:** `https://onedettydecember.com`

### 3. **Deploy Preview** (`deploy-preview.yml`)
**Trigger:** PR to `main` or `develop`

**Process:**
1. Run CI checks
2. Build application with preview env vars
3. Deploy to Vercel preview
4. Run Lighthouse CI performance tests
5. Comment preview URL + performance results on PR

**URL:** `https://onedettydecember-pr-[number].vercel.app`

### 4. **Lighthouse CI** (`lighthouse.yml`)
**Trigger:** PR to `main` or `develop`

**Tests:**
- Performance score (target: 85+)
- Accessibility score (target: 90+)
- Best Practices score (target: 90+)
- SEO score (target: 90+)
- Core Web Vitals (LCP, CLS, TBT)

**Reports:** Available in workflow artifacts

---

## 📊 Monitoring & Error Tracking

### Sentry Configuration

**Production:**
- Error tracking enabled
- Performance monitoring: 10% sample rate
- Session replay: 10% sample rate
- Replay on error: 100% sample rate

**Preview/Development:**
- Error tracking enabled
- Performance monitoring: 100% sample rate
- Session replay: 100% sample rate

### Accessing Sentry

1. Go to [Sentry Dashboard](https://sentry.io)
2. Select project: `onedettydecember`
3. View:
   - **Issues:** Error reports
   - **Performance:** Transaction traces
   - **Replays:** User session recordings

### Sentry Alerts

Configure alerts for:
- High error rate (>10 errors/min)
- Performance regression (>2s response time)
- Critical errors (500 status codes)

---

## 🚢 Deployment Process

### Production Deployment

**Automatic:**
```bash
# 1. Create PR with your changes
git checkout -b feature/my-feature
git add .
git commit -m "Add new feature"
git push origin feature/my-feature

# 2. Open PR on GitHub to main branch
# 3. Review preview deployment
# 4. Get approval from team
# 5. Merge PR
# 6. Production deployment triggers automatically
```

**Manual (Emergency):**
```bash
# Deploy current branch to production
vercel --prod

# Deploy specific commit
git checkout [commit-hash]
vercel --prod
```

### Preview Deployment

**Automatic:**
- Every PR gets a preview deployment
- Preview URL commented on PR
- Lighthouse results shared

**Manual:**
```bash
# Deploy current branch to preview
vercel

# Deploy specific branch
git checkout feature/test
vercel
```

### Rollback

**Option 1: Vercel Dashboard**
1. Go to Deployments
2. Find previous working deployment
3. Click **"..."** → **"Promote to Production"**

**Option 2: Git Revert**
```bash
# Revert to previous commit
git revert [commit-hash]
git push origin main
# Automatic deployment triggers
```

**Option 3: Redeploy**
```bash
# Redeploy specific commit
vercel --prod --force
```

---

## 🔧 GitHub Repository Secrets

Add these secrets in **GitHub Settings → Secrets and variables → Actions**:

### Required Secrets

```bash
VERCEL_TOKEN          # Vercel API token
VERCEL_ORG_ID         # Vercel organization ID
VERCEL_PROJECT_ID     # Vercel project ID
```

### Optional Secrets

```bash
SENTRY_AUTH_TOKEN     # For source map uploads
LIGHTHOUSE_TOKEN      # For Lighthouse CI
```

### Getting Vercel Tokens

1. Go to [Vercel Account Settings → Tokens](https://vercel.com/account/tokens)
2. Create new token: **"GitHub Actions Deploy"**
3. Copy token and add to GitHub secrets

### Getting Vercel IDs

```bash
# Install Vercel CLI
npm install -g vercel

# Link project
vercel link

# Get project info
cat .vercel/project.json
```

Copy `orgId` and `projectId` to GitHub secrets.

---

## 🧪 Testing Deployments

### Before Production

1. **Test Preview Deployment:**
   - Create PR
   - Wait for preview deployment
   - Test all critical flows:
     - ✅ Homepage loads
     - ✅ Package browsing works
     - ✅ Authentication works
     - ✅ Booking flow works
     - ✅ Payment processing works

2. **Check Lighthouse Scores:**
   - Review performance metrics
   - Ensure scores meet targets
   - Fix any critical issues

3. **Review Sentry (if enabled):**
   - Check for errors in preview
   - Verify monitoring is working

4. **Manual QA:**
   - Test on mobile devices
   - Test different browsers
   - Verify responsive design

### After Production

1. **Smoke Tests:**
   ```bash
   # Test homepage
   curl https://onedettydecember.com

   # Test API health
   curl https://onedettydecember.com/api/health
   ```

2. **Monitor Sentry:**
   - Watch for error spike
   - Check performance metrics

3. **Verify Critical Paths:**
   - Login/Signup
   - Package search
   - Booking flow
   - Payment processing

---

## 🐛 Troubleshooting

### Build Failures

**Issue:** Build fails with "Module not found"
```bash
# Solution: Clear cache and rebuild
vercel --force

# Or in GitHub Actions: Re-run workflow
```

**Issue:** Environment variables not found
```bash
# Solution: Verify variables are set in Vercel
# Check spelling and environment (Production/Preview)
```

### Deployment Failures

**Issue:** "No Space left on device"
```bash
# Solution: Optimize build output
# Add to next.config.ts:
experimental: {
  outputFileTracingIncludes: {
    '/*': ['./node_modules/**/*.wasm'],
  },
}
```

**Issue:** Vercel deployment timeout
```bash
# Solution: Reduce build time
# 1. Use npm ci instead of npm install
# 2. Enable Next.js caching
# 3. Reduce bundle size
```

### Database Connection Issues

**Issue:** "P1001: Can't reach database server"
```bash
# Solutions:
1. Check DATABASE_URL is correct
2. Verify Supabase project is not paused
3. Check IP allowlist (Vercel IPs should be allowed)
4. Test connection: npx prisma studio
```

### Sentry Not Logging Errors

**Issue:** Errors not appearing in Sentry
```bash
# Solutions:
1. Verify NEXT_PUBLIC_SENTRY_DSN is set
2. Check DSN is correct
3. Ensure Sentry configs are loaded
4. Test: throw new Error('Test') in your code
```

### Performance Issues

**Issue:** Slow page loads
```bash
# Solutions:
1. Enable Next.js Image Optimization
2. Implement code splitting
3. Add loading states
4. Use React.lazy() for heavy components
5. Enable ISR for static pages
```

---

## 📈 Performance Optimization

### Next.js Configuration

```typescript
// next.config.ts
const nextConfig = {
  // Enable optimizations
  swcMinify: true,
  compress: true,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },

  // Bundle analyzer (development only)
  webpack: (config, { dev }) => {
    if (dev) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'disabled',
          generateStatsFile: true,
        })
      )
    }
    return config
  },
}
```

### Caching Strategy

```typescript
// Example: ISR for package pages
export const revalidate = 3600 // 1 hour

// Example: Cache API responses
export const dynamic = 'force-dynamic'
export const revalidate = 0 // No caching for auth routes
```

---

## 🔒 Security Best Practices

### Before Deployment

- [ ] Remove console.logs
- [ ] Disable debug mode
- [ ] Verify environment variables
- [ ] Check for exposed secrets
- [ ] Run security audit: `npm audit`
- [ ] Test rate limiting
- [ ] Verify CORS settings
- [ ] Check CSP headers

### Content Security Policy

```typescript
// middleware.ts
export function middleware(request: Request) {
  const headers = new Headers(request.headers)

  headers.set('X-Frame-Options', 'DENY')
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('Referrer-Policy', 'origin-when-cross-origin')
  headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  )

  return NextResponse.next({ headers })
}
```

---

## 📞 Support & Resources

### Vercel Documentation
- [Next.js Deployment](https://vercel.com/docs/frameworks/nextjs)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [CLI Reference](https://vercel.com/docs/cli)

### Sentry Documentation
- [Next.js Integration](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Performance Monitoring](https://docs.sentry.io/product/performance/)
- [Session Replay](https://docs.sentry.io/product/session-replay/)

### Lighthouse CI
- [GitHub Action](https://github.com/treosh/lighthouse-ci-action)
- [Configuration](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md)

---

## ✅ Pre-Deployment Checklist

### First Deployment
- [ ] Vercel project created
- [ ] Environment variables configured
- [ ] GitHub secrets added
- [ ] Sentry project created
- [ ] Database migrated
- [ ] Test deployment successful
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active

### Every Deployment
- [ ] Code reviewed
- [ ] Tests passing
- [ ] Preview deployment tested
- [ ] Lighthouse scores acceptable
- [ ] No Sentry errors
- [ ] Stakeholders notified
- [ ] Rollback plan ready

---

## 🎯 Quick Reference

### Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View deployment logs
vercel logs [deployment-url]

# Pull environment variables
vercel env pull

# Link project
vercel link
```

### URLs

- **Production:** https://onedettydecember.com
- **Preview:** https://onedettydecember-[hash].vercel.app
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Sentry Dashboard:** https://sentry.io
- **GitHub Actions:** https://github.com/[user]/OneDettyDecember/actions

---

**Deployment Status:** ✅ Ready for Production
**Last Updated:** Sprint 0 Day 1 - November 18, 2025
**Maintained by:** DevOps Team (Daniel)
