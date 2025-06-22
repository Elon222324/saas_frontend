import { useRef, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useParams } from 'react-router-dom'

import GroupList from './components/GroupList/GroupList'
import ItemList from './components/ItemList/ItemList'

export default function Extras() {
  const queryClientRef = useRef(new QueryClient())
  const [selectedGroup, setSelectedGroup] = useState(null)
  const { domain } = useParams()
  const siteName = `${domain}_app`

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <div className="h-full flex">
        <aside className="w-64 border-r bg-white p-1">
          <GroupList selected={selectedGroup} onSelect={setSelectedGroup} />
        </aside>
        <main className="flex-1 overflow-auto p-4">
          <ItemList groupId={selectedGroup} />
        </main>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

