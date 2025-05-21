// src/components/BlockDetails.jsx
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { previewBlocks } from '@/preview/blockMap'

export default function BlockDetails({ block, data, onSave }) {
  const [form, setForm] = useState({})

  useEffect(() => {
    if (!data) return

    // Заглушка для блоков с навигацией
    if (block?.type === 'navigation' || block?.type === 'menu') {
      const withDefaults = {
        ...data,
        items: Array.isArray(data.items) && data.items.length > 0
          ? data.items
          : [
              { name: 'Главная', link: '/' },
              { name: 'О нас', link: '/about' },
              { name: 'Контакты', link: '/contact' },
            ],
      }
      setForm(withDefaults)
    } else {
      setForm(data)
    }
  }, [data, block?.type])

  if (!block) {
    return <p className="text-gray-500 text-sm">Выберите блок слева для просмотра</p>
  }

  const renderField = (key, value) => {
    const commonProps = {
      id: key,
      name: key,
      value: form[key] ?? '',
      onChange: (e) => setForm(prev => ({ ...prev, [key]: e.target.value })),
      className: 'border px-2 py-1 rounded w-full',
    }

    if (typeof value === 'boolean') {
      return (
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form[key] || false}
            onChange={(e) => setForm(prev => ({ ...prev, [key]: e.target.checked }))}
          />
          {key}
        </label>
      )
    }

    if (Array.isArray(value)) {
      return (
        <div className="space-y-1">
          <label className="block text-sm font-medium">{key}</label>
          <p className="text-xs text-gray-500">[Массив значений — не редактируется здесь]</p>
        </div>
      )
    }

    return (
      <div className="space-y-1">
        <label htmlFor={key} className="block text-sm font-medium">{key}</label>
        <input type="text" {...commonProps} />
      </div>
    )
  }

  const renderPreview = () => {
    const PreviewComponent = previewBlocks[block.type]
    if (!PreviewComponent) {
      return (
        <div className="border rounded shadow-sm p-4 bg-gray-50 text-sm text-gray-500">
          Нет визуального preview для блока типа <strong>{block.type}</strong>
        </div>
      )
    }

    const mockNav = [
      { label: 'Главная', link: '/' },
      { label: 'О нас', link: '/about' },
      { label: 'Контакты', link: '/contact' },
    ]

    // Обработка особых типов
    const previewProps =
      block.type === 'navigation'
        ? { settings: {}, navigation: form.items ?? mockNav }
        : block.type === 'menu'
        ? { items: form.items ?? mockNav }
        : { ...form }

    return (
      <div className="border rounded shadow-sm p-4 bg-white space-y-2">
        <p className="text-sm text-gray-500">Предпросмотр блока:</p>
        <div className="border border-gray-200 rounded p-2 bg-gray-50">
          <PreviewComponent {...previewProps} />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Редактирование "{block.label || block.type}"</h2>
        {renderPreview()}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSave(block.id, form)
        }}
        className="space-y-4"
      >
        {Object.entries(form).map(([key, val]) => (
          <div key={key}>{renderField(key, val)}</div>
        ))}

        <Button type="submit">Сохранить</Button>
      </form>
    </div>
  )
}
