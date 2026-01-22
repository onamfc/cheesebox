"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import VideoCameraIcon from "@/components/icons/VideoCameraIcon";
import PlayCircleIcon from "@/components/icons/PlayCircleIcon";
import LockIcon from "@/components/icons/LockIcon";
import ShareLinkIcon from "@/components/icons/ShareLinkIcon";
import CloudStorageIcon from "@/components/icons/CloudStorageIcon";

export default function FitnessLandingPage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const totalScroll = docHeight - windowHeight;
      const progress = (scrollPosition / totalScroll) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const testimonials = [
    {
      emoji: "🏋️",
      title: "Personal Trainers",
      quote: "I have 20 clients. Each gets a custom 12-week program. I filmed 80 exercises once, now I just send different program links. Clients love that they can watch demos at the gym without searching through Instagram DMs.",
      author: "Jake M., Personal Trainer, Austin TX"
    },
    {
      emoji: "🏃‍♀️",
      title: "Online Coaches",
      quote: "I charge $150/month for online programming. My clients are worldwide. Cheesebox links work everywhere, any device. The HD quality makes me look professional. I ditched Trainerize and saved $40/month.",
      author: "Maria S., Online Fitness Coach"
    },
    {
      emoji: "🧘",
      title: "Yoga & Pilates Instructors",
      quote: "I record my weekly flows in 4K. Students who miss class get the recording link. The quality is stunning—they can see my alignment cues clearly. I used to use Vimeo Pro ($20/mo), now I pay $5.",
      author: "Priya L., Yoga Instructor"
    },
    {
      emoji: "🥊",
      title: "Specialty Coaches",
      quote: "I teach Olympic lifting. Form is EVERYTHING. Compressed videos hide the details. With Cheesebox, my athletes see every micro-movement in HD. Fewer injuries, faster progress, happier clients.",
      author: "Coach David R., Weightlifting Coach"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-800 z-50">
        <div
          className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md border-b border-white/10 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
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
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full hover:shadow-lg hover:shadow-red-500/50 transition-all"
              >
                Start Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-6 py-2 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <span className="text-orange-300 text-sm font-semibold">FOR FITNESS PROFESSIONALS</span>
          </div>

          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-8">
            <span className="bg-gradient-to-r from-white via-orange-200 to-red-200 bg-clip-text text-transparent">
              Your Clients Deserve
            </span>
            <br />
            <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
              Perfect Form
            </span>
          </h1>

          <p className="text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Stop texting blurry workout videos. Deliver crystal-clear form demonstrations that get results—on any device, anywhere.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/auth/signup"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-10 py-5 rounded-full hover:shadow-2xl hover:shadow-red-500/50 transition-all text-lg font-bold hover:scale-105 transform"
            >
              Start Training Smarter
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-3 border-2 border-white/20 text-white px-10 py-5 rounded-full hover:bg-white/10 transition-all text-lg font-bold backdrop-blur-sm"
            >
              See How It Works
            </Link>
          </div>

          <div className="flex flex-wrap gap-8 justify-center text-slate-400">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Free Software</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>4K Quality</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Save $300-500/Year</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Problem Section */}
      <section className="min-h-screen flex items-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-900 to-black"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                The Struggle
              </span>
              <br />
              <span className="text-white">Is Real</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              You're working harder, not smarter. Let's fix that.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:bg-white/10 hover:border-orange-500/50 transition-all duration-300">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">😤</div>
              <h3 className="text-2xl font-bold text-white mb-4">"They Can't See My Form Cues"</h3>
              <p className="text-slate-300 leading-relaxed">
                You film a perfect squat demonstration showing hip hinge and knee tracking. Text it to your client. Instagram compresses it to mush. They ask "wait, where should my knees be?" because they can't see the details that matter.
              </p>
            </div>

            <div className="group bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:bg-white/10 hover:border-red-500/50 transition-all duration-300">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">📱</div>
              <h3 className="text-2xl font-bold text-white mb-4">"Texting Videos Is a Nightmare"</h3>
              <p className="text-slate-300 leading-relaxed">
                Your client's 6-week program has 45 exercise videos. You can't text them all. Can't email them. Instagram DMs? Compressed. YouTube? Too public. You're manually sending links one by one like it's 2005.
              </p>
            </div>

            <div className="group bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:bg-white/10 hover:border-pink-500/50 transition-all duration-300">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">💸</div>
              <h3 className="text-2xl font-bold text-white mb-4">"Platforms Charge Me Monthly"</h3>
              <p className="text-slate-300 leading-relaxed">
                You're paying $30-50/month for Trainerize or TrueCoach just to host workout videos. That's $360-600/year. And they still compress your videos. You're paying to deliver lower quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="min-h-screen flex items-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-black to-red-900/20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 bg-orange-500/10 border border-orange-500/30 rounded-full px-6 py-2 mb-6">
              <span className="text-orange-400 font-bold text-sm tracking-widest">THE SOLUTION</span>
            </div>
            <h2 className="text-5xl sm:text-6xl font-bold mb-6 text-white">
              Crystal-Clear Demos.
              <br />
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Private Programs.
              </span>
              <br />
              Zero Monthly Fees.
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Upload your exercise library once. Share private links with each client. They see every rep in full HD—perfect form, perfect quality.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 rounded-full blur-xl opacity-50"></div>
                <div className="relative bg-gradient-to-br from-orange-500 to-red-500 p-8 rounded-full w-32 h-32 flex items-center justify-center mx-auto">
                  <VideoCameraIcon className="w-16 h-16 fill-white" />
                </div>
              </div>
              <div className="inline-flex items-center justify-center bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-1 mb-4">
                <span className="text-orange-400 font-bold text-sm">STEP 1</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Build Your Exercise Library</h3>
              <p className="text-slate-300 leading-relaxed">
                Film it once in HD. Deadlifts, squats, kettlebell swings—your entire movement library. Upload to Cheesebox. Organize by muscle group, difficulty, equipment. Done.
              </p>
            </div>

            <div className="text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-500 rounded-full blur-xl opacity-50"></div>
                <div className="relative bg-gradient-to-br from-red-500 to-pink-500 p-8 rounded-full w-32 h-32 flex items-center justify-center mx-auto">
                  <ShareLinkIcon className="w-16 h-16 text-white" />
                </div>
              </div>
              <div className="inline-flex items-center justify-center bg-red-500/10 border border-red-500/30 rounded-full px-4 py-1 mb-4">
                <span className="text-red-400 font-bold text-sm">STEP 2</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Send Private Program Links</h3>
              <p className="text-slate-300 leading-relaxed">
                Each client gets their custom program link. Week 1 workouts, Week 2 progressions—all in one place. They click, they watch, they train. No app required.
              </p>
            </div>

            <div className="text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full blur-xl opacity-50"></div>
                <div className="relative bg-gradient-to-br from-pink-500 to-purple-500 p-8 rounded-full w-32 h-32 flex items-center justify-center mx-auto">
                  <span className="text-6xl">💪</span>
                </div>
              </div>
              <div className="inline-flex items-center justify-center bg-pink-500/10 border border-pink-500/30 rounded-full px-4 py-1 mb-4">
                <span className="text-pink-400 font-bold text-sm">STEP 3</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">They Execute Perfectly</h3>
              <p className="text-slate-300 leading-relaxed">
                Your client watches your demo at the gym. Full HD on their phone. They see exactly where your hands go, how your back stays neutral, where to feel the squeeze. Better form. Better results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-32 bg-gradient-to-b from-black via-slate-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6">
              <span className="text-white">Why Trainers</span>
              <br />
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Love Cheesebox
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <VideoCameraIcon className="w-8 h-8 fill-orange-400" />,
                title: "Form Cues They Can Actually See",
                description: "Your hip hinge video stays sharp. Your rotator cuff demo shows every angle. Clients watch in HD and execute correctly the first time."
              },
              {
                icon: "📚",
                title: "One Library, Unlimited Programs",
                description: "Film 50 exercises once. Mix and match for every client. Sarah gets her beginner program, Mike gets his advanced split."
              },
              {
                icon: <LockIcon className="w-8 h-8 text-red-400" />,
                title: "Private Client Programs",
                description: "Each client's program link is private. They can't share it with friends. Your premium content stays premium."
              },
              {
                icon: "💰",
                title: "Save $300-500/Year",
                description: "Cheesebox is free. You pay Amazon ~$5/month for storage. That's $60/year vs $360-600/year for training platforms."
              },
              {
                icon: <PlayCircleIcon className="w-8 h-8 text-pink-400" />,
                title: "Works in the Gym",
                description: "Your client opens the link at 6am in the gym. Video plays instantly on their iPhone or Android. No app to download, no login required."
              },
              {
                icon: "⚡",
                title: "Look More Professional",
                description: "You're sending crystal-clear HD videos via private links, not grainy Instagram DMs. Clients feel they're getting premium service."
              }
            ].map((benefit, index) => (
              <div
                key={index}
                className="group bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 hover:border-orange-500/50 transition-all duration-300"
              >
                <div className="mb-4 text-4xl group-hover:scale-110 transition-transform">
                  {typeof benefit.icon === 'string' ? benefit.icon : benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                <p className="text-slate-300 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-32 bg-gradient-to-br from-orange-900/20 via-black to-red-900/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Real Trainers,
              </span>
              <br />
              <span className="text-white">Real Results</span>
            </h2>
          </div>

          <div className="relative">
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/10">
              <div className="text-7xl mb-8">{testimonials[activeTestimonial].emoji}</div>
              <h3 className="text-2xl font-bold text-white mb-6">{testimonials[activeTestimonial].title}</h3>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed italic">
                "{testimonials[activeTestimonial].quote}"
              </p>
              <p className="text-sm text-slate-400">
                — {testimonials[activeTestimonial].author}
              </p>
            </div>

            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === activeTestimonial
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 w-12'
                      : 'bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-white">
              The Math That Makes
              <br />
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Trainers Switch
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              You're probably paying way too much to deliver way lower quality.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="text-sm font-semibold text-slate-400 mb-2">Training Platform</div>
              <h4 className="font-bold text-white mb-3 text-3xl">Trainerize</h4>
              <div className="text-5xl font-bold text-white mb-4">$30-50<span className="text-2xl text-slate-400">/mo</span></div>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Video compression
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Limited storage
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Platform lock-in
                </li>
                <li className="text-slate-400 font-bold mt-4">= $360-600/year</li>
              </ul>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="text-sm font-semibold text-slate-400 mb-2">Video Hosting</div>
              <h4 className="font-bold text-white mb-3 text-3xl">Vimeo Pro</h4>
              <div className="text-5xl font-bold text-white mb-4">$20<span className="text-2xl text-slate-400">/mo</span></div>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Better quality
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Still compressed
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  No program builder
                </li>
                <li className="text-slate-400 font-bold mt-4">= $240/year</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-orange-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-br from-orange-500 to-red-500 text-white text-xs font-bold px-4 py-1 rounded-bl-xl">
                BEST VALUE
              </div>
              <div className="text-sm font-semibold text-orange-300 mb-2">Own Your Content</div>
              <h4 className="font-bold text-white mb-3 text-3xl">Cheesebox</h4>
              <div className="text-5xl font-bold text-white mb-4">~$5<span className="text-2xl text-orange-300">/mo</span></div>
              <ul className="space-y-3 text-white">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Zero compression
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited videos
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  You own it all
                </li>
                <li className="text-orange-300 font-bold mt-4">= ~$60/year</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-2xl p-8 text-center">
            <p className="text-3xl font-bold text-white mb-2">
              Save $180-540/year
            </p>
            <p className="text-xl text-slate-300">
              That's 2-4 extra client payments. Just by switching how you host videos.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 bg-gradient-to-b from-black via-slate-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">
              <span className="text-white">Trainer</span>
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent"> FAQs</span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Can I organize videos by muscle group or workout type?",
                a: "Yes! You can organize videos into groups (e.g., 'Upper Body', 'Lower Body', 'Core') and share specific collections with each client. Build your library your way."
              },
              {
                q: "Do clients need an account to watch?",
                a: "Nope! They just click your link and the video plays. No app, no login, no friction. Perfect for clients who aren't tech-savvy."
              },
              {
                q: "Can I see who's watching my videos?",
                a: "Currently, Cheesebox focuses on simple video delivery. For detailed analytics, you'd need to integrate with your own tracking tools. Most trainers use it alongside their existing client management system."
              },
              {
                q: "What if a client shares their program link with friends?",
                a: "Each link is unique and unguessable, but yes, technically they could share it. For most trainers, this isn't an issue—clients value the coaching relationship, not just the videos. If needed, you can create new links periodically."
              },
              {
                q: "How long does it take to build my exercise library?",
                a: "If you film 50 exercises for 2 minutes each, that's 100 minutes of filming. Upload once, use forever. Most trainers spend a weekend building their library and never worry about it again."
              },
              {
                q: "Is the video quality really that much better?",
                a: "Yes. Instagram and WhatsApp compress videos aggressively. Cheesebox delivers your original file. Film in 1080p or 4K, that's what your clients watch. No compression, no pixelation, no artifacts."
              }
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-orange-500/50 transition-all"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-white/5 transition"
                >
                  <span className="font-bold text-white text-lg pr-8">{faq.q}</span>
                  <span className="text-3xl text-orange-400 flex-shrink-0">
                    {openFaqIndex === index ? "−" : "+"}
                  </span>
                </button>
                {openFaqIndex === index && (
                  <div className="px-8 pb-6 text-slate-300 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900 via-red-900 to-pink-900"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <h2 className="text-6xl sm:text-7xl font-bold text-white mb-8">
            Stop Losing Money
            <br />
            <span className="text-orange-200">Start Training Smarter</span>
          </h2>
          <p className="text-2xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
            Your clients can't see your form cues. Fix that today with crystal-clear HD demos that get results.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-3 bg-white text-red-600 px-12 py-6 rounded-full hover:bg-gray-100 transition-all text-xl font-bold shadow-2xl hover:shadow-white/20 hover:scale-105 transform group"
          >
            Build Your Library Now
            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <p className="text-white/80 mt-8 text-lg">
            Free software • 4K quality • Save $300-500/year
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
                <li><Link href="/coaches" className="hover:text-white transition">For Coaches</Link></li>
                <li><Link href="/educators" className="hover:text-white transition">For Educators</Link></li>
                <li><Link href="/videographers" className="hover:text-white transition">For Videographers</Link></li>
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
