import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Server,
  Users,
  LogOut,
} from 'lucide-react'

export default function MainLayout() {
  return (
    <div className="flex flex-col h-screen bg-gray-100 text-gray-800 font-sans">
      {/* Header with top navigation */}
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <h2 className="text-2xl font-bold text-blue-600">🚀 SaaS Admin</h2>
          <nav className="flex gap-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-50 ${
                  isActive ? 'bg-blue-100 text-blue-600 font-semibold' : ''
                }`
              }
            >
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>

            <NavLink
              to="/sites"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-50 ${
                  isActive ? 'bg-blue-100 text-blue-600 font-semibold' : ''
                }`
              }
            >
              <Server size={18} /> Sites
            </NavLink>

            <NavLink
              to="/users"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-50 ${
                  isActive ? 'bg-blue-100 text-blue-600 font-semibold' : ''
                }`
              }
            >
              <Users size={18} /> Users
            </NavLink>
          </nav>
        </div>

        <button className="flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200">
          <LogOut size={18} /> Logout
        </button>
      </header>

      {/* Content */}
      <main className="p-6 flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
