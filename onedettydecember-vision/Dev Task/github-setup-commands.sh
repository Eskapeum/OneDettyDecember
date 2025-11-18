#!/bin/bash

# GitHub Projects Setup Commands
# Run these commands after repository is created

echo "🚀 GITHUB PROJECTS SETUP"
echo "========================"
echo ""

# Step 1: Create GitHub Project (using web UI - CLI doesn't support Projects v2 yet)
echo "📋 STEP 1: Create GitHub Project"
echo "Go to: https://github.com/Eskapeum?tab=projects"
echo "Click: New Project → Team backlog template"
echo "Name: OneDettyDecember - Sprint Board"
echo "Description: Sprint planning and tracking for OneDettyDecember platform"
echo ""
echo "Press Enter when done..."
read

# Step 2: Create Labels
echo "📌 STEP 2: Creating Labels..."

# Epic labels
gh label create "epic-1" --color "0E8A16" --description "Epic 1: Authentication" --repo Eskapeum/OneDettyDecember
gh label create "epic-2" --color "0E8A16" --description "Epic 2: Discovery & Search" --repo Eskapeum/OneDettyDecember
gh label create "epic-3" --color "0E8A16" --description "Epic 3: Booking Flow" --repo Eskapeum/OneDettyDecember
gh label create "epic-4" --color "0E8A16" --description "Epic 4: Payments" --repo Eskapeum/OneDettyDecember
gh label create "epic-5" --color "0E8A16" --description "Epic 5: Reviews & Ratings" --repo Eskapeum/OneDettyDecember
gh label create "epic-6" --color "0E8A16" --description "Epic 6: User Profile" --repo Eskapeum/OneDettyDecember
gh label create "epic-7" --color "0E8A16" --description "Epic 7: Wishlist" --repo Eskapeum/OneDettyDecember
gh label create "epic-8" --color "0E8A16" --description "Epic 8: Email Notifications" --repo Eskapeum/OneDettyDecember
gh label create "epic-9" --color "0E8A16" --description "Epic 9: Analytics" --repo Eskapeum/OneDettyDecember
gh label create "epic-10" --color "0E8A16" --description "Epic 10: SEO & Performance" --repo Eskapeum/OneDettyDecember
gh label create "epic-11" --color "0E8A16" --description "Epic 11: Security & Compliance" --repo Eskapeum/OneDettyDecember
gh label create "epic-12" --color "0E8A16" --description "Epic 12: Mobile Optimization" --repo Eskapeum/OneDettyDecember
gh label create "epic-13" --color "0E8A16" --description "Epic 13: CMS" --repo Eskapeum/OneDettyDecember
gh label create "epic-14" --color "0E8A16" --description "Epic 14: Car Rentals" --repo Eskapeum/OneDettyDecember
gh label create "epic-15" --color "0E8A16" --description "Epic 15: Hosted Experiences" --repo Eskapeum/OneDettyDecember
gh label create "epic-16" --color "0E8A16" --description "Epic 16: AI Trip Planner" --repo Eskapeum/OneDettyDecember
gh label create "epic-17" --color "0E8A16" --description "Epic 17: Marketplace" --repo Eskapeum/OneDettyDecember
gh label create "epic-18" --color "0E8A16" --description "Epic 18: Admin Dashboard" --repo Eskapeum/OneDettyDecember

# Type labels
gh label create "backend" --color "D93F0B" --description "Backend development" --repo Eskapeum/OneDettyDecember
gh label create "frontend" --color "FBCA04" --description "Frontend development" --repo Eskapeum/OneDettyDecember
gh label create "devops" --color "5319E7" --description "DevOps/Infrastructure" --repo Eskapeum/OneDettyDecember
gh label create "testing" --color "C5DEF5" --description "Testing/QA" --repo Eskapeum/OneDettyDecember
gh label create "design" --color "F9D0C4" --description "Design/UI/UX" --repo Eskapeum/OneDettyDecember

# Priority labels
gh label create "p0" --color "B60205" --description "P0 - Critical" --repo Eskapeum/OneDettyDecember
gh label create "p1" --color "D93F0B" --description "P1 - High" --repo Eskapeum/OneDettyDecember
gh label create "p2" --color "FBCA04" --description "P2 - Medium" --repo Eskapeum/OneDettyDecember
gh label create "p3" --color "0E8A16" --description "P3 - Low" --repo Eskapeum/OneDettyDecember

echo "✅ Labels created!"
echo ""

# Step 3: Create Milestones
echo "📅 STEP 3: Creating Milestones..."

gh milestone create \
  --title "Sprint 1: Authentication & Core Setup" \
  --description "Dec 2-13, 2025 | 45 story points | Epic 1: User Registration & Authentication" \
  --due-date "2025-12-13" \
  --repo Eskapeum/OneDettyDecember

gh milestone create \
  --title "Sprint 2: Discovery & Search" \
  --description "Dec 16-27, 2025 | 42 story points | Epic 2: Package Discovery & Search" \
  --due-date "2025-12-27" \
  --repo Eskapeum/OneDettyDecember

gh milestone create \
  --title "Sprint 3: Booking Flow" \
  --description "Dec 30, 2025 - Jan 10, 2026 | 47 story points | Epic 3: Package Details & Booking" \
  --due-date "2026-01-10" \
  --repo Eskapeum/OneDettyDecember

echo "✅ Milestones created!"
echo ""

# Step 4: Create Sprint 1 Issues
echo "📝 STEP 4: Creating Sprint 1 Issues..."

# Story 1.1: User Registration
gh issue create \
  --title "DDT-101: Implement User Registration API" \
  --body "**Epic:** Epic 1 - User Registration & Authentication
**Story Points:** 3
**Assignee:** Nesiah (Backend Lead)

**Description:**
Implement user registration API endpoint with email verification.

**Acceptance Criteria:**
- [ ] POST /api/auth/register endpoint created
- [ ] Email validation implemented
- [ ] Password hashing (bcrypt)
- [ ] Email verification flow
- [ ] Rate limiting configured
- [ ] Unit tests written (80%+ coverage)
- [ ] API documentation updated

**Technical Notes:**
- Use Supabase Auth for user management
- Implement Zod validation
- Send verification email via Resend
- Store user in PostgreSQL via Prisma

**Dependencies:**
- Supabase Auth configured
- Resend API key set up
- Database migrations run" \
  --label "epic-1,backend,p0" \
  --milestone "Sprint 1: Authentication & Core Setup" \
  --repo Eskapeum/OneDettyDecember

echo "✅ Sprint 1 issues created!"
echo ""

echo "🎉 GITHUB SETUP COMPLETE!"
echo ""
echo "Next steps:"
echo "1. Configure GitHub Project views (web UI)"
echo "2. Add custom fields to project"
echo "3. Link issues to project"
echo "4. Start Sprint 1! 🚀"

