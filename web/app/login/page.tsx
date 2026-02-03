'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    // No login gate: send everyone to the app. Sign-in is a button on the home page.
    router.replace('/')
  }, [router])

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-gray-400">Redirecting to app...</div>
    </main>
  )
}
