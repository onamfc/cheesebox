"use client";

import { useState } from "react";
import Link from "next/link";

// Component definitions outside main component
const CodeBlock = ({
  code,
  language,
  index,
  copiedIndex,
  onCopy,
}: {
  code: string;
  language: string;
  index: number;
  copiedIndex: number | null;
  onCopy: (text: string, index: number) => void;
}) => (
  <div className="relative my-4 rounded-lg bg-gray-900 p-4">
    <div className="mb-2 flex items-center justify-between">
      <span className="text-xs font-medium text-gray-400 uppercase">
        {language}
      </span>
      <button
        onClick={() => onCopy(code, index)}
        className="rounded bg-gray-700 px-3 py-1 text-xs text-white hover:bg-gray-600 transition-colors"
      >
        {copiedIndex === index ? "✓ Copied!" : "Copy"}
      </button>
    </div>
    <pre className="overflow-x-auto text-sm">
      <code className="text-green-400">{code}</code>
    </pre>
  </div>
);

const InlineCode = ({
  text,
  index,
  copiedIndex,
  onCopy,
}: {
  text: string;
  index: number;
  copiedIndex: number | null;
  onCopy: (text: string, index: number) => void;
}) => (
  <span className="inline-flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded text-sm">
    <code>{text}</code>
    <button
      onClick={() => onCopy(text, index)}
      className="inline-flex items-center justify-center hover:bg-white/10 rounded p-0.5 transition-colors"
      title="Copy to clipboard"
    >
      {copiedIndex === index ? (
        <svg
          className="w-3.5 h-3.5 text-green-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
        <svg
          className="w-3.5 h-3.5 text-gray-400 hover:text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      )}
    </button>
  </span>
);

const StepHeader = ({
  number,
  title,
  completedSteps,
  onToggle,
}: {
  number: number;
  title: string;
  completedSteps: Set<number>;
  onToggle: (stepNumber: number) => void;
}) => (
  <div className="mb-4 flex items-start gap-4">
    <div className="flex items-center gap-3">
      <button
        onClick={() => onToggle(number)}
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          completedSteps.has(number)
            ? "bg-purple-500 border-purple-500 text-white"
            : "border-purple-400 text-purple-400"
        }`}
      >
        {completedSteps.has(number) ? "✓" : number}
      </button>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
    </div>
  </div>
);

export default function AWSSetupGuide() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toggleStepComplete = (stepNumber: number) => {
    setCompletedSteps((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(stepNumber)) {
        newSet.delete(stepNumber);
      } else {
        newSet.add(stepNumber);
      }
      return newSet;
    });
  };

  const iamPolicy = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::YOUR-BUCKET-NAME",
        "arn:aws:s3:::YOUR-BUCKET-NAME/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "mediaconvert:CreateJob",
        "mediaconvert:GetJob",
        "mediaconvert:DescribeEndpoints"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": "iam:PassRole",
      "Resource": "arn:aws:iam::YOUR-ACCOUNT-ID:role/MediaConvertRole",
      "Condition": {
        "StringEquals": {
          "iam:PassedToService": "mediaconvert.amazonaws.com"
        }
      }
    }
  ]
}`;

  const corsConfig = `[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD", "PUT"],
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://your-production-domain.com"
    ],
    "ExposeHeaders": ["Content-Length", "Content-Range", "ETag"],
    "MaxAgeSeconds": 3000
  }
]`;

  const mediaConvertPolicy = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::YOUR-BUCKET-NAME",
        "arn:aws:s3:::YOUR-BUCKET-NAME/*"
      ]
    }
  ]
}`;

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link
            href="/settings"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-4"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Settings
          </Link>
          <h1 className="text-4xl font-bold text-white mb-3">
            AWS Setup Guide
          </h1>
          <p className="text-lg text-gray-300">
            Step-by-step instructions to configure your AWS account
          </p>
        </div>

        {/* Prerequisites Alert */}
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-purple-400 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Before You Start
              </h3>
              <p className="text-gray-300 mb-2">
                You&apos;ll need an AWS account. If you don&apos;t have one:
              </p>
              <a
                href="https://aws.amazon.com/free"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium"
              >
                Create a free AWS account
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Setup Options */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            Choose Your Setup Method
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Quick Setup Option */}
            <div className="bg-purple-500/10 border-2 border-purple-500/30 rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Quick Setup
                  </h3>
                  <p className="text-sm text-purple-300">
                    Recommended • ~2 minutes
                  </p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                One-click automated setup using AWS CloudFormation. Everything
                is created automatically with best practices built-in.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm text-gray-300">
                  <svg
                    className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  No manual configuration needed
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-300">
                  <svg
                    className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Zero errors or typos
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-300">
                  <svg
                    className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Security best practices included
                </li>
              </ul>
              <a
                href="#quick-setup"
                className="block w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors text-center"
              >
                Use Quick Setup →
              </a>
            </div>

            {/* Manual Setup Option */}
            <div className="bg-white/5 border-2 border-white/10 rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Manual Setup
                  </h3>
                  <p className="text-sm text-gray-300">
                    For learning • ~15-20 minutes
                  </p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                Step-by-step guide through the AWS Console. Learn how each
                component works and configure everything yourself.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm text-gray-300">
                  <svg
                    className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Learn AWS services
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-300">
                  <svg
                    className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Full control and customization
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-300">
                  <svg
                    className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Understand security settings
                </li>
              </ul>
              <a
                href="#manual-setup"
                className="block w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors text-center"
              >
                Use Manual Setup →
              </a>
            </div>
          </div>
        </div>

        {/* Quick Setup Section */}
        <section id="quick-setup" className="mb-12 scroll-mt-8">
          <div className="bg-purple-500/10 border-2 border-purple-500/30 rounded-lg p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <svg
                className="w-10 h-10 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <h2 className="text-3xl font-bold text-white">
                Quick Setup (Recommended)
              </h2>
            </div>

            <div className="bg-black/40 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                How It Works
              </h3>
              <ol className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  <span>
                    Click the &quot;Launch Stack&quot; button below to open AWS
                    CloudFormation
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  <span>
                    Enter a unique bucket name (e.g.,{" "}
                    <code className="bg-white/10 px-2 py-1 rounded text-sm">
                      my-private-videos-123
                    </code>
                    )
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <span>
                    Check the box acknowledging IAM resource creation
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </span>
                  <span>Click &quot;Create Stack&quot; and wait ~2 minutes</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    5
                  </span>
                  <span>
                    Copy all 5 credentials from the &quot;Outputs&quot; tab
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    6
                  </span>
                  <span>
                    Paste them into your{" "}
                    <Link
                      href="/settings"
                      className="text-purple-400 underline font-medium"
                    >
                      Settings page
                    </Link>
                  </span>
                </li>
              </ol>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div>
                  <h4 className="font-semibold text-white mb-1">
                    Important Notes
                  </h4>
                  <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
                    <li>
                      The CloudFormation stack will create resources in your AWS
                      account
                    </li>
                    <li>
                      AWS may charge small fees for S3 storage and MediaConvert
                      usage
                    </li>
                    <li>
                      Save the Secret Access Key immediately - you can&apos;t
                      retrieve it later
                    </li>
                    <li>
                      You can delete the CloudFormation stack anytime to remove
                      all resources
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <a
                href={`https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/create/review?templateURL=https://raw.githubusercontent.com/onamfc/cheesebox/main/public/cloudformation/private-video-setup.yaml&stackName=CheeseboxSetup`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-lg shadow-xl transition-all transform hover:scale-105 text-lg"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
                Launch Stack in AWS
              </a>
              <p className="mt-3 text-sm text-gray-300">
                Opens AWS CloudFormation Console in a new tab
              </p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="relative my-12">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-[#0a0a0a] text-gray-300 font-medium">
              OR
            </span>
          </div>
        </div>

        {/* Manual Setup Section */}
        <div id="manual-setup" className="scroll-mt-8">
          <div className="bg-white/5 border-2 border-white/10 rounded-lg p-6 mb-8 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <svg
                className="w-10 h-10 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <h2 className="text-3xl font-bold text-white">
                Manual Setup
              </h2>
            </div>
            <p className="text-gray-300">
              Follow these detailed instructions to manually configure your AWS
              account. This gives you full control and helps you understand each
              component.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Step 1: Create S3 Bucket */}
          <section className="bg-white/5 rounded-lg shadow-sm p-8 border border-white/10">
            <StepHeader
              number={1}
              title="Create an S3 Bucket"
              completedSteps={completedSteps}
              onToggle={toggleStepComplete}
            />

            <div className="ml-12 space-y-4">
              <p className="text-gray-300">
                Amazon S3 will store your videos. You need to create a bucket
                where all your video files will be kept.
              </p>

              <div className="bg-black/40 rounded-lg p-4 border border-white/10">
                <ol className="space-y-3 list-decimal list-inside text-gray-300">
                  <li>
                    Go to{" "}
                    <a
                      href="https://console.aws.amazon.com/s3"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:underline font-medium"
                    >
                      AWS Console → S3
                    </a>
                  </li>
                  <li>Click the &quot;Create bucket&quot; button</li>
                  <li>
                    <strong>Bucket name:</strong> Choose a unique name (e.g.,{" "}
                    <code className="bg-white/10 px-2 py-1 rounded text-sm">
                      my-private-videos-123
                    </code>
                    )
                  </li>
                  <li>
                    <strong>Region:</strong> Choose your preferred region (e.g.,{" "}
                    <code className="bg-white/10 px-2 py-1 rounded text-sm">
                      us-east-1
                    </code>
                    )
                  </li>
                  <li>
                    <strong>Block Public Access:</strong> Keep all boxes CHECKED
                    (videos should be private)
                  </li>
                  <li>Click &quot;Create bucket&quot;</li>
                  <li className="font-semibold text-purple-300">
                    ✏️ Save the bucket name - you&apos;ll need this later!
                  </li>
                </ol>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mt-4">
                <h4 className="font-semibold text-white mb-2">
                  Configure CORS (Required for Uploads & Streaming)
                </h4>
                <p className="text-gray-300 text-sm mb-3">
                  After creating the bucket, configure CORS to allow your
                  browser to upload and stream videos directly:
                </p>
                <ol className="space-y-2 list-decimal list-inside text-sm text-gray-300">
                  <li>Click on your newly created bucket</li>
                  <li>
                    Go to the <strong>Permissions</strong> tab
                  </li>
                  <li>
                    Scroll down to{" "}
                    <strong>Cross-origin resource sharing (CORS)</strong>
                  </li>
                  <li>
                    Click <strong>Edit</strong>
                  </li>
                  <li>Paste this configuration:</li>
                </ol>
                <CodeBlock
                  code={corsConfig}
                  language="JSON"
                  index={1}
                  copiedIndex={copiedIndex}
                  onCopy={copyToClipboard}
                />
                <p className="text-sm text-gray-300 mt-2">
                  <strong>Important:</strong> Replace{" "}
                  <code className="bg-yellow-500/20 px-2 py-1 rounded">
                    https://your-production-domain.com
                  </code>{" "}
                  with your actual domain when you deploy.
                </p>
              </div>
            </div>
          </section>

          {/* Step 2: Create IAM User */}
          <section className="bg-white/5 rounded-lg shadow-sm p-8 border border-white/10">
            <StepHeader
              number={2}
              title="Create IAM User with Permissions"
              completedSteps={completedSteps}
              onToggle={toggleStepComplete}
            />

            <div className="ml-12 space-y-4">
              <p className="text-gray-300">
                Create a dedicated user with permissions to manage your videos
                and use MediaConvert for transcoding.
              </p>

              <div className="bg-black/40 rounded-lg p-4 border border-white/10">
                <h4 className="font-semibold text-white mb-3">
                  Create the IAM User
                </h4>
                <ol className="space-y-3 list-decimal list-inside text-gray-300">
                  <li>
                    Go to{" "}
                    <a
                      href="https://console.aws.amazon.com/iam/home#/users"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:underline font-medium"
                    >
                      AWS Console → IAM → Users
                    </a>
                  </li>
                  <li>Click &quot;Create user&quot;</li>
                  <li>
                    <strong>User name:</strong>{" "}
                    <InlineCode
                      text="private-video-user"
                      index={100}
                      copiedIndex={copiedIndex}
                      onCopy={copyToClipboard}
                    />
                  </li>
                  <li>Click &quot;Next&quot;</li>
                  <li>Select &quot;Attach policies directly&quot;</li>
                  <li>
                    Click &quot;Create policy&quot; (opens in new tab - keep it
                    open!)
                  </li>
                </ol>
              </div>

              <div className="bg-black/40 rounded-lg p-4 border border-white/10 mt-4">
                <h4 className="font-semibold text-white mb-3">
                  Create the IAM Policy
                </h4>
                <p className="text-sm text-gray-300 mb-3">
                  In the new tab that opened:
                </p>
                <ol className="space-y-3 list-decimal list-inside text-gray-300">
                  <li>Click the &quot;JSON&quot; tab</li>
                  <li>Paste this policy (see below)</li>
                  <li>
                    <strong className="text-red-400">
                      IMPORTANT: Replace the placeholders!
                    </strong>
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-sm">
                      <li>
                        <code className="bg-red-500/20 px-2 py-1 rounded">
                          YOUR-BUCKET-NAME
                        </code>{" "}
                        → Your bucket name from Step 1
                      </li>
                      <li>
                        <code className="bg-red-500/20 px-2 py-1 rounded">
                          YOUR-ACCOUNT-ID
                        </code>{" "}
                        → Your 12-digit AWS account ID (find it in the top-right
                        corner)
                      </li>
                    </ul>
                  </li>
                  <li>Click &quot;Next&quot;</li>
                  <li>
                    <strong>Policy name:</strong>{" "}
                    <InlineCode
                      text="PrivateVideoPolicy"
                      index={101}
                      copiedIndex={copiedIndex}
                      onCopy={copyToClipboard}
                    />
                  </li>
                  <li>Click &quot;Create policy&quot;</li>
                </ol>
                <CodeBlock
                  code={iamPolicy}
                  language="JSON"
                  index={2}
                  copiedIndex={copiedIndex}
                  onCopy={copyToClipboard}
                />
              </div>

              <div className="bg-black/40 rounded-lg p-4 border border-white/10 mt-4">
                <h4 className="font-semibold text-white mb-3">
                  Attach Policy to User
                </h4>
                <ol className="space-y-3 list-decimal list-inside text-gray-300">
                  <li>Go back to the user creation tab</li>
                  <li>Refresh the policies list</li>
                  <li>
                    Search for{" "}
                    <code className="bg-white/10 px-2 py-1 rounded text-sm">
                      PrivateVideoPolicy
                    </code>{" "}
                    and check the box
                  </li>
                  <li>Click &quot;Next&quot; → &quot;Create user&quot;</li>
                </ol>
              </div>

              <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30 mt-4">
                <h4 className="font-semibold text-white mb-3">
                  Get Your Access Keys
                </h4>
                <ol className="space-y-3 list-decimal list-inside text-gray-300">
                  <li>Click on your newly created user</li>
                  <li>
                    Go to <strong>Security credentials</strong> tab
                  </li>
                  <li>
                    Scroll to <strong>Access keys</strong>
                  </li>
                  <li>Click &quot;Create access key&quot;</li>
                  <li>Select &quot;Other&quot; → Click &quot;Next&quot;</li>
                  <li>Click &quot;Create access key&quot;</li>
                  <li className="font-bold text-white">
                    🔐 IMPORTANT: Copy and save these immediately!
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1 font-normal">
                      <li>
                        <strong>Access key ID</strong> (looks like:{" "}
                        <code className="bg-purple-500/20 px-2 py-1 rounded text-xs">
                          AKIAIOSFODNN7EXAMPLE
                        </code>
                        )
                      </li>
                      <li>
                        <strong>Secret access key</strong> (looks like:{" "}
                        <code className="bg-purple-500/20 px-2 py-1 rounded text-xs">
                          wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
                        </code>
                        )
                      </li>
                      <li className="text-red-400 font-semibold">
                        You won&apos;t be able to see the secret key again!
                      </li>
                    </ul>
                  </li>
                </ol>
              </div>
            </div>
          </section>

          {/* Step 3: Create MediaConvert Role */}
          <section className="bg-white/5 rounded-lg shadow-sm p-8 border border-white/10">
            <StepHeader
              number={3}
              title="Create MediaConvert IAM Role"
              completedSteps={completedSteps}
              onToggle={toggleStepComplete}
            />

            <div className="ml-12 space-y-4">
              <p className="text-gray-300">
                MediaConvert needs permission to read your videos from S3 and
                write the transcoded files back. This role grants those
                permissions.
              </p>

              <div className="bg-black/40 rounded-lg p-4 border border-white/10">
                <h4 className="font-semibold text-white mb-3">
                  Create the Role
                </h4>
                <ol className="space-y-3 list-decimal list-inside text-gray-300">
                  <li>
                    Go to{" "}
                    <a
                      href="https://console.aws.amazon.com/iam/home#/roles"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:underline font-medium"
                    >
                      AWS Console → IAM → Roles
                    </a>
                  </li>
                  <li>Click &quot;Create role&quot;</li>
                  <li>
                    <strong>Trusted entity type:</strong> Select &quot;AWS
                    service&quot;
                  </li>
                  <li>
                    <strong>Use case:</strong> Scroll down and select{" "}
                    <strong>MediaConvert</strong> from the dropdown
                  </li>
                  <li>Click &quot;Next&quot;</li>
                  <li>Click &quot;Next&quot; (skip permissions for now)</li>
                  <li>
                    <strong>Role name:</strong>{" "}
                    <InlineCode
                      text="MediaConvertRole"
                      index={102}
                      copiedIndex={copiedIndex}
                      onCopy={copyToClipboard}
                    />
                  </li>
                  <li>Click &quot;Create role&quot;</li>
                </ol>
              </div>

              <div className="bg-black/40 rounded-lg p-4 border border-white/10 mt-4">
                <h4 className="font-semibold text-white mb-3">
                  Add S3 Permissions to the Role
                </h4>
                <ol className="space-y-3 list-decimal list-inside text-gray-300">
                  <li>Click on the role you just created</li>
                  <li>
                    Go to the <strong>Permissions</strong> tab
                  </li>
                  <li>
                    Click &quot;Add permissions&quot; → &quot;Create inline
                    policy&quot;
                  </li>
                  <li>Click the &quot;JSON&quot; tab</li>
                  <li>Paste this policy (see below)</li>
                  <li>
                    <strong className="text-red-400">
                      IMPORTANT: Replace{" "}
                      <code className="bg-red-500/20 px-2 py-1 rounded">
                        YOUR-BUCKET-NAME
                      </code>{" "}
                      with your bucket name!
                    </strong>
                  </li>
                  <li>Click &quot;Next&quot;</li>
                  <li>
                    <strong>Policy name:</strong>{" "}
                    <InlineCode
                      text="S3BucketAccess"
                      index={103}
                      copiedIndex={copiedIndex}
                      onCopy={copyToClipboard}
                    />
                  </li>
                  <li>Click &quot;Create policy&quot;</li>
                </ol>
                <CodeBlock
                  code={mediaConvertPolicy}
                  language="JSON"
                  index={3}
                  copiedIndex={copiedIndex}
                  onCopy={copyToClipboard}
                />
              </div>

              <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30 mt-4">
                <h4 className="font-semibold text-white mb-3">
                  Copy the Role ARN
                </h4>
                <ol className="space-y-3 list-decimal list-inside text-gray-300">
                  <li>Go back to the role summary page</li>
                  <li>
                    At the top, find the <strong>ARN</strong> field
                  </li>
                  <li className="font-bold text-white">
                    📋 Copy this entire ARN - you&apos;ll need it!
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1 font-normal">
                      <li>
                        It looks like:{" "}
                        <code className="bg-purple-500/20 px-2 py-1 rounded text-xs">
                          arn:aws:iam::123456789012:role/MediaConvertRole
                        </code>
                      </li>
                      <li className="text-red-400 font-semibold">
                        Make sure it says <code>role/</code> not{" "}
                        <code>policy/</code>!
                      </li>
                    </ul>
                  </li>
                </ol>
              </div>
            </div>
          </section>

          {/* Summary Checklist */}
          <section className="bg-purple-500/10 rounded-lg shadow-sm p-8 border-2 border-purple-500/30">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <svg
                className="w-8 h-8 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Setup Complete! Here&apos;s What You Need
            </h2>
            <p className="text-gray-300 mb-6">
              Before heading to the Settings page, make sure you have all of
              these:
            </p>
            <div className="bg-black/40 rounded-lg p-6 space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5">
                  <svg
                    className="w-4 h-4 text-purple-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <strong className="text-white">
                    S3 Bucket Name (e.g., my-private-videos-123)
                  </strong>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5">
                  <svg
                    className="w-4 h-4 text-purple-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <strong className="text-white">
                    AWS Region (e.g., us-east-1)
                  </strong>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5">
                  <svg
                    className="w-4 h-4 text-purple-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <strong className="text-white">
                    IAM Access Key ID (e.g., AKIAIOSFODNN7EXAMPLE)
                  </strong>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5">
                  <svg
                    className="w-4 h-4 text-purple-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <strong className="text-white">
                    IAM Secret Access Key (e.g., wJalrXUtnFEMI/K7MDENG...)
                  </strong>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5">
                  <svg
                    className="w-4 h-4 text-purple-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <strong className="text-white">
                    MediaConvert Role ARN (e.g.,
                    arn:aws:iam::123456789012:role/MediaConvertRole)
                  </strong>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <Link
                href="/settings"
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors text-center"
              >
                Go to Settings & Enter Your Credentials
              </Link>
            </div>
          </section>

          {/* Need Help Section */}
          <section className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3">
              Need Help?
            </h3>
            <p className="text-gray-300 mb-4">
              If you run into any issues during setup:
            </p>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  Check the{" "}
                  <a
                    href="https://github.com/onamfc/cheesebox/blob/main/TROUBLESHOOTING.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:underline"
                  >
                    Troubleshooting Guide
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span>
                  Visit{" "}
                  <a
                    href="https://github.com/onamfc/cheesebox/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:underline"
                  >
                    GitHub Issues
                  </a>{" "}
                  to report problems
                </span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <span>
                  Review the{" "}
                  <a
                    href="https://github.com/onamfc/cheesebox/blob/main/README.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:underline"
                  >
                    full README
                  </a>
                </span>
              </li>
            </ul>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-300 text-sm">
          <p>
            Your AWS credentials are encrypted before being stored and are only
            used to upload and manage your videos.
          </p>
        </div>
      </div>
    </div>
  );
}
