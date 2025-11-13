import { stripAppSuffix, baseDomain } from '../utils/domain'

export async function fetchCustomersApi({ siteName, siteToken, limit, offset, query }) {
  const siteForUrl = stripAppSuffix(siteName)
  const newApiUrl = `https://${siteForUrl}.${baseDomain}/site-api/admin/customers/`
  const params = { limit, offset }
  if (query) params.q = query
  const queryString = new URLSearchParams(params).toString()
  const fullUrl = `${newApiUrl}?${queryString}`

  const res = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${siteToken}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    cache: 'no-cache',
  })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`)
  }
  const dataRaw = await res.json()
  return Array.isArray(dataRaw) ? dataRaw : (dataRaw?.customers || dataRaw?.results || dataRaw?.data || [])
}

export async function fetchCustomerDetailsApi({ siteName, siteToken, customerId, ordersLimit, ordersOffset }) {
  const siteForUrl = stripAppSuffix(siteName)
  const baseUrl = `https://${siteForUrl}.${baseDomain}/site-api/admin/customers/${customerId}`

  const [profileRes, ordersRes] = await Promise.all([
    fetch(baseUrl, {
      headers: {
        Authorization: `Bearer ${siteToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      cache: 'no-cache',
    }),
    fetch(`${baseUrl}/orders?${new URLSearchParams({ limit: String(ordersLimit), offset: String(ordersOffset) }).toString()}`, {
      headers: {
        Authorization: `Bearer ${siteToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      cache: 'no-cache',
    }),
  ])

  if (!profileRes.ok) throw new Error(`HTTP ${profileRes.status}`)
  if (!ordersRes.ok) throw new Error(`HTTP ${ordersRes.status}`)

  const profileRaw = await profileRes.json()
  const ordersRaw = await ordersRes.json()
  
  // Handle different response formats for profile
  // Support: { customer: {...} }, { profile: {...} }, or direct customer data
  const profileData = profileRaw?.customer || profileRaw?.profile || profileRaw
  
  console.log('🔍 [Customers API] ← Профиль клиента raw:', profileRaw)
  console.log('🔍 [Customers API] ← Профиль клиента processed:', profileData)
  
  const ordersData = Array.isArray(ordersRaw) ? ordersRaw : (ordersRaw?.orders || ordersRaw?.results || ordersRaw?.data || [])
  return { profileData, ordersData }
}


