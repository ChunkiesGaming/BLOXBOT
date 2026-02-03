'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const loginBase = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:4000'
const loginUrl = `${loginBase}/api/v1/auth/roblox/login`

export default function WelcomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 p-6 md:p-10">
        <div className="max-w-4xl mx-auto">
          <Image
            src="/BLOXBOT_Banner.png"
            alt="BLOXBOT"
            width={800}
            height={200}
            className="w-full max-w-2xl mb-8 object-contain"
            priority
          />
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-12">
            <div className="flex items-center gap-4">
              <Image
                src="/BLOXBOT_Logo.png"
                alt="BLOXBOT"
                width={56}
                height={56}
                className="rounded-lg"
              />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">bloxbot</h1>
                <p className="text-gray-400 mt-1">Play Roblox quests. Earn points. Claim rewards.</p>
              </div>
            </div>
            <a
              href={loginUrl}
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-black font-semibold rounded-lg hover:bg-primary/90 transition shrink-0"
            >
              Sign in with Roblox
            </a>
          </div>

          <section className="grid md:grid-cols-3 gap-6 text-center mb-12">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <h3 className="font-semibold text-lg mb-2">Complete quests</h3>
              <p className="text-gray-400 text-sm">Finish in-game objectives in supported Roblox experiences.</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <h3 className="font-semibold text-lg mb-2">Earn points</h3>
              <p className="text-gray-400 text-sm">Accumulate points you can use to claim rewards.</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <h3 className="font-semibold text-lg mb-2">Claim rewards</h3>
              <p className="text-gray-400 text-sm">Link your wallet and redeem your earned rewards.</p>
            </div>
          </section>

          <p className="text-gray-500 text-sm text-center">
            Already have an account? <a href={loginUrl} className="text-primary hover:underline">Sign in with Roblox</a>.
            {' '}
            <Link href="/" className="text-gray-400 hover:text-white transition">Go to app</Link>.
          </p>
        </div>
      </div>
    </main>
  )
}
