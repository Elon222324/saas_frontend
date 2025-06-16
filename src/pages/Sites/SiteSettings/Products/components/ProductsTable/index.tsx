// FILE: src/pages/Sites/SiteSettings/Products/components/ProductsTable/index.tsx
import type { Product } from '@/types/products'

interface Props {
  products: Product[]
}

export default function ProductsTable({ products }: Props) {
  return (
    <table className="min-w-full text-sm">
      <thead>
        <tr>
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
