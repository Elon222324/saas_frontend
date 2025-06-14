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
  const [blockDataMap, setBlockDataMap] = useState({})
  const [selectedId, setSelectedId] = useState(null)
  const [unsaved, setUnsaved] = useState({})
  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    if (!data?.blocks?.[slug]) return
    const sortedBlocks = [...data.blocks[slug]].sort((a, b) => a.order - b.order)
    setBlocks(sortedBlocks)
    if (!selectedId || !sortedBlocks.find(b => b.id === selectedId)) {
      setSelectedId(sortedBlocks[0]?.id || null)
    }

    const map = {}
    for (const b of sortedBlocks) {
      const settings = typeof b.settings === 'string' ? JSON.parse(b.settings) : b.settings || {}
      map[b.real_id] = { settings, data: b.data || {} }
      if (unsaved[b.real_id]) {
        map[b.real_id] = { ...map[b.real_id], ...unsaved[b.real_id] }
      }
    }
    setBlockDataMap(map)
  }, [data, slug, unsaved])

  const handleBlockChange = (blockId, changes) => {
    setUnsaved(prev => ({
      ...prev,
      [blockId]: { ...prev[blockId], ...changes },
    }))
    setBlockDataMap(prev => ({
      ...prev,
      [blockId]: { ...prev[blockId], ...changes },
    }))
  }

  const handleSaveAll = async () => {
    const payload = Object.entries(unsaved).map(([id, change]) => ({
      block_id: Number(id),
      ...change,
    }))
    if (!payload.length) return
    const res = await fetch(`${API_URL}/blocks/update-all/${site_name}/${slug}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    if (!res.ok) return alert('Не удалось сохранить данные')

    setData(prev => {
      const pageBlocks = prev.blocks?.[slug]?.map(b => {
        const change = unsaved[b.real_id]
        if (change) {
          return {
            ...b,
            settings: { ...b.settings, ...(change.settings || {}) },
            data: { ...b.data, ...(change.data || {}) },
          }
        }
        return b
      })
      return { ...prev, blocks: { ...prev.blocks, [slug]: pageBlocks } }
    })
    setUnsaved({})
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
  const selectedData = selectedBlock ? blockDataMap[selectedBlock.real_id] || {} : {}

  return (
    <div className="px-6 pt-0 space-y-4">
      <PageSelectHeader slug={slug} data={data} />
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
      <div className="flex justify-end">
        <button
          onClick={handleSaveAll}
          disabled={!Object.keys(unsaved).length}
          className="bg-emerald-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          💾 Сохранить
        </button>
      </div>
    </div>
  )
}
