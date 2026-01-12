import Link from 'next/link';

export default function SecurityPolicy() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link
          href="/"
          className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Security Policy
        </h1>

        <div className="prose prose-invert prose-purple max-w-none space-y-8">
          <p className="text-gray-300 text-lg">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Our Commitment to Security</h2>
            <p className="text-gray-300">
              Security is a core principle of Cheesebox. We implement industry-standard security practices and maintain transparency through our open-source codebase. This page outlines our security measures and responsible disclosure process.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Data Encryption</h2>
            <p className="text-gray-300">We protect your data using multiple layers of encryption:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>
                <strong>At Rest:</strong> AWS credentials are encrypted using AES-256-GCM encryption before being stored in our database
              </li>
              <li>
                <strong>In Transit:</strong> All connections use TLS 1.2+ encryption for data transmitted between your browser and our servers
              </li>
              <li>
                <strong>Database:</strong> All database connections are encrypted in transit
              </li>
              <li>
                <strong>Your Content:</strong> Videos remain in your AWS S3 bucket with your chosen encryption settings (server-side encryption recommended)
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Authentication and Access Control</h2>
            <p className="text-gray-300">We implement robust authentication mechanisms:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>
                <strong>NextAuth.js:</strong> Industry-standard authentication with secure session management
              </li>
              <li>
                <strong>Password Security:</strong> Passwords are hashed using bcrypt with appropriate salt rounds
              </li>
              <li>
                <strong>OAuth:</strong> Google Sign-In support for passwordless authentication
              </li>
              <li>
                <strong>Session Management:</strong> Secure HTTP-only cookies with appropriate expiration
              </li>
              <li>
                <strong>CSRF Protection:</strong> All state-changing requests require valid CSRF tokens
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Video Access Control</h2>
            <p className="text-gray-300">
              Cheesebox provides granular permission controls:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>
                <strong>Email Permissions:</strong> Videos can be shared with specific email addresses
              </li>
              <li>
                <strong>Teams:</strong> Organization-level access control for group collaboration
              </li>
              <li>
                <strong>Share Groups:</strong> Create custom permission groups for flexible sharing
              </li>
              <li>
                <strong>Presigned URLs:</strong> Temporary, expiring links for secure video access
              </li>
              <li>
                <strong>HLS Streaming:</strong> Video segments use secure, time-limited AWS presigned URLs
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">AWS Security Best Practices</h2>
            <p className="text-gray-300">
              We follow AWS security recommendations:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>
                <strong>IAM Least Privilege:</strong> AWS credentials are scoped with minimal necessary permissions
              </li>
              <li>
                <strong>S3 Bucket Policies:</strong> Buckets are private by default with explicit access controls
              </li>
              <li>
                <strong>CloudFormation:</strong> Infrastructure as Code for consistent, auditable deployments
              </li>
              <li>
                <strong>MediaConvert:</strong> Video transcoding in secure AWS environments
              </li>
              <li>
                <strong>VPC Isolation:</strong> Recommended for production deployments
              </li>
            </ul>
            <p className="text-gray-300">
              See our{' '}
              <a
                href="/llms/aws-setup.md"
                className="text-purple-400 hover:text-purple-300 underline"
              >
                AWS Setup Guide
              </a>
              {' '}for detailed security configurations.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Application Security</h2>
            <p className="text-gray-300">We protect against common vulnerabilities:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>
                <strong>SQL Injection:</strong> Parameterized queries via Prisma ORM
              </li>
              <li>
                <strong>XSS Prevention:</strong> React's automatic escaping and Content Security Policy headers
              </li>
              <li>
                <strong>CSRF Protection:</strong> Token-based validation for all mutations
              </li>
              <li>
                <strong>Rate Limiting:</strong> Protection against brute-force and DoS attacks via Upstash Redis
              </li>
              <li>
                <strong>Input Validation:</strong> Zod schemas validate all user inputs
              </li>
              <li>
                <strong>Secure Headers:</strong> HSTS, X-Frame-Options, X-Content-Type-Options
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Open Source Transparency</h2>
            <p className="text-gray-300">
              Security through transparency is part of our philosophy:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>
                <strong>Public Source Code:</strong> All code is available on{' '}
                <a
                  href="https://github.com/onamfc/cheesebox"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  GitHub
                </a>
              </li>
              <li>
                <strong>Community Review:</strong> Security researchers can audit our implementation
              </li>
              <li>
                <strong>Dependency Management:</strong> Regular updates and vulnerability scanning
              </li>
              <li>
                <strong>Security Documentation:</strong> Detailed guides for secure deployment
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Responsible Disclosure</h2>
            <p className="text-gray-300">
              We take security vulnerabilities seriously. If you discover a security issue:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>
                <strong>DO NOT</strong> disclose the vulnerability publicly until we've had a chance to address it
              </li>
              <li>
                Report the issue via{' '}
                <a
                  href="https://github.com/onamfc/cheesebox/security/advisories/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  GitHub Security Advisories
                </a>
                {' '}(preferred)
              </li>
              <li>Or email: security@cheesebox.app (if configured)</li>
              <li>
                Provide detailed steps to reproduce the vulnerability
              </li>
              <li>
                Allow reasonable time for us to investigate and patch
              </li>
            </ul>
            <p className="text-gray-300">
              We will acknowledge receipt within 48 hours and provide updates on the remediation timeline.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Security Acknowledgments</h2>
            <p className="text-gray-300">
              We appreciate security researchers who responsibly disclose vulnerabilities. Confirmed issues will be acknowledged in our{' '}
              <a
                href="https://github.com/onamfc/cheesebox/security/advisories"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 underline"
              >
                Security Advisories
              </a>
              {' '}page (with your permission).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Security Updates</h2>
            <p className="text-gray-300">
              Stay informed about security updates:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>
                Watch the{' '}
                <a
                  href="https://github.com/onamfc/cheesebox"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  GitHub repository
                </a>
                {' '}for security releases
              </li>
              <li>Subscribe to security advisories via GitHub</li>
              <li>Follow @cheeseboxapp on Twitter for announcements</li>
              <li>Security patches are released as soon as possible</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Third-Party Security</h2>
            <p className="text-gray-300">
              We rely on trusted third-party services with strong security practices:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>
                <strong>AWS:</strong> SOC 2, ISO 27001, HIPAA compliant infrastructure
              </li>
              <li>
                <strong>Vercel (hosting):</strong> Enterprise-grade security and DDoS protection
              </li>
              <li>
                <strong>Resend (email):</strong> SOC 2 Type II certified
              </li>
              <li>
                <strong>Upstash (Redis):</strong> Encrypted, serverless infrastructure
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Compliance and Certifications</h2>
            <p className="text-gray-300">
              While Cheesebox itself is not certified, we build on certified infrastructure:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>AWS infrastructure meets major compliance standards (GDPR, SOC 2, ISO 27001)</li>
              <li>Self-hosting gives you full control for compliance requirements</li>
              <li>Data residency is controlled by your AWS region selection</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Security Best Practices for Users</h2>
            <p className="text-gray-300">
              Help keep your account secure:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Use strong, unique passwords or Google Sign-In</li>
              <li>Enable S3 bucket encryption in your AWS account</li>
              <li>Regularly rotate AWS IAM credentials</li>
              <li>Monitor AWS CloudTrail logs for unusual activity</li>
              <li>Keep your deployment up to date with security patches</li>
              <li>Review video permissions regularly</li>
              <li>Use private S3 buckets with explicit access controls</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Contact Security Team</h2>
            <p className="text-gray-300">
              For security-related inquiries:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>
                Security Vulnerabilities:{' '}
                <a
                  href="https://github.com/onamfc/cheesebox/security/advisories/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  GitHub Security Advisories
                </a>
              </li>
              <li>General Security Questions: security@cheesebox.app (if configured)</li>
              <li>
                Public Discussion:{' '}
                <a
                  href="https://github.com/onamfc/cheesebox/discussions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  GitHub Discussions
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
