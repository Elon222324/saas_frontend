// FILE: src/pages/Sites/SiteSettings/Products/components/Toolbar.jsx
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Toolbar({ onAdd, onSearch }) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const id = setTimeout(() => onSearch(query), 300)
    return () => clearTimeout(id)
  }, [query, onSearch])

  return (
    <div className="flex justify-between items-center mb-4 gap-2 flex-wrap">
      <Button onClick={onAdd} className="bg-blue-600 text-white px-4 py-2 rounded">+ Новый товар</Button>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск..."
        className="border px-2 py-1 rounded"
      />
    </div>
  )
}
