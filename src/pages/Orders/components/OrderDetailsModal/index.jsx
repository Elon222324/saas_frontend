import ModalTemplate from '@/components/ModalTemplate'
import { Package } from 'lucide-react'
import { CustomerInfo } from './components/CustomerInfo.jsx'
import { StatusAndPayment } from './components/StatusAndPayment.jsx'
import { OrderItems } from './components/OrderItems.jsx'
import { OrderTotal } from './components/OrderTotal.jsx'
import { EditOrderForm } from './components/EditOrderForm.jsx'
import { NotesSection } from './components/NotesSection.jsx'
import { EventsSection } from './components/EventsSection.jsx'
import { useOrderDetails } from './hooks/useOrderDetails.js'

export default function OrderDetailsModal({ details, onClose, siteNameForToken, siteToken, baseDomain, refreshOrders, reloadDetails }) {
  if (!details) return null

  // API variants support
  const order = details.order || details
  const items = details.items || order.order_items || order.items || []
  const orderId = order.id || order.order_id

  const {
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
    
    // Handlers
    handleSaveEdits,
    handleUpdateStatus,
    handleUpdatePaymentStatus,
    handleAddNote,
    updateItemQty,
    isDetailsDirty,
    isStatusDirty,
    isPaymentStatusDirty,
  } = useOrderDetails(details, siteNameForToken, siteToken, baseDomain, orderId, refreshOrders, reloadDetails)

  return (
    <ModalTemplate
      title={`Заказ #${orderId}`}
      subtitle="Детальная информация о заказе"
      icon={Package}
      iconBgColor="bg-blue-50"
      iconColor="text-blue-600"
      onClose={onClose}
      maxWidth="max-w-4xl"
    >
      <div className="p-8 space-y-6">
        <CustomerInfo order={order} details={details} />
        
        <StatusAndPayment 
          order={order}
          newStatus={newStatus}
          setNewStatus={setNewStatus}
          newPaymentStatus={newPaymentStatus}
          setNewPaymentStatus={setNewPaymentStatus}
          saving={saving}
          onUpdateStatus={handleUpdateStatus}
          onUpdatePaymentStatus={handleUpdatePaymentStatus}
          isStatusDirty={isStatusDirty}
          isPaymentStatusDirty={isPaymentStatusDirty}
        />
        
        <OrderItems items={items} onUpdateItemQty={updateItemQty} />
        
        <OrderTotal order={order} />
        
        <EditOrderForm 
          editAddress={editAddress}
          setEditAddress={setEditAddress}
          editComment={editComment}
          setEditComment={setEditComment}
          editPaymentMethod={editPaymentMethod}
          setEditPaymentMethod={setEditPaymentMethod}
          saving={saving}
          onSaveEdits={handleSaveEdits}
          isDirty={isDetailsDirty}
        />
        
        <NotesSection 
          noteText={noteText}
          setNoteText={setNoteText}
          addingNote={addingNote}
          onAddNote={handleAddNote}
        />
        
        <EventsSection events={events} eventsLoading={eventsLoading} />
      </div>
    </ModalTemplate>
  )
}
