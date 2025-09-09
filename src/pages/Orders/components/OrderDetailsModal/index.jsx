import { ModalHeader } from './components/ModalHeader.jsx'
import { CustomerInfo } from './components/CustomerInfo.jsx'
import { StatusAndPayment } from './components/StatusAndPayment.jsx'
import { OrderItems } from './components/OrderItems.jsx'
import { OrderTotal } from './components/OrderTotal.jsx'
import { EditOrderForm } from './components/EditOrderForm.jsx'
import { NotesSection } from './components/NotesSection.jsx'
import { EventsSection } from './components/EventsSection.jsx'
import { ModalFooter } from './components/ModalFooter.jsx'
import { useOrderDetails } from './hooks/useOrderDetails.js'

export default function OrderDetailsModal({ details, onClose, siteNameForApi, headers, refreshOrders, reloadDetails }) {
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
  } = useOrderDetails(details, siteNameForApi, headers, orderId, refreshOrders, reloadDetails)

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300">
        <ModalHeader orderId={orderId} onClose={onClose} />

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
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
        </div>

        <ModalFooter onClose={onClose} />
      </div>
    </div>
  )
}
