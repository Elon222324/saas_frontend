import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Server,
  Wrench,
  LogOut,
  ArrowLeft,
} from 'lucide-react'
import { useUser } from '../context/UserContext'

export default function OwnerLayout() {
  const { logout } = useUser()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-screen bg-gray-100 text-gray-800 font-sans">
      {/* Header with top navigation */}
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <h2 className="text-2xl font-bold text-purple-600">👑 Owner Panel</h2>
          <nav className="flex gap-4">
            <NavLink
              to="/owner"
              end
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-purple-50 ${
                  isActive ? 'bg-purple-100 text-purple-600 font-semibold' : ''
                }`
              }
            >
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>

            <NavLink
              to="/owner/users"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-purple-50 ${
                  isActive ? 'bg-purple-100 text-purple-600 font-semibold' : ''
                }`
              }
            >
              <Users size={18} /> Users
            </NavLink>

            <NavLink
              to="/owner/sites"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-purple-50 ${
                  isActive ? 'bg-purple-100 text-purple-600 font-semibold' : ''
                }`
              }
            >
              <Server size={18} /> Sites
            </NavLink>

            <NavLink
              to="/owner/tools"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-purple-50 ${
                  isActive ? 'bg-purple-100 text-purple-600 font-semibold' : ''
                }`
              }
            >
              <Wrench size={18} /> Tools
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded hover:bg-blue-200"
          >
            <ArrowLeft size={18} /> Admin Panel
          </button>
          <button 
            onClick={logout}
            className="flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
