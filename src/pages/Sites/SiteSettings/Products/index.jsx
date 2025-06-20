import { useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useParams } from 'react-router-dom'

import CategoryList from './components/CategoryList/CategoryList'
import ProductsList from './components/ProductsList/ProductsList'

export default function Products() {
  const queryClientRef = useRef(new QueryClient())
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [tab, setTab] = useState('categories')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const handleTabChange = (value) => {
    setTab(value)
    if (value === 'categories') setSelectedCategory(null)
    if (value === 'labels') setSelectedCategory('no_label')
  }
  const { domain } = useParams()
  const siteName = `${domain}_app`

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <div className="h-full p-4">
        {(tab === 'categories' || tab === 'labels') ? (
          <div className="relative flex h-full">
            <button
              onClick={() => setSidebarOpen(prev => !prev)}
              className="absolute left-0 top-0 z-20 rounded bg-white p-2 shadow md:hidden"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {sidebarOpen && (
              <div
                className="fixed inset-0 z-10 bg-black/50 backdrop-blur-sm md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            <aside
              className={`fixed inset-y-0 left-0 z-20 w-64 border-r bg-white p-4 transform transition-transform duration-300 md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
              <CategoryList
                selected={selectedCategory}
                onSelect={setSelectedCategory}
                tab={tab}
                setTab={handleTabChange}
              />
            </aside>
            <main
              className={`flex-1 overflow-auto p-4 transition-[margin] duration-300 ${sidebarOpen ? 'md:ml-64' : 'ml-0'}`}
            >
              <ProductsList
                category={tab === 'categories' ? selectedCategory : null}
                labels={tab === 'labels' && selectedCategory && selectedCategory !== 'no_label' ? [selectedCategory] : null}
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
