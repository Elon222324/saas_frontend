import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSiteSettings } from '@/context/SiteSettingsContext'

import PageSelectHeader from './parts/PageSelectHeader'
import BlockListSidebar from './parts/BlockListSidebar'
import BlockEditorPanel from './parts/BlockEditorPanel'

export default function PageEditor() {
  const { slug } = useParams()
  const { data, loading: loadingContext, site_name, setData } = useSiteSettings()
  const [blocks, setBlocks] = useState([])
  const [editedBlocks, setEditedBlocks] = useState({})
  const [originalBlocks, setOriginalBlocks] = useState({})
  const [selectedId, setSelectedId] = useState(null)
  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    if (!data?.blocks?.[slug]) return
    const sortedBlocks = [...data.blocks[slug]].sort((a, b) => a.order - b.order)
    setBlocks(sortedBlocks)
    if (!selectedId || !sortedBlocks.find(b => b.id === selectedId)) {
      setSelectedId(sortedBlocks[0]?.id || null)
    }

    const edited = {}
    const original = {}
    for (const b of sortedBlocks) {
      edited[b.real_id] = {
        settings:
          typeof b.settings === 'string' ? JSON.parse(b.settings) : b.settings || {},
        data: typeof b.data === 'string' ? JSON.parse(b.data) : b.data || {},
      }
      original[b.real_id] = {
        settings: edited[b.real_id].settings,
        data: edited[b.real_id].data,
      }
    }
    setEditedBlocks(edited)
    setOriginalBlocks(original)
  }, [data, slug])

  const handleBlockChange = (blockId, update) => {
    setEditedBlocks(prev => ({
      ...prev,
      [blockId]: {
        ...(prev[blockId] || {}),
        ...update,
      },
    }))
  }

  const handleGlobalSave = async () => {
    const payload = []
    for (const [id, data] of Object.entries(editedBlocks)) {
      const orig = originalBlocks[id] || {}
      const item = { block_id: Number(id) }

      if (JSON.stringify(data.settings) !== JSON.stringify(orig.settings)) {
        item.settings = data.settings
      }
      if (JSON.stringify(data.data) !== JSON.stringify(orig.data)) {
        item.data = data.data
      }

      if (item.settings || item.data) payload.push(item)
    }

    if (!payload.length) {
      alert('Изменений нет')
      return
    }

    const res = await fetch(`${API_URL}/blocks/update-all/${site_name}/${slug}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    })

    if (!res.ok) return alert('Не удалось сохранить изменения')

    setOriginalBlocks(JSON.parse(JSON.stringify(editedBlocks)))
    setData(prev => {
      const updated = prev.blocks?.[slug]?.map(b => {
        const upd = editedBlocks[b.real_id]
        return upd ? { ...b, settings: upd.settings, data: upd.data } : b
      })
      return { ...prev, blocks: { ...prev.blocks, [slug]: updated } }
    })
    alert('Сохранено!')
  }

  const handleReorder = async (newBlocks) => {
    const payload = newBlocks.map(({ real_id, order }) => ({ id: real_id, order }))
    const res = await fetch(`${API_URL}/blocks/reorder/${site_name}/${slug}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    if (!res.ok) alert('Не удалось сохранить порядок блоков')
  }

  const handleAddBlock = () => {
    alert('Добавление нового блока')
  }

  if (loadingContext || !blocks.length || !data?.pages) return <div className="p-6">Загрузка...</div>

  const selectedBlock = blocks.find(b => b.id === selectedId)
  const selectedData = selectedBlock ? editedBlocks[selectedBlock.real_id] || {} : {}

  return (
    <div className="px-6 pt-0 space-y-4">
      <PageSelectHeader slug={slug} data={data} />
      <div className="flex justify-end">
        <button
          onClick={handleGlobalSave}
          className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition text-sm"
        >
          💾 Сохранить
        </button>
      </div>
      <div className="flex gap-6">
        <BlockListSidebar
          blocks={blocks}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          setBlocks={setBlocks}
          handleReorder={handleReorder}
          handleAddBlock={handleAddBlock}
        />
        <BlockEditorPanel
          selectedBlock={selectedBlock}
          selectedData={selectedData}
          onBlockChange={handleBlockChange}
        />
      </div>
    </div>
  )
}
