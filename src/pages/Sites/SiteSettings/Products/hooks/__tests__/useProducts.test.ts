// FILE: src/pages/Sites/SiteSettings/Products/hooks/__tests__/useProducts.test.ts
import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useProducts } from '../useProducts'

const filters = { page: 1, limit: 20 }

describe('useProducts', () => {
  test('should fetch products', async () => {
    const qc = new QueryClient()
    const wrapper = ({ children }: any) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )
    renderHook(() => useProducts('test', filters), { wrapper })
  })
})
