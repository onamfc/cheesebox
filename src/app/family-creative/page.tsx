"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import VideoCameraIcon from "@/components/icons/VideoCameraIcon";
import ShareIcon from "@/components/icons/ShareIcon";
import LockIcon from "@/components/icons/LockIcon";
import PlayIcon from "@/components/icons/PlayIcon";

export default function FamilyCreativePage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-black/40 backdrop-blur-xl border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Cheesebox
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-purple-200 hover:text-white transition">
                ← Back
              </Link>
              <Link href="/auth/signin" className="text-purple-200 hover:text-white transition">
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all font-medium"
              >
                Start Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Parallax Effect */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated Background */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-purple-500/20 border border-purple-400/30 rounded-full text-purple-200 text-sm font-semibold backdrop-blur-sm">
              For Families
            </span>
          </div>

          <h1
            className="text-6xl sm:text-7xl md:text-8xl font-bold mb-8 leading-tight"
            style={{
              transform: `translateY(${scrollY * 0.2}px)`,
            }}
          >
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Share precious
            </span>
            <br />
            <span className="text-white">family moments</span>
          </h1>

          <p
            className="text-xl sm:text-2xl text-purple-100 mb-12 max-w-3xl mx-auto leading-relaxed"
            style={{
              transform: `translateY(${scrollY * 0.15}px)`,
            }}
          >
            Full-quality videos of birthdays, graduations, and everyday memories.
            <br />
            <span className="text-purple-300">Share with family worldwide. Own your memories forever.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-semibold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-105"
            >
              <span className="relative z-10">Start Sharing Free</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
            <Link
              href="/how-it-works"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full font-semibold text-lg hover:bg-white/20 transition-all"
            >
              See How It Works
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Problem Section */}
      <section className="relative py-32 bg-black/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-bold mb-6">
              <span className="text-purple-400">Sound familiar?</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Problem 1 */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-xl p-8 rounded-2xl border border-white/10 h-full">
                <div className="text-5xl mb-6">😢</div>
                <h3 className="text-2xl font-bold mb-4 text-white">Compressed to oblivion</h3>
                <p className="text-purple-200 leading-relaxed">
                  "I sent Grandma the birthday video through WhatsApp, but it looks so pixelated she can barely see the candles."
                </p>
              </div>
            </div>

            {/* Problem 2 */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-xl p-8 rounded-2xl border border-white/10 h-full">
                <div className="text-5xl mb-6">📧</div>
                <h3 className="text-2xl font-bold mb-4 text-white">Email bounced again</h3>
                <p className="text-purple-200 leading-relaxed">
                  "The video from the recital is 500MB. Gmail won't let me send it, and Grandpa doesn't know how to use Dropbox."
                </p>
              </div>
            </div>

            {/* Problem 3 */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-xl p-8 rounded-2xl border border-white/10 h-full">
                <div className="text-5xl mb-6">🔒</div>
                <h3 className="text-2xl font-bold mb-4 text-white">Lost in the cloud</h3>
                <p className="text-purple-200 leading-relaxed">
                  "I uploaded all our videos to Google Photos, but what if they change their policy? Do I really own these memories?"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section - Split Screen */}
      <section className="relative py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Visual */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                <div className="aspect-video bg-slate-900 rounded-2xl mb-6 relative overflow-hidden group">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-purple-500/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <PlayIcon className="w-10 h-10 text-purple-300" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-purple-200">Birthday_2024.mp4</span>
                        <span className="text-purple-400 font-semibold">Full HD • 1080p</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-purple-100 text-sm">Processing complete</span>
                    <span className="ml-auto text-purple-300 text-xs font-mono">2 min ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl">
                    <ShareIcon className="w-5 h-5 text-purple-400" />
                    <span className="text-purple-100 text-sm">Shared with Family Group</span>
                    <span className="ml-auto text-purple-300 text-xs">8 members</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-5xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Share like it should be
                  </span>
                </h2>
                <p className="text-xl text-purple-100 leading-relaxed">
                  Upload once. Share with everyone. Full quality, every time. No compression, no file size limits, no complicated sharing.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <VideoCameraIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Crystal Clear Quality</h3>
                    <p className="text-purple-200">
                      Everyone sees the video exactly as you recorded it. No pixelation, no blur—just perfect memories.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ShareIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Simple Sharing</h3>
                    <p className="text-purple-200">
                      Send one link via text or email. Grandparents can watch with a single tap—no signup, no apps.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <LockIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Your Memories, Forever</h3>
                    <p className="text-purple-200">
                      Videos stored in your AWS account. You own them. No platform can delete them or change the rules.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="relative py-32 bg-black/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Perfect for every moment
              </span>
            </h2>
            <p className="text-xl text-purple-200">
              From everyday joy to milestone celebrations
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all">
                <div className="text-4xl mb-4">🎂</div>
                <h3 className="text-2xl font-bold text-white mb-3">Birthdays & Celebrations</h3>
                <p className="text-purple-200 leading-relaxed">
                  Capture every candle, every smile, every "Happy Birthday" from family near and far. Share the joy in full HD.
                </p>
              </div>
            </div>

            <div className="relative group cursor-pointer">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl border border-white/10 hover:border-pink-500/50 transition-all">
                <div className="text-4xl mb-4">🎓</div>
                <h3 className="text-2xl font-bold text-white mb-3">Graduations & Milestones</h3>
                <p className="text-purple-200 leading-relaxed">
                  From first steps to college graduation, preserve these once-in-a-lifetime moments in the quality they deserve.
                </p>
              </div>
            </div>

            <div className="relative group cursor-pointer">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl border border-white/10 hover:border-indigo-500/50 transition-all">
                <div className="text-4xl mb-4">🏖️</div>
                <h3 className="text-2xl font-bold text-white mb-3">Vacations & Adventures</h3>
                <p className="text-purple-200 leading-relaxed">
                  Beach days, road trips, theme parks—share the adventure with everyone, even if they're thousands of miles away.
                </p>
              </div>
            </div>

            <div className="relative group cursor-pointer">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all">
                <div className="text-4xl mb-4">❤️</div>
                <h3 className="text-2xl font-bold text-white mb-3">Everyday Magic</h3>
                <p className="text-purple-200 leading-relaxed">
                  Baby's first laugh, pet antics, Sunday dinner—the small moments that make life beautiful deserve to be shared.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            Start sharing memories today
          </h2>
          <p className="text-2xl text-purple-200 mb-12 max-w-2xl mx-auto">
            Free setup. Full quality. Your data. Forever.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-3 bg-white text-purple-600 px-12 py-6 rounded-full hover:bg-gray-50 transition-all text-xl font-bold shadow-2xl hover:shadow-white/20 hover:scale-105 transform"
          >
            Get Started Free
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <p className="text-purple-300 mt-8 text-sm">
            No credit card • 5 minute setup • $1-5/month storage
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
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Solutions</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/family" className="hover:text-white transition">For Families</Link></li>
                <li><Link href="/creators" className="hover:text-white transition">For Creators</Link></li>
                <li><Link href="/fitness" className="hover:text-white transition">For Fitness</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Developers</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="https://github.com/onamfc/cheesebox" className="hover:text-white transition">GitHub</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">Terms</Link></li>
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
