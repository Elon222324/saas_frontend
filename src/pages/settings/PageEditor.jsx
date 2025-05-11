// src/pages/settings/PageEditor.jsx
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Switch } from '@/components/ui/switch'
import { Trash2, ChevronsUpDown, Pin, Info } from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import BlockDetails from '@/components/BlockDetails'

export default function PageEditor() {
  const { domain, slug } = useParams()
  const [blocks, setBlocks] = useState([])
  const [blockDataMap, setBlockDataMap] = useState({})
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(true)
  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    fetch(`${API_URL}/schema/site-settings`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        Accept: 'application/json',
      },
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        // 1. Метаданные блоков для текущей страницы
        const pageBlocks = data.blocks?.[slug] || []
        const sorted = [...pageBlocks].sort((a, b) => a.order - b.order)
        setBlocks(sorted)
        setSelectedId(sorted[0]?.id || null)

        // 2. Данные всех блоков
        setBlockDataMap(data.block_data || {})
      })
      .catch(err => console.error('Ошибка загрузки блоков:', err))
      .finally(() => setLoading(false))
  }, [slug])

  // Сохранение конкретного блока
  const handleSave = async (blockId, newData) => {
    try {
      const res = await fetch(
        `${API_URL}/site-api/site-settings/blocks/${slug}/${blockId}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(newData),
        }
      )
      if (!res.ok) throw new Error('Ошибка сохранения')
      // Обновляем локально
      setBlockDataMap(prev => ({ ...prev, [blockId]: newData }))
      alert('Сохранено!')
    } catch (err) {
      console.error(err)
      alert('Не удалось сохранить данные')
    }
  }

  function onDragEnd(result) {
    const { source, destination } = result
    if (!destination || source.index === destination.index) return

    const dragged = blocks[source.index]
    if (['header', 'footer'].includes(dragged.type)) return
    const target = blocks[destination.index]
    if (['header', 'footer'].includes(target.type)) return

    const updated = Array.from(blocks)
    updated.splice(source.index, 1)
    updated.splice(destination.index, 0, dragged)
    setBlocks(updated.map((blk, idx) => ({ ...blk, order: idx + 1 })))
  }

  const handleAddBlock = () => {
    alert('Добавление нового блока')
  }

  if (loading) return <div className="p-6">Загрузка...</div>

  const selectedMeta = blocks.find(b => b.id === selectedId)
  const selectedData = selectedMeta ? blockDataMap[selectedMeta.id] : null

  return (
    <div className="p-6 space-y-4">
      {/* Заголовок и назад */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Редактирование: {slug}</h1>
        <Link to={`/settings/${domain}/pages`} className="text-blue-600 hover:underline text-sm">
          ← Назад к списку
        </Link>
      </div>

      <div className="flex gap-6">
        {/* Левая: драг-н-дроп */}
        <div className="w-1/3">
          <div className="mb-2 flex items-center text-sm text-gray-500">
            <Info
              size={16}
              className="mr-1 cursor-pointer"
              title="Перетащите блоки, чтобы изменить порядок. Шапка и подвал закреплены."
            />
            Перетащите блоки, чтобы изменить порядок. Шапка и подвал закреплены.
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="page-blocks">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`space-y-2 p-1 rounded ${
                    snapshot.isDraggingOver ? 'border-2 border-blue-300 border-dashed' : ''
                  }`}
                >
                  {blocks.map((block, index) => {
                    const isFixed = ['header', 'footer'].includes(block.type)
                    return (
                      <Draggable
                        key={block.id}
                        draggableId={String(block.id)}
                        index={index}
                        isDragDisabled={isFixed}
                      >
                        {(prov, snap) => (
                          <div
                            ref={prov.innerRef}
                            {...prov.draggableProps}
                            {...prov.dragHandleProps}
                            onClick={() => setSelectedId(block.id)}
                            className={`
                              group flex justify-between items-center px-3 py-2 rounded-md border transition
                              ${
                                selectedId === block.id
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:bg-gray-50'
                              }
                              ${snap.isDragging ? 'bg-white shadow-lg' : ''}
                              cursor-pointer
                            `}
                          >
                            <div className="flex items-center gap-2">
                              {isFixed ? (
                                <Pin size={16} className="text-gray-500" />
                              ) : (
                                <div className="grid grid-cols-2 grid-rows-2 gap-1 mr-2 opacity-50 group-hover:opacity-80">
                                  <div className="w-2 h-2 bg-gray-400 rounded-sm" />
                                  <div className="w-2 h-2 bg-gray-400 rounded-sm" />
                                  <div className="w-2 h-2 bg-gray-400 rounded-sm" />
                                  <div className="w-2 h-2 bg-gray-400 rounded-sm" />
                                </div>
                              )}
                              <div className="text-sm">
                                <div className="font-semibold">{block.label || block.type}</div>
                                <div className="text-gray-500 text-xs">
                                  Тип: {block.type} | Порядок: {block.order}
                                </div>
                              </div>
                            </div>

                            <div
                              className="flex items-center gap-2"
                              onClick={e => e.stopPropagation()}
                            >
                              {!isFixed && (
                                <ChevronsUpDown
                                  size={16}
                                  className="text-gray-400 transition-transform duration-150 hover:scale-110"
                                />
                              )}
                              <Switch
                                checked={block.active}
                                onCheckedChange={val =>
                                  setBlocks(bs =>
                                    bs.map(b => (b.id === block.id ? { ...b, active: val } : b))
                                  )
                                }
                              />
                              <button
                                onClick={() => {
                                  setBlocks(bs => bs.filter(b => b.id !== block.id))
                                  if (selectedId === block.id) setSelectedId(null)
                                }}
                                className="text-red-500 hover:text-red-600"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    )
                  })}

                  {/* Добавить новый блок */}
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

        {/* Правая: блок деталей */}
        <div className="flex-1 border rounded p-4 bg-white shadow-sm min-h-[200px]">
          <BlockDetails block={selectedMeta} data={selectedData} onSave={handleSave} />
        </div>
      </div>
    </div>
  )
}
