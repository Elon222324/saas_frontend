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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
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

  const handleSave = async (blockId, newData) => {
    const res = await fetch(`${API_URL}/sites/${site_name}/pages/${slug}/blocks/${blockId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(newData),
    })
    if (!res.ok) return alert('Не удалось сохранить данные')

    setBlockDataMap(prev => ({ ...prev, [blockId]: newData }))
    setData(prev => {
      const updatedBlocks = prev.blocks?.[slug]?.map(b =>
        b.real_id === blockId ? { ...b, settings: newData } : b
      )
      return { ...prev, blocks: { ...prev.blocks, [slug]: updatedBlocks } }
    })
    setHasUnsavedChanges(false)
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

  const handleSelectBlock = (id) => {
    if (id === selectedId) return
    if (hasUnsavedChanges) {
      const confirmSwitch = window.confirm(
        'Есть несохранённые изменения. Переключиться без сохранения?'
      )
      if (!confirmSwitch) return
      setHasUnsavedChanges(false)
    }
    setSelectedId(id)
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
          setSelectedId={handleSelectBlock}
          setBlocks={setBlocks}
          handleReorder={handleReorder}
          handleAddBlock={handleAddBlock}
        />
        <BlockEditorPanel
          selectedBlock={selectedBlock}
          selectedData={selectedData}
          onSave={handleSave}
          setHasUnsavedChanges={setHasUnsavedChanges}
        />
      </div>
    </div>
  )
}
