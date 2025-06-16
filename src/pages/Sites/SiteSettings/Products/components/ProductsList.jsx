// FILE: src/pages/Sites/SiteSettings/Products/components/ProductsList.jsx
const mockProducts = [
  { id: 1, categoryId: 1, title: 'Маргарита', price: 250 },
  { id: 2, categoryId: 1, title: 'Пепперони', price: 290 },
  { id: 3, categoryId: 2, title: 'Кола 0.5', price: 60 },
  { id: 4, categoryId: 3, title: 'Чизкейк', price: 120 },
]

export default function ProductsList({ category }) {
  const products = category
    ? mockProducts.filter(p => p.categoryId === category)
    : mockProducts

  if (!products.length) {
    return <p className="text-gray-500">Нет товаров в этой категории.</p>
  }

  return (
    <table className="min-w-full border rounded">
      <thead>
        <tr className="bg-gray-100 text-left">
          <th className="px-4 py-2">ID</th>
          <th className="px-4 py-2">Название</th>
          <th className="px-4 py-2">Цена</th>
        </tr>
      </thead>
      <tbody>
        {products.map(prod => (
          <tr key={prod.id} className="border-t">
            <td className="px-4 py-2">{prod.id}</td>
            <td className="px-4 py-2">{prod.title}</td>
            <td className="px-4 py-2">{prod.price}₽</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
