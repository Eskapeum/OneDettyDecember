# Vercel Setup Guide - Quick Start

> 15-minute guide to deploy OneDettyDecember to Vercel

## 🚀 Quick Setup (15 minutes)

### Step 1: Create Vercel Account (2 min)
1. Go to https://vercel.com/signup
2. Sign up with GitHub
3. Authorize Vercel to access your repositories

### Step 2: Import Project (3 min)
1. Click **"Add New Project"**
2. Find `OneDettyDecember` repository
3. Click **"Import"**
4. Configure:
   - Framework: **Next.js** (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build` (auto-filled)
   - Output Directory: `.next` (auto-filled)

5. **Don't click Deploy yet!** → First, add environment variables

### Step 3: Add Environment Variables (10 min)

Click **"Environment Variables"** before deploying.

#### Copy-Paste Template

```bash
# Database & Auth
DATABASE_URL=postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Authentication
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=generate-32-char-secret

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Paystack
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
PAYSTACK_SECRET_KEY=sk_test_...

# Sentry (Optional)
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
SENTRY_ORG=your-org
SENTRY_PROJECT=onedettydecember
SENTRY_AUTH_TOKEN=your-token
```

**Important:**
- Set environment: **All** (Production, Preview, Development)
- Or set separately for Production and Preview with different keys

### Step 4: Deploy (Click Deploy!) 🚀

Your first deployment will start automatically after adding environment variables.

**Expected:**
- Build time: ~3-5 minutes
- Status: Hopefully success! ✅
- URL: `https://onedettydecember-[hash].vercel.app`

---

## 📱 Post-Deployment Steps

### 1. Configure Custom Domain (Optional)
1. Go to **Settings → Domains**
2. Add your domain: `onedettydecember.com`
3. Add DNS records (provided by Vercel)
4. Wait for SSL certificate (automatic)

### 2. Set Up GitHub Integration
1. Go to **Settings → Git**
2. Enable **Automatic Deployments**:
   - ✅ Production: `main` branch
   - ✅ Preview: All PRs
3. **Production Branch:** `main`

### 3. Configure Branch Protection
1. Go to GitHub → Settings → Branches
2. Add rule for `main`:
   - ✅ Require status checks (Vercel checks)
   - ✅ Require pull request reviews

### 4. Get Vercel Tokens for GitHub Actions
1. Go to **Account Settings → Tokens**
2. Create token: "GitHub Actions Deploy"
3. Copy token
4. Add to GitHub Secrets:
   - `VERCEL_TOKEN`: Your token
   - `VERCEL_ORG_ID`: From `.vercel/project.json`
   - `VERCEL_PROJECT_ID`: From `.vercel/project.json`

---

## 🔍 Verify Deployment

### Test URLs
```bash
# Homepage
curl https://your-deployment.vercel.app

# API health check (if implemented)
curl https://your-deployment.vercel.app/api/health
```

### Check Logs
1. Go to **Deployments**
2. Click your deployment
3. View **Functions** logs
4. Check for errors

---

## 🐛 Common Issues

### Build Failed
**Issue:** "Module not found"
- **Fix:** Clear cache → Redeploy
- Or: Check `package.json` dependencies

**Issue:** "Environment variable not found"
- **Fix:** Add missing variables in Vercel settings

### Database Connection Failed
**Issue:** "Can't reach database"
- **Fix:** Verify `DATABASE_URL` is correct
- Check Supabase project is active

### TypeScript Errors
**Issue:** "Type error: ..."
- **Fix:** Run `npm run type-check` locally
- Fix errors before deploying

---

## ✅ Success Checklist

After successful deployment:

- [ ] Site loads at Vercel URL
- [ ] No errors in Vercel logs
- [ ] Database connected (test queries work)
- [ ] Authentication works (login/signup)
- [ ] Environment variables set correctly
- [ ] Custom domain configured (if needed)
- [ ] SSL certificate active
- [ ] GitHub Actions integration working

---

## 🎯 Next Steps

1. **Test Everything:**
   - Login/Signup
   - Package browsing
   - Booking flow
   - Payment (test mode)

2. **Monitor:**
   - Check Vercel Analytics
   - Review Sentry errors (if enabled)
   - Watch performance metrics

3. **Optimize:**
   - Review Lighthouse scores
   - Implement caching
   - Add error boundaries

---

## 📞 Get Help

- Vercel Docs: https://vercel.com/docs
- Support: https://vercel.com/support
- Discord: https://vercel.com/discord

**Deployment ready!** 🚀

---

**Created:** Sprint 0 Day 1
**Team:** DevOps (Daniel)
