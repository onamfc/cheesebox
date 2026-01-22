"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import VideoCameraIcon from "@/components/icons/VideoCameraIcon";
import ShareIcon from "@/components/icons/ShareIcon";
import LockIcon from "@/components/icons/LockIcon";

export default function CreatorsCreativePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Cursor Glow Effect */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.15), transparent 80%)`,
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-black/60 backdrop-blur-xl border-b border-indigo-500/20 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Cheesebox
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-indigo-200 hover:text-white transition">← Back</Link>
              <Link href="/auth/signin" className="text-indigo-200 hover:text-white transition">Sign In</Link>
              <Link
                href="/auth/signup"
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-full hover:shadow-lg hover:shadow-indigo-500/50 transition-all font-medium"
              >
                Start Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero - Bold Typography */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        {/* Video Background */}
        <div className="absolute inset-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/content-creator.mov" type="video/mp4" />
          </video>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 via-black/75 to-purple-950/80"></div>
        </div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <div className="mb-6">
            <span className="px-6 py-3 bg-indigo-500/10 border border-indigo-400/30 rounded-full text-indigo-300 text-sm font-bold tracking-wider backdrop-blur-sm">
              FOR CONTENT CREATORS
            </span>
          </div>

          <h1 className="text-7xl sm:text-8xl md:text-9xl font-black mb-8 leading-none">
            <span className="block bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
              YOUR
            </span>
            <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              CONTENT
            </span>
            <span className="block text-white">YOUR RULES</span>
          </h1>

          <p className="text-2xl text-indigo-200 mb-12 max-w-3xl mx-auto">
            Deliver uncompressed 4K courses to paying students. Host premium content without platform fees.
            <span className="block text-indigo-400 mt-2">Keep 100% of your revenue.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/auth/signup"
              className="group relative px-10 py-5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full font-bold text-xl shadow-2xl hover:shadow-indigo-500/50 transition-all overflow-hidden"
            >
              <span className="relative z-10">Launch Your Platform</span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 translate-y-full group-hover:translate-y-0 transition-transform"></div>
            </Link>
            <Link
              href="/how-it-works"
              className="px-10 py-5 bg-white/5 backdrop-blur-sm border-2 border-indigo-500/30 rounded-full font-bold text-xl hover:bg-white/10 hover:border-indigo-500/50 transition-all"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Pain Points - Grid */}
      <section className="relative py-32 border-t border-indigo-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-bold text-center mb-20">
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Platform problems holding you back
            </span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 bg-gradient-to-br from-indigo-950/50 to-purple-950/50 backdrop-blur-sm border border-indigo-500/20 rounded-2xl hover:border-indigo-500/40 transition-all">
              <div className="text-6xl mb-4">💸</div>
              <h3 className="text-xl font-bold mb-3">Platform Tax</h3>
              <p className="text-indigo-300 text-sm">Vimeo, Teachable, Patreon—they all take 10-30% of your earnings just to host your videos.</p>
            </div>

            <div className="p-8 bg-gradient-to-br from-purple-950/50 to-pink-950/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl hover:border-purple-500/40 transition-all">
              <div className="text-6xl mb-4">📹</div>
              <h3 className="text-xl font-bold mb-3">Quality Killed</h3>
              <p className="text-purple-300 text-sm">YouTube compresses your 4K course into mush. Students complain they can't see your screen.</p>
            </div>

            <div className="p-8 bg-gradient-to-br from-pink-950/50 to-indigo-950/50 backdrop-blur-sm border border-pink-500/20 rounded-2xl hover:border-pink-500/40 transition-all">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-3">Locked In</h3>
              <p className="text-pink-300 text-sm">What happens if your platform shuts down? Or changes pricing? Your content is hostage.</p>
            </div>

            <div className="p-8 bg-gradient-to-br from-indigo-950/50 to-purple-950/50 backdrop-blur-sm border border-indigo-500/20 rounded-2xl hover:border-indigo-500/40 transition-all">
              <div className="text-6xl mb-4">⚙️</div>
              <h3 className="text-xl font-bold mb-3">No Control</h3>
              <p className="text-indigo-300 text-sm">Can't customize the player. Can't control access. Can't integrate with your tools.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution - Large Visual */}
      <section className="relative py-32 bg-gradient-to-br from-indigo-950/30 to-purple-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-2 space-y-8">
              <h2 className="text-5xl font-bold">
                <span className="block text-indigo-400 mb-2">Own your</span>
                <span className="block text-white text-6xl">distribution</span>
              </h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold">0%</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Zero Platform Fees</h3>
                    <p className="text-indigo-300">Pay only for storage ($1-5/mo). Keep 100% of revenue.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold">4K</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Uncompressed Quality</h3>
                    <p className="text-purple-300">Deliver tutorials in the quality you recorded. Every pixel counts.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <LockIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">You Own Everything</h3>
                    <p className="text-pink-300">Videos in your AWS. You control access. Forever.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
                <div className="relative bg-slate-900 rounded-3xl p-8 border border-indigo-500/30">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-bold">Premium Course Dashboard</h4>
                      <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-300 text-xs font-bold">
                        ACTIVE
                      </div>
                    </div>
                    <div className="h-px bg-gradient-to-r from-indigo-500/50 to-purple-500/50"></div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-indigo-950/50 rounded-xl border border-indigo-500/20">
                      <div className="text-3xl font-bold text-indigo-400">847</div>
                      <div className="text-xs text-indigo-300 mt-1">Active Students</div>
                    </div>
                    <div className="p-4 bg-purple-950/50 rounded-xl border border-purple-500/20">
                      <div className="text-3xl font-bold text-purple-400">24</div>
                      <div className="text-xs text-purple-300 mt-1">Course Videos</div>
                    </div>
                    <div className="p-4 bg-pink-950/50 rounded-xl border border-pink-500/20">
                      <div className="text-3xl font-bold text-pink-400">4K</div>
                      <div className="text-xs text-pink-300 mt-1">Quality</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 bg-indigo-950/30 rounded-xl border border-indigo-500/20 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <VideoCameraIcon className="w-5 h-5 text-indigo-400" />
                        <div>
                          <div className="font-semibold text-sm">Module 1: Introduction</div>
                          <div className="text-xs text-indigo-300">1080p • 12:34</div>
                        </div>
                      </div>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>

                    <div className="p-4 bg-purple-950/30 rounded-xl border border-purple-500/20 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <VideoCameraIcon className="w-5 h-5 text-purple-400" />
                        <div>
                          <div className="font-semibold text-sm">Module 2: Advanced Techniques</div>
                          <div className="text-xs text-purple-300">4K • 45:12</div>
                        </div>
                      </div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="relative py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-bold text-center mb-20">
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Built for creators who ship
            </span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative bg-black p-8 rounded-2xl border border-indigo-500/20 h-full">
                <div className="text-5xl mb-4">🎨</div>
                <h3 className="text-2xl font-bold mb-3">Course Creators</h3>
                <p className="text-indigo-300">
                  Sell premium courses without Teachable's 10% cut. Deliver 4K screen recordings students can actually see.
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative bg-black p-8 rounded-2xl border border-purple-500/20 h-full">
                <div className="text-5xl mb-4">🎬</div>
                <h3 className="text-2xl font-bold mb-3">Film Directors</h3>
                <p className="text-purple-300">
                  Share rough cuts with clients in original quality. No YouTube compression ruining your color grade.
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative bg-black p-8 rounded-2xl border border-pink-500/20 h-full">
                <div className="text-5xl mb-4">💼</div>
                <h3 className="text-2xl font-bold mb-3">SaaS Founders</h3>
                <p className="text-pink-300">
                  Host product demos and onboarding videos. Embed anywhere. No Vimeo branding. No Wistia fees.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-black"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#4f46e510_1px,transparent_1px),linear-gradient(to_bottom,#4f46e510_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-6xl font-bold text-white mb-6">
            Stop paying platforms
          </h2>
          <p className="text-2xl text-indigo-200 mb-12">
            Own your content. Keep your revenue. Scale without limits.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-12 py-6 rounded-full font-bold text-xl shadow-2xl hover:shadow-indigo-500/50 hover:scale-105 transform transition-all"
          >
            Start For Free
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <p className="text-indigo-400 mt-8">
            5 minute setup • $1-5/month storage • 0% platform fees
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-indigo-500/20 text-gray-400 py-16">
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
                <li><Link href="/family" className="hover:text-white transition">Families</Link></li>
                <li><Link href="/creators" className="hover:text-white transition">Creators</Link></li>
                <li><Link href="/fitness" className="hover:text-white transition">Fitness</Link></li>
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
          <div className="border-t border-indigo-500/20 pt-8">
            <p className="text-center text-sm">&copy; {new Date().getFullYear()} Cheesebox. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
