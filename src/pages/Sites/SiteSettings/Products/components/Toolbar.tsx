// FILE: src/pages/Sites/SiteSettings/Products/components/Toolbar.tsx
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState, useRef } from 'react'

function useDebounce(callback: (v: string) => void, delay: number) {
  const timer = useRef<number>()
  return (value: string) => {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => callback(value), delay)
  }
}

interface Props {
  onAdd: () => void
  onSearch: (value: string) => void
  activeOnly: boolean
}

export default function Toolbar({ onAdd, onSearch }: Props) {
  const [value, setValue] = useState('')

  const debounced = useDebounce(onSearch, 300)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    debounced(e.target.value)
  }

  return (
    <div className="p-4 flex gap-2 items-center border-b">
      <Button onClick={onAdd}>+ Новый товар</Button>
      <Input value={value} onChange={handleChange} placeholder="Поиск" />
    </div>
  )
}
