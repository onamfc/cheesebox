import Link from 'next/link';

export default function PrivacyPolicy() {
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
          Privacy Policy
        </h1>

        <div className="prose prose-invert prose-purple max-w-none space-y-8">
          <p className="text-gray-300 text-lg">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Your Data Belongs to You</h2>
            <p className="text-gray-300">
              Cheesebox is built on a fundamental principle: <strong>your data belongs to you</strong>. Unlike traditional video platforms, we don't store your videos on our servers. Instead, you maintain complete control by hosting your content in your own AWS account.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">What We Store</h2>
            <p className="text-gray-300">We only store the minimal information necessary to operate the platform:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Your account information (email, name, authentication credentials)</li>
              <li>Video metadata (titles, descriptions, sharing permissions)</li>
              <li>References to your videos stored in your AWS S3 bucket</li>
              <li>Team and share group configurations</li>
              <li>Access logs for security purposes</li>
            </ul>
            <p className="text-gray-300">
              All video files and processed transcoded content remain in <strong>your AWS account</strong>, under your control.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Data Encryption</h2>
            <p className="text-gray-300">
              We take security seriously. All sensitive data is encrypted:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>AWS credentials are encrypted using AES-256-GCM encryption at rest</li>
              <li>All data transmitted between your browser and our servers uses TLS encryption</li>
              <li>Database connections are encrypted in transit</li>
              <li>Video content remains in your AWS account with your chosen security settings</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Third-Party Services</h2>
            <p className="text-gray-300">
              Cheesebox integrates with the following third-party services:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li><strong>Amazon Web Services (AWS)</strong> - For video storage and transcoding in your account</li>
              <li><strong>Resend</strong> - For sending email notifications and sharing links</li>
              <li><strong>Google OAuth</strong> - For optional Google sign-in authentication</li>
            </ul>
            <p className="text-gray-300">
              Each of these services has their own privacy policies. We recommend reviewing them to understand how they handle your data.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Cookies and Tracking</h2>
            <p className="text-gray-300">
              We use essential cookies for:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Session management and authentication</li>
              <li>CSRF protection</li>
              <li>Remembering your theme preference</li>
            </ul>
            <p className="text-gray-300">
              We do not use advertising cookies or sell your data to third parties. We do not track you across other websites.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Data Retention</h2>
            <p className="text-gray-300">
              Your account data is retained for as long as your account is active. If you delete your account:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Your account information and metadata will be permanently deleted within 30 days</li>
              <li>Video files in your AWS account remain under your control - you must delete them manually if desired</li>
              <li>Anonymized usage logs may be retained for security and analytics purposes</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Your Rights</h2>
            <p className="text-gray-300">You have the right to:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and associated data</li>
              <li>Export your data</li>
              <li>Opt out of email communications</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Open Source</h2>
            <p className="text-gray-300">
              Cheesebox is open source (MIT License). You can review our code, security practices, and data handling on{' '}
              <a
                href="https://github.com/onamfc/cheesebox"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 underline"
              >
                GitHub
              </a>
              . Transparency is core to our mission.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Changes to This Policy</h2>
            <p className="text-gray-300">
              We may update this privacy policy from time to time. We will notify users of any material changes by email and by updating the "Last updated" date at the top of this policy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Contact Us</h2>
            <p className="text-gray-300">
              If you have questions about this privacy policy or how we handle your data, please contact us:
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
              <li>Email: privacy@cheesebox.app (if configured)</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
