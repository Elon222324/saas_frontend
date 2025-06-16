// FILE: src/pages/Sites/SiteSettings/Products/components/EmptyState.tsx
import { Button } from '@/components/ui/button'

export default function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
      <p className="mb-4 text-gray-500">Товаров пока нет</p>
      <Button onClick={onAdd}>Добавить первый товар</Button>
    </div>
  )
}
