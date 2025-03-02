"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import DanceForm from "@/components/DanceForm"
import { Dance } from "@/lib/types"
import { getCurrentUser } from "@/lib/auth"

export default function EditDancePage() {
  const params = useParams()
  const router = useRouter()
  const [dance, setDance] = useState<Dance | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDance = async () => {
      try {
        const response = await fetch(`/api/dance/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch dance')
        }
        const data = await response.json()
        
        // Check authorization
        const currentUser = getCurrentUser()
        if (!currentUser) {
          router.push('/login')
          return
        }

        if (!currentUser.isAdmin && currentUser.id !== data.createdBy) {
          router.push('/dance')
          return
        }

        setDance(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dance')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchDance()
    }
  }, [params.id, router])

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <p className="text-white">Loading...</p>
    </div>
  }

  if (error || !dance) {
    return <div className="flex justify-center items-center min-h-screen">
      <p className="text-white">{error || 'Dance not found'}</p>
    </div>
  }

  return <DanceForm mode="edit" initialData={dance} />
} 