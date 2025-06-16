import { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import CloudSidebar from './CloudSidebar'
import CloudGrid from './CloudGrid'
import CloudStorageInfo from './CloudStorageInfo'
import useCloudStorage from './hooks/useCloudStorage'
import useTemplateGallery from './hooks/useTemplateGallery'
import { Sparkles, Loader2 } from 'lucide-react'

export default function CloudModal({ isOpen, category, onSelect }) {
  const [activeTab, setActiveTab] = useState('site')
  const [activeCategory, setActiveCategory] = useState(null)
  const [search, setSearch] = useState('')

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
    isUploading,
  } = useCloudStorage()

  const {
    groups: galleryGroups,
    files: galleryFiles,
  } = useTemplateGallery()

  useEffect(() => {
    if (!isOpen || !category) return
    const code = `${category}-${activeTab}`
    const groups = activeTab === 'site' ? userGroups : galleryGroups
    console.log(`[📂 CloudModal] Проверка категорий для вкладки "${activeTab}", targetCode:`, code)

    for (const group of groups) {
      for (const child of group.children || []) {
        console.log(`[🔍 CloudModal] Проверка →`, child.code, child.id, child.title)
        if (child.code === code) {
          console.log(`[✅ CloudModal] Найдена категория:`, child)
          setActiveCategory(child.id)
          return
        }
      }
    }
  }, [isOpen, category, activeTab, userGroups, galleryGroups])

  const currentGroups = activeTab === 'site' ? userGroups : galleryGroups
  const currentFiles = activeTab === 'site' ? userFiles : galleryFiles

  const filtered = currentFiles.filter((f) => {
    const term = search.trim().toLowerCase()
    if (term) {
      return (
        f.name?.toLowerCase().includes(term) ||
        f.filename?.toLowerCase().includes(term)
      )
    }
    return !activeCategory || f.category === activeCategory
  })

  const handleSelect = (file) => {
    const relativeUrl = file.url?.startsWith('/')
      ? file.url
      : new URL(file.url, window.location.origin).pathname
    onSelect?.(relativeUrl)
  }

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
                  className={`pb-2 font-medium ${
                    activeTab === 'site' ? 'border-b-2 border-blue-600' : 'text-gray-500'
                  }`}
                >
                  Файлы сайта
                </button>
                <button
                  onClick={() => setActiveTab('library')}
                  className={`pb-2 font-medium ${
                    activeTab === 'library' ? 'border-b-2 border-blue-600' : 'text-gray-500'
                  }`}
                >
                  Библиотека
                </button>
              </div>
            </div>
            {activeTab === 'site' && (
              <div className="flex flex-col gap-2 items-end">
                <button
                  onClick={() => alert('Генератор ИИ-картинок еще в разработке')}
                  className="text-sm text-gray-600 hover:text-black flex items-center gap-1"
                >
                  <Sparkles className="w-4 h-4" />
                  Сгенерировать с помощью ИИ
                </button>
                <button
                  onClick={() => handleUploadClick(activeCategory)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                >
                  {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
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
            onSearchChange={setSearch}
          />
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            <CloudGrid
              files={filtered}
              selected={selected}
              onSelect={(file) => {
                setSelected(file)
                handleSelect(file)
              }}
              onDelete={activeTab === 'site' ? deleteImage : undefined}
              onEdit={
                activeTab === 'site'
                  ? (file) => {
                      const alt = window.prompt('Alt text', file.alt_text || '')
                      if (alt !== null) {
                        updateImage(file.id, { alt_text: alt })
                      }
                    }
                  : undefined
              }
              onCloseModal={() => onSelect(null)}
            />
          </div>
        </div>

        <div className="border-t px-4 py-3 flex justify-between items-center">
          {activeTab === 'site' ? (
            <CloudStorageInfo files={userFiles} limit={250} compact />
          ) : (
            <div />
          )}
          <div className="flex gap-2">
            <button
              className="px-4 py-2 rounded bg-gray-200"
              onClick={() => onSelect(null)}
            >
              Отмена
            </button>
            <button
              className="px-4 py-2 rounded bg-blue-600 text-white disabled:bg-gray-300"
              disabled={!selected}
              onClick={() => handleSelect(selected)}
            >
              Выбрать
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
