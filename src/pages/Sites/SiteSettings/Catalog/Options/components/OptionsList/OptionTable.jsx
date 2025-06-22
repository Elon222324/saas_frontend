import OptionRow from './OptionRow'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

export default function OptionTable({
  isFetching,
  filtered,
  pageItems,
  selected,
  toggleSelect,
  toggleSelectAll,
  onEdit,
  onDelete,
  onAddValue,
  onEditValue,
  onDeleteValue,
  onReorder,
}) {
  const renderBody = () => {
    if (isFetching) {
      return (
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="animate-pulse border-t">
              <td className="px-2 py-3" colSpan={4}>
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
            <td colSpan={4} className="py-6 text-center text-sm text-gray-500">
              Вы ещё не добавили ни одной группы опций
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
        <Droppable droppableId="options">
          {(prov) => (
            <tbody ref={prov.innerRef} {...prov.droppableProps}>
              {pageItems.map((g, index) => (
                <Draggable key={g.id} draggableId={String(g.id)} index={index}>
                  {(prov2) => (
                    <OptionRow
                      innerRef={prov2.innerRef}
                      draggableProps={prov2.draggableProps}
                      dragHandleProps={prov2.dragHandleProps}
                      group={g}
                      checked={selected.has(g.id)}
                      onCheck={toggleSelect}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onAddValue={onAddValue}
                      onEditValue={onEditValue}
                      onDeleteValue={onDeleteValue}
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
          <th className="px-2 py-1">Название</th>
          <th className="px-2 py-1">Slug</th>
          <th className="px-2 py-1" />
        </tr>
      </thead>
      {renderBody()}
    </table>
  )
}
