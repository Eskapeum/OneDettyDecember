# GitHub Repository Setup Guide

> Quick guide to set up the OneDettyDecember GitHub repository and enable CI/CD

## 🚀 Step 1: Create GitHub Repository

### Option A: Via GitHub Web Interface (Recommended)
1. Go to https://github.com/new
2. Fill in repository details:
   - **Repository name:** `OneDettyDecember`
   - **Description:** "Marketplace platform for December experiences in Lagos & Accra"
   - **Visibility:** Private (recommended) or Public
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)

3. Click **"Create repository"**

### Option B: Via GitHub CLI (if installed)
```bash
gh repo create OneDettyDecember --private --source=. --remote=origin --push
```

---

## 🔗 Step 2: Connect Local Repository to GitHub

After creating the repository on GitHub, you'll see setup instructions. Use these commands:

```bash
# Add GitHub as remote origin
git remote add origin https://github.com/[YOUR_USERNAME]/OneDettyDecember.git

# Or if using SSH:
git remote add origin git@github.com:[YOUR_USERNAME]/OneDettyDecember.git

# Verify remote is added
git remote -v

# Push existing commits to GitHub
git branch -M main
git push -u origin main
```

**Replace `[YOUR_USERNAME]` with your actual GitHub username.**

---

## ✅ Step 3: Verify GitHub Actions

Once you push to GitHub, the CI/CD pipeline will automatically run. Here's what happens:

### Pipeline Jobs

#### 1️⃣ **Lint & Type Check** (runs first)
- ✅ Checks out code
- ✅ Installs Node.js 20
- ✅ Installs dependencies via `npm ci`
- ✅ Runs ESLint: `npm run lint`
- ✅ Runs TypeScript check: `npx tsc --noEmit`
- ✅ Runs Prettier check: `npx prettier --check .`

#### 2️⃣ **Build** (runs after lint passes)
- ✅ Checks out code
- ✅ Installs dependencies
- ✅ Generates Prisma client: `npx prisma generate`
- ✅ Builds Next.js: `npm run build`
- ✅ Uploads build artifacts (kept for 7 days)

#### 3️⃣ **Test** (runs after lint passes)
- ✅ Checks out code
- ✅ Installs dependencies
- ✅ Generates Prisma client
- 🟡 Runs tests (placeholder for Sprint 1)

---

## 🔍 Step 4: Check Pipeline Status

### View in GitHub
1. Go to your repository: `https://github.com/[YOUR_USERNAME]/OneDettyDecember`
2. Click the **"Actions"** tab
3. You should see a workflow run for your recent commit
4. Click on the workflow to see detailed logs

### Expected Status
- ✅ **Lint & Type Check** - Should pass
- ✅ **Build** - Should pass
- ✅ **Test** - Should pass (placeholders)

### If Build Fails
The build might fail on first run because it needs environment variables. This is expected! The build step has `SKIP_ENV_VALIDATION: true` to help with this.

---

## 🔐 Step 5: Add Repository Secrets (Optional)

For production deployments, you'll need to add secrets:

1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Add these secrets when ready:

| Secret Name | Description |
|-------------|-------------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `DATABASE_URL` | PostgreSQL connection string |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `PAYSTACK_SECRET_KEY` | Paystack secret key |

**Note:** These are only needed for deployment workflows, not for the current CI pipeline.

---

## 📋 Step 6: Enable Branch Protection (Recommended)

Protect your `main` branch to enforce quality:

1. Go to **Settings** → **Branches**
2. Click **"Add branch protection rule"**
3. Branch name pattern: `main`
4. Enable these rules:
   - ✅ **Require a pull request before merging**
   - ✅ **Require status checks to pass before merging**
     - Select: `Lint & Type Check`
     - Select: `Build Application`
   - ✅ **Require conversation resolution before merging**
   - ✅ **Do not allow bypassing the above settings**

5. Click **"Create"** or **"Save changes"**

---

## 🌿 Step 7: Create Development Branch

Set up a `develop` branch for active development:

```bash
# Create develop branch from main
git checkout -b develop

# Push develop branch to GitHub
git push -u origin develop

# Return to main
git checkout main
```

**Workflow:**
- `main` = Production-ready code (protected)
- `develop` = Active development (CI runs here too)
- Feature branches = Branch from `develop`, merge back via PR

---

## 🎯 Step 8: Verify Everything Works

### Test the CI Pipeline
1. Make a small change (e.g., update README)
2. Commit and push:
   ```bash
   git add README.md
   git commit -m "Test CI pipeline"
   git push origin main
   ```
3. Go to GitHub Actions and watch the pipeline run
4. All jobs should pass ✅

### Test Pull Request Flow
1. Create a feature branch:
   ```bash
   git checkout -b test/ci-verification
   echo "# CI Test" >> TEST.md
   git add TEST.md
   git commit -m "Add test file for CI verification"
   git push -u origin test/ci-verification
   ```

2. On GitHub, create a Pull Request from `test/ci-verification` to `main`
3. Watch the CI checks run automatically
4. Once checks pass, you can merge the PR
5. Delete the test branch

---

## 📊 CI/CD Pipeline Details

### Pipeline Triggers
The CI runs on:
- Every push to `main` branch
- Every push to `develop` branch
- Every pull request to `main` branch
- Every pull request to `develop` branch

### Build Artifacts
- Build output (`.next` folder) is saved for 7 days
- Can be downloaded from Actions tab
- Useful for debugging build issues

### Caching
- `npm ci` uses Node.js cache for faster installs
- Subsequent runs will be much faster

---

## 🚨 Troubleshooting

### "npm ci can clean install only with an existing package-lock.json"
**Solution:** Make sure `package-lock.json` is committed:
```bash
git add package-lock.json
git commit -m "Add package-lock.json"
git push
```

### Build fails with "Environment variable not found"
**Solution:** This is normal for first run. The build has `SKIP_ENV_VALIDATION: true` to handle this.

### Prettier check fails
**Solution:** Format your code:
```bash
npx prettier --write .
git add .
git commit -m "Format code with Prettier"
git push
```

### ESLint fails
**Solution:** Fix linting errors:
```bash
npm run lint
# Fix errors manually, then:
git add .
git commit -m "Fix ESLint errors"
git push
```

---

## ✅ Checklist

After completing all steps, verify:

- [ ] GitHub repository created
- [ ] Local repo connected to GitHub remote
- [ ] Code pushed to `main` branch
- [ ] GitHub Actions tab shows workflow runs
- [ ] CI pipeline passes (Lint, Build, Test)
- [ ] Branch protection enabled on `main` (optional but recommended)
- [ ] `develop` branch created and pushed (optional)
- [ ] Pull request workflow tested

---

## 🎉 Success Criteria

Your GitHub setup is complete when:
1. ✅ You can see your code on GitHub
2. ✅ CI pipeline runs automatically on push
3. ✅ All CI jobs pass with green checkmarks
4. ✅ You can create and merge pull requests

---

## 📚 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Next.js CI/CD Guide](https://nextjs.org/docs/pages/building-your-application/deploying/ci-build-caching)
- [Prisma in CI/CD](https://www.prisma.io/docs/guides/deployment/deploy-to-ci)
- [Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)

---

**Status:** Ready to push to GitHub!
**Next Step:** Follow Step 1 above to create your GitHub repository.

**Questions?** Check the troubleshooting section or create an issue in the repo.
