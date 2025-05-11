import { useNavigate, useParams } from 'react-router-dom'
import { Switch } from '../../components/ui/switch'
import { Button } from '@/components/ui/button'
import { Plus, ArrowRight } from 'lucide-react'
import { useSiteSettings } from '@/context/SiteSettingsContext'

export default function Pages() {
  const { domain } = useParams()
  const navigate = useNavigate()
  const { data, loading } = useSiteSettings()

  const pages = data?.pages || []

  if (loading) return <div className="p-6">Загрузка...</div>

  return (
    <div className="space-y-4 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Страницы сайта</h1>
        <Button
          onClick={() => alert('Добавление страницы')}
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md shadow flex items-center gap-2"
        >
          <Plus size={16} />
          Добавить страницу
        </Button>
      </div>

      <div className="space-y-3">
        {pages.map((page) => (
          <div
            key={page.id}
            onClick={() => navigate(`/settings/${domain}/pages/${page.slug}`)}
            className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md hover:bg-gray-50 transition cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div>
                <div className="text-lg font-semibold group-hover:underline">{page.title}</div>
                <div className="text-sm text-gray-500">/{page.slug}</div>
              </div>
              <ArrowRight className="text-gray-400 group-hover:text-blue-500 transition" size={20} />
            </div>

            <div
              className="flex items-center gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              <Switch
                checked={page.is_active}
                onCheckedChange={(value) => {
                  // локально меняем отображение, без запроса
                  const updated = pages.map(p =>
                    p.id === page.id ? { ...p, is_active: value } : p
                  )
                  // просто перерендерим
                  navigate('.', { replace: true }) // костыльно сбрасываем
                }}
              />
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                onClick={() => navigate(`/settings/${domain}/pages/${page.slug}`)}
              >
                Настроить
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
