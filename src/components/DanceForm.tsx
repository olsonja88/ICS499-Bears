"use client"

import { useState, useEffect } from "react"
import Input from "@/components/input"
import Textarea from "@/components/textarea"
import Select from "@/components/select"
import { Button } from "@/components/button"
import DanceLayout from "@/components/dance-layout"
import { Dance } from "@/lib/types"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"

interface Category {
  id: number;
  name: string;
}

interface Country {
  id: number;
  name: string;
}

interface DanceFormProps {
  initialData?: Dance;
  mode: 'create' | 'edit';
}

export default function DanceForm({ initialData, mode }: DanceFormProps) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(true)
  const [title, setTitle] = useState(initialData?.title || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [categoryId, setCategoryId] = useState<number>(initialData?.categoryId || 0)
  const [countryId, setCountryId] = useState<number>(initialData?.countryId || 0)
  const [url, setUrl] = useState(initialData?.url || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [countries, setCountries] = useState<Country[]>([])

  // Check authorization on mount
  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      setIsAuthorized(false)
      router.push('/login')
    }
  }, [router])

  // Don't render form if not authorized
  if (!isAuthorized) {
    return null
  }

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (!response.ok) throw new Error('Failed to fetch categories')
        const data = await response.json()
        setCategories(data)
      } catch (err) {
        console.error('Error fetching categories:', err)
      }
    }

    // Fetch countries
    const fetchCountries = async () => {
      try {
        const response = await fetch('/api/countries')
        if (!response.ok) throw new Error('Failed to fetch countries')
        const data = await response.json()
        setCountries(data)
      } catch (err) {
        console.error('Error fetching countries:', err)
      }
    }

    fetchCategories()
    fetchCountries()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const endpoint = '/api/dance'
      const method = mode === 'create' ? 'POST' : 'PATCH'
      
      const body = {
        ...(mode === 'edit' && initialData?.id && { id: initialData.id }),
        title,
        description,
        categoryId,
        countryId,
        url,
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error(mode === 'create' ? 'Failed to create dance' : 'Failed to update dance')
      }

      const data = await response.json()
      console.log('Success:', data)
      
      // Check if user is admin and redirect accordingly
      const currentUser = getCurrentUser()
      if (currentUser?.isAdmin) {
        window.location.href = '/admin?tab=dances'
      } else {
        window.location.href = '/dance'
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!initialData?.id) return;
    
    const confirmed = window.confirm("Are you sure you want to delete this dance? This action cannot be undone.")
    if (!confirmed) return;

    setIsDeleting(true)
    setError("")

    try {
      const response = await fetch('/api/dance', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: initialData.id }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete dance')
      }

      // Check if user is admin and redirect accordingly
      const currentUser = getCurrentUser()
      if (currentUser?.isAdmin) {
        router.push('/admin?tab=dances')
      } else {
        router.push('/dance')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete dance')
      setIsDeleting(false)
    }
  }

  return (
    <DanceLayout backgroundImage="/placeholder.svg?height=1080&width=1920">
      <div className="pt-20 flex justify-center items-center min-h-screen">
        <div className="w-full max-w-md bg-black bg-opacity-20 backdrop-blur-md border border-white rounded-lg shadow-lg p-6 space-y-6">
          <h2 className="text-2xl font-bold text-white">
            {mode === 'create' ? 'Post a Dance' : 'Edit Dance'}
          </h2>
          {error && (
            <div className="bg-red-500 text-white p-3 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Title"
              id="title"
              placeholder="Enter dance title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              label="Description"
              id="description"
              placeholder="Enter dance description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Input
              label="Image URL"
              id="url"
              placeholder="Enter image URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Select
              label="Category"
              id="category"
              value={categoryId.toString()}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              options={[
                { value: "0", label: "Select a category" },
                ...categories.map(cat => ({
                  value: cat.id.toString(),
                  label: cat.name
                }))
              ]}
            />
            <Select
              label="Country"
              id="country"
              value={countryId.toString()}
              onChange={(e) => setCountryId(Number(e.target.value))}
              options={[
                { value: "0", label: "Select a country" },
                ...countries.map(country => ({
                  value: country.id.toString(),
                  label: country.name
                }))
              ]}
            />
            <div className="flex gap-4 justify-end">
              {mode === 'edit' && (
                <Button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-red-500 text-white hover:bg-red-600 px-6 py-2 rounded-full font-semibold transition-colors"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Dance'}
                </Button>
              )}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-full font-semibold transition-colors"
              >
                {isSubmitting 
                  ? (mode === 'create' ? 'Posting...' : 'Updating...') 
                  : (mode === 'create' ? 'Post Dance' : 'Update Dance')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DanceLayout>
  )
} 