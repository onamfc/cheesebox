interface PathSelectionStepProps {
  onSelectPath: (path: "uploader" | "recipient") => void;
}

export default function PathSelectionStep({ onSelectPath }: PathSelectionStepProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
          What brings you to Cheesebox?
        </h2>
        <p className="text-gray-300">
          Choose your path to get started
        </p>
      </div>

      {/* Path selection cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Uploader card */}
        <button
          onClick={() => onSelectPath("uploader")}
          className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:border-purple-500/50 p-8 text-left transition-all group cursor-pointer"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-white">
              I want to upload and share videos
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-400">
              You'll need an AWS account (takes ~15 min to set up or 2 min with CloudFormation)
            </p>

            {/* Arrow */}
            <div className="text-purple-400 group-hover:translate-x-1 transition-transform">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </button>

        {/* Recipient card */}
        <button
          onClick={() => onSelectPath("recipient")}
          className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:border-purple-500/50 p-8 text-left transition-all group cursor-pointer"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-white">
              Someone shared a video with me
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-400">
              You're all set! No configuration needed.
            </p>

            {/* Arrow */}
            <div className="text-purple-400 group-hover:translate-x-1 transition-transform">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </button>
      </div>

      {/* Help text */}
      <p className="text-center text-sm text-gray-500 mt-6">
        Not sure yet? You can always come back to this later.
      </p>
    </div>
  );
}
