import type React from "react"

interface InputProps {
  label: string
  id: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Input: React.FC<InputProps> = ({ label, id, placeholder, value, onChange }) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-medium text-white">
      {label}
    </label>
    <input
      type="text"
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 bg-gray-700 border border-white rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
)

export default Input