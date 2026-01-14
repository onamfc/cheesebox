import Link from "next/link";
import { useState } from "react";

interface EmailSetupStepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function EmailSetupStep({ onNext, onBack }: EmailSetupStepProps) {
  const [wantsEmail, setWantsEmail] = useState<boolean | null>(null);

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-8 md:p-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Email Notifications (Optional)
        </h2>
        <p className="text-gray-300">
          Send email alerts when you share videos
        </p>
      </div>

      {/* Toggle cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Yes card */}
        <button
          onClick={() => setWantsEmail(true)}
          className={`bg-white/5 backdrop-blur-sm rounded-lg border p-6 text-left transition-all group cursor-pointer ${
            wantsEmail === true
              ? "border-purple-500/50 bg-purple-500/10"
              : "border-white/10 hover:border-white/20"
          }`}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">
              Yes, set up email
            </h3>
            <p className="text-sm text-gray-400">
              Recipients get notified when you share videos with them
            </p>
          </div>
        </button>

        {/* No card */}
        <button
          onClick={() => setWantsEmail(false)}
          className={`bg-white/5 backdrop-blur-sm rounded-lg border p-6 text-left transition-all group cursor-pointer ${
            wantsEmail === false
              ? "border-purple-500/50 bg-purple-500/10"
              : "border-white/10 hover:border-white/20"
          }`}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-gray-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-1.732 0-3.369-.457-4.773-1.273" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">
              Skip this
            </h3>
            <p className="text-sm text-gray-400">
              Videos still work! Recipients just won't get email notifications.
            </p>
          </div>
        </button>
      </div>

      {/* Info based on selection */}
      {wantsEmail === true && (
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 mb-6">
          <h4 className="text-white font-semibold mb-3">Email Provider Setup</h4>
          <p className="text-sm text-gray-300 mb-4">
            Configure your email provider in Settings after completing onboarding. We support:
          </p>
          <ul className="text-sm text-gray-400 space-y-2 list-disc list-inside mb-4">
            <li>Resend (recommended, easy setup)</li>
            <li>AWS SES (if you're already using AWS)</li>
            <li>SMTP (any email service)</li>
          </ul>
          <Link
            href="/help/email-setup"
            target="_blank"
            className="text-purple-400 hover:text-purple-300 text-sm underline"
          >
            View email setup guide →
          </Link>
        </div>
      )}

      {wantsEmail === false && (
        <div className="bg-black/40 rounded-lg p-6 mb-6">
          <h4 className="text-white font-semibold mb-2">No Problem!</h4>
          <p className="text-sm text-gray-400">
            You can always set up email later in Settings. Videos will still work perfectly - recipients can access them via direct links or their dashboard.
          </p>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-md border border-white/10 transition-all cursor-pointer"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={wantsEmail === null}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
