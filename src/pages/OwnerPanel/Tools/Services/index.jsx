import { useState } from 'react'
import { RefreshCw, Globe, Layout, Zap, AlertTriangle, BookOpen } from 'lucide-react'
import ServiceCard from './components/ServiceCard'
import { serviceApi } from './api/services'

export default function ServicesPage() {
  const [loadingService, setLoadingService] = useState(null)
  const [showWarning, setShowWarning] = useState(false)

  const handleServiceUpdate = async (serviceName, updateFn) => {
    setLoadingService(serviceName)
    try {
      await updateFn()
    } finally {
      setLoadingService(null)
    }
  }

  const services = [
    {
      id: 'saas-web',
      title: 'SAAS WEB',
      description: 'Обновляет образ и перезапускает контейнер saas_web',
      icon: Globe,
      updateFn: () => serviceApi.updateSaasWeb(),
    },
    {
      id: 'frontend',
      title: 'Frontend (site-ISR)',
      description: 'Обновляет образ и пересоздает фронтовый site-ISR контейнер',
      icon: Layout,
      updateFn: () => serviceApi.updateFrontend(),
    },
    {
      id: 'site-template',
      title: 'Site Template (site-api)',
      description: 'Обновляет шаблонный образ site-api и перезапускает все сайты',
      icon: RefreshCw,
      updateFn: () => serviceApi.updateSiteTemplate(),
    },
    {
      id: 'self-update',
      title: 'Self Update',
      description: 'Загружает новый образ docker-update и устанавливает флаг на обновление',
      icon: Zap,
      updateFn: () => serviceApi.selfUpdate(),
    },
    {
      id: 'library-import',
      title: 'Library Import',
      description: 'Инициализирует библиотеку и импортирует шаблоны',
      icon: BookOpen,
      updateFn: () => serviceApi.initLibrary(),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Обновление сервисов</h1>
        <p className="text-gray-600 mt-2">
          Управляйте обновлением Docker образов и перезапуском сервисов
        </p>
      </div>

      {/* Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle size={20} className="text-yellow-700 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-yellow-900">Важно</h3>
          <p className="text-sm text-yellow-800 mt-1">
            Обновления могут привести к временному прерыванию работы сервисов. Рекомендуется проводить обновления в нерабочее время.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            title={service.title}
            description={service.description}
            icon={service.icon}
            onUpdate={() => handleServiceUpdate(service.id, service.updateFn)}
            isLoading={loadingService === service.id}
          />
        ))}
      </div>

      {/* Info section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Что происходит при обновлении:</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Для SAAS WEB: скачивается новый образ и контейнер перезапускается</li>
          <li>Для Frontend: скачивается новый образ и site-ISR контейнер пересоздается</li>
          <li>Для Site Template: обновляется site-api и все активные сайты перезапускаются</li>
          <li>Для Self Update: подготавливается обновление самого контейнера администрирования</li>
        </ul>
      </div>
    </div>
  )
}

