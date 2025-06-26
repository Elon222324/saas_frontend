export default function ProductExtrasSelector({
  allExtraGroups,
  selectedExtras,
  onChange,
  description,
  setDescription
}) {
  return (
    <div>
      <h4 className="mb-2 font-medium text-sm">Доступные Дополнения</h4>
      <div className="max-h-48 space-y-1 overflow-y-auto rounded border p-2">
        {allExtraGroups.length > 0 ? (
          allExtraGroups.map(group => (
            <label key={group.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedExtras.has(group.id)}
                onChange={() => onChange(group.id)}
              />
              {group.name}
            </label>
          ))
        ) : (
          <p className="text-xs text-gray-500">Группы добавок не найдены.</p>
        )}
      </div>
      <label className="mb-1 block text-sm mt-2">Краткое описание</label>
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        rows={3}
        className="mb-2 w-full rounded border px-2 py-1"
      />
    </div>
  )
}
