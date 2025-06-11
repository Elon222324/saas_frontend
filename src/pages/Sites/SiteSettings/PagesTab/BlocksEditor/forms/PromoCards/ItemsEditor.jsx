import { useEffect, useState } from 'react'
import { fieldTypes } from '@/components/fields/fieldTypes'

export default function PromoItemsEditor({
  schema,
  data,
  settings = {},
  onTextChange,
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

    if (showButton) {
      setInternalVisible(true)
    }
  }, [showButton, resetButton])

  const count = settings?.card_count || 6
  const limitedSchema = Array.isArray(schema) ? schema.slice(0, count * 3) : []

  const renderField = (field) => {
    if (!field.editable) return null

    const fieldKey = field.key
    const textVal = data?.[fieldKey] ?? uiDefaults?.[fieldKey] ?? field.default ?? ''

    const FieldComponent = fieldTypes[field.type] || fieldTypes.text
    return (
      <FieldComponent
        {...field}
        key={fieldKey}
        value={textVal}
        onChange={(val) => onTextChange(fieldKey, val)}
        label={field.label}
      />
    )
  }

  return (
    <div className="pt-4 border-t mt-6 space-y-4 relative z-0">
      {limitedSchema.map(renderField)}

      {internalVisible && (
        <div>
          <button
            onClick={onSaveData}
            className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition text-sm"
          >
            💾 Сохранить содержимое блока
          </button>
        </div>
      )}
    </div>
  )
}
