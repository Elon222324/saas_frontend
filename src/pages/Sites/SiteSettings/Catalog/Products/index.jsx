import { useRef, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import CategoryList from './components/CategoryList/CategoryList'
import ProductsList from './components/ProductsList/ProductsList'

export default function Products() {
  const queryClientRef = useRef(new QueryClient())
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [tab, setTab] = useState('categories')
  const [collapsed, setCollapsed] = useState(false)

  const handleTabChange = (value) => {
    setTab(value)
    if (value === 'categories') setSelectedCategory(null)
    if (value === 'labels') setSelectedCategory('no_label')
  }

  const { domain } = useParams()
  const siteName = `${domain}_app`

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <div className="h-full px-0 pt-0 pb-4">
        {(tab === 'categories' || tab === 'labels') ? (
          <div className="flex h-full">
            <aside
              className={`relative transition-all duration-300 bg-white border-r ${
                collapsed ? 'w-8' : 'w-64' // Немного увеличил ширину в свернутом виде для текста
              }`}
            >
              {/* --- СУЩЕСТВУЮЩИЙ КОНТЕНТ (КОГДА РАЗВЕРНУТО) --- */}
              {!collapsed && (
                <div className="p-1">
                  <CategoryList
                    selected={selectedCategory}
                    onSelect={setSelectedCategory}
                    tab={tab}
                    setTab={handleTabChange}
                  />
                </div>
              )}

              {/* --- НОВЫЙ БЛОК (КОГДА СВЕРНУТО) --- */}
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

              {/* --- СУЩЕСТВУЮЩАЯ КНОПКА СВОРАЧИВАНИЯ/РАЗВОРАЧИВАНИЯ --- */}
              <button
                onClick={() => setCollapsed((v) => !v)}
                className="absolute -right-3 top-4 z-10 flex h-6 w-6 items-center justify-center rounded-full border bg-white shadow hover:bg-gray-100"
              >
                {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
            </aside>

            <main className="flex-1 overflow-auto p-4">
              <ProductsList
                category={tab === 'categories' ? selectedCategory : null}
                labels={
                  tab === 'labels' && selectedCategory && selectedCategory !== 'no_label'
                    ? [selectedCategory]
                    : null
                }
                noLabel={tab === 'labels' && selectedCategory === 'no_label'}
              />
            </main>
          </div>
        ) : null}
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}