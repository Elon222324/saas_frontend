import { Edit3, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function EditOrderForm({ 
  editAddress, 
  setEditAddress, 
  editComment, 
  setEditComment, 
  editPaymentMethod, 
  setEditPaymentMethod, 
  saving, 
  onSaveEdits,
  isDirty,
}) {
  return (
    <section className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gray-50 rounded-lg">
          <Edit3 className="h-5 w-5 text-gray-600" />
        </div>
        <h3 className="font-semibold text-lg text-gray-900">Изменить заказ</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Адрес</label>
          <input 
            value={editAddress} 
            onChange={(e) => setEditAddress(e.target.value)} 
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
            placeholder="Введите адрес доставки"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Способ оплаты</label>
          <select 
            value={editPaymentMethod} 
            onChange={(e) => setEditPaymentMethod(e.target.value)} 
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Выберите способ оплаты</option>
            <option value="cash">Наличные</option>
            <option value="card_to_courier">Карта курьеру</option>
            <option value="online">Онлайн</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Комментарий</label>
          <textarea 
            value={editComment} 
            onChange={(e) => setEditComment(e.target.value)} 
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none" 
            rows={4}
            placeholder="Добавьте комментарий к заказу"
          />
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <Button 
          onClick={onSaveEdits} 
          disabled={saving || !isDirty} 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-colors"
        >
          <Check size={16} /> Сохранить
        </Button>
      </div>
    </section>
  )
}
