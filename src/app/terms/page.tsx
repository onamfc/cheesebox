import Link from 'next/link';

export default function TermsOfService() {
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
          Terms of Service
        </h1>

        <div className="prose prose-invert prose-purple max-w-none space-y-8">
          <p className="text-gray-300 text-lg">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Agreement to Terms</h2>
            <p className="text-gray-300">
              By accessing or using Cheesebox, you agree to be bound by these Terms of Service and our Privacy Policy. If you disagree with any part of these terms, you may not access the service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Description of Service</h2>
            <p className="text-gray-300">
              Cheesebox is a self-hosted video sharing platform that enables you to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Upload and share videos using your own AWS infrastructure</li>
              <li>Manage video access through email permissions, teams, and share groups</li>
              <li>Stream videos using HLS (HTTP Live Streaming) technology</li>
              <li>Maintain complete ownership and control of your video content</li>
            </ul>
            <p className="text-gray-300">
              Cheesebox is provided as open-source software under the MIT License. You are responsible for your own AWS infrastructure and costs.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">User Accounts</h2>
            <p className="text-gray-300">To use Cheesebox, you must:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Be at least 13 years of age (or the age of consent in your jurisdiction)</li>
              <li>Configure your own AWS account with appropriate S3 buckets and IAM permissions</li>
            </ul>
            <p className="text-gray-300">
              You are responsible for all activity that occurs under your account.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Your Content and AWS Infrastructure</h2>
            <p className="text-gray-300">
              <strong>You retain all ownership rights to your content.</strong> By using Cheesebox:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Your videos are stored in your AWS S3 bucket, not on Cheesebox servers</li>
              <li>You are responsible for AWS costs incurred for storage and data transfer</li>
              <li>You must comply with AWS's Terms of Service and Acceptable Use Policy</li>
              <li>You grant Cheesebox limited technical access to your AWS resources only to facilitate the service</li>
            </ul>
            <p className="text-gray-300">
              Cheesebox stores only metadata about your videos (titles, descriptions, sharing settings) - not the actual video files.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Acceptable Use</h2>
            <p className="text-gray-300">You agree NOT to:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Upload content that violates any laws or infringes on others' rights</li>
              <li>Share illegal, abusive, harassing, or harmful content</li>
              <li>Attempt to gain unauthorized access to the service or other users' accounts</li>
              <li>Use the service to spam, phish, or distribute malware</li>
              <li>Reverse engineer or attempt to extract source code from the platform</li>
              <li>Overload or interfere with the service's infrastructure</li>
            </ul>
            <p className="text-gray-300">
              Violations may result in account termination and potential legal action.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Third-Party Services</h2>
            <p className="text-gray-300">
              Cheesebox integrates with third-party services including AWS, Resend, and Google. You agree to comply with their respective terms of service. We are not responsible for the availability or performance of these third-party services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Service Availability</h2>
            <p className="text-gray-300">
              Cheesebox is provided "as is" without warranties. We strive for high availability but do not guarantee:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Uninterrupted or error-free service</li>
              <li>That the service will meet your specific requirements</li>
              <li>That defects will be corrected immediately</li>
              <li>Backup or recovery of your AWS-hosted content</li>
            </ul>
            <p className="text-gray-300">
              You are responsible for maintaining backups of your video content and AWS configurations.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Intellectual Property</h2>
            <p className="text-gray-300">
              Cheesebox is open-source software licensed under the MIT License. You may:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Use, copy, modify, and distribute the software</li>
              <li>Use the software for commercial purposes</li>
              <li>Self-host your own instance</li>
            </ul>
            <p className="text-gray-300">
              The Cheesebox name and branding remain our property. See our{' '}
              <a
                href="https://github.com/onamfc/cheesebox/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 underline"
              >
                MIT License
              </a>
              {' '}for full details.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Limitation of Liability</h2>
            <p className="text-gray-300">
              To the maximum extent permitted by law, Cheesebox and its contributors shall not be liable for:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Loss of data, profits, or business opportunities</li>
              <li>AWS costs incurred through use of the service</li>
              <li>Unauthorized access to your content or AWS account</li>
              <li>Service interruptions or data loss</li>
              <li>Third-party actions or service failures</li>
            </ul>
            <p className="text-gray-300">
              Your use of the service is at your own risk.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Termination</h2>
            <p className="text-gray-300">
              You may terminate your account at any time by deleting it through the dashboard. We reserve the right to suspend or terminate accounts that violate these terms.
            </p>
            <p className="text-gray-300">
              Upon termination:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Your account and metadata will be deleted</li>
              <li>Video files in your AWS account remain under your control</li>
              <li>You must remove any Cheesebox AWS IAM credentials from your account</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Changes to Terms</h2>
            <p className="text-gray-300">
              We may revise these terms from time to time. Material changes will be communicated via email. Continued use of the service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Open Source and Community</h2>
            <p className="text-gray-300">
              Cheesebox is community-driven. We welcome contributions! See our{' '}
              <a
                href="https://github.com/onamfc/cheesebox/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 underline"
              >
                Contributing Guide
              </a>
              {' '}to get involved.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Governing Law</h2>
            <p className="text-gray-300">
              These terms are governed by the laws of the United States. Any disputes shall be resolved through binding arbitration in accordance with applicable laws.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Contact Us</h2>
            <p className="text-gray-300">
              Questions about these terms? Contact us:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>
                GitHub Issues:{' '}
                <a
                  href="https://github.com/onamfc/cheesebox/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  Report a concern
                </a>
              </li>
              <li>Email: legal@cheesebox.app (if configured)</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
