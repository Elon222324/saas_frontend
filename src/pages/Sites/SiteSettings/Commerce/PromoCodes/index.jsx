import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Info } from 'lucide-react'

export default function PromoCodes() {
  const { domain } = useParams()
  const baseDomain = import.meta.env.VITE_BASE_DOMAIN
  const full_domain = `${domain}.${baseDomain}`

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Промокоды: {full_domain}</h1>
        <Link to={`/settings/${domain}/pages`} className="text-blue-600 hover:underline text-sm flex items-center gap-1">
          ← Назад
        </Link>
      </div>

      <div className="flex items-start gap-2 text-gray-600 text-sm">
        <Info size={16} />
        <p>Раздел в разработке. Скоро здесь появится настройка промокодов.</p>
      </div>

      <Button disabled>Добавить промокод</Button>
    </div>
  )
}


