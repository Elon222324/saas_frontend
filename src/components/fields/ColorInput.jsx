import React from 'react'

export default function ColorInput({ label, value = '#000000', onChange }) {
  const safeValue = /^#([0-9A-F]{6})$/i.test(value) ? value : '#000000'

  return (
    <label className="flex items-center gap-2">
      <span className="font-medium">{label}</span>
      <input
        type="color"
        value={safeValue}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-8 p-0 border rounded"
      />
    </label>
  )
}
