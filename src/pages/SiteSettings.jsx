import { Outlet, NavLink, useParams } from 'react-router-dom'

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

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white p-4 space-y-4">
        <h2 className="text-lg font-bold text-blue-600 mb-4">{full_domain}</h2>
        <nav className="space-y-2">
          {navItems.map(({ label, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `block px-4 py-2 rounded hover:bg-blue-50 ${
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
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
