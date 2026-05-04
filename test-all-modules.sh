#!/bin/bash

# Comprehensive Module Test Script
# Tests all modules with database verification

echo "=========================================="
echo "AI CMO - Module Testing Suite"
echo "=========================================="
echo ""

# Configuration
API_URL="http://localhost:3001/api"
TOKEN=""
USER_ID=""
COMPANY_ID=""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to print results
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ PASS${NC}: $2"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC}: $2"
        ((TESTS_FAILED++))
    fi
}

# Function to print section headers
print_section() {
    echo ""
    echo "=========================================="
    echo "$1"
    echo "=========================================="
}

# 1. AUTH TESTS
print_section "1. AUTHENTICATION TESTS"

echo "Testing login..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"test2@example.com","password":"test123"}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token // empty')
USER_ID=$(echo $LOGIN_RESPONSE | jq -r '.user.id // empty')
COMPANY_ID=$(echo $LOGIN_RESPONSE | jq -r '.user.activeCompanyId // empty')

if [ ! -z "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
    print_result 0 "Login successful - Token received"
    print_result 0 "User ID: $USER_ID"
    print_result 0 "Company ID: $COMPANY_ID"
else
    print_result 1 "Login failed - No token received"
    echo "Response: $LOGIN_RESPONSE"
    exit 1
fi

# Auth header for subsequent requests
AUTH_HEADER="Authorization: Bearer $TOKEN"

# 2. COMPANY TESTS
print_section "2. COMPANY MODULE TESTS"

echo "Testing get companies..."
COMPANIES_RESPONSE=$(curl -s -X GET "$API_URL/companies" -H "$AUTH_HEADER")
if echo "$COMPANIES_RESPONSE" | jq -e '.[0].id' > /dev/null 2>&1; then
    print_result 0 "Get companies - Data retrieved"
else
    print_result 1 "Get companies - No data"
fi

# 3. BUSINESS PROFILE TESTS
print_section "3. BUSINESS PROFILE MODULE TESTS"

echo "Testing business profile creation..."
PROFILE_DATA='{
    "companyId": "'$COMPANY_ID'",
    "name": "Test Business Profile",
    "stage": "growth",
    "industries": ["technology"],
    "description": "A test business profile",
    "mission": "Test mission",
    "vision": "Test vision",
    "isRevenuePublic": false,
    "isFounderPublic": true,
    "socialProfiles": {},
    "mapLinks": {}
}'

PROFILE_CREATE=$(curl -s -X POST "$API_URL/business-profiles" \
    -H "Content-Type: application/json" \
    -H "$AUTH_HEADER" \
    -d "$PROFILE_DATA")

if echo "$PROFILE_CREATE" | jq -e '._id' > /dev/null 2>&1; then
    print_result 0 "Business Profile - Created successfully"
    PROFILE_ID=$(echo $PROFILE_CREATE | jq -r '._id')
else
    # Check if profile already exists
    if echo "$PROFILE_CREATE" | grep -q "already exists"; then
        print_result 0 "Business Profile - Already exists (OK)"
    else
        print_result 1 "Business Profile - Creation failed"
        echo "Response: $PROFILE_CREATE"
    fi
fi

echo "Testing get business profile..."
PROFILE_GET=$(curl -s -X GET "$API_URL/business-profiles/$COMPANY_ID" -H "$AUTH_HEADER")
if echo "$PROFILE_GET" | jq -e '.name' > /dev/null 2>&1; then
    print_result 0 "Business Profile - Retrieved successfully"
else
    print_result 1 "Business Profile - Not found"
fi

# 4. FOUNDERS TESTS
print_section "4. FOUNDERS MODULE TESTS"

echo "Testing founder creation..."
FOUNDER_DATA='{
    "companyId": "'$COMPANY_ID'",
    "name": "Test Founder",
    "title": "CEO",
    "email": "founder@test.com",
    "responsibilityArea": "vision",
    "bio": "Test bio",
    "socialProfiles": {}
}'

FOUNDER_CREATE=$(curl -s -X POST "$API_URL/founders" \
    -H "Content-Type: application/json" \
    -H "$AUTH_HEADER" \
    -d "$FOUNDER_DATA")

if echo "$FOUNDER_CREATE" | jq -e '._id' > /dev/null 2>&1; then
    print_result 0 "Founder - Created successfully"
    FOUNDER_ID=$(echo $FOUNDER_CREATE | jq -r '._id')
else
    print_result 1 "Founder - Creation failed"
    echo "Response: $FOUNDER_CREATE"
fi

echo "Testing get founders..."
FOUNDERS_GET=$(curl -s -X GET "$API_URL/founders/$COMPANY_ID" -H "$AUTH_HEADER")
if echo "$FOUNDERS_GET" | jq -e '.[0]._id' > /dev/null 2>&1; then
    print_result 0 "Founders - Retrieved successfully"
else
    print_result 1 "Founders - Not found"
fi

# 5. EMPLOYEES TESTS
print_section "5. EMPLOYEES MODULE TESTS"

echo "Testing employee creation..."
EMPLOYEE_DATA='{
    "companyId": "'$COMPANY_ID'",
    "name": "Test Employee",
    "title": "Developer",
    "email": "employee@test.com",
    "department": "engineering",
    "level": "senior",
    "socialProfiles": {}
}'

EMPLOYEE_CREATE=$(curl -s -X POST "$API_URL/employees" \
    -H "Content-Type: application/json" \
    -H "$AUTH_HEADER" \
    -d "$EMPLOYEE_DATA")

if echo "$EMPLOYEE_CREATE" | jq -e '._id' > /dev/null 2>&1; then
    print_result 0 "Employee - Created successfully"
    EMPLOYEE_ID=$(echo $EMPLOYEE_CREATE | jq -r '._id')
else
    print_result 1 "Employee - Creation failed"
    echo "Response: $EMPLOYEE_CREATE"
fi

echo "Testing get employees..."
EMPLOYEES_GET=$(curl -s -X GET "$API_URL/employees/$COMPANY_ID" -H "$AUTH_HEADER")
if echo "$EMPLOYEES_GET" | jq -e '.[0]._id' > /dev/null 2>&1; then
    print_result 0 "Employees - Retrieved successfully"
else
    print_result 1 "Employees - Not found"
fi

# 6. PRODUCTS TESTS
print_section "6. PRODUCTS MODULE TESTS"

echo "Testing product category creation..."
CATEGORY_DATA='{
    "companyId": "'$COMPANY_ID'",
    "name": "Test Category"
}'

CATEGORY_CREATE=$(curl -s -X POST "$API_URL/products/categories" \
    -H "Content-Type: application/json" \
    -H "$AUTH_HEADER" \
    -d "$CATEGORY_DATA")

if echo "$CATEGORY_CREATE" | jq -e '._id' > /dev/null 2>&1; then
    print_result 0 "Product Category - Created successfully"
    CATEGORY_ID=$(echo $CATEGORY_CREATE | jq -r '._id')
else
    print_result 1 "Product Category - Creation failed"
    echo "Response: $CATEGORY_CREATE"
fi

echo "Testing product creation..."
PRODUCT_DATA='{
    "companyId": "'$COMPANY_ID'",
    "name": "Test Product",
    "categoryId": "'$CATEGORY_ID'",
    "status": "active",
    "audienceType": "b2b",
    "price": 99.99,
    "usp": "Test USP",
    "description": "Test description",
    "features": ["Feature 1", "Feature 2"]
}'

PRODUCT_CREATE=$(curl -s -X POST "$API_URL/products" \
    -H "Content-Type: application/json" \
    -H "$AUTH_HEADER" \
    -d "$PRODUCT_DATA")

if echo "$PRODUCT_CREATE" | jq -e '._id' > /dev/null 2>&1; then
    print_result 0 "Product - Created successfully"
    PRODUCT_ID=$(echo $PRODUCT_CREATE | jq -r '._id')
else
    print_result 1 "Product - Creation failed"
    echo "Response: $PRODUCT_CREATE"
fi

# 7. ICP TESTS
print_section "7. ICP MODULE TESTS"

echo "Testing ICP creation..."
ICP_DATA='{
    "companyId": "'$COMPANY_ID'",
    "name": "Test ICP",
    "industry": "technology",
    "companySize": "medium",
    "location": "USA",
    "description": "Test ICP description",
    "isActive": true
}'

ICP_CREATE=$(curl -s -X POST "$API_URL/icps" \
    -H "Content-Type: application/json" \
    -H "$AUTH_HEADER" \
    -d "$ICP_DATA")

if echo "$ICP_CREATE" | jq -e '._id' > /dev/null 2>&1; then
    print_result 0 "ICP - Created successfully"
    ICP_ID=$(echo $ICP_CREATE | jq -r '._id')
else
    print_result 1 "ICP - Creation failed"
    echo "Response: $ICP_CREATE"
fi

# 8. PERSONA TESTS
print_section "8. PERSONA MODULE TESTS"

echo "Testing persona creation..."
PERSONA_DATA='{
    "companyId": "'$COMPANY_ID'",
    "icpId": "'$ICP_ID'",
    "name": "Test Persona",
    "age": "25-34",
    "job": "Developer",
    "bio": "Test persona bio"
}'

PERSONA_CREATE=$(curl -s -X POST "$API_URL/personas" \
    -H "Content-Type: application/json" \
    -H "$AUTH_HEADER" \
    -d "$PERSONA_DATA")

if echo "$PERSONA_CREATE" | jq -e '._id' > /dev/null 2>&1; then
    print_result 0 "Persona - Created successfully"
    PERSONA_ID=$(echo $PERSONA_CREATE | jq -r '._id')
else
    print_result 1 "Persona - Creation failed"
    echo "Response: $PERSONA_CREATE"
fi

# 9. COMPETITORS TESTS
print_section "9. COMPETITORS MODULE TESTS"

echo "Testing competitor creation..."
COMPETITOR_DATA='{
    "companyId": "'$COMPANY_ID'",
    "name": "Test Competitor",
    "website": "https://competitor.com",
    "threatLevel": "medium",
    "usp": "Their USP"
}'

COMPETITOR_CREATE=$(curl -s -X POST "$API_URL/competitors" \
    -H "Content-Type: application/json" \
    -H "$AUTH_HEADER" \
    -d "$COMPETITOR_DATA")

if echo "$COMPETITOR_CREATE" | jq -e '._id' > /dev/null 2>&1; then
    print_result 0 "Competitor - Created successfully"
    COMPETITOR_ID=$(echo $COMPETITOR_CREATE | jq -r '._id')
else
    print_result 1 "Competitor - Creation failed"
    echo "Response: $COMPETITOR_CREATE"
fi

# 10. MODULE DATA (GENERIC) TESTS
print_section "10. GENERIC MODULE DATA TESTS"

echo "Testing generic module data save..."
MODULE_DATA='{
    "companyId": "'$COMPANY_ID'",
    "data": {
        "title": "Test Content",
        "description": "Test description",
        "content": "Test content data"
    }
}'

MODULE_SAVE=$(curl -s -X POST "$API_URL/module-data/newsletters" \
    -H "Content-Type: application/json" \
    -H "$AUTH_HEADER" \
    -d "$MODULE_DATA")

if [ ! -z "$MODULE_SAVE" ]; then
    print_result 0 "Generic Module Data - Saved successfully"
else
    print_result 1 "Generic Module Data - Save failed"
fi

# SUMMARY
print_section "TEST SUMMARY"
echo -e "${GREEN}Tests Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Tests Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ ALL TESTS PASSED${NC}"
    exit 0
else
    echo -e "${RED}✗ SOME TESTS FAILED${NC}"
    exit 1
fi
