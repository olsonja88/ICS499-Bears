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
  const [category, setCategory] = useState("")
  const [country, setCountry] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log({ title, description, category, country })
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 p-4">
      <div className="w-full max-w-md bg-gray-800 border border-white rounded-lg shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">Post a Dance</h2>
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
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
              { value: "ballet", label: "Ballet" },
              { value: "contemporary", label: "Contemporary" },
              { value: "hiphop", label: "Hip Hop" },
              { value: "jazz", label: "Jazz" },
              { value: "tap", label: "Tap" },
            ]}
          />
          <Select
            label="Country"
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            options={[
              { value: "usa", label: "United States" },
              { value: "uk", label: "United Kingdom" },
              { value: "france", label: "France" },
              { value: "germany", label: "Germany" },
              { value: "japan", label: "Japan" },
            ]}
          />
          <Button onClick={handleSubmit}>Post Dance</Button>
        </form>
      </div>
    </div>
  )
}