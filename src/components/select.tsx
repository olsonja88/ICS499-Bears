import type React from "react"

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  label: string
  id: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: SelectOption[]
}

const Select: React.FC<SelectProps> = ({ label, id, value, onChange, options }) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-medium text-white">
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 bg-gray-700 border border-white rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Select an option</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
)

export default Select