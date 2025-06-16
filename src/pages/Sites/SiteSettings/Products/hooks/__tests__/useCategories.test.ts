// FILE: src/pages/Sites/SiteSettings/Products/hooks/__tests__/useCategories.test.ts
import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useCategories } from '../useCategories'

describe('useCategories', () => {
  test('should fetch categories', async () => {
    const qc = new QueryClient()
    const wrapper = ({ children }: any) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )
    renderHook(() => useCategories('test'), { wrapper })
  })
})
