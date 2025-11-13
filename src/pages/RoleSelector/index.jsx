import { useNavigate } from 'react-router-dom'
import { useUser } from '@/context/UserContext'
import { LayoutDashboard, ShoppingCart } from 'lucide-react'

export default function RoleSelector() {
  const navigate = useNavigate()
  const { user, loading } = useUser()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-gray-600">Загрузка...</p>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="w-full max-w-2xl px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Добро пожаловать, {user?.username}!</h1>
          <p className="text-xl text-gray-600">Выберите, как вы хотите продолжить</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Админка */}
          <button
            onClick={() => navigate('/', { replace: true })}
            className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105 group border-2 border-transparent hover:border-blue-500"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="bg-blue-100 p-4 rounded-full group-hover:bg-blue-200 transition">
                <LayoutDashboard size={40} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Админка</h2>
              <p className="text-gray-600 text-center">
                Управляйте сайтами, заказами, клиентами и настройками платформы
              </p>
            </div>
          </button>

          {/* Борд продавца */}
          <button
            onClick={() => navigate('/seller/sites')}
            className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105 group border-2 border-transparent hover:border-orange-500"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="bg-orange-100 p-4 rounded-full group-hover:bg-orange-200 transition">
                <ShoppingCart size={40} className="text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Борд Продавца</h2>
              <p className="text-gray-600 text-center">
                Просматривайте заказы в реальном времени и управляйте доставкой
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

