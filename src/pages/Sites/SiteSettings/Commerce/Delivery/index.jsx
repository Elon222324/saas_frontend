import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { Info } from 'lucide-react'

const DELIVERY_TYPES = [
  { value: 'delivery', label: 'Доставка' },
  { value: 'pickup', label: 'Самовывоз' },
]

function numberOrEmpty(value) {
  if (value === null || value === undefined) return ''
  if (Number.isNaN(Number(value))) return ''
  return String(value)
}

export default function Delivery() {
  const { domain } = useParams()
  const { data, site_name, siteToken, refetch } = useSiteSettings()

  const baseDomain = import.meta.env.VITE_BASE_DOMAIN
  const API_URL = import.meta.env.VITE_API_URL
  const full_domain = `${domain}.${baseDomain}`
  
  // Убираем суффикс _app для нового API
  const siteNameForApi = site_name?.replace('_app', '') || domain
  const baseApiUrl = `https://${siteNameForApi}.${baseDomain}/site-api/admin/delivery-rules/`

  const [rules, setRules] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [deliveryType, setDeliveryType] = useState('delivery')
  const [hasInitialized, setHasInitialized] = useState(false)

  const hasRules = rules && rules.length > 0

  const fetchRules = async () => {
    if (!siteToken?.token) {
      console.log('⏳ [Delivery] Ожидание токена...')
      return
    }
    
    setIsLoading(true)
    try {
      console.log('🔑 [Delivery] → запрашиваю правила доставки:', baseApiUrl)

      const res = await fetch(baseApiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${siteToken.token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      console.log('🔑 [Delivery] ← статус ответа:', res.status, res.statusText)

      if (!res.ok) {
        if (res.status === 401) {
          console.error('❌ [Delivery] Ошибка аутентификации (401)')
          throw new Error('Ошибка аутентификации. Проверьте токен.')
        }
        throw new Error(`Не удалось загрузить правила доставки: ${res.status}`)
      }

      const data = await res.json()
      console.log('✅ [Delivery] ← получено правил:', data?.length || 0)
      setRules(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('❌ [Delivery] Ошибка:', err)
      alert('Ошибка при загрузке правил доставки: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Инициализация delivery_type из данных сайта
  useEffect(() => {
    if (data?.commerce?.delivery_type && !hasInitialized) {
      setDeliveryType(data.commerce.delivery_type)
      setHasInitialized(true)
    } else if (!hasInitialized && data) {
      setHasInitialized(true)
    }
  }, [data, hasInitialized])

  useEffect(() => {
    fetchRules()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteToken?.token])

  const [newBaseFee, setNewBaseFee] = useState('')
  const [newFreeThreshold, setNewFreeThreshold] = useState('')

  const canCreate = useMemo(() => {
    const baseOk = newBaseFee !== '' && Number(newBaseFee) >= 0
    const thresholdOk = newFreeThreshold === '' || Number(newFreeThreshold) >= 0
    return baseOk && thresholdOk
  }, [newBaseFee, newFreeThreshold])

  const handleCreate = async () => {
    if (!canCreate || !siteToken?.token) return
    setIsSaving(true)
    try {
      const payload = {
        base_fee: Number(newBaseFee),
        free_delivery_threshold: newFreeThreshold === '' ? null : Number(newFreeThreshold),
      }

      console.log('🔑 [Delivery] → создаю правило:', baseApiUrl)
      console.log('🔑 [Delivery] → данные:', payload)

      const res = await fetch(baseApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${siteToken.token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      console.log('🔑 [Delivery] ← статус ответа:', res.status, res.statusText)

      if (!res.ok) {
        if (res.status === 401) {
          console.error('❌ [Delivery] Ошибка аутентификации (401)')
          throw new Error('Ошибка аутентификации. Проверьте токен.')
        }
        throw new Error(`Не удалось создать правило: ${res.status}`)
      }

      const result = await res.json()
      console.log('✅ [Delivery] ← создано правило:', result)

      setNewBaseFee('')
      setNewFreeThreshold('')
      await fetchRules()
    } catch (err) {
      console.error('❌ [Delivery] Ошибка создания:', err)
      alert('Ошибка создания правила доставки: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleActivate = async (ruleId) => {
    if (!siteToken?.token) return
    setIsSaving(true)
    try {
      const activateUrl = `${baseApiUrl}activate/${ruleId}`
      console.log('🔑 [Delivery] → активирую правило:', activateUrl)

      const res = await fetch(activateUrl, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${siteToken.token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      console.log('🔑 [Delivery] ← статус ответа:', res.status, res.statusText)

      if (!res.ok) {
        if (res.status === 401) {
          console.error('❌ [Delivery] Ошибка аутентификации (401)')
          throw new Error('Ошибка аутентификации. Проверьте токен.')
        }
        if (res.status === 404) {
          console.error('❌ [Delivery] Правило не найдено (404)')
          throw new Error('Правило не найдено')
        }
        throw new Error(`Не удалось активировать правило: ${res.status}`)
      }

      console.log('✅ [Delivery] ← правило активировано')
      await fetchRules()
    } catch (err) {
      console.error('❌ [Delivery] Ошибка активации:', err)
      alert('Ошибка активации правила доставки: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveDeliveryType = async () => {
    try {
      const payload = {
        'commerce.delivery_type': deliveryType,
      }

      const res = await fetch(
        `${API_URL}/schema/site-settings/${site_name}`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      )

      if (!res.ok) throw new Error('Ошибка сохранения')
      alert('Тип доставки сохранен')
      await refetch()
    } catch (err) {
      console.error(err)
      alert('Не удалось сохранить тип доставки')
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

      {/* Выбор типа доставки */}
      <div className="border rounded-lg p-4 space-y-3 bg-blue-50">
        <h2 className="font-semibold">Тип доставки</h2>
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Выберите способ доставки/самовывоза
            </label>
            <select
              value={deliveryType}
              onChange={(e) => setDeliveryType(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {DELIVERY_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={handleSaveDeliveryType} disabled={isSaving}>
            {isSaving ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
        <p className="text-xs text-gray-600">
          <strong>Доставка</strong> - заказ доставляется клиенту<br />
          <strong>Самовывоз</strong> - клиент забирает заказ сам
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


