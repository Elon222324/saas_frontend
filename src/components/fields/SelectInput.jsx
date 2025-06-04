import React from 'react'

export default function SelectInput({ label, value, onChange, options = [] }) {
  return (
    <label className="block space-y-1">
      <span className="font-medium">{label}</span>
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded px-3 py-2"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  )
}
