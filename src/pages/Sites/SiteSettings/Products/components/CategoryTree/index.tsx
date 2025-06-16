// FILE: src/pages/Sites/SiteSettings/Products/components/CategoryTree/index.tsx
import { useState } from 'react'
import { useCategories } from '../../hooks/useCategories'
import { Button } from '@/components/ui/button'

interface Props {
  site: string
  onSelect: (code?: string) => void
}

export default function CategoryTree({ site, onSelect }: Props) {
  const { data } = useCategories(site)
  const [active, setActive] = useState<string>()

  const handleSelect = (code?: string) => {
    setActive(code)
    onSelect(code)
  }

  return (
    <div className="p-4 space-y-2">
      <Button className="w-full" onClick={() => handleSelect(undefined)}>
        Все категории
      </Button>
      {data?.map((c) => (
        <Button
          key={c.code}
          variant={active === c.code ? undefined : 'secondary'}
          className="w-full justify-start"
          onClick={() => handleSelect(c.code)}
        >
          {c.name}
        </Button>
      ))}
    </div>
  )
}
