export default function CloudStorageInfo({ files = [], limit = 100 }) {
  const totalUsedBytes = files.reduce((sum, f) => {
    const small = parseInt(f.small_size_bytes) || 0
    const medium = parseInt(f.medium_size_bytes) || 0
    const big = parseInt(f.big_size_bytes) || 0
    return sum + small + medium + big
  }, 0)

  const usedMB = Math.round(totalUsedBytes / (1024 * 1024))
  const percent = Math.min(100, Math.round((usedMB / limit) * 100))

  let color = 'bg-green-500'
  if (percent > 80) color = 'bg-red-500'
  else if (percent > 50) color = 'bg-yellow-500'

  return (
    <div className="space-y-1">
      <p className="text-sm">Использовано {usedMB} MB из {limit} MB</p>
      <div className="w-full h-2 bg-gray-200 rounded">
        <div className={`h-full rounded ${color}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
