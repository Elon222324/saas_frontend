export default function ProductExtrasSelector({ allExtraGroups, selectedExtras, onToggle }) {
  return (
    <div>
      <h4 className="mb-2 font-medium text-sm">Доступные Дополнения</h4>
      <div className="max-h-48 space-y-1 overflow-y-auto rounded border p-2">
        {allExtraGroups.length > 0 ? allExtraGroups.map(group => (
          <label key={group.id} className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={selectedExtras.has(group.id)} onChange={() => onToggle(group.id)} />
            {group.name}
          </label>
        )) : <p className="text-xs text-gray-500">Группы добавок не найдены.</p>}
      </div>
    </div>
  )
}
