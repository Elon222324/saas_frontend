import { useRef, useState, useMemo, memo } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useParams } from 'react-router-dom'

import { useOptionGroups } from './hooks/useOptionGroups'
import GroupList from './components/GroupList/GroupList'
import ValueList from './components/ValueList/ValueList'

// Новый внутренний компонент, который будет иметь доступ к QueryClient
const OptionsContent = memo(() => {
  const [selectedGroupId, setSelectedGroupId] = useState(null)
  const { domain } = useParams()
  const siteName = `${domain}_app`

  // Теперь этот хук вызывается внутри QueryClientProvider и будет работать
  const { data: groups = [] } = useOptionGroups(siteName)

  // Находим полный объект выбранной группы для получения флага is_pricing
  const selectedGroupObject = useMemo(
    () => groups.find((g) => g.id === selectedGroupId),
    [groups, selectedGroupId],
  )

  return (
    <div className="h-full flex">
      <aside className="w-64 border-r bg-white p-1">
        <GroupList selected={selectedGroupId} onSelect={setSelectedGroupId} />
      </aside>
      <main className="flex-1 overflow-auto p-4">
        <ValueList
          key={selectedGroupId}
          groupId={selectedGroupId}
          isPricing={selectedGroupObject?.is_pricing}
        />
      </main>
    </div>
  )
})

// Главный компонент страницы теперь только предоставляет QueryClient
export default function Options() {
  // useRef гарантирует, что QueryClient создается только один раз
  const queryClientRef = useRef(new QueryClient())

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <OptionsContent />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
