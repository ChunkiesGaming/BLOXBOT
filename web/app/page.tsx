'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import axios from 'axios'
import Cookies from 'js-cookie'
import QuestList from './components/QuestList'
import PointsDisplay from './components/PointsDisplay'
import ClaimsList from './components/ClaimsList'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'

export default function Home() {
  const { publicKey, connected, connecting } = useWallet()
  const { setVisible } = useWalletModal()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = Cookies.get('auth_token')
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const response = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUser(response.data.user)
    } catch (error) {
      Cookies.remove('auth_token')
    } finally {
      setLoading(false)
    }
  }

  const loginUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:4000'}/api/v1/auth/roblox/login`

  const handleLinkWallet = async () => {
    if (!connected) {
      setVisible(true)
      return
    }

    const token = Cookies.get('auth_token')
    try {
      await axios.post(
        `${API_URL}/users/link-wallet`,
        { walletAddress: publicKey?.toBase58() },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('Wallet linked successfully!')
      checkAuth()
    } catch (error: any) {
      alert('Failed to link wallet: ' + (error.response?.data?.error || error.message))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-400">Loading...</div>
      </div>
    )
  }

  // Not signed in: full landing page
  if (!user) {
    return (
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative overflow-hidden px-4 sm:px-6 py-16 md:py-24 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="relative max-w-4xl mx-auto text-center">
            <Image
              src="/BLOXBOT_Banner.png"
              alt="bloxbot"
              width={800}
              height={220}
              className="w-full max-w-xl mx-auto mb-8 object-contain"
              priority
            />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
              Play Roblox. Earn rewards.
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              bloxbot connects your Roblox account to quests and rewards. Complete objectives in-game, track progress in one dashboard, and claim what you earn.
            </p>
            <a
              href={loginUrl}
              className="inline-block px-8 py-4 bg-primary text-black font-semibold text-lg rounded-xl hover:bg-primary/90 transition shadow-lg shadow-primary/20"
            >
              Get started with Roblox
            </a>
            <p className="mt-4 text-sm text-gray-500">
              Free to use · One sign-in · Your progress, your rewards
            </p>
          </div>
        </section>

        {/* What is bloxbot */}
        <section className="px-4 sm:px-6 py-16 md:py-20 border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">What is bloxbot?</h2>
            <p className="text-gray-400 text-center text-lg max-w-2xl mx-auto">
              bloxbot is a rewards layer for Roblox. Supported games offer quests—play for a while, win a match, reach a zone—and you earn points. Sign in once, see all your quests and claims in one place, and redeem rewards when you’re ready.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="px-4 sm:px-6 py-16 md:py-20 bg-white/[0.02]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">How it works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-12 h-12 rounded-full bg-primary/20 text-primary font-bold text-xl flex items-center justify-center mx-auto mb-4">1</div>
                <h3 className="font-semibold text-lg mb-2">Play</h3>
                <p className="text-gray-400 text-sm">Join supported Roblox experiences and complete quests—playtime, wins, zones, and more.</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-12 h-12 rounded-full bg-primary/20 text-primary font-bold text-xl flex items-center justify-center mx-auto mb-4">2</div>
                <h3 className="font-semibold text-lg mb-2">Earn</h3>
                <p className="text-gray-400 text-sm">Points add up automatically. Your dashboard shows active quests and progress.</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-12 h-12 rounded-full bg-primary/20 text-primary font-bold text-xl flex items-center justify-center mx-auto mb-4">3</div>
                <h3 className="font-semibold text-lg mb-2">Claim</h3>
                <p className="text-gray-400 text-sm">Link your wallet and redeem your earned rewards whenever you want.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-4 sm:px-6 py-16 md:py-20 border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">One dashboard for everything</h2>
            <ul className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-primary mt-0.5">✓</span>
                <span>Active quests and progress in one place</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-0.5">✓</span>
                <span>Points and pending claims</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-0.5">✓</span>
                <span>Sign in with your Roblox account only</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-0.5">✓</span>
                <span>Link a wallet when you’re ready to claim</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 sm:px-6 py-16 md:py-20 bg-white/[0.02]">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to start?</h2>
            <p className="text-gray-400 mb-8">Sign in with Roblox to see your quests and rewards.</p>
            <a
              href={loginUrl}
              className="inline-block px-8 py-4 bg-primary text-black font-semibold text-lg rounded-xl hover:bg-primary/90 transition"
            >
              Sign in with Roblox
            </a>
            <p className="mt-4 text-sm text-gray-500">
              Already have an account? <a href={loginUrl} className="text-primary hover:underline">Sign in</a>
            </p>
          </div>
        </section>
      </main>
    )
  }

  // Signed in: full dashboard
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <Image
          src="/BLOXBOT_Banner.png"
          alt="BLOXBOT Banner"
          width={800}
          height={200}
          className="w-full max-w-2xl mb-6 object-contain"
        />
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Image
              src="/BLOXBOT_Logo.png"
              alt="BLOXBOT Logo"
              width={48}
              height={48}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-4xl font-bold mb-2">bloxbot</h1>
              <p className="text-gray-400">Welcome, {user.username || 'Player'}</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <PointsDisplay robloxUserId={user.roblox_user_id} />
            <button
              onClick={handleLinkWallet}
              disabled={connecting}
              className="px-4 py-2 bg-primary text-black rounded-lg font-semibold hover:bg-primary/80 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {connecting
                ? 'Connecting...'
                : connected
                  ? 'Wallet Linked ✓'
                  : 'Link Solana Wallet'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Active Quests</h2>
            <QuestList robloxUserId={user.roblox_user_id} />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Pending Claims</h2>
            <ClaimsList robloxUserId={user.roblox_user_id} />
          </div>
        </div>
      </div>
    </main>
  )
}
