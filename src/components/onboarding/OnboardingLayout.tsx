import { ReactNode } from "react";

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  onSkip?: () => void;
  showSkip?: boolean;
}

export default function OnboardingLayout({
  children,
  currentStep,
  totalSteps,
  onSkip,
  showSkip = true,
}: OnboardingLayoutProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col overflow-x-hidden">
      {/* Header with progress */}
      <div className="bg-black/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">Cheesebox</h1>
            </div>

            {/* Skip button */}
            {showSkip && onSkip && (
              <button
                onClick={onSkip}
                className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
              >
                Skip for now
              </button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {children}
        </div>
      </main>

      {/* Step indicator */}
      <div className="py-4 text-center text-sm text-gray-400">
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  );
}
