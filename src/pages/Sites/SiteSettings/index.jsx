import { useState, useEffect } from 'react'
import { Outlet, NavLink, useParams, useLocation } from 'react-router-dom'
import { useSiteSettings } from '../../../context/SiteSettingsContext'
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  ShoppingBag,
  ShoppingCart,
  Plug,
  Settings,
  List,
  PlusCircle,
  Layers,
  ChevronDown,
  ChevronUp,
  Truck,
  Percent,
  Search,
  MessageCircle,
} from 'lucide-react'

export default function SiteSettings() {
  const { domain } = useParams()
  const location = useLocation()
  const { siteToken, site_name } = useSiteSettings()

  const [collapsed, setCollapsed] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [catalogOpen, setCatalogOpen] = useState(
    location.pathname.includes('/products') ||
    location.pathname.includes('/options') ||
    location.pathname.includes('/extras')
  )
  const [commerceOpen, setCommerceOpen] = useState(
    location.pathname.includes('/delivery') ||
    location.pathname.includes('/promocodes')
  )

  const containerSuffix = import.meta.env.VITE_CONTAINER_SUFFIX
  const baseDomain = import.meta.env.VITE_BASE_DOMAIN

  const site_name_local = `${domain}${containerSuffix}`
  const full_domain = `${domain}.${baseDomain}`

  const isExpanded = !collapsed || hovered

  // Логирование статуса токена сайта
  useEffect(() => {
    if (siteToken) {
      console.log('🎯 [SITE SETTINGS] Токен сайта доступен в компоненте:', siteToken)
    } else {
      console.log('ℹ️ [SITE SETTINGS] Токен сайта не получен, работаем в режиме совместимости')
    }
  }, [siteToken])

  return (
    <div className="flex h-full pt-4 px-4 gap-4 bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`relative bg-white rounded-lg shadow border transition-all duration-300 flex flex-col ${
          isExpanded ? 'w-56' : 'w-16'
        }`}
      >
        <div className="flex items-center justify-between p-4">
          {isExpanded ? (
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-blue-600 truncate">{full_domain}</h2>
              {/* Индикатор статуса токена для тестирования */}
              <div className="text-xs mt-1">
                {siteToken ? (
                  <span className="text-green-600 font-medium">🔑 Токен получен</span>
                ) : (
                  <span className="text-orange-500 font-medium">⚠️ Токен не получен</span>
                )}
              </div>
            </div>
          ) : (
            <span className="text-blue-600 font-bold text-lg">i</span>
          )}
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="p-1 rounded hover:bg-gray-100"
            title={collapsed ? 'Развернуть меню' : 'Свернуть меню'}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <div
          className="flex-1 overflow-y-auto"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <nav className="space-y-1 px-2">
            <NavLink
              to="pages"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-50 transition-colors ${
                  isActive ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700'
                } ${!isExpanded ? 'justify-center' : ''}`
              }
              title={!isExpanded ? 'Страницы' : ''}
            >
              <FileText size={20} />
              {isExpanded && <span>Страницы</span>}
            </NavLink>

            {/* Каталог с вложенными пунктами */}
            <div className="mt-2">
              <button
                onClick={() => setCatalogOpen((prev) => !prev)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded font-semibold transition-colors ${
                  isExpanded ? 'text-gray-500' : 'justify-center text-gray-500'
                } hover:bg-gray-100`}
                title={!isExpanded ? 'Каталог' : ''}
              >
                <Layers size={20} />
                {isExpanded && (
                  <>
                    <span>Каталог</span>
                    <span className="ml-auto">{catalogOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
                  </>
                )}
              </button>

              {catalogOpen && (
                <div className={`space-y-1 ${isExpanded ? 'ml-7' : 'px-2'}`}>
                  <NavLink
                    to="products"
                    className={({ isActive }) =>
                      `flex items-center gap-2 py-1 rounded hover:bg-blue-50 text-sm transition-colors ${
                        isActive ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700'
                      } ${!isExpanded ? 'justify-center' : 'px-2'}`
                    }
                    title={!isExpanded ? 'Товары' : ''}
                  >
                    <ShoppingBag size={16} />
                    {isExpanded && <span>Товары</span>}
                  </NavLink>

                  <NavLink
                    to="options"
                    className={({ isActive }) =>
                      `flex items-center gap-2 py-1 rounded hover:bg-blue-50 text-sm transition-colors ${
                        isActive ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700'
                      } ${!isExpanded ? 'justify-center' : 'px-2'}`
                    }
                    title={!isExpanded ? 'Опции' : ''}
                  >
                    <List size={16} />
                    {isExpanded && <span>Опции</span>}
                  </NavLink>

                  <NavLink
                    to="extras"
                    className={({ isActive }) =>
                      `flex items-center gap-2 py-1 rounded hover:bg-blue-50 text-sm transition-colors ${
                        isActive ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700'
                      } ${!isExpanded ? 'justify-center' : 'px-2'}`
                    }
                    title={!isExpanded ? 'Дополнения' : ''}
                  >
                    <PlusCircle size={16} />
                    {isExpanded && <span>Дополнения</span>}
                  </NavLink>
                </div>
              )}
            </div>

            {/* Магазин с вложенными пунктами */}
            <div className="mt-2">
              <button
                onClick={() => setCommerceOpen((prev) => !prev)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded font-semibold transition-colors ${
                  isExpanded ? 'text-gray-500' : 'justify-center text-gray-500'
                } hover:bg-gray-100`}
                title={!isExpanded ? 'Магазин' : ''}
              >
                <ShoppingCart size={20} />
                {isExpanded && (
                  <>
                    <span>Магазин</span>
                    <span className="ml-auto">{commerceOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
                  </>
                )}
              </button>

              {commerceOpen && (
                <div className={`space-y-1 ${isExpanded ? 'ml-7' : 'px-2'}`}>
                  <NavLink
                    to="promocodes"
                    className={({ isActive }) =>
                      `flex items-center gap-2 py-1 rounded hover:bg-blue-50 text-sm transition-colors ${
                        isActive ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700'
                      } ${!isExpanded ? 'justify-center' : 'px-2'}`
                    }
                    title={!isExpanded ? 'Промокоды' : ''}
                  >
                    <Percent size={16} />
                    {isExpanded && <span>Промокоды</span>}
                  </NavLink>

                  <NavLink
                    to="delivery"
                    className={({ isActive }) =>
                      `flex items-center gap-2 py-1 rounded hover:bg-blue-50 text-sm transition-colors ${
                        isActive ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700'
                      } ${!isExpanded ? 'justify-center' : 'px-2'}`
                    }
                    title={!isExpanded ? 'Доставка' : ''}
                  >
                    <Truck size={16} />
                    {isExpanded && <span>Доставка</span>}
                  </NavLink>
                </div>
              )}
            </div>

            <NavLink
              to="reviews"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-50 transition-colors ${
                  isActive ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700'
                } ${!isExpanded ? 'justify-center' : ''}`
              }
              title={!isExpanded ? 'Отзывы' : ''}
            >
              <MessageCircle size={20} />
              {isExpanded && <span>Отзывы</span>}
            </NavLink>

            <NavLink
              to="integrations"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-50 transition-colors ${
                  isActive ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700'
                } ${!isExpanded ? 'justify-center' : ''}`
              }
              title={!isExpanded ? 'Интеграции' : ''}
            >
              <Plug size={20} />
              {isExpanded && <span>Интеграции</span>}
            </NavLink>

            <NavLink
              to="seo"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-50 transition-colors ${
                  isActive ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700'
                } ${!isExpanded ? 'justify-center' : ''}`
              }
              title={!isExpanded ? 'SEO настройки' : ''}
            >
              <Search size={20} />
              {isExpanded && <span>SEO настройки</span>}
            </NavLink>

            <NavLink
              to="general"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-50 transition-colors ${
                  isActive ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700'
                } ${!isExpanded ? 'justify-center' : ''}`
              }
              title={!isExpanded ? 'Общие настройки' : ''}
            >
              <Settings size={20} />
              {isExpanded && <span>Общие настройки</span>}
            </NavLink>
          </nav>
        </div>
      </aside>

      {/* Content */}
      <main className="bg-white rounded-lg shadow flex-1 overflow-y-auto transition-all duration-300 px-4 py-2">
        <Outlet />
      </main>
    </div>
  )
}
