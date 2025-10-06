# Руководство по миграции Orders на новое API с токенами сайтов

## Текущее состояние

В настоящий момент страница Orders использует старое API через бэкенд админки:
- **Эндпоинт**: `{VITE_API_URL}/orders/{siteName}/`
- **Токен**: `localStorage.getItem('access_token')` (токен пользователя)

## Цель миграции

Перевести Orders на прямой доступ к site-api с использованием токенов сайтов:
- **Новый эндпоинт**: `https://{site}.{VITE_BASE_DOMAIN}/site-api/admin/orders/`
- **Новый токен**: Токен конкретного сайта через `useSiteToken(siteName)`

## Пошаговая инструкция

### Шаг 1: Импортировать хук

```javascript
// В начале файла src/pages/Orders/index.jsx
import { useSiteTokenString } from '@/hooks/useSiteToken'
```

### Шаг 2: Добавить получение токена

```javascript
export default function OrdersPage() {
  const [sites, setSites] = useState([])
  const [selectedSite, setSelectedSite] = useState('')
  // ... существующий код ...

  const containerSuffix = import.meta.env.VITE_CONTAINER_SUFFIX || '_app'
  const baseDomain = import.meta.env.VITE_BASE_DOMAIN

  // Убираем суффикс для получения токена
  const siteNameForToken = useMemo(() => {
    return stripAppSuffix(selectedSite)
  }, [selectedSite])

  // Получаем токен сайта
  const { token: siteToken, isLoading: tokenLoading, error: tokenError } = useSiteTokenString(
    siteNameForToken, 
    { enabled: Boolean(siteNameForToken) }
  )

  // ... остальной код ...
}
```

### Шаг 3: Обновить функцию fetchOrders

```javascript
const fetchOrders = async () => {
  if (!selectedSite || !siteToken) {
    console.log('⏳ Ожидаем токен сайта...')
    return
  }
  
  setLoadingOrders(true)
  setError('')
  try {
    // Формируем URL для нового API
    const siteForUrl = stripAppSuffix(selectedSite)
    const newApiUrl = `https://${siteForUrl}.${baseDomain}/site-api/admin/orders/`

    console.log('🔑 [Orders] → Запрашиваем новый API:', newApiUrl)

    const params = { limit, offset }
    if (searchQuery) params.search = searchQuery
    if (Array.isArray(selectedStatuses) && selectedStatuses.length > 0) {
      params.status = selectedStatuses.join(',')
    }
    
    // ... существующая логика для дат ...

    // Используем fetch напрямую с новым API
    const queryString = new URLSearchParams(params).toString()
    const res = await fetch(`${newApiUrl}?${queryString}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${siteToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    console.log('🔑 [Orders] ← Статус ответа:', res.status, res.statusText)

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Ошибка аутентификации. Проверьте токен.')
      }
      throw new Error(`Не удалось получить заказы: ${res.status}`)
    }

    const data = await res.json()
    console.log('✅ [Orders] ← Получено заказов:', data?.length || 0)
    
    // Поддержка разных форматов ответа
    const orders = Array.isArray(data)
      ? data
      : (data?.orders || data?.results || [])
    
    setOrders(orders)
  } catch (e) {
    console.error('Ошибка при получении заказов', e)
    setError('Не удалось загрузить заказы')
  } finally {
    setLoadingOrders(false)
  }
}
```

### Шаг 4: Обновить fetchOrderDetails

```javascript
const fetchOrderDetails = async (orderId) => {
  if (!selectedSite || !siteToken) return
  try {
    const siteForUrl = stripAppSuffix(selectedSite)
    const newApiUrl = `https://${siteForUrl}.${baseDomain}/site-api/admin/orders/${orderId}`

    const res = await fetch(newApiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${siteToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const data = await res.json()
    setDetailsOrder(data)
  } catch (e) {
    console.error('Ошибка при получении заказа', e)
    alert('Не удалось загрузить детали заказа')
  }
}
```

### Шаг 5: Обновить useEffect для учета токена

```javascript
// Обновляем useEffect чтобы учитывать токен
useEffect(() => {
  if (siteToken) {
    fetchOrders()
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [selectedSite, limit, offset, siteToken])

// Показываем ошибку токена если есть
useEffect(() => {
  if (tokenError) {
    console.error('Ошибка получения токена:', tokenError)
    setError(`Не удалось получить токен для сайта: ${tokenError.message}`)
  }
}, [tokenError])
```

### Шаг 6: Обновить OrderDetailsModal props

```javascript
{detailsOrder && (
  <OrderDetailsModal 
    details={detailsOrder} 
    onClose={() => setDetailsOrder(null)}
    siteNameForApi={siteNameForToken}
    headers={{ Authorization: `Bearer ${siteToken}` }}
    baseDomain={baseDomain}
    refreshOrders={fetchOrders}
    reloadDetails={async () => {
      try {
        if (!detailsOrder) return
        const id = (detailsOrder.order || detailsOrder)?.id || 
                   (detailsOrder.order || detailsOrder)?.order_id
        if (!id) return
        
        const siteForUrl = stripAppSuffix(selectedSite)
        const url = `https://${siteForUrl}.${baseDomain}/site-api/admin/orders/${id}`
        
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${siteToken}` }
        })
        
        const data = await res.json()
        setDetailsOrder(data)
      } catch (e) {
        console.error('Не удалось обновить детали заказа', e)
      }
    }}
  />
)}
```

## Проверка после миграции

1. ✅ Открыть страницу Orders
2. ✅ Выбрать сайт из списка
3. ✅ Проверить в консоли логи получения токена:
   ```
   🔑 [useSiteToken] → Получаем токен для сайта: t4a
   ✅ [useSiteToken] ← Токен получен для: t4a
   🧾 [useSiteToken] Claims: { user_id: "123", site_name: "t4a", exp: "..." }
   ```
4. ✅ Проверить что заказы загружаются через новый API
5. ✅ Проверить открытие деталей заказа
6. ✅ Проверить фильтрацию и поиск

## Откат в случае проблем

Если новое API не готово или есть проблемы, можно временно использовать обе версии:

```javascript
const USE_NEW_API = false // Флаг для переключения

const fetchOrders = async () => {
  if (USE_NEW_API) {
    // Новая логика с токеном сайта
    if (!siteToken) return
    // ... новый код ...
  } else {
    // Старая логика через бэкенд админки
    const siteNameForApi = selectedSite.endsWith(containerSuffix)
      ? selectedSite
      : `${selectedSite}${containerSuffix}`
    
    const res = await api.get(`/orders/${siteNameForApi}/`, {
      params,
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    })
    // ... старый код ...
  }
}
```

## Преимущества после миграции

1. ✅ **Прямой доступ к site-api** - меньше промежуточных слоев
2. ✅ **Единая система токенов** - как у Products, Options, Extras
3. ✅ **Автоматическое кеширование** - токен кешируется на 5 минут
4. ✅ **Лучшая производительность** - меньше запросов к бэкенду админки
5. ✅ **Консистентность** - все модули работают одинаково

## Контакты для вопросов

Если возникли вопросы по миграции:
- Посмотрите примеры в `src/pages/Sites/SiteSettings/Catalog/Products/hooks/useCategories.js`
- Изучите документацию в `src/hooks/README.md`
- Проверьте `docs/Авторизация.md` для деталей по API

