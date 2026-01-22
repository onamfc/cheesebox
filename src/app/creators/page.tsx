"use client";

import Link from "next/link";
import { useState } from "react";
import React from "react";
import VideoCameraIcon from "@/components/icons/VideoCameraIcon";

export default function CreatorsLandingPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Ensure video plays on component mount
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
      <nav className="border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600">Cheesebox</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/auth/signin"
                className="text-gray-700 hover:text-indigo-600 font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition font-medium"
              >
                Start Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Video */}
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
            <source src="/videos/content-creator.mov" type="video/quicktime" />
            <source src="/videos/content-creator.mov" type="video/mp4" />
          </video>
          {/* Gradient Overlay - Professional creator-focused colors */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/70 via-purple-900/60 to-pink-900/70"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Your Premium Content Deserves Better
            </h1>
            <p className="text-xl sm:text-2xl text-gray-100 mb-8">
              Share exclusive content with your members, students, or patrons without compression, without ads, without giving YouTube a cut. You keep control. They get the quality they paid for.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/auth/signup"
                className="bg-indigo-600 text-white px-8 py-4 rounded-xl hover:bg-indigo-700 transition text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Start Creating Free
              </Link>
              <Link
                href="/how-it-works"
                className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white/10 transition text-lg font-semibold inline-block"
              >
                See How It Works
              </Link>
            </div>
            <p className="text-gray-200">
              Used by creators sharing courses, workshops, exclusive content, and patron rewards
            </p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            The Creator's Dilemma
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-indigo-50 p-8 rounded-2xl text-center">
              <div className="text-5xl mb-4">🎬</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">"YouTube Compresses My 4K Course"</h3>
              <p className="text-gray-700">
                You spent hours filming your online course in pristine 4K. YouTube compresses it. Your students can't read the code examples, the design details are blurry, and your premium content looks... cheap.
              </p>
            </div>
            <div className="bg-purple-50 p-8 rounded-2xl text-center">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">"I Don't Want This Public"</h3>
              <p className="text-gray-700">
                Your patrons paid for exclusive content. But to share videos, you have to make them "unlisted" on YouTube or Vimeo—where anyone with the link can watch. That's not exclusive. That's just hidden.
              </p>
            </div>
            <div className="bg-pink-50 p-8 rounded-2xl text-center">
              <div className="text-5xl mb-4">🔐</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">"They're Monetizing MY Content"</h3>
              <p className="text-gray-700">
                You charge $99 for your workshop. YouTube shows ads on your video and takes their cut. Vimeo charges you $20/month just to host it. Why are you paying someone else to deliver content YOUR audience already paid YOU for?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Full Control. Full Quality. Zero Platform Fees.
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Cheesebox is built for creators who charge for their content. Upload once, share a private link, and your members watch in perfect quality—on any device, with no ads, no compression, no middleman.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-white p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl">⬆️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Upload Your Content</h3>
              <p className="text-gray-700">4K course videos, workshop recordings, patron-exclusive content—upload it all. No file size limits for serious creators. Your content stays yours.</p>
            </div>
            <div className="text-center">
              <div className="bg-white p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl">🔗</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Share Private Links</h3>
              <p className="text-gray-700">Each video gets a unique, unguessable link. Share it only with paying members. No one else can access it. True exclusivity.</p>
            </div>
            <div className="text-center">
              <div className="bg-white p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl">✨</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">They Watch in Full Glory</h3>
              <p className="text-gray-700">Every pixel you recorded, delivered. No compression, no ads, no distractions. Just your premium content, the way you intended it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            Why Creators Choose Cheesebox
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🎯</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">True Privacy for Paid Content</h3>
                <p className="text-gray-700">Your $299 masterclass stays between you and your students. Not "unlisted"—actually private. Only people with your link can watch. Period.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <VideoCameraIcon className="w-10 h-10 fill-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Uncompressed Quality</h3>
                <p className="text-gray-700">That 4K screen recording where you walk through your design process? It stays 4K. Every line of code is readable. Every detail is crisp. Your production quality shines through.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-3xl">💸</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No Platform Fees</h3>
                <p className="text-gray-700">Cheesebox is free software. You pay Amazon directly for storage—about $5/month for 200GB. That's 100+ hours of HD video. No revenue share, no markup, no subscription tiers.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-3xl">🔒</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">You Own Everything</h3>
                <p className="text-gray-700">Your videos live in YOUR Amazon S3 bucket. Not our servers. If Cheesebox shuts down tomorrow, your content is still safe and accessible. You're not locked in.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-3xl">📱</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Works Everywhere</h3>
                <p className="text-gray-700">Your students watch on iPhone, Android, Mac, PC, iPad—it just works. No app to download, no account to create. Click link, watch video. Simple.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-3xl">⚡</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Built for Creators</h3>
                <p className="text-gray-700">Course creators, workshop hosts, Patreon creators, membership sites—if you create premium content and charge for it, Cheesebox is built for you.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-16">
            Perfect For
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="text-4xl mb-4">👨‍🏫</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Course Creators</h3>
              <p className="text-gray-700 mb-4">
                Sell your course once, host the videos yourself. No monthly platform fees eating into your revenue. Your students get uncompressed 4K tutorials where they can actually read the code.
              </p>
              <p className="text-sm text-gray-600 italic">
                "I moved my $199 JavaScript course from Teachable. Saved $39/month in platform fees, and my students say the video quality is noticeably better." — Sarah K.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Patreon & Membership Creators</h3>
              <p className="text-gray-700 mb-4">
                Your patrons pay for exclusive content. Give them truly exclusive videos—not YouTube unlisted links that anyone can share. Private links that actually stay private.
              </p>
              <p className="text-sm text-gray-600 italic">
                "My top-tier patrons get full-length, uncompressed studio sessions. It feels premium because it IS premium." — Marcus D.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="text-4xl mb-4">🎤</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Workshop & Webinar Hosts</h3>
              <p className="text-gray-700 mb-4">
                Recorded a killer 3-hour workshop? Don't compress it down for YouTube. Share the full recording with attendees in pristine quality. They paid for it—give them the good version.
              </p>
              <p className="text-sm text-gray-600 italic">
                "I charge $149 for my design workshops. The replay link leads to Cheesebox—full quality, no ads, looks professional." — Lisa R.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="text-4xl mb-4">📸</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Photography & Videography Pros</h3>
              <p className="text-gray-700 mb-4">
                Deliver client videos and behind-the-scenes content without emailing massive files or paying for WeTransfer Pro. Send a Cheesebox link. They watch it full quality. Done.
              </p>
              <p className="text-sm text-gray-600 italic">
                "I send wedding highlight reels to clients via Cheesebox. They can share it with family, and I don't pay monthly hosting fees." — James T.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Transparency Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              The Real Cost of Hosting Your Own Content
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Cheesebox is free. You just pay Amazon S3 for storage. Let's break down what that actually costs.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 lg:p-12 mb-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">💰</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Compare the Costs</h3>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6">
                  <div className="text-sm font-semibold text-gray-500 mb-2">Traditional Platform</div>
                  <h4 className="font-bold text-gray-900 mb-3 text-2xl">Vimeo Pro</h4>
                  <div className="text-3xl font-bold text-gray-900 mb-2">$20/mo</div>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• 250GB storage</li>
                    <li>• Vimeo branding</li>
                    <li>• They own the platform</li>
                    <li>• $240/year</li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-6">
                  <div className="text-sm font-semibold text-gray-500 mb-2">Course Platform</div>
                  <h4 className="font-bold text-gray-900 mb-3 text-2xl">Teachable</h4>
                  <div className="text-3xl font-bold text-gray-900 mb-2">$39-$119/mo</div>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• + 5% transaction fee</li>
                    <li>• Platform locked-in</li>
                    <li>• Video compression</li>
                    <li>• $468-$1,428/year</li>
                  </ul>
                </div>

                <div className="bg-indigo-600 text-white rounded-xl p-6 border-4 border-indigo-700">
                  <div className="text-sm font-semibold mb-2">Your Own Storage</div>
                  <h4 className="font-bold mb-3 text-2xl">Cheesebox + AWS</h4>
                  <div className="text-3xl font-bold mb-2">~$5/mo</div>
                  <ul className="space-y-2 text-sm">
                    <li>• 200GB storage (~100+ hrs HD)</li>
                    <li>• YOU own everything</li>
                    <li>• Zero compression</li>
                    <li>• ~$60/year</li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <p className="text-lg text-gray-700 mb-4">
                  <strong>You save $180-$1,368 per year</strong> compared to traditional platforms. Plus, you actually own your content.
                </p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 mb-6">
                Ready to take control of your content? We'll walk you through the 5-minute AWS setup.
              </p>
              <Link
                href="/help/aws-setup"
                className="inline-block text-indigo-600 hover:text-indigo-700 font-semibold underline"
              >
                View AWS Setup Guide →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            Creator FAQs
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I password-protect my videos?",
                a: "Each video gets a unique, unguessable URL. Only people with that link can watch. You control who gets the link. For additional security, you can integrate Cheesebox with your membership platform or use groups to manage access."
              },
              {
                q: "What's the video quality like?",
                a: "Whatever you upload is what they watch. Upload 4K, they get 4K. Upload 1080p, they get 1080p. Zero compression. This is especially important for screen recordings, tutorials, and detailed visual content."
              },
              {
                q: "Can students download the videos?",
                a: "Videos stream securely through Cheesebox. While determined users can always screen-record anything they watch, there's no built-in download button. Your content is protected as much as streaming allows."
              },
              {
                q: "How much storage do I actually need?",
                a: "A 1-hour HD video is typically 1-3GB. A 10-hour course in HD might be 20GB. 200GB on AWS S3 (~$5/mo) can hold 100+ hours of HD content—plenty for most creators."
              },
              {
                q: "Is this actually better than YouTube unlisted?",
                a: "Yes. YouTube compresses your video (your students see artifacts). YouTube shows ads (even on unlisted videos sometimes). YouTube owns the platform (they can delete your account). With Cheesebox, you own the storage, control access, and deliver uncompressed quality."
              },
              {
                q: "What if I already use Teachable/Kajabi/Thinkific?",
                a: "You can still use Cheesebox! Host your videos on Cheesebox (better quality, lower cost), then embed them in your course platform. Or send direct links to students. You're not locked into any one solution."
              },
              {
                q: "Do I need to be technical to set this up?",
                a: "If you can create a course, you can set up Cheesebox. Our AWS setup guide has screenshots for every single step. Most creators finish setup in 5-10 minutes. If you get stuck, we're here to help."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-indigo-50 transition"
                >
                  <span className="font-semibold text-gray-900">{faq.q}</span>
                  <span className="text-2xl text-indigo-600">
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
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Stop Paying Platforms to Compress Your Content
          </h2>
          <p className="text-xl mb-8 opacity-95">
            Join creators who've taken control of their premium content. Full quality, true privacy, no middleman.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/auth/signup"
              className="bg-white text-indigo-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Start Hosting Your Content →
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm opacity-90">
            <span>✓ Free software</span>
            <span>✓ Your content in your S3</span>
            <span>✓ Zero compression</span>
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
