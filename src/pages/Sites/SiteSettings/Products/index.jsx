// FILE: src/pages/Sites/SiteSettings/Products/index.jsx
import { useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import CategoryTree from './components/CategoryTree'
import ProductsTable from './components/ProductsTable'
import Toolbar from './components/Toolbar'
import ProductForm from './components/ProductForm'
import EmptyState from './components/EmptyState'
import { useProducts } from './hooks'

export default function Products() {
  const { domain } = useParams()
  const site_name = domain ?? ''
  const clientRef = useRef(new QueryClient())
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useState({ search: '' })
  const { data } = useProducts(site_name, filters)
  const hasProducts = (data?.results || []).length > 0

  const handleSearch = (q) => setFilters((f) => ({ ...f, search: q }))

  const page = (
    <div className="flex gap-4">
      <CategoryTree site={site_name} />
      <div className="flex-1 space-y-4">
        <Toolbar onAdd={() => setOpen(true)} onSearch={handleSearch} />
        {hasProducts ? (
          <ProductsTable site={site_name} filters={filters} />
        ) : (
          <EmptyState onAdd={() => setOpen(true)} />
        )}
      </div>
      <ProductForm site={site_name} open={open} onOpenChange={setOpen} />
    </div>
  )

  return (
    <QueryClientProvider client={clientRef.current}>
      {page}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
