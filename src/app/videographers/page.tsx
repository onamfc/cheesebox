"use client";

import Link from "next/link";
import { useState } from "react";
import React from "react";
import VideoCameraIcon from "@/components/icons/VideoCameraIcon";
import EmailTooLargeIcon from "@/components/icons/EmailTooLargeIcon";

export default function VideographersLandingPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error('Video autoplay failed:', error);
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-slate-900">Cheesebox</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/auth/signin"
                className="text-gray-700 hover:text-slate-900 font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-slate-900 text-white px-6 py-2 rounded-xl hover:bg-slate-800 transition font-medium"
              >
                Start Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
            style={{ pointerEvents: 'none' }}
          >
            <source src="/videos/videographer.mov" type="video/quicktime" />
            <source src="/videos/videographer.mov" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-gray-900/70 to-zinc-900/75"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              You Shot It in 4K. Deliver It in 4K.
            </h1>
            <p className="text-xl sm:text-2xl text-gray-100 mb-8">
              Stop emailing massive files or paying for WeTransfer Pro. Deliver wedding films, client proofs, and commercial work in pristine quality—instantly accessible, beautifully presented, zero compression.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/auth/signup"
                className="bg-white text-slate-900 px-8 py-4 rounded-xl hover:bg-gray-100 transition text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Deliver Like a Pro
              </Link>
              <Link
                href="/how-it-works"
                className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white/10 transition text-lg font-semibold inline-block"
              >
                See How It Works
              </Link>
            </div>
            <p className="text-gray-200">
              Trusted by wedding videographers, commercial producers, and photo studios worldwide
            </p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            Your Craft Deserves Better Delivery
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-2xl text-center">
              <div className="flex justify-center mb-4">
                <EmailTooLargeIcon className="w-16 h-16 fill-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">"File Size Exceeds Limit"</h3>
              <p className="text-gray-700">
                You spent 20 hours color grading a 10-minute wedding film. Exported in ProRes. 15GB. Email bounced. Gmail says "too large." Now you're splitting it into chunks or waiting for a Dropbox upload to finish. Your client just wants to see their wedding.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl text-center">
              <div className="text-5xl mb-4">💸</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">"WeTransfer Links Expire"</h3>
              <p className="text-gray-700">
                You delivered the final edit via WeTransfer. Client downloaded it... or did they? Three months later: "Can you resend the video?" The link expired. Now you're re-uploading or paying $15/month for WeTransfer Pro just to keep links alive.
              </p>
            </div>
            <div className="bg-zinc-50 p-8 rounded-2xl text-center">
              <div className="text-5xl mb-4">😤</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">"Vimeo Compresses Everything"</h3>
              <p className="text-gray-700">
                You shoot in 4K 60fps. Upload to Vimeo. They compress it. Your cinematic b-roll loses that buttery smooth quality. Your client watches it and says "it looks different than when you showed me on your laptop." Yeah. Because it is.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Pixel-Perfect Delivery. Every Single Time.
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Upload once in full quality. Share a private link with your client. They stream it instantly in the exact resolution you exported—no downloads, no compression, no degradation. Your work, delivered as intended.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-white p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <VideoCameraIcon className="w-12 h-12 fill-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Export in Full Quality</h3>
              <p className="text-gray-700">4K ProRes, 1080p H.264, whatever your deliverable format is. Export from Premiere, Final Cut, DaVinci. Upload to Cheesebox. What you export is what they watch. Zero transcoding, zero compression.</p>
            </div>
            <div className="text-center">
              <div className="bg-white p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl">🔗</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Send a Private Link</h3>
              <p className="text-gray-700">Each project gets a unique link. Wedding film, commercial spot, real estate walkthrough—separate links for each. Your client opens it in their browser. Plays instantly. No app, no account, no friction.</p>
            </div>
            <div className="text-center">
              <div className="bg-white p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl">✨</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">They Watch in Awe</h3>
              <p className="text-gray-700">Your cinematic color grade shines through. Every frame looks exactly how you intended. Clients see the quality they paid for. You look like the professional you are.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            Why Videographers Choose Cheesebox
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🎨</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Your Color Grade Stays Perfect</h3>
                <p className="text-gray-700">Spent hours in DaVinci Resolve getting that cinematic teal-and-orange look? It stays exactly how you graded it. No Vimeo compression ruining your shadows. No YouTube crushing your blacks.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-3xl">🚀</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Instant Streaming, No Downloads</h3>
                <p className="text-gray-700">Your client doesn't want to download a 10GB file. They want to watch it now. Cheesebox streams instantly—on their laptop, tablet, or phone. Any device, full quality, immediate playback.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-3xl">⏰</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Links Never Expire</h3>
                <p className="text-gray-700">WeTransfer dies in 7 days. Google Drive links break. Cheesebox links work forever. Your client's grandkids can watch their wedding video 30 years from now. Your legacy, preserved.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-3xl">💎</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Professional Presentation</h3>
                <p className="text-gray-700">Clean video player. No ads. No "Skip Ad in 5 seconds." No WeTransfer download page. Just your video, beautifully presented. Matches the premium service you provide.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-3xl">🔒</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Client-Only Access</h3>
                <p className="text-gray-700">Each client gets their unique link. Your wedding client can't accidentally see someone else's commercial work. True privacy. Professional boundaries. Peace of mind.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-3xl">💰</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Save $150-500/Year</h3>
                <p className="text-gray-700">WeTransfer Pro is $15/month. Vimeo Pro is $20/month. Frame.io is $19/month. Cheesebox? About $5/month for storage. Same functionality, 70-80% less cost. Every year.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-16">
            Built for Your Work
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="text-4xl mb-4">💒</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Wedding Videographers</h3>
              <p className="text-gray-700 mb-4">
                "I shoot 30 weddings a year. Each couple gets a private Cheesebox link for their film. No more 'can you resend the video?' emails. The link works forever. Grandparents stream it on their iPad. Everyone's happy. I never think about file delivery again."
              </p>
              <p className="text-sm text-gray-600 italic">
                — Alex T., Wedding Cinematographer
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Commercial Producers</h3>
              <p className="text-gray-700 mb-4">
                "When I deliver a commercial spot to a client, I send a Cheesebox link. They review it with their team in full quality. No compression artifacts. No download needed. They approve faster because they see it exactly as it'll look on TV."
              </p>
              <p className="text-sm text-gray-600 italic">
                — Jordan M., Commercial Director
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="text-4xl mb-4">🏡</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Real Estate Videographers</h3>
              <p className="text-gray-700 mb-4">
                "I shoot luxury property tours. Agents want them fast. I upload to Cheesebox from the parking lot, text them the link. They're posting it to their listing while I'm driving to the next shoot. Speed + quality + simplicity."
              </p>
              <p className="text-sm text-gray-600 italic">
                — Marcus R., Real Estate Video Pro
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="text-4xl mb-4">📸</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Photographers (Video Add-On)</h3>
              <p className="text-gray-700 mb-4">
                "I'm primarily a photographer but I shoot highlight videos for clients who want both. Cheesebox lets me deliver photos via Google Photos and video via a separate link. Clean separation. Professional delivery for both mediums."
              </p>
              <p className="text-sm text-gray-600 italic">
                — Sarah L., Portrait & Event Photographer
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Stop Overpaying for File Delivery
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              You're probably using one of these. Here's what you're actually paying.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="text-sm font-semibold text-gray-500 mb-2">File Transfer</div>
                <h4 className="font-bold text-gray-900 mb-3 text-xl">WeTransfer Pro</h4>
                <div className="text-2xl font-bold text-gray-900 mb-2">$15/mo</div>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Links expire</li>
                  <li>• Manual downloads</li>
                  <li>• $180/year</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="text-sm font-semibold text-gray-500 mb-2">Video Hosting</div>
                <h4 className="font-bold text-gray-900 mb-3 text-xl">Vimeo Pro</h4>
                <div className="text-2xl font-bold text-gray-900 mb-2">$20/mo</div>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Video compression</li>
                  <li>• 250GB limit</li>
                  <li>• $240/year</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="text-sm font-semibold text-gray-500 mb-2">Collaboration</div>
                <h4 className="font-bold text-gray-900 mb-3 text-xl">Frame.io</h4>
                <div className="text-2xl font-bold text-gray-900 mb-2">$19/mo</div>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Per user</li>
                  <li>• 100GB storage</li>
                  <li>• $228/year</li>
                </ul>
              </div>

              <div className="bg-slate-900 text-white rounded-xl p-6 border-4 border-slate-800">
                <div className="text-sm font-semibold mb-2">Full Quality</div>
                <h4 className="font-bold mb-3 text-xl">Cheesebox</h4>
                <div className="text-2xl font-bold mb-2">~$5/mo</div>
                <ul className="space-y-2 text-sm">
                  <li>• Zero compression</li>
                  <li>• Unlimited videos</li>
                  <li>• ~$60/year</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-8 text-center">
              <p className="text-2xl font-bold text-gray-900 mb-2">
                Save $120-420/year
              </p>
              <p className="text-gray-700">
                That's 1-3 wedding bookings worth of pure profit just from switching video delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            Videographer FAQs
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I upload ProRes files directly?",
                a: "Yes! Upload whatever format you export from your NLE. ProRes, H.264, H.265, whatever. Cheesebox doesn't re-encode or transcode. Your exact file gets stored and streamed. Quality stays pristine."
              },
              {
                q: "What about clients who want to download the file?",
                a: "Clients can stream instantly or download if they prefer. You control whether downloads are enabled per video. Most clients are happy streaming—it's faster and they don't need to manage large files."
              },
              {
                q: "How long does it take to upload a 10GB wedding film?",
                a: "Depends on your internet upload speed. On a typical 10 Mbps upload connection, a 10GB file takes about 2.5 hours. But you can upload overnight or while you're editing your next project. Upload once, share forever."
              },
              {
                q: "Can I password-protect client videos?",
                a: "Each video has a unique, unguessable URL. Only people with that specific link can access it. For additional security, you can organize videos into private groups or integrate with your client portal."
              },
              {
                q: "Does this work for 4K 60fps files?",
                a: "Absolutely. 4K, 6K, 8K, 24fps, 60fps, 120fps—whatever you shoot, we deliver. Your cinematic slow-motion stays buttery smooth. Your high-frame-rate action footage plays perfectly."
              },
              {
                q: "Can I brand the video player?",
                a: "The current Cheesebox player is clean and minimal—no branding, no ads, just your video. For custom branding (your logo, color scheme), you'd need to integrate with your own website or client portal."
              },
              {
                q: "What if my client loses the link?",
                a: "You can always access it in your Cheesebox dashboard and resend it. Links never expire, so even if they lose the email, you can retrieve and share it again anytime."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-slate-50 transition"
                >
                  <span className="font-semibold text-gray-900">{faq.q}</span>
                  <span className="text-2xl text-slate-900">
                    {openFaqIndex === index ? "−" : "+"}
                  </span>
                </button>
                {openFaqIndex === index && (
                  <div className="px-6 pb-4 text-gray-700">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Your 4K Masterpiece Deserves Pixel-Perfect Delivery
          </h2>
          <p className="text-xl mb-8 opacity-95">
            Stop compromising on quality. Deliver every frame exactly as you intended.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/auth/signup"
              className="bg-white text-slate-900 px-8 py-4 rounded-xl hover:bg-gray-100 transition text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Start Delivering Better →
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm opacity-90">
            <span>✓ Zero compression</span>
            <span>✓ Instant streaming</span>
            <span>✓ Links never expire</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
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
                <li><Link href="/auth/signup" className="hover:text-white transition-colors">Get Started</Link></li>
                <li><Link href="/help/aws-setup" className="hover:text-white transition-colors">AWS Setup</Link></li>
                <li><Link href="/help/email-setup" className="hover:text-white transition-colors">Email Setup</Link></li>
              </ul>
            </div>

            {/* Solutions */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Solutions</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/family" className="hover:text-white transition-colors">For Families</Link></li>
                <li><Link href="/creators" className="hover:text-white transition-colors">For Creators</Link></li>
                <li><Link href="/fitness" className="hover:text-white transition-colors">For Fitness Trainers</Link></li>
                <li><Link href="/coaches" className="hover:text-white transition-colors">For Coaches</Link></li>
                <li><Link href="/educators" className="hover:text-white transition-colors">For Educators</Link></li>
                <li><Link href="/videographers" className="hover:text-white transition-colors">For Videographers</Link></li>
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
