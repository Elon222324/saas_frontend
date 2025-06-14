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
  const [drafts, setDrafts] = useState({})
  const [initialDrafts, setInitialDrafts] = useState({})
  const [selectedId, setSelectedId] = useState(null)
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
      const d = typeof b.data === 'string' ? JSON.parse(b.data) : b.data || {}
      map[b.real_id] = { settings, data: d }
    }
    setDrafts(map)
    setInitialDrafts(map)
  }, [data, slug])

  const handleBlockChange = (id, update) => {
    setDrafts(prev => ({ ...prev, [id]: update }))
  }

  const handleSaveAll = async () => {
    const payload = []
    for (const [id, draft] of Object.entries(drafts)) {
      const initial = initialDrafts[id] || {}
      const changed = {}
      if (JSON.stringify(draft.settings) !== JSON.stringify(initial.settings)) {
        changed.settings = draft.settings
      }
      if (JSON.stringify(draft.data) !== JSON.stringify(initial.data)) {
        changed.data = draft.data
      }
      if (Object.keys(changed).length) {
        payload.push({ block_id: Number(id), ...changed })
      }
    }
    if (!payload.length) return alert('Нет изменений для сохранения')

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

    setInitialDrafts(drafts)
    setData(prev => {
      const updated = prev.blocks?.[slug]?.map(b => {
        const found = payload.find(p => p.block_id === b.real_id)
        if (found) {
          return {
            ...b,
            settings: found.settings ?? b.settings,
            data: found.data ?? b.data,
          }
        }
        return b
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
  const selectedData = selectedBlock ? drafts[selectedBlock.real_id] || {} : {}

  const hasUnsaved = Object.keys(drafts).some(id => {
    const d = drafts[id] || {}
    const i = initialDrafts[id] || {}
    return (
      JSON.stringify(d.settings) !== JSON.stringify(i.settings) ||
      JSON.stringify(d.data) !== JSON.stringify(i.data)
    )
  })

  return (
    <div className="px-6 pt-0 space-y-4">
      <div className="flex justify-between items-center">
        <PageSelectHeader slug={slug} data={data} />
        <button
          onClick={handleSaveAll}
          disabled={!hasUnsaved}
          className="bg-emerald-600 text-white px-4 py-2 rounded disabled:opacity-50"
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
          onChange={handleBlockChange}
        />
      </div>
    </div>
  )
}
