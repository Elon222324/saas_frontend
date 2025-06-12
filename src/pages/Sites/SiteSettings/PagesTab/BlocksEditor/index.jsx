import { useEffect, useRef, useState } from 'react'
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
  const [showFloating, setShowFloating] = useState(false)
  const saveHandlers = useRef({ handleSaveData: null, handleSaveAppearance: null })

  const handleSaveAll = async () => {
    await saveHandlers.current.handleSaveData?.()
    await saveHandlers.current.handleSaveAppearance?.()
  }
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
      map[b.real_id] = typeof b.settings === 'string' ? JSON.parse(b.settings) : b.settings || {}
    }
    setBlockDataMap(map)
  }, [data, slug])

  useEffect(() => {
    setShowFloating(false)
    saveHandlers.current = { handleSaveData: null, handleSaveAppearance: null }
  }, [selectedId])


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
          onFloatingChange={setShowFloating}
          onSaveHandlers={(h) => {
            saveHandlers.current = h
          }}
        />
      </div>
      {showFloating && (
        <button
          onClick={handleSaveAll}
          className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow-lg hover:bg-blue-700"
        >
          💾 Сохранить изменения
        </button>
      )}
    </div>
  )
}
