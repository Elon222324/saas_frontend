import { useState, useRef, useEffect } from 'react'

export default function EditableLabelTags({ value = [], labelsList, labelsMap, onSave }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(value)
  const wrapperRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
        if (JSON.stringify(selected) !== JSON.stringify(value)) {
          onSave(selected)
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [selected, value, onSave])

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    )
  }

  return (
    <div
      ref={wrapperRef}
      className="relative text-xs"
      onClick={() => setOpen(true)}
    >
      <div className="flex flex-wrap gap-1 cursor-pointer">
        {value.length
          ? value.map((lb) => {
              const l = labelsMap[lb] || {}
              return (
                <span
                  key={lb}
                  className="rounded px-1"
                  style={{
                    backgroundColor: l.bg_color || '#e5e7eb',
                    color: l.text_color || '#111827',
                  }}
                >
                  {l.name || lb}
                </span>
              )
            })
          : <span className="text-gray-400">—</span>}
      </div>

      {open && (
        <div className="absolute z-10 mt-1 w-40 max-h-40 overflow-auto rounded border bg-white p-2 shadow-lg">
          {labelsList.map((l) => (
            <label key={l.id} className="flex items-center gap-2 text-xs py-0.5">
              <input
                type="checkbox"
                checked={selected.includes(String(l.id))}
                onChange={() => toggle(String(l.id))}
              />
              <span>{l.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
