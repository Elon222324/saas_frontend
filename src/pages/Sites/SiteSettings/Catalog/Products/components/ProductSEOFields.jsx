import { useState } from 'react'

export default function ProductSEOFields({
  metaTitle,
  setMetaTitle,
  metaDescription,
  setMetaDescription,
  keywords,
  setKeywords,
  isCollapsed = true
}) {
  const [expanded, setExpanded] = useState(!isCollapsed)

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <div 
        className="flex items-center justify-between cursor-pointer mb-3"
        onClick={() => setExpanded(!expanded)}
      >
        <h4 className="text-sm font-medium text-gray-700">SEO настройки</h4>
        <svg 
          className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      {expanded && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Title
            </label>
            <input
              type="text"
              value={metaTitle}
              onChange={e => setMetaTitle(e.target.value)}
              placeholder="Заголовок для поисковых систем"
              maxLength={60}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            <div className="text-xs text-gray-500 mt-1">
              {metaTitle.length}/60 символов
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Description
            </label>
            <textarea
              value={metaDescription}
              onChange={e => setMetaDescription(e.target.value)}
              placeholder="Описание для поисковых систем"
              maxLength={160}
              rows={3}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none resize-none"
            />
            <div className="text-xs text-gray-500 mt-1">
              {metaDescription.length}/160 символов
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Keywords
            </label>
            <input
              type="text"
              value={keywords}
              onChange={e => setKeywords(e.target.value)}
              placeholder="Ключевые слова через запятую"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            <div className="text-xs text-gray-500 mt-1">
              Разделяйте ключевые слова запятыми
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


