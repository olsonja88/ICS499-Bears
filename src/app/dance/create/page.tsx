"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Input from "@/components/input"
import Textarea from "@/components/textarea"
import Select from "@/components/select"
import { Button } from "@/components/button"
import DanceLayout from "@/components/dance-layout"

interface Category {
  id: number;
  name: string;
}

interface Country {
  id: number;
  name: string;
}

export default function PostDanceForm() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState<number>(0)
  const [countryId, setCountryId] = useState<number>(0)
  const [url, setUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [countries, setCountries] = useState<Country[]>([])

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
          url,
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
    <DanceLayout backgroundImage="/placeholder.svg?height=1080&width=1920">
      <div className="pt-20 flex justify-center items-center min-h-screen">
        <div className="w-full max-w-md bg-black bg-opacity-20 backdrop-blur-md border border-white rounded-lg shadow-lg p-6 space-y-6">
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
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-full font-semibold transition-colors"
            >
              {isSubmitting ? 'Posting...' : 'Post Dance'}
            </Button>
          </form>
        </div>
      </div>
    </DanceLayout>
  )
}