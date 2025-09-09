export function Row({ label, value, className = '' }) {
  return (
    <div className={`flex justify-between items-center text-sm ${className}`}>
      <span className="text-gray-600 font-medium">{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  )
}
