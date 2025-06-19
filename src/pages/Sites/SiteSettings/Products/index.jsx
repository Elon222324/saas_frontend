import { useRef, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useParams } from 'react-router-dom'

import CategoryList from './components/CategoryList/CategoryList'
import ProductsList from './components/ProductsList/ProductsList'

export default function Products() {
  const queryClientRef = useRef(new QueryClient())
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [tab, setTab] = useState('categories')
  const { domain } = useParams()
  const siteName = `${domain}_app`

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <div className="h-full p-4">
        {(tab === 'categories' || tab === 'labels') ? (
          <div className="flex h-full">
            <aside className="w-64 border-r bg-white p-4">
              <CategoryList
                selected={selectedCategory}
                onSelect={setSelectedCategory}
                tab={tab}
                setTab={setTab}
              />
            </aside>
            <main className="flex-1 overflow-auto p-4">
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
