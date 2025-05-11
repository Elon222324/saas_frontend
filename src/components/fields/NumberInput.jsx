import React from 'react'

export default function NumberInput({ label, value, onChange, min, max, step = 1 }) {
  return (
    <label className="block space-y-1">
      <span className="font-medium">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full border rounded px-3 py-2"
      />
    </label>
  )
}
