import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Sites from './pages/Sites'
import Users from './pages/Users'
import MainLayout from './layouts/MainLayout'
import SiteSettings from '@/pages/SiteSettings'
import Pages from '@/pages/settings/Pages'
import Products from '@/pages/settings/Products'
import Integrations from '@/pages/settings/Integrations'
import GeneralSettings from '@/pages/settings/GeneralSettings'
import PageEditor from './pages/settings/PageEditor'
import { SiteSettingsProvider } from '@/context/SiteSettingsContext'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="sites" element={<Sites />} />
          <Route path="users" element={<Users />} />

          {/* Все настройки сайта обёрнуты в провайдер */}
          <Route path="/settings/:domain" element={
            <SiteSettingsProvider>
              <SiteSettings />
            </SiteSettingsProvider>
          }>
            <Route path="pages" element={<Pages />} />
            <Route path="products" element={<Products />} />
            <Route path="integrations" element={<Integrations />} />
            <Route path="general" element={<GeneralSettings />} />
          </Route>

          {/* Страница редактирования страницы — тоже в провайдере */}
          <Route path="/settings/:domain/pages/:slug" element={
            <SiteSettingsProvider>
              <PageEditor />
            </SiteSettingsProvider>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

