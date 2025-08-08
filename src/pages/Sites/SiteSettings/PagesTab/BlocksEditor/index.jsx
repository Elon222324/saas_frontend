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
  const [unsavedBlocks, setUnsavedBlocks] = useState({})
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
      // 2. Запрос на новый, специальный эндпоинт
      const res = await fetch(`${API_URL}/blocks/status/${site_name}/${slug}/${realBlockId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ is_active: newActiveState }),
      });

      if (!res.ok) {
        throw new Error('Ошибка сервера при обновлении статуса');
      }
      
      // Обновляем глобальное состояние после успешного сохранения
      setData(prev => {
        const updatedBlocks = prev.blocks?.[slug]?.map(b => 
          b.real_id === realBlockId ? { ...b, active: newActiveState } : b
        );
        return { ...prev, blocks: { ...prev.blocks, [slug]: updatedBlocks } };
      });

    } catch (error) {
      console.error("Не удалось обновить статус блока:", error);
      // 3. Откат UI в случае ошибки
      setBlocks(prevBlocks =>
        prevBlocks.map(b => (b.id === blockId ? { ...b, active: !newActiveState } : b))
      );
      alert('Не удалось обновить статус блока. Попробуйте снова.');
    }
  };

  const handleSaveAll = async () => {
    // Теперь эта функция сохраняет только settings и data
    const payload = Object.entries(unsavedBlocks).map(([block_id, changes]) => ({
      block_id: Number(block_id),
      ...(changes.settings ? { settings: changes.settings } : {}),
      ...(changes.data ? { data: changes.data } : {}),
    }))

    if (payload.length === 0) return

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
      const updatedBlocks = prev.blocks?.[slug]?.map(b => {
        const change = unsavedBlocks[b.real_id]
        if (!change) return b
        return {
          ...b,
          settings: change.settings || b.settings,
          data: change.data || b.data,
        }
      })
      return { ...prev, blocks: { ...prev.blocks, [slug]: updatedBlocks } }
    })

    setUnsavedBlocks({})
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
          handleAddBlock={handleAddBlock}
          handleActivityChange={handleActivityChange} // <-- Передаем новую функцию
        />
        <BlockEditorPanel
          selectedBlock={selectedBlock}
          selectedData={selectedData}
          onSave={handleSaveAll}
          onChange={handleBlockChange}
        />
      </div>
    </div>
  )
}