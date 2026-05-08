# AI CMO - Browser Testing Guide

## Pre-requisites
- Frontend running: http://localhost:3000
- Backend running: http://localhost:3001
- Login credentials: test2@example.com / test123

---

## Test 1: Founders Module

### Steps:
1. Open http://localhost:3000
2. Login with test2@example.com / test123
3. Navigate to **Foundation → Founders** in sidebar
4. **Expected**: See list of existing founders (created during API tests)

### Create New Founder:
1. Click "Add Founder" or "Create"
2. Fill required fields:
   - Name: "Sarah Johnson"
   - Title: "CTO"
3. Fill optional:
   - Email: "sarah@test.com"
   - Bio: "Technical co-founder"
   - Responsibility Area: "Tech"
4. Click Save

### Verify:
- [ ] Founder appears in list immediately
- [ ] Refresh page → founder persists
- [ ] Edit founder → changes save
- [ ] Delete test founder after verification

---

## Test 2: Employees Module

### Steps:
1. Navigate to **Foundation → Employees**
2. **Expected**: See existing employees list

### Create New Employee:
1. Click "Add Employee"
2. Fill:
   - Name: "Mike Chen"
   - Title: "Senior Developer"
   - Department: Engineering
   - Level: Senior
   - Email: "mike@test.com"
3. Save

### Verify:
- [ ] Employee appears in list
- [ ] Refresh → data persists
- [ ] Edit works
- [ ] Delete works

---

## Test 3: Products + Categories

### Steps:
1. Navigate to **Foundation → Products**

### Create Category First:
1. Look for "Categories" tab/button
2. Create category:
   - Name: "Services"
3. Save

### Create Product:
1. Switch to Products tab
2. Create product:
   - Name: "Consulting Package"
   - Category: Select "Services"
   - Status: Active
   - Audience Type: B2B
   - Price: 5000
   - USP: "Expert marketing consulting"
3. Save

### Verify:
- [ ] Category created successfully
- [ ] Product created with category
- [ ] Product shows in list
- [ ] Data persists after refresh
- [ ] Edit/Delete works

---

## Test 4: ICPs, Personas, Competitors

### ICPs (Ideal Customer Profiles):
1. Navigate to **Foundation → ICPs**
2. Create ICP:
   - Name: "Enterprise SaaS Buyers"
   - Industry: Technology
   - Company Size: Enterprise
   - Location: Global
3. Save
4. Verify persists after refresh

### Personas:
1. Navigate to **Foundation → Personas**
2. Create Persona (requires ICP first):
   - ICP: Select "Enterprise SaaS Buyers"
   - Name: "Director Dave"
   - Job Title: "Marketing Director"
   - Age: 35-44
   - Bio: "Decision maker for marketing tools"
3. Save
4. Verify

### Competitors:
1. Navigate to **Foundation → Competitors**
2. Create Competitor:
   - Name: "CompetitorPro"
   - Website: https://competitorpro.com
   - Threat Level: High
   - USP: "They have better SEO"
3. Save
4. Verify

---

## Quick Verification Checklist

After testing all modules:

| Module | Create | View | Edit | Delete | Persist |
|--------|--------|------|------|--------|---------|
| Founders | ☐ | ☐ | ☐ | ☐ | ☐ |
| Employees | ☐ | ☐ | ☐ | ☐ | ☐ |
| Products | ☐ | ☐ | ☐ | ☐ | ☐ |
| Categories | ☐ | ☐ | ☐ | ☐ | ☐ |
| ICPs | ☐ | ☐ | ☐ | ☐ | ☐ |
| Personas | ☐ | ☐ | ☐ | ☐ | ☐ |
| Competitors | ☐ | ☐ | ☐ | ☐ | ☐ |

---

## Troubleshooting

### If module shows "Please select a company":
- Check sidebar has company selected
- Try refreshing the page

### If data doesn't persist after refresh:
1. Open DevTools (F12)
2. Check Console for errors
3. Check Network tab for failed API calls
4. Report the error

### If "Access denied" error:
- Logout and login again
- Check if company is properly selected

---

## Expected Test Data

You should see these items already (from API tests):
- Business Profile: "Test Business"
- Founders: Multiple "Test Founder" entries
- Employees: Multiple "Test Employee" entries
- Products: "Test Product"
- Categories: "Test Category", "Software", "Services"
- ICPs: "Test ICP", "Enterprise Tech Companies"
- Competitors: "Test Competitor"
