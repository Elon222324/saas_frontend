import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSiteSettings } from '@/context/SiteSettingsContext'

import PageSelectHeader from './parts/PageSelectHeader'
import BlockListSidebar from './parts/BlockListSidebar'
import BlockEditorPanel from './parts/BlockEditorPanel'
import AddBlockModal from './parts/AddBlockModal'
import { useBlocksApi } from './hooks/useBlocksApi'

export default function PageEditor() {
  const { slug } = useParams()
  const { data, loading: loadingContext, setData } = useSiteSettings()
  const {
    reorderBlocks,
    updateAllBlocks,
    updateBlockStatus,
    createBlock,
  } = useBlocksApi()

  const [blocks, setBlocks] = useState([])
  const [blockDataMap, setBlockDataMap] = useState({})
  const [selectedId, setSelectedId] = useState(null)
  const [unsavedBlocks, setUnsavedBlocks] = useState({})
  const [showAddBlockModal, setShowAddBlockModal] = useState(false)
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
      const settings =
        typeof b.settings === 'string' ? JSON.parse(b.settings) : b.settings || {}
      map[b.real_id] = {
        settings,
        data: b.data || {},
      }
    }
    setBlockDataMap(map)
    setUnsavedBlocks({})
  }, [data, slug])

  const isDeepEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b)

  const handleBlockChange = (id, update) => {
    const prevSettings = blockDataMap[id]?.settings || {}
    const prevData = blockDataMap[id]?.data || {}

    const sameSettings = !update.settings || isDeepEqual(update.settings, prevSettings)
    const sameData = !update.data || isDeepEqual(update.data, prevData)

    if (sameSettings && sameData) {
      return
    }

    setUnsavedBlocks(prev => ({
      ...prev,
      [id]: { ...(prev[id] || {}), ...update },
    }))
  }

  // 👇 ВОТ НОВАЯ ФУНКЦИЯ ДЛЯ РАБОТЫ С ОТДЕЛЬНЫМ ЭНДПОИНТОМ
  const handleActivityChange = async (blockId, realBlockId, newActiveState) => {
    // 1. Оптимистичное обновление UI
    setBlocks(prevBlocks =>
      prevBlocks.map(b => (b.id === blockId ? { ...b, is_active: newActiveState } : b))
    );

    try {
      await updateBlockStatus.mutateAsync({ 
        block_id: realBlockId, 
        is_active: newActiveState 
      })
    } catch (error) {
      console.error("Не удалось обновить статус блока:", error);
      // Откат UI в случае ошибки
      setBlocks(prevBlocks =>
        prevBlocks.map(b => (b.id === blockId ? { ...b, is_active: !newActiveState } : b))
      );
      alert('Не удалось обновить статус блока. Попробуйте снова.');
    }
  };

  const handleSaveAll = async () => {
    if (Object.keys(unsavedBlocks).length === 0) {
      console.log('⚠️ [handleSaveAll] No unsaved blocks')
      return
    }

    console.log('💾 [handleSaveAll] Starting save with unsavedBlocks:', unsavedBlocks)

    try {
      await updateAllBlocks.mutateAsync(unsavedBlocks)
      setUnsavedBlocks({})
      console.log('✅ [handleSaveAll] Successfully saved all blocks')
      alert('Сохранено!')
    } catch (error) {
      console.error('❌ [handleSaveAll] Error saving changes:', error)
      console.error('📋 [handleSaveAll] Failed unsavedBlocks:', unsavedBlocks)
      alert('Не удалось сохранить данные')
    }
  }

  const handleReorder = async (newBlocks) => {
    try {
      await reorderBlocks.mutateAsync(newBlocks)
    } catch(error) {
      console.error('Не удалось сохранить порядок блоков:', error)
      alert('Не удалось сохранить порядок блоков')
    }
  }

  const handleAddBlock = async ({ type, label }) => {
    try {
      await createBlock.mutateAsync({
        type,
        label,
      })
      alert('✅ Блок успешно добавлен!')
    } catch (error) {
      console.error('Ошибка при добавлении блока:', error)
      throw error
    }
  }

  if (loadingContext || !blocks.length || !data?.pages) return <div className="p-6">Загрузка...</div>

  const selectedBlock = blocks.find(b => b.id === selectedId)
  const selectedData = selectedBlock
    ? {
        settings: {
          ...(blockDataMap[selectedBlock.real_id]?.settings || {}),
          ...(unsavedBlocks[selectedBlock.real_id]?.settings || {}),
        },
        data: {
          ...(blockDataMap[selectedBlock.real_id]?.data || {}),
          ...(unsavedBlocks[selectedBlock.real_id]?.data || {}),
        },
      }
    : {}

  return (
    <div className="px-6 pt-0 space-y-4">
      <PageSelectHeader
        slug={slug}
        data={data}
        hasUnsaved={Object.keys(unsavedBlocks).length > 0}
        onSave={handleSaveAll}
      />
      <div className="flex gap-6">
        <BlockListSidebar
          blocks={blocks}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          setBlocks={setBlocks}
          handleReorder={handleReorder}
          handleAddBlock={() => setShowAddBlockModal(true)}
          handleActivityChange={handleActivityChange} // <-- Передаем новую функцию
        />
        <BlockEditorPanel
          selectedBlock={selectedBlock}
          selectedData={selectedData}
          onSave={handleSaveAll}
          onChange={handleBlockChange}
        />
      </div>

      {/* Модальное окно для добавления нового блока */}
      <AddBlockModal
        open={showAddBlockModal}
        onClose={() => setShowAddBlockModal(false)}
        onAddBlock={handleAddBlock}
        isLoading={createBlock.isPending}
      />
    </div>
  )
}