// FILE: src/pages/Sites/SiteSettings/Products/components/CategoryTree/index.jsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useCategories, useProductMutations } from '../../hooks'

const schema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
})

export default function CategoryTree({ site }) {
  const { data: categories = [] } = useCategories(site)
  const { addCategory } = useProductMutations(site)
  const [open, setOpen] = useState(false)
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { code: '', name: '' } })

  const onSubmit = async (values) => {
    await addCategory(values)
    form.reset()
  }

  const content = (
    <div className="p-4 space-y-4 w-64">
      <h3 className="font-semibold">Категории</h3>
      <ul className="space-y-1 text-sm">
        {categories.map((c) => (
          <li key={c.id}>{c.name}</li>
        ))}
      </ul>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <input placeholder="code" {...form.register('code')} className="border rounded px-2 py-1 w-full" />
        <input placeholder="name" {...form.register('name')} className="border rounded px-2 py-1 w-full" />
        <Button type="submit" className="w-full">Добавить</Button>
      </form>
    </div>
  )

  return (
    <>
      <div className="lg:block hidden border-r">{content}</div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className="lg:hidden px-4 py-2 border">Категории</SheetTrigger>
        <SheetContent className="p-0">{content}</SheetContent>
      </Sheet>
    </>
  )
}
