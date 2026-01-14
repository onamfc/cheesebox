interface HowItWorksStepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function HowItWorksStep({ onNext, onBack }: HowItWorksStepProps) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-8 md:p-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
          How It Works
        </h2>
        <p className="text-gray-300">
          Understanding the Cheesebox architecture
        </p>
      </div>

      {/* Architecture diagram (ASCII art style) */}
      <div className="bg-black/40 rounded-lg p-6 font-mono text-sm text-gray-300 mb-8 overflow-x-auto">
        <pre className="whitespace-pre">
{`┌─────────────┐
│  Your Video │
└──────┬──────┘
       │
       ▼
┌─────────────────┐     ┌──────────────────┐
│  Your S3 Bucket │ ──▶ │ AWS MediaConvert │
│   (Input)       │     │  (Transcoding)   │
└─────────────────┘     └────────┬─────────┘
                                 │
                                 ▼
                        ┌──────────────────┐
                        │  Your S3 Bucket  │
                        │    (Output)      │
                        └────────┬─────────┘
                                 │
                                 ▼
                        ┌──────────────────┐
                        │  Secure Streaming│
                        │  (HLS + Presign) │
                        └──────────────────┘`}
        </pre>
      </div>

      {/* Key points */}
      <div className="space-y-4 mb-8">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5">
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-white font-medium mb-1">Cheesebox never stores your videos</p>
            <p className="text-sm text-gray-400">
              We only store metadata (titles, descriptions, sharing settings). Your actual video files stay in YOUR AWS account.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5">
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-white font-medium mb-1">You pay AWS directly</p>
            <p className="text-sm text-gray-400">
              ~$0.023/GB storage + ~$0.015/min transcoding
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Example: 100 hours of video costs ~$5/month
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5">
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-white font-medium mb-1">Setup time</p>
            <p className="text-sm text-gray-400">
              <span className="text-purple-400 font-semibold">2 minutes</span> with CloudFormation (recommended)
            </p>
            <p className="text-sm text-gray-400">
              or <span className="text-gray-500">15-20 minutes</span> with manual setup
            </p>
          </div>
        </div>
      </div>

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
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-md transition-all cursor-pointer"
        >
          I'm Ready to Set Up AWS
        </button>
      </div>
    </div>
  );
}
