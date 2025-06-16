// FILE: src/pages/Sites/SiteSettings/Products/components/ProductsTable/index.jsx
import { useProducts } from '../../hooks'

export default function ProductsTable({ site, filters }) {
  const { data } = useProducts(site, filters)
  const products = data?.results || []

  if (!products.length) return null

  return (
    <table className="min-w-full text-sm border">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 text-left">Название</th>
          <th className="p-2 text-left">Цена</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id} className="border-t">
            <td className="p-2">{p.title}</td>
            <td className="p-2">{p.price}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
