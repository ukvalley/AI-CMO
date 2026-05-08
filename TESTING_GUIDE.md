# Mengo - UI Testing Guide

## Test 1: Business Profile Module

### Step 1: Access the Application
- URL: http://localhost:3000
- Login with: test2@example.com / test123

### Step 2: Navigate to Business Profile
- Look for "Foundation" group in sidebar
- Click "Business Profile" module

### Step 3: Test Business Profile Creation
1. If no profile exists, you'll see a create form
2. Fill in required fields:
   - Business Name: "Test Business ABC"
   - Stage: Select "Growth"
   - Industries: Select "Technology"
3. Fill optional fields:
   - Description: "A test business for verification"
   - Mission: "Test mission"
   - Vision: "Test vision"
4. Click "Create" or "Save"

### Step 4: Verify Creation
1. Profile should display after creation
2. Check that data shows correctly
3. Verify Quick Stats cards show:
   - Founded date
   - Team Size
   - Revenue
   - Website status

### Step 5: Verify Persistence
1. Copy the business name you created
2. Refresh the page (Ctrl/Cmd + R)
3. Navigate to Business Profile again
4. Verify data is still there (from MongoDB, not localStorage)

### Step 6: Test Update
1. Click "Edit" button
2. Change business name
3. Save
4. Verify changes persist after refresh

---

## Test 2: Founders Module

### Step 1: Navigate to Founders
- Foundation group → Founders

### Step 2: Create Founder
1. Click "Add" or "Create Founder"
2. Fill required:
   - Name: "John Doe"
   - Title: "CEO"
3. Fill optional:
   - Email: "john@test.com"
   - Bio: "Test founder bio"
   - Responsibility Area: Vision
4. Save

### Step 3: Verify
- Founder appears in list
- Refresh page → founder still there

---

## Test 3: Employees Module

### Step 1: Navigate to Employees
- Foundation group → Employees

### Step 2: Create Employee
1. Name: "Jane Smith"
2. Title: "Developer"
3. Department: Engineering
4. Level: Senior
5. Save

### Step 3: Verify
- Employee appears in list
- Data persists after refresh

---

## Test 4: Products Module

### Step 1: Navigate to Products
- Foundation group → Products

### Step 2: Create Category First
1. Look for "Categories" tab or button
2. Create category:
   - Name: "Software"
3. Save

### Step 3: Create Product
1. Switch to Products tab
2. Create product:
   - Name: "Test Product"
   - Category: Select "Software"
   - Status: Active
   - Audience Type: B2B
3. Save

### Step 4: Verify
- Product appears in list
- Category shows correctly
- Data persists after refresh

---

## Test 5: ICPs, Personas, Competitors

### ICPs
- Create ICP with name "Enterprise Tech Companies"
- Set industry: Technology
- Set company size: Medium

### Personas
- Requires ICP first (have ID from above)
- Create persona: "CTO Mike"
- Age: 35-44
- Job: Chief Technology Officer

### Competitors
- Create competitor: "CompetitorX"
- Website: https://competitorx.com
- Threat Level: Medium

---

## Expected Results

All modules should:
- ✅ Create items without errors
- ✅ Show items in list immediately
- ✅ Persist data after page refresh
- ✅ Show correct data from MongoDB

## Troubleshooting

If creation fails:
1. Check browser DevTools → Network tab
2. Look for failed API calls (red entries)
3. Check Console for errors
4. Report the error message

If data doesn't persist:
1. Check if you're logged in (not demo mode)
2. Check MongoDB connection
3. Verify backend is running on :3001
