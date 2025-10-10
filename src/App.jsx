import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Sites from './pages/Sites'
import Users from './pages/Users'
import OrdersPage from './pages/Orders'
import AllUsers from './pages/AllUsers'
import AllSites from './pages/AllSites'
import MainLayout from './layouts/MainLayout'
import SiteSettings from './pages/Sites/SiteSettings'
import Pages from './pages/Sites/SiteSettings/PagesTab'
import BlocksEditor from './pages/Sites/SiteSettings/PagesTab/BlocksEditor'
import Products from './pages/Sites/SiteSettings/Catalog/Products'
import Options from './pages/Sites/SiteSettings/Catalog/Options'
import Extras from './pages/Sites/SiteSettings/Catalog/Extras'
import Integrations from './pages/Sites/SiteSettings/Integrations'
import SEOSettings from './pages/Sites/SiteSettings/SEO'
import PromoCodes from './pages/Sites/SiteSettings/Commerce/PromoCodes'
import Delivery from './pages/Sites/SiteSettings/Commerce/Delivery'
import GeneralSettings from './pages/Sites/SiteSettings/GeneralSettings'
import { SiteSettingsProvider } from './context/SiteSettingsContext'
import { UserProvider } from './context/UserContext'

// Owner layout and pages
import OwnerLayout from './layouts/OwnerLayout'
import OwnerPanel from './pages/OwnerPanel'
import OwnerUsers from './pages/OwnerPanel/Users'
import OwnerSites from './pages/OwnerPanel/Sites'
import OwnerTools from './pages/OwnerPanel/Tools'
import LibraryPage from './pages/OwnerPanel/Tools/Library'
import StoragePage from './pages/OwnerPanel/Tools/Storage'
import LogsPage from './pages/OwnerPanel/Tools/Logs'
import TestingPage from './pages/OwnerPanel/Tools/Testing'

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>

          <Route path="/login" element={<Login />} />

          {/* Панель владельца */}
          <Route path="/owner" element={<OwnerLayout />}>
            <Route index element={<OwnerPanel />} />
            <Route path="users" element={<OwnerUsers />} />
            <Route path="sites" element={<OwnerSites />} />

            {/* Обёртка для инструментов с меню */}
            <Route path="tools" element={<OwnerTools />}>
              <Route index element={<LibraryPage />} />
              <Route path="library" element={<LibraryPage />} />
              <Route path="storage" element={<StoragePage />} />
              <Route path="testing" element={<TestingPage />} />
              <Route path="logs" element={<LogsPage />} />
            </Route>
          </Route>

          {/* Основная админка */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="sites" element={<Sites />} />
            <Route path="users" element={<Users />} />
            <Route path="orders" element={<OrdersPage />} />
            
            {/* Super Admin only routes */}
            <Route path="all-users" element={<AllUsers />} />
            <Route path="all-sites" element={<AllSites />} />

          {/* Обёртка для всех настроек сайта */}
          <Route
            path="settings/:domain"
            element={
              <SiteSettingsProvider>
                <SiteSettings />
              </SiteSettingsProvider>
            }
          >
            <Route path="pages" element={<Pages />} />
            <Route path="pages/:slug" element={<BlocksEditor />} />
            <Route path="products" element={<Products />} />
            <Route path="options" element={<Options />} />
            <Route path="extras" element={<Extras />} />
            <Route path="promocodes" element={<PromoCodes />} />
            <Route path="delivery" element={<Delivery />} />
            <Route path="integrations" element={<Integrations />} />
            <Route path="seo" element={<SEOSettings />} />
            <Route path="general" element={<GeneralSettings />} />
          </Route>
        </Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  )
}
