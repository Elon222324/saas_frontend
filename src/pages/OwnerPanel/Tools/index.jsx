import { NavLink, Outlet } from 'react-router-dom'
import {
  Library,
  Image as ImageIcon,
  FlaskConical,
  FileText,
} from 'lucide-react'

export default function OwnerTools() {
  return (
    <div className="flex h-screen bg-gray-100 text-gray-800 font-sans">
      {/* Sidebar navigation */}
      <aside className="w-64 bg-white border-r p-4 space-y-4">
        <h2 className="text-xl font-bold text-purple-600">Инструменты</h2>
        <nav className="flex flex-col gap-2">
          <NavLink
            to="/owner/tools/library"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-purple-50 ${
                isActive ? 'bg-purple-100 text-purple-600 font-semibold' : ''
              }`
            }
          >
            <Library size={18} /> Библиотека
          </NavLink>

          <NavLink
            to="/owner/tools/storage"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-purple-50 ${
                isActive ? 'bg-purple-100 text-purple-600 font-semibold' : ''
              }`
            }
          >
            <ImageIcon size={18} /> Хранилище
          </NavLink>

          <NavLink
            to="/owner/tools/testing"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-purple-50 ${
                isActive ? 'bg-purple-100 text-purple-600 font-semibold' : ''
              }`
            }
          >
            <FlaskConical size={18} /> Тестирование
          </NavLink>

          <NavLink
            to="/owner/tools/logs"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-purple-50 ${
                isActive ? 'bg-purple-100 text-purple-600 font-semibold' : ''
              }`
            }
          >
            <FileText size={18} /> Логи
          </NavLink>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}