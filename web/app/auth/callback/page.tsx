'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return

    try {
      const params = new URLSearchParams(window.location.search)
      const token = params.get('token')
      const error = params.get('error') ?? params.get('message')

      if (error) {
        setStatus('error')
        const msg = decodeURIComponent(error)
        try {
          alert('Authentication error: ' + msg)
        } catch {
          console.error('Auth error:', msg)
        }
        router.replace('/')
        return
      }

      if (token) {
        try {
          Cookies.set('auth_token', token, { expires: 7, sameSite: 'lax' })
        } catch (e) {
          console.error('Cookie set failed:', e)
        }
        setStatus('ok')
        router.replace('/')
      } else {
        setStatus('error')
        router.replace('/')
      }
    } catch (e) {
      setStatus('error')
      console.error('Auth callback error:', e)
      router.replace('/')
    }
  }, [mounted, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl">
        {status === 'loading' && 'Completing login...'}
        {status === 'ok' && 'Redirecting...'}
        {status === 'error' && 'Redirecting to app...'}
      </div>
    </div>
  )
}
