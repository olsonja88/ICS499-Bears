"use client"

import type React from "react"
import { useState } from "react"
import Input from "@/components/input"
import Textarea from "@/components/textarea"
import Select from "@/components/select"
import { Button } from "@/components/button"

export default function PostDanceForm() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState<number>(0)
  const [countryId, setCountryId] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch('/api/dance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          categoryId,
          countryId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create dance')
      }

      const data = await response.json()
      console.log('Success:', data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 p-4">
      <div className="w-full max-w-md bg-gray-800 border border-white rounded-lg shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">Post a Dance</h2>
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
          <Select
            label="Category"
            id="category"
            value={categoryId.toString()}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            options={[
              { value: "1", label: "Ballet" },
              { value: "2", label: "Hip-Hop" },
              { value: "3", label: "Salsa" },
              { value: "4", label: "Tango" },
              { value: "5", label: "Jazz" },
              { value: "6", label: "Contemporary" },
            ]}
          />
          <Select
            label="Country"
            id="country"
            value={countryId.toString()}
            onChange={(e) => setCountryId(Number(e.target.value))}
            options={[
              { value: "1", label: "United States" },
              { value: "2", label: "United Kingdom" },
              { value: "3", label: "France" },
              { value: "4", label: "Germany" },
              { value: "5", label: "Spain" },
            ]}
          />
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Posting...' : 'Post Dance'}
          </Button>
        </form>
      </div>
    </div>
  )
}