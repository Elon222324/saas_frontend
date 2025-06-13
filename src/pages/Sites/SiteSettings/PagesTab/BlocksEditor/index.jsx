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
  const [unsavedBlocksMap, setUnsavedBlocksMap] = useState({})
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
      map[b.real_id] = typeof b.settings === 'string' ? JSON.parse(b.settings) : b.settings || {}
    }
    setBlockDataMap(map)
  }, [data, slug])

  const handleBlockChange = (blockId, newData) => {
    setUnsavedBlocksMap(prev => ({
      ...prev,
      [blockId]: {
        ...prev[blockId],
        ...newData,
      },
    }))
  }

  const handleSaveAll = async () => {
    for (const [blockId, changes] of Object.entries(unsavedBlocksMap)) {
      if (changes.data) {
        await fetch(
          `${API_URL}/blocks/update-data/${site_name}/${slug}/${blockId}`,
          {
            method: 'PATCH',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
            body: JSON.stringify({ data: changes.data }),
          }
        )
      }

      if (changes.settings) {
        await fetch(
          `${API_URL}/blocks/update-settings/${site_name}/${slug}/${blockId}`,
          {
            method: 'PATCH',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
            body: JSON.stringify({ settings: changes.settings }),
          }
        )
      }

      setBlockDataMap(prev => ({
        ...prev,
        [blockId]: { ...prev[blockId], ...changes },
      }))

      setData(prev => {
        const updatedBlocks = prev.blocks?.[slug]?.map(b =>
          b.real_id === Number(blockId)
            ? {
                ...b,
                settings: { ...(b.settings || {}), ...(changes.settings || {}) },
                data: { ...(b.data || {}), ...(changes.data || {}) },
              }
            : b
        )

        return { ...prev, blocks: { ...prev.blocks, [slug]: updatedBlocks } }
      })
    }

    setUnsavedBlocksMap({})
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
  const selectedData = selectedBlock
    ? {
        ...blockDataMap[selectedBlock.real_id],
        ...unsavedBlocksMap[selectedBlock.real_id],
      }
    : {}

  return (
    <div className="px-6 pt-0 space-y-4">
      <div className="bg-gray-100 py-2 px-4 flex justify-end sticky top-0 z-20">
        {Object.keys(unsavedBlocksMap).length > 0 && (
          <button
            onClick={handleSaveAll}
            className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 text-sm"
          >
            💾 Сохранить все
          </button>
        )}
      </div>
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
          onChangeBlock={handleBlockChange}
        />
      </div>
    </div>
  )
}
