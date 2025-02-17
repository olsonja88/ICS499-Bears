"use client"

import { useState } from "react"

interface SelectBoxProps {
  label: string
  options: string[]
  selected: string[]
  onChange: (selected: string[]) => void
}

export default function SelectBox({ label, options, selected, onChange }: SelectBoxProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOption = (option: string) => {
    const updatedSelection = selected.includes(option)
      ? selected.filter((item) => item !== option)
      : [...selected, option]
    onChange(updatedSelection)
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white">{label}</label>
      <div className="relative">
        <button
          type="button"
          className="w-full px-3 py-2 bg-black border border-white rounded-md text-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selected.length > 0 ? selected.join(", ") : "Select options"}
        </button>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-black border border-white rounded-md shadow-lg">
            {options.map((option) => (
              <div
                key={option}
                className="px-3 py-2 cursor-pointer hover:bg-gray-800"
                onClick={() => toggleOption(option)}
              >
                <input type="checkbox" checked={selected.includes(option)} onChange={() => {}} className="mr-2" />
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}