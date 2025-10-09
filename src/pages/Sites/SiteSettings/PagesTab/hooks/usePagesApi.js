import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSiteSettings } from '@/context/SiteSettingsContext'

export function usePagesApi() {
  const qc = useQueryClient()
  const { siteToken, site_name, refetch: refetchSiteSettings } = useSiteSettings()

  const siteNameForApi = site_name.replace(/_app$/, '')
  const baseApiUrl = `https://${siteNameForApi}.${import.meta.env.VITE_BASE_DOMAIN}/site-api/admin/pages`

  const getHeaders = () => {
    const adminToken = siteToken?.token
    if (!adminToken) {
      console.error('❌ [usePagesApi] Admin token is missing')
      throw new Error('Admin token is not available')
    }
    return {
      Authorization: `Bearer ${adminToken}`,
      'Content-Type': 'application/json',
    }
  }

  /* CREATE ------------------------------------------------------------------ */
  const add = useMutation({
    mutationFn: async ({ title, slug, add_to_navigation }) => {
      const res = await fetch(`${baseApiUrl}/add`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({ title, slug, add_to_navigation }),
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        console.error('❌ [usePagesApi] Error creating page:', errorData);
        throw new Error(`Error creating page: ${res.statusText}`)
      }
      return res.json()
    },
    onSuccess: () => {
      refetchSiteSettings() // refetchSiteSettings includes pages and navigation
    },
  })

  /* UPDATE STATUS ----------------------------------------------------------- */
  const toggleActive = useMutation({
    mutationFn: async ({ slug, is_active }) => {
        const res = await fetch(`${baseApiUrl}/toggle-active`, {
        method: 'PATCH',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({ slug, value: is_active }),
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        console.error('❌ [usePagesApi] Error toggling page status:', errorData);
        throw new Error(`Error toggling page status: ${res.statusText}`)
    }
      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['siteSettings', site_name] })
    },
  })

  /* DELETE ------------------------------------------------------------------ */
  const remove = useMutation({
    mutationFn: async (slug) => {
      const res = await fetch(`${baseApiUrl}/${slug}`, {
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include',
      })
      if (!res.ok && res.status !== 204) { // 204 No Content is a success case for DELETE
        const errorData = await res.json().catch(() => ({}))
        console.error('❌ [usePagesApi] Error deleting page:', errorData);
        throw new Error(`Error deleting page: ${res.statusText}`)
      }
      // For 204, there's no body to parse, so we can just return a success indicator
      return { success: true }
    },
    onSuccess: () => {
      refetchSiteSettings()
    },
  })

  return { addPage: add, togglePageActive: toggleActive, deletePage: remove }
}
