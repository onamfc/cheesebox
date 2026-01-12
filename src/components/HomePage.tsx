"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";
import LockIcon from "@/components/icons/LockIcon";
import ShareIcon from "@/components/icons/ShareIcon";
import PlayIcon from "@/components/icons/PlayIcon";
import ShieldIcon from "@/components/icons/ShieldIcon";
import NetworkIcon from "@/components/icons/NetworkIcon";
import { SiAmazon, SiNextdotjs, SiReact, SiTypescript, SiPrisma, SiPostgresql } from "react-icons/si";
import {Aws} from "@lobehub/icons";

export default function HomePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "An error occurred during registration");
        setIsLoading(false);
        return;
      }

      // Registration successful, now auto-login
      const { signIn } = await import("next-auth/react");
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(
          "Account created but auto-login failed. Please sign in manually.",
        );
        setIsLoading(false);
        return;
      }

      // Redirect to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("An error occurred during registration");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Navigation */}
      <nav className="bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">Cheesebox</h1>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/onamfc/cheesebox"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white hover:text-gray-300 font-medium px-4 py-2 rounded-md border border-white/20 hover:border-white/40 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                <span>GitHub</span>
              </a>
              <Link href="/auth/signin">
                <button className="text-white hover:text-gray-300 font-medium px-4 py-2 rounded-md border border-white/20 hover:border-white/40 transition-colors cursor-pointer">
                  Sign in
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
              Secure Video Sharing,
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Zero Platform Fees
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-400 max-w-3xl mx-auto">
              Share videos securely with email-based permissions, industry-standard HLS streaming, and enterprise-grade security. Cheesebox is free - you only pay your AWS infrastructure costs.
            </p>
            <div className="mt-10 flex justify-center">
              <a href="#signup" className="inline-block">
                <button className="bg-white text-black hover:bg-gray-100 font-medium px-8 py-3 rounded-md text-lg transition-colors cursor-pointer">
                  Get Started Free
                </button>
              </a>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              No credit card required • AWS account only needed to upload videos • Recipients need no AWS account
            </p>
          </div>
        </div>
      </section>

      {/* Data Ownership Section */}
      <section className="py-40 bg-black/30 border-y border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Your Videos. Your Infrastructure. Your Control.
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Unlike traditional platforms where corporations own and control your data, Cheesebox puts you in the driver's seat. Your videos live in <strong className="text-white">your AWS account</strong>, not ours. We never have access to your content, credentials, or infrastructure. Share with anyone via email - recipients need only a free Cheesebox account, no AWS required. You maintain complete ownership and can walk away at any time with all your data intact. No lock-in, no surprises, just pure control.
            </p>
          </div>
          <div className="mt-10 grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">100%</div>
              <div className="text-sm text-gray-500">Data Ownership</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">0</div>
              <div className="text-sm text-gray-500">Vendor Lock-In</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">Full</div>
              <div className="text-sm text-gray-500">Infrastructure Control</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Everything you need for secure video sharing
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Professional-grade features at zero cost
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: HLS Streaming */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 hover:bg-white/10 hover:border-purple-500/50 transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white mb-4 p-2.5">
                <PlayIcon className="w-full h-full fill-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Industry-Standard HLS Streaming
              </h3>
              <p className="text-gray-400">
                Videos are automatically transcoded to HLS format using AWS MediaConvert, ensuring compatibility across all devices and adaptive bitrate streaming for optimal playback quality.
              </p>
            </div>

            {/* Feature 2: Presigned URLs */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 hover:bg-white/10 hover:border-purple-500/50 transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white mb-4 p-1.5">
                <ShieldIcon className="w-full h-full fill-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Secure Presigned URLs
              </h3>
              <p className="text-gray-400">
                Every video request uses temporary presigned URLs that expire after 3 hours. No permanent public links means your sensitive content stays protected from unauthorized access.
              </p>
            </div>

            {/* Feature 3: Public & Private Sharing */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 hover:bg-white/10 hover:border-purple-500/50 transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white mb-4 p-2">
                <ShareIcon className="w-full h-full fill-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Public & Private Sharing
              </h3>
              <p className="text-gray-400">
                Share videos publicly with embeddable players or keep them private with email-based permissions. You control exactly who can watch each video.
              </p>
            </div>

            {/* Feature 4: Team Collaboration */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 hover:bg-white/10 hover:border-purple-500/50 transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-2xl mb-4">
                ◉
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Team Collaboration
              </h3>
              <p className="text-gray-400">
                Create teams to share AWS credentials with trusted collaborators. Team members can upload videos using shared infrastructure while maintaining individual ownership and permissions.
              </p>
            </div>

            {/* Feature 5: Share Groups */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 hover:bg-white/10 hover:border-purple-500/50 transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white mb-4 p-2.5">
                <NetworkIcon className="w-full h-full fill-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Reusable Share Groups
              </h3>
              <p className="text-gray-400">
                Create groups of email addresses for batch sharing. Share training videos, product demos, or announcements with entire departments in one click. Recipients receive email notifications automatically.
              </p>
            </div>

            {/* Feature 6: Enterprise Security */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 hover:bg-white/10 hover:border-purple-500/50 transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white mb-4 p-1.5">
                <LockIcon className="w-full h-full fill-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Enterprise-Grade Security
              </h3>
              <p className="text-gray-400">
                Protected by 70+ automated security tests, CSRF protection, rate limiting, AES-256-GCM encryption for credentials, and path traversal prevention. Your data is secure by design.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Simple workflow, powerful results
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Connect Your AWS Account
              </h3>
              <p className="text-gray-400">
                Use our one-click CloudFormation template to set up S3 storage and MediaConvert. Your credentials stay with you - we never store or access your AWS account.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Upload & Share Videos
              </h3>
              <p className="text-gray-400">
                Upload videos or record directly from your webcam. Videos are automatically transcoded to HLS format. Share with individuals, groups, or make them public.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Recipients Watch Securely
              </h3>
              <p className="text-gray-400">
                Recipients receive email notifications and watch videos with a free Cheesebox account - no AWS account needed. Secure, time-limited presigned URLs ensure safe access. You pay only AWS bandwidth costs when videos are streamed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Built for teams who value security
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 hover:bg-white/10 transition-all">
              <h3 className="text-lg font-semibold text-white mb-2">
                Internal Training & Onboarding
              </h3>
              <p className="text-gray-400">
                Share training videos with new hires or specific departments using share groups. Control access with email permissions and track who has access.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 hover:bg-white/10 transition-all">
              <h3 className="text-lg font-semibold text-white mb-2">
                Product Demos & Sales
              </h3>
              <p className="text-gray-400">
                Share personalized product demos with prospects. Make them public for embedding on your website or keep them private for exclusive client access.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 hover:bg-white/10 transition-all">
              <h3 className="text-lg font-semibold text-white mb-2">
                Confidential Communications
              </h3>
              <p className="text-gray-400">
                Share sensitive information that requires video context. Time-limited URLs ensure content doesn't remain accessible indefinitely.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 hover:bg-white/10 transition-all">
              <h3 className="text-lg font-semibold text-white mb-2">
                Client Deliverables
              </h3>
              <p className="text-gray-400">
                Deliver video projects to clients with professional HLS streaming. No file size limits or compression - just high-quality video delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing/Cost Section */}
      <section className="py-20 bg-black/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Transparent, Pay-What-You-Use Pricing
          </h2>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg border-2 border-purple-500/50 p-8">
            <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">$0</div>
            <div className="text-2xl font-semibold text-white mb-4">
              Platform Fee
            </div>
            <p className="text-lg text-gray-300 mb-6">
              Cheesebox is completely free. You only pay for AWS services you use:
            </p>
            <ul className="text-left text-gray-300 space-y-2 max-w-md mx-auto">
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span><strong className="text-white">S3 Storage:</strong> ~$0.023/GB per month</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span><strong className="text-white">MediaConvert:</strong> ~$0.015/minute of video transcoded</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span><strong className="text-white">Data Transfer:</strong> First 100GB/month free, then $0.09/GB</span>
              </li>
            </ul>
            <p className="text-sm text-gray-400 mt-6">
              All AWS charges are billed directly to your AWS account. We never see or charge for your usage.
            </p>
          </div>
        </div>
      </section>

      {/* Sign Up Section */}
      <section id="signup" className="py-20 bg-[#0a0a0a]">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white">
                Get Started Free
              </h2>
              <p className="mt-2 text-gray-400">
                Create your account in seconds
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <Alert variant="error">{error}</Alert>}

              <Input
                label="Email address"
                type="email"
                name="email"
                autoComplete="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                labelClassName="block text-sm font-medium text-white mb-1"
                className="!text-white !bg-white/10 !border-white/20 focus:!border-purple-500 placeholder:!text-gray-400"
              />

              <Input
                label="Password"
                type="password"
                name="password"
                autoComplete="new-password"
                required
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                labelClassName="block text-sm font-medium text-white mb-1"
                className="!text-white !bg-white/10 !border-white/20 focus:!border-purple-500 placeholder:!text-gray-400"
              />

              <Input
                label="Confirm password"
                type="password"
                name="confirm-password"
                autoComplete="new-password"
                required
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                labelClassName="block text-sm font-medium text-white mb-1"
                className="!text-white !bg-white/10 !border-white/20 focus:!border-purple-500 placeholder:!text-gray-400"
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium px-4 py-2 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#0a0a0a] text-gray-400">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white font-medium px-4 py-2 rounded-md border border-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign up with Google
              </button>

              <div className="text-center text-sm text-gray-400">
                <p>No credit card required</p>
                <p className="mt-1">Recipients need no AWS account</p>
              </div>

              <div className="text-center text-sm">
                <span className="text-gray-400">Already have an account? </span>
                <Link
                  href="/auth/signin"
                  className="font-medium text-purple-400 hover:text-purple-300"
                >
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Company/Brand */}
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-white font-bold text-xl mb-4">Cheesebox</h3>
              <p className="text-sm mb-4">
                Secure video sharing with complete data ownership.
              </p>
              {/* Social Links */}
              <div className="flex gap-4">
                <a
                  href="https://github.com/onamfc/cheesebox"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a
                  href="https://twitter.com/cheeseboxapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#signup" className="hover:text-white transition-colors cursor-pointer">Get Started</a></li>
                <li><Link href="/help/aws-setup" className="hover:text-white transition-colors">AWS Setup</Link></li>
                <li><Link href="/help/email-setup" className="hover:text-white transition-colors">Email Setup</Link></li>
              </ul>
            </div>

            {/* Developers */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Developers</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="https://github.com/onamfc/cheesebox"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    GitHub Repo
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/onamfc/cheesebox/blob/main/LICENSE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    MIT License
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/onamfc/cheesebox/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Report Issue
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/onamfc/cheesebox/blob/main/CONTRIBUTING.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Contributing
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="/security" className="hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10 text-center">
            <p className="text-sm">&copy; {new Date().getFullYear()} Cheesebox. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
