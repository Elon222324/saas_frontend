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
    <div className="flex-1 border rounded p-4 bg-white shadow-sm min-h-[200px] overflow-x-auto space-y-4">
      <BlockDetails
        block={selectedBlock}
        data={{ ...selectedData, block_id: selectedBlock?.real_id }}
      />

      {showButton && (
        <button
          onClick={handleSaveBlock}
          disabled={disabled}
          className={`bg-emerald-600 text-white px-4 py-2 rounded text-sm transition ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-700'}`}
        >
          💾 Сохранить блок
        </button>
      )}

      {saved && <div className="text-green-600 text-sm">✅ Блок сохранён</div>}
    </div>
  )
}
