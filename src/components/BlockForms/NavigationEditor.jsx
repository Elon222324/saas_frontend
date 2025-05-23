import { useEffect, useState } from 'react'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { GripVertical, Check, X, Pencil } from 'lucide-react'

export default function NavigationEditor({ block, data, onChange }) {
  const { data: siteData, setData, site_name } = useSiteSettings()
  const [items, setItems] = useState([])
  const [showToast, setShowToast] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null)
  const [editValue, setEditValue] = useState('')

  useEffect(() => {
    if (!block?.real_id) return
    const navItems = siteData?.navigation?.filter(item => item.block_id === block.real_id) || []
    const sorted = [...navItems].sort((a, b) => a.order - b.order)
    setItems(sorted)
    onChange({ ...data, block_id: block.real_id, items: sorted })
  }, [block?.real_id, siteData?.navigation])

  const handleToggle = async (index) => {
    const item = items[index]
    const newVisible = !item.visible
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/navigation/set-visible/${site_name}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        },
        credentials: 'include',
        body: JSON.stringify({ id: Number(item.id), visible: newVisible }),
      })
      if (!res.ok) throw new Error()
      const updatedItems = [...items]
      updatedItems[index].visible = newVisible
      setItems(updatedItems)
      onChange(prev => ({ ...prev, items: updatedItems }))
      setData(prev => ({
        ...prev,
        navigation: prev.navigation.map(n => n.id === item.id ? { ...n, visible: newVisible } : n)
      }))
    } catch (err) {
      console.error('❌ Ошибка обновления видимости:', err)
      alert('Не удалось обновить видимость элемента')
    }
  }

  const handleLabelSave = async (index) => {
    const item = items[index]
    const trimmed = editValue.trim()
    if (!trimmed || trimmed === item.label) {
      setEditingIndex(null)
      return
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/navigation/set-label/${site_name}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        credentials: 'include',
        body: JSON.stringify({ id: Number(item.id), label: trimmed }),
      })
      if (!res.ok) throw new Error()
      const updatedItems = [...items]
      updatedItems[index].label = trimmed
      setItems(updatedItems)
      onChange(prev => ({ ...prev, items: updatedItems }))
      setData(prev => ({
        ...prev,
        navigation: prev.navigation.map(n => n.id === item.id ? { ...n, label: trimmed } : n)
      }))
      setEditingIndex(null)
    } catch (err) {
      console.error('❌ Ошибка обновления названия:', err)
      alert('Не удалось сохранить название')
    }
  }

  const handleReorder = async (newItems) => {
    const payload = newItems.map((item, index) => ({
      id: Number(item.id),
      order: Number(index + 1),
    }))
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/navigation/reorder/${site_name}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      const updatedItems = newItems.map((item, index) => ({
        ...item,
        order: index + 1,
      }))
      setItems(updatedItems)
      onChange(prev => ({ ...prev, items: updatedItems }))
      setData(prev => ({
        ...prev,
        navigation: prev.navigation.map(n => {
          const match = updatedItems.find(i => i.id === n.id)
          return match ? { ...n, order: match.order } : n
        })
      }))
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
    } catch (err) {
      console.error('❌ Ошибка при отправке порядка:', err)
      alert('Не удалось сохранить порядок')
    }
  }

  const onDragEnd = (result) => {
    const { source, destination } = result
    if (!destination || source.index === destination.index) return
    const updated = Array.from(items)
    const [moved] = updated.splice(source.index, 1)
    updated.splice(destination.index, 0, moved)
    const newItems = updated.map((item, index) => ({ ...item, order: index + 1 }))
    handleReorder(newItems)
  }

  return (
    <div className="space-y-3 relative">
      {showToast && (
        <div className="absolute top-0 right-0 bg-green-100 text-green-800 px-3 py-1 rounded shadow text-sm transition-opacity duration-300">
          ✅ Порядок сохранён
        </div>
      )}

      <div className="text-sm text-gray-500 pl-1 italic">
        Перетаскивайте для сортировки, используйте чекбоксы и ✏️ для редактирования.
      </div>

      <label className="block text-sm font-medium mb-1">Пункты меню:</label>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="nav-items">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-1">
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                  {(prov, snap) => (
                    <div
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      {...prov.dragHandleProps}
                      className={`
                        flex items-center gap-3 p-2 border rounded bg-white shadow-sm cursor-grab
                        ${snap.isDragging ? 'shadow-lg ring-2 ring-blue-300' : ''}
                      `}
                    >
                      <div className="text-gray-400">
                        <GripVertical size={16} />
                      </div>

                      <input
                        type="checkbox"
                        checked={item.visible}
                        onChange={() => handleToggle(index)}
                      />

                      {editingIndex === index ? (
                        <div className="flex items-center gap-1 flex-1">
                          <input
                            autoFocus
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="text-sm border px-2 py-1 rounded w-full"
                          />
                          <button
                            className="text-green-600 hover:text-green-800"
                            onClick={() => handleLabelSave(index)}
                          >
                            <Check size={16} />
                          </button>
                          <button
                            className="text-gray-400 hover:text-gray-600"
                            onClick={() => setEditingIndex(null)}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between flex-1 gap-2">
                          <span className={`${!item.visible ? 'text-gray-400 italic' : ''}`}>
                            {item.label || item.name || `#${index + 1}`}
                          </span>
                          <button
                            className="text-gray-500 hover:text-blue-600"
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingIndex(index)
                              setEditValue(item.label || '')
                            }}
                            title="Переименовать"
                          >
                            <Pencil size={16} />
                          </button>
                        </div>
                      )}

                      <span className="text-gray-400 text-xs">#{item.order}</span>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}
