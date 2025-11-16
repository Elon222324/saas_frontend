import { useMutation } from '@tanstack/react-query'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { useParams } from 'react-router-dom'

export function useBlocksApi() {
  const { slug } = useParams()
  const { siteToken, site_name, refetch: refetchSiteSettings } = useSiteSettings()

  const siteNameForApi = site_name.replace(/_app$/, '')
  const baseApiUrl = `https://${siteNameForApi}.${import.meta.env.VITE_BASE_DOMAIN}/site-api/admin/blocks`

  const getHeaders = () => {
    if (!siteToken) {
      console.error('❌ [useBlocksApi] Admin token is missing')
      throw new Error('Admin token is not available')
    }
    return {
      Authorization: `Bearer ${siteToken}`,
      'Content-Type': 'application/json',
    }
  }

  const reorder = useMutation({
    mutationFn: async (blocks) => {
      const payload = blocks.map(({ real_id, order }) => ({ id: real_id, order }))
      const res = await fetch(`${baseApiUrl}/reorder/${slug}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`Error reordering blocks: ${res.statusText}`)
      return res.json()
    },
    onSuccess: () => {
      refetchSiteSettings()
    },
  })

  const updateAll = useMutation({
    mutationFn: async (unsavedBlocks) => {
      const payload = Object.entries(unsavedBlocks).map(([block_id, changes]) => ({
        block_id: Number(block_id),
        ...(changes.settings && { settings: changes.settings }),
        ...(changes.data && { data: changes.data }),
      }))
      if (payload.length === 0) return

      console.log('📤 [updateAll] Sending payload:', {
        endpoint: `${baseApiUrl}/update-all/${slug}`,
        payload: payload,
        payloadLength: payload.length,
        payloadJSON: JSON.stringify(payload),
        headers: getHeaders(),
      })

      const res = await fetch(`${baseApiUrl}/update-all/${slug}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      })

      console.log('📥 [updateAll] Response status:', res.status, res.statusText)
      
      if (!res.ok) {
        const errorText = await res.text()
        console.error('❌ [updateAll] Error response body:', errorText)
        throw new Error(`Error updating blocks: ${res.statusText}. Body: ${errorText}`)
      }
      
      return res.json()
    },
    onSuccess: () => {
      console.log('✅ [updateAll] Success')
      refetchSiteSettings()
    },
  })

  const updateStatus = useMutation({
    mutationFn: async ({ block_id, is_active }) => {
      const res = await fetch(`${baseApiUrl}/status/${slug}/${block_id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ is_active }),
      })
      if (!res.ok) throw new Error(`Error updating block status: ${res.statusText}`)
      return res.json()
    },
    onSuccess: () => {
      // refetchSiteSettings() might be too heavy here, but let's use it for now for simplicity
      refetchSiteSettings()
    },
  })
  
  const updateSettings = useMutation({
    mutationFn: async ({ block_id, settings }) => {
      const res = await fetch(`${baseApiUrl}/settings/${slug}/${block_id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(settings),
      })
      if (!res.ok) throw new Error(`Error updating block settings: ${res.statusText}`)
      return res.json()
    },
    onSuccess: () => {
      refetchSiteSettings()
    },
  })

  const updateData = useMutation({
    mutationFn: async ({ block_id, data }) => {
      const res = await fetch(`${baseApiUrl}/data/${slug}/${block_id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error(`Error updating block data: ${res.statusText}`)
      return res.json()
    },
    onSuccess: () => {
      refetchSiteSettings()
    },
  })

  const createBlock = useMutation({
    mutationFn: async ({ type, label }) => {
      const payload = {
        block_type: type,
        id_alias: `${type}_${Date.now()}`,
        label,
        settings: {},
        data: {},
      }

      const res = await fetch(`${baseApiUrl}/create/${slug}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`Error creating block: ${res.statusText}`)
      return res.json()
    },
    onSuccess: () => {
      refetchSiteSettings()
    },
  })

  return {
    reorderBlocks: reorder,
    updateAllBlocks: updateAll,
    updateBlockStatus: updateStatus,
    updateBlockSettings: updateSettings,
    updateBlockData: updateData,
    createBlock: createBlock,
  }
}
