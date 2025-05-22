import { useEffect, useState } from 'react'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

export default function NavigationEditor({ block, data, onChange }) {
  const { data: siteData, site_name } = useSiteSettings()
  const [items, setItems] = useState([])

  useEffect(() => {
    if (!block?.real_id) return

    const navItems = siteData?.navigation?.filter(item => item.block_id === block.real_id) || []

    const enrichedData = {
      ...data,
      block_id: block.real_id,
      items: navItems,
    }

    setItems(navItems)
    onChange(enrichedData)
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

      if (!res.ok) throw new Error('Ошибка при обновлении видимости')

      const updatedItems = [...items]
      updatedItems[index].visible = newVisible
      setItems(updatedItems)
      onChange(prev => ({ ...prev, items: updatedItems }))
    } catch (err) {
      console.error('❌ Ошибка обновления видимости:', err)
      alert('Не удалось обновить видимость элемента')
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

      console.log('[📦 PATCH payload]', JSON.stringify(payload, null, 2))

      if (!res.ok) throw new Error('Ошибка обновления порядка')

      setItems(newItems)
      onChange(prev => ({ ...prev, items: newItems }))
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

    handleReorder(updated)
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium mb-1">Пункты меню:</label>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="nav-items">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-1">
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                  {(prov) => (
                    <div
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      {...prov.dragHandleProps}
                      className="flex items-center gap-2 p-2 border rounded bg-white shadow-sm"
                    >
                      <input
                        type="checkbox"
                        checked={item.visible}
                        onChange={() => handleToggle(index)}
                      />
                      <span>{item.label || item.name || `#${index + 1}`}</span>
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
