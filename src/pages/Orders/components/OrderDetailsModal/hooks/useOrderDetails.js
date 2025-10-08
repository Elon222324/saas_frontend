import { useEffect, useMemo, useState } from 'react'
import { extractErrorMessage, mapStatusForBackend, mapPaymentStatusForBackend } from '../utils.js'

export function useOrderDetails(details, siteNameForToken, siteToken, baseDomain, orderId, refreshOrders, reloadDetails) {
  // Local editable state
  const [editAddress, setEditAddress] = useState(details?.order?.address_text || '')
  const [editComment, setEditComment] = useState(details?.order?.comment || '')
  const [editPaymentMethod, setEditPaymentMethod] = useState(details?.order?.payment_method || '')
  const [newStatus, setNewStatus] = useState(String(details?.order?.status || 'new').toLowerCase())
  const [newPaymentStatus, setNewPaymentStatus] = useState(String(details?.order?.payment_status || ''))
  const [saving, setSaving] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [addingNote, setAddingNote] = useState(false)
  const [events, setEvents] = useState([])
  const [eventsLoading, setEventsLoading] = useState(false)

  useEffect(() => {
    if (details) {
      setEditAddress(details.order?.address_text || '')
      setEditComment(details.order?.comment || '')
      setEditPaymentMethod(details.order?.payment_method || '')
      setNewStatus(String(details.order?.status || 'new').toLowerCase())
      setNewPaymentStatus(String(details.order?.payment_status || ''))
    }
  }, [details])

  const canCallAdmin = useMemo(() => Boolean(siteNameForToken && siteToken && baseDomain && orderId), [siteNameForToken, siteToken, baseDomain, orderId])

  // Формируем базовый URL для нового API
  const baseApiUrl = useMemo(() => {
    if (!siteNameForToken || !baseDomain) return ''
    return `https://${siteNameForToken}.${baseDomain}/site-api/admin/orders`
  }, [siteNameForToken, baseDomain])

  const isDetailsDirty = useMemo(() => {
    if (!details) return false
    return (
      editAddress !== (details.order?.address_text || '') ||
      editComment !== (details.order?.comment || '') ||
      editPaymentMethod !== (details.order?.payment_method || '')
    )
  }, [editAddress, editComment, editPaymentMethod, details])

  const isStatusDirty = useMemo(() => {
    if (!details) return false
    return newStatus !== String(details.order?.status || 'new').toLowerCase()
  }, [newStatus, details])

  const isPaymentStatusDirty = useMemo(() => {
    if (!details) return false
    return newPaymentStatus !== String(details.order?.payment_status || '')
  }, [newPaymentStatus, details])

  useEffect(() => {
    // Load events lazily on open
    if (!canCallAdmin || !baseApiUrl) return
    setEventsLoading(true)
    
    const url = `${baseApiUrl}/${orderId}/events`
    console.log('🔑 [OrderDetails] → Загружаю события:', url)
    
    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${siteToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(res => res.json())
      .then((data) => {
        setEvents(Array.isArray(data) ? data : (data?.events || []))
        console.log('✅ [OrderDetails] ← События загружены')
      })
      .catch((err) => {
        console.error('❌ [OrderDetails] Ошибка загрузки событий:', err)
        setEvents([])
      })
      .finally(() => setEventsLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canCallAdmin, baseApiUrl, orderId])

  const handleSaveEdits = async () => {
    if (!canCallAdmin) return
    setSaving(true)
    try {
      const url = `${baseApiUrl}/${orderId}`
      console.log('🔑 [OrderDetails] → PATCH заказ:', url)
      
      const res = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${siteToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          address_text: editAddress || undefined,
          comment: editComment || undefined,
          payment_method: editPaymentMethod || undefined,
        })
      })

      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: `HTTP ${res.status}` }))
        throw error
      }

      console.log('✅ [OrderDetails] ← Заказ обновлен')
      await reloadDetails?.()
      await refreshOrders?.()
    } catch (e) {
      console.error(e)
      alert(`Не удалось сохранить изменения заказа: ${extractErrorMessage(e)}`)
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateStatus = async () => {
    if (!canCallAdmin || !newStatus) return
    setSaving(true)
    try {
      const url = `${baseApiUrl}/${orderId}/status`
      console.log('🔑 [OrderDetails] → PATCH статус:', url)
      
      const res = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${siteToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: mapStatusForBackend(newStatus) })
      })

      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: `HTTP ${res.status}` }))
        throw error
      }

      console.log('✅ [OrderDetails] ← Статус обновлен')
      await reloadDetails?.()
      await refreshOrders?.()
    } catch (e) {
      console.error(e)
      alert(`Не удалось обновить статус: ${extractErrorMessage(e)}`)
    } finally {
      setSaving(false)
    }
  }

  const handleUpdatePaymentStatus = async () => {
    if (!canCallAdmin || !newPaymentStatus) return
    setSaving(true)
    try {
      const url = `${baseApiUrl}/${orderId}/payment-status`
      console.log('🔑 [OrderDetails] → PATCH статус оплаты:', url)
      
      const res = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${siteToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ payment_status: mapPaymentStatusForBackend(newPaymentStatus) })
      })

      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: `HTTP ${res.status}` }))
        throw error
      }

      console.log('✅ [OrderDetails] ← Статус оплаты обновлен')
      await reloadDetails?.()
      await refreshOrders?.()
    } catch (e) {
      console.error(e)
      alert(`Не удалось обновить статус оплаты: ${extractErrorMessage(e)}`)
    } finally {
      setSaving(false)
    }
  }

  const handleAddNote = async () => {
    if (!canCallAdmin || !noteText.trim()) return
    setAddingNote(true)
    try {
      const url = `${baseApiUrl}/${orderId}/note`
      console.log('🔑 [OrderDetails] → POST примечание:', url)
      
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${siteToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ note: noteText.trim() })
      })

      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: `HTTP ${res.status}` }))
        throw error
      }

      console.log('✅ [OrderDetails] ← Примечание добавлено')
      setNoteText('')
      await reloadDetails?.()
    } catch (e) {
      console.error(e)
      alert(`Не удалось добавить примечание: ${extractErrorMessage(e)}`)
    } finally {
      setAddingNote(false)
    }
  }

  const updateItemQty = async (item, quantity) => {
    const itemId = item.id || item.item_id
    if (!canCallAdmin || !itemId) return
    try {
      const url = `${baseApiUrl}/${orderId}/items/${itemId}`
      console.log('🔑 [OrderDetails] → PATCH количество товара:', url)
      
      const res = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${siteToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ quantity: Number(quantity) })
      })

      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: `HTTP ${res.status}` }))
        throw error
      }

      console.log('✅ [OrderDetails] ← Количество обновлено')
      await reloadDetails?.()
      await refreshOrders?.()
    } catch (e) {
      console.error(e)
      alert(`Не удалось обновить количество: ${extractErrorMessage(e)}`)
    }
  }

  return {
    // State
    editAddress,
    setEditAddress,
    editComment,
    setEditComment,
    editPaymentMethod,
    setEditPaymentMethod,
    newStatus,
    setNewStatus,
    newPaymentStatus,
    setNewPaymentStatus,
    saving,
    noteText,
    setNoteText,
    addingNote,
    events,
    eventsLoading,
    canCallAdmin,
    
    // Handlers
    handleSaveEdits,
    handleUpdateStatus,
    handleUpdatePaymentStatus,
    handleAddNote,
    updateItemQty,
    isDetailsDirty,
    isStatusDirty,
    isPaymentStatusDirty,
  }
}
