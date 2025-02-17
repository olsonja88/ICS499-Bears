import type React from "react"

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export default function TextInput({ label, ...props }: TextInputProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white">{label}</label>
      <input
        {...props}
        className="w-full px-3 py-2 bg-black border border-white rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}