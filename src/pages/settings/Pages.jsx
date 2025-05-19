import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Switch } from '../../components/ui/switch'
import { Button } from '@/components/ui/button'
import { Plus, ArrowRight } from 'lucide-react'
import { Dialog } from '@headlessui/react'
import { useSiteSettings } from '@/context/SiteSettingsContext'

export default function Pages() {
  const { domain } = useParams()
  const navigate = useNavigate()
  const { data, loading, site_name } = useSiteSettings()

  const [pages, setPages] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')

  useEffect(() => {
    if (data?.pages) setPages(data.pages)
  }, [data])

  useEffect(() => {
    const cyrillicToLatinMap = {
      а: 'a', б: 'b', в: 'v', г: 'g', д: 'd',
      е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i',
      й: 'y', к: 'k', л: 'l', м: 'm', н: 'n',
      о: 'o', п: 'p', р: 'r', с: 's', т: 't',
      у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch',
      ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '',
      э: 'e', ю: 'yu', я: 'ya'
    }

    const slugify = (text) => {
      return text
        .toLowerCase()
        .split('')
        .map(char => cyrillicToLatinMap[char] || char)
        .join('')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
    }

    setSlug(slugify(title))
  }, [title])

  const handleAddPage = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/pages/add?site_name=${site_name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      },
      credentials: 'include',
      body: JSON.stringify({
        title,
        slug,
        add_to_navigation: true
      })
    })
    if (res.ok) {
      setIsOpen(false)
      window.location.reload()
    } else {
      alert('Ошибка при добавлении страницы')
    }
  }

  const handleToggleActive = async (slug, value) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/pages/toggle-active?site_name=${site_name}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        },
        credentials: 'include',
        body: JSON.stringify({ slug, value })
      })
      if (!res.ok) throw new Error('Ошибка смены статуса')
    } catch (err) {
      console.error(err)
      alert('Не удалось обновить статус активности страницы')
    }
  }

  if (loading) return <div className="p-6">Загрузка...</div>

  return (
    <div className="space-y-4 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Страницы сайта</h1>
        <Button
          onClick={() => setIsOpen(true)}
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
                  setPages(prev =>
                    prev.map(p =>
                      p.id === page.id ? { ...p, is_active: value } : p
                    )
                  )
                  handleToggleActive(page.slug, value)
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

      {isOpen && (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded p-6 w-96 space-y-4 shadow-lg">
            <h2 className="text-lg font-bold">Добавить страницу</h2>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Название (на русском)</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="border px-3 py-2 rounded w-full"
              />
              <p className="text-sm text-gray-500">Slug: <code>{slug}</code></p>
            </div>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setIsOpen(false)} className="bg-gray-300">Отмена</Button>
              <Button onClick={handleAddPage} className="bg-blue-600 text-white">Добавить</Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  )
}
