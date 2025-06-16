// FILE: src/pages/Sites/SiteSettings/Products/components/ProductForm/index.tsx
import { Dialog } from '@headlessui/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const schema = z.object({
  title: z.string().min(1),
  price: z.number().min(0),
})

type FormData = z.infer<typeof schema>

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (data: FormData) => void
}

export default function ProductForm({ open, onClose, onSubmit }: Props) {
  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-black p-4 rounded space-y-2 w-80">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <Input placeholder="Название" {...register('title')} />
          <Input type="number" placeholder="Цена" {...register('price', { valueAsNumber: true })} />
          {formState.errors.title && <p className="text-red-500 text-sm">Требуется название</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit">Сохранить</Button>
          </div>
        </form>
      </div>
    </Dialog>
  )
}
