import { useState } from 'react'
import { Outlet, NavLink, useParams } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

export default function SiteSettings() {
  const { domain } = useParams()
  const API_URL = import.meta.env.VITE_API_URL
  const containerSuffix = import.meta.env.VITE_CONTAINER_SUFFIX
  const baseDomain = import.meta.env.VITE_BASE_DOMAIN

  const site_name = `${domain}${containerSuffix}`
  const full_domain = `${domain}.${baseDomain}`

  const navItems = [
    { label: 'Страницы', path: 'pages' },
    { label: 'Товары', path: 'products' },
    { label: 'Интеграции', path: 'integrations' },
    { label: 'Общие настройки', path: 'general' },
  ]

  const [open, setOpen] = useState(false)

  return (
    <div className="relative flex h-full">
      {/* Burger button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="absolute left-4 top-4 z-20 rounded bg-white p-2 shadow md:hidden"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-10 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-20 w-64 border-r bg-white p-4 space-y-4 transform transition-transform duration-300 md:static md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <h2 className="mb-4 text-lg font-bold text-blue-600">{full_domain}</h2>
        <nav className="space-y-2">
          {navItems.map(({ label, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `block rounded px-4 py-2 hover:bg-blue-50 ${
                  isActive ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main
        className={`flex-1 overflow-y-auto p-6 transition-[margin] duration-300 ${open ? 'md:ml-64' : 'ml-0'}`}
      >
        <Outlet />
      </main>
    </div>
  )
}
