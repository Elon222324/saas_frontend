import { useState } from 'react'
import { previewBlocks } from '../preview/blockMap'

export default function StickyPreview({ block, data, siteData }) {
  const [show, setShow] = useState(true)

  if (!block || !block.real_id) return null

  const PreviewComponent = previewBlocks[block.type]

  const renderContent = () => {
    if (!PreviewComponent) {
      return (
        <div className="border rounded shadow-sm p-4 bg-gray-50 text-sm text-gray-500">
          Нет визуального preview для блока типа <strong>{block.type}</strong>
        </div>
      )
    }

    const props = { settings: data?.settings || data || {} }

    if (block.type === 'navigation') {
      props.settings = { ...(data?.settings || data || {}) }
    }

    if (block.type === 'header') {
      props.data = data?.data || data || {}
      props.commonSettings = siteData?.common || {}
      props.navigation =
        siteData?.navigation?.filter(n => n.block_id === block.real_id && n.visible) || []
    }

    if (['banner', 'info', 'promo'].includes(block.type)) {
      props.data = data?.data || data || {}
      props.commonSettings = siteData?.common || {}
    }

    return <PreviewComponent {...props} />
  }

  return (
    <div className="sticky top-0 z-30 bg-white shadow-sm pt-2 pb-4">
      {show ? (
        <>
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-gray-500">🔍 Предпросмотр</div>
            <button
              onClick={() => setShow(false)}
              className="text-xs text-blue-600 hover:underline"
            >
              ⬆ Скрыть
            </button>
          </div>
          {renderContent()}
        </>
      ) : (
        <button
          onClick={() => setShow(true)}
          className="text-xs text-blue-600 hover:underline"
        >
          ⬇ Показать превью
        </button>
      )}
    </div>
  )
}
