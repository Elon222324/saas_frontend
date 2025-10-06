import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { useOptionGroups } from './hooks/useOptionGroups'
import GroupList from './components/GroupList/GroupList'
import ValueList from './components/ValueList/ValueList'

export default function Options() {
  const [selectedGroupId, setSelectedGroupId] = useState(null)
  const { domain } = useParams()
  const siteName = `${domain}_app`

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
}
