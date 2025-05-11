import React from 'react'

export default function ImageInput({ label, value, onChange }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      onChange(e.target.result) // base64 или url
    }
    reader.readAsDataURL(file)
  }

  return (
    <label className="block space-y-1">
      <span className="font-medium">{label}</span>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {value && (
        <img
          src={value}
          alt="preview"
          className="mt-2 max-h-40 rounded border"
        />
      )}
    </label>
  )
}
