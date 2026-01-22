"use client";

import Link from "next/link";
import { useState } from "react";
import React from "react";
import VideoCameraIcon from "@/components/icons/VideoCameraIcon";

export default function PersonalLandingPage() {
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
      <nav className="border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-purple-600">Cheesebox</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/auth/signin"
                className="text-gray-700 hover:text-purple-600 font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition font-medium"
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
            <source src="/videos/family.mov" type="video/quicktime" />
            <source src="/videos/family.mov" type="video/mp4" />
          </video>
          {/* Gradient Overlay - Soft, nurturing colors for young parents */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-50/60 via-blue-50/50 to-purple-50/60"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Remember When Grandma Could Actually See the Baby's First Steps?
            </h1>
            <p className="text-xl sm:text-2xl text-gray-700 mb-8">
              Stop sending pixelated messes. Share your daughter's graduation, your son's first goal, or your dog's birthday party in crystal-clear quality—even if Grandma's still using that old Android from 2018.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/auth/signup"
                className="bg-purple-600 text-white px-8 py-4 rounded-xl hover:bg-purple-700 transition text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Start Sharing Free
              </Link>
              <Link
                href="/how-it-works"
                className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-xl hover:bg-purple-50 transition text-lg font-semibold inline-block"
              >
                See How It Works
              </Link>
            </div>
            <p className="text-gray-600">
              Join families who've said goodbye to "Can you send that again? It came through blurry."
            </p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            Sound Familiar?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-pink-50 p-8 rounded-2xl text-center">
              <div className="text-5xl mb-4">😞</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">"It Came Through Blurry"</h3>
              <p className="text-gray-700">
                You filmed your daughter's piano recital in 4K, but when Aunt Marie opened it on her phone, she could barely make out which kid was yours. The compression turned your crisp video into a pixelated blur.
              </p>
            </div>
            <div className="bg-blue-50 p-8 rounded-2xl text-center">
              <div className="text-5xl mb-4">❌</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">"The File's Too Large"</h3>
              <p className="text-gray-700">
                Your son scored the winning goal—all 3 glorious minutes of it. But iMessage won't send it. Gmail blocks it. And now you're trying to figure out how to chop it into pieces like it's 1999.
              </p>
            </div>
            <div className="bg-purple-50 p-8 rounded-2xl text-center">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">"I Have Android, He Has iPhone"</h3>
              <p className="text-gray-700">
                You recorded your niece's first words on your iPhone. Your brother has a Samsung. When you texted it, what arrived looked like it was filmed on a potato from 2007.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Here's How It Actually Works
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              No more "Can you send that again?" No more explaining to Dad how to download an app. Just upload once, share a link, and everyone watches it perfectly—whether they're on that brand new iPhone 16 or that Galaxy S9 they refuse to upgrade.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-white p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl">⬆️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Upload from Your Phone</h3>
              <p className="text-gray-700">You just filmed your kid's dance recital. Open Cheesebox, tap upload, and go grab a coffee. We'll handle the rest.</p>
            </div>
            <div className="text-center">
              <div className="bg-white p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl">🔗</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Copy and Paste One Link</h3>
              <p className="text-gray-700">We give you a link. That's it. Text it to the family group chat, email it to Grandma, post it in your neighborhood Facebook group—wherever.</p>
            </div>
            <div className="text-center">
              <div className="bg-white p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl">✨</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">They Click and Watch</h3>
              <p className="text-gray-700">No app to download. No account to create. Grandma clicks, it plays in perfect quality. Uncle Bob on Android? Looks great. Your tech-savvy cousin on her MacBook? Also perfect.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            What People Love About It
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <VideoCameraIcon className="w-10 h-10 fill-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">"I Can Actually See Their Faces!"</h3>
                <p className="text-gray-700">That 4K video of your nephew blowing out the candles? It stays 4K. Every detail, every smile, every tear of joy—exactly as you filmed it. No more "Sorry, it's a bit blurry."</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-3xl">📱</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">"My Mom Could Actually Use It"</h3>
                <p className="text-gray-700">Your 72-year-old mother-in-law clicks the link you texted her. It just plays. No "Download this app." No "Create an account." No tech support call. She watches, she smiles, she sends you a heart emoji. Done.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-3xl">🔒</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">"Only Family Sees This"</h3>
                <p className="text-gray-700">You're sharing your kid's bathtime giggles, not posting them to Facebook. Your videos stay private—only people with your link can watch. No public profiles, no algorithmic feeds, no strangers.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-3xl">😊</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">"I'm Not Tech-Savvy—This Was Easy"</h3>
                <p className="text-gray-700">If you can text a photo, you can use Cheesebox. Upload the video, copy the link, paste it. That's the whole process. Your relatives don't download anything. They just click and watch.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-3xl">🎁</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">"Wait, This is Actually Free?"</h3>
                <p className="text-gray-700">Cheesebox costs exactly $0. Forever. You just pay Amazon a few dollars a month for storage (about what a single latte costs). No subscriptions, no premium tiers, no "upgrade to unlock."</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-3xl">☁️</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">"These Are MY Videos"</h3>
                <p className="text-gray-700">Your daughter's first birthday lives in your Amazon account, not some startup's server. If Cheesebox shuts down tomorrow (we won't!), your videos stay safe. You own them. Forever.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-16">
            Seriously, It's This Simple
          </h2>
          <div className="space-y-12 max-w-4xl mx-auto">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                1
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Upload Your Video</h3>
                <p className="text-lg text-gray-700">
                  Just filmed your daughter's soccer game? Great. Open Cheesebox on your phone, tap the upload button, and let it do its thing while you drive home. By the time you're pulling into the driveway, it's ready to share.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                2
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Get Your Link</h3>
                <p className="text-lg text-gray-700">
                  Cheesebox gives you a link. It looks like this: <span className="font-mono text-sm">cheesebox.com/watch/abc123</span>. Copy it. That's it. That's the whole technical part.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                3
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Share the Moment</h3>
                <p className="text-lg text-gray-700">
                  Text it to the family group chat. Email it to Grandpa. Post it to your neighborhood's Facebook group. Wherever you paste it, people click it and watch. Grandma on her iPad? Works. Your brother on his Pixel? Works. Your tech-confused cousin on that ancient laptop? Yep, still works.
                </p>
              </div>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link
              href="/auth/signup"
              className="inline-block bg-purple-600 text-white px-8 py-4 rounded-xl hover:bg-purple-700 transition text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Alright, I'm convinced. Let me try it →
            </Link>
          </div>
        </div>
      </section>

      {/* Cost Transparency Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              "Okay, But What's The Catch?"
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              There isn't one. Cheesebox is free software. You just pay Amazon a few bucks a month for the storage space—like renting a small closet for your videos.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 lg:p-12 mb-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">💰</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Here's the Honest Truth About Cost</h3>
                <p className="text-lg text-gray-700">
                  Cheesebox itself? Completely free. But your videos have to live somewhere, right? That's where Amazon S3 comes in. Think of it like paying for a storage unit—except this one costs about as much as one fancy coffee per month.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6">
                  <div className="text-3xl mb-3">📊</div>
                  <h4 className="font-bold text-gray-900 mb-2">What You'll Actually Pay Amazon</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• 50GB of videos: ~$1.15/month (that's like 50 birthday party videos)</li>
                    <li>• 200GB of videos: ~$4.60/month (your entire year of family moments)</li>
                    <li>• Only charged for what you actually use—no fake "unlimited" plans</li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-6">
                  <div className="text-3xl mb-3">🎯</div>
                  <h4 className="font-bold text-gray-900 mb-2">Why This Actually Makes Sense</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Your daughter's first steps are in YOUR account. If we go out of business, they're still there.</li>
                    <li>• Need more space? Add it. Kids moved out? Delete old videos. You're in control.</li>
                    <li>• No "Your free trial has expired" emails. Ever.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 mb-6">
                "Wait, I have to set up an Amazon account?" Yes. It takes about 5 minutes. We wrote a guide with screenshots for every single step. Even your dad could do it. (No offense to your dad.)
              </p>
              <Link
                href="/help/aws-setup"
                className="inline-block text-purple-600 hover:text-purple-700 font-semibold underline"
              >
                Show me the setup guide (I promise it's painless) →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-pink-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            Questions? We've Got Answers.
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Do I need a tech background to use Cheesebox?",
                a: "Not at all! If you can send a text message, you can use Cheesebox. It's designed for regular people, not tech experts."
              },
              {
                q: "What if my family uses different types of phones?",
                a: "Perfect! That's exactly what Cheesebox solves. Your videos look great on iPhone, Android, tablets, and computers."
              },
              {
                q: "Do people need to download an app to watch my videos?",
                a: "Nope! They just click your link and watch in their browser. No downloads, no accounts, no hassle."
              },
              {
                q: "Is Cheesebox really free?",
                a: "Yes! Cheesebox is 100% free software. You just bring your own Amazon S3 storage account and pay Amazon directly for storage (typically $1-5/month depending on how many videos you upload)."
              },
              {
                q: "How much does Amazon charge for storage?",
                a: "Amazon S3 is very cheap! For example, 50GB costs about $1.15/month, and 200GB costs about $4.60/month. You only pay for what you use, and you can add or remove storage anytime."
              },
              {
                q: "What happens to my videos if I stop using Cheesebox?",
                a: "Your videos stay safe in your Amazon account. Since you own the storage, you can always access your videos directly through Amazon even if you stop using Cheesebox."
              },
              {
                q: "Is it hard to set up Amazon S3?",
                a: "We make it super easy! Our setup guide walks you through every step with screenshots. Most people finish in about 5 minutes. If you get stuck, we're here to help!"
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-purple-50 transition"
                >
                  <span className="font-semibold text-gray-900">{faq.q}</span>
                  <span className="text-2xl text-purple-600">
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
      <section className="py-20 bg-gradient-to-br from-purple-600 to-pink-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Your Kid's Graduation is in 4K. Share It That Way.
          </h2>
          <p className="text-xl mb-8 opacity-95">
            Stop compressing your memories. Join the families who've ditched blurry group chat videos for good.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/auth/signup"
              className="bg-white text-orange-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Yeah, I'm ready. Let's do this →
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm opacity-90">
            <span>✓ Free software (seriously)</span>
            <span>✓ Your videos live in your Amazon account</span>
            <span>✓ Works on literally every device</span>
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
