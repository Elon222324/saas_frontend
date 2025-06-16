// FILE: src/pages/Sites/SiteSettings/Products/index.tsx
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import CategoryTree from './components/CategoryTree'
import ProductsTable from './components/ProductsTable'
import Toolbar from './components/Toolbar'
import ProductForm from './components/ProductForm'
import EmptyState from './components/EmptyState'
import SkeletonTable from './components/SkeletonTable'
import { useProducts } from './hooks/useProducts'

export default function Products() {
  const { domain } = useParams()
  const site_name = domain ?? ''
  const [category, setCategory] = useState<string>()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const limit = 20
  const [formOpen, setFormOpen] = useState(false)
  const [activeOnly] = useState(false)

  const filters = { category, search, page, limit, activeOnly }
  const { data, isLoading } = useProducts(site_name, filters)

  return (
    <div className="flex h-full">
      <aside className="w-1/4 border-r">
        <CategoryTree site={site_name} onSelect={setCategory} />
      </aside>
      <section className="flex-1 flex flex-col overflow-hidden">
        <Toolbar onAdd={() => setFormOpen(true)} onSearch={setSearch} activeOnly={activeOnly} />
        {isLoading ? (
          <SkeletonTable />
        ) : data && data.results.length ? (
          <ProductsTable products={data.results} />
        ) : (
          <EmptyState onAdd={() => setFormOpen(true)} />
        )}
      </section>
      <ProductForm open={formOpen} onClose={() => setFormOpen(false)} onSubmit={() => setFormOpen(false)} />
    </div>
  )
}
