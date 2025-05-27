// components/fields/CheckboxField.jsx
export default function CheckboxField({ value, onChange, label }) {
    console.log(`[CheckboxField] ${label}:`, value)
  return (
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={value === true || value === 'true'}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  )
}
