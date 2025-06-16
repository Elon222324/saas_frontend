// FILE: src/pages/Sites/SiteSettings/Products/components/ProductForm/index.jsx
import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { useProductMutations } from '../../hooks'

export default function ProductForm({ site, open, onOpenChange }) {
  const { addProduct } = useProductMutations(site)
  const form = useForm({ defaultValues: { title: '', price: 0 } })
  const [step, setStep] = useState(0)

  const submit = async (values) => {
    await addProduct(values)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onClose={() => onOpenChange(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded space-y-4 w-96">
        <h2 className="font-semibold text-lg">Новый товар</h2>
        {step === 0 && (
          <div className="space-y-2">
            <input placeholder="Название" {...form.register('title')} className="border rounded px-2 py-1 w-full" />
            <Button onClick={() => setStep(1)} className="w-full">Далее</Button>
          </div>
        )}
        {step === 1 && (
          <form onSubmit={form.handleSubmit(submit)} className="space-y-2">
            <input type="number" placeholder="Цена" {...form.register('price', { valueAsNumber: true })} className="border rounded px-2 py-1 w-full" />
            <div className="flex justify-end gap-2">
              <Button type="button" onClick={() => setStep(0)}>Назад</Button>
              <Button type="submit" className="bg-blue-600 text-white">Создать</Button>
            </div>
          </form>
        )}
      </div>
    </Dialog>
  )
}
