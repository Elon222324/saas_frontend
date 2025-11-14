export function BoardHeaderTablet({ title, icon, siteName, accentColor, borderColor }) {
  return (
    <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 text-center max-w-xl">
      <h2 className="text-3xl font-bold text-white mb-3">{icon} {title}</h2>
      <p className="text-gray-400 text-base mb-5">
        Сайт: <span className={`${accentColor} font-semibold`}>{siteName}</span>
      </p>
      
      <div className={`bg-gray-900 p-6 rounded mb-5 border-l-4 ${borderColor}`}>
        <p className="text-gray-300 text-center mb-3 text-sm">
          🚀 Здесь вскоре будут отображаться заказы в реальном времени
        </p>
        <p className="text-gray-500 text-xs">
          Заказы будут обновляться автоматически каждые несколько секунд
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-gray-800 p-3 rounded">
          <p className="text-xl font-bold text-orange-400">0</p>
          <p className="text-gray-400 text-xs">Новые</p>
        </div>
        <div className="bg-gray-800 p-3 rounded">
          <p className="text-xl font-bold text-blue-400">0</p>
          <p className="text-gray-400 text-xs">Готовят</p>
        </div>
        <div className="bg-gray-800 p-3 rounded">
          <p className="text-xl font-bold text-green-400">0</p>
          <p className="text-gray-400 text-xs">Отправка</p>
        </div>
      </div>
    </div>
  )
}

