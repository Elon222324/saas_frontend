import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import CategoryList from './components/CategoryList/CategoryList'
import LibraryList from './components/LibraryList/LibraryList'

export default function LibraryPage() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="h-full px-0 pt-0 pb-4">
        <div className="flex h-full">
          <aside
            className={`relative transition-all duration-300 bg-white border-r ${
              collapsed ? 'w-8' : 'w-64'
            }`}
          >
            {!collapsed && (
              <div className="p-1">
                <CategoryList
                  selected={selectedCategory}
                  onSelect={setSelectedCategory}
                />
              </div>
            )}

            {collapsed && (
              <div
                onClick={() => setCollapsed(false)}
                className="flex h-full cursor-pointer items-center justify-center hover:bg-gray-100"
                title="Развернуть категории"
              >
                <span
                  className="font-semibold text-sm text-gray-600 tracking-wider"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  Категории
                </span>
              </div>
            )}

            <button
              onClick={() => setCollapsed((v) => !v)}
              className="absolute -right-3 top-4 z-10 flex h-6 w-6 items-center justify-center rounded-full border bg-white shadow hover:bg-gray-100"
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </aside>

          <main className="flex-1 overflow-auto p-4 space-y-4">
            <div className="flex justify-end">
            </div>
            <LibraryList categoryCode={selectedCategory} />
          </main>
        </div>
    </div>
  )
}