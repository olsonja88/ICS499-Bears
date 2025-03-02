import type React from "react"

interface TextareaProps {
  label: string
  id: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

const Textarea: React.FC<TextareaProps> = ({ label, id, placeholder, value, onChange }) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-medium text-white">
      {label}
    </label>
    <textarea
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 bg-gray-700 border border-white rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
    />
  </div>
)

export default Textarea