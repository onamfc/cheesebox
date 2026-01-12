import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CompletionStepProps {
  path: "uploader" | "recipient" | "skipped";
}

export default function CompletionStep({ path }: CompletionStepProps) {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Trigger confetti animation
    setShowConfetti(true);
  }, []);

  const getPersonalizedMessage = () => {
    switch (path) {
      case "uploader":
        return {
          title: "You're All Set! 🎉",
          subtitle: "Your AWS credentials are configured. Ready to upload your first video?",
          cta: "Go to Dashboard",
        };
      case "recipient":
        return {
          title: "Welcome to Cheesebox! 🎉",
          subtitle: "You're ready to watch videos! Shared videos will appear in your dashboard, and you'll also receive email notifications.",
          cta: "Go to Dashboard",
        };
      case "skipped":
        return {
          title: "Welcome to Cheesebox! 🎉",
          subtitle: "You can complete the setup anytime from Settings.",
          cta: "Go to Dashboard",
        };
    }
  };

  const message = getPersonalizedMessage();

  const handleGoToDashboard = () => {
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="relative overflow-hidden">
      {/* Confetti effect (CSS animation) */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="confetti-container">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  backgroundColor: i % 2 === 0 ? "#a855f7" : "#ec4899",
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-8 md:p-12 text-center relative z-10">
        {/* Success icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center">
            <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {message.title}
        </h1>
        <p className="text-xl text-gray-300 mb-10 break-words">
          {message.subtitle}
        </p>

        {/* Quick reference card */}
        <div className="bg-black/40 rounded-lg p-6 mb-8 text-left max-w-md mx-auto break-words">
          <h3 className="text-white font-semibold mb-4 text-center">Quick Reference</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-gray-300">
                <span className="text-white font-medium">Upload videos:</span> Dashboard → Upload button
              </span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-gray-300">
                <span className="text-white font-medium">Manage credentials:</span> Settings
              </span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-300">
                <span className="text-white font-medium">Need help?</span> Help Center
              </span>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex justify-center">
          <button
            onClick={handleGoToDashboard}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-md transition-all cursor-pointer"
          >
            {message.cta}
          </button>
        </div>
      </div>

      {/* CSS for confetti animation */}
      <style jsx>{`
        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) rotate(360deg);
          }
        }

        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          top: -10px;
          opacity: 0.8;
          animation: confetti-fall 3s linear forwards;
        }

        .confetti-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
