import { useState } from 'react'
import BlockDetails from '@/pages/Sites/SiteSettings/PagesTab/BlocksEditor/preview/BlockDetails'

export default function BlockEditorPanel({
  selectedBlock,
  selectedData,
  handleSaveData,
  handleSaveAppearance,
  showSavedToast,
  showButton,
}) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSaveBlock = async () => {
    setSaving(true)
    try {
      await handleSaveData?.()
      await handleSaveAppearance?.()
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  const disabled = (!showSavedToast && !showButton) || saving

  return (
    <div className="flex-1 border rounded p-4 bg-white shadow-sm min-h-[200px] overflow-x-auto space-y-4 relative">
      <BlockDetails
        block={selectedBlock}
        data={{ ...selectedData, block_id: selectedBlock?.real_id }}
      />

      {showButton && (
        <button
          onClick={handleSaveBlock}
          disabled={disabled}
          className={`fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-full shadow-lg transition ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-700'
          }`}
        >
          💾 Сохранить блок
        </button>
      )}

      {saved && (
        <div className="text-green-600 text-sm absolute bottom-20 right-6 z-50">
          ✅ Блок сохранён
        </div>
      )}
    </div>
  )
}