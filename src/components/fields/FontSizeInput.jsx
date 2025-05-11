import React from 'react'

export default function FontSizeInput({ label, value, onChange, min = 12, max = 48, step = 1 }) {
  return (
    <label className="block space-y-1">
      <span className="font-medium">{label}</span>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="flex-1"
        />
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-16 border rounded px-2 py-1 text-center"
        />
        <span className="text-sm text-gray-500">px</span>
      </div>
    </label>
  )
}
