"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import UploadCloudIcon from "@/components/icons/UploadCloudIcon";
import ShareLinkIcon from "@/components/icons/ShareLinkIcon";
import PlayCircleIcon from "@/components/icons/PlayCircleIcon";
import CloudStorageIcon from "@/components/icons/CloudStorageIcon";
import DevicesIcon from "@/components/icons/DevicesIcon";
import SetupIcon from "@/components/icons/SetupIcon";
import LockIcon from "@/components/icons/LockIcon";

export default function HowItWorksPage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const totalScroll = docHeight - windowHeight;
      const progress = (scrollPosition / totalScroll) * 100;
      setScrollProgress(progress);

      // Determine active step based on scroll position
      if (scrollPosition < windowHeight * 0.5) setActiveStep(0);
      else if (scrollPosition < windowHeight * 1.5) setActiveStep(1);
      else if (scrollPosition < windowHeight * 2.5) setActiveStep(2);
      else setActiveStep(3);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Fixed Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-800 z-50">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md border-b border-white/10 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Cheesebox
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-slate-300 hover:text-white transition">
                ← Back
              </Link>
              <Link href="/auth/signin" className="text-slate-300 hover:text-white transition">
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                Start Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Full Viewport */}
      <section className="h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative text-center px-4 max-w-4xl">
          <h1 className="text-7xl sm:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
            How It Works
          </h1>
          <p className="text-2xl text-slate-300 mb-12">
            Share videos. Own your data. Three steps.
          </p>
          <div className="animate-bounce">
            <svg className="w-8 h-8 mx-auto text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Step 1 - Setup (Scroll-triggered reveal) */}
      <section className="min-h-screen flex items-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-black"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div className="space-y-8">
              <div className="inline-block">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <SetupIcon className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-indigo-400 text-sm font-bold tracking-widest">01 / SETUP</span>
                </div>
              </div>

              <h2 className="text-6xl font-bold">
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  One-time
                </span>
                <br />
                <span className="text-white">configuration</span>
              </h2>

              <p className="text-xl text-slate-300 leading-relaxed">
                Connect your AWS storage in 5 minutes. After this single setup, you're ready to upload unlimited videos.
              </p>

              <div className="grid grid-cols-1 gap-4 pt-4">
                <div className="flex items-start gap-4 p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                  <CloudStorageIcon className="w-8 h-8 text-indigo-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">Your data, your control</h3>
                    <p className="text-slate-400 text-sm">Videos stored in your AWS account forever</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                  <div className="w-8 h-8 flex items-center justify-center bg-indigo-500/20 rounded-lg flex-shrink-0 mt-1">
                    <span className="text-indigo-400 font-bold">$</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Incredibly affordable</h3>
                    <p className="text-slate-400 text-sm">Typically $1-5/month depending on usage</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                  <LockIcon className="w-8 h-8 text-indigo-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">Enterprise reliability</h3>
                    <p className="text-slate-400 text-sm">99.999999999% durability by AWS</p>
                  </div>
                </div>
              </div>

              <Link
                href="/help/aws-setup"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-full hover:shadow-2xl hover:shadow-purple-500/50 transition-all font-semibold text-lg group"
              >
                View Setup Guide
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Right: Visual */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-white/10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="space-y-4 font-mono text-sm">
                  <div className="text-slate-500">
                    <span className="text-purple-400">$</span> aws s3 mb s3://my-videos
                  </div>
                  <div className="text-green-400">
                    ✓ Bucket created successfully
                  </div>
                  <div className="text-slate-500">
                    <span className="text-purple-400">$</span> cheesebox init
                  </div>
                  <div className="text-green-400 animate-pulse">
                    ✓ Configuration complete
                  </div>
                  <div className="pt-4 text-slate-400 border-t border-white/10">
                    Ready to upload videos! 🎉
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step 2 - Upload (Large centered visual) */}
      <section className="min-h-screen flex items-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/20 to-black"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Visual (reversed order) */}
            <div className="order-2 lg:order-1">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl"></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center justify-between mb-8">
                    <h4 className="font-bold text-slate-900">Upload Video</h4>
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <UploadCloudIcon className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>

                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-16 mb-6 bg-slate-50 text-center">
                    <UploadCloudIcon className="w-20 h-20 text-slate-400 mx-auto mb-4 animate-bounce" />
                    <p className="text-slate-600 font-medium mb-2">Drop your video here</p>
                    <p className="text-slate-400 text-sm">or click to browse</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                      <DevicesIcon className="w-6 h-6 text-purple-600" />
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-slate-900">Any device</div>
                        <div className="text-xs text-slate-600">Phone, tablet, computer</div>
                      </div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                      <div className="w-6 h-6 flex items-center justify-center bg-purple-600 rounded text-white font-bold text-xs">
                        4K
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-slate-900">Full quality</div>
                        <div className="text-xs text-slate-600">Up to 5GB per video</div>
                      </div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Content */}
            <div className="order-1 lg:order-2 space-y-8">
              <div className="inline-block">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                    <UploadCloudIcon className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-purple-400 text-sm font-bold tracking-widest">02 / UPLOAD</span>
                </div>
              </div>

              <h2 className="text-6xl font-bold">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Upload from
                </span>
                <br />
                <span className="text-white">anywhere</span>
              </h2>

              <p className="text-xl text-slate-300 leading-relaxed">
                Drag and drop videos from any device. No app required—works perfectly in your browser.
              </p>

              <div className="space-y-6 pt-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center font-bold text-purple-400 flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Select your video</h3>
                    <p className="text-slate-400">Choose from device or record new</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center font-bold text-purple-400 flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Upload to your cloud</h3>
                    <p className="text-slate-400">Direct upload to AWS, full quality preserved</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center font-bold text-purple-400 flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Automatic processing</h3>
                    <p className="text-slate-400">Optimized for streaming in 5-10 minutes</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center font-bold text-purple-400 flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Get your link</h3>
                    <p className="text-slate-400">Share immediately when ready</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step 3 - Share (Immersive phone mockup) */}
      <section className="min-h-screen flex items-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-teal-900/20 to-black"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div className="space-y-8">
              <div className="inline-block">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center">
                    <ShareLinkIcon className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-teal-400 text-sm font-bold tracking-widest">03 / SHARE</span>
                </div>
              </div>

              <h2 className="text-6xl font-bold">
                <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  Share & watch
                </span>
                <br />
                <span className="text-white">instantly</span>
              </h2>

              <p className="text-xl text-slate-300 leading-relaxed">
                Simple link sharing. Recipients watch in perfect quality on any device—no signup required.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                  <DevicesIcon className="w-10 h-10 text-teal-400 mb-3" />
                  <h3 className="text-white font-semibold mb-1 text-sm">Any Device</h3>
                  <p className="text-slate-400 text-xs">iPhone, Android, tablet, desktop</p>
                </div>

                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                  <PlayCircleIcon className="w-10 h-10 text-teal-400 mb-3" />
                  <h3 className="text-white font-semibold mb-1 text-sm">Instant Play</h3>
                  <p className="text-slate-400 text-xs">Click and watch immediately</p>
                </div>

                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                  <LockIcon className="w-10 h-10 text-teal-400 mb-3" />
                  <h3 className="text-white font-semibold mb-1 text-sm">Private</h3>
                  <p className="text-slate-400 text-xs">Only link holders can view</p>
                </div>

                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                  <div className="text-3xl mb-3">4K</div>
                  <h3 className="text-white font-semibold mb-1 text-sm">Full Quality</h3>
                  <p className="text-slate-400 text-xs">Crystal clear playback</p>
                </div>
              </div>

              <div className="pt-4">
                <div className="flex flex-wrap gap-2">
                  <span className="px-4 py-2 bg-white/5 rounded-full text-sm text-slate-300 border border-white/10">Text Message</span>
                  <span className="px-4 py-2 bg-white/5 rounded-full text-sm text-slate-300 border border-white/10">Email</span>
                  <span className="px-4 py-2 bg-white/5 rounded-full text-sm text-slate-300 border border-white/10">WhatsApp</span>
                  <span className="px-4 py-2 bg-white/5 rounded-full text-sm text-slate-300 border border-white/10">Slack</span>
                  <span className="px-4 py-2 bg-white/5 rounded-full text-sm text-slate-300 border border-white/10">Social Media</span>
                </div>
              </div>
            </div>

            {/* Right: Phone mockup */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-[3.5rem] blur-3xl"></div>
                <div className="relative bg-slate-900 rounded-[3.5rem] p-4 shadow-2xl max-w-sm">
                  <div className="bg-white rounded-[3rem] overflow-hidden">
                    <div className="bg-slate-50 p-5 border-b border-slate-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full"></div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">Mom</div>
                          <div className="text-xs text-slate-500">Just now</div>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-2xl shadow-sm">
                        <p className="text-sm text-slate-700 mb-3">Check out this video!</p>
                        <div className="px-3 py-2 bg-teal-50 rounded-lg">
                          <div className="text-xs text-teal-600 font-mono break-all">
                            cheesebox.app/v/abc123
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden mb-4">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                            <PlayCircleIcon className="w-12 h-12 text-white" />
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                          <div className="h-full w-1/3 bg-teal-500"></div>
                        </div>
                      </div>
                      <div className="text-base font-semibold text-slate-900 mb-1">Summer Vacation 2024</div>
                      <div className="text-sm text-slate-500">Full HD • 5:32</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="min-h-screen flex items-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <h2 className="text-6xl sm:text-7xl font-bold text-white mb-6">
            Ready to start?
          </h2>
          <p className="text-2xl text-purple-200 mb-12 max-w-2xl mx-auto">
            Set up in 5 minutes. Share unlimited videos. Own your data forever.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-3 bg-white text-purple-600 px-12 py-6 rounded-full hover:bg-gray-50 transition-all text-xl font-bold shadow-2xl hover:shadow-white/20 hover:scale-105 transform group"
          >
            Get Started Free
            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <p className="text-purple-300 mt-8">
            No credit card • 5 minute setup • Free forever
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-white font-bold text-xl mb-4">Cheesebox</h3>
              <p className="text-sm mb-4">Secure video sharing with complete data ownership.</p>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/auth/signup" className="hover:text-white transition">Get Started</Link></li>
                <li><Link href="/help/aws-setup" className="hover:text-white transition">AWS Setup</Link></li>
                <li><Link href="/help/email-setup" className="hover:text-white transition">Email Setup</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Solutions</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/family" className="hover:text-white transition">For Families</Link></li>
                <li><Link href="/creators" className="hover:text-white transition">For Creators</Link></li>
                <li><Link href="/fitness" className="hover:text-white transition">For Fitness Trainers</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Developers</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="https://github.com/onamfc/cheesebox" className="hover:text-white transition">GitHub Repo</a></li>
                <li><a href="https://github.com/onamfc/cheesebox/blob/main/LICENSE" className="hover:text-white transition">MIT License</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">Terms</Link></li>
                <li><Link href="/security" className="hover:text-white transition">Security</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8">
            <p className="text-center text-sm">&copy; {new Date().getFullYear()} Cheesebox. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
