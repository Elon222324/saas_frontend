import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { Info } from 'lucide-react'

function numberOrEmpty(value) {
  if (value === null || value === undefined) return ''
  if (Number.isNaN(Number(value))) return ''
  return String(value)
}

export default function Delivery() {
  const { domain } = useParams()
  const { site_name } = useSiteSettings()

  const API_URL = import.meta.env.VITE_API_URL
  const baseDomain = import.meta.env.VITE_BASE_DOMAIN
  const full_domain = `${domain}.${baseDomain}`

  const [rules, setRules] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const hasRules = rules && rules.length > 0

  const fetchRules = async () => {
    if (!site_name) return
    setIsLoading(true)
    try {
      const res = await fetch(`${API_URL}/delivery-rules/${site_name}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          Accept: 'application/json',
        },
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Не удалось загрузить правила доставки')
      const data = await res.json()
      setRules(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      alert('Ошибка при загрузке правил доставки')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRules()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [site_name])

  const [newBaseFee, setNewBaseFee] = useState('')
  const [newFreeThreshold, setNewFreeThreshold] = useState('')

  const canCreate = useMemo(() => {
    const baseOk = newBaseFee !== '' && Number(newBaseFee) >= 0
    const thresholdOk = newFreeThreshold === '' || Number(newFreeThreshold) >= 0
    return baseOk && thresholdOk
  }, [newBaseFee, newFreeThreshold])

  const handleCreate = async () => {
    if (!canCreate) return
    setIsSaving(true)
    try {
      const payload = {
        base_fee: Number(newBaseFee),
        free_delivery_threshold: newFreeThreshold === '' ? null : Number(newFreeThreshold),
      }
      const res = await fetch(`${API_URL}/delivery-rules/${site_name}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Не удалось создать правило')
      setNewBaseFee('')
      setNewFreeThreshold('')
      await fetchRules()
    } catch (err) {
      console.error(err)
      alert('Ошибка создания правила доставки')
    } finally {
      setIsSaving(false)
    }
  }

  const handleActivate = async (ruleId) => {
    setIsSaving(true)
    try {
      const res = await fetch(`${API_URL}/delivery-rules/${site_name}/activate/${ruleId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Не удалось активировать правило')
      await fetchRules()
    } catch (err) {
      console.error(err)
      alert('Ошибка активации правила доставки')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Доставка: {full_domain}</h1>
        <Link to={`/settings/${domain}/pages`} className="text-blue-600 hover:underline text-sm flex items-center gap-1">
          ← Назад
        </Link>
      </div>

      <div className="flex items-start gap-2 text-gray-600 text-sm">
        <Info size={16} />
        <p>
          Управляйте правилами доставки. Активное правило применяется на сайте. Новое правило автоматически
          становится активным, а остальные — неактивными.
        </p>
      </div>

      <div className="border rounded-lg p-4 space-y-3">
        <h2 className="font-semibold">Создать правило</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-gray-600">Базовая стоимость</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2"
              placeholder="например, 199"
              value={numberOrEmpty(newBaseFee)}
              onChange={(e) => setNewBaseFee(e.target.value)}
              inputMode="decimal"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Порог бесплатной доставки</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2"
              placeholder="например, 1500"
              value={numberOrEmpty(newFreeThreshold)}
              onChange={(e) => setNewFreeThreshold(e.target.value)}
              inputMode="decimal"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleCreate} disabled={!canCreate || isSaving}>Создать</Button>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <h2 className="font-semibold mb-3">Правила</h2>
        {isLoading ? (
          <div>Загрузка...</div>
        ) : !hasRules ? (
          <div className="text-gray-500">Правил пока нет</div>
        ) : (
          <div className="space-y-2">
            {rules.map((r) => (
              <div key={r.id} className={`flex items-center justify-between border rounded px-3 py-2 ${r.is_active ? 'bg-green-50 border-green-200' : ''}`}>
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Базовая стоимость</div>
                    <div className="font-medium">{r.base_fee}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Порог бесплатной</div>
                    <div className="font-medium">{r.free_delivery_threshold ?? '—'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Статус</div>
                    <div className="font-medium">{r.is_active ? 'Активно' : 'Неактивно'}</div>
                  </div>
                </div>
                <div>
                  {!r.is_active && (
                    <Button variant="secondary" onClick={() => handleActivate(r.id)} disabled={isSaving}>
                      Сделать активным
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


