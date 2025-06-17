import ProductRow from './ProductRow'

export default function ProductTable({
  isFetching,
  filtered,
  pageItems,
  selected,
  toggleSelect,
  toggleSelectAll,
  onEdit,
  onDelete,
  onAdd,
}) {
  const renderBody = () => {
    if (isFetching) {
      return (
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="animate-pulse border-t">
              <td className="px-2 py-3" colSpan={5}>
                <div className="h-4 w-full rounded bg-gray-200" />
              </td>
            </tr>
          ))}
        </tbody>
      )
    }

    if (!filtered.length) {
      return (
        <tbody>
          <tr>
            <td colSpan={5} className="py-6 text-center text-sm text-gray-500">
              Вы ещё не добавили ни одного товара
              <div className="mt-2">
                <button
                  onClick={onAdd}
                  className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                >
                  Добавить первый товар
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      )
    }

    return (
      <tbody>
        {pageItems.map((p) => (
          <ProductRow
            key={p.id}
            product={p}
            checked={selected.has(p.id)}
            onCheck={toggleSelect}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </tbody>
    )
  }

  return (
    <table className="w-full border text-left text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="w-8 px-2 py-1">
            <input
              type="checkbox"
              onChange={toggleSelectAll}
              checked={pageItems.length > 0 && pageItems.every((p) => selected.has(p.id))}
              className="focus:ring-blue-500"
            />
          </th>
          <th className="w-12 px-2 py-1">Фото</th>
          <th className="px-2 py-1">Название</th>
          <th className="px-2 py-1">Цена</th>
          <th className="px-2 py-1" />
        </tr>
      </thead>
      {renderBody()}
    </table>
  )
}
