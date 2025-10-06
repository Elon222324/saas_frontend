import { useQuery } from '@tanstack/react-query'
import { useSiteSettings } from '../../../../../../context/SiteSettingsContext'
import { useLabelCrud } from './useLabelCrud'

export function useLabels(siteName, options = {}) {
  const { siteToken } = useSiteSettings()
  const { getLabels } = useLabelCrud(siteName)
  
  return useQuery({
    queryKey: ['labels', siteName, siteToken?.token],
    enabled: Boolean(siteToken?.token) && (options?.enabled ?? true),
    queryFn: getLabels,
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}
