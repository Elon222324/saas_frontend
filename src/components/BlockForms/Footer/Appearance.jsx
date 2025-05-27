export default function FooterAppearance({
  schema,
  settings,
  onChange,
  fieldTypes,
  onSaveAppearance,
  showButton,
}) {
  const renderField = (field) => {
    if (field.key !== 'custom_appearance' && field.visible_if) {
      const [[depKey, depVal]] = Object.entries(field.visible_if)
      if (settings?.[depKey] !== depVal) return null
    }

    const FieldComponent = fieldTypes[field.type] || fieldTypes.text
    const value = settings?.[field.key]

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

  const isCustom = settings?.custom_appearance === true

  return (
    <div className="pt-4 border-t mt-6 space-y-4">
      {/* Сначала рендерим custom_appearance */}
      {schema
        .filter(field => field.key === 'custom_appearance')
        .map(renderField)}

      {/* Потом все остальные */}
      {schema
        .filter(field => field.editable && field.key !== 'custom_appearance')
        .map(renderField)}

      {isCustom && showButton && (
        <div>
          <button
            onClick={() => onSaveAppearance?.(settings)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
          >
            💾 Сохранить внешний вид блока
          </button>
        </div>
      )}
    </div>
  )
}
