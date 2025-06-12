
import { fieldTypes } from '@/components/fields/fieldTypes'

export default function QuickInfoItemsEditor({
  schema,
  data,
  settings = {},
  onTextChange,
  onSaveData,
  uiDefaults = {},
}) {

  const limitedSchema = Array.isArray(schema) ? schema : []

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
    </div>
  )
}
