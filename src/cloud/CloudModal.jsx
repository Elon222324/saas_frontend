import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import CloudSidebar from './CloudSidebar'
import CloudGrid from './CloudGrid'
import CloudUploadZone from './CloudUploadZone'
import CloudStorageInfo from './CloudStorageInfo'
import useCloudStorage from './hooks/useCloudStorage'

export default function CloudModal({ isOpen, category, onSelect }) {
  const { categories, files, selected, setSelected, used, limit } = useCloudStorage()
  const [activeCategory, setActiveCategory] = useState(category || categories[0])

  const filtered = files.filter(f => !activeCategory || f.category === activeCategory)

  return (
    <Dialog open={isOpen} onClose={() => onSelect(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[32rem] flex flex-col shadow-lg">
        <h2 className="text-lg font-bold p-4 border-b">Выбрать изображение</h2>
        <div className="flex flex-1 overflow-hidden">
          <CloudSidebar categories={categories} active={activeCategory} onSelectCategory={setActiveCategory} />
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            <CloudGrid files={filtered} selected={selected} onSelect={setSelected} />
            <CloudUploadZone />
            <CloudStorageInfo used={used} limit={limit} />
          </div>
        </div>
        <div className="border-t p-3 flex justify-end gap-2">
          <button className="px-4 py-2 rounded bg-gray-200" onClick={() => onSelect(null)}>Отмена</button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:bg-gray-300"
            disabled={!selected}
            onClick={() => onSelect(selected?.url)}
          >
            Выбрать
          </button>
        </div>
      </div>
    </Dialog>
  )
}
