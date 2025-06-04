import React, { useState, useEffect } from 'react'

export default function ColorInput({ label, value = '#000000', onChange }) {
  const [inputValue, setInputValue] = useState(value)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleChange = (val) => {
    const hex = val.trim()
    if (/^#([0-9A-F]{6})$/i.test(hex)) {
      onChange(hex)
    }
    setInputValue(hex)
  }

  return (
    <label className="flex items-center gap-2">
      <span className="font-medium">{label}</span>
      <input
        type="color"
        value={/^#([0-9A-F]{6})$/i.test(inputValue) ? inputValue : '#000000'}
        onChange={(e) => handleChange(e.target.value)}
        className="w-10 h-8 p-0 border rounded"
      />
      <input
        type="text"
        value={inputValue}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={(e) => {
          const hex = e.target.value.trim()
          if (!/^#([0-9A-F]{6})$/i.test(hex)) setInputValue(value)
        }}
        className="w-20 border rounded px-2 py-1 text-sm"
        placeholder="#000000"
      />
    </label>
  )
}
