import { useEffect, useState } from 'react'

export default function BlockAppearance({
  schema,
  settings,
  onChange,
  fieldTypes,
  onSaveAppearance,
  showButton,
  resetButton,
  uiDefaults = {},
}) {
  const [internalVisible, setInternalVisible] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (resetButton) {
      setInternalVisible(false)
      return
    }

    if (showButton) setInternalVisible(true)
    if (!settings?.custom_appearance) setInternalVisible(false)
  }, [showButton, settings?.custom_appearance, resetButton])

  const renderField = (field) => {
    if (field.visible_if) {
      const [[depKey, depVal]] = Object.entries(field.visible_if)
      if (settings?.[depKey] !== depVal) return null
    }

    const FieldComponent = fieldTypes[field.type] || fieldTypes.text
    const value =
      settings?.[field.key] !== undefined
        ? settings[field.key]
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

  const handleClick = async () => {
    setIsSaving(true)
    await onSaveAppearance?.(settings)
    setIsSaving(false)
  }

  return (
    <div className="pt-4 border-t mt-6 space-y-4">
      {schema.map(field => field.editable && renderField(field))}

      {internalVisible && (
        <div>
          <button
            onClick={handleClick}
            disabled={isSaving}
            className={`bg-blue-600 text-white px-4 py-2 rounded transition text-sm ${
              isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            💾 Сохранить внешний вид блока
          </button>
        </div>
      )}
    </div>
  )
}
