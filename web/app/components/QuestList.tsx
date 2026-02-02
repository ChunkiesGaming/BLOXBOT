'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'

interface Quest {
  quest_id: string
  name: string
  description: string
  quest_type: string
  target_value: number
  reward_points: number
  current_value: number
  completed: boolean
  completed_at: string | null
}

export default function QuestList({ robloxUserId }: { robloxUserId: string }) {
  const [quests, setQuests] = useState<Quest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!robloxUserId) return
    fetchQuests()
    const interval = setInterval(fetchQuests, 10000) // Refresh every 10s
    return () => clearInterval(interval)
  }, [robloxUserId])

  const fetchQuests = async () => {
    try {
      const response = await axios.get(`${API_URL}/quests/user/${robloxUserId}`)
      setQuests(response.data.quests || [])
    } catch (error) {
      console.error('Error fetching quests:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-gray-400">Loading quests...</div>
  }

  if (quests.length === 0) {
    return <div className="text-gray-400">No active quests available</div>
  }

  return (
    <div className="space-y-4">
      {quests.map((quest) => {
        const progress = Math.min((quest.current_value / quest.target_value) * 100, 100)
        const isCompleted = quest.completed

        return (
          <div
            key={quest.quest_id}
            className={`p-4 rounded-lg border ${
              isCompleted
                ? 'border-green-500 bg-green-500/10'
                : 'border-gray-700 bg-gray-800/50'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">{quest.name}</h3>
                <p className="text-sm text-gray-400">{quest.description}</p>
              </div>
              <div className="text-right">
                <div className="text-primary font-bold">+{quest.reward_points} pts</div>
                {isCompleted && (
                  <div className="text-xs text-green-400 mt-1">✓ Completed</div>
                )}
              </div>
            </div>

            <div className="mt-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">
                  {quest.current_value} / {quest.target_value}
                </span>
                <span className="text-gray-400">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    isCompleted ? 'bg-green-500' : 'bg-primary'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
