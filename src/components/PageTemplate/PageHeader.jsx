import { Button } from '@/components/ui/button'
import { Search, Filter } from 'lucide-react'
import PageHeaderTitle from './PageHeaderTitle'

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
  // Determine if we should show the controls section
  const showControls = Boolean(
    sites || onChangeSite || limit !== undefined || offset !== undefined || onChangeSearch || onSearch
  )

  return (
    <div className="space-y-6">
      <PageHeaderTitle
        title={title}
        subtitle={subtitle}
        icon={IconComponent}
        onRefresh={onSearch}
      />

      {showControls && (
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
              {onChangeSearch && (
                <div className="flex flex-col flex-1 min-w-[280px]">
                  <label className="text-sm font-medium text-gray-700 mb-2">{searchLabel}</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => onChangeSearch(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && onSearch) onSearch() }}
                      className="border border-gray-200 rounded-xl px-4 py-3 pl-12 w-full bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
              )}

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

                {onSearch && (
                  <Button 
                    onClick={onSearch} 
                    className="flex items-center gap-2 self-end bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Search size={16} />
                    Найти
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
