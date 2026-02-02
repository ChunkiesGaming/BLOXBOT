'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'

export default function PointsDisplay({ robloxUserId }: { robloxUserId: string }) {
  const [points, setPoints] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!robloxUserId) return
    fetchPoints()
    const interval = setInterval(fetchPoints, 5000) // Refresh every 5s
    return () => clearInterval(interval)
  }, [robloxUserId])

  const fetchPoints = async () => {
    try {
      const response = await axios.get(`${API_URL}/quests/points/${robloxUserId}`)
      setPoints(response.data.points || 0)
    } catch (error) {
      console.error('Error fetching points:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="px-6 py-3 bg-gray-800 rounded-lg">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="px-6 py-3 bg-gray-800 rounded-lg border border-primary/20">
      <div className="text-sm text-gray-400 mb-1">Total Points</div>
      <div className="text-2xl font-bold text-primary">{points.toLocaleString()}</div>
    </div>
  )
}
