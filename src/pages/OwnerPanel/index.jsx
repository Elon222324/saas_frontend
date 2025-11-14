import { useNavigate } from 'react-router-dom'
import { Store } from 'lucide-react'

export default function OwnerPanel() {
  const navigate = useNavigate()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🎛 Панель владельца</h1>
      <p className="text-gray-700 mb-8">Добро пожаловать в административную панель владельца платформы. Здесь вы сможете управлять пользователями, сайтами, инструментами и следить за активностью.</p>
      
      <div className="flex gap-4">
        <button
          onClick={() => navigate('/seller/sites')}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-all"
        >
          <Store size={20} /> Перейти в Борд продавца
        </button>
      </div>
    </div>
  )
}
