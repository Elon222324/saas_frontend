import { useState } from 'react'
import ProductRow from './ProductRow'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import AddCategoryModal from '../AddCategoryModal'
import { useCategoryCrud } from '../CategoryList/useCategoryCrud'
import { useParams } from 'react-router-dom'

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
  categoryMap,
  onReorder,
  onToggleStatus,
  isFilteringByLabel,
}) {
  const hasCategories = Object.keys(categoryMap).length > 0
  const { domain } = useParams()
  const siteName = `${domain}_app`

  const { add: addCat } = useCategoryCrud(siteName)
  const [showAddCat, setShowAddCat] = useState(false)

  const renderBody = () => {
    if (isFetching) {
      return (
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="animate-pulse border-t">
              <td className="px-2 py-3" colSpan={11}>
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
            <td colSpan={11} className="py-6 text-center text-sm text-gray-500">
              {isFilteringByLabel ? (
                'Нет товаров, соответствующих выбранной метке.'
              ) : !hasCategories ? (
                <>
                  Сначала создайте категории товаров (например: Пицца, Напитки)
                  <div className="mt-2">
                    <button
                      onClick={() => setShowAddCat(true)}
                      className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                    >
                      Добавить категорию
                    </button>
                  </div>
                </>
              ) : (
                <>
                  Вы ещё не добавили ни одного товара
                  <div className="mt-2">
                    <button
                      onClick={onAdd}
                      className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                    >
                      Добавить первый товар
                    </button>
                  </div>
                </>
              )}
            </td>
          </tr>
        </tbody>
      )
    }

    return (
      <DragDropContext
        onDragEnd={({ source, destination }) => {
          if (!destination || source.index === destination.index) return
          onReorder(source.index, destination.index)
        }}
      >
        <Droppable droppableId="products">
          {(prov) => (
            <tbody ref={prov.innerRef} {...prov.droppableProps}>
              {pageItems.map((p, index) => (
                <Draggable key={p.id} draggableId={String(p.id)} index={index}>
                  {(prov2) => (
                    <ProductRow
                      innerRef={prov2.innerRef}
                      draggableProps={prov2.draggableProps}
                      dragHandleProps={prov2.dragHandleProps}
                      product={p}
                      checked={selected.has(p.id)}
                      onCheck={toggleSelect}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      categoryName={categoryMap[p.category_id]}
                      onToggleStatus={onToggleStatus}
                    />
                  )}
                </Draggable>
              ))}
              {prov.placeholder}
            </tbody>
          )}
        </Droppable>
      </DragDropContext>
    )
  }

  return (
    <>
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
            <th className="w-4 px-2 py-1" />
            <th className="w-12 px-2 py-1">Фото</th>
            <th className="px-2 py-1">Название / SKU</th>
            <th className="px-2 py-1">Активен</th>
            <th className="px-2 py-1">В наличии</th>
            <th className="px-2 py-1">Цена</th>
            <th className="px-2 py-1">Метки</th>
            <th className="px-2 py-1">Категория</th>
            <th className="px-2 py-1">Вес</th>
            <th className="px-2 py-1" />
          </tr>
        </thead>
        {renderBody()}
      </table>

      <AddCategoryModal
        open={showAddCat}
        onClose={() => setShowAddCat(false)}
        onSave={async (payload) => {
          await addCat.mutateAsync(payload)
          setShowAddCat(false)
        }}
        parents={[]} // если в будущем нужны иерархии — прокинь сюда дерево
      />
    </>
  )
}
