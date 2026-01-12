"use client";

import { useState } from "react";
import Link from "next/link";

export default function EmailSetupGuide() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [selectedProvider, setSelectedProvider] = useState<"resend" | "ses" | "smtp">("resend");

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

  const CodeBlock = ({
    code,
    language,
    index,
  }: {
    code: string;
    language: string;
    index: number;
  }) => (
    <div className="relative my-4 rounded-lg bg-gray-900 p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-400 uppercase">
          {language}
        </span>
        <button
          onClick={() => copyToClipboard(code, index)}
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

  const StepHeader = ({
    number,
    title,
  }: {
    number: number;
    title: string;
  }) => (
    <div className="mb-4 flex items-start gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => toggleStepComplete(number)}
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

  const sesPolicy = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail",
        "ses:GetSendQuota"
      ],
      "Resource": "*"
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
            Email Provider Setup Guide
          </h1>
          <p className="text-lg text-gray-300">
            Configure your email service to send video sharing notifications
          </p>
        </div>

        {/* Overview Alert */}
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
                Why Configure Email?
              </h3>
              <p className="text-gray-300 mb-2">
                Cheesebox uses your own email provider to send video sharing notifications. This gives you:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
                <li>Cost Control - Use your existing email service or free tiers</li>
                <li>Branding - Emails come from your own domain</li>
                <li>Deliverability - Leverage your established sender reputation</li>
                <li>Compliance - Use email providers that meet your requirements</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Provider Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            Choose Your Email Provider
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Resend Option */}
            <button
              onClick={() => setSelectedProvider("resend")}
              className={`bg-white/5 border-2 rounded-lg p-6 shadow-lg transition-all ${
                selectedProvider === "resend"
                  ? "border-purple-400 ring-2 ring-purple-500/30"
                  : "border-white/10 hover:border-purple-500/30"
              }`}
            >
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
                  <h3 className="text-xl font-bold text-white">Resend</h3>
                  <p className="text-sm text-gray-300">Simple API</p>
                </div>
              </div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 -46 417.81333 417" xmlns="http://www.w3.org/2000/svg">
                    <path d="m159.988281 318.582031c-3.988281 4.011719-9.429687 6.25-15.082031 6.25s-11.09375-2.238281-15.082031-6.25l-120.449219-120.46875c-12.5-12.5-12.5-32.769531 0-45.246093l15.082031-15.085938c12.503907-12.5 32.75-12.5 45.25 0l75.199219 75.203125 203.199219-203.203125c12.503906-12.5 32.769531-12.5 45.25 0l15.082031 15.085938c12.5 12.5 12.5 32.765624 0 45.246093zm0 0" fill="#c084fc"></path>
                  </svg>
                  <span>Free: 100/day</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 -46 417.81333 417" xmlns="http://www.w3.org/2000/svg">
                    <path d="m159.988281 318.582031c-3.988281 4.011719-9.429687 6.25-15.082031 6.25s-11.09375-2.238281-15.082031-6.25l-120.449219-120.46875c-12.5-12.5-12.5-32.769531 0-45.246093l15.082031-15.085938c12.503907-12.5 32.75-12.5 45.25 0l75.199219 75.203125 203.199219-203.203125c12.503906-12.5 32.769531-12.5 45.25 0l15.082031 15.085938c12.5 12.5 12.5 32.765624 0 45.246093zm0 0" fill="#c084fc"></path>
                  </svg>
                  <span>Paid: $20/mo (50k)</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 -46 417.81333 417" xmlns="http://www.w3.org/2000/svg">
                    <path d="m159.988281 318.582031c-3.988281 4.011719-9.429687 6.25-15.082031 6.25s-11.09375-2.238281-15.082031-6.25l-120.449219-120.46875c-12.5-12.5-12.5-32.769531 0-45.246093l15.082031-15.085938c12.503907-12.5 32.75-12.5 45.25 0l75.199219 75.203125 203.199219-203.203125c12.503906-12.5 32.769531-12.5 45.25 0l15.082031 15.085938c12.5 12.5 12.5 32.765624 0 45.246093zm0 0" fill="#c084fc"></path>
                  </svg>
                  <span>Easy setup</span>
                </li>
              </ul>
            </button>

            {/* AWS SES Option */}
            <button
              onClick={() => setSelectedProvider("ses")}
              className={`bg-white/5 border-2 rounded-lg p-6 shadow-lg transition-all ${
                selectedProvider === "ses"
                  ? "border-purple-400 ring-2 ring-purple-500/30"
                  : "border-white/10 hover:border-purple-500/30"
              }`}
            >
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
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">AWS SES</h3>
                  <p className="text-sm text-gray-300">Low cost</p>
                </div>
              </div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 -46 417.81333 417" xmlns="http://www.w3.org/2000/svg">
                    <path d="m159.988281 318.582031c-3.988281 4.011719-9.429687 6.25-15.082031 6.25s-11.09375-2.238281-15.082031-6.25l-120.449219-120.46875c-12.5-12.5-12.5-32.769531 0-45.246093l15.082031-15.085938c12.503907-12.5 32.75-12.5 45.25 0l75.199219 75.203125 203.199219-203.203125c12.503906-12.5 32.769531-12.5 45.25 0l15.082031 15.085938c12.5 12.5 12.5 32.765624 0 45.246093zm0 0" fill="#c084fc"></path>
                  </svg>
                  <span>Free: 62k/mo (12mo)</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 -46 417.81333 417" xmlns="http://www.w3.org/2000/svg">
                    <path d="m159.988281 318.582031c-3.988281 4.011719-9.429687 6.25-15.082031 6.25s-11.09375-2.238281-15.082031-6.25l-120.449219-120.46875c-12.5-12.5-12.5-32.769531 0-45.246093l15.082031-15.085938c12.503907-12.5 32.75-12.5 45.25 0l75.199219 75.203125 203.199219-203.203125c12.503906-12.5 32.769531-12.5 45.25 0l15.082031 15.085938c12.5 12.5 12.5 32.765624 0 45.246093zm0 0" fill="#c084fc"></path>
                  </svg>
                  <span>Paid: $0.10/1k</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 -46 417.81333 417" xmlns="http://www.w3.org/2000/svg">
                    <path d="m159.988281 318.582031c-3.988281 4.011719-9.429687 6.25-15.082031 6.25s-11.09375-2.238281-15.082031-6.25l-120.449219-120.46875c-12.5-12.5-12.5-32.769531 0-45.246093l15.082031-15.085938c12.503907-12.5 32.75-12.5 45.25 0l75.199219 75.203125 203.199219-203.203125c12.503906-12.5 32.769531-12.5 45.25 0l15.082031 15.085938c12.5 12.5 12.5 32.765624 0 45.246093zm0 0" fill="#c084fc"></path>
                  </svg>
                  <span>Best at scale</span>
                </li>
              </ul>
            </button>

            {/* SMTP Option */}
            <button
              onClick={() => setSelectedProvider("smtp")}
              className={`bg-white/5 border-2 rounded-lg p-6 shadow-lg transition-all ${
                selectedProvider === "smtp"
                  ? "border-purple-400 ring-2 ring-purple-500/30"
                  : "border-white/10 hover:border-purple-500/30"
              }`}
            >
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">SMTP</h3>
                  <p className="text-sm text-gray-300">Universal</p>
                </div>
              </div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 -46 417.81333 417" xmlns="http://www.w3.org/2000/svg">
                    <path d="m159.988281 318.582031c-3.988281 4.011719-9.429687 6.25-15.082031 6.25s-11.09375-2.238281-15.082031-6.25l-120.449219-120.46875c-12.5-12.5-12.5-32.769531 0-45.246093l15.082031-15.085938c12.503907-12.5 32.75-12.5 45.25 0l75.199219 75.203125 203.199219-203.203125c12.503906-12.5 32.769531-12.5 45.25 0l15.082031 15.085938c12.5 12.5 12.5 32.765624 0 45.246093zm0 0" fill="#c084fc"></path>
                  </svg>
                  <span>Gmail, Outlook</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 -46 417.81333 417" xmlns="http://www.w3.org/2000/svg">
                    <path d="m159.988281 318.582031c-3.988281 4.011719-9.429687 6.25-15.082031 6.25s-11.09375-2.238281-15.082031-6.25l-120.449219-120.46875c-12.5-12.5-12.5-32.769531 0-45.246093l15.082031-15.085938c12.503907-12.5 32.75-12.5 45.25 0l75.199219 75.203125 203.199219-203.203125c12.503906-12.5 32.769531-12.5 45.25 0l15.082031 15.085938c12.5 12.5 12.5 32.765624 0 45.246093zm0 0" fill="#c084fc"></path>
                  </svg>
                  <span>Any SMTP server</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 -46 417.81333 417" xmlns="http://www.w3.org/2000/svg">
                    <path d="m159.988281 318.582031c-3.988281 4.011719-9.429687 6.25-15.082031 6.25s-11.09375-2.238281-15.082031-6.25l-120.449219-120.46875c-12.5-12.5-12.5-32.769531 0-45.246093l15.082031-15.085938c12.503907-12.5 32.75-12.5 45.25 0l75.199219 75.203125 203.199219-203.203125c12.503906-12.5 32.769531-12.5 45.25 0l15.082031 15.085938c12.5 12.5 12.5 32.765624 0 45.246093zm0 0" fill="#c084fc"></path>
                  </svg>
                  <span>Quick testing</span>
                </li>
              </ul>
            </button>
          </div>
        </div>

        {/* Resend Setup */}
        {selectedProvider === "resend" && (
          <div className="space-y-8">
            <section className="bg-white/5 rounded-lg shadow-sm p-8 border border-white/10">
              <StepHeader number={1} title="Create Resend Account" />
              <div className="ml-12 space-y-4">
                <p className="text-gray-300">
                  Resend is a modern email API with a simple setup process.
                </p>
                <div className="bg-black/40 rounded-lg p-4 border border-white/10">
                  <ol className="space-y-3 list-decimal list-inside text-gray-300">
                    <li>
                      Go to{" "}
                      <a
                        href="https://resend.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:underline font-medium"
                      >
                        resend.com
                      </a>
                    </li>
                    <li>Click &quot;Sign Up&quot; and create your account</li>
                    <li>Verify your email address</li>
                  </ol>
                </div>
              </div>
            </section>

            <section className="bg-white/5 rounded-lg shadow-sm p-8 border border-white/10">
              <StepHeader number={2} title="Add and Verify Your Domain" />
              <div className="ml-12 space-y-4">
                <p className="text-gray-300">
                  For production use, you&apos;ll want to verify your own domain. For testing, you can use Resend&apos;s sandbox domain.
                </p>
                <div className="bg-black/40 rounded-lg p-4 border border-white/10">
                  <ol className="space-y-3 list-decimal list-inside text-gray-300">
                    <li>In Resend dashboard, click <strong>Domains</strong> → <strong>Add Domain</strong></li>
                    <li>Enter your domain (e.g., <code className="bg-white/10 px-2 py-1 rounded text-sm">yourdomain.com</code>)</li>
                    <li>
                      Add the DNS records to your domain provider:
                      <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                        <li>SPF record</li>
                        <li>DKIM records</li>
                        <li>Return-Path record</li>
                      </ul>
                    </li>
                    <li>Wait for verification (usually a few minutes)</li>
                  </ol>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="text-sm text-gray-300">
                    <strong>Note:</strong> For testing, you can skip domain verification and use Resend&apos;s sandbox domain. Emails will only be sent to your verified email address.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white/5 rounded-lg shadow-sm p-8 border border-white/10">
              <StepHeader number={3} title="Generate API Key" />
              <div className="ml-12 space-y-4">
                <div className="bg-black/40 rounded-lg p-4 border border-white/10">
                  <ol className="space-y-3 list-decimal list-inside text-gray-300">
                    <li>Click <strong>API Keys</strong> in the sidebar</li>
                    <li>Click <strong>Create API Key</strong></li>
                    <li>Give it a name (e.g., &quot;Cheesebox&quot;)</li>
                    <li>Select permissions: <strong>Sending access</strong></li>
                    <li className="font-semibold text-purple-300">
                      🔐 Copy the API key (starts with <code className="bg-white/10 px-2 py-1 rounded text-sm">re_</code>)
                    </li>
                  </ol>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="text-sm text-gray-300">
                    <strong>Important:</strong> Save this API key immediately - you won&apos;t be able to see it again!
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-purple-500/10 rounded-lg shadow-sm p-8 border-2 border-purple-500/30">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Configure in Cheesebox
              </h2>
              <p className="text-gray-300 mb-4">
                Now enter your Resend credentials in the Settings page:
              </p>
              <div className="bg-black/40 rounded-lg p-6 space-y-3 text-gray-300">
                <div>
                  <strong className="text-white">From Email:</strong> <code className="bg-white/10 px-2 py-1 rounded text-sm">noreply@yourdomain.com</code> (must match verified domain)
                </div>
                <div>
                  <strong className="text-white">From Name:</strong> <code className="bg-white/10 px-2 py-1 rounded text-sm">Cheesebox</code> (optional)
                </div>
                <div>
                  <strong className="text-white">API Key:</strong> Your Resend API key
                </div>
              </div>
              <div className="mt-6">
                <Link
                  href="/settings"
                  className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors"
                >
                  Go to Settings
                </Link>
              </div>
            </section>
          </div>
        )}

        {/* AWS SES Setup */}
        {selectedProvider === "ses" && (
          <div className="space-y-8">
            <section className="bg-white/5 rounded-lg shadow-sm p-8 border border-white/10">
              <StepHeader number={1} title="Verify Your Email or Domain" />
              <div className="ml-12 space-y-4">
                <p className="text-gray-300">
                  You need to verify either a single email address (quick) or your entire domain (recommended for production).
                </p>

                <div className="bg-black/40 rounded-lg p-4 border border-white/10">
                  <h4 className="font-semibold text-white mb-3">Option A: Verify Single Email (Quick)</h4>
                  <ol className="space-y-3 list-decimal list-inside text-gray-300">
                    <li>
                      Go to{" "}
                      <a
                        href="https://console.aws.amazon.com/ses"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:underline font-medium"
                      >
                        Amazon SES Console
                      </a>
                    </li>
                    <li>Click <strong>Verified identities</strong> → <strong>Create identity</strong></li>
                    <li>Select <strong>Email address</strong></li>
                    <li>Enter your email (e.g., <code className="bg-white/10 px-2 py-1 rounded text-sm">noreply@yourdomain.com</code>)</li>
                    <li>Click <strong>Create identity</strong></li>
                    <li>Check your inbox and click the verification link</li>
                  </ol>
                </div>

                <div className="bg-black/40 rounded-lg p-4 border border-white/10">
                  <h4 className="font-semibold text-white mb-3">Option B: Verify Domain (Recommended for Production)</h4>
                  <ol className="space-y-3 list-decimal list-inside text-gray-300">
                    <li>In SES console, click <strong>Verified identities</strong> → <strong>Create identity</strong></li>
                    <li>Select <strong>Domain</strong></li>
                    <li>Enter your domain (e.g., <code className="bg-white/10 px-2 py-1 rounded text-sm">yourdomain.com</code>)</li>
                    <li>Add the CNAME records to your DNS provider</li>
                    <li>Wait for verification (can take up to 72 hours)</li>
                  </ol>
                </div>
              </div>
            </section>

            <section className="bg-white/5 rounded-lg shadow-sm p-8 border border-white/10">
              <StepHeader number={2} title="Request Production Access" />
              <div className="ml-12 space-y-4">
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 mb-2">
                    <strong>Important:</strong> By default, SES is in &quot;sandbox mode&quot; - you can only send to verified emails.
                  </p>
                </div>
                <div className="bg-black/40 rounded-lg p-4 border border-white/10">
                  <ol className="space-y-3 list-decimal list-inside text-gray-300">
                    <li>In SES console, click <strong>Account dashboard</strong></li>
                    <li>Click <strong>Request production access</strong></li>
                    <li>
                      Fill out the form:
                      <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                        <li><strong>Mail type:</strong> Transactional</li>
                        <li><strong>Use case:</strong> Video sharing notifications</li>
                        <li><strong>Compliance:</strong> Explain how users opt-in</li>
                      </ul>
                    </li>
                    <li>Submit request</li>
                    <li>Wait for approval (usually 24-48 hours)</li>
                  </ol>
                </div>
              </div>
            </section>

            <section className="bg-white/5 rounded-lg shadow-sm p-8 border border-white/10">
              <StepHeader number={3} title="Create IAM User for SES" />
              <div className="ml-12 space-y-4">
                <p className="text-gray-300">
                  Create a dedicated IAM user with permissions to send emails via SES.
                </p>
                <div className="bg-black/40 rounded-lg p-4 border border-white/10">
                  <ol className="space-y-3 list-decimal list-inside text-gray-300">
                    <li>
                      Go to{" "}
                      <a
                        href="https://console.aws.amazon.com/iam/home#/users"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:underline font-medium"
                      >
                        IAM → Users
                      </a>
                    </li>
                    <li>Click <strong>Create user</strong></li>
                    <li>Name: <code className="bg-white/10 px-2 py-1 rounded text-sm">private-video-ses</code></li>
                    <li>Click <strong>Next</strong></li>
                    <li>Click <strong>Attach policies directly</strong></li>
                    <li>Search for and select <strong>AmazonSESFullAccess</strong> (or use custom policy below)</li>
                    <li>Click <strong>Create user</strong></li>
                    <li>Click on the user → <strong>Security credentials</strong> tab</li>
                    <li>Click <strong>Create access key</strong></li>
                    <li>Select <strong>Application running outside AWS</strong></li>
                    <li className="font-semibold text-purple-300">
                      🔐 Copy the <strong>Access Key ID</strong> and <strong>Secret Access Key</strong>
                    </li>
                  </ol>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">
                    Recommended: Use Least Privilege Policy
                  </h4>
                  <p className="text-sm text-gray-300 mb-3">
                    Instead of AmazonSESFullAccess, create a custom policy with only the required permissions:
                  </p>
                  <CodeBlock code={sesPolicy} language="JSON" index={1} />
                </div>
              </div>
            </section>

            <section className="bg-purple-500/10 rounded-lg shadow-sm p-8 border-2 border-purple-500/30">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Configure in Cheesebox
              </h2>
              <p className="text-gray-300 mb-4">
                Now enter your AWS SES credentials in the Settings page:
              </p>
              <div className="bg-black/40 rounded-lg p-6 space-y-3 text-gray-300">
                <div>
                  <strong className="text-white">From Email:</strong> Your verified email (e.g., <code className="bg-white/10 px-2 py-1 rounded text-sm">noreply@yourdomain.com</code>)
                </div>
                <div>
                  <strong className="text-white">From Name:</strong> <code className="bg-white/10 px-2 py-1 rounded text-sm">Cheesebox</code> (optional)
                </div>
                <div>
                  <strong className="text-white">AWS Access Key ID:</strong> From Step 3
                </div>
                <div>
                  <strong className="text-white">AWS Secret Access Key:</strong> From Step 3
                </div>
                <div>
                  <strong className="text-white">AWS Region:</strong> Same region where you verified the email/domain
                </div>
              </div>
              <div className="mt-6">
                <Link
                  href="/settings"
                  className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors"
                >
                  Go to Settings
                </Link>
              </div>
            </section>
          </div>
        )}

        {/* SMTP Setup */}
        {selectedProvider === "smtp" && (
          <div className="space-y-8">
            <section className="bg-white/5 rounded-lg shadow-sm p-8 border border-white/10">
              <StepHeader number={1} title="Gmail SMTP Setup" />
              <div className="ml-12 space-y-4">
                <p className="text-gray-300">
                  Gmail offers free SMTP access with 100 emails per day for personal accounts.
                </p>

                <div className="bg-black/40 rounded-lg p-4 border border-white/10">
                  <h4 className="font-semibold text-white mb-3">Enable 2-Factor Authentication</h4>
                  <ol className="space-y-3 list-decimal list-inside text-gray-300">
                    <li>
                      Go to{" "}
                      <a
                        href="https://myaccount.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:underline font-medium"
                      >
                        myaccount.google.com
                      </a>
                    </li>
                    <li>Click <strong>Security</strong></li>
                    <li>Enable <strong>2-Step Verification</strong></li>
                  </ol>
                </div>

                <div className="bg-black/40 rounded-lg p-4 border border-white/10">
                  <h4 className="font-semibold text-white mb-3">Create App Password</h4>
                  <ol className="space-y-3 list-decimal list-inside text-gray-300">
                    <li>
                      Go to{" "}
                      <a
                        href="https://myaccount.google.com/apppasswords"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:underline font-medium"
                      >
                        myaccount.google.com/apppasswords
                      </a>
                    </li>
                    <li>Select <strong>Mail</strong> and <strong>Other (Custom name)</strong></li>
                    <li>Enter name: &quot;Cheesebox&quot;</li>
                    <li>Click <strong>Generate</strong></li>
                    <li className="font-semibold text-purple-300">
                      🔐 Copy the 16-character password (remove spaces)
                    </li>
                  </ol>
                </div>

                <div className="bg-purple-500/10 rounded-lg p-6 border-2 border-purple-500/30">
                  <h4 className="font-semibold text-white mb-3">Gmail SMTP Settings</h4>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex gap-2">
                      <strong className="w-32 text-white">From Email:</strong>
                      <code className="bg-white/10 px-2 py-1 rounded">you@gmail.com</code>
                    </div>
                    <div className="flex gap-2">
                      <strong className="w-32 text-white">SMTP Host:</strong>
                      <code className="bg-white/10 px-2 py-1 rounded">smtp.gmail.com</code>
                    </div>
                    <div className="flex gap-2">
                      <strong className="w-32 text-white">SMTP Port:</strong>
                      <code className="bg-white/10 px-2 py-1 rounded">587</code>
                    </div>
                    <div className="flex gap-2">
                      <strong className="w-32 text-white">Username:</strong>
                      <code className="bg-white/10 px-2 py-1 rounded">Your full Gmail address</code>
                    </div>
                    <div className="flex gap-2">
                      <strong className="w-32 text-white">Password:</strong>
                      <code className="bg-white/10 px-2 py-1 rounded">App password from above</code>
                    </div>
                    <div className="flex gap-2">
                      <strong className="w-32 text-white">Use TLS/SSL:</strong>
                      <code className="bg-white/10 px-2 py-1 rounded">Unchecked (port 587 uses STARTTLS)</code>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white/5 rounded-lg shadow-sm p-8 border border-white/10">
              <StepHeader number={2} title="Outlook/Office 365 SMTP" />
              <div className="ml-12 space-y-4">
                <div className="bg-purple-500/10 rounded-lg p-6 border-2 border-purple-500/30">
                  <h4 className="font-semibold text-white mb-3">Outlook SMTP Settings</h4>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex gap-2">
                      <strong className="w-32 text-white">From Email:</strong>
                      <code className="bg-white/10 px-2 py-1 rounded">you@outlook.com</code>
                    </div>
                    <div className="flex gap-2">
                      <strong className="w-32 text-white">SMTP Host:</strong>
                      <code className="bg-white/10 px-2 py-1 rounded">smtp-mail.outlook.com</code> or <code className="bg-white/10 px-2 py-1 rounded">smtp.office365.com</code>
                    </div>
                    <div className="flex gap-2">
                      <strong className="w-32 text-white">SMTP Port:</strong>
                      <code className="bg-white/10 px-2 py-1 rounded">587</code>
                    </div>
                    <div className="flex gap-2">
                      <strong className="w-32 text-white">Username:</strong>
                      <code className="bg-white/10 px-2 py-1 rounded">Your full email address</code>
                    </div>
                    <div className="flex gap-2">
                      <strong className="w-32 text-white">Password:</strong>
                      <code className="bg-white/10 px-2 py-1 rounded">Your password or app password</code>
                    </div>
                    <div className="flex gap-2">
                      <strong className="w-32 text-white">Use TLS/SSL:</strong>
                      <code className="bg-white/10 px-2 py-1 rounded">Unchecked</code>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-purple-500/10 rounded-lg shadow-sm p-8 border-2 border-purple-500/30">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Configure in Cheesebox
              </h2>
              <p className="text-gray-300 mb-4">
                Enter your SMTP credentials in the Settings page using the values from your email provider above.
              </p>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-white mb-2">Common SMTP Ports</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li><code className="bg-yellow-500/20 px-2 py-1 rounded">587</code> - STARTTLS (recommended, uncheck &quot;Use TLS/SSL&quot;)</li>
                  <li><code className="bg-yellow-500/20 px-2 py-1 rounded">465</code> - SSL/TLS (check &quot;Use TLS/SSL&quot;)</li>
                  <li><code className="bg-yellow-500/20 px-2 py-1 rounded">25</code> - Plain text (not recommended)</li>
                </ul>
              </div>
              <div className="mt-6">
                <Link
                  href="/settings"
                  className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors"
                >
                  Go to Settings
                </Link>
              </div>
            </section>
          </div>
        )}

        {/* Troubleshooting Section */}
        <section className="bg-white/5 rounded-lg p-6 border border-white/10 mt-8">
          <h3 className="text-lg font-semibold text-white mb-3">
            Common Issues & Troubleshooting
          </h3>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold text-gray-300 mb-1">Emails not arriving</h4>
              <ul className="list-disc list-inside text-gray-300 ml-4 space-y-1">
                <li>Check spam folder</li>
                <li>Verify the &quot;From Email&quot; matches your verified domain/email</li>
                <li>Check your email provider&apos;s dashboard for delivery logs</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-300 mb-1">Authentication failed</h4>
              <ul className="list-disc list-inside text-gray-300 ml-4 space-y-1">
                <li>Double-check username and password</li>
                <li>For Gmail, ensure you created an app password (not your regular password)</li>
                <li>For 2FA accounts, use app-specific passwords</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-300 mb-1">Domain not verified</h4>
              <ul className="list-disc list-inside text-gray-300 ml-4 space-y-1">
                <li>Make sure you&apos;ve added all DNS records</li>
                <li>Wait a few minutes for DNS propagation</li>
                <li>Use <code className="bg-white/10 px-1 py-0.5 rounded">dig TXT yourdomain.com</code> to check DNS records</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-300 text-sm">
          <p>
            Your email credentials are encrypted before being stored and are only used to send notifications.
          </p>
        </div>
      </div>
    </div>
  );
}
