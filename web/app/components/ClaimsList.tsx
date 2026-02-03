'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'

interface Claim {
  claim_id: string
  reward_type: string
  reward_amount: number
  status: string
  created_at: string
  quest_name: string
  quest_description: string
}

export default function ClaimsList({ robloxUserId }: { robloxUserId: string }) {
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!robloxUserId) return
    fetchClaims()
    const interval = setInterval(fetchClaims, 10000) // Refresh every 10s
    return () => clearInterval(interval)
  }, [robloxUserId])

  const fetchClaims = async () => {
    try {
      const token = Cookies.get('auth_token')
      const response = await axios.get(`${API_URL}/claims/pending/${robloxUserId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setClaims(response.data.claims || [])
    } catch (error) {
      console.error('Error fetching claims:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClaim = async (claimId: string) => {
    try {
      const token = Cookies.get('auth_token')
      await axios.post(
        `${API_URL}/claims/claim/${claimId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('Reward claimed! Points are already in your account.')
      fetchClaims()
    } catch (error: any) {
      alert('Failed to claim: ' + (error.response?.data?.error || error.message))
    }
  }

  if (loading) {
    return <div className="text-gray-400">Loading claims...</div>
  }

  if (claims.length === 0) {
    return <div className="text-gray-400">No pending claims</div>
  }

  return (
    <div className="space-y-4">
      {claims.map((claim) => (
        <div
          key={claim.claim_id}
          className="p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold">{claim.quest_name}</h3>
              <p className="text-sm text-gray-400">{claim.quest_description}</p>
            </div>
            <div className="text-right">
              <div className="text-yellow-400 font-bold">
                +{claim.reward_amount} {claim.reward_type}
              </div>
            </div>
          </div>

          <button
            onClick={() => handleClaim(claim.claim_id)}
            className="mt-3 w-full px-4 py-2 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition"
          >
            Claim Reward
          </button>
        </div>
      ))}
    </div>
  )
}
