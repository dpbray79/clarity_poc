'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Icon */}
          <div className="mb-8">
            <div className="text-8xl mb-4">🎤</div>
          </div>

          {/* Heading */}
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Clarity Coach AI
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-gray-300 mb-4">
            AI-Powered Pronunciation Coaching for ESL Learners
          </p>
          
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Master English pronunciation with real-time feedback, phoneme-level analysis, 
            and personalized coaching powered by advanced AI technology.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link 
              href="/assessment"
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold text-lg hover:scale-105 transition-transform shadow-lg"
            >
              Try Free Assessment
            </Link>
            <Link 
              href="/auth/signup"
              className="px-8 py-4 bg-white/5 border border-white/20 rounded-xl text-white font-semibold text-lg hover:bg-white/10 transition-colors"
            >
              Create Account
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            {/* Feature 1 */}
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                Phoneme-Level Analysis
              </h3>
              <p className="text-gray-400">
                Get detailed feedback on individual sounds and identify exactly which phonemes need improvement.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                AI-Powered Coaching
              </h3>
              <p className="text-gray-400">
                Receive personalized tips and exercises tailored to your native language and skill level.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                Track Your Progress
              </h3>
              <p className="text-gray-400">
                Monitor improvement over time with detailed analytics and achievement tracking.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                214+
              </div>
              <div className="text-sm text-gray-400">Languages Supported</div>
            </div>

            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                100%
              </div>
              <div className="text-sm text-gray-400">Privacy Protected</div>
            </div>

            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                $0
              </div>
              <div className="text-sm text-gray-400">Monthly Cost</div>
            </div>

            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                AI
              </div>
              <div className="text-sm text-gray-400">Powered Analysis</div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-20 p-8 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-gray-300 italic text-lg mb-4">
              "Built by an ESL teacher with 20+ years of experience, 
              combining proven teaching methods with cutting-edge AI technology."
            </p>
            <p className="text-gray-400">
              — Dylan Bray, Creator
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
