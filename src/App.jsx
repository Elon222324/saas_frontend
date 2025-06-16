// FILE: src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Sites from './pages/Sites'
import Users from './pages/Users'
import MainLayout from './layouts/MainLayout'
import SiteSettings from './pages/Sites/SiteSettings'
import Pages from './pages/Sites/SiteSettings/PagesTab'
import BlocksEditor from './pages/Sites/SiteSettings/PagesTab/BlocksEditor'
import Products from './pages/Sites/SiteSettings/Products'
import Integrations from './pages/Sites/SiteSettings/Integrations'
import GeneralSettings from './pages/Sites/SiteSettings/GeneralSettings'
import { SiteSettingsProvider } from './context/SiteSettingsContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export default function App() {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="sites" element={<Sites />} />
            <Route path="users" element={<Users />} />

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
            <Route path="integrations" element={<Integrations />} />
            <Route path="general" element={<GeneralSettings />} />
          </Route>
        </Route>
      </Routes>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </BrowserRouter>
    </QueryClientProvider>
  )
}