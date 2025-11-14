import { Outlet, useNavigate } from 'react-router-dom'
import { Activity, LogOut, ArrowLeft, Menu, X } from 'lucide-react'
import { useUser } from '@/context/UserContext'
import { useState, useEffect, useRef } from 'react'

export default function SellerLayout() {
  const { logout } = useUser()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  const handleNavigate = (path) => {
    navigate(path)
    setIsMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
  }

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

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-3">
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

        {/* Mobile/Tablet Burger Menu */}
        <div className="lg:hidden relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-300 hover:text-white p-2"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-2 bg-gray-700 rounded-lg shadow-lg z-50 min-w-48">
              <button
                onClick={() => handleNavigate('/seller/sites')}
                className="w-full text-left flex items-center gap-2 text-gray-300 hover:text-white px-4 py-3 hover:bg-gray-600 transition"
              >
                <ArrowLeft size={18} />
                Выбрать сайт
              </button>
              <button
                onClick={() => handleNavigate('/')}
                className="w-full text-left flex items-center gap-2 text-blue-300 hover:text-blue-100 px-4 py-3 hover:bg-gray-600 transition"
              >
                Админка
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2 text-red-300 hover:text-red-100 px-4 py-3 hover:bg-gray-600 transition"
              >
                <LogOut size={18} />
                Выход
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto bg-gray-900">
        <Outlet />
      </main>
    </div>
  )
}

