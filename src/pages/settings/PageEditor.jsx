import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Switch } from '@/components/ui/switch'
import { Trash2, ChevronsUpDown, Info } from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import BlockDetails from '@/components/BlockDetails'
import { useSiteSettings } from '@/context/SiteSettingsContext'

export default function PageEditor() {
  const { domain, slug } = useParams()
  const navigate = useNavigate()
  const { data, loading: loadingContext, site_name } = useSiteSettings()
  const [blocks, setBlocks] = useState([])
  const [blockDataMap, setBlockDataMap] = useState({})
  const [selectedId, setSelectedId] = useState(null)

  const API_URL = import.meta.env.VITE_API_URL

  const pageInfo = data?.pages?.find(p => p.slug === slug)
  const pageId = pageInfo?.id

  useEffect(() => {
    if (!data?.blocks?.[slug]) return
  
    const pageBlocks = data.blocks[slug]
    const sorted = [...pageBlocks].sort((a, b) => a.order - b.order)
    setBlocks(sorted)
    setSelectedId(sorted[0]?.real_id || null)
  
    const blockData = {}
    for (const blk of sorted) {
      blockData[blk.real_id] = blk.settings || {}
    }
    setBlockDataMap(blockData)
  }, [data, slug])
  

  const handleSave = async (blockId, newData) => {
    try {
      const res = await fetch(
        `${API_URL}/sites/${site_name}/pages/${slug}/blocks/${blockId}`,
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
      setBlockDataMap(prev => ({ ...prev, [blockId]: newData }))
      alert('Сохранено!')
    } catch (err) {
      console.error(err)
      alert('Не удалось сохранить данные')
    }
  }

  const handleReorder = async (newBlocks) => {
    const payload = newBlocks.map(({ real_id, order }) => ({
      id: real_id,
      order
    }))
  
    console.log("[DEBUG] Отправка блока:", payload)
  
    try {
      const res = await fetch(
        `${API_URL}/blocks/reorder/${site_name}/${slug}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(payload),
        }
      )
      if (!res.ok) throw new Error('Ошибка сохранения порядка')
    } catch (err) {
      console.error(err)
      alert('Не удалось сохранить порядок блоков')
    }
  }

  function onDragEnd(result) {
    const { source, destination } = result
    if (!destination || source.index === destination.index) return

    const dragged = blocks[source.index]
    const updated = Array.from(blocks)
    updated.splice(source.index, 1)
    updated.splice(destination.index, 0, dragged)
    updated.forEach((blk, i) => {
      console.log(`[DEBUG] block[${i}] =`, blk)
    })
    const newBlocks = updated.map((blk, idx) => ({ ...blk, order: idx + 1 }))
    setBlocks(newBlocks)
    handleReorder(newBlocks)
  }

  const handleAddBlock = () => {
    alert('Добавление нового блока')
  }

  if (loadingContext || !blocks.length || !data?.pages) return <div className="p-6">Загрузка...</div>

  const selectedMeta = blocks.find(b => b.id === selectedId)
  const selectedData = selectedMeta ? blockDataMap[selectedMeta.id] : null

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Редактирование:</h1>
          <select
            value={slug}
            onChange={(e) => navigate(`/settings/${domain}/pages/${e.target.value}`)}
            className="border px-2 py-1 rounded-md bg-white shadow-sm"
          >
            {data.pages.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.title || p.slug}
              </option>
            ))}
          </select>
          {pageId && <span className="text-sm text-gray-500">ID страницы: {pageId}</span>}
        </div>
        <Link to={`/settings/${domain}/pages`} className="text-blue-600 hover:underline text-sm">
          ← Назад к списку
        </Link>
      </div>

      <div className="flex gap-6">
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
                    const blockInactive = !block.active

                    return (
                      <Draggable
                        key={block.id}
                        draggableId={String(block.id)}
                        index={index}
                      >
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
                            } ${snap.isDragging ? 'bg-white shadow-lg' : ''} ${
                              blockInactive ? 'opacity-70 italic' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                block.active ? 'bg-green-500' : 'bg-gray-400'
                              } transition-colors duration-200`} />
                              <div className="grid grid-cols-2 grid-rows-2 gap-0.5 mr-2 text-gray-500 opacity-70 group-hover:opacity-100">
                                <div className="w-2 h-2 bg-gray-500 rounded-sm" />
                                <div className="w-2 h-2 bg-gray-500 rounded-sm" />
                                <div className="w-2 h-2 bg-gray-500 rounded-sm" />
                                <div className="w-2 h-2 bg-gray-500 rounded-sm" />
                              </div>
                              <div className="text-sm">
                                <div className="font-semibold flex items-center gap-2">
                                  {block.label || block.type}
                                  {isSystem && (
                                    <span className="text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded">Fixed</span>
                                  )}
                                </div>
                                <div className="text-gray-500 text-xs">
                                  Тип: {block.type} | Порядок: {block.order}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              <ChevronsUpDown size={16} className="text-gray-400 hover:scale-110 transition-all duration-200" />
                              <Switch
                                checked={block.active}
                                onCheckedChange={val =>
                                  setBlocks(bs =>
                                    bs.map(b => (b.id === block.id ? { ...b, active: val } : b))
                                  )
                                }
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

        <div className="flex-1 border rounded p-4 bg-white shadow-sm min-h-[200px]">
          <BlockDetails
            block={selectedMeta}
            data={{ ...selectedData, block_id: selectedMeta?.real_id }}
            onSave={handleSave}
          />

        </div>
      </div>
    </div>
  )
}
