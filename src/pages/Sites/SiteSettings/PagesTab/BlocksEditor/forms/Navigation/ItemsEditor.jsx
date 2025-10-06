import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { GripVertical, Check, X, Pencil } from 'lucide-react'
import { useState } from 'react'
import { useSiteSettings } from '@/context/SiteSettingsContext'

export default function NavigationItemsEditor({ items, siteName, siteData, setData, setItems, onChange, setShowToast }) {
  const { siteToken } = useSiteSettings()
  const [editingIndex, setEditingIndex] = useState(null)
  const [editValue, setEditValue] = useState('')

  // Убираем суффикс _app для нового API
  const siteNameForApi = siteName?.replace('_app', '')
  const baseDomain = import.meta.env.VITE_BASE_DOMAIN
  const baseApiUrl = `https://${siteNameForApi}.${baseDomain}/site-api/admin/navigation/`

  const handleToggle = async (index) => {
    const item = items[index]
    const newVisible = !item.visible

    if (!siteToken?.token) {
      console.error('❌ [Navigation] Токен отсутствует')
      alert('Токен авторизации отсутствует')
      return
    }

    try {
      const setVisibleUrl = `${baseApiUrl}set-visible`
      console.log('🔑 [Navigation] → изменяю видимость:', setVisibleUrl)
      console.log('🔑 [Navigation] → данные:', { id: item.id, visible: newVisible })

      const res = await fetch(setVisibleUrl, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${siteToken.token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ id: Number(item.id), visible: newVisible }),
      })

      console.log('🔑 [Navigation] ← статус ответа:', res.status, res.statusText)

      if (!res.ok) {
        if (res.status === 401) {
          console.error('❌ [Navigation] Ошибка аутентификации (401)')
          throw new Error('Ошибка аутентификации. Проверьте токен.')
        }
        throw new Error(`Ошибка обновления видимости: ${res.status}`)
      }

      console.log('✅ [Navigation] ← видимость обновлена')

      const updatedItems = [...items]
      updatedItems[index].visible = newVisible
      setItems(updatedItems)
      onChange(prev => ({ ...prev, items: updatedItems }))
      setData(prev => ({
        ...prev,
        navigation: prev.navigation.map(n => n.id === item.id ? { ...n, visible: newVisible } : n)
      }))
    } catch (err) {
      console.error('❌ [Navigation] Ошибка обновления видимости:', err)
      alert('Не удалось обновить видимость элемента: ' + err.message)
    }
  }

  const handleLabelSave = async (index) => {
    const item = items[index]
    const trimmed = editValue.trim()
    if (!trimmed || trimmed === item.label) {
      setEditingIndex(null)
      return
    }

    if (!siteToken?.token) {
      console.error('❌ [Navigation] Токен отсутствует')
      alert('Токен авторизации отсутствует')
      return
    }

    try {
      const setLabelUrl = `${baseApiUrl}set-label`
      console.log('🔑 [Navigation] → изменяю название:', setLabelUrl)
      console.log('🔑 [Navigation] → данные:', { id: item.id, label: trimmed })

      const res = await fetch(setLabelUrl, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${siteToken.token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ id: Number(item.id), label: trimmed }),
      })

      console.log('🔑 [Navigation] ← статус ответа:', res.status, res.statusText)

      if (!res.ok) {
        if (res.status === 401) {
          console.error('❌ [Navigation] Ошибка аутентификации (401)')
          throw new Error('Ошибка аутентификации. Проверьте токен.')
        }
        throw new Error(`Ошибка обновления названия: ${res.status}`)
      }

      console.log('✅ [Navigation] ← название обновлено')

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
      console.error('❌ [Navigation] Ошибка обновления названия:', err)
      alert('Не удалось сохранить название: ' + err.message)
    }
  }

  const handleReorder = async (newItems) => {
    const payload = newItems.map((item, index) => ({
      id: Number(item.id),
      order: Number(index + 1),
    }))

    if (!siteToken?.token) {
      console.error('❌ [Navigation] Токен отсутствует')
      alert('Токен авторизации отсутствует')
      return
    }

    try {
      const reorderUrl = `${baseApiUrl}reorder`
      console.log('🔑 [Navigation] → изменяю порядок:', reorderUrl)
      console.log('🔑 [Navigation] → данные:', payload)

      const res = await fetch(reorderUrl, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${siteToken.token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      console.log('🔑 [Navigation] ← статус ответа:', res.status, res.statusText)

      if (!res.ok) {
        if (res.status === 401) {
          console.error('❌ [Navigation] Ошибка аутентификации (401)')
          throw new Error('Ошибка аутентификации. Проверьте токен.')
        }
        throw new Error(`Ошибка изменения порядка: ${res.status}`)
      }

      console.log('✅ [Navigation] ← порядок обновлен')

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
      console.error('❌ [Navigation] Ошибка при отправке порядка:', err)
      alert('Не удалось сохранить порядок: ' + err.message)
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
  )
}
