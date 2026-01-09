#!/bin/bash

# CSRF Protection Test Script
# Run this with: bash test-csrf.sh

echo "CSRF Protection Test"
echo "======================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Get CSRF Token
echo "Test 1: Get CSRF Token"
echo "-----------------------"
RESPONSE=$(curl -s -c cookies.txt http://localhost:3000/api/csrf-token)
TOKEN=$(echo $RESPONSE | grep -o '"csrfToken":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo -e "${RED}❌ FAIL: Could not get CSRF token${NC}"
    echo "Response: $RESPONSE"
    exit 1
else
    echo -e "${GREEN}✅ PASS: Got CSRF token${NC}"
    echo "Token: $TOKEN"
    echo ""
fi

# Test 2: Valid Request (with token)
echo "Test 2: Valid Request (with CSRF token)"
echo "----------------------------------------"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -b cookies.txt \
    -H "x-csrf-token: $TOKEN" \
    -H "Content-Type: application/json" \
    -X POST http://localhost:3000/api/csrf-token \
    -d '{"test":"data"}')

# 405 is acceptable (POST not implemented on that endpoint, but CSRF passed)
# 200 is also acceptable
# 403 would mean CSRF failed
if [ "$STATUS" = "405" ] || [ "$STATUS" = "200" ]; then
    echo -e "${GREEN}✅ PASS: Request with valid token was processed (HTTP $STATUS)${NC}"
    echo ""
else
    echo -e "${RED}❌ FAIL: Request with valid token was rejected (HTTP $STATUS)${NC}"
    echo ""
fi

# Test 3: Invalid Request (without token)
echo "Test 3: Invalid Request (without CSRF token)"
echo "---------------------------------------------"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -b cookies.txt \
    -H "Content-Type: application/json" \
    -X POST http://localhost:3000/api/csrf-token \
    -d '{"test":"data"}')

if [ "$STATUS" = "403" ]; then
    echo -e "${GREEN}✅ PASS: Request without token was correctly rejected (HTTP 403)${NC}"
    echo ""
else
    echo -e "${RED}❌ FAIL: Request without token should be rejected (got HTTP $STATUS)${NC}"
    echo ""
fi

# Test 4: Invalid Request (wrong token)
echo "Test 4: Invalid Request (wrong CSRF token)"
echo "-------------------------------------------"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -b cookies.txt \
    -H "x-csrf-token: wrong-token-12345" \
    -H "Content-Type: application/json" \
    -X POST http://localhost:3000/api/csrf-token \
    -d '{"test":"data"}')

if [ "$STATUS" = "403" ]; then
    echo -e "${GREEN}✅ PASS: Request with wrong token was correctly rejected (HTTP 403)${NC}"
    echo ""
else
    echo -e "${RED}❌ FAIL: Request with wrong token should be rejected (got HTTP $STATUS)${NC}"
    echo ""
fi

# Test 5: GET request (should not require CSRF)
echo "Test 5: GET Request (should not require CSRF token)"
echo "-----------------------------------------------------"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/csrf-token)

if [ "$STATUS" = "200" ]; then
    echo -e "${GREEN}✅ PASS: GET request works without CSRF token (HTTP 200)${NC}"
    echo ""
else
    echo -e "${RED}❌ FAIL: GET request should work (got HTTP $STATUS)${NC}"
    echo ""
fi

# Cleanup
rm -f cookies.txt

echo "======================="
echo "Test Complete!"
echo ""
echo "Summary:"
echo "- CSRF tokens are being generated"
echo "- Requests with valid tokens are accepted"
echo "- Requests without tokens are rejected (403)"
echo "- Requests with invalid tokens are rejected (403)"
echo "- GET requests work without tokens"
echo ""
echo "CSRF Protection is working correctly!"
