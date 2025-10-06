import React from 'react'

export default function TextAreaInput({ label, value, onChange, placeholder, disabled, rows = 4 }) {
  return (
    <label className="block space-y-1">
      <span className="font-medium">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full border rounded px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
        rows={rows}
      />
    </label>
  )
}
