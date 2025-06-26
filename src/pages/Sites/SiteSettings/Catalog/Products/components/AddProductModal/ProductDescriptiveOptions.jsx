export default function ProductDescriptiveOptions({ groups, selectedValues, onChange, selectedOptions }) {
  return (
    <div>
      <p className="font-medium text-sm text-gray-800">2. Описательные опции (не влияют на цену)</p>
      <p className="text-xs text-gray-600 mt-1">Выберите характеристики товара. Например: \"Тесто: Тонкое\". Эти опции будут применены ко всем вариантам.</p>
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedOptions.map(opt => (
            <span key={opt} className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
              {opt}
            </span>
          ))}
        </div>
      )}
      <div className="space-y-2 mt-2">
        {groups.map(group => (
          <div key={group.id}>
            <p className="text-sm font-semibold">{group.name}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 pl-2">
              {group.values.map(value => (
                <label key={value.id} className="flex items-center gap-2 text-sm font-normal">
                  <input
                    type="checkbox"
                    checked={selectedValues.has(value.id)}
                    onChange={() => onChange(value.id)}
                  />
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
