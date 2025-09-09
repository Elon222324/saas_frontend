import { useEffect, useMemo, useState } from 'react'
import api from '@/lib/axios'
import { extractErrorMessage, mapStatusForBackend, mapPaymentStatusForBackend } from '../utils.js'

export function useOrderDetails(details, siteNameForApi, headers, orderId, refreshOrders, reloadDetails) {
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

  const canCallAdmin = useMemo(() => Boolean(siteNameForApi && headers && orderId), [siteNameForApi, headers, orderId])

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
    if (!canCallAdmin) return
    setEventsLoading(true)
    api.get(`/orders/${siteNameForApi}/admin/${orderId}/events`, { headers })
      .then((res) => setEvents(Array.isArray(res.data) ? res.data : (res.data?.events || [])))
      .catch(() => setEvents([]))
      .finally(() => setEventsLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canCallAdmin, siteNameForApi, orderId])

  const handleSaveEdits = async () => {
    if (!canCallAdmin) return
    setSaving(true)
    try {
      await api.patch(`/orders/${siteNameForApi}/admin/${orderId}`, {
        address_text: editAddress || undefined,
        comment: editComment || undefined,
        payment_method: editPaymentMethod || undefined,
      }, { headers })
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
      await api.patch(`/orders/${siteNameForApi}/admin/${orderId}/status`, { status: mapStatusForBackend(newStatus) }, { headers })
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
      await api.patch(`/orders/${siteNameForApi}/admin/${orderId}/payment-status`, { payment_status: mapPaymentStatusForBackend(newPaymentStatus) }, { headers })
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
      await api.post(`/orders/${siteNameForApi}/admin/${orderId}/note`, { note: noteText.trim() }, { headers })
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
      await api.patch(`/orders/${siteNameForApi}/admin/${orderId}/items/${itemId}`, { quantity: Number(quantity) }, { headers })
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
