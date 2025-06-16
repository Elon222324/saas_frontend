// FILE: src/pages/Sites/SiteSettings/Products/hooks/__tests__/useProductMutations.test.ts
import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useProductMutations } from '../useProductMutations'

describe('useProductMutations', () => {
  test('should provide mutation functions', () => {
    const qc = new QueryClient()
    const wrapper = ({ children }: any) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )
    const { result } = renderHook(() => useProductMutations('test'), { wrapper })
    expect(result.current).toBeTruthy()
  })
})
