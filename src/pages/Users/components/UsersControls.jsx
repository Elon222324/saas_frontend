import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { baseDomain, stripAppSuffix } from '../utils/domain'

export default function UsersControls({
  sites,
  selectedSite,
  setSelectedSite,
  query,
  setQuery,
  limit,
  setLimit,
  offset,
  setOffset,
  loadingSites,
  onSearch,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col lg:flex-row gap-6 lg:items-end">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-2">Выберите сайт</label>
          <select
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-3 min-w-[260px] bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            disabled={loadingSites || (sites?.length || 0) === 0}
          >
            {(sites || []).map((s) => {
              const domainNoSuffix = stripAppSuffix(s.domain)
              const label = `${domainNoSuffix}.${baseDomain}`
              return (
                <option key={s.id || s.domain} value={domainNoSuffix}>
                  {label}
                </option>
              )
            })}
          </select>
        </div>

        <div className="flex-1 min-w-[280px]">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Поиск клиентов</label>
          <div className="relative">
            <Input
              placeholder="Имя, телефон или email"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') onSearch() }}
              className="pl-11"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">Лимит</label>
            <Input
              type="number"
              min={1}
              max={1000}
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value) || 50)}
              className="w-24"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">Смещение</label>
            <Input
              type="number"
              min={0}
              value={offset}
              onChange={(e) => setOffset(Number(e.target.value) || 0)}
              className="w-24"
            />
          </div>

          <Button 
            onClick={onSearch} 
            className="flex items-center gap-2 self-end bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Search size={16} />
            Найти
          </Button>
        </div>
      </div>
    </div>
  )
}


