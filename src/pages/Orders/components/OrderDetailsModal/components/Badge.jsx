export function Badge({ label, colorClass = 'bg-gray-100 text-gray-700', icon }) {
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border ${colorClass}`}>
      {icon && icon}
      {label}
    </span>
  )
}
