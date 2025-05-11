// src/components/BlockDetails.jsx
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function BlockDetails({ block, data, onSave }) {
  const [form, setForm] = useState({})

  // при смене блока — подхватываем свежие данные
  useEffect(() => {
    setForm(data || {})
  }, [data])

  if (!block) {
    return <p className="text-gray-500 text-sm">Выберите блок слева для просмотра</p>
  }

  // Рендерим input под каждый ключ
  const renderField = (key, value) => {
    const commonProps = {
      id: key,
      name: key,
      value: form[key] ?? '',
      onChange: (e) =>
        setForm(prev => ({ ...prev, [key]: e.target.value })),
      className: 'border px-2 py-1 rounded w-full',
    }

    if (typeof value === 'boolean') {
      return (
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form[key] || false}
            onChange={(e) =>
              setForm(prev => ({ ...prev, [key]: e.target.checked }))
            }
          />
          {key}
        </label>
      )
    }

    // все остальное — текст
    return (
      <div className="space-y-1">
        <label htmlFor={key} className="block text-sm font-medium">
          {key}
        </label>
        <input type="text" {...commonProps} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        Редактирование "{block.label || block.type}"
      </h2>

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
