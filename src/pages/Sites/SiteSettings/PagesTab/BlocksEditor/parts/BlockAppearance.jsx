

export default function BlockAppearance({
  schema,
  settings,
  onChange,
  fieldTypes,
  onSaveAppearance,
  uiDefaults = {},
}) {


  const renderField = (field) => {
    if (field.visible === false) return null

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
