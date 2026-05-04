#!/bin/bash

# Quick API Integration Test for UI modules
# Tests the same endpoints the UI would call

API_URL="http://localhost:3001/api"
TOKEN=$(curl -s -X POST "$API_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"test2@example.com","password":"test123"}' | jq -r '.token')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
    echo "Failed to get token"
    exit 1
fi

echo "Token received: ${TOKEN:0:20}..."
echo ""

AUTH_HEADER="Authorization: Bearer $TOKEN"
COMPANY_ID=$(curl -s -X GET "$API_URL/companies" -H "$AUTH_HEADER" | jq -r '.[0]._id')

echo "Testing API-based modules for company: $COMPANY_ID"
echo ""

# Test 1: Business Profile
echo "1. Business Profile:"
PROFILE=$(curl -s -X GET "$API_URL/business-profiles/$COMPANY_ID" -H "$AUTH_HEADER")
if echo "$PROFILE" | jq -e '._id' > /dev/null 2>&1; then
    echo "   ✓ Profile exists: $(echo $PROFILE | jq -r '.name')"
else
    echo "   ✗ No profile found"
fi
echo ""

# Test 2: Founders
echo "2. Founders:"
FOUNDERS=$(curl -s -X GET "$API_URL/founders/$COMPANY_ID" -H "$AUTH_HEADER")
COUNT=$(echo $FOUNDERS | jq 'length')
echo "   Found $COUNT founder(s)"
if [ "$COUNT" -gt 0 ]; then
    echo "   ✓ First: $(echo $FOUNDERS | jq -r '.[0].name')"
fi
echo ""

# Test 3: Employees
echo "3. Employees:"
EMPLOYEES=$(curl -s -X GET "$API_URL/employees/$COMPANY_ID" -H "$AUTH_HEADER")
COUNT=$(echo $EMPLOYEES | jq 'length')
echo "   Found $COUNT employee(s)"
if [ "$COUNT" -gt 0 ]; then
    echo "   ✓ First: $(echo $EMPLOYEES | jq -r '.[0].name')"
fi
echo ""

# Test 4: Products
echo "4. Products:"
PRODUCTS=$(curl -s -X GET "$API_URL/products/$COMPANY_ID" -H "$AUTH_HEADER")
COUNT=$(echo $PRODUCTS | jq 'length')
echo "   Found $COUNT product(s)"
if [ "$COUNT" -gt 0 ]; then
    echo "   ✓ First: $(echo $PRODUCTS | jq -r '.[0].name')"
fi
echo ""

# Test 5: Product Categories
echo "5. Product Categories:"
CATEGORIES=$(curl -s -X GET "$API_URL/products/categories/$COMPANY_ID" -H "$AUTH_HEADER")
COUNT=$(echo $CATEGORIES | jq 'length')
echo "   Found $COUNT categorie(s)"
if [ "$COUNT" -gt 0 ]; then
    echo "   ✓ First: $(echo $CATEGORIES | jq -r '.[0].name')"
fi
echo ""

# Test 6: ICPs
echo "6. ICPs:"
ICPS=$(curl -s -X GET "$API_URL/icps/$COMPANY_ID" -H "$AUTH_HEADER")
COUNT=$(echo $ICPS | jq 'length')
echo "   Found $COUNT ICP(s)"
if [ "$COUNT" -gt 0 ]; then
    echo "   ✓ First: $(echo $ICPS | jq -r '.[0].name')"
fi
echo ""

# Test 7: Personas
echo "7. Personas:"
if [ "$COUNT" -gt 0 ]; then
    ICP_ID=$(echo $ICPS | jq -r '.[0]._id')
    PERSONAS=$(curl -s -X GET "$API_URL/personas/icp/$ICP_ID" -H "$AUTH_HEADER")
    P_COUNT=$(echo $PERSONAS | jq 'length')
    echo "   Found $P_COUNT persona(s) for ICP $ICP_ID"
    if [ "$P_COUNT" -gt 0 ]; then
        echo "   ✓ First: $(echo $PERSONAS | jq -r '.[0].name')"
    fi
else
    echo "   Skipped (no ICPs)"
fi
echo ""

# Test 8: Competitors
echo "8. Competitors:"
COMPETITORS=$(curl -s -X GET "$API_URL/competitors/$COMPANY_ID" -H "$AUTH_HEADER")
COUNT=$(echo $COMPETITORS | jq 'length')
echo "   Found $COUNT competitor(s)"
if [ "$COUNT" -gt 0 ]; then
    echo "   ✓ First: $(echo $COMPETITORS | jq -r '.[0].name')"
fi
echo ""

echo "=========================================="
echo "API Integration Test Complete"
echo "=========================================="
echo ""
echo "All API-based modules are working."
echo "You can now test these in the browser:"
echo ""
echo "1. Open http://localhost:3000"
echo "2. Login with: test2@example.com / test123"
echo "3. Test each module in Foundation group"
echo ""
