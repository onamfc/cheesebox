"use client";

import Link from "next/link";
import { useState } from "react";
import React from "react";
import VideoCameraIcon from "@/components/icons/VideoCameraIcon";
import UnlockIcon from "@/components/icons/UnlockIcon";

export default function EducatorsLandingPage() {
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
      <nav className="border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">Cheesebox</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/auth/signin"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition font-medium"
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
            <source src="/videos/educators.mov" type="video/quicktime" />
            <source src="/videos/educators.mov" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/75 via-indigo-900/65 to-violet-900/70"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Your Lectures Deserve Better Than YouTube—And So Do Your Students
            </h1>
            <p className="text-xl sm:text-2xl text-gray-100 mb-8">
              Stop fighting school firewalls, YouTube distractions, and privacy concerns. Share lectures, lab demonstrations, and course materials in crystal-clear quality—privately, safely, on any device.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/auth/signup"
                className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Start Teaching Better
              </Link>
              <Link
                href="/how-it-works"
                className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white/10 transition text-lg font-semibold inline-block"
              >
                See How It Works
              </Link>
            </div>
            <p className="text-gray-200">
              Join educators who've freed themselves from YouTube, Zoom limits, and school IT headaches
            </p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            The Teacher's Tech Struggle
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-8 rounded-2xl text-center">
              <div className="text-5xl mb-4">🚫</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">"YouTube is Blocked at School"</h3>
              <p className="text-gray-700">
                You spent hours creating a perfect chemistry demo video. Uploaded to YouTube. Half your students can't watch it—school firewall blocks YouTube. The other half gets distracted by recommended videos. Your lesson gets lost in cat videos.
              </p>
            </div>
            <div className="bg-indigo-50 p-8 rounded-2xl text-center">
              <div className="text-5xl mb-4">⏰</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">"Zoom Only Saves 40 Minutes"</h3>
              <p className="text-gray-700">
                You recorded a 90-minute lecture on Zoom. Tried to save it. "Free accounts limited to 40 minutes." Now you're manually stitching together three separate recordings. This is your weekend.
              </p>
            </div>
            <div className="bg-violet-50 p-8 rounded-2xl text-center">
              <div className="text-5xl mb-4">👨‍👩‍👧‍👦</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">"Parents Want Access Too"</h3>
              <p className="text-gray-700">
                Parents ask for recordings so they can help with homework. But sharing your Google Drive means navigating permissions, folders, "request access" emails. You're a teacher, not an IT department.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Ad-Free Learning. Full Quality. Zero Firewall Issues.
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Record your lessons once. Share a simple link with students and parents. They watch on any device in full HD—no YouTube distractions, no school blocks, no Zoom limits. Just your teaching.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-white p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <VideoCameraIcon className="w-12 h-12 fill-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Record Your Way</h3>
              <p className="text-gray-700">Screen record your slide deck. Film a lab demonstration. Record office hours. Capture guest speakers. Upload to Cheesebox. No time limits. No quality loss.</p>
            </div>
            <div className="text-center">
              <div className="bg-white p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl">📚</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Share With Your Class</h3>
              <p className="text-gray-700">Post the link in your LMS, email it, or add it to your class website. Works through school firewalls. No ads. No YouTube rabbit holes. Just your content.</p>
            </div>
            <div className="text-center">
              <div className="bg-white p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl">🎓</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Students Learn Better</h3>
              <p className="text-gray-700">Absent students catch up. Struggling students rewatch at their pace. Advanced students preview next week. Parents understand what their kids are learning. Everyone wins.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            Why Teachers Love Cheesebox
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <UnlockIcon className="w-12 h-12 fill-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Works Through School Firewalls</h3>
                <p className="text-gray-700">Unlike YouTube, Cheesebox links work in schools. IT departments don't block them. Students watch in class, in the library, at home. No "this site is blocked" messages.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-3xl">📺</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Zero Distractions</h3>
                <p className="text-gray-700">No recommended videos. No ads. No comment sections. Students click your link, watch your lesson, and stay focused. Your content doesn't compete with Mr. Beast.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <VideoCameraIcon className="w-10 h-10 fill-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Lab-Quality Demonstrations</h3>
                <p className="text-gray-700">Film your chemistry experiments, physics demonstrations, or math proofs in HD. Students see every detail. The Bunsen burner flame color. The graph slopes. The dissection steps. Nothing gets lost to compression.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-3xl">♾️</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No Time Limits</h3>
                <p className="text-gray-700">Zoom free = 40 minutes. Google Meet free = 60 minutes. Cheesebox? Unlimited. Record your full 90-minute lecture or 3-hour lab. Upload it. Done.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-3xl">👨‍👩‍👧</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Parent-Friendly Sharing</h3>
                <p className="text-gray-700">Parents want to help with homework but don't know what you taught. Share your lecture link. They watch. They understand. They can actually help their kid. Parent-teacher partnership, automated.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-3xl">💰</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Actually Free for Educators</h3>
                <p className="text-gray-700">Cheesebox costs $0. You pay Amazon ~$5/month for storage. That's less than EdPuzzle ($12/mo) or Screencastify ($49/year). Better quality, lower cost. Easy budget approval.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-violet-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-16">
            Real Classrooms, Real Impact
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="text-4xl mb-4">🔬</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">High School Science Teachers</h3>
              <p className="text-gray-700 mb-4">
                "I pre-record lab demos for safety reasons—students watch first, then we do it together. The HD quality means they can see the exact phenolphthalein color change. No more 'I couldn't see' excuses."
              </p>
              <p className="text-sm text-gray-600 italic">
                — Mr. Chen, Chemistry Teacher
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="text-4xl mb-4">📐</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Math Professors</h3>
              <p className="text-gray-700 mb-4">
                "I record my lectures and post them before class—flipped classroom style. Students watch on their own time, we use class for problem-solving. Cheesebox links work on campus WiFi, unlike YouTube which is throttled."
              </p>
              <p className="text-sm text-gray-600 italic">
                — Dr. Patel, University Math Dept
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Arts & Electives Teachers</h3>
              <p className="text-gray-700 mb-4">
                "I teach digital art. My screen recording tutorials show every Photoshop tool, every layer adjustment. If I uploaded to YouTube, they'd be unwatchable compressed. Cheesebox keeps them sharp. Students actually learn the techniques."
              </p>
              <p className="text-sm text-gray-600 italic">
                — Ms. Rodriguez, Art Teacher
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">ESL & Language Teachers</h3>
              <p className="text-gray-700 mb-4">
                "My pronunciation videos NEED to be high quality—students need to see my mouth movements. Compressed videos blur the details. With Cheesebox, they see every lip position, tongue placement. Better learning outcomes."
              </p>
              <p className="text-sm text-gray-600 italic">
                — Professor Kim, ESL Instructor
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
              What Schools Are Actually Paying
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Most ed-tech tools charge per teacher. The costs add up fast.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="text-sm font-semibold text-gray-500 mb-2">Video Tool</div>
                <h4 className="font-bold text-gray-900 mb-3 text-2xl">EdPuzzle Pro</h4>
                <div className="text-3xl font-bold text-gray-900 mb-2">$12/mo</div>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Per teacher</li>
                  <li>• Platform dependent</li>
                  <li>• Limited features</li>
                  <li>• $144/year</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="text-sm font-semibold text-gray-500 mb-2">Screen Recording</div>
                <h4 className="font-bold text-gray-900 mb-3 text-2xl">Screencastify</h4>
                <div className="text-3xl font-bold text-gray-900 mb-2">$49/year</div>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Per teacher</li>
                  <li>• 5min limit (free)</li>
                  <li>• Watermark on free</li>
                  <li>• $49/year minimum</li>
                </ul>
              </div>

              <div className="bg-blue-600 text-white rounded-xl p-6 border-4 border-blue-700">
                <div className="text-sm font-semibold mb-2">Own Your Content</div>
                <h4 className="font-bold mb-3 text-2xl">Cheesebox</h4>
                <div className="text-3xl font-bold mb-2">~$5/mo</div>
                <ul className="space-y-2 text-sm">
                  <li>• Unlimited teachers</li>
                  <li>• No time limits</li>
                  <li>• HD quality</li>
                  <li>• ~$60/year total</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 text-center">
              <p className="text-2xl font-bold text-gray-900 mb-2">
                Save $84-1,380/year
              </p>
              <p className="text-gray-700">
                (Savings increase with each additional teacher—Cheesebox doesn't charge per user)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            Educator FAQs
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Will Cheesebox work through our school firewall?",
                a: "Yes! Unlike YouTube or streaming sites that schools often block, Cheesebox uses standard HTTPS video delivery that works through most firewalls. If you can access Google Drive, you can access Cheesebox."
              },
              {
                q: "Can I organize videos by unit or topic?",
                a: "Absolutely. Create groups for each unit, chapter, or course. 'Unit 3 - Cellular Biology', 'AP Calc BC - Chapter 7', etc. Share specific collections with students."
              },
              {
                q: "Do students need accounts to watch?",
                a: "No! They just click your link and the video plays. No login, no sign-up, no permission slips. Perfect for K-12 where student accounts are complicated."
              },
              {
                q: "Can parents access these videos?",
                a: "Yes! Share the same link with parents via email or post it on your class website. Parents watch what you taught, they understand the concepts, they can help with homework. Total game-changer."
              },
              {
                q: "Is this FERPA compliant?",
                a: "Cheesebox stores videos in YOUR Amazon S3 account, not on our servers. You control the data. For FERPA compliance, avoid using student names in videos and be mindful of what you share. As always, check with your school's compliance team."
              },
              {
                q: "What if I'm not tech-savvy?",
                a: "If you can upload a file to Google Drive, you can use Cheesebox. Record your video (any tool works—Zoom, QuickTime, OBS), upload it to Cheesebox, share the link. That's it. No complicated settings."
              },
              {
                q: "Can I embed videos in Canvas, Moodle, or Google Classroom?",
                a: "Yes! Copy your Cheesebox video link and paste it anywhere—your LMS, Google Classroom, class website. It plays inline like a YouTube video, but without the YouTube problems."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-blue-50 transition"
                >
                  <span className="font-semibold text-gray-900">{faq.q}</span>
                  <span className="text-2xl text-blue-600">
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
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Your Students Deserve Ad-Free, High-Quality Learning
          </h2>
          <p className="text-xl mb-8 opacity-95">
            Stop wrestling with YouTube blocks and Zoom limits. Teach the way you want.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/auth/signup"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Start Sharing Lessons →
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm opacity-90">
            <span>✓ Free software</span>
            <span>✓ Works in schools</span>
            <span>✓ No ads, no distractions</span>
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
