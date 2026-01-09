# Security Tests

This directory contains security tests that prevent regressions of critical and high-severity vulnerabilities.

## Purpose

These tests act as **security guardrails** to ensure that:
1. Fixed vulnerabilities don't get reintroduced
2. New code follows security best practices
3. Security configurations are properly maintained
4. Sensitive data is never exposed

## Test Suites

### 1. JWT Secret Security (`jwt-secret.test.ts`)
**Prevents:** Authentication Bypass (CWE-798 - Critical)

Tests that:
- No hardcoded JWT secret fallback values exist
- JWT_SECRET validation is enforced
- Secrets are imported from centralized location
- Environment configuration is documented

### 2. Path Traversal Prevention (`path-traversal.test.ts`)
**Prevents:** Path Traversal Attacks (CWE-22 - High)

Tests that:
- Path validation functions reject malicious inputs
- Traversal attempts with `..`, null bytes, and backslashes are blocked
- Only valid HLS file extensions are allowed
- Streaming endpoints use validation functions

### 3. Credential Exposure Prevention (`credential-exposure.test.ts`)
**Prevents:** Sensitive Data Exposure (CWE-200 - High)

Tests that:
- AWS credentials are never returned in API responses
- Email credentials use placeholder values
- Sensitive data is properly masked
- No credential logging occurs

### 4. Rate Limiting (`rate-limiting.test.ts`)
**Prevents:** Brute Force Attacks (CWE-307 - High)

Tests that:
- Authentication endpoints have rate limiting
- Progressive delays are implemented
- Retry-After headers are included
- Upstash Redis is configured

### 5. Authentication Security (`authentication.test.ts`)
**Prevents:** Various authentication vulnerabilities

Tests that:
- User enumeration is prevented
- Passwords are properly hashed with bcrypt
- JWT tokens have appropriate expiry
- Authorization checks are in place

## Running Security Tests

```bash
# Run all security tests
npm test -- src/__tests__/security

# Run specific test suite
npm test -- src/__tests__/security/jwt-secret.test.ts

# Run in watch mode during development
npm test -- --watch src/__tests__/security
```

## CI/CD Integration

These tests should be run:
- ✅ Before every commit (git pre-commit hook)
- ✅ On every pull request
- ✅ Before deployment to production

### GitHub Actions Example

```yaml
- name: Run Security Tests
  run: npm test -- src/__tests__/security

- name: Fail if security tests fail
  if: failure()
  run: |
    echo "Security tests failed! Do not merge or deploy."
    exit 1
```

## Adding New Security Tests

When fixing a security vulnerability:

1. **Create a test that would have caught it**
   - Write a test that fails with the vulnerability present
   - Verify it passes after the fix

2. **Document the vulnerability**
   - Add comments explaining what it prevents
   - Reference CWE numbers and severity

3. **Test both positive and negative cases**
   - Verify malicious input is rejected
   - Verify legitimate input is allowed

### Example

```typescript
describe('New Security Feature', () => {
  it('should reject malicious input', () => {
    // Test that would have caught the vulnerability
    expect(vulnerableFunction('../../etc/passwd')).toThrow();
  });

  it('should allow legitimate input', () => {
    // Test that legitimate use cases still work
    expect(secureFunction('valid-input')).toBeTruthy();
  });
});
```

## Maintenance

These tests are **critical security controls**. Any changes to these tests should:

1. Be reviewed by security-aware team members
2. Have clear justification for why the test is being modified
3. Not weaken security posture
4. Be documented in commit messages

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE (Common Weakness Enumeration)](https://cwe.mitre.org/)
- [Security Report](../../../SECURITY.md)

---

**Remember:** These tests are the last line of defense against reintroducing vulnerabilities. Treat them with care!
