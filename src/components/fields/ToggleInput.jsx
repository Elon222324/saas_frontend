import React from 'react'

export default function ToggleInput({ label, value, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={value ?? false}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4"
      />
      <span className="font-medium">{label}</span>
    </label>
  )
}
