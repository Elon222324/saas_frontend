// FILE: src/pages/Sites/SiteSettings/Products/index.jsx
import { useRef, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import CategoryList from './components/CategoryList/CategoryList'
import ProductsList from './components/ProductsList'

export default function Products() {
  const queryClientRef = useRef(new QueryClient())
  const [selectedCategory, setSelectedCategory] = useState(null)

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <div className="flex h-full">
        <aside className="w-64 border-r bg-white p-4">
          <CategoryList
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </aside>
        <main className="flex-1 overflow-auto p-4">
          <ProductsList category={selectedCategory} />
        </main>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
