import PageLayout from '@/components/PageTemplate/PageLayout'
import PageHeaderTitle from '@/components/PageTemplate/PageHeaderTitle'
import { BarChart3 } from 'lucide-react'

export default function Dashboard() {
  return (
    <PageLayout
      backgroundGradient="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
      containerClass="p-6 space-y-6 max-w-7xl mx-auto"
      gridHeight="auto"
      header={
        <PageHeaderTitle
          title="Dashboard"
          subtitle="Обзор ключевых метрик и статистики"
          icon={BarChart3}
        />
      }
      content={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Placeholder cards for future metrics */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="text-gray-500 text-sm font-medium mb-2">Всего заказов</div>
            <div className="text-3xl font-bold text-gray-900">0</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="text-gray-500 text-sm font-medium mb-2">Всего клиентов</div>
            <div className="text-3xl font-bold text-gray-900">0</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="text-gray-500 text-sm font-medium mb-2">Активных сайтов</div>
            <div className="text-3xl font-bold text-gray-900">0</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="text-gray-500 text-sm font-medium mb-2">Доход</div>
            <div className="text-3xl font-bold text-gray-900">$0</div>
          </div>
        </div>
      }
    />
  )
}