import { useEffect, useRef, useState } from 'react'

export default function NavigationAppearance({
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

  return (
    <div className="pt-4 border-t mt-6 space-y-4">
      {schema.map(field => field.editable && renderField(field))}
    </div>
  )
}