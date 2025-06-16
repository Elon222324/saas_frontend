// FILE: src/pages/Sites/SiteSettings/Products/components/EmptyState.jsx
import { Button } from '@/components/ui/button'

export default function EmptyState({ onAdd }) {
  return (
    <div className="text-center py-20 space-y-4">
      <p className="text-gray-500">Товары не найдены</p>
      <Button onClick={onAdd} className="bg-blue-600 text-white">Добавить первый товар</Button>
    </div>
  )
}
