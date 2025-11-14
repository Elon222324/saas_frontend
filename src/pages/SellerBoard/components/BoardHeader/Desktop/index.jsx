export function BoardHeaderDesktop({ title, icon, siteName, accentColor, borderColor }) {
  return (
    <div className="bg-gray-800 p-12 rounded-lg border border-gray-700 text-center max-w-2xl">
      <h2 className="text-4xl font-bold text-white mb-4">{icon} {title}</h2>
      <p className="text-gray-400 text-lg mb-6">
        Сайт: <span className={`${accentColor} font-semibold`}>{siteName}</span>
      </p>
      
      <div className={`bg-gray-900 p-8 rounded mb-6 border-l-4 ${borderColor}`}>
        <p className="text-gray-300 text-center mb-4">
          🚀 Здесь вскоре будут отображаться заказы в реальном времени
        </p>
        <p className="text-gray-500 text-sm">
          Заказы будут обновляться автоматически каждые несколько секунд
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-gray-800 p-4 rounded">
          <p className="text-2xl font-bold text-orange-400">0</p>
          <p className="text-gray-400 text-sm">Новые заказы</p>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <p className="text-2xl font-bold text-blue-400">0</p>
          <p className="text-gray-400 text-sm">Готовятся</p>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <p className="text-2xl font-bold text-green-400">0</p>
          <p className="text-gray-400 text-sm">К отправке</p>
        </div>
      </div>
    </div>
  )
}

