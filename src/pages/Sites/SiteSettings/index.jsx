import { useState } from 'react'
import { Outlet, NavLink, useParams } from 'react-router-dom'
import { Menu, X, FileText, ShoppingBag, Plug, Settings } from 'lucide-react'

export default function SiteSettings() {
  const { domain } = useParams()
  const [collapsed, setCollapsed] = useState(false)
  const [hovered, setHovered] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL
  const containerSuffix = import.meta.env.VITE_CONTAINER_SUFFIX
  const baseDomain = import.meta.env.VITE_BASE_DOMAIN

  const site_name = `${domain}${containerSuffix}`
  const full_domain = `${domain}.${baseDomain}`

  const navItems = [
    { label: 'Страницы', path: 'pages', icon: FileText },
    { label: 'Товары', path: 'products', icon: ShoppingBag },
    { label: 'Интеграции', path: 'integrations', icon: Plug },
    { label: 'Общие настройки', path: 'general', icon: Settings },
  ]

  const isExpanded = !collapsed || hovered

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside
        className={`relative border-r bg-white transition-all duration-300 flex flex-col ${
          isExpanded ? 'w-64' : 'w-16'
        }`}
      >
        {/* Header — логотип и бургер (не влияет на hover) */}
        <div className="flex items-center justify-between p-4">
          {isExpanded ? (
            <h2 className="text-lg font-bold text-blue-600 truncate">{full_domain}</h2>
          ) : (
            <span className="text-blue-600 font-bold text-lg">i</span>
          )}
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="p-1 rounded hover:bg-gray-100"
            title={collapsed ? 'Развернуть меню' : 'Свернуть меню'}
          >
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        {/* Навигация — именно тут реагируем на наведение */}
        <div
          className="flex-1 overflow-y-auto"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <nav className="space-y-1 px-2">
            {navItems.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                title={!isExpanded ? label : ''}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-50 transition-colors ${
                    isActive ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700'
                  } ${!isExpanded ? 'justify-center' : ''}`
                }
              >
                <Icon size={20} />
                {isExpanded && <span>{label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 pt-0 pr-6 pb-6 pl-6 overflow-y-auto transition-all duration-300">
        <Outlet />
      </main>
    </div>
  )
}
