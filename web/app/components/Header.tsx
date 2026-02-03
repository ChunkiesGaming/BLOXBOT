'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Cookies from 'js-cookie'

const loginBase = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:4000'
const loginUrl = `${loginBase}/api/v1/auth/roblox/login`

export default function Header() {
  const [hasToken, setHasToken] = useState(false)

  useEffect(() => {
    setHasToken(!!Cookies.get('auth_token'))
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src="/BLOXBOT_Logo.png"
            alt="bloxbot"
            width={36}
            height={36}
            className="rounded-lg"
          />
          <span className="font-bold text-lg hidden sm:inline">bloxbot</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-4">
          <Link
            href="/"
            className="px-3 py-2 text-sm text-gray-400 hover:text-white transition rounded-md hover:bg-white/5"
          >
            Home
          </Link>
          <Link
            href="/how-it-works"
            className="px-3 py-2 text-sm text-gray-400 hover:text-white transition rounded-md hover:bg-white/5"
          >
            How it works
          </Link>
          <Link
            href="/about"
            className="px-3 py-2 text-sm text-gray-400 hover:text-white transition rounded-md hover:bg-white/5"
          >
            About
          </Link>
          <Link
            href="/privacy"
            className="px-3 py-2 text-sm text-gray-400 hover:text-white transition rounded-md hover:bg-white/5"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="px-3 py-2 text-sm text-gray-400 hover:text-white transition rounded-md hover:bg-white/5"
          >
            Terms
          </Link>
        </nav>

        <div className="shrink-0">
          {hasToken ? (
            <Link
              href="/"
              className="inline-block px-4 py-2 text-sm font-medium text-primary border border-primary/40 rounded-lg hover:bg-primary/10 transition"
            >
              Dashboard
            </Link>
          ) : (
            <a
              href={loginUrl}
              className="inline-block px-4 py-2 text-sm font-semibold bg-primary text-black rounded-lg hover:bg-primary/90 transition"
            >
              Sign in with Roblox
            </a>
          )}
        </div>
      </div>
    </header>
  )
}
