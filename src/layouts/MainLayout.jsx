import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Server,
  Users,
  LogOut,
} from 'lucide-react'

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-gray-100 text-gray-800 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-8 text-blue-600">🚀 SaaS Admin</h2>
        <nav className="space-y-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-50 ${
                isActive ? 'bg-blue-100 text-blue-600 font-semibold' : ''
              }`
            }
          >
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>

          <NavLink
            to="/sites"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-50 ${
                isActive ? 'bg-blue-100 text-blue-600 font-semibold' : ''
              }`
            }
          >
            <Server size={20} /> Sites
          </NavLink>

          <NavLink
            to="/users"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-50 ${
                isActive ? 'bg-blue-100 text-blue-600 font-semibold' : ''
              }`
            }
          >
            <Users size={20} /> Users
          </NavLink>
        </nav>
      </aside>

      {/* Content */}
      <div className="flex flex-col flex-1">
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">👋 Welcome!</h1>
          <button className="flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200">
            <LogOut size={18} /> Logout
          </button>
        </header>

        <main className="p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
