import { useRef } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import OptionsList from './components/OptionsList/OptionsList'

export default function Options() {
  const queryClientRef = useRef(new QueryClient())

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <div className="h-full px-0 pt-0 pb-4">
        <OptionsList />
      </div>
    </QueryClientProvider>
  )
}
