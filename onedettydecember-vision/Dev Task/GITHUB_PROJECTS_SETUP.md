# 🎯 GITHUB PROJECTS SETUP GUIDE

**Created:** November 18, 2025  
**Owner:** Amelia (Lead Dev)  
**Purpose:** Set up GitHub Projects for sprint management

---

## 📋 OVERVIEW

We'll use **GitHub Projects (Beta)** for sprint planning, tracking, and management.

**Benefits:**
- Integrated with GitHub Issues & PRs
- Kanban boards + sprint views
- Automated workflows
- Velocity tracking
- Team collaboration

---

## 🚀 SETUP STEPS

### **STEP 1: Create GitHub Project**

1. Go to: https://github.com/orgs/YOUR_ORG/projects (or user projects)
2. Click: **New Project**
3. Select: **Team backlog** template
4. Name: **OneDettyDecember - Sprint Board**
5. Description: **Sprint planning and tracking for OneDettyDecember platform**

---

### **STEP 2: Configure Project Views**

#### **View 1: Sprint Board (Kanban)**
- **Columns:**
  - 📋 Backlog
  - 🎯 Sprint Backlog
  - 🏗️ In Progress
  - 👀 In Review
  - ✅ Done

#### **View 2: Sprint Timeline**
- **Type:** Roadmap
- **Group by:** Sprint
- **Show:** Start date, End date, Assignee

#### **View 3: Team View**
- **Type:** Table
- **Group by:** Assignee
- **Show:** Status, Priority, Story Points

#### **View 4: Epic View**
- **Type:** Board
- **Group by:** Epic
- **Show:** Progress, Story Points

---

### **STEP 3: Create Custom Fields**

1. **Sprint** (Single select)
   - Sprint 0
   - Sprint 1
   - Sprint 2
   - ... (up to Sprint 12)

2. **Story Points** (Number)
   - Range: 1-13

3. **Epic** (Single select)
   - Epic 1: Authentication
   - Epic 2: Discovery & Search
   - Epic 3: Booking Flow
   - Epic 4: Payments
   - ... (all 18 epics)

4. **Priority** (Single select)
   - P0 - Critical
   - P1 - High
   - P2 - Medium
   - P3 - Low

5. **Status** (Single select)
   - Backlog
   - Sprint Backlog
   - In Progress
   - In Review
   - Done
   - Blocked

6. **Team Member** (Single select)
   - Amelia (Lead Dev)
   - Neriah (Frontend Lead)
   - Nesiah (Backend Lead)
   - Neziah (Full-Stack)
   - Daniel (DevOps)
   - Lolu (QA/Testing)
   - Tobi (Frontend)

---

### **STEP 4: Create Sprint 1 Issues**

Use the GitHub CLI or web interface to create issues:

```bash
# Example: Create Epic 1 issues
gh issue create \
  --title "DDT-101: Implement User Registration API" \
  --body "See SPRINT_1_PLAN.md for details" \
  --label "epic-1,backend,p0" \
  --assignee nesiah \
  --project "OneDettyDecember - Sprint Board"

# Add custom fields via web UI:
# - Sprint: Sprint 1
# - Story Points: 5
# - Epic: Epic 1: Authentication
# - Priority: P0 - Critical
```

---

### **STEP 5: Set Up Automation**

#### **Automation 1: Move to In Progress**
- **Trigger:** Issue assigned
- **Action:** Move to "In Progress"

#### **Automation 2: Move to In Review**
- **Trigger:** PR opened
- **Action:** Move to "In Review"

#### **Automation 3: Move to Done**
- **Trigger:** PR merged
- **Action:** Move to "Done"

#### **Automation 4: Sprint Completion**
- **Trigger:** Sprint end date
- **Action:** Generate sprint report

---

### **STEP 6: Create Sprint Milestones**

```bash
# Create Sprint 1 milestone
gh milestone create \
  --title "Sprint 1: Authentication & Core Setup" \
  --description "Dec 2-13, 2025 | 45 story points" \
  --due-date "2025-12-13"

# Create Sprint 2 milestone
gh milestone create \
  --title "Sprint 2: Discovery & Search" \
  --description "Dec 16-27, 2025 | 42 story points" \
  --due-date "2025-12-27"

# Create Sprint 3 milestone
gh milestone create \
  --title "Sprint 3: Booking Flow" \
  --description "Dec 30, 2025 - Jan 10, 2026 | 47 story points" \
  --due-date "2026-01-10"
```

---

## 📊 SPRINT WORKFLOW

### **Sprint Planning (Day 1):**
1. Review backlog
2. Select stories for sprint
3. Assign story points
4. Assign team members
5. Move to "Sprint Backlog"

### **Daily Standup:**
1. Review board
2. Update status
3. Identify blockers
4. Adjust assignments

### **Sprint Review (Last Day):**
1. Demo completed work
2. Calculate velocity
3. Update sprint report
4. Move incomplete items to backlog

### **Sprint Retrospective:**
1. What went well?
2. What didn't go well?
3. Action items for next sprint

---

## 🎯 LABELS TO CREATE

```bash
# Epic labels
gh label create "epic-1" --color "0E8A16" --description "Epic 1: Authentication"
gh label create "epic-2" --color "0E8A16" --description "Epic 2: Discovery & Search"
gh label create "epic-3" --color "0E8A16" --description "Epic 3: Booking Flow"
# ... (create for all 18 epics)

# Type labels
gh label create "backend" --color "D93F0B" --description "Backend development"
gh label create "frontend" --color "FBCA04" --description "Frontend development"
gh label create "devops" --color "5319E7" --description "DevOps/Infrastructure"
gh label create "testing" --color "C5DEF5" --description "Testing/QA"

# Priority labels
gh label create "p0" --color "B60205" --description "P0 - Critical"
gh label create "p1" --color "D93F0B" --description "P1 - High"
gh label create "p2" --color "FBCA04" --description "P2 - Medium"
gh label create "p3" --color "0E8A16" --description "P3 - Low"
```

---

## ✅ CHECKLIST

- [ ] GitHub Project created
- [ ] Views configured (Kanban, Timeline, Team, Epic)
- [ ] Custom fields added
- [ ] Sprint 1 issues created
- [ ] Automation rules set up
- [ ] Milestones created
- [ ] Labels created
- [ ] Team members added
- [ ] First sprint planning meeting scheduled

---

**Next Steps:**
1. Create GitHub Project
2. Set up views and fields
3. Create Sprint 1 issues
4. Schedule sprint planning meeting
5. Start Sprint 1! 🚀

---

**Created By:** Amelia (Lead Dev)  
**Date:** November 18, 2025  
**Status:** 📋 **READY TO IMPLEMENT**

