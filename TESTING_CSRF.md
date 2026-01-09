# Testing CSRF Protection

This document explains how to test the CSRF protection implementation.

## Quick Test (Automated)

### Option 1: Run the Test Script

```bash
# Start the development server first
npm run dev

# In another terminal, run the test script
bash test-csrf.sh
```

**Expected Output:**
```
🔒 CSRF Protection Test
=======================

Test 1: Get CSRF Token
-----------------------
✅ PASS: Got CSRF token
Token: abc123...

Test 2: Valid Request (with CSRF token)
----------------------------------------
✅ PASS: Request with valid token was processed (HTTP 405)

Test 3: Invalid Request (without CSRF token)
---------------------------------------------
✅ PASS: Request without token was correctly rejected (HTTP 403)

Test 4: Invalid Request (wrong CSRF token)
-------------------------------------------
✅ PASS: Request with wrong token was correctly rejected (HTTP 403)

Test 5: GET Request (should not require CSRF token)
-----------------------------------------------------
✅ PASS: GET request works without CSRF token (HTTP 200)

=======================
🎉 Test Complete!

✅ CSRF Protection is working correctly!
```

### Option 2: Run Security Tests

```bash
npm run test:security
```

**Expected Output:**
```
PASS src/__tests__/security/csrf-protection.test.ts
  CSRF Protection Security
    CSRF middleware implementation
      ✓ should have middleware.ts file
      ✓ should implement CSRF validation in middleware
      ✓ should have CSRF library implementation
      ✓ should have CSRF token endpoint
      ✓ should have client-side CSRF utilities
    ... (20+ tests)

Test Suites: 6 passed, 6 total
Tests:       70 passed, 70 total
```

## Manual Testing

### Using curl

1. **Get CSRF Token:**
   ```bash
   curl -c cookies.txt http://localhost:3000/api/csrf-token
   ```

   **Response:**
   ```json
   {
     "csrfToken": "abc123def456..."
   }
   ```

2. **Valid Request (with token):**
   ```bash
   TOKEN="<token-from-step-1>"

   curl -b cookies.txt \
     -H "x-csrf-token: $TOKEN" \
     -H "Content-Type: application/json" \
     -X POST http://localhost:3000/api/csrf-token \
     -d '{"test":"data"}'
   ```

   **Expected:** HTTP 200 or 405 (endpoint accepts the token)

3. **Invalid Request (without token):**
   ```bash
   curl -b cookies.txt \
     -H "Content-Type: application/json" \
     -X POST http://localhost:3000/api/csrf-token \
     -d '{"test":"data"}'
   ```

   **Expected:** HTTP 403
   ```json
   {
     "error": "CSRF token validation failed",
     "message": "Invalid or missing CSRF token. Please refresh the page and try again."
   }
   ```

### Using Browser DevTools

1. Open browser to `http://localhost:3000`
2. Open DevTools (F12) → Console tab
3. Run these commands:

```javascript
// Get token
const response = await fetch('/api/csrf-token');
const { csrfToken } = await response.json();
console.log('Token:', csrfToken);

// Check cookie was set
console.log('Cookies:', document.cookie); // Note: __Host-csrf-token is httpOnly so won't show

// Test valid request
const validResponse = await fetch('/api/csrf-token', {
  method: 'POST',
  headers: {
    'x-csrf-token': csrfToken,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ test: 'data' })
});
console.log('Valid request status:', validResponse.status);

// Test invalid request
const invalidResponse = await fetch('/api/csrf-token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ test: 'data' })
});
console.log('Invalid request status:', invalidResponse.status); // Should be 403
```

### Using HTML Test Page

1. Start dev server: `npm run dev`
2. Open: `http://localhost:3000/test-csrf.html`
3. Click through the test buttons
4. Verify:
   - ✅ Get Token works
   - ✅ Valid request succeeds
   - ✅ Invalid request gets 403
   - ✅ fetchWithCsrf works (if properly configured)

## Testing in Production

### Before Deploying

1. **Verify environment variables:**
   ```bash
   # Check .env has CSRF_SECRET
   grep CSRF_SECRET .env
   ```

2. **Run all security tests:**
   ```bash
   npm run security-check
   ```

   Should show:
   ```
   ✓ All security tests passing (70 tests)
   ✓ TypeScript compilation successful
   ```

3. **Build the application:**
   ```bash
   npm run build
   ```

   Verify proxy is included:
   ```
   ƒ Proxy (Middleware)
   ```

### After Deploying

1. **Test CSRF endpoint:**
   ```bash
   curl https://your-domain.com/api/csrf-token
   ```

   Should return JSON with `csrfToken`

2. **Test invalid request:**
   ```bash
   curl -X POST https://your-domain.com/api/videos \
     -H "Content-Type: application/json" \
     -d '{"title":"test"}'
   ```

   Should return HTTP 403

3. **Check cookies in browser:**
   - Open DevTools → Application → Cookies
   - Should see `__Host-csrf-token` (production) or `csrf-token` (development)
   - Should be:
     - `HttpOnly`: ✓
     - `Secure`: ✓ (in production only)
     - `SameSite`: Lax

## Troubleshooting

### Issue: "CSRF token validation failed"

**Possible Causes:**
1. CSRF_SECRET not set in environment
2. Cookie not being sent (check browser settings)
3. Token mismatch between cookie and header

**Solutions:**
1. Check `.env` file has `CSRF_SECRET`
2. Ensure cookies are enabled
3. Use `fetchWithCsrf()` utility instead of manual fetch

### Issue: Tests failing with "proxy.ts not found"

**Solution:**
Proxy file should be at `src/proxy.ts` (not root `proxy.ts`)

```bash
# Check location
ls -la src/proxy.ts
```

### Issue: Proxy not running

**Check:**
1. Proxy matcher in `src/proxy.ts`
2. Next.js version (proxy requires Next.js 12+)
3. Build output shows "Proxy (Middleware)"

```bash
npm run build | grep Middleware
```

### Issue: All requests getting 403

**Possible Causes:**
1. CSRF_SECRET changed after tokens were issued
2. Clock skew between server and client
3. Cookie domain mismatch

**Solutions:**
1. Clear cookies and refresh
2. Restart dev server
3. Check cookie domain settings

## Verification Checklist

- [ ] CSRF_SECRET is set in `.env`
- [ ] All 70 security tests pass (`npm run test:security`)
- [ ] Build includes proxy (`npm run build`)
- [ ] GET requests work without token
- [ ] POST requests require token
- [ ] Invalid tokens are rejected (403)
- [ ] Cookie is httpOnly
- [ ] Cookie is Secure (in production)
- [ ] Mobile endpoints are exempted
- [ ] Documentation is clear

## Security Audit

Run this checklist after testing:

- [x] **CWE-352**: CSRF vulnerability mitigated
- [x] **Double Submit Cookie**: Implemented correctly
- [x] **Timing-Safe Comparison**: Hash-based comparison
- [x] **HttpOnly Cookies**: Enabled
- [x] **Secure Cookies**: Enabled in production
- [x] **SameSite Attribute**: Set to 'lax'
- [x] **Token Rotation**: Automatic
- [x] **Exempt Routes**: Mobile JWT endpoints
- [x] **Client Utilities**: `fetchWithCsrf` available
- [x] **Error Handling**: Proper 403 responses
- [x] **Logging**: CSRF failures logged
- [x] **Tests**: 20+ CSRF tests passing

---

**Last Updated:** January 8, 2026
**Status:** All Tests Passing ✅
**Production Ready:** Yes
