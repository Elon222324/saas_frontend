export function BoardHeaderMobile({ title, icon, siteName, accentColor, borderColor }) {
  return (
    <div className="bg-gray-800 p-5 rounded-lg border border-gray-700 text-center mx-2">
      <h2 className="text-2xl font-bold text-white mb-2">{icon} {title}</h2>
      <p className="text-gray-400 text-xs mb-4">
        Сайт: <span className={`${accentColor} font-semibold`}>{siteName}</span>
      </p>
      
      <div className={`bg-gray-900 p-4 rounded mb-4 border-l-4 ${borderColor}`}>
        <p className="text-gray-300 text-center mb-2 text-xs">
          🚀 Заказы в реальном времени
        </p>
        <p className="text-gray-500 text-xs">
          Обновления каждые несколько сек
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-gray-800 p-2 rounded">
          <p className="text-lg font-bold text-orange-400">0</p>
          <p className="text-gray-400 text-xs">Новые</p>
        </div>
        <div className="bg-gray-800 p-2 rounded">
          <p className="text-lg font-bold text-blue-400">0</p>
          <p className="text-gray-400 text-xs">Готовят</p>
        </div>
        <div className="bg-gray-800 p-2 rounded">
          <p className="text-lg font-bold text-green-400">0</p>
          <p className="text-gray-400 text-xs">Отправка</p>
        </div>
      </div>
    </div>
  )
}

