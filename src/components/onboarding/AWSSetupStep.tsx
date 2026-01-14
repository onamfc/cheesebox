import Link from "next/link";
import { useState } from "react";

interface AWSSetupStepProps {
  onNext: () => void;
  onBack: () => void;
  onSkipToDashboard: () => void;
}

export default function AWSSetupStep({ onNext, onBack, onSkipToDashboard }: AWSSetupStepProps) {
  const [selectedTab, setSelectedTab] = useState<"quick" | "manual">("quick");

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-8 md:p-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
          AWS Quick Setup
        </h2>
        <p className="text-gray-300">
          Choose your preferred setup method
        </p>
      </div>

      {/* Tab selector */}
      <div className="flex gap-2 mb-6 bg-black/40 p-1 rounded-lg">
        <button
          onClick={() => setSelectedTab("quick")}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-all cursor-pointer ${
            selectedTab === "quick"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          ⚡ Quick Setup (2 min)
        </button>
        <button
          onClick={() => setSelectedTab("manual")}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-all cursor-pointer ${
            selectedTab === "manual"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          🛠️ Manual Setup (15-20 min)
        </button>
      </div>

      {/* Quick setup content */}
      {selectedTab === "quick" && (
        <div className="space-y-6">
          {/* CloudFormation option */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">CloudFormation Template (Recommended)</h3>
                <p className="text-sm text-gray-300 mb-4">
                  One-click deployment that automatically creates all required AWS resources:
                </p>
                <ul className="text-sm text-gray-400 space-y-1 mb-4 list-disc list-inside">
                  <li>Two S3 buckets (input and output)</li>
                  <li>IAM user with correct permissions</li>
                  <li>MediaConvert IAM role</li>
                  <li>Access keys ready to use</li>
                </ul>
                <Link
                  href="/help/aws-setup#cloudformation"
                  target="_blank"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-md transition-all cursor-pointer"
                >
                  Open CloudFormation Guide
                </Link>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-black/40 rounded-lg p-6">
            <h4 className="text-white font-semibold mb-3">Steps:</h4>
            <ol className="space-y-3 text-sm text-gray-300">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold">1</span>
                <span>Click the button above to open the CloudFormation guide</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold">2</span>
                <span>Follow the one-click deploy link to AWS Console</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold">3</span>
                <span>Copy your credentials from the CloudFormation outputs</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold">4</span>
                <span>Paste them into Settings → AWS Credentials</span>
              </li>
            </ol>
          </div>
        </div>
      )}

      {/* Manual setup content */}
      {selectedTab === "manual" && (
        <div className="space-y-6">
          {/* Manual option */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">Manual Configuration</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Step-by-step guide for custom setups or specific requirements.
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  Good if you need:
                </p>
                <ul className="text-sm text-gray-400 space-y-1 mb-4 list-disc list-inside">
                  <li>Custom IAM permissions</li>
                  <li>Existing AWS infrastructure</li>
                  <li>Specific region or bucket naming</li>
                </ul>
                <Link
                  href="/help/aws-setup#manual"
                  target="_blank"
                  className="inline-block px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-md border border-white/10 transition-all cursor-pointer"
                >
                  Open Manual Setup Guide
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-md border border-white/10 transition-all cursor-pointer"
        >
          Back
        </button>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onSkipToDashboard}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-md border border-white/10 transition-all cursor-pointer"
          >
            I'll Set This Up Later
          </button>
          <button
            onClick={onNext}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-md transition-all cursor-pointer"
          >
            I've Completed AWS Setup
          </button>
        </div>
      </div>
    </div>
  );
}
