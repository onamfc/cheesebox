interface WelcomeStepProps {
  onNext: () => void;
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-8 md:p-12 text-center">
      {/* Hero message */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Welcome to Cheesebox! 🎉
        </h1>
        <p className="text-xl text-gray-300">
          Your videos, your infrastructure, your control.
        </p>
      </div>

      {/* Value propositions */}
      <div className="space-y-4 mb-10 text-left max-w-md mx-auto">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5">
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-white font-medium">Own your data</p>
            <p className="text-sm text-gray-400">Videos stay in YOUR AWS account</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5">
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-white font-medium">Share securely</p>
            <p className="text-sm text-gray-400">Control access with email permissions</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5">
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-white font-medium">Recipients need no AWS</p>
            <p className="text-sm text-gray-400">Just a free account to watch videos</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5">
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-white font-medium">Open source</p>
            <p className="text-sm text-gray-400">Transparent and community-driven</p>
          </div>
        </div>
      </div>

      {/* CTA button */}
      <button
        onClick={onNext}
        className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-md transition-all cursor-pointer"
      >
        Let's Get Started
      </button>
    </div>
  );
}
