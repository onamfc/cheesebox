"use client";

import Link from "next/link";
import UploadCloudIcon from "@/components/icons/UploadCloudIcon";
import ShareLinkIcon from "@/components/icons/ShareLinkIcon";
import PlayCircleIcon from "@/components/icons/PlayCircleIcon";
import CloudStorageIcon from "@/components/icons/CloudStorageIcon";
import DevicesIcon from "@/components/icons/DevicesIcon";
import SetupIcon from "@/components/icons/SetupIcon";
import LockIcon from "@/components/icons/LockIcon";

export default function WorksOldPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Cheesebox
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-slate-700 hover:text-indigo-600 font-medium transition"
              >
                ← Back
              </Link>
              <Link
                href="/auth/signin"
                className="text-slate-700 hover:text-indigo-600 font-medium transition"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:shadow-lg hover:shadow-indigo-500/50 transition-all font-medium"
              >
                Start Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 py-24">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f10_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f10_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            How Cheesebox Works
          </h1>
          <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
            Share full-quality videos in three simple steps. No technical expertise required.
          </p>
        </div>
      </section>

      {/* Three Steps Overview - Visual Flow */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 via-white to-white"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Three Simple Steps</h2>
            <p className="text-xl text-slate-600">From upload to watch in minutes</p>
          </div>

          {/* Horizontal flow with arrows */}
          <div className="grid md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-8 items-center">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-32 h-32 mb-6 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full shadow-2xl shadow-indigo-500/30 group-hover:scale-110 group-hover:shadow-indigo-500/50 transition-all duration-300">
                <UploadCloudIcon className="w-16 h-16 text-white" />
              </div>
              <div className="space-y-2">
                <div className="text-indigo-600 font-bold text-sm tracking-wider">STEP 1</div>
                <h3 className="text-3xl font-bold text-slate-900">Upload</h3>
                <p className="text-slate-600 text-lg leading-relaxed max-w-xs mx-auto">
                  Upload your video to your own cloud storage. Full quality, full control.
                </p>
              </div>
            </div>

            {/* Arrow 1 */}
            <div className="hidden md:block">
              <svg className="w-12 h-12 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-32 h-32 mb-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full shadow-2xl shadow-purple-500/30 group-hover:scale-110 group-hover:shadow-purple-500/50 transition-all duration-300">
                <ShareLinkIcon className="w-16 h-16 text-white" />
              </div>
              <div className="space-y-2">
                <div className="text-purple-600 font-bold text-sm tracking-wider">STEP 2</div>
                <h3 className="text-3xl font-bold text-slate-900">Share</h3>
                <p className="text-slate-600 text-lg leading-relaxed max-w-xs mx-auto">
                  Get a simple link and share it anywhere—text, email, social media.
                </p>
              </div>
            </div>

            {/* Arrow 2 */}
            <div className="hidden md:block">
              <svg className="w-12 h-12 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-32 h-32 mb-6 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full shadow-2xl shadow-teal-500/30 group-hover:scale-110 group-hover:shadow-teal-500/50 transition-all duration-300">
                <PlayCircleIcon className="w-16 h-16 text-white" />
              </div>
              <div className="space-y-2">
                <div className="text-teal-600 font-bold text-sm tracking-wider">STEP 3</div>
                <h3 className="text-3xl font-bold text-slate-900">Watch</h3>
                <p className="text-slate-600 text-lg leading-relaxed max-w-xs mx-auto">
                  They click and watch instantly. Perfect quality on any device.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Step 1: Setup */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-3 bg-indigo-50 px-4 py-2 rounded-full mb-6">
                <SetupIcon className="w-6 h-6 text-indigo-600" />
                <span className="text-indigo-600 font-semibold">One-Time Setup</span>
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Set up your storage in 5 minutes
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Connect your Amazon storage account once. That's it. After this initial setup,
                uploading videos is just a few clicks.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CloudStorageIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">You own your data</h3>
                    <p className="text-slate-600 text-sm">Videos stored in your AWS account forever, not ours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">$</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Remarkably affordable</h3>
                    <p className="text-slate-600 text-sm">Typically $1-5/month depending on usage</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <LockIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Enterprise-grade reliability</h3>
                    <p className="text-slate-600 text-sm">99.999999999% durability guaranteed by AWS</p>
                  </div>
                </div>
              </div>

              <Link
                href="/help/aws-setup"
                className="inline-flex items-center gap-2 mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-xl hover:shadow-indigo-500/30 transition-all font-semibold text-lg"
              >
                View Setup Guide
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="space-y-4 font-mono text-sm">
                  <div className="text-slate-400">
                    <span className="text-indigo-400">$</span> aws s3 mb s3://my-videos
                  </div>
                  <div className="text-green-400">
                    ✓ Bucket created successfully
                  </div>
                  <div className="text-slate-400">
                    <span className="text-indigo-400">$</span> cheesebox init
                  </div>
                  <div className="text-green-400">
                    ✓ Configuration complete
                  </div>
                  <div className="text-slate-400">
                    <span className="text-indigo-400">$</span> Ready to upload!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Step 2: Upload */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl blur-2xl opacity-20"></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-slate-200">
                  <div className="flex items-center justify-between mb-8">
                    <h4 className="font-bold text-slate-900">Upload Video</h4>
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <UploadCloudIcon className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>

                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 mb-6 bg-slate-50">
                    <div className="text-center">
                      <UploadCloudIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 font-medium mb-2">Drop your video here</p>
                      <p className="text-slate-400 text-sm">or click to browse</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <DevicesIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-slate-900">Upload from any device</div>
                        <div className="text-xs text-slate-600">Phone, tablet, or computer</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">4K</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-slate-900">Full quality preserved</div>
                        <div className="text-xs text-slate-600">Up to 5GB per video</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-3 bg-purple-50 px-4 py-2 rounded-full mb-6">
                <UploadCloudIcon className="w-6 h-6 text-purple-600" />
                <span className="text-purple-600 font-semibold">Upload Process</span>
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Upload from anywhere
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Upload videos directly from your phone, tablet, or computer. No app required—
                works in any modern browser.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Select your video</h3>
                    <p className="text-slate-600 text-sm">Choose from your device or record new</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Upload to your cloud</h3>
                    <p className="text-slate-600 text-sm">Direct upload to your AWS storage, full quality</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Automatic optimization</h3>
                    <p className="text-slate-600 text-sm">Video processed for smooth streaming on any device</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Get your share link</h3>
                    <p className="text-slate-600 text-sm">Ready in 5-10 minutes, depending on video length</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Step 3: Share & Watch */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-3 bg-teal-50 px-4 py-2 rounded-full mb-6">
                <ShareLinkIcon className="w-6 h-6 text-teal-600" />
                <span className="text-teal-600 font-semibold">Share & Watch</span>
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Simple sharing, perfect viewing
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Share your link anywhere. Recipients click and watch instantly—no signup,
                no app download, no hassle.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-200">
                  <DevicesIcon className="w-8 h-8 text-teal-600 mb-3" />
                  <h3 className="font-semibold text-slate-900 text-sm mb-1">Any Device</h3>
                  <p className="text-slate-600 text-xs">iPhone, Android, tablet, computer</p>
                </div>

                <div className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-200">
                  <PlayCircleIcon className="w-8 h-8 text-teal-600 mb-3" />
                  <h3 className="font-semibold text-slate-900 text-sm mb-1">Instant Play</h3>
                  <p className="text-slate-600 text-xs">Tap link, watch immediately</p>
                </div>

                <div className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-200">
                  <LockIcon className="w-8 h-8 text-teal-600 mb-3" />
                  <h3 className="font-semibold text-slate-900 text-sm mb-1">Private Links</h3>
                  <p className="text-slate-600 text-xs">Only people with link can view</p>
                </div>

                <div className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-200">
                  <span className="text-2xl mb-3 block">4K</span>
                  <h3 className="font-semibold text-slate-900 text-sm mb-1">Full Quality</h3>
                  <p className="text-slate-600 text-xs">Crystal clear on all devices</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <ShareLinkIcon className="w-6 h-6 text-teal-400" />
                  <span className="font-semibold">Share via:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/10 rounded-lg text-sm">Text Message</span>
                  <span className="px-3 py-1 bg-white/10 rounded-lg text-sm">Email</span>
                  <span className="px-3 py-1 bg-white/10 rounded-lg text-sm">WhatsApp</span>
                  <span className="px-3 py-1 bg-white/10 rounded-lg text-sm">Slack</span>
                  <span className="px-3 py-1 bg-white/10 rounded-lg text-sm">Facebook</span>
                  <span className="px-3 py-1 bg-white/10 rounded-lg text-sm">Twitter</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative">
                {/* Phone mockup */}
                <div className="bg-slate-900 rounded-[3rem] p-4 shadow-2xl max-w-sm mx-auto">
                  <div className="bg-white rounded-[2.5rem] overflow-hidden">
                    <div className="bg-slate-50 p-4 border-b border-slate-200">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-teal-500 rounded-full"></div>
                        <div>
                          <div className="text-xs font-semibold text-slate-900">Mom</div>
                          <div className="text-xs text-slate-500">Just now</div>
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded-2xl border border-slate-200">
                        <p className="text-sm text-slate-600 mb-2">Check out this video!</p>
                        <div className="text-xs text-teal-600 font-mono break-all">
                          cheesebox.app/v/abc123
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden mb-3">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <PlayCircleIcon className="w-10 h-10 text-white" />
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                          <div className="h-full w-1/3 bg-teal-500"></div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-slate-900">Summer Vacation 2024</div>
                      <div className="text-xs text-slate-500">Full HD • 5:32</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Common Questions
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to know about sharing videos with Cheesebox
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-slate-900 mb-2 text-lg">
                Do I have to set up AWS every time I upload?
              </h3>
              <p className="text-slate-600">
                No. You only set up AWS once during your initial configuration. After that, uploading videos is just a few clicks.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-slate-900 mb-2 text-lg">
                Can I upload from my phone?
              </h3>
              <p className="text-slate-600">
                Absolutely. Cheesebox works perfectly on mobile devices. Upload directly from your camera roll or record new videos in your browser.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-slate-900 mb-2 text-lg">
                How long does processing take?
              </h3>
              <p className="text-slate-600">
                Processing typically takes 5-10 minutes depending on video length. You'll receive a notification when your video is ready to share.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-slate-900 mb-2 text-lg">
                What if someone doesn't have a smartphone?
              </h3>
              <p className="text-slate-600">
                No problem. Videos play in any web browser on any device—smartphones, tablets, computers, even older devices work perfectly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Start Sharing?
          </h2>
          <p className="text-xl text-indigo-200 mb-10 max-w-2xl mx-auto">
            Set up your account in 5 minutes and start sharing perfect-quality videos with complete data ownership.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-3 bg-white text-indigo-600 px-10 py-5 rounded-xl hover:bg-gray-50 transition-all text-lg font-semibold shadow-2xl hover:shadow-white/20 hover:scale-105 transform"
          >
            Get Started Free
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <p className="text-indigo-300 text-sm mt-6">
            No credit card required • 5 minute setup • Free forever
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Company/Brand */}
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-white font-bold text-xl mb-4">Cheesebox</h3>
              <p className="text-sm mb-4">Secure video sharing with complete data ownership.</p>
              <div className="flex gap-4">
                <a href="https://github.com/onamfc/cheesebox" className="text-gray-400 hover:text-white transition" target="_blank" rel="noopener noreferrer">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="https://twitter.com/cheesebox" className="text-gray-400 hover:text-white transition" target="_blank" rel="noopener noreferrer">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/auth/signup" className="hover:text-white transition">Get Started</Link></li>
                <li><Link href="/help/aws-setup" className="hover:text-white transition">AWS Setup</Link></li>
                <li><Link href="/help/email-setup" className="hover:text-white transition">Email Setup</Link></li>
              </ul>
            </div>

            {/* Solutions */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Solutions</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/family" className="hover:text-white transition">For Families</Link></li>
                <li><Link href="/creators" className="hover:text-white transition">For Creators</Link></li>
                <li><Link href="/fitness" className="hover:text-white transition">For Fitness Trainers</Link></li>
                <li><Link href="/coaches" className="hover:text-white transition">For Coaches</Link></li>
                <li><Link href="/educators" className="hover:text-white transition">For Educators</Link></li>
                <li><Link href="/videographers" className="hover:text-white transition">For Videographers</Link></li>
              </ul>
            </div>

            {/* Developers */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Developers</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="https://github.com/onamfc/cheesebox" className="hover:text-white transition" target="_blank" rel="noopener noreferrer">GitHub Repo</a></li>
                <li><a href="https://github.com/onamfc/cheesebox/blob/main/LICENSE" className="hover:text-white transition" target="_blank" rel="noopener noreferrer">MIT License</a></li>
                <li><a href="https://github.com/onamfc/cheesebox/issues" className="hover:text-white transition" target="_blank" rel="noopener noreferrer">Report Issue</a></li>
                <li><a href="https://github.com/onamfc/cheesebox/blob/main/CONTRIBUTING.md" className="hover:text-white transition" target="_blank" rel="noopener noreferrer">Contributing</a></li>
              </ul>
            </div>

            {/* Company */}
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
