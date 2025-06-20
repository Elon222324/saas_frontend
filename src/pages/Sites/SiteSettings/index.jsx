import { Outlet, NavLink, useParams } from 'react-router-dom'
import { useState } from 'react'
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

  const [open, setOpen] = useState(() => window.matchMedia('(min-width: 768px)').matches)

  return (
    <div className="relative flex h-full">
      <button
        className="absolute top-4 left-4 z-30 rounded-md p-2 bg-blue-600 text-white md:hidden"
        onClick={() => setOpen(true)}
      >
        <Menu size={20} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/20 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white border-r p-4 space-y-4 transition-transform duration-300 md:static md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full md:-translate-x-full'}`}
      >
        <button
          className="absolute top-4 right-4 z-30 rounded-md p-1 md:hidden"
          onClick={() => setOpen(false)}
        >
          <X size={20} />
        </button>
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
        className={`flex-1 overflow-y-auto transition-all duration-300 ${open ? 'md:ml-64' : ''}`}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
