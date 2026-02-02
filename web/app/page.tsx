'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import axios from 'axios'
import Cookies from 'js-cookie'
import QuestList from './components/QuestList'
import PointsDisplay from './components/PointsDisplay'
import ClaimsList from './components/ClaimsList'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'

export default function Home() {
  const router = useRouter()
  const { publicKey, connected } = useWallet()
  const { setVisible } = useWalletModal()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = Cookies.get('auth_token')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      const response = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUser(response.data.user)
    } catch (error) {
      Cookies.remove('auth_token')
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

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
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Quest Layer</h1>
            <p className="text-gray-400">Welcome, {user?.username || 'Player'}</p>
          </div>
          <div className="flex gap-4 items-center">
            <PointsDisplay robloxUserId={user?.roblox_user_id} />
            <button
              onClick={handleLinkWallet}
              className="px-4 py-2 bg-primary text-black rounded-lg font-semibold hover:bg-primary/80"
            >
              {connected ? 'Wallet Linked ✓' : 'Link Solana Wallet'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Active Quests</h2>
            <QuestList robloxUserId={user?.roblox_user_id} />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Pending Claims</h2>
            <ClaimsList robloxUserId={user?.roblox_user_id} />
          </div>
        </div>
      </div>
    </main>
  )
}
