# 📄 context/

Здесь лежат глобальные или полу-глобальные React Context'ы, которые могут использоваться в разных частях интерфейса.

## 🔹 SiteSettingsContext.jsx

### Назначение
Контекст для хранения и управления данными настроек конкретного сайта.  
Используется внутри `SiteSettings/`, `PageEditor/`, `GeneralSettings/` и других вкладок.

### Что даёт:
- `data`: объект с настройками сайта
- `setData`: функция для обновления
- `loading`: загрузка настроек
- `site_name`: сгенерированное имя контейнера (`${domain}${containerSuffix}`)
- `refetch()`: функция повторной загрузки настроек

### Как работает
При монтировании вызывает `fetchData()` — загружает настройки по `site_name` с бэкенда.

### Как использовать

```jsx
import { useSiteSettings } from '@/context/SiteSettingsContext'

const { data, setData, loading, site_name, refetch } = useSiteSettings()