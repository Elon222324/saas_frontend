import { Button } from '@/components/ui/button'
import { RefreshCcw, Search, Filter } from 'lucide-react'

export default function PageHeader({
  title,
  subtitle,
  icon: IconComponent,
  sites,
  selectedSite,
  onChangeSite,
  loadingSites,
  limit,
  onChangeLimit,
  offset,
  onChangeOffset,
  onSearch,
  baseDomain,
  stripAppSuffix,
  searchQuery,
  onChangeSearch,
  searchPlaceholder = "Search...",
  searchLabel = "Search"
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {IconComponent && (
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <IconComponent className="h-8 w-8 text-white" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {title}
            </h1>
            {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onSearch} 
            title="Обновить"
            className="hover:bg-blue-50 hover:border-blue-200 transition-colors"
          >
            <RefreshCcw size={18} />
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:items-end">
          {sites && onChangeSite && (
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Filter size={14} />
                Выберите сайт
              </label>
              <select
                value={selectedSite}
                onChange={(e) => onChangeSite(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-3 min-w-[280px] bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
          )}

          <div className="flex flex-col lg:flex-row gap-4 flex-1">
            <div className="flex flex-col flex-1 min-w-[280px]">
              <label className="text-sm font-medium text-gray-700 mb-2">{searchLabel}</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => onChangeSearch(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') onSearch() }}
                  className="border border-gray-200 rounded-xl px-4 py-3 pl-12 w-full bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            <div className="flex gap-3">
              {limit !== undefined && onChangeLimit && (
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-2">Лимит</label>
                    <input
                      type="number"
                      min={1}
                      max={1000}
                      value={limit}
                      onChange={(e) => onChangeLimit(Number(e.target.value) || 50)}
                      className="border border-gray-200 rounded-xl px-4 py-3 w-24 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
              )}

              {offset !== undefined && onChangeOffset && (
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-2">Смещение</label>
                    <input
                      type="number"
                      min={0}
                      value={offset}
                      onChange={(e) => onChangeOffset(Number(e.target.value) || 0)}
                      className="border border-gray-200 rounded-xl px-4 py-3 w-24 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
              )}

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
      </div>
    </div>
  )
}
