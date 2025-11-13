import { Outlet, useNavigate } from 'react-router-dom'
import { Activity, LogOut, ArrowLeft } from 'lucide-react'
import { useUser } from '@/context/UserContext'

export default function SellerLayout() {
  const { logout } = useUser()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 px-6 py-4 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Activity className="text-green-400" size={28} />
            <div>
              <h1 className="text-2xl font-bold">БОРД ЗАКАЗОВ</h1>
              <p className="text-sm text-green-400">● ONLINE</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/seller/sites')}
            className="flex items-center gap-2 text-gray-300 hover:text-white px-3 py-2 rounded hover:bg-gray-700 transition"
          >
            <ArrowLeft size={18} />
            Выбрать сайт
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-blue-300 hover:text-blue-100 px-3 py-2 rounded hover:bg-blue-900 transition"
          >
            Админка
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-red-300 hover:text-red-100 px-3 py-2 rounded hover:bg-red-900 transition"
          >
            <LogOut size={18} />
            Выход
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto bg-gray-900">
        <Outlet />
      </main>
    </div>
  )
}

