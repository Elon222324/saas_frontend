import { useState, useEffect } from 'react'
import { previewBlocks } from '@/preview/blockMap'
import NavigationEditor from '@/components/BlockForms/NavigationEditor'

export default function BlockDetails({ block, data, onSave }) {
  const [form, setForm] = useState({})

  useEffect(() => {
    if (!block?.real_id || !data) return
    setForm({ ...data, block_id: block.real_id }) // минимальный старт
  }, [data, block?.real_id])

  if (!block || !block.real_id) {
    return <p className="text-gray-500 text-sm">❗ Выберите блок для редактирования</p>
  }

  const renderPreview = () => {
    const PreviewComponent = previewBlocks[block.type]
    if (!PreviewComponent) {
      return (
        <div className="border rounded shadow-sm p-4 bg-gray-50 text-sm text-gray-500">
          Нет визуального preview для блока типа <strong>{block.type}</strong>
        </div>
      )
    }

    return (
      <div className="border rounded shadow-sm p-4 bg-white space-y-2">
        <p className="text-sm text-gray-500">Предпросмотр блока:</p>
        <div className="border border-gray-200 rounded p-2 bg-gray-50">
          <PreviewComponent settings={form} />
        </div>
      </div>
    )
  }

  const renderEditor = () => {
    switch (block.type) {
      case 'navigation':
        return <NavigationEditor block={block} data={form} onChange={setForm} />
      default:
        return <p className="text-sm text-gray-500">Редактор блока "{block.type}" пока не реализован</p>
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Редактирование "{block.label || block.type}"</h2>
        {renderPreview()}
      </div>

      <div className="space-y-4">
        {renderEditor()}
      </div>
    </div>
  )
}
