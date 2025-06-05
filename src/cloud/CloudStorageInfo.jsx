export default function CloudStorageInfo({ used, limit }) {
  const percent = Math.min(100, Math.round((used / limit) * 100))

  let color = 'bg-green-500'
  if (percent > 80) color = 'bg-red-500'
  else if (percent > 50) color = 'bg-yellow-500'

  return (
    <div className="space-y-1">
      <p className="text-sm">Использовано {used} MB из {limit} MB</p>
      <div className="w-full h-2 bg-gray-200 rounded">
        <div className={`h-full rounded ${color}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
