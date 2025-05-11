import React from 'react'

export default function DurationInput({
  label,
  value,
  onChange,
  min = 0,
  max = 2,
  step = 0.1,
}) {
  const floatValue = parseFloat(value)

  return (
    <label className="block space-y-1">
      <span className="font-medium">{label}</span>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={floatValue}
          onChange={(e) => onChange(`${e.target.value}s`)}
          className="flex-1"
        />
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={floatValue}
          onChange={(e) => onChange(`${e.target.value}s`)}
          className="w-16 border rounded px-2 py-1 text-center"
        />
        <span className="text-sm text-gray-500">сек</span>
      </div>
    </label>
  )
}
