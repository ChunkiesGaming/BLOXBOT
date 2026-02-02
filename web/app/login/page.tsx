'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if already logged in
    const token = Cookies.get('auth_token')
    if (token) {
      router.push('/')
      return
    }
  }, [router])

  const handleLogin = () => {
    // Redirect to backend OAuth endpoint
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3000'}/api/v1/auth/roblox/login`
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">Quest Layer</h1>
        <p className="text-gray-400 mb-8">Complete quests in Roblox and earn rewards</p>
        <button
          onClick={handleLogin}
          className="px-8 py-4 bg-primary text-black rounded-lg font-semibold text-lg hover:bg-primary/80 transition"
        >
          Login with Roblox
        </button>
      </div>
    </main>
  )
}
