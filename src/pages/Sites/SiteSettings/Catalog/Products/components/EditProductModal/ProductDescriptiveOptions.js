export default function ProductDescriptiveOptions({ groups, selected, onChange, titlePrefix = '' }) {
  if (!groups.length) return null
  return (
    <div className="space-y-4 p-3 bg-gray-50 rounded border">
      {titlePrefix && <p className="font-medium text-sm text-gray-800">{titlePrefix}Описательные опции (не влияют на цену)</p>}
      {!titlePrefix && <p className="font-medium text-sm text-gray-800">Описательные опции (не влияют на цену)</p>}
      <p className="text-xs text-gray-600 mt-1">Выберите характеристики товара. Они применятся ко всем вариантам.</p>
      <div className="space-y-2 mt-2">
        {groups.map(group => (
          <div key={group.id}>
            <p className="text-sm font-semibold">{group.name}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 pl-2">
              {group.values.map(value => (
                <label key={value.id} className="flex items-center gap-2 text-sm font-normal">
                  <input type="checkbox" checked={selected.has(value.id)} onChange={() => onChange(value.id)} />
                  {value.value}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
