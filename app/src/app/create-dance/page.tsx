"use client"

import type React from "react"
import { useState } from "react"
import TextInput from "@/components/text-input"
import Textarea from "@/components/textarea"
import SelectBox from "@/components/select-box"
import { Button } from "@/components/button"

const categories = ["Technology", "Science", "Arts", "Sports", "Business"]
const countries = ["USA", "UK", "Canada", "Australia", "Germany", "France", "Japan"]

export default function Form() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [link, setLink] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted", { title, description, selectedCategories, selectedCountries, link })
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl space-y-6 bg-gray-900 p-8 rounded-lg border border-gray-700"
      >
        <TextInput label="Title" placeholder="Enter title" value={title} onChange={(e) => setTitle(e.target.value)} />

        <Textarea
          label="Description"
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <SelectBox
          label="Categories"
          options={categories}
          selected={selectedCategories}
          onChange={setSelectedCategories}
        />

        <SelectBox label="Countries" options={countries} selected={selectedCountries} onChange={setSelectedCountries} />

        <TextInput label="Link" placeholder="Enter link" value={link} onChange={(e) => setLink(e.target.value)} />

        <div className="flex space-x-4">
          <Button type="submit" className="flex-1">
            Submit
          </Button>
          <Button type="button" variant="secondary" className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}