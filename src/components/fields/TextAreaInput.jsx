import React from 'react'

export default function TextAreaInput({ label, value, onChange }) {
  return (
    <label className="block space-y-1">
      <span className="font-medium">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded px-3 py-2"
        rows={4}
      />
    </label>
  )
}
