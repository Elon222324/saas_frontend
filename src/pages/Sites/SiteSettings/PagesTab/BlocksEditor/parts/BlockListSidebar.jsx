import { Switch } from '@/components/ui/switch'
import { Trash2, ChevronsUpDown, Info } from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

export default function BlockListSidebar({
  blocks,
  selectedId,
  setSelectedId,
  setBlocks,
  handleReorder,
  handleAddBlock,
  handleActivityChange, // 1. Принимаем новую функцию
}) {
  function onDragEnd(result) {
    const { source, destination } = result
    if (!destination || source.index === destination.index) return

    const updated = Array.from(blocks)
    const [moved] = updated.splice(source.index, 1)
    updated.splice(destination.index, 0, moved)

    const newBlocks = updated.map((blk, idx) => ({ ...blk, order: idx + 1 }))
    setBlocks(newBlocks)
    handleReorder(newBlocks)
  }

  return (
    <div className="w-1/3">
      <div className="mb-2 flex items-center text-sm text-gray-500">
        <Info size={16} className="mr-1" title="Перетащите блоки..." />
        Перетащите блоки, чтобы изменить порядок.
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="page-blocks">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`space-y-2 p-1 rounded transition-all duration-200 ${
                snapshot.isDraggingOver ? 'border-2 border-blue-300 border-dashed' : ''
              }`}
            >
              {blocks.map((block, index) => {
                const isSystem = ['header', 'footer'].includes(block.type)

                return (
                  <Draggable key={block.id} draggableId={String(block.id)} index={index}>
                    {(prov, snap) => (
                      <div
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        {...prov.dragHandleProps}
                        onClick={() => setSelectedId(block.id)}
                        className={`group flex justify-between items-center px-3 py-2 rounded-xl border transition shadow-sm cursor-pointer ${
                          selectedId === block.id
                            ? 'border-blue-600 bg-blue-100/60 shadow-md'
                            : 'border-gray-200 hover:bg-gray-100'
                        } ${snap.isDragging ? 'bg-white shadow-lg' : ''}`}
                      >
                        <div className="flex items-center gap-2">
                          {/* 2. Используем is_active для отображения статуса */}
                          <div
                            className={`w-2 h-2 rounded-full ${
                              block.active ? 'bg-green-500' : 'bg-gray-400'
                            }`}
                          />
                          <div className="text-sm">
                            <div className="font-semibold flex items-center gap-2">
                              {block.label || block.type}
                              {isSystem && (
                                <span className="text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded">
                                  Fixed
                                </span>
                              )}
                            </div>
                            <div className="text-gray-500 text-xs">
                              Тип: {block.type} | Порядок: {block.order}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                          <ChevronsUpDown size={16} className="text-gray-400" />
                          <Switch
                            // 2. Используем is_active для состояния переключателя
                            checked={block.active}
                            // 3. Вызываем новую функцию handleActivityChange
                            onCheckedChange={val => handleActivityChange(block.id, block.real_id, val)}
                          />
                          {!isSystem && (
                            <button
                              onClick={() => {
                                setBlocks(bs => bs.filter(b => b.id !== block.id))
                                if (selectedId === block.id) setSelectedId(null)
                              }}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                )
              })}
              <div
                onClick={handleAddBlock}
                className="flex justify-center items-center px-3 py-2 rounded-md border border-blue-300 bg-blue-100/50 text-blue-700 hover:bg-blue-100 cursor-pointer"
              >
                Добавить новый блок
              </div>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}