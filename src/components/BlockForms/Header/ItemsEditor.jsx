// src/components/BlockForms/HeaderItemsEditor.jsx

import { useEffect, useState } from 'react'

export default function HeaderItemsEditor({
  schema,
  data,
  onChange,
  fieldTypes,
  onSaveData,
  showButton,
  resetButton,
  uiDefaults = {},
}) {
  const [internalVisible, setInternalVisible] = useState(false)

  useEffect(() => {
    if (resetButton) {
      setInternalVisible(false)
      return
    }

    if (showButton) setInternalVisible(true)
  }, [showButton, resetButton])

  const renderField = (field) => {
    const FieldComponent = fieldTypes[field.type] || fieldTypes.text
    const value =
      data?.[field.key] !== undefined
        ? data[field.key]
        : uiDefaults?.[field.key] ?? field.default ?? ''

    return (
      <FieldComponent
        {...field}
        key={field.key}
        value={value}
        onChange={(val) => onChange(field.key, val)}
        label={field.label}
      />
    )
  }

  return (
    <div className="pt-4 border-t mt-6 space-y-4">
      {schema.map(field => field.editable && renderField(field))}

      {internalVisible && (
        <div>
          <button
            onClick={() => onSaveData?.(data)}
            className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition text-sm"
          >
            💾 Сохранить содержимое блока
          </button>
        </div>
      )}
    </div>
  )
}
