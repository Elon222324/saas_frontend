import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import CloudSidebar from './CloudSidebar'
import CloudGrid from './CloudGrid'
import CloudStorageInfo from './CloudStorageInfo'
import useCloudStorage from './hooks/useCloudStorage'
import useTemplateGallery from './hooks/useTemplateGallery'
import { Sparkles } from 'lucide-react'

export default function CloudModal({ isOpen, category, onSelect }) {
  const [activeTab, setActiveTab] = useState('site') // 'site' | 'library' | 'shared'
  const [activeCategory, setActiveCategory] = useState(null)

  const {
    groups: userGroups,
    files: userFiles,
    selected,
    setSelected,
    used,
    limit,
    handleUploadClick,
    uploadInputRef,
    handleInputChange,
    createCategory,
    deleteImage,
    updateImage,
  } = useCloudStorage()

  const {
    groups: galleryGroups,
    files: galleryFiles,
  } = useTemplateGallery()

  const sharedGroups = [
    {
      title: 'Общие',
      categories: ['logo', 'backgrounds', 'products'],
    },
  ]
  const sharedFiles = [
    { id: 's1', name: 'shared1.png', url: 'https://via.placeholder.com/150?text=Shared1', category: 'logo' },
    { id: 's2', name: 'shared2.png', url: 'https://via.placeholder.com/150?text=Shared2', category: 'products' },
  ]

  const currentGroups =
    activeTab === 'site' ? userGroups :
    activeTab === 'library' ? galleryGroups :
    sharedGroups

  const currentFiles =
    activeTab === 'site' ? userFiles :
    activeTab === 'library' ? galleryFiles :
    sharedFiles

  const filtered = currentFiles.filter(f => !activeCategory || f.category === activeCategory)

  return (
    <Dialog
      open={isOpen}
      onClose={() => onSelect(null)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
    >
      <input
        ref={uploadInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleInputChange}
      />
      <div className="bg-white rounded-lg w-full max-w-4xl h-[32rem] flex flex-col shadow-lg">
        <div className="border-b px-4 pt-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-bold mb-2">Выбрать изображение</h2>
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab('site')}
                  className={`pb-2 font-medium ${activeTab === 'site' ? 'border-b-2 border-blue-600' : 'text-gray-500'}`}
                >
                  Файлы сайта
                </button>
                <button
                  onClick={() => setActiveTab('library')}
                  className={`pb-2 font-medium ${activeTab === 'library' ? 'border-b-2 border-blue-600' : 'text-gray-500'}`}
                >
                  Библиотека
                </button>
                <button
                  onClick={() => setActiveTab('shared')}
                  className={`pb-2 font-medium ${activeTab === 'shared' ? 'border-b-2 border-blue-600' : 'text-gray-500'}`}
                >
                  Общие
                </button>
              </div>
            </div>
            {activeTab === 'site' && (
              <div className="flex flex-col gap-2 items-end">
                <button
                  onClick={() => alert('Открыть генератор ИИ')}
                  className="text-sm text-gray-600 hover:text-black flex items-center gap-1"
                >
                  <Sparkles className="w-4 h-4" />
                  Сгенерировать с помощью ИИ
                </button>
                <button
                  onClick={() => handleUploadClick(activeCategory)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Загрузить с компьютера
                </button>


              </div>
            )}
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <CloudSidebar
            groups={currentGroups}
            active={activeCategory}
            onSelectCategory={setActiveCategory}
            onAddCategory={createCategory}
          />
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            <CloudGrid
              files={filtered}
              selected={selected}
              onSelect={setSelected}
              onDelete={deleteImage}
              onEdit={(file) => {
                const alt = window.prompt('Alt text', file.alt_text || '')
                if (alt !== null) {
                  updateImage(file.id, { alt_text: alt })
                }
              }}
            />
          </div>
        </div>

        <div className="border-t px-4 py-3 flex justify-between items-center">
          {activeTab === 'site' ? (
            <CloudStorageInfo used={used} limit={limit} compact />
          ) : <div />}

          <div className="flex gap-2">
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
      </div>
    </Dialog>
  )
}
