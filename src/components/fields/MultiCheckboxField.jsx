import React from 'react'

export default function MultiCheckboxField({ value = {}, onChange, label, options = [] }) {
  const handleToggle = (key) => {
    const newValue = { ...value, [key]: !value[key] }
    onChange(newValue)
  }

  return (
    <div className="flex flex-col gap-1 text-sm">
      <div className="font-medium mb-1">{label}</div>
      {options.map((opt) => (
        <label key={opt.key} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={value[opt.key] === true || value[opt.key] === 'true'}
            onChange={() => handleToggle(opt.key)}
          />
          {opt.label || opt.key}
        </label>
      ))}
    </div>
  )
}
