"use client";

import Link from "next/link";
import { useState } from "react";
import React from "react";
import VideoCameraIcon from "@/components/icons/VideoCameraIcon";
import EmailTooLargeIcon from "@/components/icons/EmailTooLargeIcon";
import UnlockIcon from "@/components/icons/UnlockIcon";

export default function CoachesLandingPage() {
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
      <nav className="border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-emerald-600">Cheesebox</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/auth/signin"
                className="text-gray-700 hover:text-emerald-600 font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-emerald-600 text-white px-6 py-2 rounded-xl hover:bg-emerald-700 transition font-medium"
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
            <source src="/videos/coaches.mov" type="video/quicktime" />
            <source src="/videos/coaches.mov" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/75 via-teal-900/65 to-cyan-900/70"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Your Clients Pay for Your Insights—Deliver Them Flawlessly
            </h1>
            <p className="text-xl sm:text-2xl text-gray-100 mb-8">
              Stop emailing massive presentation videos that never arrive. Share strategy sessions, personalized feedback, and client deliverables in pristine quality—privately, professionally, instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/auth/signup"
                className="bg-emerald-600 text-white px-8 py-4 rounded-xl hover:bg-emerald-700 transition text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Elevate Your Practice
              </Link>
              <Link
                href="/how-it-works"
                className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white/10 transition text-lg font-semibold inline-block"
              >
                See How It Works
              </Link>
            </div>
            <p className="text-gray-200">
              Trusted by executive coaches, business consultants, and transformation specialists
            </p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            You're Worth More Than Email Attachments
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-emerald-50 p-8 rounded-2xl text-center">
              <div className="flex justify-center mb-4">
                <EmailTooLargeIcon className="w-16 h-16 fill-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">"Email Bounced—File Too Large"</h3>
              <p className="text-gray-700">
                You recorded a 45-minute strategy session breakdown for your $5K client. Exported it from Zoom. Tried to email it. "Message size exceeds limit." Now you're uploading to Dropbox, generating a link, hoping they can figure it out.
              </p>
            </div>
            <div className="bg-teal-50 p-8 rounded-2xl text-center">
              <div className="flex justify-center mb-4">
                <UnlockIcon className="w-16 h-16 fill-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">"Anyone With the Link Can Watch"</h3>
              <p className="text-gray-700">
                Your client feedback videos contain confidential business insights. You share via Google Drive or Loom. But it's just "anyone with the link"—there's no real privacy. Your $10K consulting deliverable is a shareable URL away from leaking.
              </p>
            </div>
            <div className="bg-cyan-50 p-8 rounded-2xl text-center">
              <div className="text-5xl mb-4">🎥</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">"This Doesn't Look Professional"</h3>
              <p className="text-gray-700">
                You charge premium rates. Your clients expect premium delivery. But you're sending Loom links with ads, or WeTransfer downloads that expire in 7 days. It doesn't match the caliber of your coaching.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Private. Professional. Permanent.
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Upload your client videos once. Share unique private links. They watch on any device in full quality—with no downloads, no ads, no expiration. You look like the premium professional you are.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-white p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl">⬆️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Record & Upload</h3>
              <p className="text-gray-700">Strategy session recap? Leadership assessment feedback? Market analysis walkthrough? Record it once, upload to Cheesebox. No file size limits. No quality loss.</p>
            </div>
            <div className="text-center">
              <div className="bg-white p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl">🔗</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Send Private Links</h3>
              <p className="text-gray-700">Each client gets a unique link for their specific content. Your CEO client's video stays between you and them. True confidentiality. No accidental sharing.</p>
            </div>
            <div className="text-center">
              <div className="bg-white p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl">💼</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">They Watch & Implement</h3>
              <p className="text-gray-700">Your client opens your link from their office, home, or airport lounge. Plays instantly in HD. They absorb your insights, take notes, implement your strategies. No friction, all value.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            Why High-Ticket Coaches Choose Cheesebox
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🔒</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">True Client Confidentiality</h3>
                <p className="text-gray-700">Your business strategy videos contain sensitive insights. With Cheesebox, only the specific client with the link can access it. No "anyone with the link" public sharing. Actual privacy.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <VideoCameraIcon className="w-10 h-10 fill-cyan-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Presentation-Quality Video</h3>
                <p className="text-gray-700">Your screen recordings, slide decks, and feedback sessions stay crisp. Every chart is readable, every diagram is clear. Your insights deserve to be seen in full HD.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-3xl">⏰</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Never Expires</h3>
                <p className="text-gray-700">WeTransfer links die in 7 days. Loom videos get deleted. Cheesebox links work forever. Your client can revisit your 90-day plan video in month 6, month 12, or 3 years later.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-3xl">💎</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Matches Your Premium Positioning</h3>
                <p className="text-gray-700">You charge $500/hour, $10K/engagement, $50K/retainer. Your client delivery should reflect that. Clean links, perfect quality, zero ads. Professional all the way through.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-3xl">📱</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Works Anywhere</h3>
                <p className="text-gray-700">Your client is on their MacBook, iPad, or Android phone. Doesn't matter. Click link, video plays. No app, no account, no complexity. Just like you'd want it.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-3xl">💰</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Actually Free (Not "Freemium")</h3>
                <p className="text-gray-700">Cheesebox costs $0. You pay Amazon ~$5/month for storage. Loom Business is $12.50/user/month. You're saving $150/year and getting better quality. Easy decision.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-16">
            Built for Your Coaching Practice
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="text-4xl mb-4">👔</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Executive Coaches</h3>
              <p className="text-gray-700 mb-4">
                "I coach C-suite executives at $750/hour. After each session, I record a 15-minute video recap—key insights, action items, frameworks. They watch it before our next call. Cheesebox keeps it confidential and professional."
              </p>
              <p className="text-sm text-gray-600 italic">
                — Michael R., Executive Coach, NYC
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Business Consultants</h3>
              <p className="text-gray-700 mb-4">
                "My engagements include detailed strategy presentations—market analysis, competitor landscapes, growth roadmaps. I record screen walkthroughs and share via Cheesebox. Clients love that they can revisit them anytime."
              </p>
              <p className="text-sm text-gray-600 italic">
                — Jennifer L., Strategy Consultant
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Life & Career Coaches</h3>
              <p className="text-gray-700 mb-4">
                "Between sessions, I send personalized video check-ins to my clients. It keeps momentum high and shows I'm invested. The HD quality makes it feel personal and caring, not rushed and generic."
              </p>
              <p className="text-sm text-gray-600 italic">
                — Sarah T., Career Transition Coach
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Leadership Development</h3>
              <p className="text-gray-700 mb-4">
                "I run 360 leadership assessments. The feedback videos I create are deeply personal and confidential. Cheesebox ensures only the specific leader can access their video. That level of privacy is non-negotiable."
              </p>
              <p className="text-sm text-gray-600 italic">
                — Dr. James K., Leadership Consultant
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
              What You're Currently Paying
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Most coaches don't realize how much they're overpaying for video delivery.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="text-sm font-semibold text-gray-500 mb-2">Screen Recording</div>
                <h4 className="font-bold text-gray-900 mb-3 text-2xl">Loom Business</h4>
                <div className="text-3xl font-bold text-gray-900 mb-2">$12.50/mo</div>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Per user</li>
                  <li>• Loom watermark</li>
                  <li>• Platform dependent</li>
                  <li>• $150/year</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="text-sm font-semibold text-gray-500 mb-2">File Transfer</div>
                <h4 className="font-bold text-gray-900 mb-3 text-2xl">WeTransfer Pro</h4>
                <div className="text-3xl font-bold text-gray-900 mb-2">$15/mo</div>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Links expire</li>
                  <li>• No video player</li>
                  <li>• Manual downloads</li>
                  <li>• $180/year</li>
                </ul>
              </div>

              <div className="bg-emerald-600 text-white rounded-xl p-6 border-4 border-emerald-700">
                <div className="text-sm font-semibold mb-2">Professional Delivery</div>
                <h4 className="font-bold mb-3 text-2xl">Cheesebox</h4>
                <div className="text-3xl font-bold mb-2">~$5/mo</div>
                <ul className="space-y-2 text-sm">
                  <li>• HD quality</li>
                  <li>• Never expires</li>
                  <li>• True privacy</li>
                  <li>• ~$60/year</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 text-center">
              <p className="text-2xl font-bold text-gray-900 mb-2">
                Save $90-120/year
              </p>
              <p className="text-gray-700">
                Plus, you own your content. No platform can delete your videos or change their terms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            Coach & Consultant FAQs
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "How do I organize videos for different clients?",
                a: "Create groups for each client or project. 'Client A - Q1 2024', 'Executive Coaching - Sarah', etc. Share specific video collections with each client. Keep everything organized your way."
              },
              {
                q: "Can I password-protect individual videos?",
                a: "Each video has a unique, unguessable URL. Only people with that specific link can watch. For additional security, you can integrate with your client portal or periodically generate new links."
              },
              {
                q: "What if my video contains confidential business information?",
                a: "Cheesebox is as secure as you need it to be. Videos are stored in YOUR Amazon S3 account (not ours), links are private, and you control who gets access. For compliance-heavy industries, you maintain full control."
              },
              {
                q: "Do clients need to create an account?",
                a: "No. They click your link, the video plays. Zero friction. Perfect for busy executives who don't want another login."
              },
              {
                q: "Can I track who watched my videos?",
                a: "Currently, Cheesebox focuses on simple, private video delivery. For detailed viewing analytics, you'd integrate with your CRM or client management system. Most coaches prefer the simplicity."
              },
              {
                q: "How is this different from Loom?",
                a: "Loom is great for quick screen recordings with comments. Cheesebox is for delivering polished client work in full HD with true privacy. No Loom watermark, no platform lock-in, no compression. You own the storage."
              },
              {
                q: "What's the video quality like compared to Zoom recordings?",
                a: "Zoom compresses videos when you download them. If you upload that Zoom recording to Cheesebox, we don't compress it further—what you upload is what they watch. For best quality, use native recording tools and upload the original file."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-emerald-50 transition"
                >
                  <span className="font-semibold text-gray-900">{faq.q}</span>
                  <span className="text-2xl text-emerald-600">
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
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Your Expertise Deserves Professional Delivery
          </h2>
          <p className="text-xl mb-8 opacity-95">
            Stop settling for email bounces and expiring links. Deliver client value the way you intended—flawlessly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/auth/signup"
              className="bg-white text-emerald-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Elevate Your Client Experience →
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm opacity-90">
            <span>✓ Free software</span>
            <span>✓ True privacy</span>
            <span>✓ Never expires</span>
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
