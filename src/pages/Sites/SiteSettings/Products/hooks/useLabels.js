import { useQuery } from '@tanstack/react-query'
import { useLabelCrud } from './useLabelCrud'

export function useLabels(siteName, options = {}) {
  const { getLabels } = useLabelCrud(siteName)
  return useQuery({
    queryKey: ['labels', siteName],
    queryFn: getLabels,
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}
